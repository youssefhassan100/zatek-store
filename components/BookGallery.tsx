'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useState, type KeyboardEvent } from 'react';

interface BookGalleryProps {
  images: string[];
  alt: string;
}

const SWIPE_THRESHOLD = 40;

/** Sizes the book so the page, controls and thumbnails all fit inside the viewport height. */
const BOOK_WIDTH = 'min(100%, max(14rem, calc((100svh - 17.5rem) * 0.75)))';

export function BookGallery({ images, alt }: BookGalleryProps) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();
  const last = images.length - 1;

  const goTo = useCallback((next: number) => setIndex(Math.min(Math.max(next, 0), last)), [last]);

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') goTo(index + 1);
    if (event.key === 'ArrowLeft') goTo(index - 1);
  }

  return (
    <div className="mx-auto" style={{ width: BOOK_WIDTH }}>
      <motion.div
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={alt}
        onKeyDown={onKeyDown}
        onPanEnd={(_, info) => {
          if (info.offset.x < -SWIPE_THRESHOLD) goTo(index + 1);
          if (info.offset.x > SWIPE_THRESHOLD) goTo(index - 1);
        }}
        className="relative aspect-[3/4] touch-pan-y select-none overflow-hidden rounded-l-md rounded-r-3xl bg-butter shadow-2xl shadow-matcha-800/20 [perspective:1800px]"
      >
        {images.map((src, i) => (
          <motion.div
            key={src}
            className="absolute inset-0 origin-left [transform-style:preserve-3d]"
            style={{ zIndex: images.length - i }}
            initial={false}
            animate={{ rotateY: i < index ? -180 : 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.85, ease: [0.645, 0.045, 0.355, 1] }}
            aria-hidden={i !== index}
          >
            <div className="absolute inset-0 [backface-visibility:hidden]">
              <Image src={src} alt={`${alt} — page ${i + 1}`} fill sizes="(min-width: 1024px) 40vw, 90vw" className="object-cover" priority={i === 0} draggable={false} />
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-transparent" />
            </div>
            <div className="absolute inset-0 bg-butter [backface-visibility:hidden] [transform:rotateY(180deg)]" />
          </motion.div>
        ))}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-5 bg-gradient-to-r from-black/20 to-transparent" style={{ zIndex: images.length + 1 }} />
      </motion.div>

      <div className="mt-5 flex items-center justify-between">
        <button type="button" onClick={() => goTo(index - 1)} disabled={index === 0} className="mini-btn" aria-label="Previous page">
          Previous
        </button>
        <span className="text-sm tabular-nums text-matcha-800" aria-live="polite">{index + 1} / {images.length}</span>
        <button type="button" onClick={() => goTo(index + 1)} disabled={index === last} className="mini-btn" aria-label="Next page">
          Next
        </button>
      </div>

      <ul className="mt-4 flex gap-3 overflow-x-auto pb-1 scrollbar-none">
        {images.map((src, i) => (
          <li key={src} className="shrink-0">
            <button
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index}
              className={`relative block h-16 w-12 overflow-hidden sm:h-20 sm:w-16 rounded-lg border-2 transition ${i === index ? 'border-forest' : 'border-transparent opacity-60 hover:opacity-100'}`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
