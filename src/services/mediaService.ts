import { sendDataStream, stopDataStream } from './api/transcripcionService';

export class MediaService {
  private mediaRecorder: MediaRecorder | null = null;
  private audioContext: AudioContext | null = null;
  private stream: MediaStream | null = null;
  private isRecording = false;
  private activeReaders = new Set<FileReader>();
  private sessionToken: string | null = null;

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
      this.mediaRecorder.onstop = () => {
        const tracks = this.stream?.getTracks();
        // When all tracks have been stopped the stream will
        // no longer be active and release any permissioned input
        tracks?.forEach(track => track.stop());
      };


      this.sessionToken = crypto.randomUUID();
      const activeToken = this.sessionToken;

      // Send audio data when available
      this.mediaRecorder.ondataavailable = (event) => {
        if (!this.isRecording || this.sessionToken !== activeToken) {
          console.log("Ignoring data chunk - recording stopped or session changed");
          return;
        }
        const reader = new FileReader();
        this.activeReaders.add(reader);
        reader.onloadend = () => {
          this.activeReaders.delete(reader);
        };
        reader.onerror = () => {
          this.activeReaders.delete(reader);
        };
        reader.onload = () => {
          // Double-check recording state before sending
          if (!this.isRecording || this.sessionToken !== activeToken) {
            console.log("Ignoring loaded chunk - recording stopped during file read");
            return;
          }
          const arrayBuffer = reader.result;
          console.log("Sending audio data chunk for hash:", hash);
          sendDataStream(arrayBuffer, hash);
        };
        reader.readAsArrayBuffer(event.data);
      };

      // Start recording with 1 second intervals
      this.mediaRecorder.start(1000);
      this.isRecording = true;
    } catch (error) {
      console.error('Error initializing MediaRecorder:', error);
      throw error;
    }
  }

  stopRecording(hash: string): void {
    console.log("Stopping recording for hash:", hash);
    
    // FIRST: Immediately disable recording flag and clear token
    this.isRecording = false;
    this.sessionToken = null;

    // SECOND: Stop and clean up MediaRecorder (this removes the recording indicator)
    const recorder = this.mediaRecorder;

    if (recorder) {
      recorder.stop();
      console.log("Stopping recorder:", recorder);
      // Remove handler immediately to prevent any new events from being processed
      recorder.ondataavailable = null;
      recorder.onstop = null;
      recorder.onerror = null;
      recorder.onstart = null;
      recorder.onpause = null;
      recorder.onresume = null;
      
      if (recorder.state !== 'inactive') {
        recorder.stop();
      }
    }
    this.mediaRecorder = null;
    
    // THIRD: Stop all media stream tracks (microphone)
    if (this.stream) {
      this.stream.getTracks().forEach(track => {
        console.log("Stopping microphone track, enabled:", track.enabled, "readyState:", track.readyState);
        track.stop();
      });
      this.stream = null;
    }
    
    // FOURTH: Abort any pending FileReaders
    this.activeReaders.forEach(reader => {
      if (reader.readyState === FileReader.LOADING) {
        reader.abort();
      }
      reader.onload = null;
      reader.onloadend = null;
      reader.onerror = null;
    });
    this.activeReaders.clear();
    
    // FIFTH: Clean up AudioContext
    if (this.audioContext) {
      this.audioContext.close().catch((error) => {
        console.warn('Error closing AudioContext:', error);
      });
      this.audioContext = null;
    }
    
    // SIXTH: Stop the data stream to backend
    stopDataStream(hash);
    
    console.log("Recording fully stopped for hash:", hash);
  }

  getMediaRecorder(): MediaRecorder | null {
    return this.mediaRecorder;
  }

  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }
}