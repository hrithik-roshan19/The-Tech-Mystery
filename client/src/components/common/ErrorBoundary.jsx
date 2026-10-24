import React from 'react';
import { AlertOctagon, RefreshCw, Home, Terminal, ShieldAlert } from 'lucide-react';

/**
 * CyberSOC Error Boundary
 * Prevents unhandled JavaScript exceptions from crashing the application into a pitch-black screen.
 * Displays a high-contrast Cyber SOC incident containment display with action buttons and diagnostic details.
 */
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an unhandled React render error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetState = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      const { title = 'CRITICAL SYSTEM ANOMALY // INTERFACE BREACHED', fallback } = this.props;

      if (fallback) {
        return fallback;
      }

      return (
        <div className="min-h-screen w-full bg-[#05070A] text-[#F5F7FA] flex flex-col items-center justify-center p-4 sm:p-6 font-mono selection:bg-[#00E5FF] selection:text-black">
          <div className="w-full max-w-2xl bg-[#0F1720] border-2 border-[#FF3B5C] shadow-[0_0_30px_rgba(255,59,92,0.25)] rounded-none overflow-hidden">
            {/* Header Terminal Strip */}
            <div className="bg-[#1B2A38] px-4 py-3 border-b border-[#FF3B5C]/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#FF3B5C] inline-block animate-ping" />
                <span className="w-2 h-2 rounded-full bg-[#FF3B5C] inline-block" />
                <span className="text-xs font-bold text-[#FF3B5C] uppercase tracking-wider">
                  SECURITY DEFENSE PROTOCOL ACTIVE
                </span>
              </div>
              <span className="text-[10px] text-[#8B98A7]">FAULT-ISOLATION-v2.0</span>
            </div>

            {/* Incident Briefing Body */}
            <div className="p-6 space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#FF3B5C]/15 border border-[#FF3B5C] text-[#FF3B5C] shrink-0 rounded">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-heading font-black text-white uppercase tracking-wide">
                    {title}
                  </h2>
                  <p className="text-xs text-[#8B98A7] leading-relaxed">
                    An unexpected client-side rendering exception was intercepted by the Cyber SOC Containment Barrier. The underlying page has been isolated to prevent corruption.
                  </p>
                </div>
              </div>

              {/* Error Message Capsule */}
              <div className="bg-black/60 border border-[#FF3B5C]/50 p-4 rounded text-xs space-y-2">
                <div className="flex items-center justify-between text-[#FF3B5C] font-bold">
                  <span>EXCEPTION DETAILS:</span>
                  <span className="text-[10px] text-[#8B98A7]">CLIENT LOG</span>
                </div>
                <p className="text-white break-words font-mono text-[13px]">
                  {this.state.error?.message || 'Unknown runtime evaluation anomaly.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={this.handleReload}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF] hover:bg-[#00E5FF] hover:text-[#05070A] font-mono font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>RELOAD TERMINAL</span>
                </button>

                <a
                  href="/portal/dashboard"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0F1720] text-[#F5F7FA] border border-[#1B2A38] hover:border-[#00E5FF] hover:text-[#00E5FF] font-mono font-bold text-xs uppercase tracking-wider transition-all"
                >
                  <Home className="w-4 h-4" />
                  <span>RETURN TO DASHBOARD</span>
                </a>
              </div>

              {/* Technical Diagnostics Collapsible */}
              {this.state.errorInfo && (
                <div className="pt-2 border-t border-[#1B2A38]">
                  <button
                    type="button"
                    onClick={() => this.setState((prev) => ({ showDetails: !prev.showDetails }))}
                    className="text-[11px] text-[#8B98A7] hover:text-[#00E5FF] transition-colors flex items-center gap-1.5 font-mono"
                  >
                    <Terminal className="w-3.5 h-3.5" />
                    <span>{this.state.showDetails ? '[-] HIDE DIAGNOSTIC TRACE' : '[+] SHOW DIAGNOSTIC TRACE'}</span>
                  </button>

                  {this.state.showDetails && (
                    <pre className="mt-3 p-3 bg-black/80 border border-[#1B2A38] rounded text-[11px] text-[#8B98A7] overflow-x-auto whitespace-pre-wrap max-h-48">
                      {this.state.error?.stack}
                      {this.state.errorInfo?.componentStack}
                    </pre>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
