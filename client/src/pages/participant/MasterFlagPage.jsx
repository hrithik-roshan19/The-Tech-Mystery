import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { CyberCard } from '../../components/common/CyberCard';
import { CyberButton } from '../../components/common/CyberButton';
import { TerminalWindow } from '../../components/common/TerminalWindow';
import { ROUTES } from '../../constants/routes';
import { Award, Lock, ShieldAlert, Target } from 'lucide-react';

export const MasterFlagPage = () => {
  const { team } = useOutletContext() || {};
  const isMasterUnlocked = (team?.currentLevel || 1) >= 10;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2 py-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-orange/10 border border-cyber-orange text-cyber-orange font-mono text-xs uppercase tracking-widest">
          <ShieldAlert className="w-3.5 h-3.5" />
          FINAL OBJECTIVE // STAGE 10
        </div>
        <h1 className="text-3xl sm:text-4xl font-heading font-black text-cyber-text uppercase">
          THE MASTER FLAG PROTOCOL
        </h1>
        <p className="font-mono text-xs text-cyber-muted max-w-xl mx-auto">
          The ultimate cryptographic seal safeguarding the core of Hack the Grid.
        </p>
      </div>

      {!isMasterUnlocked ? (
        <CyberCard title="MASTER FLAG CONTAINMENT SEALED" glowColor="orange">
          <div className="space-y-4 font-mono text-xs text-center py-8">
            <div className="w-16 h-16 mx-auto bg-cyber-secondary border border-cyber-border rounded-full flex items-center justify-center text-cyber-muted mb-4">
              <Lock className="w-8 h-8 text-cyber-orange" />
            </div>
            <h3 className="text-base font-bold text-cyber-text uppercase">
              CLEAR LEVELS 1 THROUGH 9 TO COMMENCE FINAL INFILTRATION
            </h3>
            <p className="text-cyber-muted max-w-md mx-auto">
              Your squad is currently at <span className="text-cyber-orange font-bold">Level {team?.currentLevel || 1}</span>.
              All preceding network nodes must be dismantled before the Master Flag containment core becomes accessible.
            </p>
            <div className="pt-4">
              <Link to={ROUTES.CHALLENGE}>
                <CyberButton variant="cyan" size="md" icon={Target}>
                  RESUME ACTIVE CHALLENGE
                </CyberButton>
              </Link>
            </div>
          </div>
        </CyberCard>
      ) : (
        <CyberCard title="FINAL MASTER NODE BREACHED" glowColor="green">
          <div className="space-y-4 font-mono text-xs">
            <p className="text-cyber-green font-bold">
              CONGRATULATIONS OPERATIVES: You have penetrated the perimeter to Level 10.
            </p>
            <p className="text-cyber-muted">
              Submit the final master cipher string through your Active Challenge viewport to lock your conquest.
            </p>
            <Link to={ROUTES.CHALLENGE}>
              <CyberButton variant="green" size="lg" icon={Award}>
                CONQUER MASTER FLAG
              </CyberButton>
            </Link>
          </div>
        </CyberCard>
      )}
    </div>
  );
};

export default MasterFlagPage;

