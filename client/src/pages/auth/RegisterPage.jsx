import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/auth.service';
import { ROUTES } from '../../constants/routes';
import { CyberButton } from '../../components/common/CyberButton';
import { CyberCard } from '../../components/common/CyberCard';
import { AlertCircle } from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    collegeRollNo: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const res = await authService.register(formData);
      login(res.data.user, res.data.accessToken);
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment error. Check required parameters.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 max-w-lg mx-auto">
      <CyberCard title="NEW OPERATIVE ENROLLMENT" subtitle="CODESPHERE CTF INTAKE" glowColor="cyan">
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          {error && (
            <div className="bg-cyber-danger/10 border border-cyber-danger p-3 text-cyber-danger flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-cyber-muted mb-1">OPERATIVE CALLSIGN (USERNAME)</label>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan text-cyber-text px-3 py-2 outline-none"
                placeholder="cypher_01"
              />
            </div>

            <div>
              <label className="block text-cyber-muted mb-1">FULL NAME</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan text-cyber-text px-3 py-2 outline-none"
                placeholder="Alex Mercer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-cyber-muted mb-1">EMAIL ADDRESS</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan text-cyber-text px-3 py-2 outline-none"
                placeholder="alex@tulas.edu.in"
              />
            </div>

            <div>
              <label className="block text-cyber-muted mb-1">ROLL / ENROLLMENT NO.</label>
              <input
                type="text"
                value={formData.collegeRollNo}
                onChange={(e) => setFormData({ ...formData, collegeRollNo: e.target.value })}
                className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan text-cyber-text px-3 py-2 outline-none"
                placeholder="TU-2024-CS-042"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-cyber-muted mb-1">PHONE NUMBER</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan text-cyber-text px-3 py-2 outline-none"
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label className="block text-cyber-muted mb-1">ACCESS PASSPHRASE</label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-cyber-bg border border-cyber-border focus:border-cyber-cyan text-cyber-text px-3 py-2 outline-none"
                placeholder="Min. 6 chars"
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
              {loading ? 'ENROLLING...' : 'REGISTER OPERATIVE'}
            </CyberButton>
          </div>

          <div className="text-center pt-4 border-t border-cyber-border/60 text-cyber-muted">
            Already enrolled?{' '}
            <Link to={ROUTES.LOGIN} className="text-cyber-cyan hover:underline">
              Access existing terminal
            </Link>
          </div>
        </form>
      </CyberCard>
    </div>
  );
};

export default RegisterPage;
