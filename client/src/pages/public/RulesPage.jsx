import React from 'react';
import { CyberCard } from '../../components/common/CyberCard';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

export const RulesPage = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-heading font-black tracking-wide text-cyber-text uppercase">
          RULES OF <span className="text-cyber-cyan">ENGAGEMENT</span>
        </h1>
        <p className="font-mono text-xs sm:text-sm text-cyber-muted max-w-2xl mx-auto">
          Strict operational codes governing all squads during Hack the Grid.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
        <CyberCard title="PERMITTED TACTICS" glowColor="green">
          <ul className="space-y-3 text-cyber-muted">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-cyber-green shrink-0 mt-0.5" />
              <span>Use of Python, CyberChef, Burp Suite, Wireshark, and local decoders.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-cyber-green shrink-0 mt-0.5" />
              <span>Collaboration strictly among your 2-4 registered squad operatives.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-cyber-green shrink-0 mt-0.5" />
              <span>Physical navigation of designated university campus zones to find QR checkpoints.</span>
            </li>
          </ul>
        </CyberCard>

        <CyberCard title="STRICTLY PROHIBITED (INSTANT DQ)" glowColor="orange">
          <ul className="space-y-3 text-cyber-muted">
            <li className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-cyber-danger shrink-0 mt-0.5" />
              <span>Sharing flags, questions, or answers with rival squads.</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-cyber-danger shrink-0 mt-0.5" />
              <span>Attacking, DoS/DDoS-ing, or brute-forcing platform infrastructure. Rate limits are strictly enforced.</span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="w-4 h-4 text-cyber-danger shrink-0 mt-0.5" />
              <span>Damaging, defacing, moving, or tampering with physical QR checkpoint posters on campus.</span>
            </li>
          </ul>
        </CyberCard>
      </div>

      <CyberCard title="FLAG FORMAT PROTOCOL" glowColor="cyan">
        <div className="font-mono text-xs text-cyber-text space-y-2">
          <p>All valid flags adhere to the standard format:</p>
          <div className="bg-cyber-bg border border-cyber-cyan p-3 text-cyber-cyan text-sm">
            HTG&#123;FLAG_STRING_HERE&#125;
          </div>
          <p className="text-cyber-muted">Unless explicitly noted otherwise in a challenge prompt, flags are case-sensitive.</p>
        </div>
      </CyberCard>
    </div>
  );
};

export default RulesPage;
