import fs from "fs";
import path from "path";

// Generate a calm, cinematic ambient soundtrack (WAV 44.1kHz 16-bit stereo)
const sampleRate = 44100;
const durationSeconds = 32; // 32s seamless loop
const totalSamples = sampleRate * durationSeconds;

const leftBuffer = new Float32Array(totalSamples);
const rightBuffer = new Float32Array(totalSamples);

// Chord progression: Fmaj9 -> Cmaj7 -> Am9 -> Gsus4 (calm, cinematic, peaceful)
// Frequencies in Hz
const chords = [
  // Fmaj9: F2 (87.31), C3 (130.81), E3 (164.81), G3 (196.00), A3 (220.00), C4 (261.63), E4 (329.63)
  [87.31, 130.81, 164.81, 196.00, 220.00, 261.63, 329.63],
  // Cmaj7: C2 (65.41), G2 (98.00), E3 (164.81), B3 (246.94), D4 (293.66), G4 (392.00)
  [65.41, 98.00, 130.81, 164.81, 246.94, 293.66, 392.00],
  // Am9: A2 (110.00), E3 (164.81), G3 (196.00), C4 (261.63), B3 (246.94), E4 (329.63)
  [110.00, 164.81, 196.00, 220.00, 246.94, 261.63, 329.63],
  // Gsus4 / G6: G2 (98.00), D3 (146.83), G3 (196.00), C4 (261.63), D4 (293.66), E4 (329.63)
  [98.00, 146.83, 196.00, 261.63, 293.66, 329.63, 392.00],
];

const chordDuration = durationSeconds / chords.length; // 8s per chord

// Sparse delicate piano / chime notes [time (s), freq (Hz), pan (-1 to 1)]
const melodyNotes = [
  { t: 1.0, f: 523.25, pan: -0.2 }, // C5
  { t: 3.5, f: 659.25, pan: 0.3 },  // E5
  { t: 5.5, f: 783.99, pan: -0.1 }, // G5
  { t: 9.0, f: 587.33, pan: 0.2 },  // D5
  { t: 11.5, f: 493.88, pan: -0.3 }, // B4
  { t: 13.5, f: 659.25, pan: 0.1 },  // E5
  { t: 17.0, f: 523.25, pan: -0.25 },// C5
  { t: 19.5, f: 440.00, pan: 0.25 }, // A4
  { t: 22.0, f: 659.25, pan: -0.1 }, // E5
  { t: 25.0, f: 587.33, pan: 0.3 },  // D5
  { t: 27.5, f: 523.25, pan: -0.2 }, // C5
  { t: 30.0, f: 392.00, pan: 0.0 },  // G4
];

for (let i = 0; i < totalSamples; i++) {
  const t = i / sampleRate;

  // 1. Ambient Warm Pad Chords with smooth crossfading
  let padL = 0;
  let padR = 0;

  for (let c = 0; c < chords.length; c++) {
    const chordCenter = (c + 0.5) * chordDuration;
    // Periodic distance for seamless looping
    let dist = Math.abs(t - chordCenter);
    if (dist > durationSeconds / 2) dist = durationSeconds - dist;
    
    // Smooth raised-cosine window for chord blend
    const window = Math.max(0, Math.cos((dist / (chordDuration * 1.3)) * Math.PI));
    if (window <= 0.001) continue;

    const freqs = chords[c];
    for (let fIdx = 0; fIdx < freqs.length; fIdx++) {
      const baseFreq = freqs[fIdx];
      // Slight detune for stereo width & warm analog chorus
      const detuneL = 1 + (fIdx % 2 === 0 ? 0.0018 : -0.0015);
      const detuneR = 1 + (fIdx % 2 === 0 ? -0.0015 : 0.002);
      
      // Slow LFO for organic breathing filter
      const lfo = 0.85 + 0.15 * Math.sin(2 * Math.PI * 0.125 * t + fIdx);
      const amp = (0.05 / Math.sqrt(freqs.length)) * window * lfo;

      // Soft sine with warm second harmonic
      const phaseL = 2 * Math.PI * baseFreq * detuneL * t;
      const phaseR = 2 * Math.PI * baseFreq * detuneR * t;

      const toneL = Math.sin(phaseL) + 0.3 * Math.sin(phaseL * 2) + 0.08 * Math.sin(phaseL * 3);
      const toneR = Math.sin(phaseR) + 0.3 * Math.sin(phaseR * 2) + 0.08 * Math.sin(phaseR * 3);

      padL += toneL * amp;
      padR += toneR * amp;
    }
  }

  // 2. Soft, warm sub-bass drone
  const subL = Math.sin(2 * Math.PI * 43.65 * t) * 0.05; // F1
  const subR = Math.sin(2 * Math.PI * 43.65 * t) * 0.05;

  // 3. Delicate Rhodes/Chime Melody notes
  let noteL = 0;
  let noteR = 0;

  for (const n of melodyNotes) {
    let dt = t - n.t;
    if (dt < 0) dt += durationSeconds; // Loop wraparound
    if (dt >= 0 && dt < 4.0) {
      // Exponential decay
      const env = Math.exp(-dt * 1.2) * (1 - Math.exp(-dt * 60)); // Fast attack, slow release
      const phase = 2 * Math.PI * n.f * dt;
      // Warm bell/tine spectrum
      const tone = (Math.sin(phase) + 0.4 * Math.sin(phase * 2) * Math.exp(-dt * 2.5) + 0.15 * Math.sin(phase * 3) * Math.exp(-dt * 4.0)) * env * 0.06;
      
      const panL = 0.5 * (1 - n.pan);
      const panR = 0.5 * (1 + n.pan);
      noteL += tone * panL;
      noteR += tone * panR;
    }
  }

  leftBuffer[i] = padL + subL + noteL;
  rightBuffer[i] = padR + subR + noteR;
}

