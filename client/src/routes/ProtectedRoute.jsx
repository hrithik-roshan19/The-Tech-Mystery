import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

/**
 * ProtectedRoute
 * Guards routes against unauthenticated and unauthorized access.
 * - Shows loading state during server-side credential verification.
 * - Redirects unauthenticated visitors to login (preserving deep links).
 * - Restricts administrative routes to server-verified ADMIN role.
 * - Redirects unauthorized participants back to their dashboard.
 * - Protects participant dashboard: unteamed participants must complete registration at /register.
 */
export const ProtectedRoute = ({ children, requiredRole, requireTeam }) => {
  const { isAuthenticated, loading, user, identityAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-cyber-bg text-cyber-text flex flex-col items-center justify-center p-6 font-mono">
        <LoadingSpinner text="VERIFYING SECURITY CREDENTIALS..." />
      </div>
    );
  }

  if (!isAuthenticated && identityAuthenticated) return <Navigate to="/auth/complete" state={{ from: location }} replace />;

  if (!isAuthenticated) {
    const redirectPath = requiredRole === 'ADMIN' ? ROUTES.ADMIN_LOGIN : ROUTES.LOGIN;
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'ADMIN') {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  // Requirement 5: Protect /dashboard: if a participant has not completed registration, redirect to /register.
  const isDashboardRoute =
    location.pathname === ROUTES.DASHBOARD ||
    location.pathname === ROUTES.PORTAL_DASHBOARD ||
    location.pathname === '/dashboard' ||
    location.pathname === '/portal/dashboard';

  const shouldEnforceTeam = requireTeam !== undefined ? requireTeam : isDashboardRoute;

  if (shouldEnforceTeam && user?.role !== 'ADMIN' && !user?.teamId) {
    return <Navigate to={ROUTES.REGISTER} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
