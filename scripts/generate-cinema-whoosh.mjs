import fs from "fs";
import path from "path";

/**
 * High-definition 44.1kHz Stereo WAV Writer
 */
function writeStereoWav(filename, leftSamples, rightSamples, sampleRate = 44100) {
  const numChannels = 2;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const totalSamples = leftSamples.length;
  const dataSize = totalSamples * numChannels * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);

  // fmt chunk
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);

  // data chunk
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  let offset = 44;
  for (let i = 0; i < totalSamples; i++) {
    // Left channel
    const sl = Math.max(-1, Math.min(1, leftSamples[i]));
    const valL = sl < 0 ? sl * 0x8000 : sl * 0x7fff;
    buffer.writeInt16LE(Math.floor(valL), offset);
    offset += 2;

    // Right channel
    const sr = Math.max(-1, Math.min(1, rightSamples[i]));
    const valR = sr < 0 ? sr * 0x8000 : sr * 0x7fff;
    buffer.writeInt16LE(Math.floor(valR), offset);
    offset += 2;
  }

  fs.writeFileSync(filename, buffer);
}

// Generate an ultra-cinematic blockbuster trailer sub-bass braam + pneumatic riser + titanium aperture shutter snap + low-end rumble
const sampleRate = 44100;
const duration = 1.35; // 1.35 seconds for full cinematic tail
const totalSamples = Math.floor(sampleRate * duration);

const left = new Float32Array(totalSamples);
const right = new Float32Array(totalSamples);

// Simple pink noise generator with state
let b0_L = 0, b1_L = 0, b2_L = 0;
let b0_R = 0, b1_R = 0, b2_R = 0;

function getPinkNoiseL() {
  const white = Math.random() * 2 - 1;
  b0_L = 0.99886 * b0_L + white * 0.0555179;
  b1_L = 0.99332 * b1_L + white * 0.0750759;
  b2_L = 0.96900 * b2_L + white * 0.1538520;
  return b0_L + b1_L + b2_L + white * 0.5362;
}

function getPinkNoiseR() {
  const white = Math.random() * 2 - 1;
  b0_R = 0.99886 * b0_R + white * 0.0555179;
  b1_R = 0.99332 * b1_R + white * 0.0750759;
  b2_R = 0.96900 * b2_R + white * 0.1538520;
  return b0_R + b1_R + b2_R + white * 0.5362;
}

// Resonant lowpass state
let filterStateL = 0;
let filterStateR = 0;

for (let i = 0; i < totalSamples; i++) {
  const t = i / sampleRate;
  const progress = i / totalSamples;

  // --- LAYER 1: Infrasonic & Sub-Bass Impact Braam (Hans Zimmer style) ---
  // Starts at punchy 95Hz and bends down to 32Hz sub rumble
  let subDrop = 0;
  if (t >= 0.08) {
    const impactT = t - 0.08;
    const freq = 32 + (95 - 32) * Math.exp(-impactT * 4.5);
    const subEnv = Math.exp(-impactT * 2.8);
    // Fundamental + 2nd harmonic saturation
    const rawSub = Math.sin(2 * Math.PI * freq * impactT) * 0.75 +
                   Math.sin(4 * Math.PI * freq * impactT) * 0.25;
    // Warm analog saturation curve (tanh)
    subDrop = Math.tanh(rawSub * 1.8) * subEnv * 0.85;
  }

  // --- LAYER 2: Anamorphic Air Rush / Pneumatic Vacuum Riser (Stereo) ---
  // A whooshing cinematic suction before and during the snap (t=0 to 0.45s)
  let airL = 0;
  let airR = 0;
  if (t < 0.6) {
    const airEnv = Math.sin((t / 0.6) * Math.PI) ** 1.8;
    const cutoff = 400 + Math.sin(t * 8) * 200 + (t / 0.6) * 1200;
    const alpha = Math.min(0.9, (2 * Math.PI * cutoff) / sampleRate);
    
    const pL = getPinkNoiseL() * 0.15;
    const pR = getPinkNoiseR() * 0.15;

    filterStateL += alpha * (pL - filterStateL);
    filterStateR += alpha * (pR - filterStateR);

    airL = filterStateL * airEnv * 0.7;
    airR = filterStateR * airEnv * 0.7;
  }

  // --- LAYER 3: Titanium Mechanical Camera Shutter / Iris Aperture Latch ---
  // Ultra-crisp dual-stage mechanical snap at t = 0.09s and secondary catch at t = 0.14s
  let clickL = 0;
  let clickR = 0;
  if (t >= 0.085 && t <= 0.35) {
    const snapT = t - 0.085;
    // High-frequency titanium metallic blade impact (2.8kHz + 4.2kHz)
    const bladeImpact = (
      Math.sin(2 * Math.PI * 2850 * snapT) * 0.6 +
      Math.sin(2 * Math.PI * 4200 * snapT) * 0.4
    ) * Math.exp(-snapT * 95);

    // Body resonance (580Hz + 820Hz chamber)
    const chamberBody = (
      Math.sin(2 * Math.PI * 580 * snapT) * 0.5 +
      Math.sin(2 * Math.PI * 820 * snapT) * 0.5
    ) * Math.exp(-snapT * 45);

    // Secondary shutter blade catch at +0.055s
    let catchSound = 0;
    if (snapT >= 0.055) {
      const cT = snapT - 0.055;
      catchSound = Math.sin(2 * Math.PI * 1950 * cT) * Math.exp(-cT * 80) * 0.45;
    }

    const totalMech = (bladeImpact * 0.65 + chamberBody * 0.35 + catchSound * 0.4);
    clickL = totalMech * 0.75;
    clickR = totalMech * 0.7; // slight stereo offset
  }

  // --- LAYER 4: Low-Frequency Cinematic Sub Resonator Tail ---
  // Warm sub-bass rumble reverberating through the acoustic space
  const tailEnv = Math.exp(-t * 2.1);
  const rumble = Math.sin(2 * Math.PI * 40 * t) * tailEnv * 0.28;

  // Master Stereo Mix
  const mixL = subDrop * 0.7 + airL * 0.5 + clickL * 0.65 + rumble * 0.4;
  const mixR = subDrop * 0.7 + airR * 0.5 + clickR * 0.65 + rumble * 0.4;

  // Soft peak limiting
  left[i] = Math.tanh(mixL * 1.15) * 0.95;
  right[i] = Math.tanh(mixR * 1.15) * 0.95;
}

const outDir = path.join(process.cwd(), "public", "audio");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const outFile = path.join(outDir, "cinema-whoosh.wav");
writeStereoWav(outFile, left, right, sampleRate);
console.log(`Generated ultra-cinematic audio: ${outFile} (${totalSamples} stereo samples, ${duration}s)`);
