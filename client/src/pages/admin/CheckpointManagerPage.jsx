import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { CyberCard } from '../../components/common/CyberCard';
import { CyberButton } from '../../components/common/CyberButton';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { QrCode, Plus, MapPin } from 'lucide-react';

export const CheckpointManagerPage = () => {
  const [checkpoints, setCheckpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCp, setNewCp] = useState({
    levelNumber: 1,
    name: '',
    locationDescription: '',
    checkpointCode: ''
  });

  const fetchCheckpoints = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/checkpoints');
      setCheckpoints(res.data.data.checkpoints);
    } catch (err) {
      console.error('Failed to load checkpoints', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCheckpoints();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/checkpoints', {
        ...newCp,
        levelNumber: Number(newCp.levelNumber)
      });
      setNewCp({ levelNumber: 1, name: '', locationDescription: '', checkpointCode: '' });
      fetchCheckpoints();
    } catch (err) {
      alert(err.response?.data?.message || 'Creation failed');
    }
  };

  if (loading) return <LoadingSpinner text="MAPPING PHYSICAL CAMPUS BEACONS..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-black text-cyber-text uppercase">
          CAMPUS QR CHECKPOINT BEACONS
        </h1>
        <p className="font-mono text-xs text-cyber-muted mt-1">
          Manage physical QR tokens, campus coordinates, and cryptographic verification salts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Checkpoint */}
        <CyberCard title="NEW CHECKPOINT BEACON" glowColor="cyan">
          <form onSubmit={handleCreate} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-cyber-muted mb-1">TARGET LEVEL</label>
              <input
                type="number"
                min={1}
                max={20}
                required
                value={newCp.levelNumber}
                onChange={(e) => setNewCp({ ...newCp, levelNumber: e.target.value })}
                className="w-full bg-cyber-bg border border-cyber-border p-2 outline-none"
              />
            </div>

            <div>
              <label className="block text-cyber-muted mb-1">BEACON NAME</label>
              <input
                type="text"
                required
                value={newCp.name}
                onChange={(e) => setNewCp({ ...newCp, name: e.target.value })}
                placeholder="Checkpoint Alpha"
                className="w-full bg-cyber-bg border border-cyber-border p-2 outline-none"
              />
            </div>

            <div>
              <label className="block text-cyber-muted mb-1">UNIQUE CHECKPOINT CODE</label>
              <input
                type="text"
                required
                value={newCp.checkpointCode}
                onChange={(e) => setNewCp({ ...newCp, checkpointCode: e.target.value })}
                placeholder="CP-A7F92B"
                className="w-full bg-cyber-bg border border-cyber-border p-2 outline-none uppercase"
              />
            </div>

            <div>
              <label className="block text-cyber-muted mb-1">CAMPUS LOCATION DESCRIPTION</label>
              <textarea
                required
                rows={2}
                value={newCp.locationDescription}
                onChange={(e) => setNewCp({ ...newCp, locationDescription: e.target.value })}
                placeholder="Block B, 2nd Floor, Server Lab Entrance"
                className="w-full bg-cyber-bg border border-cyber-border p-2 outline-none"
              />
            </div>

            <CyberButton type="submit" variant="cyan" size="md" icon={Plus} className="w-full">
              REGISTER PHYSICAL BEACON
            </CyberButton>
          </form>
        </CyberCard>

        {/* Existing Checkpoints */}
        <div className="lg:col-span-2 space-y-4">
          {checkpoints.map((cp) => (
            <CyberCard key={cp._id} title={`LVL ${cp.levelNumber} // ${cp.name}`} glowColor="green">
              <div className="space-y-2 font-mono text-xs">
                <div className="flex items-center gap-2 text-cyber-text">
                  <MapPin className="w-4 h-4 text-cyber-orange shrink-0" />
                  <span>{cp.locationDescription}</span>
                </div>

                <div className="bg-cyber-bg border border-cyber-border p-2 text-cyber-cyan text-[11px] break-all">
                  <span className="text-cyber-muted block">QR TARGET PAYLOAD URL:</span>
                  {cp.sampleQrUrl}
                </div>

                <div className="flex items-center justify-between text-cyber-muted text-[11px] pt-1">
                  <span>CODE: <strong className="text-cyber-text">{cp.checkpointCode}</strong></span>
                  <span>TOTAL VERIFIED SCANS: <strong className="text-cyber-green">{cp.scanCount || 0}</strong></span>
                </div>
              </div>
            </CyberCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckpointManagerPage;

