import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { socketService } from '../services/socketService';
import type { SocketConfig, SocketCallbacks } from '../services/socketService';

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error' | 'reconnecting';

interface SocketContextType {
  connectionStatus: ConnectionStatus;
  connect: (sessionHash: string, config?: SocketConfig) => Promise<void>;
  disconnect: () => void;
  error: string | null;
  sessionHash: string | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
  autoConnect?: boolean;
  sessionHash?: string;
  config?: SocketConfig;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ 
  children, 
  autoConnect = false, 
  sessionHash: initialSessionHash,
  config 
}) => {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [error, setError] = useState<string | null>(null);
  const [sessionHash, setSessionHash] = useState<string | null>(initialSessionHash || null);

  const callbacks: SocketCallbacks = {
    onConnect: () => {
      setConnectionStatus('connected');
      setError(null);
      console.log('Socket.IO conectado exitosamente');
    },
    onDisconnect: (reason: string) => {
      setConnectionStatus('disconnected');
      console.log(`Socket.IO desconectado: ${reason}`);
      
      // Si la desconexión no fue intencional, intentar reconectar
      if (reason !== 'io client disconnect') {
        setConnectionStatus('reconnecting');
      }
    },
    onError: (error: Error) => {
      setConnectionStatus('error');
      setError(error.message);
      console.error('Error en Socket.IO:', error);
    },
    onReconnect: (attemptNumber: number) => {
      setConnectionStatus('connected');
      setError(null);
      console.log(`Socket.IO reconectado después de ${attemptNumber} intentos`);
    }
  };

  const connect = async (newSessionHash: string, newConfig?: SocketConfig): Promise<void> => {
    try {
      setConnectionStatus('connecting');
      setError(null);
      setSessionHash(newSessionHash);
      
      await socketService.connect(newSessionHash, newConfig || config, callbacks);
    } catch (error) {
      setConnectionStatus('error');
      setError(error instanceof Error ? error.message : 'Error de conexión desconocido');
      throw error;
    }
  };

  const disconnect = (): void => {
    setConnectionStatus('disconnected');
    setError(null);
    setSessionHash(null);
    socketService.disconnect();
  };

  const isConnected = connectionStatus === 'connected' && socketService.isSocketConnected();

  // Auto-conectar si está habilitado y hay un sessionHash
  useEffect(() => {
    if (autoConnect && sessionHash && connectionStatus === 'disconnected') {
      connect(sessionHash).catch((error) => {
        console.error('Error en auto-conexión:', error);
      });
    }
  }, [autoConnect, sessionHash]);

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  const value: SocketContextType = {
    connectionStatus,
    connect,
    disconnect,
    error,
    sessionHash,
    isConnected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket debe ser usado dentro de un SocketProvider');
  }
  return context;
};

// Hook para conectar automáticamente cuando hay un sessionHash
export const useAutoConnect = (sessionHash: string | null, config?: SocketConfig) => {
  const { connect, isConnected, connectionStatus } = useSocket();

  useEffect(() => {
    if (sessionHash && !isConnected && connectionStatus === 'disconnected') {
      connect(sessionHash, config).catch((error) => {
        console.error('Error en auto-conexión:', error);
      });
    }
  }, [sessionHash, isConnected, connectionStatus, connect]);
};

// Hook para suscribirse a eventos específicos de Socket.IO
export function useSocketSubscription<T>(
  event: string,
  callback: (data: T) => void,
  deps: React.DependencyList = []
) {
  const { isConnected } = useSocket();

  useEffect(() => {
    if (!isConnected) return;

    const unsubscribe = socketService.subscribe(event, callback);
    return unsubscribe;
  }, [event, isConnected, ...deps]);
}

export default SocketContext;
