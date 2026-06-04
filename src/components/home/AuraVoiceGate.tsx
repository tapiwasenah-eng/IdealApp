import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuraVoice } from '../../lib/hooks/useAuraVoice';

interface AuraVoiceGateProps {
  onComplete: (transcript: string) => void;
  onClose: () => void;
}

export function AuraVoiceGate({ onComplete, onClose }: AuraVoiceGateProps) {
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    isRecording,
    isInitializing,
    toggleRecording,
    stopRecording
  } = useAuraVoice({
    onTranscriptChunk: (chunk: string, isFinal: boolean) => {
      if (isFinal) {
        setTranscript(prev => prev + ' ' + chunk);
      } else {
        // If we want real-time partial, we could hold it in another state variable and display it,
        // but for now appending final chunks or replacing is fine.
        // Usually, AssemblyAI sends PartialTranscripts which we might want to display dynamically.
        // A simple approach is appending final or maintaining the ongoing transcription.
      }
    },
    onError: (error) => {
      console.error('Aura Voice Error:', error);
      // In a real app, handle error UI state here
    }
  });

  const handleGenerate = async () => {
    setIsProcessing(true);
    // Add real API logic here, but for now simulate delay
    await new Promise(r => setTimeout(r, 2000));
    onComplete(transcript);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/40 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8 relative overflow-hidden"
      >
        <button 
          onClick={() => {
            stopRecording();
            onClose();
          }}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors z-20"
        >
          ✕
        </button>

        {/* The glowing orb */}
        <div className="flex justify-center mb-10 relative mt-4">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {isRecording && (
              <>
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl"
                />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                  className="absolute inset-0 bg-purple-500 rounded-full blur-xl"
                />
              </>
            )}
            {!isRecording && (
              <div className="absolute inset-0 bg-slate-200 rounded-full blur-xl opacity-50" />
            )}
            
            <button
              onClick={toggleRecording}
              disabled={isInitializing}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-colors border ${
                isRecording 
                  ? 'bg-red-500 text-white border-red-400 hover:bg-red-600' 
                  : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50'
              } ${isInitializing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isInitializing ? (
                <Loader2 className="animate-spin text-slate-500" size={24} />
              ) : isRecording ? (
                <Square fill="currentColor" size={24} />
              ) : (
                <Mic size={28} />
              )}
            </button>
          </div>
        </div>

        {/* Status Text */}
        <div className="text-center mb-8 relative z-10">
          <h3 className="text-2xl font-semibold text-slate-800 mb-2">
            {isInitializing ? "Connecting to Aura..." : isRecording ? "Listening to your vision..." : transcript.length > 0 ? "Review your input" : "What are you building?"}
          </h3>
          <p className="text-slate-500">
            {isRecording ? "Speak naturally. We'll structure it perfectly." : "Tap the mic to start organizing your thoughts."}
          </p>
        </div>

        {/* Living Canvas / Transcript */}
        <div 
          ref={scrollRef}
          className="bg-white/40 border border-white/60 rounded-2xl p-6 min-h-[160px] max-h-[240px] overflow-y-auto mb-8 relative z-10 shadow-inner"
        >
          <AnimatePresence>
            {!transcript && !isRecording && !isInitializing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-slate-400 flex flex-col items-center justify-center h-full gap-3 opacity-50"
              >
                <Sparkles size={24} />
                <p>Voice-led formatting starts here.</p>
              </motion.div>
            )}
            {(transcript || isRecording) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg leading-relaxed text-slate-700 font-medium whitespace-pre-wrap"
              >
                {transcript}
                {isRecording && (
                  <motion.span 
                    animate={{ opacity: [1, 0, 1] }} 
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-2 h-5 bg-indigo-500 ml-1 translate-y-1 rounded-sm"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <div className="flex justify-end relative z-10">
          <button
            onClick={handleGenerate}
            disabled={transcript.length === 0 || isProcessing || isRecording || isInitializing}
            className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Audio...
              </>
            ) : (
              <>
                Generate Deck <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
