import { useState, useEffect } from 'react';

/**
 * useCountdown Hook
 * Calculates milliseconds remaining until a target ISO date string.
 */
export const useCountdown = (targetDate) => {
  const calculateRemaining = () => {
    if (!targetDate) return 0;
    const diff = new Date(targetDate).getTime() - Date.now();
    return Math.max(0, diff);
  };

  const [remainingMs, setRemainingMs] = useState(calculateRemaining);

  useEffect(() => {
    if (!targetDate) return;

    const interval = setInterval(() => {
      const remaining = calculateRemaining();
      setRemainingMs(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return remainingMs;
};
