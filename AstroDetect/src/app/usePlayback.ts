import { useEffect, useState } from 'react';

export function usePlayback(durationDays: number) {
  const [timeDays, setTimeDays] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    function updatePreference() {
      setReducedMotion(preference.matches);
      if (preference.matches) setPlaying(false);
    }
    updatePreference();
    preference.addEventListener('change', updatePreference);
    return () => preference.removeEventListener('change', updatePreference);
  }, []);
  const isPlaying = playing && timeDays < durationDays && !reducedMotion;
  useEffect(() => {
    if (!isPlaying) return;
    let frame = 0;
    let previous: number | null = null;
    function advance(timestamp: number) {
      if (previous !== null) {
        const elapsedSeconds = Math.min((timestamp - previous) / 1000, 0.1);
        setTimeDays(time => Math.min(durationDays, time + elapsedSeconds * durationDays / 30));
      }
      previous = timestamp;
      frame = requestAnimationFrame(advance);
    }
    frame = requestAnimationFrame(advance);
    return () => cancelAnimationFrame(frame);
  }, [isPlaying, durationDays]);
  return {
    timeDays, isPlaying, reducedMotion,
    pause: () => setPlaying(false),
    play: () => { if (timeDays >= durationDays) setTimeDays(0); setPlaying(true); },
    seek: (time: number) => { setPlaying(false); setTimeDays(Math.max(0, Math.min(durationDays, time))); },
    restart: () => { setPlaying(false); setTimeDays(0); },
  };
}
