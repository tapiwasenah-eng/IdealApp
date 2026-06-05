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
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-xl">
      {/* Floating Particles Mock */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
         <div className="absolute top-[20%] left-[30%] w-2 h-2 bg-indigo-400 rounded-full animate-pulse opacity-50 blur-[1px]"></div>
         <div className="absolute top-[60%] left-[70%] w-3 h-3 bg-purple-400 rounded-full animate-pulse blur-[2px]"></div>
         <div className="absolute top-[80%] left-[20%] w-1.5 h-1.5 bg-indigo-500 rounded-full animate-[pulse_3s_ease-in-out_infinite]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 shadow-[0_0_80px_rgba(79,70,229,0.15)] rounded-3xl p-8 relative overflow-hidden"
      >
        <button 
          onClick={() => {
            stopRecording();
            onClose();
          }}
          className="absolute top-6 right-6 text-slate-500 hover:text-slate-300 transition-colors z-20"
        >
          ✕
        </button>

        {/* The glowing orb */}
        <div className="flex justify-center mb-10 relative mt-4">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-[40px] animate-pulse pointer-events-none" />
            <div className="absolute inset-4 bg-purple-500/20 rounded-full blur-[30px] animate-pulse pointer-events-none delay-150" />
            
            {isRecording && (
              <>
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute inset-0 bg-indigo-500/40 rounded-full blur-2xl pointer-events-none"
                />
              </>
            )}
            
            <button
              onClick={toggleRecording}
              disabled={isInitializing}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all border border-white/10 ${
                isRecording 
                  ? 'bg-red-500/90 text-white shadow-red-500/40' 
                  : 'bg-indigo-600 text-white shadow-indigo-600/40 hover:bg-indigo-500 hover:scale-105'
              } ${isInitializing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isInitializing ? (
                <Loader2 className="animate-spin text-white" size={24} />
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
          <h3 className="text-2xl font-medium text-white mb-2 tracking-tight">
            {isInitializing ? "Initializing Aura..." : isRecording ? "Structuring problem slide... Mapping TAM data..." : transcript.length > 0 ? "Review your input" : "What are you building?"}
          </h3>
          <p className="text-indigo-200/60 font-mono text-sm max-w-sm mx-auto">
            {isRecording ? "Live transcription active. Speak naturally." : "Tap the orb to start capturing context."}
          </p>
        </div>

        {/* Living Canvas / Transcript */}
        <div 
          ref={scrollRef}
          className="bg-black/40 border border-white/5 rounded-2xl p-6 min-h-[160px] max-h-[240px] overflow-y-auto mb-8 relative z-10 font-mono text-sm shadow-inner shadow-black/50"
        >
          <AnimatePresence>
            {!transcript && !isRecording && !isInitializing && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-slate-600 flex flex-col items-center justify-center h-full gap-3 opacity-50"
              >
                <Sparkles size={24} />
                <p>Aura Voice-led formatting starts here.</p>
              </motion.div>
            )}
            {(transcript || isRecording) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="leading-relaxed text-indigo-100 whitespace-pre-wrap"
              >
                {transcript}
                {isRecording && (
                  <motion.span 
                    animate={{ opacity: [1, 0, 1] }} 
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="inline-block w-2 h-4 bg-indigo-400 ml-1 rounded-sm align-middle"
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
            className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-indigo-500/25 hover:bg-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Drafting Deck...
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
