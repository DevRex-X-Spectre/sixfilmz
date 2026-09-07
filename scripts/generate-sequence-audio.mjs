import fs from "fs";
import path from "path";

const sampleRate = 44100;
const durationSeconds = 3.6; // 3.6s full sequence
const totalSamples = Math.floor(sampleRate * durationSeconds);

const left = new Float32Array(totalSamples);
const right = new Float32Array(totalSamples);

// Helper: Mix a sample
function addSample(tIndex, lVal, rVal) {
  if (tIndex >= 0 && tIndex < totalSamples) {
    left[tIndex] += lVal;
    right[tIndex] += rVal;
  }
}

// 1. Generate Beep at specified start time
function mixBeep(startTime, freq = 1050, duration = 0.08, volume = 0.5) {
  const startSample = Math.floor(startTime * sampleRate);
  const sampleCount = Math.floor(duration * sampleRate);

  for (let i = 0; i < sampleCount; i++) {
    const t = i / sampleRate;
    const env = Math.exp(-t * 30) * (1 - Math.exp(-t * 200));
    const tone = (Math.sin(2 * Math.PI * freq * t) + 0.15 * Math.sin(2 * Math.PI * (freq * 2) * t)) * env * volume;
    addSample(startSample + i, tone, tone);
  }
}

// 2. Generate AF-Lock Focus Chime at specified start time
function mixFocusChime(startTime, volume = 0.55) {
  const startSample = Math.floor(startTime * sampleRate);
  const sampleCount = Math.floor(0.18 * sampleRate);

  for (let i = 0; i < sampleCount; i++) {
    const t = i / sampleRate;
    const env1 = Math.exp(-t * 20) * (1 - Math.exp(-t * 300));
    const tone1 = Math.sin(2 * Math.PI * 1400 * t) * env1 * 0.35;

    let tone2 = 0;
    if (t > 0.035) {
      const dt = t - 0.035;
      const env2 = Math.exp(-dt * 22) * (1 - Math.exp(-dt * 300));
      tone2 = Math.sin(2 * Math.PI * 1880 * dt) * env2 * 0.4;
    }

    const valL = (tone1 * 0.85 + tone2 * 0.9) * volume;
    const valR = (tone1 * 0.9 + tone2 * 0.85) * volume;
    addSample(startSample + i, valL, valR);
  }
}

// 3. Generate Authentic Mechanical Camera Shutter Release (Mirror slap + Dual curtain + Chassis thud)
function mixShutter(startTime, volume = 1.0) {
  const startSample = Math.floor(startTime * sampleRate);
  const sampleCount = Math.floor(0.35 * sampleRate);

  for (let i = 0; i < sampleCount; i++) {
    const t = i / sampleRate;

    // Phase 1: Pre-shutter mirror-lift & high metallic transient (0 - 25ms)
    let preShutter = 0;
    if (t < 0.025) {
      const noise = (Math.random() * 2 - 1) * Math.exp(-t * 160);
      const click = Math.sin(2 * Math.PI * 3200 * t) * Math.exp(-t * 200);
      preShutter = (noise * 0.5 + click * 0.5) * 0.6;
    }

    // Phase 2: Front curtain mechanical release (18ms - 75ms)
    let frontCurtain = 0;
    if (t >= 0.018 && t < 0.075) {
      const dt = t - 0.018;
      const metalNoise = (Math.random() * 2 - 1) * Math.exp(-dt * 110);
      const highSnap = Math.sin(2 * Math.PI * 2600 * dt + Math.sin(dt * 800)) * Math.exp(-dt * 85);
      const midBody = Math.sin(2 * Math.PI * 700 * dt) * Math.exp(-dt * 55);
      frontCurtain = (metalNoise * 0.6 + highSnap * 0.4 + midBody * 0.3) * 0.9;
    }

    // Phase 3: Rear curtain snap & solid mirror chassis slap (60ms - 220ms)
    let rearCurtain = 0;
    if (t >= 0.06 && t < 0.24) {
      const dt = t - 0.06;
      const bodyThud = Math.sin(2 * Math.PI * 135 * dt * Math.exp(-dt * 12)) * Math.exp(-dt * 30);
      const chassisPunch = Math.sin(2 * Math.PI * 270 * dt) * Math.exp(-dt * 50);
      const impactSnap = (Math.random() * 2 - 1) * Math.exp(-dt * 130) * 0.7;
      const rattle = Math.sin(2 * Math.PI * 1900 * dt) * Math.exp(-dt * 75) * 0.3;
      rearCurtain = (bodyThud * 0.75 + chassisPunch * 0.55 + impactSnap * 0.65 + rattle * 0.35);
    }

    // Phase 4: Tension spring settle
    let settle = 0;
    if (t >= 0.16) {
      const dt = t - 0.16;
      const hum = Math.sin(2 * Math.PI * 440 * dt) * Math.exp(-dt * 25) * 0.12;
      const gear = (Math.random() * 2 - 1) * Math.exp(-dt * 40) * 0.09;
      settle = hum + gear;
    }

    const total = (preShutter + frontCurtain + rearCurtain + settle) * volume;
    addSample(startSample + i, total * 0.98, total * 1.02);
  }
}

// Mix the complete 3-2-1-Shutter sequence:
// T+0.0s: 3 (Beep)
mixBeep(0.02, 1050, 0.08, 0.65);
// T+1.0s: 2 (Beep)
mixBeep(1.0, 1050, 0.08, 0.65);
// T+2.0s: 1 (Focus chime)
mixFocusChime(2.0, 0.7);
// T+3.0s: 0 (Mechanical Shutter snap)
mixShutter(3.0, 1.0);

// Normalize and write WAV file
let maxPeak = 0;
for (let i = 0; i < totalSamples; i++) {
  maxPeak = Math.max(maxPeak, Math.abs(left[i]), Math.abs(right[i]));
}
const gain = maxPeak > 0 ? 0.92 / maxPeak : 1;

const dataSize = totalSamples * 2 * 2;
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

const pcm = Buffer.alloc(dataSize);
let offset = 0;
for (let i = 0; i < totalSamples; i++) {
  const sL = Math.max(-1, Math.min(1, left[i] * gain));
  const sR = Math.max(-1, Math.min(1, right[i] * gain));

  pcm.writeInt16LE(sL < 0 ? Math.floor(sL * 32768) : Math.floor(sL * 32767), offset);
  pcm.writeInt16LE(sR < 0 ? Math.floor(sR * 32768) : Math.floor(sR * 32767), offset + 2);
  offset += 4;
}

const outPath = path.join(process.cwd(), "public", "audio", "camera-sequence.wav");
fs.writeFileSync(outPath, Buffer.concat([header, pcm]));
console.log(`Successfully generated: ${outPath} (${(fs.statSync(outPath).size / 1024).toFixed(1)} KB)`);
