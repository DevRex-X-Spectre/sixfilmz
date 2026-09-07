export type AudioState = "uninitialized" | "ready" | "blocked" | "error";

const AUDIO_PATHS = {
  shutter: "/audio/camera-shutter.wav",
  focus: "/audio/focus-lock.wav",
  beep: "/audio/timer-beep.wav",
} as const;

class CameraAudioService {
  private state: AudioState = "uninitialized";
  private initialized = false;

  private shutterAudio: HTMLAudioElement | null = null;
  private focusAudio: HTMLAudioElement | null = null;
  private beepAudio: HTMLAudioElement | null = null;

  private createAudio(src: string, volume: number) {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = volume;
    audio.load();
    return audio;
  }

  initialize() {
    if (typeof window === "undefined" || this.initialized) return;

    this.shutterAudio = this.createAudio(AUDIO_PATHS.shutter, 1);
    this.focusAudio = this.createAudio(AUDIO_PATHS.focus, 0.8);
    this.beepAudio = this.createAudio(AUDIO_PATHS.beep, 0.7);

    this.initialized = true;
    this.state = "ready";
  }

  preload() {
    this.initialize();

    this.shutterAudio?.load();
    this.focusAudio?.load();
    this.beepAudio?.load();
  }

  async playShutter() {
    this.initialize();

    if (!this.shutterAudio) return false;

    try {
      this.shutterAudio.pause();
      this.shutterAudio.currentTime = 0;
      await this.shutterAudio.play();

      this.state = "ready";
      return true;
    } catch (error) {
      if (error instanceof DOMException && error.name === "NotAllowedError") {
        this.state = "blocked";
      } else {
        this.state = "error";
      }

      console.warn("[CameraAudio] Shutter playback failed:", error);
      return false;
    }
  }

  async playFocus() {
    this.initialize();

    if (!this.focusAudio) return false;

    try {
      this.focusAudio.pause();
      this.focusAudio.currentTime = 0;
      await this.focusAudio.play();
      return true;
    } catch (error) {
      console.warn("[CameraAudio] Focus playback failed:", error);
      return false;
    }
  }

  async playBeep() {
    this.initialize();

    if (!this.beepAudio) return false;

    try {
      this.beepAudio.pause();
      this.beepAudio.currentTime = 0;
      await this.beepAudio.play();
      return true;
    } catch (error) {
      console.warn("[CameraAudio] Beep playback failed:", error);
      return false;
    }
  }

  stopAll() {
    const audios = [
      this.shutterAudio,
      this.focusAudio,
      this.beepAudio,
    ];

    for (const audio of audios) {
      if (!audio) continue;

      audio.pause();
      audio.currentTime = 0;
    }
  }

  getState() {
    return this.state;
  }
}

export const cameraAudio = new CameraAudioService();
