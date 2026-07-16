import { useState, useRef, useCallback, useEffect } from 'react';
import { useVoiceGateway } from './useVoiceGateway.js';
import { useConversationStore } from './useConversationStore.js';
import { useAudioPlayer } from './useAudioPlayer.js';
import { hydrateFlags } from '../lib/featureFlags.js';

const GREETING = "Hello! I'm Aura, Edit Aura's AI Business Consultant. I can help you with our services, pricing, or schedule a strategy call. What can I help you with today?";

/**
 * useVoiceSession — master hook orchestrating the complete voice conversation.
 * Wires: Gateway ↔ Store ↔ STT ↔ Audio ↔ Session lifecycle.
 */
export function useVoiceSession() {
  const { state, dispatch, loadSaved, restore, clearSaved } = useConversationStore();
  const [micGranted, setMicGranted] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [hasSavedSession, setHasSavedSession] = useState(false);
  const [savedSession, setSavedSession] = useState(null);

  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  const sessionIdRef = useRef(null);

  sessionIdRef.current = state.sessionId;

  // ── Audio Player ───────────────────────────────────────────────────────────
  const { addChunk, speakFallback, stop: stopAudio, isPlaying, getAnalyser } = useAudioPlayer({
    onPlayStart: () => dispatch({ type: 'SET_STATUS', status: 'speaking' }),
    onPlayEnd: () => {
      dispatch({ type: 'SET_STATUS', status: 'listening' });
      startSTT();
    },
  });

  // ── WebSocket Message Router ───────────────────────────────────────────────
  const handleGatewayMessage = useCallback((msg) => {
    switch (msg.type) {
      case 'connected': break;
      case 'thinking':
        dispatch({ type: 'SET_TYPING', value: true });
        dispatch({ type: 'SET_STATUS', status: 'processing' });
        break;
      case 'reply_text':
        dispatch({ type: 'SET_TYPING', value: false });
        dispatch({ type: 'ADD_MESSAGE', message: { role: 'assistant', content: msg.text, timestamp: Date.now() } });
        break;
      case 'audio_chunk':
        addChunk(msg.data);
        break;
      case 'audio_done':
        break;
      case 'tts_fallback':
        dispatch({ type: 'SET_STATUS', status: 'speaking' });
        speakFallback(msg.text);
        break;
      case 'intent_update':
        dispatch({ type: 'SET_INTENT', intent: msg.intent });
        break;
      case 'lead_update':
        dispatch({ type: 'UPDATE_LEAD', field: msg.field, value: msg.value, confidence: msg.confidence });
        break;
      case 'goal_update':
        dispatch({ type: 'SET_GOAL', completionPct: msg.completionPct });
        break;
      case 'cost_update':
        dispatch({ type: 'SET_COSTS', costs: { deepgram: msg.deepgram, gemini: msg.gemini, elevenlabs: msg.elevenlabs, total: msg.total } });
        break;
      case 'booking_trigger':
        dispatch({ type: 'BOOKING_TRIGGER' });
        break;
      case 'handoff_trigger':
        dispatch({ type: 'HANDOFF_TRIGGER' });
        break;
      case 'session_ended':
        endSession();
        break;
      case 'error':
        dispatch({ type: 'SET_STATUS', status: 'idle' });
        dispatch({ type: 'ADD_MESSAGE', message: { role: 'assistant', content: msg.message ?? 'Something went wrong.', timestamp: Date.now(), isError: true } });
        break;
    }
  }, [addChunk, speakFallback]);

  const { connect, disconnect, send, isConnected } = useVoiceGateway({
    onMessage: handleGatewayMessage,
    onOpen: () => { /* Connected */ },
    onClose: () => { if (state.status !== 'ended') dispatch({ type: 'SET_STATUS', status: 'idle' }); },
    onError: () => dispatch({ type: 'SET_STATUS', status: 'error' }),
  });

  // ── STT (Web Speech API — Phase 0 fallback) ────────────────────────────────
  const startSTT = useCallback(() => {
    if (!micGranted || state.status === 'speaking' || state.status === 'ended') return;

    const SpeechRecognition = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      const transcript = result[0].transcript.trim();
      if (!transcript) return;

      if (result.isFinal && transcript.length >= 2) {
        dispatch({ type: 'SET_STATUS', status: 'processing' });
        dispatch({ type: 'ADD_MESSAGE', message: { role: 'user', content: transcript, timestamp: Date.now() } });
        sendMessage(transcript);
      }
    };

    recognition.onend = () => {
      if (state.status === 'listening') {
        // Auto-restart when listening
        setTimeout(() => startSTT(), 300);
      }
    };

    recognition.onerror = (e) => {
      if (e.error === 'no-speech') { setTimeout(() => startSTT(), 500); return; }
      if (e.error === 'aborted') return;
    };

    dispatch({ type: 'SET_STATUS', status: 'listening' });
    recognition.start();
  }, [micGranted, state.status]);

  const stopSTT = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current?.abort();
    recognitionRef.current = null;
  }, []);

  // ── Send Message via WebSocket ─────────────────────────────────────────────
  const sendMessage = useCallback((text) => {
    if (!sessionIdRef.current) return;
    send({ type: 'text_message', sessionId: sessionIdRef.current, text });
  }, [send]);

  // ── Session Timer ──────────────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    setElapsedSeconds(0);
    timerRef.current = setInterval(() => {
      setElapsedSeconds(s => s + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current);
  }, []);

  // ── Check for saved session on mount ─────────────────────────────────────
  useEffect(() => {
    const saved = loadSaved();
    if (saved?.sessionId) {
      setSavedSession(saved);
      setHasSavedSession(true);
    }
  }, []);

  // ── Start Conversation ─────────────────────────────────────────────────────
  const startConversation = useCallback(async () => {
    dispatch({ type: 'SET_STATUS', status: 'requesting_mic' });

    // Request microphone permission
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicGranted(true);
    } catch {
      dispatch({ type: 'SET_STATUS', status: 'error' });
      dispatch({ type: 'ADD_MESSAGE', message: { role: 'assistant', content: "Microphone access is required for voice conversation. You can also type your questions.", timestamp: Date.now() } });
      setMicGranted(false);
      // Continue in text-only mode
    }

    // Create session on server
    try {
      const res = await fetch('/api/voice/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          referrer: document.referrer,
        }),
      });
      const data = await res.json();

      dispatch({ type: 'SET_SESSION', sessionId: data.sessionId, featureFlags: data.featureFlags });
      hydrateFlags(data.featureFlags);

      // Connect WebSocket
      connect();

      // Show greeting
      const greeting = data.greeting ?? GREETING;
      dispatch({ type: 'ADD_MESSAGE', message: { role: 'assistant', content: greeting, timestamp: Date.now(), isGreeting: true } });

      // Speak greeting
      setTimeout(() => {
        dispatch({ type: 'SET_STATUS', status: 'speaking' });
        speakFallback(greeting);
      }, 500);

      startTimer();
    } catch (err) {
      dispatch({ type: 'SET_STATUS', status: 'error' });
    }
  }, [connect, speakFallback, startTimer]);

  // ── Resume saved session ───────────────────────────────────────────────────
  const resumeSession = useCallback(async () => {
    if (!savedSession) return;
    restore(savedSession);
    setHasSavedSession(false);
    connect();
    startTimer();
    dispatch({ type: 'SET_STATUS', status: 'listening' });
  }, [savedSession, restore, connect, startTimer]);

  const discardSaved = useCallback(() => {
    clearSaved();
    setHasSavedSession(false);
    setSavedSession(null);
  }, [clearSaved]);

  // ── End Conversation ───────────────────────────────────────────────────────
  const endSession = useCallback(async () => {
    stopSTT();
    stopAudio();
    stopTimer();
    disconnect();

    const sessionId = sessionIdRef.current;
    if (!sessionId) {
      dispatch({ type: 'SET_STATUS', status: 'ended' });
      return;
    }

    try {
      const res = await fetch('/api/voice/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });
      const data = await res.json();
      if (data.success && data.summary) {
        dispatch({ type: 'SET_SUMMARY', summary: data.summary });
      }
    } catch {
      dispatch({ type: 'SET_STATUS', status: 'ended' });
    }

    clearSaved();
  }, [stopSTT, stopAudio, stopTimer, disconnect, clearSaved]);

  // ── Keyboard Shortcuts ─────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      // Only activate when voice section is in view
      if (!state.sessionId) return;
      if (e.code === 'Space' && e.target.tagName === 'BODY') {
        e.preventDefault();
        if (state.status === 'listening') stopSTT();
        else if (state.status === 'idle' || state.status === 'speaking') startSTT();
      }
      if (e.code === 'Escape') {
        if (state.status !== 'idle' && state.status !== 'ended') endSession();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state.sessionId, state.status, startSTT, stopSTT, endSession]);

  return {
    state,
    dispatch,
    startConversation,
    endSession,
    resumeSession,
    discardSaved,
    hasSavedSession,
    sendMessage,
    startSTT,
    stopSTT,
    elapsedSeconds,
    isPlaying,
    getAnalyser,
    micGranted,
    isConnected,
  };
}
