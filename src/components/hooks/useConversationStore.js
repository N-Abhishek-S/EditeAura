import { useReducer, useEffect, useCallback, useRef } from 'react';

const STORAGE_KEY = 'ea_voice_session';

const initialState = {
  sessionId: null,
  status: 'idle', // idle | requesting_mic | listening | processing | speaking | error | ended
  messages: [],
  leadProfile: { name: null, email: null, phone: null, company: null, budget: null, timeline: null, services: [], projectDescription: null },
  confidence: {},
  intent: 'general',
  goalCompletionPct: 0,
  costs: { deepgram: 0, gemini: 0, elevenlabs: 0, total: 0 },
  isTyping: false,
  bookingTriggered: false,
  handoffTriggered: false,
  summary: null,
  featureFlags: {},
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SESSION':
      return { ...state, sessionId: action.sessionId, featureFlags: action.featureFlags ?? {} };
    case 'SET_STATUS':
      return { ...state, status: action.status };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.message], isTyping: false };
    case 'SET_TYPING':
      return { ...state, isTyping: action.value };
    case 'UPDATE_LEAD':
      return {
        ...state,
        leadProfile: { ...state.leadProfile, [action.field]: action.value },
        confidence: { ...state.confidence, [action.field]: action.confidence },
      };
    case 'SET_INTENT':
      return { ...state, intent: action.intent };
    case 'SET_GOAL':
      return { ...state, goalCompletionPct: action.completionPct };
    case 'SET_COSTS':
      return { ...state, costs: action.costs };
    case 'BOOKING_TRIGGER':
      return { ...state, bookingTriggered: true };
    case 'HANDOFF_TRIGGER':
      return { ...state, handoffTriggered: true };
    case 'SET_SUMMARY':
      return { ...state, summary: action.summary, status: 'ended' };
    case 'CLEAR':
      return { ...initialState };
    case 'RESTORE':
      return { ...initialState, ...action.state };
    default:
      return state;
  }
}

/**
 * useConversationStore — persistent conversation reducer with localStorage autosave.
 * Autosaves on every state change. Recovers if browser refreshes mid-session.
 */
export function useConversationStore() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  // Autosave on every state change (non-blocking)
  useEffect(() => {
    if (!state.sessionId) return;
    try {
      const toSave = {
        sessionId: state.sessionId,
        messages: state.messages.slice(-20), // Keep last 20 messages
        leadProfile: state.leadProfile,
        confidence: state.confidence,
        intent: state.intent,
        goalCompletionPct: state.goalCompletionPct,
        featureFlags: state.featureFlags,
        savedAt: Date.now(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch { /* localStorage may be full — non-critical */ }
  }, [state]);

  /** Try to load a saved session from localStorage */
  const loadSaved = useCallback(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const saved = JSON.parse(raw);
      // Discard if older than 30 minutes
      if (Date.now() - (saved.savedAt ?? 0) > 30 * 60 * 1000) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return saved;
    } catch { return null; }
  }, []);

  /** Restore from saved */
  const restore = useCallback((saved) => {
    dispatch({ type: 'RESTORE', state: saved });
  }, []);

  /** Clear session storage */
  const clearSaved = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    dispatch({ type: 'CLEAR' });
  }, []);

  return { state, dispatch, loadSaved, restore, clearSaved };
}
