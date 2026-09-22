import { useRef, useEffect } from 'react';

export interface WaveformParams {
  type: 'ecg' | 'eeg' | 'emg' | 'pressure' | 'flow' | 'spo2' | 'none';
  gain: number;
  hpf: number;
  lpf: number;
  notch: boolean;
  rhythm?: string;
  state?: string;
  fault?: string;
  speed: number;
  heartRate?: number;
  respRate?: number;
  spo2?: number;
  contraction?: number;
  etco2?: number;
  fhr?: number;
}

export function WaveformCanvas({ params, width = 600, height = 200 }: { params: WaveformParams; width?: number; height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    let lastTime = performance.now();

    const draw = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      const speedFactor = (params.speed || 25) / 25;

      ctx.clearRect(0, 0, width, height);

      // Background grid
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center line
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Generate waveform
      ctx.strokeStyle = '#0d9488';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const centerY = height / 2;
      const pixelsPerSecond = 100 * speedFactor;
      const samplesPerPx = 2;
      const totalSamples = width * samplesPerPx;
      const phase = phaseRef.current;

      for (let i = 0; i < totalSamples; i++) {
        const x = i / samplesPerPx;
        const t = (i / samplesPerPx) / pixelsPerSecond + phase;
        let y = 0;

        y = generateSample(params, t);

        // Apply gain
        y *= params.gain / 10;

        // Apply fault effects
        if (params.fault === 'electrical-noise' || params.fault === 'line-blocked' || params.fault === 'ambient-light') {
          y += Math.sin(t * 2 * Math.PI * 50) * 0.3;
        }
        if (params.fault === 'muscle-artifact' || params.fault === 'motion-artifact' || params.fault === 'cable-motion' || params.fault === 'motion') {
          y += (Math.random() - 0.5) * 0.4;
        }
        if (params.fault === 'baseline-wander' || params.fault === 'nail-polish' || params.fault === 'circuit-leak') {
          y += Math.sin(t * 0.5) * 0.3;
        }
        if (params.fault === 'loose-electrode' || params.fault === 'transducer-off' || params.fault === 'lead-off' || params.fault === 'poor-contact' || params.fault === 'cuff-leak' || params.fault === 'battery-low' || params.fault === 'memory-full' || params.fault === 'amplifier-saturation') {
          y = Math.random() < 0.05 ? (Math.random() - 0.5) * 2 : 0;
        }
        if (params.fault === 'poor-perfusion' || params.fault === 'hypoventilation') {
          y *= 0.3;
        }

        // Scale to canvas
        const yPx = centerY - y * (height * 0.35);

        if (i === 0) ctx.moveTo(x, yPx);
        else ctx.lineTo(x, yPx);
      }

      ctx.stroke();

      phaseRef.current += dt * speedFactor;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [params, width, height]);

  return <canvas ref={canvasRef} style={{ width, height }} className="rounded-lg" />;
}

