import React from 'react';
import { Terminal } from 'lucide-react';

/**
 * TerminalWindow Component
 * Interactive-look cyber console window for challenge briefings and logs.
 */
export const TerminalWindow = ({
  title = 'TERMINAL // HTG-SEC-CORE',
  children,
  className = '',
  statusText = 'ONLINE'
}) => {
  return (
    <div className={`bg-cyber-bg border border-cyber-border font-mono overflow-hidden shadow-2xl ${className}`}>
      {/* Top Bar */}
      <div className="bg-cyber-secondary px-4 py-2 border-b border-cyber-border flex items-center justify-between text-xs text-cyber-muted">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-danger/70 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-warning/70 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-cyber-green/70 inline-block" />
          </div>
          <Terminal className="w-3.5 h-3.5 text-cyber-cyan" />
          <span className="text-cyber-text font-semibold uppercase tracking-wider">{title}</span>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-green animate-pulse" />
          <span className="text-cyber-green">{statusText}</span>
        </div>
      </div>

      {/* Terminal Viewport */}
      <div className="p-4 text-cyber-text text-sm overflow-x-auto leading-relaxed">
        {children}
      </div>
    </div>
  );
};

export default TerminalWindow;

