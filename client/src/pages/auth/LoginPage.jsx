import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth.service';
import { ROUTES } from '../../constants/routes';
import { CyberButton } from '../../components/common/CyberButton';
import { CyberCard } from '../../components/common/CyberCard';
import { Terminal, Lock, Mail, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const [formData, setFormData] = useState({ emailOrUsername: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(false);

    try {
      setLoading(true);
      const res = await authService.login(formData);
      login(res.data.user, res.data.accessToken);

      if (res.data.user.role === 'ADMIN') {
        navigate(ROUTES.ADMIN_DASHBOARD);
      } else {
        navigate(ROUTES.DASHBOARD);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Access Denied: Invalid credentials or network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 px-4 max-w-md mx-auto">
      <CyberCard title="OPERATIVE AUTHENTICATION" subtitle="ACCESS RESTRICTED // SOC TERMINAL" glowColor="cyan">
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          {error && (
            <div className="bg-cyber-danger/10 border border-cyber-danger p-3 text-cyber-danger flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-cyber-muted mb-1 uppercase tracking-wider">EMAIL OR USERNAME</label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.emailOrUsername}
                onChange={(e) => setFormData({ ...formData, emailOrUsername: e.target.value })}
                className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan text-cyber-text px-3 py-2 outline-none font-mono"
                placeholder="operative@domain.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-cyber-muted mb-1 uppercase tracking-wider">PASSPHRASE</label>
            <div className="relative">
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan text-cyber-text px-3 py-2 outline-none font-mono"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <div className="pt-2">
            <CyberButton
              type="submit"
              variant="cyan"
              size="md"
              disabled={loading}
              className="w-full"
            >
              {loading ? 'AUTHENTICATING...' : 'ESTABLISH LINK'}
            </CyberButton>
          </div>

          <div className="text-center pt-4 border-t border-cyber-border/60 text-cyber-muted">
            New operative?{' '}
            <Link to={ROUTES.REGISTER} className="text-cyber-cyan hover:underline">
              Initialize squad registration
            </Link>
          </div>
        </form>
      </CyberCard>
    </div>
  );
};

export default LoginPage;

