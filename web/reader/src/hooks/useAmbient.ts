import { useEffect, useRef } from "react";
import { useReaderStore } from "../store";

const DUCK_VOLUME = 0.15;

// ─── Noise buffers ────────────────────────────────────────────────────────────

function makeWhiteNoise(ctx: AudioContext): AudioBufferSourceNode {
  const len = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  return src;
}

function makePinkNoise(ctx: AudioContext): AudioBufferSourceNode {
  const len = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0;
  for (let i = 0; i < len; i++) {
    const w = Math.random() * 2 - 1;
    b0 = 0.99886*b0 + w*0.0555179; b1 = 0.99332*b1 + w*0.0750759;
    b2 = 0.96900*b2 + w*0.1538520; b3 = 0.86650*b3 + w*0.3104856;
    b4 = 0.55000*b4 + w*0.5329522; b5 = -0.7616*b5 - w*0.0168980;
    d[i] = (b0+b1+b2+b3+b4+b5+b6 + w*0.5362) * 0.11;
    b6 = w * 0.115926;
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  return src;
}

function makeBrownNoise(ctx: AudioContext): AudioBufferSourceNode {
  const len = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  let last = 0;
  for (let i = 0; i < len; i++) {
    last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
    d[i] = last * 3.5;
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;
  return src;
}

// Modulate an AudioParam between minVal and maxVal with a slow sine LFO.
// Sets param.value = midpoint; returns stop function.
function lfoMod(
  ctx: AudioContext,
  param: AudioParam,
  minVal: number,
  maxVal: number,
  periodSec: number,
): () => void {
  const mid = (minVal + maxVal) / 2;
  const depth = (maxVal - minVal) / 2;
  param.value = mid;

  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.value = 1 / periodSec;

  const gain = ctx.createGain();
  gain.gain.value = depth;

  osc.connect(gain);
  gain.connect(param);  // adds LFO output to param's intrinsic value
  osc.start();
  return () => { try { osc.stop(); } catch {} };
}

// ─── Track builders ───────────────────────────────────────────────────────────

type Stopper = () => void;

function buildRain(ctx: AudioContext, out: GainNode): Stopper {
  const noise = makeWhiteNoise(ctx);

  const hp = ctx.createBiquadFilter();
  hp.type = "highpass"; hp.frequency.value = 400; hp.Q.value = 0.5;

  const shape = ctx.createBiquadFilter();
  shape.type = "peaking"; shape.frequency.value = 1400;
  shape.gain.value = 6; shape.Q.value = 1;

  const env = ctx.createGain();
  const stopLfo = lfoMod(ctx, env.gain, 0.55, 1.0, 4.5);

  noise.connect(hp); hp.connect(shape); shape.connect(env); env.connect(out);
  noise.start();
  return () => { stopLfo(); noise.stop(); };
}

function buildForest(ctx: AudioContext, out: GainNode): Stopper {
  // Wind layer
  const wind = makePinkNoise(ctx);
  const windLp = ctx.createBiquadFilter();
  windLp.type = "lowpass"; windLp.frequency.value = 700; windLp.Q.value = 0.3;
  const windGain = ctx.createGain();
  const stopWindLfo = lfoMod(ctx, windGain.gain, 0.2, 0.7, 8);
  wind.connect(windLp); windLp.connect(windGain); windGain.connect(out);
  wind.start();

  // Leaf shimmer
  const leaves = makeWhiteNoise(ctx);
  const leafBp = ctx.createBiquadFilter();
  leafBp.type = "bandpass"; leafBp.frequency.value = 3500; leafBp.Q.value = 2;
  const leafGain = ctx.createGain();
  const stopLeafLfo = lfoMod(ctx, leafGain.gain, 0.04, 0.18, 3.2);
  leaves.connect(leafBp); leafBp.connect(leafGain); leafGain.connect(out);
  leaves.start();

  return () => { stopWindLfo(); stopLeafLfo(); wind.stop(); leaves.stop(); };
}

function buildBeach(ctx: AudioContext, out: GainNode): Stopper {
  // Wave swell
  const wave = makeBrownNoise(ctx);
  const waveLp = ctx.createBiquadFilter();
  waveLp.type = "lowpass"; waveLp.frequency.value = 550; waveLp.Q.value = 0.4;
  const waveGain = ctx.createGain();
  const stopWaveLfo = lfoMod(ctx, waveGain.gain, 0.08, 0.85, 7);
  wave.connect(waveLp); waveLp.connect(waveGain); waveGain.connect(out);
  wave.start();

  // Breeze
  const breeze = makePinkNoise(ctx);
  const breezeHp = ctx.createBiquadFilter();
  breezeHp.type = "highpass"; breezeHp.frequency.value = 1200;
  const breezeGain = ctx.createGain();
  breezeGain.gain.value = 0.15;
  breeze.connect(breezeHp); breezeHp.connect(breezeGain); breezeGain.connect(out);
  breeze.start();

  return () => { stopWaveLfo(); wave.stop(); breeze.stop(); };
}

function buildCafe(ctx: AudioContext, out: GainNode): Stopper {
  // Low rumble
  const rumble = makeBrownNoise(ctx);
  const rumbleLp = ctx.createBiquadFilter();
  rumbleLp.type = "lowpass"; rumbleLp.frequency.value = 280;
  const rumbleGain = ctx.createGain();
  rumbleGain.gain.value = 0.3;
  rumble.connect(rumbleLp); rumbleLp.connect(rumbleGain); rumbleGain.connect(out);
  rumble.start();

  // Chatter
  const chat = makePinkNoise(ctx);
  const chatBp = ctx.createBiquadFilter();
  chatBp.type = "bandpass"; chatBp.frequency.value = 1000; chatBp.Q.value = 1.2;
  const chatGain = ctx.createGain();
  const stopChatLfo = lfoMod(ctx, chatGain.gain, 0.15, 0.5, 5.5);
  chat.connect(chatBp); chatBp.connect(chatGain); chatGain.connect(out);
  chat.start();

  return () => { stopChatLfo(); rumble.stop(); chat.stop(); };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAmbient() {
  const ambientTrack  = useReaderStore((s) => s.ambientTrack);
  const ambientVolume = useReaderStore((s) => s.ambientVolume);
  const ambientDucked = useReaderStore((s) => s.ambientDucked);

  const ctxRef        = useRef<AudioContext | null>(null);
  const masterRef     = useRef<GainNode | null>(null);
  const stopRef       = useRef<Stopper | null>(null);

  function ensureCtx(): { ctx: AudioContext; master: GainNode } {
    if (!ctxRef.current) {
      const ctx = new AudioContext();
      const master = ctx.createGain();
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume().catch(() => {});
    }
    return { ctx: ctxRef.current, master: masterRef.current! };
  }

  // Track switch
  useEffect(() => {
    if (stopRef.current) { try { stopRef.current(); } catch {} stopRef.current = null; }
    if (ambientTrack === "none") return;

    const { ctx, master } = ensureCtx();
    master.gain.value = ambientDucked ? DUCK_VOLUME * ambientVolume : ambientVolume;

    switch (ambientTrack) {
      case "rain":         stopRef.current = buildRain(ctx, master);   break;
      case "forest":       stopRef.current = buildForest(ctx, master); break;
      case "beach-breeze": stopRef.current = buildBeach(ctx, master);  break;
      case "cafe-garden":  stopRef.current = buildCafe(ctx, master);   break;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ambientTrack]);

  // Volume / duck
  useEffect(() => {
    if (masterRef.current) {
      masterRef.current.gain.value = ambientDucked
        ? DUCK_VOLUME * ambientVolume
        : ambientVolume;
    }
  }, [ambientVolume, ambientDucked]);

  // Unmount cleanup
  useEffect(() => () => {
    if (stopRef.current) { try { stopRef.current(); } catch {} }
    ctxRef.current?.close().catch(() => {});
    ctxRef.current = null;
  }, []);
}
