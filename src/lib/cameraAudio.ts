// SixFilmz Production Camera Audio Service
// One authoritative source of truth for all camera-related audio

export type AudioState =
  | "uninitialized"
  | "ready"
  | "blocked"
  | "unlocked"
  | "error";

const AUDIO_PATHS = {
  sequence: "/audio/camera-sequence.wav",
  shutter: "/audio/camera-shutter.wav",
  focus: "/audio/focus-lock.wav",
  beep: "/audio/timer-beep.wav",
} as const;

class CameraAudioService {
  private state: AudioState = "uninitialized";
  private isInitialized = false;

  // Single authoritative audio elements
  private sequenceAudio: HTMLAudioElement | null = null;
  private shutterAudio: HTMLAudioElement | null = null;
  private focusAudio: HTMLAudioElement | null = null;
  private beepAudio: HTMLAudioElement | null = null;

  // Single AudioContext for browser unlocking and hardware clock
  private audioCtx: AudioContext | null = null;

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

  private createAudioElement(src: string, volume: number): HTMLAudioElement {
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = volume;
    // Load asset into browser memory cache
    audio.load();
    return audio;
  }

  /**
   * SSR-safe, idempotent initialization of all camera audio resources.
   */
  public initialize(): void {
    if (typeof window === "undefined" || this.isInitialized) return;

    try {
      this.sequenceAudio = this.createAudioElement(AUDIO_PATHS.sequence, 1.0);
      this.shutterAudio = this.createAudioElement(AUDIO_PATHS.shutter, 1.0);
      this.focusAudio = this.createAudioElement(AUDIO_PATHS.focus, 0.75);
      this.beepAudio = this.createAudioElement(AUDIO_PATHS.beep, 0.7);

      this.isInitialized = true;
      this.state = "ready";
      this.log("initialized & assets preloaded");
    } catch (err) {
      this.state = "error";
      this.warn("Failed to initialize audio subsystem:", err);
    }
  }

  /**
   * Preload audio buffers explicitly.
   */
  public preload(): void {
    if (!this.isInitialized) {
      this.initialize();
    }
  }

  /**
   * Returns or creates the singleton AudioContext.
   */
  public getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;

    if (!this.audioCtx) {
      try {
        const AudioCtxClass =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext;
        if (AudioCtxClass) {
          this.audioCtx = new AudioCtxClass();
        }
      } catch (err) {
        this.warn("AudioContext not supported or creation failed:", err);
      }
    }
    return this.audioCtx;
  }

  /**
   * Unlocks AudioContext and media subsystem upon valid user interaction.
   */
  public async unlock(): Promise<boolean> {
    if (typeof window === "undefined") return false;

    if (!this.isInitialized) {
      this.initialize();
    }

    const ctx = this.getContext();
    if (ctx && ctx.state === "suspended") {
      try {
        await ctx.resume();
      } catch (err) {
        this.warn("Failed to resume AudioContext during unlock:", err);
      }
    }

    const isRunning = ctx ? ctx.state === "running" : true;
    if (isRunning) {
      this.state = "unlocked";
      this.log("audio unlocked via user gesture");
    }
    return isRunning;
  }

  /**
   * Check if global mute is active.
   */
  private isMuted(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("musicPlaying") === "false";
  }

  /**
   * Plays the complete 3.6s camera countdown + shutter sequence.
   * Resolves to true if playback starts (autoplay allowed), false if blocked by browser policy.
   */
  public async playSequence(): Promise<boolean> {
    if (typeof window === "undefined" || this.isMuted()) return false;

    this.initialize();
    if (!this.sequenceAudio) return false;

    try {
      this.sequenceAudio.currentTime = 0;
      this.sequenceAudio.volume = 1.0;
      await this.sequenceAudio.play();
      this.state = "unlocked";
      this.log("autoplay allowed: sequence playing");
      return true;
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === "NotAllowedError") {
        this.state = "blocked";
        this.log("autoplay blocked by browser policy (awaiting user gesture)");
      } else {
        this.warn("Sequence playback error:", error);
      }
      return false;
    }
  }

  /**
   * Immediately plays the mechanical shutter sound (used on click/tap or shutter phase).
   */
  public async playShutter(): Promise<boolean> {
    if (typeof window === "undefined" || this.isMuted()) return false;

    this.initialize();
    this.unlock();

    // Stop sequence audio to prevent duplicate sound
    if (this.sequenceAudio && !this.sequenceAudio.paused) {
      this.sequenceAudio.pause();
      this.sequenceAudio.currentTime = 0;
    }

    if (!this.shutterAudio) return false;

    try {
      this.shutterAudio.currentTime = 0;
      this.shutterAudio.volume = 1.0;
      await this.shutterAudio.play();
      this.log("shutter played");
      return true;
    } catch (err) {
      this.warn("Shutter playback failed:", err);
      return false;
    }
  }

  /**
   * Plays the focus-lock confirmation chime.
   */
  public async playFocus(): Promise<boolean> {
    if (typeof window === "undefined" || this.isMuted()) return false;

    this.initialize();
    if (!this.focusAudio) return false;

    try {
      this.focusAudio.currentTime = 0;
      this.focusAudio.volume = 0.75;
      await this.focusAudio.play();
      return true;
    } catch (err) {
      this.warn("Focus chime playback failed:", err);
      return false;
    }
  }

  /**
   * Plays the countdown interval beep.
   */
  public async playBeep(): Promise<boolean> {
    if (typeof window === "undefined" || this.isMuted()) return false;

    this.initialize();
    if (!this.beepAudio) return false;

    try {
      this.beepAudio.currentTime = 0;
      this.beepAudio.volume = 0.7;
      await this.beepAudio.play();
      return true;
    } catch (err) {
      this.warn("Beep playback failed:", err);
      return false;
    }
  }

  /**
   * Halts all camera audio immediately.
   */
  public stopAll(): void {
    if (this.sequenceAudio) {
      this.sequenceAudio.pause();
      this.sequenceAudio.currentTime = 0;
    }
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

  /**
   * Returns current audio state machine state.
   */
  public getState(): AudioState {
    return this.state;
  }
}

export const cameraAudio = new CameraAudioService();
