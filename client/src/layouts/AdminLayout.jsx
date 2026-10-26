import React from 'react';
import { Outlet } from 'react-router-dom';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

/**
 * AdminLayout
 * Dedicated layout for all administrative Command SOC routes.
 * Ensures strict visual and functional separation:
 * - Public navbar, hero overlays, and public footers are completely excluded.
 * - Serves as the route layout shell for authenticated administrative consoles.
 * - Wraps all admin routes in an ErrorBoundary to prevent any rendering anomaly from producing a blank black screen.
 */
export const AdminLayout = () => {
  return (
    <div className="htg-admin-layout-root" style={{ minHeight: '100vh', background: '#070a08' }}>
      <ErrorBoundary title="ADMIN COMMAND SOC // INCIDENT CONTAINED">
        <Outlet />
      </ErrorBoundary>
    </div>
  );
};

export default AdminLayout;
