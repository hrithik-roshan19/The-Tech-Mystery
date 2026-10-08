/**
 * Formatting Utilities for Scores, Timers, and Dates
 */

export const formatScore = (score) => {
  if (score === undefined || score === null) return '0000';
  return score.toString().padStart(4, '0');
};

export const formatLevel = (level) => {
  return `LVL-${level.toString().padStart(2, '0')}`;
};

export const formatTimestamp = (dateString) => {
  if (!dateString) return '--:--:--';
  const d = new Date(dateString);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};

export const formatTimeRemaining = (ms) => {
  if (ms <= 0) return '00:00:00';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0')
  ].join(':');
};

