import { Variants } from "framer-motion";

export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100, damping: 12 },
  },
};

// Reduced motion variants (opacity-only, minimal transitions)
export const reducedMotionContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.1 },
  },
};

export const reducedMotionItemVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.1 },
  },
};

/**
 * Helper to get appropriate variants based on motion preference
 */
export function getVariants(prefersReducedMotion: boolean) {
  return {
    container: prefersReducedMotion
      ? reducedMotionContainerVariants
      : containerVariants,
    item: prefersReducedMotion ? reducedMotionItemVariants : itemVariants,
  };
}
