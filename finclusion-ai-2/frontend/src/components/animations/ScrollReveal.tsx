import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  /** 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade' */
  direction?: 'up' | 'down' | 'left' | 'right' | 'scale' | 'fade';
  once?: boolean;
  amount?: number;
}

const buildInitial = (direction: string) => {
  switch (direction) {
    case 'up':    return { opacity: 0, y: 32, scale: 0.98 };
    case 'down':  return { opacity: 0, y: -20 };
    case 'left':  return { opacity: 0, x: 32 };
    case 'right': return { opacity: 0, x: -32 };
    case 'scale': return { opacity: 0, scale: 0.94 };
    default:      return { opacity: 0 };
  }
};

const buildAnimate = (direction: string) => {
  switch (direction) {
    case 'up':    return { opacity: 1, y: 0, scale: 1 };
    case 'down':  return { opacity: 1, y: 0 };
    case 'left':  return { opacity: 1, x: 0 };
    case 'right': return { opacity: 1, x: 0 };
    case 'scale': return { opacity: 1, scale: 1 };
    default:      return { opacity: 1 };
  }
};

export default function ScrollReveal({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  direction = 'up',
  once = true,
  amount = 0.15,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, amount });

  return (
    <motion.div
      ref={ref}
      initial={buildInitial(direction)}
      animate={isInView ? buildAnimate(direction) : buildInitial(direction)}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
