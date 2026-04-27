"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

type AnimatedSectionProps = HTMLMotionProps<"section"> & {
  delay?: number;
  y?: number;
  once?: boolean;
};

type RevealProps = HTMLMotionProps<"div"> & {
  delay?: number;
  y?: number;
  x?: number;
  once?: boolean;
};

const easing = [0.22, 1, 0.36, 1] as const;

export function AnimatedSection({
  children,
  delay = 0,
  y = 40,
  once = true,
  transition,
  ...props
}: AnimatedSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.section
      initial={prefersReducedMotion ? false : { opacity: 0, y }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={transition ?? { duration: 0.8, ease: easing, delay }}
      {...props}
    >
      {children}
    </motion.section>
  );
}

export function Reveal({
  children,
  delay = 0,
  y = 32,
  x = 0,
  once = true,
  transition,
  ...props
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, x, y }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, x: 0, y: 0 }}
      viewport={{ once, amount: 0.25 }}
      transition={transition ?? { duration: 0.8, ease: easing, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
