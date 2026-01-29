import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WEBSOCKET_URL = "http://localhost:8080/ws-metro";

class WebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = new Map(); // Guardamos las suscripciones activas
    this.isConnected = false;
    this.connectionPromise = null;
  }

  /**
   * Conecta al servidor WebSocket
   * @returns {Promise} Promesa que se resuelve cuando la conexión está establecida
   */
  connect() {
    // Si ya hay una conexión en progreso, retornamos esa promesa
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // Si ya está conectado, retornamos una promesa resuelta
    if (this.isConnected && this.client?.connected) {
      return Promise.resolve();
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      const token = localStorage.getItem("token");

      this.client = new Client({
        // Usamos SockJS como transporte (fallback para navegadores sin WebSocket nativo)
        webSocketFactory: () => new SockJS(WEBSOCKET_URL),
        
        // Headers de conexión (útil para autenticación)
        connectHeaders: {
          Authorization: token ? `Bearer ${token}` : "",
        },

        // Configuración de reconexión automática
        reconnectDelay: 5000, // 5 segundos entre intentos
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        // Callback cuando la conexión es exitosa
        onConnect: () => {
          console.log("✅ Conectado al WebSocket");
          this.isConnected = true;
          this.connectionPromise = null;
          resolve();
        },

        // Callback cuando hay un error en la conexión
        onStompError: (frame) => {
          console.error("❌ Error STOMP:", frame.headers["message"]);
          this.isConnected = false;
          this.connectionPromise = null;
          reject(new Error(frame.headers["message"]));
        },

        // Callback cuando se pierde la conexión
        onDisconnect: () => {
          console.log("🔌 Desconectado del WebSocket");
          this.isConnected = false;
        },

        // Callback cuando hay error en el WebSocket
        onWebSocketError: (error) => {
          console.error("❌ Error WebSocket:", error);
          this.isConnected = false;
          this.connectionPromise = null;
          reject(error);
        },
      });

      // Activamos la conexión
      this.client.activate();
    });

    return this.connectionPromise;
  }

  /**
   * Desconecta del servidor WebSocket
   */
  disconnect() {
    if (this.client) {
      // Cancelamos todas las suscripciones
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();

      // Desactivamos el cliente
      this.client.deactivate();
      this.isConnected = false;
      this.connectionPromise = null;
      console.log("🔌 WebSocket desconectado manualmente");
    }
  }

  /**
   * Se suscribe a un topic/queue para recibir mensajes
   * @param {string} destination - El destino (ej: "/topic/chat/123")
   * @param {function} callback - Función que se ejecuta cuando llega un mensaje
   * @returns {string} ID de la suscripción para poder cancelarla después
   */
  subscribe(destination, callback) {
    if (!this.client || !this.isConnected) {
      console.error("❌ No hay conexión WebSocket activa");
      return null;
    }

    // Creamos la suscripción
    const subscription = this.client.subscribe(destination, (message) => {
      // Parseamos el mensaje JSON y lo pasamos al callback
      const body = JSON.parse(message.body);
      callback(body);
    });

    // Guardamos la suscripción para poder cancelarla después
    this.subscriptions.set(subscription.id, subscription);
    console.log(`📡 Suscrito a: ${destination}`);

    return subscription.id;
  }

  /**
   * Cancela una suscripción específica
   * @param {string} subscriptionId - ID de la suscripción a cancelar
   */
  unsubscribe(subscriptionId) {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription) {
      subscription.unsubscribe();
      this.subscriptions.delete(subscriptionId);
      console.log(`🚫 Suscripción cancelada: ${subscriptionId}`);
    }
  }

  /**
   * Envía un mensaje al servidor
   * @param {string} destination - El destino (ej: "/app/chat.enviar")
   * @param {object} body - El cuerpo del mensaje
   */
  send(destination, body) {
    if (!this.client || !this.isConnected) {
      console.error("❌ No hay conexión WebSocket activa");
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });
    console.log(`📤 Mensaje enviado a: ${destination}`);
  }

  /**
   * Verifica si está conectado
   * @returns {boolean}
   */
  isActive() {
    return this.isConnected && this.client?.connected;
  }
}

// Exportamos una instancia única (Singleton)
export const webSocketService = new WebSocketService();