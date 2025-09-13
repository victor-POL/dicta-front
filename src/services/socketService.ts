import { io, Socket } from 'socket.io-client';
import type { EmocionesResponse } from '@/models/emocionesModels';
import type { ChatResponse } from '@/models/chatModels';
import type { ResumenResponse } from '@/models/resumenModels';
import type { SugerenciasResponse } from '@/models/sugerenciasModels';
import type { TranscripcionResponse } from '@/models/transcripcionModels';
import type { MapaResponse } from '@/models/mapaModels';
import type { CronologiaResponse } from '@/models/cronologiaModels';

export interface SocketConfig {
  url?: string;
  options?: {
    transports?: string[];
    upgrade?: boolean;
    autoConnect?: boolean;
    reconnection?: boolean;
    reconnectionAttempts?: number;
    reconnectionDelay?: number;
  };
}

export interface SocketCallbacks {
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
  onError?: (error: Error) => void;
  onReconnect?: (attemptNumber: number) => void;
}

class SocketIOService {
  private socket: Socket | null = null;
  private isConnected: boolean = false;
  private sessionHash: string | null = null;
  private callbacks: SocketCallbacks = {};

  private defaultConfig: SocketConfig = {
    url: 'http://localhost:4001',
    options: {
      transports: ['websocket', 'polling'],
      upgrade: true,
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    }
  };

  connect(sessionHash: string, config?: SocketConfig, callbacks?: SocketCallbacks): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.socket && this.isConnected) {
        resolve();
        return;
      }

      this.sessionHash = sessionHash;
      this.callbacks = callbacks || {};
      
      const finalConfig = {
        ...this.defaultConfig,
        ...config,
        options: {
          ...this.defaultConfig.options,
          ...config?.options,
          query: {
            sessionHash
          }
        }
      };

      this.socket = io(finalConfig.url!, finalConfig.options);

      this.socket.on('connect', () => {
        this.isConnected = true;
        console.log('Socket.IO conectado');
        this.callbacks.onConnect?.();
        resolve();
      });

      this.socket.on('disconnect', (reason) => {
        this.isConnected = false;
        console.log('Socket.IO desconectado:', reason);
        this.callbacks.onDisconnect?.(reason);
      });

      this.socket.on('connect_error', (error) => {
        console.error('Error de conexión Socket.IO:', error);
        this.callbacks.onError?.(error);
        reject(error);
      });

      this.socket.on('reconnect', (attemptNumber) => {
        console.log(`Socket.IO reconectado después de ${attemptNumber} intentos`);
        this.callbacks.onReconnect?.(attemptNumber);
      });

      this.socket.connect();
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      this.sessionHash = null;
    }
  }

  isSocketConnected(): boolean {
    return this.isConnected && this.socket?.connected === true;
  }

  // Método para esperar a que la conexión esté lista
  private async waitForConnection(timeout: number = 10000): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isSocketConnected()) {
        resolve();
        return;
      }

      const timeoutId = setTimeout(() => {
        reject(new Error('Timeout esperando conexión Socket.IO'));
      }, timeout);

      const checkConnection = () => {
        if (this.isSocketConnected()) {
          clearTimeout(timeoutId);
          resolve();
        } else {
          setTimeout(checkConnection, 100);
        }
      };

      checkConnection();
    });
  }

  // Método genérico para hacer peticiones con respuesta
  private async request<T>(event: string, data?: any, timeout: number = 30000): Promise<T> {
    // Esperar a que la conexión esté lista
    await this.waitForConnection(5000);

    return new Promise((resolve, reject) => {
      if (!this.socket || !this.isConnected) {
        reject(new Error('Socket no conectado después de espera'));
        return;
      }

      const responseEvent = `${event}_response`;
      const timeoutId = setTimeout(() => {
        this.socket?.off(responseEvent);
        reject(new Error('Timeout en la petición'));
      }, timeout);

      this.socket.once(responseEvent, (response: T) => {
        clearTimeout(timeoutId);
        resolve(response);
      });

      this.socket.emit(event, { 
        ...data, 
        sessionHash: this.sessionHash 
      });
    });
  }

  // Método para suscribirse a eventos en tiempo real
  subscribe<T>(event: string, callback: (data: T) => void): () => void {
    if (!this.socket) {
      throw new Error('Socket no conectado');
    }

    this.socket.on(event, callback);
    
    // Retorna función para desuscribirse
    return () => {
      this.socket?.off(event, callback);
    };
  }

  // Servicios específicos de la aplicación
  async getEmociones(hash: string): Promise<EmocionesResponse> {
    return this.request<EmocionesResponse>('get_emotions', { hash });
  }

  async sendChatMessage(text: string, hash: string): Promise<ChatResponse> {
    return this.request<ChatResponse>('send_chat_message', { text, hash });
  }

  async getResumen(hash: string): Promise<ResumenResponse> {
    return this.request<ResumenResponse>('get_resumen', { hash });
  }

  async getSugerencias(hash: string): Promise<SugerenciasResponse> {
    return this.request<SugerenciasResponse>('get_sugerencias', { hash });
  }

  async getContradicciones(hash: string): Promise<any> {
    return this.request<any>('get_contradicciones', { hash });
  }

  async getCronologia(hash: string): Promise<CronologiaResponse> {
    return this.request<CronologiaResponse>('get_cronologia', { hash });
  }

  async getMapa(hash: string): Promise<MapaResponse> {
    return this.request<MapaResponse>('get_mapa', { hash });
  }

  async getAnalisisEmociones(hash: string): Promise<EmocionesResponse> {
    return this.request<EmocionesResponse>('get_analisis_emociones', { hash });
  }

  async getTranscripcion(hash: string): Promise<TranscripcionResponse> {
    return this.request<TranscripcionResponse>('get_transcripcion', { hash });
  }

  // Métodos para autenticación
  async login(credentials: any): Promise<any> {
    return this.request('auth_login', credentials);
  }

  async register(data: any): Promise<any> {
    return this.request('auth_register', data);
  }

  async logout(): Promise<void> {
    await this.request('auth_logout');
  }

  // Suscripciones a eventos de tiempo real
  subscribeToEmociones(callback: (data: any) => void): () => void {
    return this.subscribe('emotions_update', callback);
  }

  subscribeToChatMessages(callback: (data: any) => void): () => void {
    return this.subscribe('chat_message', callback);
  }

  subscribeToTranscripcion(callback: (data: any) => void): () => void {
    return this.subscribe('transcription_update', callback);
  }

  subscribeToAnalisisEmociones(callback: (data: any) => void): () => void {
    return this.subscribe('analisis_emociones_update', callback);
  }

  // Método para manejar errores globalmente
  onError(callback: (error: any) => void): () => void {
    return this.subscribe('error', callback);
  }
}

// Instancia singleton
export const socketService = new SocketIOService();
export default socketService;
