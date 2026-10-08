import React from 'react';

/**
 * StatusBadge Component
 * Shows categorical status (SOLVED, LOCKED, ACTIVE, ADMIN, etc.)
 */
export const StatusBadge = ({ status, variant = 'cyan', size = 'sm' }) => {
  const variantMap = {
    cyan: 'bg-cyber-cyan/15 text-cyber-cyan border-cyber-cyan/40',
    green: 'bg-cyber-green/15 text-cyber-green border-cyber-green/40',
    orange: 'bg-cyber-orange/15 text-cyber-orange border-cyber-orange/40',
    danger: 'bg-cyber-danger/15 text-cyber-danger border-cyber-danger/40',
    warning: 'bg-cyber-warning/15 text-cyber-warning border-cyber-warning/40',
    muted: 'bg-cyber-secondary text-cyber-muted border-cyber-border'
  };

  const sizeMap = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider border ${variantMap[variant] || variantMap.cyan} ${sizeMap[size]}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {status}
    </span>
  );
};

export default StatusBadge;
