import React from 'react';

/**
 * CyberButton Component
 * HUD-styled button with angled cuts, neon hover glows, and terminal micro-accents.
 */
export const CyberButton = ({
  children,
  variant = 'cyan', // 'cyan', 'green', 'orange', 'danger', 'ghost'
  size = 'md',
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  icon: Icon
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-mono font-medium uppercase tracking-wider transition-all duration-200 select-none disabled:opacity-50 disabled:cursor-not-allowed group';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base'
  };

  const variantStyles = {
    cyan: 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-bg shadow-none hover:shadow-neon-cyan',
    green: 'bg-cyber-green/10 text-cyber-green border border-cyber-green hover:bg-cyber-green hover:text-cyber-bg hover:shadow-neon-green',
    orange: 'bg-cyber-orange/10 text-cyber-orange border border-cyber-orange hover:bg-cyber-orange hover:text-cyber-bg hover:shadow-neon-orange',
    danger: 'bg-cyber-danger/10 text-cyber-danger border border-cyber-danger hover:bg-cyber-danger hover:text-cyber-text',
    ghost: 'bg-transparent text-cyber-muted border border-cyber-border hover:border-cyber-cyan hover:text-cyber-cyan'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {/* Corner Tech Marks */}
      <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-current opacity-70" />
      <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-current opacity-70" />

      {Icon && <Icon className="w-4 h-4 mr-2" />}
      <span>{children}</span>
    </button>
  );
};

export default CyberButton;
