import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { CyberButton } from '../components/common/CyberButton';
import { TerminalWindow } from '../components/common/TerminalWindow';
import { AlertTriangle, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <TerminalWindow title="ERROR 404 // NODE NOT FOUND" statusText="OFFLINE">
          <div className="space-y-4 font-mono text-xs">
            <div className="flex items-center gap-2 text-cyber-danger font-bold text-sm">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>SECURITY EXCEPTION: UNMAPPED COORDINATES</span>
            </div>
            <p className="text-cyber-muted">
              The targeted grid endpoint does not exist or access has been restricted by network perimeter defenses.
            </p>
            <div className="pt-2">
              <Link to={ROUTES.HOME}>
                <CyberButton variant="cyan" size="sm" icon={Home} className="w-full">
                  RETURN TO HOME BASE
                </CyberButton>
              </Link>
            </div>
          </div>
        </TerminalWindow>
      </div>
    </div>
  );
};

export default NotFoundPage;
