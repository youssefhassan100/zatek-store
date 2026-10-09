'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import { spring } from '@/lib/motion';

type CardProps = HTMLMotionProps<'div'> & { tilt?: number };

/** Surface that lifts on hover; `tilt` sets a resting rotation that straightens on hover. */
export function Card({ tilt = 0, className = '', style, ...props }: CardProps) {
  return (
    <motion.div
      style={{ rotate: tilt, ...style }}
      whileHover={{ y: -6, rotate: 0 }}
      whileTap={{ scale: 0.99 }}
      transition={spring}
      className={`transition-shadow duration-300 hover:shadow-xl hover:shadow-matcha-800/10 ${className}`}
      {...props}
    />
  );
}
