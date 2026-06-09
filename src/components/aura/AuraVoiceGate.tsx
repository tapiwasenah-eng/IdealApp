import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/appStore';
import { X } from 'lucide-react';
import { AuraOrb, AIState } from './AuraOrb';
import { useAuraVoice } from '../../lib/hooks/useAuraVoice';

export function AuraVoiceGate() {
  const isOpen = useAppStore(state => state.overlays.auraVoiceOpen);
  const setOpen = useAppStore(state => state.setAuraVoiceOpen);
  const setOnboardingTranscript = useAppStore(state => state.setOnboardingTranscript);
  const navigate = useNavigate();

  const [transcript, setTranscript] = useState('');
  
  const { status, lastError: error, reconnect: start, disconnect: stop } = useAuraVoice({
    url: import.meta.env.VITE_AURA_VOICE_URL || 'wss://echo.websocket.events'
  });

  const ready = status !== 'error';

  useEffect(() => {
    if (isOpen) {
      start();
    } else {
      stop();
      setTranscript('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerate = () => {
    if (status === "streaming" || status === "connecting") {
      stop();
    }
    if (transcript.trim()) {
      setOnboardingTranscript(transcript.trim());
    }
    setOpen(false);
    navigate('/app');
  };

  let aiState: AIState = "listening";
  if (status === "idle") aiState = "listening";
  if (status === "connecting" || status === "streaming") aiState = "thinking"; // map to thinking for now just to show it's active
  if (status === "error") aiState = "listening"; // default to safe state

  let statusText = "";
  if (status === "connecting") statusText = "Connecting to Aura…";
  if (status === "streaming") statusText = "Aura is listening. Start talking about your company.";
  if (status === "error") statusText = error || "Error connecting.";

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/95 text-slate-100 overflow-hidden">
      <div className="absolute inset-0">
        <AuraOrb aiState={aiState} />
      </div>

      <button 
        onClick={() => setOpen(false)}
        className="absolute top-8 right-8 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors z-50"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative z-20 flex flex-col items-center justify-center w-full px-6 max-w-lg">
        <span className="text-xs font-semibold tracking-[0.35em] text-slate-400 mb-6 uppercase">AURA AI · VOICE ONBOARDING</span>
        <h1 className="text-4xl md:text-5xl font-serif mb-12 text-center text-white">Talk through your company.</h1>

        <div className="flex gap-4 mb-4 text-xs h-10">
          {status !== 'streaming' && status !== 'connecting' ? (
            <button 
              onClick={start}
              className="px-5 py-2.5 rounded-full bg-electric-violet/80 hover:bg-electric-violet text-white uppercase tracking-[0.18em] transition-colors shadow-[0_0_20px_rgba(112,0,255,0.3)]"
            >
              Start Mic
            </button>
          ) : status === 'connecting' ? (
            <button 
              disabled
              className="px-5 py-2.5 rounded-full bg-white/10 text-white/50 uppercase tracking-[0.18em] flex items-center justify-center gap-2 cursor-not-allowed"
            >
               Loading...
            </button>
          ) : (
            <button 
              onClick={stop}
              className="px-5 py-2.5 rounded-full border border-white/20 text-white hover:bg-white/10 uppercase tracking-[0.18em] transition-colors"
            >
              Stop Mic
            </button>
          )}
        </div>

        <div className="text-xs text-slate-400 h-8 text-center mb-6">
          {statusText}
        </div>
        
        {transcript && (
          <div className="w-full max-w-md bg-white/5 border border-white/10 p-4 rounded-xl mb-8 min-h-24 max-h-48 overflow-y-auto text-sm text-slate-300 shadow-inner">
            {transcript}
          </div>
        )}

        <button 
          onClick={handleGenerate}
          className="px-8 py-3.5 w-full max-w-xs rounded-full bg-white text-slate-900 font-semibold hover:bg-slate-200 hover:scale-105 transition-all text-sm flex items-center justify-center gap-2"
        >
          Generate Workspace
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </div>
    </div>
  );
}
