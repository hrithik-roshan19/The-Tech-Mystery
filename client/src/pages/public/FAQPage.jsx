import React from 'react';
import { CyberCard } from '../../components/common/CyberCard';
import { HelpCircle } from 'lucide-react';

export const FAQPage = () => {
  const faqs = [
    {
      q: 'HOW MANY MEMBERS CAN BE IN A TEAM?',
      a: 'Teams must have between 2 and 4 participants. Solo participants are encouraged to team up with peers prior to registration.'
    },
    {
      q: 'HOW DO PHYSICAL QR CODES WORK?',
      a: 'Physical QR codes are posted at campus coordinates. Scanning a code with your mobile camera or the portal scanner triggers the backend to verify your location and unlock your team-specific level question. The QR itself contains NO answers or hints.'
    },
    {
      q: 'WHAT IF MY PHONE BATTERY DIES OR I REFRESH THE PAGE?',
      a: 'All progress and question allocations are persistently saved on the backend server. Re-scanning the QR or refreshing your browser will reopen your exact assigned question.'
    },
    {
      q: 'DO WE NEED PRIOR CYBERSECURITY EXPERIENCE?',
      a: 'Basic knowledge of web inspection, simple logic, and basic encoding (Base64, binary) will get you through the early levels. Advanced levels will test reverse engineering and cryptography, with hints available if you get stuck.'
    },
    {
      q: 'WHAT HAPPENS IF TEAMS TIE ON POINTS?',
      a: 'The leaderboard employs deterministic timestamp tie-breaking. The team that solved their latest challenge earliest in the event clock is ranked higher.'
    }
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-heading font-black tracking-wide text-cyber-text uppercase">
          COMMUNICATION <span className="text-cyber-cyan">FAQ</span>
        </h1>
        <p className="font-mono text-xs sm:text-sm text-cyber-muted max-w-xl mx-auto">
          Frequently asked tactical inquiries regarding The Tech Mystery.
        </p>
      </div>

      <div className="space-y-4 font-mono text-xs">
        {faqs.map((f, idx) => (
          <CyberCard key={idx} glowColor="cyan">
            <h3 className="text-sm font-heading font-bold text-cyber-text flex items-center gap-2 mb-2">
              <HelpCircle className="w-4 h-4 text-cyber-cyan" />
              {f.q}
            </h3>
            <p className="text-cyber-muted leading-relaxed pl-6">{f.a}</p>
          </CyberCard>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;

