import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, MicOff, PhoneOff, MessageSquare, Send, ChevronDown,
  Zap, Shield, Clock, Brain, Bot, Keyboard
} from 'lucide-react';
import VoiceOrb from './VoiceOrb.jsx';
import AudioWaveform from './AudioWaveform.jsx';
import ConversationTranscript from './ConversationTranscript.jsx';
import QuickSuggestions from './QuickSuggestions.jsx';
import LeadProgressPanel from './LeadProgressPanel.jsx';
import BookingPanel from './BookingPanel.jsx';
import ConversationSummaryModal from './ConversationSummaryModal.jsx';
import { useVoiceSession } from '../hooks/useVoiceSession.js';

const FEATURES = [
  { icon: Brain, label: 'AI Powered', desc: 'Gemini 2.5 Flash' },
  { icon: Zap, label: 'Real-time', desc: '< 400ms response' },
  { icon: Shield, label: 'Private', desc: 'Encrypted session' },
  { icon: Clock, label: '24/7', desc: 'Always available' },
];

/**
 * AIVoiceConsultant — main section component.
 * Replaces the Founders section. Desktop: 55/45 split. Mobile: stacked.
 */
export default function AIVoiceConsultant() {
  const {
    state, dispatch, startConversation, endSession,
    resumeSession, discardSaved, hasSavedSession,
    sendMessage, startSTT, stopSTT,
    elapsedSeconds, isPlaying, getAnalyser, micGranted,
  } = useVoiceSession();

  const [textInput, setTextInput] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [showBookingPanel, setShowBookingPanel] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [summaryScore, setSummaryScore] = useState(0);
  const [summaryPriority, setSummaryPriority] = useState('cold');
  const inputRef = useRef(null);

  const { status, messages, leadProfile, confidence, goalCompletionPct, isTyping, bookingTriggered, summary } = state;

  const isActive = status !== 'idle' && status !== 'ended' && status !== 'requesting_mic';
  const hasSession = !!state.sessionId;

  // Format elapsed time
  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  // Orb click handler
  const handleOrbClick = () => {
    if (!hasSession) { startConversation(); return; }
    if (status === 'listening') stopSTT();
    else if (status === 'idle' || status === 'speaking') startSTT();
  };

  // Text message submit
  const handleTextSubmit = (e) => {
    e?.preventDefault();
    const text = textInput.trim();
    if (!text || !hasSession) return;
    dispatch({ type: 'ADD_MESSAGE', message: { role: 'user', content: text, timestamp: Date.now() } });
    sendMessage(text);
    setTextInput('');
    inputRef.current?.focus();
  };

  // Quick suggestion
  const handleSuggestion = (text) => {
    if (!hasSession) {
      startConversation().then?.(() => setTimeout(() => sendMessage(text), 800));
      return;
    }
    dispatch({ type: 'ADD_MESSAGE', message: { role: 'user', content: text, timestamp: Date.now() } });
    sendMessage(text);
  };

  // End session
  const handleEnd = async () => {
    await endSession();
    if (state.summary) {
      setSummaryData(state.summary);
      setSummaryScore(50);
      setSummaryPriority('cold');
      setShowSummary(true);
    }
  };

  return (
    <section
      id="ai-voice-consultant"
      className="relative py-24 md:py-32 overflow-hidden"
      aria-labelledby="voice-section-heading"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030305] via-[#060612] to-[#030305]" aria-hidden />
      <div className="absolute inset-0" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-violet-600/4 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/4 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── HEADER ─────────────────────────────────────────────── */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/20 bg-violet-500/5 mb-6"
          >
            <Bot size={12} className="text-violet-400" aria-hidden />
            <span className="text-[11px] font-semibold tracking-[0.12em] text-violet-400 uppercase">
              AI Sales Assistant
            </span>
          </motion.div>

          <motion.h2
            id="voice-section-heading"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight"
          >
            Talk With Our AI.
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Get Answers In Seconds.
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-5 text-base md:text-lg text-white/50 max-w-xl mx-auto leading-relaxed"
          >
            Ask about services, pricing, timelines, or book a strategy call — in real time.
            No forms. No wait time. No sales pressure.
          </motion.p>
        </div>

        {/* ── FEATURE BADGES ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-16"
        >
          {FEATURES.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/8 bg-white/3 text-xs text-white/50"
            >
              <Icon size={11} className="text-violet-400" aria-hidden />
              <span className="font-medium text-white/70">{label}</span>
              <span className="text-white/35">·</span>
              <span>{desc}</span>
            </div>
          ))}
        </motion.div>

        {/* ── MAIN PANEL — Desktop: 55/45 split ──────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[55fr_45fr] gap-8 items-start">

          {/* ── LEFT: Voice Interaction Panel ────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="relative rounded-3xl border border-white/8 bg-[#08080f]/90 backdrop-blur-xl overflow-hidden"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden />
                <span className="text-xs font-medium text-white/60">
                  {hasSession ? `Session · ${formatTime(elapsedSeconds)}` : 'Ready · Edit Aura AI'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-white/10" aria-hidden />
                <div className="w-2 h-2 rounded-full bg-white/10" aria-hidden />
                <div className="w-2 h-2 rounded-full bg-violet-500/50" aria-hidden />
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6">
              {/* Orb */}
              <div className="flex justify-center py-4">
                <VoiceOrb
                  status={status}
                  onClick={handleOrbClick}
                  size={160}
                />
              </div>

              {/* Waveform */}
              <AudioWaveform
                status={status}
                getAnalyser={getAnalyser}
                barCount={40}
                height={44}
              />

              {/* Transcript */}
              <AnimatePresence>
                {(messages.length > 0 || isTyping) && (
                  <ConversationTranscript
                    messages={messages}
                    isTyping={isTyping}
                    maxHeight={320}
                  />
                )}
              </AnimatePresence>

              {/* Pre-session suggestions */}
              <AnimatePresence>
                {!hasSession && messages.length === 0 && (
                  <motion.div
                    key="suggestions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <p className="text-xs text-white/30 mb-3 text-center">Tap a topic to start</p>
                    <QuickSuggestions
                      onSelect={handleSuggestion}
                      visible={true}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Booking panel */}
              <AnimatePresence>
                {(bookingTriggered || showBookingPanel) && (
                  <BookingPanel
                    visible={true}
                    leadProfile={leadProfile}
                    onClose={() => setShowBookingPanel(false)}
                    onBook={(booking) => {
                      setShowBookingPanel(false);
                      dispatch({ type: 'ADD_MESSAGE', message: { role: 'assistant', content: `Your strategy call request has been sent! Our team will confirm your ${booking.slot} slot via email.`, timestamp: Date.now() } });
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Resume session banner */}
              <AnimatePresence>
                {hasSavedSession && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-center justify-between gap-3"
                  >
                    <p className="text-xs text-amber-300/80">Previous session found. Resume?</p>
                    <div className="flex gap-2">
                      <button onClick={resumeSession} className="px-2.5 py-1 text-[10px] font-semibold rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors">Resume</button>
                      <button onClick={discardSaved} className="px-2.5 py-1 text-[10px] rounded-lg text-white/30 hover:text-white/50 transition-colors">Dismiss</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Text input */}
              {hasSession && status !== 'ended' && (
                <form onSubmit={handleTextSubmit} className="flex gap-2">
                  <div className="relative flex-1">
                    <Keyboard size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" aria-hidden />
                    <input
                      ref={inputRef}
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Or type your question..."
                      className="w-full bg-white/3 border border-white/8 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white/80 placeholder-white/25 focus:outline-none focus:border-violet-500/40 focus:bg-white/5 transition-all"
                      aria-label="Type your question"
                      maxLength={500}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!textInput.trim()}
                    className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:bg-white/5 disabled:text-white/20 text-white text-sm font-medium transition-all duration-200"
                    aria-label="Send message"
                  >
                    <Send size={14} aria-hidden />
                  </button>
                </form>
              )}

              {/* Control buttons */}
              <div className="flex items-center justify-center gap-3">
                {!hasSession ? (
                  <motion.button
                    onClick={startConversation}
                    className="group flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-violet-900/30 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    id="start-voice-button"
                    aria-label="Start voice conversation with Aura"
                  >
                    <Mic size={15} />
                    Talk to Aura
                  </motion.button>
                ) : status !== 'ended' ? (
                  <button
                    onClick={handleEnd}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-500/20 bg-red-900/10 text-red-400 hover:bg-red-900/20 text-xs font-medium transition-all"
                    aria-label="End conversation"
                  >
                    <PhoneOff size={13} />
                    End Session
                  </button>
                ) : (
                  <button
                    onClick={() => { dispatch({ type: 'CLEAR' }); setShowSummary(false); }}
                    className="px-4 py-2.5 rounded-xl border border-white/10 text-white/50 hover:bg-white/5 text-xs font-medium transition-all"
                  >
                    Start New Session
                  </button>
                )}

                {hasSession && status !== 'ended' && (
                  <button
                    onClick={() => setShowBookingPanel(b => !b)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/8 text-white/50 hover:bg-white/5 text-xs font-medium transition-all"
                    aria-label="Open booking panel"
                  >
                    <MessageSquare size={13} />
                    Book Call
                  </button>
                )}
              </div>

              {/* Keyboard hint */}
              {hasSession && (
                <p className="text-center text-[10px] text-white/20" aria-label="Keyboard shortcut: Space to toggle microphone">
                  <kbd className="px-1 py-0.5 rounded border border-white/10 font-mono text-[9px]">Space</kbd> toggle mic &nbsp;·&nbsp;
                  <kbd className="px-1 py-0.5 rounded border border-white/10 font-mono text-[9px]">Esc</kbd> end session
                </p>
              )}
            </div>
          </motion.div>

          {/* ── RIGHT: Info + Lead Panel ──────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.25 }}
            className="space-y-6"
          >
            {/* Headline copy */}
            <div className="space-y-4">
              <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                Your AI Employee
                <br />
                <span className="text-white/50 font-medium">Never Sleeps.</span>
              </h3>
              <p className="text-sm text-white/50 leading-relaxed">
                Aura is Edit Aura's AI Business Consultant — trained on everything we offer.
                It qualifies leads, answers pricing questions, handles objections, and books calls,
                all in real time, 24/7.
              </p>
            </div>

            {/* Capabilities list */}
            <div className="space-y-2.5">
              {[
                'Answers questions about all services and pricing',
                'Qualifies leads and estimates project fit',
                'Schedules strategy calls and follows up',
                'Notifies the sales team instantly on high-value leads',
                'Remembers your conversation — pick up where you left off',
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.07 }}
                  className="flex items-start gap-2.5"
                >
                  <div className="w-4 h-4 rounded-full bg-violet-500/15 border border-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-400" aria-hidden />
                  </div>
                  <span className="text-sm text-white/60 leading-relaxed">{item}</span>
                </motion.div>
              ))}
            </div>

            {/* Lead progress panel — shown during active session */}
            <AnimatePresence>
              {hasSession && (
                <motion.div
                  key="lead-panel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <LeadProgressPanel
                    leadProfile={leadProfile}
                    confidence={confidence}
                    goalCompletionPct={goalCompletionPct}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Provider badges */}
            <div className="pt-2">
              <p className="text-[10px] text-white/25 uppercase tracking-widest font-semibold mb-3">Powered by</p>
              <div className="flex flex-wrap gap-2">
                {['Gemini 2.5 Flash', 'ElevenLabs Voice', 'Deepgram STT'].map((label) => (
                  <span
                    key={label}
                    className="px-2.5 py-1 text-[10px] font-medium rounded-md border border-white/8 bg-white/3 text-white/40"
                  >
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Trust note */}
            <div className="pt-2 border-t border-white/5">
              <p className="text-[11px] text-white/25 leading-relaxed">
                All conversations are private. Lead data is never shared with third parties.
                You can end the session at any time.
              </p>
            </div>
          </motion.div>
        </div>

        {/* SEO hidden content */}
        <div className="sr-only">
          <h3>AI Voice Business Consultant by Edit Aura</h3>
          <p>Talk to our AI business consultant 24/7. Get instant answers about website development, AI automation, social media management, SEO services, and digital marketing. Book a free strategy call.</p>
        </div>
      </div>

      {/* Summary modal */}
      <AnimatePresence>
        {showSummary && state.summary && (
          <ConversationSummaryModal
            summary={state.summary}
            score={summaryScore}
            priority={summaryPriority}
            onClose={() => setShowSummary(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
