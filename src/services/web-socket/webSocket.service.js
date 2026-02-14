import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WEBSOCKET_URL = "http://localhost:8080/ws-metro";

class WebSocketService {
  constructor() {
    this.client = null;
    this.subscriptions = new Map(); 
    this.isConnected = false;
    this.connectionPromise = null;
  }

  /**
   * Conecta al servidor WebSocket
   * @returns {Promise} Promesa que se resuelve cuando la conexión está establecida
   */
  connect() {
    // Si  hay una conexión en progreso, retornamos esa promesa
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    // Si está conectado, retornamos una promesa resuelta
    if (this.isConnected && this.client?.connected) {
      return Promise.resolve();
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      this.client = new Client({
        webSocketFactory: () => new SockJS(WEBSOCKET_URL),

        // Configuración de reconexión automática
        reconnectDelay: 5000, 
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,

        onConnect: () => {
          this.isConnected = true;
          this.connectionPromise = null;
          resolve();
        },

        onStompError: (frame) => {
          console.error(" Error STOMP:", frame.headers["message"]);
          this.isConnected = false;
          this.connectionPromise = null;
          reject(new Error(frame.headers["message"]));
        },

        onDisconnect: () => {
          this.isConnected = false;
        },

        onWebSocketError: (error) => {
          console.error(" Error WebSocket:", error);
          this.isConnected = false;
          this.connectionPromise = null;
          reject(error);
        },
      });

      this.client.activate();
    });

    return this.connectionPromise;
  }

  /**
   * Desconecta del servidor WebSocket
   */
  disconnect() {
    if (this.client) {
      this.subscriptions.forEach((subscription) => {
        subscription.unsubscribe();
      });
      this.subscriptions.clear();

      this.client.deactivate();
      this.isConnected = false;
      this.connectionPromise = null;
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
      console.error(" No hay conexión WebSocket activa");
      return null;
    }

    const subscription = this.client.subscribe(destination, (message) => {
      const body = JSON.parse(message.body);
      callback(body);
    });

    this.subscriptions.set(subscription.id, subscription);

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
      console.log(` Suscripción cancelada: ${subscriptionId}`);
    }
  }

  /**
   * Envía un mensaje al servidor
   * @param {string} destination - El destino (ej: "/app/chat.enviar")
   * @param {object} body - El cuerpo del mensaje
   */
  send(destination, body) {
    if (!this.client || !this.isConnected) {
      console.error(" No hay conexión WebSocket activa");
      return;
    }

    this.client.publish({
      destination,
      body: JSON.stringify(body),
    });
    //console.log(` Mensaje enviado a: ${destination}`);
  }

  /**
   * Verifica si está conectado
   * @returns {boolean}
   */
  isActive() {
    return this.isConnected && this.client?.connected;
  }
}

export const webSocketService = new WebSocketService();
