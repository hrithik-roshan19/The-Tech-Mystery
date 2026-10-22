import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * AdminLayout
 * Dedicated layout for all administrative Command SOC routes.
 * Ensures strict visual and functional separation:
 * - Public navbar, hero overlays, and public footers are completely excluded.
 * - Serves as the route layout shell for authenticated administrative consoles.
 */
export const AdminLayout = () => {
  return (
    <div className="htg-admin-layout-root" style={{ minHeight: '100vh', background: '#070a08' }}>
      <Outlet />
    </div>
  );
};

export default AdminLayout;
