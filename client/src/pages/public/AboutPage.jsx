import React from 'react';
import { CyberCard } from '../../components/common/CyberCard';
import { Shield, Users, Terminal, Award } from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-5xl font-heading font-black tracking-wide text-cyber-text uppercase">
          ABOUT <span className="text-cyber-cyan">THE TECH MYSTERY</span>
        </h1>
        <p className="font-mono text-xs sm:text-sm text-cyber-muted max-w-2xl mx-auto">
          An initiative by the CodeSphere Coding Club at Tula's University, Dehradun.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CyberCard title="THE MISSION" glowColor="cyan">
          <p className="font-mono text-xs text-cyber-muted leading-relaxed">
            The Tech Mystery was conceptualized to break away from traditional multiple-choice hackathons.
            By fusing offensive security challenges with physical campus checkpoints, participants experience
            a real-world SOC penetration testing scenario that tests problem-solving, speed, and teamwork.
          </p>
        </CyberCard>

        <CyberCard title="CODESPHERE CODING CLUB" glowColor="orange">
          <p className="font-mono text-xs text-cyber-muted leading-relaxed">
            CodeSphere is the premier technology community of Tula's University, Dehradun. Our goal is to foster
            hands-on engineering excellence, cybersecurity awareness, and competitive algorithmic mastery
            among future developers and security researchers.
          </p>
        </CyberCard>
      </div>

      <CyberCard title="TULA'S UNIVERSITY ADVANTAGE" glowColor="green">
        <div className="space-y-3 font-mono text-xs text-cyber-muted leading-relaxed">
          <p>
            Hosted on the campus of Tula's University, Dehradun, The Tech Mystery utilizes the university's academic
            blocks, server labs, and open grounds as physical nodes in the CTF grid.
          </p>
          <p className="text-cyber-text">
            Teams must maintain both intellectual sharpness to crack difficult crypto ciphers and physical
            agility to navigate campus checkpoints.
          </p>
        </div>
      </CyberCard>
    </div>
  );
};

export default AboutPage;

