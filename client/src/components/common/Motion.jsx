import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  pageVariants,
  fadeInUpVariants,
  staggerContainer,
  staggerItemVariants,
} from '../../utils/motion';

/**
 * Reusable Page Transition Wrapper
 * Animates in on route mount, fully respects prefers-reduced-motion.
 */
export function PageTransition({ children, className = '', style = {} }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className} style={style}>{children}</div>;
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

/**
 * Section Reveal on Viewport Scroll
 * Reveals smoothly as the section enters the screen.
 */
export function RevealSection({
  children,
  className = '',
  id,
  style = {},
  threshold = 0.12,
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <section id={id} className={className} style={style} {...props}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      id={id}
      className={className}
      style={style}
      variants={fadeInUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: threshold }}
      {...props}
    >
      {children}
    </motion.section>
  );
}

/**
 * Stagger Container
 * Triggers sequential entrance of its child StaggerItems.
 */
export function StaggerContainer({
  children,
  className = '',
  id,
  style = {},
  staggerDelay = 0.07,
  delayChildren = 0.04,
  threshold = 0.1,
  ...props
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div id={id} className={className} style={style} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      id={id}
      className={className}
      style={style}
      variants={staggerContainer(staggerDelay, delayChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: threshold }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger Item
 * Placed inside StaggerContainer.
 */
export function StaggerItem({ children, className = '', style = {}, ...props }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={className} style={style} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      variants={staggerItemVariants}
      {...props}
    >
      {children}
    </motion.div>
  );
}

