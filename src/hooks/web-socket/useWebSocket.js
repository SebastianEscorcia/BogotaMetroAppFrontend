import { useEffect, useRef, useState, useCallback } from "react";
import { webSocketService } from "../../services";

/**
 * Hook personalizado para manejar conexiones WebSocket
 * @param {boolean} autoConnect - Si debe conectar automáticamente al montar
 * @returns {Object} Métodos y estado del WebSocket
 */
export const useWebSocket = (autoConnect = true) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const subscriptionsRef = useRef([]); // Para limpiar suscripciones al desmontar

  const connect = useCallback(async () => {
    try {
      setError(null);
      await webSocketService.connect();
      setIsConnected(true);
    } catch (err) {
      setError(err.message || "Error al conectar");
      setIsConnected(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    subscriptionsRef.current.forEach((subId) => {
      webSocketService.unsubscribe(subId);
    });
    subscriptionsRef.current = [];
    setIsConnected(false);
  }, []);

  const subscribe = useCallback((destination, callback) => {
    const subscriptionId = webSocketService.subscribe(destination, callback);
    if (subscriptionId) {
      subscriptionsRef.current.push(subscriptionId);
    }
    return subscriptionId;
  }, []);

  const unsubscribe = useCallback((subscriptionId) => {
    webSocketService.unsubscribe(subscriptionId);
    subscriptionsRef.current = subscriptionsRef.current.filter(
      (id) => id !== subscriptionId,
    );
  }, []);

  const send = useCallback((destination, body) => {
    webSocketService.send(destination, body);
  }, []);

  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      subscriptionsRef.current.forEach((subId) => {
        webSocketService.unsubscribe(subId);
      });
      subscriptionsRef.current = [];
    };
  }, [autoConnect, connect]);

  return {
    isConnected,
    error,
    connect,
    disconnect,
    subscribe,
    unsubscribe,
    send,
  };
};
