'use client';

import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { spring } from '@/lib/motion';
import type { Video } from '@/lib/types';

const GAP = 16;

function SoundIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      {on ? <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /> : <path d="m16 9 5 6m0-6-5 6" />}
    </svg>
  );
}

interface ReelProps {
  video: Video;
  withSound: boolean;
  onToggleSound: () => void;
}

function Reel({ video, withSound, onToggleSound }: ReelProps) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) element.play().catch(() => undefined);
        else element.pause();
      },
      { threshold: 0.6 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (ref.current) ref.current.muted = !withSound;
  }, [withSound]);

  return (
    <motion.figure
      whileHover={{ y: -8, scale: 1.02 }}
      transition={spring}
      className="relative aspect-[9/16] w-[64vw] shrink-0 snap-start overflow-hidden rounded-3xl bg-matcha-800 shadow-lg shadow-matcha-800/15 sm:w-60 lg:w-64"
    >
      <video ref={ref} src={video.url} muted loop playsInline preload="metadata" className="h-full w-full object-cover" aria-label={video.title ?? undefined} />
      {video.subtitle && (
        <figcaption className="absolute inset-x-3 bottom-16 rounded-xl bg-black/55 px-3 py-2 text-center text-sm leading-snug text-white backdrop-blur-sm">
          {video.subtitle}
        </figcaption>
      )}
      <button
        type="button"
        onClick={onToggleSound}
        aria-pressed={withSound}
        aria-label={withSound ? 'Mute' : 'Play sound'}
        className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-butter px-3.5 py-2 text-xs font-medium text-matcha-800 transition hover:bg-white"
      >
        <SoundIcon on={withSound} />
        {withSound ? 'Mute' : 'Play sound'}
      </button>
    </motion.figure>
  );
}

export function VideoSlider({ videos }: { videos: Video[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });
  const [soundId, setSoundId] = useState<string | null>(null);

  const measure = useCallback(() => {
    const element = track.current;
    if (!element) return;
    setEdges({
      start: element.scrollLeft <= 4,
      end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure, videos.length]);

  function slide(direction: 1 | -1) {
    const element = track.current;
    const card = element?.firstElementChild as HTMLElement | null;
    if (!element || !card) return;
    element.scrollBy({ left: direction * (card.offsetWidth + GAP), behavior: 'smooth' });
  }

  return (
    <div>
      <div className="mb-5 flex justify-end gap-2 px-6">
        <button type="button" onClick={() => slide(-1)} disabled={edges.start} className="mini-btn" aria-label="Previous video">←</button>
        <button type="button" onClick={() => slide(1)} disabled={edges.end} className="mini-btn" aria-label="Next video">→</button>
      </div>
      <div
        ref={track}
        onScroll={measure}
        className="flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto scroll-smooth px-6 pb-6 pt-2 scrollbar-none"
      >
        {videos.map((video) => (
          <Reel
            key={video.id}
            video={video}
            withSound={soundId === video.id}
            onToggleSound={() => setSoundId((current) => (current === video.id ? null : video.id))}
          />
        ))}
      </div>
    </div>
  );
}
