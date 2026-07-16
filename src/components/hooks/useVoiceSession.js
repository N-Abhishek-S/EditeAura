import { useState, useRef, useCallback, useEffect } from 'react';
import { useConversationStore } from './useConversationStore.js';
import { useAudioPlayer } from './useAudioPlayer.js';
import { hydrateFlags } from '../lib/featureFlags.js';

const GREETING = "Hello! I'm Aura, Edit Aura's AI Business Consultant. I can help you with our services, pricing, or schedule a strategy call. What can I help you with today?";

/**
 * useVoiceSession — orchestrates the complete voice conversation.
 * Uses REST (/api/voice/message) — works on both Vercel and local.
 * WebSocket upgrade available for self-hosted servers.
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
  const isSendingRef = useRef(false); // Prevent duplicate sends

  sessionIdRef.current = state.sessionId;

  // ── Audio Player ─────────────────────────────────────────────────────────
  const { addChunk, speakFallback, stop: stopAudio, isPlaying, getAnalyser } = useAudioPlayer({
    onPlayStart: () => dispatch({ type: 'SET_STATUS', status: 'speaking' }),
    onPlayEnd: () => {
      dispatch({ type: 'SET_STATUS', status: 'listening' });
      startSTT();
    },
  });

  // ── REST Message Sender ──────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    if (!sessionIdRef.current || isSendingRef.current) return;
    isSendingRef.current = true;

    dispatch({ type: 'SET_TYPING', value: true });
    dispatch({ type: 'SET_STATUS', status: 'processing' });

    try {
      const res = await fetch('/api/voice/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          text,
          // Send last 10 messages for context (stateless server needs history)
          messages: state.messages.slice(-10),
          leadProfile: state.leadProfile,
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Add AI reply to transcript
      if (data.reply) {
        dispatch({ type: 'SET_TYPING', value: false });
        dispatch({ type: 'ADD_MESSAGE', message: { role: 'assistant', content: data.reply, timestamp: Date.now() } });
      }

      // Update lead profile
      if (data.leadUpdates && Object.keys(data.leadUpdates).length > 0) {
        Object.entries(data.leadUpdates).forEach(([field, value]) => {
          dispatch({ type: 'UPDATE_LEAD', field, value, confidence: 0.85 });
        });
      }

      // Sync services from updatedLead
      if (data.updatedLead?.services?.length) {
        data.updatedLead.services.forEach(s => {
          if (!state.leadProfile.services?.includes(s)) {
            dispatch({ type: 'UPDATE_LEAD', field: 'services', value: data.updatedLead.services, confidence: 0.9 });
          }
        });
      }

      // Update goal completion
      if (typeof data.goalCompletionPct === 'number') {
        dispatch({ type: 'SET_GOAL', completionPct: data.goalCompletionPct });
      }

      // Update intent
      if (data.intent) {
        dispatch({ type: 'SET_INTENT', intent: data.intent });
      }

      // Trigger booking panel
      if (data.bookingTriggered) {
        dispatch({ type: 'BOOKING_TRIGGER' });
      }

      // Speak the reply
      if (data.reply) {
        setTimeout(() => speakFallback(data.reply), 100);
      }

    } catch (err) {
      console.error('sendMessage error:', err);
      dispatch({ type: 'SET_TYPING', value: false });
      dispatch({ type: 'ADD_MESSAGE', message: { role: 'assistant', content: 'Something went wrong. Please try again or email us at editaura.ea@gmail.com', timestamp: Date.now(), isError: true } });
      dispatch({ type: 'SET_STATUS', status: 'idle' });
    } finally {
      isSendingRef.current = false;
    }
  }, [state.messages, state.leadProfile, speakFallback]);

  // ── STT (Web Speech API) ─────────────────────────────────────────────────
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
      if (state.status === 'listening') setTimeout(() => startSTT(), 300);
    };

    recognition.onerror = (e) => {
      if (e.error === 'no-speech') { setTimeout(() => startSTT(), 500); return; }
      if (e.error === 'aborted') return;
    };

    dispatch({ type: 'SET_STATUS', status: 'listening' });
    recognition.start();
  }, [micGranted, state.status, sendMessage]);

  const stopSTT = useCallback(() => {
    recognitionRef.current?.stop();
    recognitionRef.current?.abort();
    recognitionRef.current = null;
  }, []);

  // ── Timer ────────────────────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    setElapsedSeconds(0);
    timerRef.current = setInterval(() => setElapsedSeconds(s => s + 1), 1000);
  }, []);

  const stopTimer = useCallback(() => clearInterval(timerRef.current), []);

  // ── Check saved session on mount ─────────────────────────────────────────
  useEffect(() => {
    const saved = loadSaved();
    if (saved?.sessionId) { setSavedSession(saved); setHasSavedSession(true); }
  }, []);

  // ── Start conversation ───────────────────────────────────────────────────
  const startConversation = useCallback(async () => {
    dispatch({ type: 'SET_STATUS', status: 'requesting_mic' });

    // Request mic (non-blocking — text mode if denied)
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicGranted(true);
    } catch {
      setMicGranted(false);
    }

    try {
      const res = await fetch('/api/voice/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceType: /Mobi|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
        }),
      });
      const data = await res.json();

      dispatch({ type: 'SET_SESSION', sessionId: data.sessionId, featureFlags: data.featureFlags ?? {} });
      hydrateFlags(data.featureFlags ?? {});

      const greeting = data.greeting ?? GREETING;
      dispatch({ type: 'ADD_MESSAGE', message: { role: 'assistant', content: greeting, timestamp: Date.now(), isGreeting: true } });
      dispatch({ type: 'SET_STATUS', status: 'speaking' });
      setTimeout(() => speakFallback(greeting), 300);

      startTimer();
    } catch (err) {
      console.error('startConversation error:', err);
      dispatch({ type: 'SET_STATUS', status: 'error' });
    }
  }, [speakFallback, startTimer]);

  // ── Resume saved session ─────────────────────────────────────────────────
  const resumeSession = useCallback(async () => {
    if (!savedSession) return;
    restore(savedSession);
    setHasSavedSession(false);
    startTimer();
    dispatch({ type: 'SET_STATUS', status: 'listening' });
  }, [savedSession, restore, startTimer]);

  const discardSaved = useCallback(() => {
    clearSaved(); setHasSavedSession(false); setSavedSession(null);
  }, [clearSaved]);

  // ── End session ──────────────────────────────────────────────────────────
  const endSession = useCallback(async () => {
    stopSTT(); stopAudio(); stopTimer();
    const sessionId = sessionIdRef.current;

    if (sessionId && state.messages.length > 0) {
      try {
        const res = await fetch('/api/voice/end', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            messages: state.messages,
            leadProfile: state.leadProfile,
          }),
        });
        const data = await res.json();
        if (data.success && data.summary) {
          dispatch({ type: 'SET_SUMMARY', summary: data.summary });
        } else {
          dispatch({ type: 'SET_STATUS', status: 'ended' });
        }
      } catch {
        dispatch({ type: 'SET_STATUS', status: 'ended' });
      }
    } else {
      dispatch({ type: 'SET_STATUS', status: 'ended' });
    }
    clearSaved();
  }, [stopSTT, stopAudio, stopTimer, state.messages, state.leadProfile, clearSaved]);

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (!state.sessionId) return;
      if (e.code === 'Space' && e.target.tagName === 'BODY') {
        e.preventDefault();
        if (state.status === 'listening') stopSTT();
        else if (['idle', 'speaking'].includes(state.status)) startSTT();
      }
      if (e.code === 'Escape' && !['idle', 'ended'].includes(state.status)) endSession();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [state.sessionId, state.status, startSTT, stopSTT, endSession]);

  return {
    state, dispatch, startConversation, endSession,
    resumeSession, discardSaved, hasSavedSession,
    sendMessage, startSTT, stopSTT,
    elapsedSeconds, isPlaying, getAnalyser, micGranted,
    isConnected: () => !!state.sessionId,
  };
}
