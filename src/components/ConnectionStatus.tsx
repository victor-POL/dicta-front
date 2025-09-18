import React from 'react';
import { useSocket } from '@/contexts/SocketContext';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Loader2, WifiOff } from 'lucide-react';

interface ConnectionStatusProps {
  showDetails?: boolean;
  className?: string;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  showDetails = false, 
  className = "" 
}) => {
  const { connectionStatus, error, sessionHash } = useSocket();

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case 'connected':
        return {
          icon: CheckCircle,
          text: 'Conectado',
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 border-green-200'
        };
      case 'connecting':
        return {
          icon: Loader2,
          text: 'Conectando...',
          variant: 'secondary' as const,
          className: 'bg-blue-100 text-blue-800 border-blue-200'
        };
      case 'reconnecting':
        return {
          icon: Loader2,
          text: 'Reconectando...',
          variant: 'secondary' as const,
          className: 'bg-yellow-100 text-yellow-800 border-yellow-200'
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Error',
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 border-red-200'
        };
      case 'disconnected':
      default:
        return {
          icon: WifiOff,
          text: 'Desconectado',
          variant: 'outline' as const,
          className: 'bg-gray-100 text-gray-800 border-gray-200'
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Badge 
        variant={config.variant}
        className={`flex items-center gap-2 w-fit ${config.className}`}
      >
        <Icon 
          className={`h-3 w-3 ${connectionStatus === 'connecting' || connectionStatus === 'reconnecting' ? 'animate-spin' : ''}`} 
        />
        <span className="text-xs font-medium">{config.text}</span>
      </Badge>
      
      {showDetails && (
        <div className="text-xs text-muted-foreground space-y-1">
          {sessionHash && (
            <div>Session: {sessionHash.substring(0, 8)}...</div>
          )}
          {error && (
            <div className="text-destructive">
              Error: {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Hook para obtener información de estado de conexión
export const useConnectionStatus = () => {
  const { connectionStatus, error, sessionHash, isConnected } = useSocket();
  
  const isOnline = connectionStatus === 'connected' && isConnected;
  const isConnecting = connectionStatus === 'connecting' || connectionStatus === 'reconnecting';
  const hasError = connectionStatus === 'error' || !!error;
  
  return {
    connectionStatus,
    error,
    sessionHash,
    isConnected,
    isOnline,
    isConnecting,
    hasError
  };
};

export default ConnectionStatus;
