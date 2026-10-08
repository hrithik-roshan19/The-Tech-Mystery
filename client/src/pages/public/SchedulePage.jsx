import React from 'react';
import { CyberCard } from '../../components/common/CyberCard';
import { Clock } from 'lucide-react';

export const SchedulePage = () => {
  const timeline = [
    { time: '09:00 AM', title: 'OPERATIVE ASSEMBLY & CHECK-IN', desc: 'Squad reporting at the main auditorium, credentials verification.' },
    { time: '09:45 AM', title: 'CHIEF ARCHITECT BRIEFING', desc: 'Event rules, campus perimeter boundaries, and safety briefing.' },
    { time: '10:00 AM', title: 'THE GRID UNLOCKS (ROUND START)', desc: 'Level 1 online, physical QR checkpoint beacon triggers activated.' },
    { time: '01:00 PM', title: 'MID-GAME RECON PAUSE', desc: 'Optional hydration and tactical strategy sync.' },
    { time: '03:30 PM', title: 'LEADERBOARD FREEZE', desc: 'Scores freeze to build suspense for the final Master Flag conquest.' },
    { time: '04:00 PM', title: 'GRID LOCKDOWN (EVENT END)', desc: 'All submission ports shut down permanently.' },
    { time: '04:30 PM', title: 'VALEDICTION & DE-CLOAKING CEREMONY', desc: 'Prize distribution, leaderboard unfreeze, solution walkthrough.' },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-heading font-black tracking-wide text-cyber-text uppercase">
          EVENT <span className="text-cyber-cyan">SCHEDULE</span>
        </h1>
        <p className="font-mono text-xs sm:text-sm text-cyber-muted max-w-xl mx-auto">
          Operational timeline for Hack the Grid event day.
        </p>
      </div>

      <div className="space-y-4 font-mono">
        {timeline.map((item, idx) => (
          <div key={idx} className="bg-cyber-panel border border-cyber-border p-4 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2 text-cyber-cyan font-bold text-xs bg-cyber-secondary border border-cyber-border px-3 py-1.5 shrink-0">
              <Clock className="w-3.5 h-3.5" />
              {item.time}
            </div>
            <div>
              <h3 className="text-sm font-heading font-bold text-cyber-text uppercase">{item.title}</h3>
              <p className="text-xs text-cyber-muted mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SchedulePage;
