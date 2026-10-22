import React from 'react';
import { Terminal, Shield, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-cyber-bg border-t border-cyber-border py-10 relative z-10 font-mono text-xs text-cyber-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-cyber-border/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-cyber-secondary border border-cyber-border flex items-center justify-center text-cyber-cyan">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <p className="font-heading font-bold text-cyber-text text-sm">THE TECH MYSTERY 2026</p>
              <p className="text-[11px] text-cyber-muted">CodeSphere Coding Club • Tula's University, Dehradun</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px]">
            <span className="flex items-center gap-1.5 text-cyber-green">
              <Shield className="w-3.5 h-3.5" />
              SYSTEM SECURED // 256-BIT HMAC
            </span>
            <span>CAMPUS PHYSICAL QR NETWORK</span>
            <span>ISO/IEC 27001 SIMULATION</span>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 CodeSphere Coding Club. All Rights Reserved. Built for Tula's University.</p>
          <div className="flex items-center gap-4">
            <a href="https://tulas.edu.in" target="_blank" rel="noreferrer" className="hover:text-cyber-cyan flex items-center gap-1">
              Tula's University <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span className="text-cyber-orange">THE TECH MYSTERY CTF ENGINE v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

