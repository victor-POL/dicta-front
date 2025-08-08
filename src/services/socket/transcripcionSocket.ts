import type { Segment } from "@/models/transcripcionModels";
import { getSocket, type Socket } from "./ioClient";
import { setCaseId } from "@/services/sessionStore";

let socket: Socket | null = null;

export function connectTranscripcionSocket(onMessage: (segment: Segment) => void, _hash: string) {
  if (!socket) socket = getSocket();

  const subscribe = () => {
    const unique_id = socket?.id;
    if (unique_id) {
      socket!.emit('subscribe_to_messages', { unique_id });
    }
  };

  if (socket.connected) {
    subscribe();
  } else {
    socket.on('connect', subscribe);
  }

  // Optional: listen for backend connection confirmation and subscription status
  socket.on('connection_confirmed', (data: unknown) => {
    console.log('WS connection confirmed', data)
  })
  socket.on('subscription_status', (data: unknown) => {
    console.log('Subscription status', data)
  })
  socket.on('error', (data: unknown) => {
    console.error('WS error', data)
  })

  // Listen to transcription segments if provided
  socket.on('transcription_segment', (segment: Segment) => {
    onMessage(segment);
  });

  // Also listen to final success event which may include segments array
  socket.on('audio_transcribe_success', (payload: any) => {
      try {
        const caseId: string | undefined = payload?.ai_case?.case_id
        const audioHash: string | undefined = payload?.audio_hash
        if (caseId && audioHash) {
          setCaseId(audioHash, caseId)
        }
        if (Array.isArray(payload?.segments)) {
          payload.segments.forEach(onMessage)
        }
      } catch (e) {
        // ignore
      }
  });
}

export function closeTranscripcionSocket() {
  if (socket) {
    const unique_id = socket.id
    if (unique_id) {
      socket.emit('unsubscribe_from_messages', { unique_id })
    }
    socket.off('transcription_segment');
    socket.off('audio_transcribe_success');
  socket.off('connect');
  socket.off('connection_confirmed');
  socket.off('subscription_status');
  socket.off('error');
  }
}