import React, { useState } from 'react';
import api from '../../services/api';
import { CyberCard } from '../../components/common/CyberCard';
import { CyberButton } from '../../components/common/CyberButton';
import { Plus, Layers, Key } from 'lucide-react';

export const ChallengePoolPage = () => {
  const [levelNumber, setLevelNumber] = useState(1);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('CRYPTOGRAPHY');
  const [points, setPoints] = useState(100);
  const [description, setDescription] = useState('');
  const [requiresCheckpoint, setRequiresCheckpoint] = useState(true);

  // Question variation form
  const [qLevel, setQLevel] = useState(1);
  const [qTitle, setQTitle] = useState('');
  const [qPrompt, setQPrompt] = useState('');
  const [qFlag, setQFlag] = useState('');
  const [msg, setMsg] = useState('');

  const handleCreateChallenge = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/challenges', {
        levelNumber: Number(levelNumber),
        title,
        category,
        points: Number(points),
        description,
        requiresCheckpointScan: requiresCheckpoint
      });
      setMsg(`Level ${levelNumber} challenge created successfully!`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create challenge');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-black text-cyber-text uppercase">
          CHALLENGE ENGINE & QUESTION POOL
        </h1>
        <p className="font-mono text-xs text-cyber-muted mt-1">
          Configure stage definitions and populate multi-variation question pools.
        </p>
      </div>

      {msg && (
        <div className="bg-cyber-green/10 border border-cyber-green p-3 text-cyber-green font-mono text-xs">
          {msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Create Challenge Level */}
        <CyberCard title="NEW CHALLENGE LEVEL" subtitle="STAGE DEFINITION" glowColor="cyan">
          <form onSubmit={handleCreateChallenge} className="space-y-4 font-mono text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-cyber-muted mb-1">LEVEL NUMBER (1-10)</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  required
                  value={levelNumber}
                  onChange={(e) => setLevelNumber(e.target.value)}
                  className="w-full bg-cyber-bg border border-cyber-border p-2 outline-none"
                />
              </div>
              <div>
                <label className="block text-cyber-muted mb-1">POINTS AWARDED</label>
                <input
                  type="number"
                  required
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  className="w-full bg-cyber-bg border border-cyber-border p-2 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-cyber-muted mb-1">LEVEL TITLE</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Protocol Infiltration"
                className="w-full bg-cyber-bg border border-cyber-border p-2 outline-none"
              />
            </div>

            <div>
              <label className="block text-cyber-muted mb-1">CATEGORY</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-cyber-bg border border-cyber-border p-2 outline-none text-cyber-text"
              >
                <option value="CRYPTOGRAPHY">CRYPTOGRAPHY</option>
                <option value="BINARY_ASCII">BINARY_ASCII</option>
                <option value="BASE64_ENCODING">BASE64_ENCODING</option>
                <option value="WEB_INSPECTION">WEB_INSPECTION</option>
                <option value="DEBUGGING">DEBUGGING</option>
                <option value="LOGICAL_REASONING">LOGICAL_REASONING</option>
                <option value="STEGANOGRAPHY">STEGANOGRAPHY</option>
                <option value="MULTI_STAGE">MULTI_STAGE</option>
                <option value="MASTER_FLAG">MASTER_FLAG</option>
              </select>
            </div>

            <div>
              <label className="block text-cyber-muted mb-1">SCENARIO BRIEFING</label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Narrative description of the containment node..."
                className="w-full bg-cyber-bg border border-cyber-border p-2 outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="reqCheck"
                checked={requiresCheckpoint}
                onChange={(e) => setRequiresCheckpoint(e.target.checked)}
              />
              <label htmlFor="reqCheck" className="text-cyber-muted">Requires Physical QR Checkpoint Scan</label>
            </div>

            <CyberButton type="submit" variant="cyan" size="md" icon={Plus} className="w-full">
              REGISTER STAGE LEVEL
            </CyberButton>
          </form>
        </CyberCard>

        {/* Add Question Variation */}
        <CyberCard title="ADD QUESTION VARIATION" subtitle="RANDOMIZED POOL MEMBER" glowColor="orange">
          <form className="space-y-4 font-mono text-xs">
            <p className="text-cyber-muted">
              Populate each level with at least 3–5 distinct question variations so competing squads receive different tasks.
            </p>
            <div>
              <label className="block text-cyber-muted mb-1">ASSOCIATED LEVEL</label>
              <input
                type="number"
                min={1}
                max={20}
                value={qLevel}
                onChange={(e) => setQLevel(e.target.value)}
                className="w-full bg-cyber-bg border border-cyber-border p-2 outline-none"
              />
            </div>

            <div>
              <label className="block text-cyber-muted mb-1">VARIATION TITLE</label>
              <input
                type="text"
                value={qTitle}
                onChange={(e) => setQTitle(e.target.value)}
                placeholder="Variation Alpha"
                className="w-full bg-cyber-bg border border-cyber-border p-2 outline-none"
              />
            </div>

            <div>
              <label className="block text-cyber-muted mb-1">CHALLENGE PROMPT / TASK</label>
              <textarea
                rows={3}
                value={qPrompt}
                onChange={(e) => setQPrompt(e.target.value)}
                placeholder="Markdown formatted challenge text..."
                className="w-full bg-cyber-bg border border-cyber-border p-2 outline-none"
              />
            </div>

            <div>
              <label className="block text-cyber-muted mb-1">EXPECTED SECRET FLAG</label>
              <input
                type="text"
                value={qFlag}
                onChange={(e) => setQFlag(e.target.value)}
                placeholder="HTG{sample_secret_flag}"
                className="w-full bg-cyber-bg border border-cyber-border p-2 outline-none"
              />
            </div>

            <CyberButton type="button" variant="orange" size="md" icon={Key} className="w-full">
              COMMIT TO QUESTION POOL
            </CyberButton>
          </form>
        </CyberCard>
      </div>
    </div>
  );
};

export default ChallengePoolPage;
