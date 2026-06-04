import { useState, useRef, useCallback, useEffect } from 'react';
import RecordRTC from 'recordrtc';
import { auth } from '../firebase'; // Assuming there's a firebase export with auth. Need to make sure token can be passed

export interface UseAuraVoiceOptions {
  onTranscriptChunk: (transcript: string, isFinal: boolean) => void;
  onError: (error: Error) => void;
}

export function useAuraVoice({ onTranscriptChunk, onError }: UseAuraVoiceOptions) {
  const [isRecording, setIsRecording] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  
  const socketRef = useRef<WebSocket | null>(null);
  const recorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const connectAndRecord = useCallback(async () => {
    try {
      setIsInitializing(true);
      
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      
      const idToken = await user.getIdToken();
      // Fetch temporary token from our backend
      const tokenRes = await fetch('/api/aura-token', {
        headers: {
          'Authorization': `Bearer ${idToken}`
        }
      });
      
      if (!tokenRes.ok) {
        throw new Error('Failed to mint Aura token.');
      }
      const tokenData = await tokenRes.json();
      const assemblyToken = tokenData.token;
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Establish WebSocket
      const wsUrl = `wss://streaming.assemblyai.com/v3/ws?sample_rate=16000&speech_model=u3-rt-pro&token=${assemblyToken}`;
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;
      
      socket.onopen = () => {
        setIsRecording(true);
        setIsInitializing(false);
        
        // Start recording and sending data
        const recorder = new RecordRTC(stream, {
          type: 'audio',
          mimeType: 'audio/webm;codecs=pcm',
          recorderType: RecordRTC.StereoAudioRecorder,
          timeSlice: 250,
          desiredSampRate: 16000,
          numberOfAudioChannels: 1,
          bufferSize: 4096,
          ondataavailable: (blob: Blob) => {
            if (socket.readyState === WebSocket.OPEN) {
              const reader = new FileReader();
              reader.onload = () => {
                const base64data = (reader.result as string).split(',')[1];
                socket.send(JSON.stringify({ audio_data: base64data }));
              };
              reader.readAsDataURL(blob);
            }
          }
        });
        
        recorder.startRecording();
        recorderRef.current = recorder;
      };
      
      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.message_type === 'PartialTranscript' || message.message_type === 'FinalTranscript') {
          onTranscriptChunk(message.text, message.message_type === 'FinalTranscript');
        } else if (message.type === 'Turn') {
          // Additional handling if Turn messages are specified
          if (message.transcript) {
            onTranscriptChunk(message.transcript, message.end_of_turn);
          }
        }
      };
      
      socket.onerror = (error) => {
        console.error('WebSocket Error:', error);
        onError(new Error('WebSocket connection error'));
        stopRecording();
      };
      
      socket.onclose = () => {
        stopRecording();
      };
      
    } catch (error: any) {
      setIsInitializing(false);
      setIsRecording(false);
      onError(error);
    }
  }, [onTranscriptChunk, onError]);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        recorderRef.current?.destroy();
        recorderRef.current = null;
      });
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ terminate_session: true, type: 'Terminate' }));
      socketRef.current.close();
    }
    socketRef.current = null;
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      connectAndRecord();
    }
  }, [isRecording, connectAndRecord, stopRecording]);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, [stopRecording]);

  return {
    isRecording,
    isInitializing,
    toggleRecording,
    stopRecording
  };
}
