import { useRef, useCallback, useState } from 'react';

/**
 * useAudioPlayer — streams and plays base64-encoded MP3 audio chunks.
 * Used for ElevenLabs streaming TTS output from the gateway.
 * Falls back to SpeechSynthesis when TTS is not available server-side.
 */
export function useAudioPlayer({ onPlayStart, onPlayEnd }) {
  const audioCtxRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const queueRef = useRef([]);
  const isProcessingRef = useRef(false);
  const analyserRef = useRef(null);

  function getAudioContext() {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      audioCtxRef.current = new AudioContext({ sampleRate: 22050 });
      analyserRef.current = audioCtxRef.current.createAnalyser();
      analyserRef.current.connect(audioCtxRef.current.destination);
    }
    return audioCtxRef.current;
  }

  const addChunk = useCallback((base64Data) => {
    queueRef.current.push(base64Data);
    if (!isProcessingRef.current) processQueue();
  }, []);

  async function processQueue() {
    if (isProcessingRef.current || queueRef.current.length === 0) return;
    isProcessingRef.current = true;
    setIsPlaying(true);
    onPlayStart?.();

    while (queueRef.current.length > 0) {
      const chunk = queueRef.current.shift();
      try {
        await playChunk(chunk);
      } catch { /* Continue on chunk error */ }
    }

    isProcessingRef.current = false;
    setIsPlaying(false);
    onPlayEnd?.();
  }

  async function playChunk(base64) {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') await ctx.resume();

    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

    const buffer = await ctx.decodeAudioData(bytes.buffer);
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(analyserRef.current ?? ctx.destination);
    source.start();
    await new Promise(resolve => { source.onended = resolve; });
  }

  /** Speak text using browser SpeechSynthesis (fallback) */
  const speakFallback = useCallback((text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.92;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    // Try to find a high-quality voice
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v =>
      /google|microsoft|natural|enhanced/i.test(v.name) && /en/i.test(v.lang)
    ) ?? voices.find(v => /en/i.test(v.lang));
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => { setIsPlaying(true); onPlayStart?.(); };
    utterance.onend = () => { setIsPlaying(false); onPlayEnd?.(); };

    window.speechSynthesis.speak(utterance);
  }, [onPlayStart, onPlayEnd]);

  const stop = useCallback(() => {
    queueRef.current = [];
    window.speechSynthesis?.cancel();
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  /** Get AnalyserNode for waveform visualization */
  const getAnalyser = useCallback(() => analyserRef.current, []);

  return { addChunk, speakFallback, stop, isPlaying, getAnalyser };
}
