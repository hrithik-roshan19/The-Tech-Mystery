import React, { useState } from 'react';
import { checkpointService } from '../../services/checkpoint.service';
import { CyberCard } from '../../components/common/CyberCard';
import { CyberButton } from '../../components/common/CyberButton';
import { TerminalWindow } from '../../components/common/TerminalWindow';
import { QrCode, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export const CheckpointScannerPage = () => {
  const [code, setCode] = useState('');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleManualScan = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setStatus(null);

    try {
      const res = await checkpointService.scanCheckpoint(code, token);
      setStatus({
        success: true,
        message: res.message || 'Checkpoint verified! Level unlocked.',
        data: res.data
      });
      setCode('');
      setToken('');
    } catch (err) {
      setStatus({
        success: false,
        message: err.response?.data?.message || 'Verification rejected. Checkpoint code or level locked.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-black text-cyber-text uppercase">
          PHYSICAL QR CHECKPOINT VERIFICATION
        </h1>
        <p className="font-mono text-xs text-cyber-muted mt-1">
          Authenticate campus presence to unlock your squad's level challenges.
        </p>
      </div>

      <CyberCard title="CHECKPOINT SCANNER INTAKE" glowColor="cyan">
        <form onSubmit={handleManualScan} className="space-y-4 font-mono text-xs">
          {status && (
            <div
              className={`p-3 border flex items-center gap-2 ${
                status.success
                  ? 'bg-cyber-green/10 border-cyber-green text-cyber-green'
                  : 'bg-cyber-danger/10 border-cyber-danger text-cyber-danger'
              }`}
            >
              {status.success ? <CheckCircle className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
              <span>{status.message}</span>
            </div>
          )}

          <p className="text-cyber-muted">
            When you locate a physical QR placard on the Tula's University campus, point your camera to scan
            the QR URL, or manually enter the checkpoint token printed on the card below.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-cyber-muted mb-1">CHECKPOINT CODE</label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CP-A7F92B"
                className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan text-cyber-text px-3 py-2 outline-none uppercase font-mono"
              />
            </div>

            <div>
              <label className="block text-cyber-muted mb-1">HMAC SECURITY TOKEN (OPTIONAL/EMBEDDED)</label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Auto-extracted from QR URL"
                className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan text-cyber-text px-3 py-2 outline-none font-mono"
              />
            </div>
          </div>

          <CyberButton
            type="submit"
            variant="cyan"
            size="md"
            disabled={loading}
            icon={QrCode}
            className="w-full"
          >
            {loading ? 'AUTHENTICATING BEACON...' : 'TRANSMIT BEACON TELEMETRY'}
          </CyberButton>
        </form>
      </CyberCard>

      <TerminalWindow title="INTEL // QR ARCHITECTURE NOTICE">
        <div className="space-y-2 text-xs text-cyber-muted">
          <p className="text-cyber-cyan">&gt; ZERO-EXPOSURE PROTOCOL ACTIVE</p>
          <p>
            Physical QR codes never store questions, answers, or flags. They only act as cryptographically
            signed physical location markers.
          </p>
          <p className="text-cyber-green">
            &gt; Question assignment is persistent: re-scanning will reopen your exact same question.
          </p>
        </div>
      </TerminalWindow>
    </div>
  );
};

export default CheckpointScannerPage;