// 4. Simple stereo reverb / delay diffusion
const delayMs1 = 380;
const delayMs2 = 540;
const delaySamples1 = Math.floor((delayMs1 / 1000) * sampleRate);
const delaySamples2 = Math.floor((delayMs2 / 1000) * sampleRate);

const outL = new Float32Array(totalSamples);
const outR = new Float32Array(totalSamples);

for (let i = 0; i < totalSamples; i++) {
  const d1Idx = (i - delaySamples1 + totalSamples) % totalSamples;
  const d2Idx = (i - delaySamples2 + totalSamples) % totalSamples;

  outL[i] = leftBuffer[i] * 0.75 + rightBuffer[d1Idx] * 0.25;
  outR[i] = rightBuffer[i] * 0.75 + leftBuffer[d2Idx] * 0.25;
}

// Normalize and write 16-bit WAV
let maxPeak = 0;
for (let i = 0; i < totalSamples; i++) {
  maxPeak = Math.max(maxPeak, Math.abs(outL[i]), Math.abs(outR[i]));
}
const normGain = maxPeak > 0 ? 0.85 / maxPeak : 1;

const wavHeader = Buffer.alloc(44);
const dataSize = totalSamples * 2 * 2; // 2 channels, 2 bytes/sample
const fileSize = 44 + dataSize - 8;

wavHeader.write("RIFF", 0);
wavHeader.writeUInt32LE(fileSize, 4);
wavHeader.write("WAVE", 8);
wavHeader.write("fmt ", 12);
wavHeader.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
wavHeader.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
wavHeader.writeUInt16LE(2, 22); // NumChannels (2)
wavHeader.writeUInt32LE(sampleRate, 24); // SampleRate
wavHeader.writeUInt32LE(sampleRate * 4, 28); // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
wavHeader.writeUInt16LE(4, 32); // BlockAlign
wavHeader.writeUInt16LE(16, 34); // BitsPerSample
wavHeader.write("data", 36);
wavHeader.writeUInt32LE(dataSize, 40);

const pcmData = Buffer.alloc(dataSize);
let offset = 0;
for (let i = 0; i < totalSamples; i++) {
  const sampleL = Math.max(-1, Math.min(1, outL[i] * normGain));
  const sampleR = Math.max(-1, Math.min(1, outR[i] * normGain));

  const intL = sampleL < 0 ? Math.floor(sampleL * 32768) : Math.floor(sampleL * 32767);
  const intR = sampleR < 0 ? Math.floor(sampleR * 32768) : Math.floor(sampleR * 32767);

  pcmData.writeInt16LE(intL, offset);
  pcmData.writeInt16LE(intR, offset + 2);
  offset += 4;
}

const audioDir = path.join(process.cwd(), "public", "audio");
if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

const outFile = path.join(audioDir, "calm-ambient.wav");
fs.writeFileSync(outFile, Buffer.concat([wavHeader, pcmData]));
console.log(`Generated calm ambient sound: ${outFile} (${(fs.statSync(outFile).size / (1024 * 1024)).toFixed(2)} MB)`);
