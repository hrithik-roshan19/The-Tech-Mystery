import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { CyberButton } from '../../components/common/CyberButton';
import { CyberCard } from '../../components/common/CyberCard';
import { TerminalWindow } from '../../components/common/TerminalWindow';
import { Shield, Terminal, QrCode, Cpu, Lock, Trophy, ArrowRight, Zap, Target } from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="space-y-20 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan font-mono text-xs tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-cyber-cyan animate-ping" />
          CODESPHERE CODING CLUB • TULA'S UNIVERSITY
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-cyber-text leading-tight uppercase">
          HACK THE <span className="text-cyber-cyan glow-cyan">GRID</span>
        </h1>

        <p className="max-w-2xl mx-auto font-mono text-sm sm:text-base text-cyber-muted leading-relaxed">
          The ultimate on-campus hybrid Cybersecurity CTF. 10 lethal stages combining cryptography,
          web inspection, reverse engineering, and physical QR checkpoints across university grounds.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link to={ROUTES.REGISTER}>
            <CyberButton variant="cyan" size="lg" icon={Zap}>
              INITIALIZE SQUAD
            </CyberButton>
          </Link>
          <Link to={ROUTES.HOW_IT_WORKS}>
            <CyberButton variant="ghost" size="lg" icon={ArrowRight}>
              OPERATION BRIEFING
            </CyberButton>
          </Link>
        </div>
      </section>

      {/* Terminal Interactive Briefing */}
      <section className="max-w-4xl mx-auto">
        <TerminalWindow title="HTG-NET // MISSION DIRECTIVE v1.0">
          <div className="space-y-2 text-xs sm:text-sm">
            <p className="text-cyber-cyan">&gt; target: TULA'S UNIVERSITY GRID INFRASTRUCTURE</p>
            <p className="text-cyber-muted">&gt; date: EVENT DAY // STAGE LOCKS ENGAGED</p>
            <p className="text-cyber-text">
              &gt; protocol: Squads (2-4 operatives) must traverse 10 tiered cyber defence nodes.
              Physical QR tokens stationed across campus unlock team-unique cryptographic challenges.
            </p>
            <p className="text-cyber-green">&gt; STATUS: READY FOR OPERATIVE DEPLOYMENT.</p>
          </div>
        </TerminalWindow>
      </section>

      {/* Core Mechanics Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CyberCard title="PHYSICAL QR CHECKPOINTS" glowColor="cyan">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-cyber-secondary border border-cyber-border flex items-center justify-center text-cyber-cyan mb-2">
              <QrCode className="w-5 h-5" />
            </div>
            <p className="text-xs text-cyber-muted font-mono leading-relaxed">
              QR codes stationed at physical university coordinates act as cryptographic triggers.
              Zero answers are exposed inside the QR; scanning unlocks your team's assigned level.
            </p>
          </div>
        </CyberCard>

        <CyberCard title="TEAM-SPECIFIC POOL" glowColor="green">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-cyber-secondary border border-cyber-border flex items-center justify-center text-cyber-green mb-2">
              <Cpu className="w-5 h-5" />
            </div>
            <p className="text-xs text-cyber-muted font-mono leading-relaxed">
              Every squad receives different question variations drawn dynamically from encrypted pools.
              No answers or flags can be shared across adjacent competing squads.
            </p>
          </div>
        </CyberCard>

        <CyberCard title="REAL-TIME TELEMETRY" glowColor="orange">
          <div className="space-y-3">
            <div className="w-10 h-10 bg-cyber-secondary border border-cyber-border flex items-center justify-center text-cyber-orange mb-2">
              <Trophy className="w-5 h-5" />
            </div>
            <p className="text-xs text-cyber-muted font-mono leading-relaxed">
              Atomic server-side flag validation, millisecond tie-break timestamping, and a live HUD
              leaderboard reflecting tactical campus rankings.
            </p>
          </div>
        </CyberCard>
      </section>

      {/* 10 Levels Preview */}
      <section className="bg-cyber-panel border border-cyber-border p-8 text-center space-y-6">
        <h2 className="text-2xl font-heading font-bold text-cyber-text tracking-wide uppercase">
          10 LEVELS OF DEFENSE DESTRUCTION
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 font-mono text-xs">
          {['Recon / OSINT', 'Binary & ASCII', 'Base64 & Encoding', 'Web Inspection', 'Steganography', 'Logic Puzzles', 'Cryptanalysis', 'Code Debugging', 'Multi-Stage Cipher', 'Master Flag'].map((lvl, idx) => (
            <div key={lvl} className="bg-cyber-secondary border border-cyber-border p-3 text-center">
              <span className="text-cyber-cyan block font-bold">LVL {idx + 1}</span>
              <span className="text-cyber-muted text-[11px] mt-1 block">{lvl}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
