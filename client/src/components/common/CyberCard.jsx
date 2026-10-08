import React from 'react';

/**
 * CyberCard Component
 * Panel container styled after Cybersecurity SOC monitoring displays.
 */
export const CyberCard = ({
  children,
  title,
  subtitle,
  badge,
  className = '',
  headerAction,
  glowColor = 'cyan' // 'cyan', 'green', 'orange', 'none'
}) => {
  const glowMap = {
    cyan: 'hover:border-cyber-cyan/50',
    green: 'hover:border-cyber-green/50',
    orange: 'hover:border-cyber-orange/50',
    none: ''
  };

  return (
    <div
      className={`relative bg-cyber-panel border border-cyber-border rounded-none p-5 shadow-panel-glow transition-all duration-300 ${glowMap[glowColor]} ${className}`}
    >
      {/* Decorative Top Accent Edge */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyber-cyan/30 to-transparent" />

      {/* Header Bar */}
      {(title || badge || headerAction) && (
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-cyber-border/80">
          <div>
            {title && (
              <h3 className="text-base font-heading font-semibold text-cyber-text tracking-wide uppercase flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-cyber-cyan inline-block animate-pulse" />
                {title}
              </h3>
            )}
            {subtitle && <p className="text-xs text-cyber-muted font-mono mt-0.5">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-3">
            {badge && <div>{badge}</div>}
            {headerAction && <div>{headerAction}</div>}
          </div>
        </div>
      )}

      {/* Card Content Body */}
      <div>{children}</div>
    </div>
  );
};

export default CyberCard;
