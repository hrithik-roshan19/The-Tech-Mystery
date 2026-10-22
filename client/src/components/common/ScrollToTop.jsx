import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop & Anchor Link Smooth Scroll Manager
 * 1. Resets scroll position to (0, 0) upon navigating to a new route without a hash.
 * 2. Smoothly scrolls to target element when a hash anchor is targeted.
 * 3. Accounts for the fixed navbar height via scroll-margin-top.
 * 4. Respects prefers-reduced-motion preferences.
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const prefersReducedMotion = typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')?.matches
      : false;
    const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

    if (hash) {
      const targetId = hash.replace(/^#/, '');
      // Wait for layout rendering via requestAnimationFrame
      const frameId = typeof requestAnimationFrame === 'function'
        ? requestAnimationFrame(() => {
            const element = document.getElementById(targetId) || document.querySelector(hash);
            if (element && typeof element.scrollIntoView === 'function') {
              element.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
            }
          })
        : null;
      return () => {
        if (frameId && typeof cancelAnimationFrame === 'function') {
          cancelAnimationFrame(frameId);
        }
      };
    } else {
      // Instant reset to top on route change to prevent jarring slow-scroll transitions
      if (typeof window.scrollTo === 'function') {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant',
        });
      }
    }
  }, [pathname, hash]);

  return null;
}
