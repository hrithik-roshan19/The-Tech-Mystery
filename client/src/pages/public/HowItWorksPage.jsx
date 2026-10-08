import React from 'react';
import { CyberCard } from '../../components/common/CyberCard';
import { QrCode, Lock, Key, Trophy, ArrowRight, ShieldCheck } from 'lucide-react';

export const HowItWorksPage = () => {
  const steps = [
    {
      num: '01',
      title: 'REGISTER YOUR SQUAD',
      desc: 'Form a squad of 2 to 4 operatives. The squad leader generates a unique join code and teammates enroll.',
      icon: Lock
    },
    {
      num: '02',
      title: 'RECEIVE CAMPUS INTEL',
      desc: 'Access your team HUD. View the Mission Map to see your next physical coordinate on the Tula’s campus.',
      icon: QrCode
    },
    {
      num: '03',
      title: 'SCAN THE PHYSICAL QR',
      desc: 'Locate the physical QR sticker. Scanning the secure QR with your device unlocks your team-specific level challenge.',
      icon: Key
    },
    {
      num: '04',
      title: 'DECODE & SUBMIT THE FLAG',
      desc: 'Analyze the challenge, solve ciphers or inspect source code, and submit the flag in HTG{...} format.',
      icon: ShieldCheck
    },
    {
      num: '05',
      title: 'ADVANCE & CAPTURE MASTER FLAG',
      desc: 'Each correct flag rewards points and unlocks the next level. Conquer Level 10 to claim the Master Flag.',
      icon: Trophy
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-heading font-black tracking-wide text-cyber-text uppercase">
          HOW IT <span className="text-cyber-cyan">WORKS</span>
        </h1>
        <p className="font-mono text-xs sm:text-sm text-cyber-muted max-w-2xl mx-auto">
          The tactical operational lifecycle from registration to claiming the Master Flag.
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((s) => (
          <CyberCard key={s.num} glowColor="cyan">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="text-2xl font-mono font-bold text-cyber-cyan bg-cyber-secondary border border-cyber-border px-3 py-1 self-start">
                {s.num}
              </div>
              <div className="flex-grow space-y-1">
                <h3 className="font-heading font-bold text-sm text-cyber-text tracking-wider uppercase flex items-center gap-2">
                  <s.icon className="w-4 h-4 text-cyber-cyan" />
                  {s.title}
                </h3>
                <p className="font-mono text-xs text-cyber-muted">{s.desc}</p>
              </div>
            </div>
          </CyberCard>
        ))}
      </div>
    </div>
  );
};

export default HowItWorksPage;
