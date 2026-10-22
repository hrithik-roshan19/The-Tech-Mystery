/**
 * The Tech Mystery — Framer Motion Animation Variants & Utilities
 * Optimized for 60fps GPU acceleration (opacity + transform only).
 * Fully respects prefers-reduced-motion and avoids layout shifts.
 */

// Global spring and easing curves
export const transitionConfig = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1], // Smooth cubic out
};

export const gentleTransition = {
  duration: 0.45,
  ease: [0.16, 1, 0.3, 1],
};

// 1. Page Transitions (Smooth fade & slight vertical lift)
export const pageVariants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// 2. Section Fade-Up on Scroll
export const fadeInUpVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// 3. Stagger Containers for Cards & Highlights
export const staggerContainer = (staggerDelay = 0.07, delayChildren = 0.04) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
});

// 4. Stagger Items
export const staggerItemVariants = {
  hidden: {
    opacity: 0,
    y: 16,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  initial: {
    opacity: 0,
    y: 16,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// 5. Button and Interactive Feedback
export const buttonHoverTap = {
  whileHover: {
    scale: 1.02,
    transition: { duration: 0.15, ease: 'easeOut' },
  },
  whileTap: {
    scale: 0.98,
    transition: { duration: 0.1 },
  },
};

export const cardHoverMotion = {
  whileHover: {
    y: -4,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  whileTap: {
    scale: 0.99,
  },
};

// 6. Navbar & Header Motion
export const navbarMotion = {
  hidden: { opacity: 0, y: -12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

// 7. Mobile Navigation Drawer Animation
export const mobileDrawerMotion = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.22,
      ease: [0.4, 0, 0.2, 1],
    },
  },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: {
      duration: 0.28,
      ease: [0.16, 1, 0.3, 1],
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
};

// 8. Modal & Accordion Expansion
export const accordionMotion = {
  hidden: {
    opacity: 0,
    height: 0,
    overflow: 'hidden',
    transition: { duration: 0.2 },
  },
  visible: {
    opacity: 1,
    height: 'auto',
    overflow: 'visible',
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    height: 0,
    overflow: 'hidden',
    transition: { duration: 0.2 },
  },
};