function generateSample(params: WaveformParams, t: number): number {
  switch (params.type) {
    case 'ecg': {
      const hr = params.heartRate || 72;
      const beatPeriod = 60 / hr;
      const phase = (t % beatPeriod) / beatPeriod;
      let y = 0;
      // P wave
      if (phase > 0.05 && phase < 0.15) {
        y = 0.15 * Math.sin((phase - 0.05) * Math.PI / 0.1);
      }
      // QRS complex
      if (phase > 0.18 && phase < 0.22) y = -0.1 * ((phase - 0.18) / 0.04);
      if (phase > 0.22 && phase < 0.26) y = 1.0 * Math.sin((phase - 0.22) * Math.PI / 0.04);
      if (phase > 0.26 && phase < 0.30) y = -0.2 * (1 - (phase - 0.26) / 0.04);
      // T wave
      if (phase > 0.35 && phase < 0.50) {
        y = 0.25 * Math.sin((phase - 0.35) * Math.PI / 0.15);
      }

      // Rhythm variations
      if (params.rhythm === 'afib') {
        y += (Math.random() - 0.5) * 0.1;
        const beatJitter = Math.sin(t * 3.7) * 0.05;
        y += beatJitter;
      }
      if (params.rhythm === 'vtach') {
        const vtPeriod = 60 / 180;
        const vtPhase = (t % vtPeriod) / vtPeriod;
        y = 0.6 * Math.sin(vtPhase * Math.PI * 2);
      }
      if (params.rhythm === 'brady') {
        const bradyPeriod = 60 / 45;
        const bradyPhase = (t % bradyPeriod) / bradyPeriod;
        y = 0;
        if (bradyPhase > 0.05 && bradyPhase < 0.15) y = 0.15 * Math.sin((bradyPhase - 0.05) * Math.PI / 0.1);
        if (bradyPhase > 0.22 && bradyPhase < 0.26) y = 1.0 * Math.sin((bradyPhase - 0.22) * Math.PI / 0.04);
        if (bradyPhase > 0.35 && bradyPhase < 0.50) y = 0.25 * Math.sin((bradyPhase - 0.35) * Math.PI / 0.15);
      }
      return y;
    }

    case 'eeg': {
      const state = params.state || 'awake';
      let y = 0;
      if (state === 'awake') {
        y = 0.3 * Math.sin(t * 2 * Math.PI * 10) + 0.1 * Math.sin(t * 2 * Math.PI * 20);
      } else if (state === 'drowsy') {
        y = 0.4 * Math.sin(t * 2 * Math.PI * 6) + 0.1 * Math.sin(t * 2 * Math.PI * 15);
      } else if (state === 'sleep') {
        y = 0.6 * Math.sin(t * 2 * Math.PI * 2) + 0.05 * Math.sin(t * 2 * Math.PI * 8);
      } else if (state === 'seizure') {
        y = 0.8 * Math.sin(t * 2 * Math.PI * 12) + 0.3 * Math.sin(t * 2 * Math.PI * 24) + (Math.random() - 0.5) * 0.2;
      }
      return y;
    }

    case 'emg': {
      const contraction = (params.contraction || 30) / 100;
      const state = params.state || 'normal';
      let amplitude = contraction * 0.8;
      if (state === 'fatigue') amplitude *= 0.6;
      if (state === 'neuropathy') amplitude *= 1.5;
      if (state === 'myopathy') amplitude *= 0.4;
      return (Math.random() - 0.5) * 2 * amplitude;
    }

    case 'pressure': {
      const sys = 120;
      const dia = 80;
      const hr = params.heartRate || 72;
      const beatPeriod = 60 / hr;
      const phase = (t % beatPeriod) / beatPeriod;
      let y = 0;
      if (phase < 0.3) {
        y = 0.8 * Math.sin(phase * Math.PI / 0.3);
      } else {
        y = 0.3 * Math.exp(-((phase - 0.3) * 5));
      }
      const normalized = (y * (sys - dia) / 120) + dia / 120 - 0.5;
      return normalized * 2;
    }

    case 'flow': {
      const resp = params.respRate || 14;
      const respPeriod = 60 / resp;
      const phase = (t % respPeriod) / respPeriod;
      let y = 0;
      if (phase < 0.4) {
        y = Math.sin(phase * Math.PI / 0.4) * 0.8;
      } else if (phase < 0.5) {
        y = 0;
      } else if (phase < 0.9) {
        y = -Math.sin((phase - 0.5) * Math.PI / 0.4) * 0.6;
      }
      return y;
    }

    case 'spo2': {
      const hr = params.heartRate || 72;
      const beatPeriod = 60 / hr;
      const phase = (t % beatPeriod) / beatPeriod;
      let y = 0;
      if (phase < 0.2) {
        y = Math.sin(phase * Math.PI / 0.2) * 0.5;
      } else {
        y = 0.1 * Math.exp(-((phase - 0.2) * 8));
      }
      return y;
    }

    default:
      return 0;
  }
}
