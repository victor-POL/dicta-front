import { sendDataStream } from './api/transcripcionService';

export class MediaService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioContext: AudioContext | null = null;
  private stream: MediaStream | null = null;

  async initializeMediaRecorder(hash: string): Promise<void> {
    try {
      // Get user media
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Set up AudioContext for processing if needed
      this.audioContext = new AudioContext();

      // Create MediaRecorder instance
      this.mediaRecorder = new MediaRecorder(this.stream, {
        mimeType: 'audio/webm', // or another format supported by the browser
      });

      // Send audio data when available
      this.mediaRecorder.ondataavailable = (event) => {
        const reader = new FileReader();
        reader.onload = () => {
          const arrayBuffer = reader.result;
          sendDataStream(arrayBuffer, hash);
        };
        reader.readAsArrayBuffer(event.data);
      };

      // Start recording with 1 second intervals
      this.mediaRecorder.start(1000);
    } catch (error) {
      console.error('Error initializing MediaRecorder:', error);
      throw error;
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    
    if (this.audioContext) {
      this.audioContext.close();
    }
    
    this.mediaRecorder = null;
    this.audioContext = null;
    this.stream = null;
  }

  getMediaRecorder(): MediaRecorder | null {
    return this.mediaRecorder;
  }

  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }
}