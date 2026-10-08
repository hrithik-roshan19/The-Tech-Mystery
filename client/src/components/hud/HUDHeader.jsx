import React from 'react';
import { Shield, Zap, Target, Radio } from 'lucide-react';
import { formatScore, formatLevel } from '../../utils/formatters';

/**
 * HUDHeader Component
 * Heads-Up Display banner fixed at top of participant portal.
 */
export const HUDHeader = ({ team, currentLevel = 1, totalScore = 0 }) => {
  return (
    <div className="bg-cyber-panel/90 backdrop-blur border-b border-cyber-border px-4 py-2.5 z-40 relative">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Team Identity */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-cyber-cyan/10 border border-cyber-cyan flex items-center justify-center text-cyber-cyan">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono text-cyber-muted block leading-none">OPERATIVE UNIT</span>
            <span className="text-sm font-heading font-bold text-cyber-text tracking-wide">
              {team?.name || 'UNASSIGNED SQUAD'}
            </span>
          </div>
        </div>

        {/* Live HUD Telemetry */}
        <div className="flex items-center gap-6 font-mono text-xs">
          {/* Level Tracker */}
          <div className="flex items-center gap-2 bg-cyber-secondary px-3 py-1.5 border border-cyber-border">
            <Target className="w-4 h-4 text-cyber-orange" />
            <span className="text-cyber-muted">PHASE:</span>
            <span className="font-bold text-cyber-orange">{formatLevel(currentLevel)}</span>
          </div>

          {/* Score Counter */}
          <div className="flex items-center gap-2 bg-cyber-secondary px-3 py-1.5 border border-cyber-border">
            <Zap className="w-4 h-4 text-cyber-cyan" />
            <span className="text-cyber-muted">SCORE:</span>
            <span className="font-bold text-cyber-cyan glow-cyan">{formatScore(totalScore)} PTS</span>
          </div>

          {/* System Link Status */}
          <div className="hidden sm:flex items-center gap-2 text-cyber-green text-[11px]">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>LINK SECURED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HUDHeader;

