// SixFilmz Production Camera Audio Service
// Dedicated, lightweight HTMLAudioElement controller for camera sound effects

const AUDIO_PATHS = {
  shutter: "/audio/camera-shutter.wav",
  focus: "/audio/focus-lock.wav",
  beep: "/audio/timer-beep.wav",
} as const;

class CameraAudioService {
  private isInitialized = false;

  // Single authoritative audio elements for camera effects
  private shutterAudio: HTMLAudioElement | null = null;
  private focusAudio: HTMLAudioElement | null = null;
  private beepAudio: HTMLAudioElement | null = null;

  private log(message: string, ...args: unknown[]) {
    if (import.meta.env.DEV) {
      console.log(`[CameraAudio] ${message}`, ...args);
    }
  }

  private warn(message: string, ...args: unknown[]) {
    if (import.meta.env.DEV) {
      console.warn(`[CameraAudio] ${message}`, ...args);
    }
  }

  private createAudio(src: string, volume: number): HTMLAudioElement {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = volume;
    audio.load();
    return audio;
  }

  /**
   * SSR-safe, idempotent initialization of all camera sound assets.
   */
  public initialize(): void {
    if (typeof window === "undefined" || this.isInitialized) return;

    try {
      this.shutterAudio = this.createAudio(AUDIO_PATHS.shutter, 1.0);
      this.focusAudio = this.createAudio(AUDIO_PATHS.focus, 0.8);
      this.beepAudio = this.createAudio(AUDIO_PATHS.beep, 0.75);

      this.isInitialized = true;
      this.log("initialized & assets preloaded");
    } catch (err) {
      this.warn("Failed to initialize camera audio elements:", err);
    }
  }

  /**
   * Explicit preload trigger.
   */
  public preload(): void {
    if (!this.isInitialized) {
      this.initialize();
    }
  }

  /**
   * Plays the countdown interval beep (0.0s and 1.0s).
   */
  public async playBeep(): Promise<boolean> {
    if (typeof window === "undefined") return false;
    this.initialize();
    if (!this.beepAudio) return false;

    try {
      this.beepAudio.currentTime = 0;
      this.beepAudio.volume = 0.75;
      await this.beepAudio.play();
      this.log("beep played");
      return true;
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === "NotAllowedError") {
        this.log("beep autoplay blocked by browser policy");
      } else {
        this.warn("Beep playback error:", error);
      }
      return false;
    }
  }

  /**
   * Plays the autofocus lock confirmation chime (2.0s).
   */
  public async playFocus(): Promise<boolean> {
    if (typeof window === "undefined") return false;
    this.initialize();
    if (!this.focusAudio) return false;

    try {
      this.focusAudio.currentTime = 0;
      this.focusAudio.volume = 0.8;
      await this.focusAudio.play();
      this.log("focus lock chime played");
      return true;
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === "NotAllowedError") {
        this.log("focus chime autoplay blocked by browser policy");
      } else {
        this.warn("Focus chime playback error:", error);
      }
      return false;
    }
  }

  /**
   * Plays the mechanical camera shutter release sound (3.0s or immediate on tap/click).
   */
  public async playShutter(): Promise<boolean> {
    if (typeof window === "undefined") return false;
    this.initialize();
    if (!this.shutterAudio) return false;

    try {
      this.shutterAudio.currentTime = 0;
      this.shutterAudio.volume = 1.0;
      await this.shutterAudio.play();
      this.log("shutter sound played");
      return true;
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === "NotAllowedError") {
        this.log("shutter autoplay blocked by browser policy");
      } else {
        this.warn("Shutter playback error:", error);
      }
      return false;
    }
  }

  /**
   * Immediately stops all camera sound effects.
   */
  public stopAll(): void {
    if (this.shutterAudio) {
      this.shutterAudio.pause();
      this.shutterAudio.currentTime = 0;
    }
    if (this.focusAudio) {
      this.focusAudio.pause();
      this.focusAudio.currentTime = 0;
    }
    if (this.beepAudio) {
      this.beepAudio.pause();
      this.beepAudio.currentTime = 0;
    }
    this.log("all camera sounds stopped");
  }
}

export const cameraAudio = new CameraAudioService();
