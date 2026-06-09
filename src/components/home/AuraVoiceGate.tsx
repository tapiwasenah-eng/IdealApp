import React, { useState, useEffect } from "react";
import { AuraOrb, AIState } from "../aura/AuraOrb";
import { useAuraVoice } from "../../lib/hooks/useAuraVoice";
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';

export function AuraVoiceGate({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [aiState, setAiState] = useState<AIState>("listening");
  const [transcript, setTranscript] = useState('');
  
  const { status, lastError: error, reconnect: start, disconnect: stop } = useAuraVoice({
    url: import.meta.env.VITE_AURA_VOICE_URL || 'wss://echo.websocket.events'
  });
  
  const ready = status !== 'error';
  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
       setAiState("thinking");
    } else if (status === "streaming") {
       setAiState("listening");
    } else {
       setAiState("listening");
    }
  }, [error, status]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a1118]/95 backdrop-blur-3xl overflow-hidden"
      >
        {/* Background: ONLY the Aura orb (no extra particles, no extra canvas) */}
        <AuraOrb aiState={aiState} />
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-white/50 hover:text-white z-50 transition-colors"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        {/* Foreground UI */}
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 w-full pt-10">
          <div className="mb-4 text-xs uppercase tracking-[0.35em] text-slate-400">
            Aura AI · Voice Onboarding
          </div>

          <h1 className="text-center text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-3 text-white">
            Talk through your company.
          </h1>

          <div className="text-xs text-slate-400 h-8 text-center mb-6 mt-4">
             {status === 'connecting' ? 'Connecting to Aura…' : status === 'streaming' ? 'Aura is listening. Start talking about your company.' : error || ''}
          </div>

          {/* Example mic controls */}
          <div className="mt-4 flex flex-col items-center gap-6 text-xs w-full">
            <div className="flex items-center gap-3 justify-center text-slate-400 h-10">
              {status !== 'streaming' && status !== 'connecting' ? (
                <button
                  type="button"
                  onClick={start}
                  className="px-5 py-2.5 rounded-full bg-electric-violet/80 text-white uppercase tracking-[0.18em] hover:bg-electric-violet transition shadow-[0_0_20px_rgba(112,0,255,0.3)]"
                >
                  Start Mic
                </button>
              ) : status === 'connecting' ? (
                <button
                  disabled
                  className="px-5 py-2.5 rounded-full bg-white/10 text-white/50 uppercase tracking-[0.18em] cursor-not-allowed"
                >
                  Loading...
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stop}
                  className="px-5 py-2.5 rounded-full border border-white/20 text-white uppercase tracking-[0.18em] hover:bg-white/10 transition"
                >
                  Stop Mic
                </button>
              )}
            </div>

            {transcript && (
              <div className="w-full max-w-md bg-white/5 border border-white/10 p-4 rounded-xl min-h-24 max-h-48 overflow-y-auto text-sm text-slate-300 shadow-inner mt-4">
                {transcript}
              </div>
            )}
            
            <button
              className="mt-6 px-8 py-3 rounded-full bg-white text-[#0A0D14] font-semibold text-sm hover:scale-105 transition-all flex items-center gap-2"
              onClick={() => {
                  stop();
                  navigate('/app');
              }}
            >
              Generate Workspace
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
