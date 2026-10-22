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
 */
export const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, user, identityAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner text="VERIFYING SECURITY CREDENTIALS..." />;
  }

  if (!isAuthenticated && identityAuthenticated) return <Navigate to="/auth/complete" state={{ from: location }} replace />;

  if (!isAuthenticated) {
    const redirectPath = requiredRole === 'ADMIN' ? ROUTES.ADMIN_LOGIN : ROUTES.LOGIN;
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== 'ADMIN') {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
