import fs from "fs";
import path from "path";

const sampleRate = 44100;

function writeWav(filePath, leftSamples, rightSamples) {
  const totalSamples = leftSamples.length;
  const dataSize = totalSamples * 2 * 2; // 2 channels, 16-bit
  const fileSize = 44 + dataSize - 8;

  const header = Buffer.alloc(44);
  header.write("RIFF", 0);
  header.writeUInt32LE(fileSize, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(2, 22); // Stereo
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(sampleRate * 4, 28);
  header.writeUInt16LE(4, 32);
  header.writeUInt16LE(16, 34);
  header.write("data", 36);
  header.writeUInt32LE(dataSize, 40);

  // Normalize
  let maxPeak = 0;
  for (let i = 0; i < totalSamples; i++) {
    maxPeak = Math.max(maxPeak, Math.abs(leftSamples[i]), Math.abs(rightSamples[i]));
  }
  const gain = maxPeak > 0 ? 0.9 / maxPeak : 1;

  const pcm = Buffer.alloc(dataSize);
  let offset = 0;
  for (let i = 0; i < totalSamples; i++) {
    const sL = Math.max(-1, Math.min(1, leftSamples[i] * gain));
    const sR = Math.max(-1, Math.min(1, rightSamples[i] * gain));

    pcm.writeInt16LE(sL < 0 ? Math.floor(sL * 32768) : Math.floor(sL * 32767), offset);
    pcm.writeInt16LE(sR < 0 ? Math.floor(sR * 32768) : Math.floor(sR * 32767), offset + 2);
    offset += 4;
  }

  fs.writeFileSync(filePath, Buffer.concat([header, pcm]));
  console.log(`Generated: ${filePath}`);
}

// 1. Generate Camera Timer Beep (80ms clean electronic beep)
function generateTimerBeep() {
  const duration = 0.08;
  const samples = Math.floor(sampleRate * duration);
  const left = new Float32Array(samples);
  const right = new Float32Array(samples);

  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * 30) * (1 - Math.exp(-t * 200));
    const tone = Math.sin(2 * Math.PI * 1050 * t) + 0.15 * Math.sin(2 * Math.PI * 2100 * t);
    left[i] = tone * env * 0.4;
    right[i] = tone * env * 0.4;
  }

  writeWav(path.join(process.cwd(), "public", "audio", "timer-beep.wav"), left, right);
}

// 2. Generate Camera Focus Lock Chime (120ms dual chime)
function generateFocusChime() {
  const duration = 0.14;
  const samples = Math.floor(sampleRate * duration);
  const left = new Float32Array(samples);
  const right = new Float32Array(samples);

  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;
    const env1 = Math.exp(-t * 22) * (1 - Math.exp(-t * 300));
    const tone1 = Math.sin(2 * Math.PI * 1400 * t) * env1 * 0.3;

    let tone2 = 0;
    if (t > 0.035) {
      const dt = t - 0.035;
      const env2 = Math.exp(-dt * 25) * (1 - Math.exp(-dt * 300));
      tone2 = Math.sin(2 * Math.PI * 1850 * dt) * env2 * 0.35;
    }

    left[i] = tone1 * 0.8 + tone2 * 0.9;
    right[i] = tone1 * 0.9 + tone2 * 0.8;
  }

  writeWav(path.join(process.cwd(), "public", "audio", "focus-lock.wav"), left, right);
}

// 3. Generate Ultra-Realistic Professional Camera Shutter (Mechanical Mirror Slap + Dual Curtain Snap)
function generateShutterSound() {
  const duration = 0.28; // 280ms full shutter cycle
  const samples = Math.floor(sampleRate * duration);
  const left = new Float32Array(samples);
  const right = new Float32Array(samples);

  for (let i = 0; i < samples; i++) {
    const t = i / sampleRate;

    // --- Phase 1: Pre-shutter mirror lift & lever release (0 to 25ms) ---
    let preShutter = 0;
    if (t < 0.025) {
      const noise = (Math.random() * 2 - 1) * Math.exp(-t * 180);
      const ping = Math.sin(2 * Math.PI * 3400 * t) * Math.exp(-t * 220);
      preShutter = (noise * 0.4 + ping * 0.6) * 0.5;
    }

    // --- Phase 2: Front curtain snap & high-speed mechanical release (18ms to 60ms) ---
    let frontCurtain = 0;
    if (t >= 0.018 && t < 0.075) {
      const dt = t - 0.018;
      // Sharp metallic transient
      const metalNoise = (Math.random() * 2 - 1) * Math.exp(-dt * 120);
      const highClick = Math.sin(2 * Math.PI * 2600 * dt + Math.sin(dt * 800)) * Math.exp(-dt * 90);
      const midBody = Math.sin(2 * Math.PI * 680 * dt) * Math.exp(-dt * 60);
      frontCurtain = (metalNoise * 0.55 + highClick * 0.35 + midBody * 0.25) * 0.85;
    }

    // --- Phase 3: Rear curtain snap & heavy chassis arrest (65ms to 180ms) ---
    let rearCurtain = 0;
    if (t >= 0.065 && t < 0.22) {
      const dt = t - 0.065;
      // Solid mechanical mirror-down & rear curtain impact
      const bodyThud = Math.sin(2 * Math.PI * 135 * dt * Math.exp(-dt * 15)) * Math.exp(-dt * 35);
      const chassisPunch = Math.sin(2 * Math.PI * 280 * dt) * Math.exp(-dt * 55);
      const impactSnap = (Math.random() * 2 - 1) * Math.exp(-dt * 140) * 0.6;
      const metalRattle = Math.sin(2 * Math.PI * 1800 * dt) * Math.exp(-dt * 80) * 0.25;

      rearCurtain = (bodyThud * 0.7 + chassisPunch * 0.5 + impactSnap * 0.6 + metalRattle * 0.3) * 1.0;
    }

    // --- Phase 4: Subtle motor/spring tension settle (160ms to 270ms) ---
    let motorSettle = 0;
    if (t >= 0.16) {
      const dt = t - 0.16;
      const hum = Math.sin(2 * Math.PI * 450 * dt) * Math.exp(-dt * 25) * 0.1;
      const gear = (Math.random() * 2 - 1) * Math.exp(-dt * 45) * 0.08;
      motorSettle = hum + gear;
    }

    // Composite Stereo with slight spatial separation
    const total = preShutter + frontCurtain + rearCurtain + motorSettle;
    left[i] = total * (1 + 0.04 * Math.sin(t * 100));
    right[i] = total * (1 - 0.04 * Math.sin(t * 100));
  }

  writeWav(path.join(process.cwd(), "public", "audio", "camera-shutter.wav"), left, right);
}

generateTimerBeep();
generateFocusChime();
generateShutterSound();
