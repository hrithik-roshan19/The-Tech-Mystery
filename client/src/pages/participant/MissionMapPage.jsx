import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { challengeService } from '../../services/challenge.service';
import { ROUTES } from '../../constants/routes';
import { CyberCard } from '../../components/common/CyberCard';
import { CyberButton } from '../../components/common/CyberButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Lock, CheckCircle2, Target, ArrowRight } from 'lucide-react';

export const MissionMapPage = () => {
  const [missionMap, setMissionMap] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMap = async () => {
      try {
        const res = await challengeService.getMissionMap();
        setMissionMap(res.data.missionMap);
      } catch (err) {
        console.error('Failed to load mission map', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMap();
  }, []);

  if (loading) return <LoadingSpinner text="SYNCHRONIZING MISSION GRID..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-black text-cyber-text uppercase">
          MISSION PROGRESSION MAP
        </h1>
        <p className="font-mono text-xs text-cyber-muted mt-1">
          Tactical topology across 10 security containment levels.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {missionMap.map((node) => {
          const isSolved = node.isSolved;
          const isCurrent = node.isCurrent;
          const isLocked = !node.isUnlocked && !node.isSolved;

          return (
            <CyberCard
              key={node.levelNumber}
              title={`LEVEL ${node.levelNumber}: ${node.title}`}
              badge={
                isSolved ? (
                  <StatusBadge status="CONQUERED" variant="green" size="xs" />
                ) : isCurrent ? (
                  <StatusBadge status="ACTIVE TARGET" variant="cyan" size="xs" />
                ) : (
                  <StatusBadge status="LOCKED" variant="muted" size="xs" />
                )
              }
              glowColor={isCurrent ? 'cyan' : isSolved ? 'green' : 'none'}
              className={isLocked ? 'opacity-60' : ''}
            >
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between text-cyber-muted">
                  <span>CATEGORY: {node.category}</span>
                  <span className="text-cyber-cyan font-bold">{node.points} PTS</span>
                </div>

                <div className="flex items-center justify-between text-cyber-muted pt-2 border-t border-cyber-border">
                  <span>DIFFICULTY: {node.difficulty}</span>
                  <span>{node.requiresCheckpointScan ? 'PHYSICAL QR REQUIRED' : 'DIGITAL ONLY'}</span>
                </div>

                {isCurrent && (
                  <div className="pt-2 flex justify-end">
                    <Link to={ROUTES.CHALLENGE}>
                      <CyberButton variant="cyan" size="sm" icon={Target}>
                        ENGAGE NODE
                      </CyberButton>
                    </Link>
                  </div>
                )}
              </div>
            </CyberCard>
          );
        })}
      </div>
    </div>
  );
};

export default MissionMapPage;

