import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (socket && socket.connected) return socket

  if (!socket) {
    // Backend server runs on 5001 per provided server code
    socket = io('http://localhost:5001', {
      transports: ['websocket'],
      autoConnect: true,
    })
  }

  return socket!
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}

export type { Socket }
