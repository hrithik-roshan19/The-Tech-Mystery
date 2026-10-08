import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { CyberCard } from '../../components/common/CyberCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Users, Crown, Shield, User } from 'lucide-react';

export const TeamProfilePage = () => {
  const { team } = useOutletContext() || {};

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-black text-cyber-text uppercase">
          SQUAD DOSSIER // {team?.name}
        </h1>
        <p className="font-mono text-xs text-cyber-muted mt-1">
          Registered operative manifest and credentials.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CyberCard title="SECURITY CREDENTIALS" glowColor="cyan">
          <div className="space-y-3 font-mono text-xs">
            <div>
              <span className="text-cyber-muted block">SECRET JOIN CODE</span>
              <span className="text-cyber-cyan font-bold text-base tracking-widest">{team?.joinCode}</span>
            </div>
            <div>
              <span className="text-cyber-muted block">SQUAD SIZE</span>
              <span>{team?.members?.length || 1} / {team?.maxMembers || 4} Operatives</span>
            </div>
            <div>
              <span className="text-cyber-muted block">STATUS</span>
              <StatusBadge
                status={team?.isDisqualified ? 'DISQUALIFIED' : 'ACTIVE'}
                variant={team?.isDisqualified ? 'danger' : 'green'}
                size="xs"
              />
            </div>
          </div>
        </CyberCard>

        <CyberCard title="ACTIVE OPERATIVES" glowColor="green" className="md:col-span-2">
          <div className="space-y-3 font-mono text-xs">
            {team?.members?.map((member, idx) => {
              const isLeader = member._id === team.leaderId || member._id === team.leaderId?._id;
              return (
                <div
                  key={member._id || idx}
                  className="bg-cyber-secondary border border-cyber-border p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded bg-cyber-panel border border-cyber-border flex items-center justify-center text-cyber-muted">
                      {isLeader ? <Crown className="w-3.5 h-3.5 text-cyber-orange" /> : <User className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <p className="font-bold text-cyber-text">{member.fullName || member.username}</p>
                      <p className="text-[11px] text-cyber-muted">@{member.username} • {member.collegeRollNo || 'TU-CS'}</p>
                    </div>
                  </div>

                  <div>
                    {isLeader ? (
                      <StatusBadge status="LEADER" variant="orange" size="xs" />
                    ) : (
                      <StatusBadge status="OPERATIVE" variant="muted" size="xs" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CyberCard>
      </div>
    </div>
  );
};

export default TeamProfilePage;
