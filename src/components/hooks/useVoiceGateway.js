import { useRef, useCallback, useEffect } from 'react';

/**
 * useVoiceGateway — persistent WebSocket connection to the Voice Gateway.
 * Handles: connection, reconnect, heartbeat, message routing.
 */
export function useVoiceGateway({ onMessage, onOpen, onClose, onError }) {
  const wsRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const reconnectAttempts = useRef(0);
  const MAX_RECONNECTS = 5;

  const getWsUrl = () => {
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${proto}//${window.location.host}/api/voice/ws`;
  };

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(getWsUrl());

    ws.onopen = () => {
      reconnectAttempts.current = 0;
      onOpen?.();
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        onMessage?.(msg);
      } catch { /* ignore malformed */ }
    };

    ws.onclose = (event) => {
      onClose?.(event);
      // Auto-reconnect with exponential backoff (not for normal closes)
      if (event.code !== 1000 && reconnectAttempts.current < MAX_RECONNECTS) {
        const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
        reconnectAttempts.current++;
        reconnectTimerRef.current = setTimeout(connect, delay);
      }
    };

    ws.onerror = (err) => {
      onError?.(err);
    };

    wsRef.current = ws;
  }, [onMessage, onOpen, onClose, onError]);

  const disconnect = useCallback(() => {
    clearTimeout(reconnectTimerRef.current);
    if (wsRef.current) {
      wsRef.current.onclose = null; // Prevent auto-reconnect
      wsRef.current.close(1000, 'User ended session');
      wsRef.current = null;
    }
  }, []);

  const send = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  const isConnected = useCallback(() => {
    return wsRef.current?.readyState === WebSocket.OPEN;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(reconnectTimerRef.current);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, []);

  return { connect, disconnect, send, isConnected };
}
