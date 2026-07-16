import { useRef, useEffect } from 'react';

/**
 * AudioWaveform — canvas-based audio visualization.
 * Renders the classic ElevenLabs-style frequency bar visualization.
 * In speaking mode: reads from Web Audio API AnalyserNode.
 * In listening mode: renders animated placeholder bars.
 */
export default function AudioWaveform({ status, getAnalyser, barCount = 32, height = 48 }) {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const frameRef = useRef(0);

  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio ?? 1;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const barWidth = (w - barCount * 2) / barCount;

    function drawBars(values) {
      ctx.clearRect(0, 0, w, h);
      values.forEach((val, i) => {
        const barH = Math.max(3, val * h);
        const x = i * (barWidth + 2);
        const y = (h - barH) / 2;

        const gradient = ctx.createLinearGradient(0, y, 0, y + barH);
        if (status === 'speaking') {
          gradient.addColorStop(0, 'rgba(139,92,246,0.9)');    // violet
          gradient.addColorStop(0.5, 'rgba(167,139,250,1)');
          gradient.addColorStop(1, 'rgba(139,92,246,0.9)');
        } else if (status === 'listening') {
          gradient.addColorStop(0, 'rgba(16,185,129,0.9)');    // emerald
          gradient.addColorStop(0.5, 'rgba(52,211,153,1)');
          gradient.addColorStop(1, 'rgba(16,185,129,0.9)');
        } else {
          gradient.addColorStop(0, 'rgba(99,102,241,0.4)');
          gradient.addColorStop(1, 'rgba(99,102,241,0.2)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barH, 2);
        ctx.fill();
      });
    }

    function animate() {
      frameRef.current++;

      const analyser = getAnalyser?.();

      if (analyser && status === 'speaking') {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);
        const step = Math.floor(data.length / barCount);
        const values = Array.from({ length: barCount }, (_, i) => data[i * step] / 255);
        drawBars(values);
      } else if (status === 'listening') {
        // Animated sine wave placeholder
        const t = frameRef.current * 0.05;
        const values = Array.from({ length: barCount }, (_, i) => {
          const x = i / barCount;
          return 0.3 + 0.25 * Math.sin(x * 8 + t) + 0.1 * Math.sin(x * 4 + t * 1.5);
        });
        drawBars(values);
      } else if (status === 'processing') {
        // Loader bars
        const t = frameRef.current * 0.08;
        const active = Math.floor((t % barCount));
        const values = Array.from({ length: barCount }, (_, i) => {
          const dist = Math.abs(i - active);
          return Math.max(0.06, 0.6 * Math.exp(-dist * 0.5));
        });
        drawBars(values);
      } else {
        // Idle — minimal static bars
        const values = Array.from({ length: barCount }, (_, i) =>
          0.05 + 0.03 * Math.sin(i * 0.5)
        );
        drawBars(values);
      }

      animRef.current = requestAnimationFrame(animate);
    }

    animate();
    return () => cancelAnimationFrame(animRef.current);
  }, [status, getAnalyser, barCount, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div className="w-full flex items-center justify-center gap-0.5" style={{ height }}>
        {Array.from({ length: barCount }).map((_, i) => (
          <div key={i} className="bg-indigo-500/30 rounded-sm" style={{ width: 3, height: 4 }} />
        ))}
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className="w-full"
      style={{ height, display: 'block' }}
      aria-hidden="true"
    />
  );
}
