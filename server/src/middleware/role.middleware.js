const { ROLES } = require('../constants/roles');
const { forbidden, unauthorized } = require('../utils/apiResponse');

/**
 * Role-Based Access Control Middleware
 * Restricts access based on user role (`req.user.role`).
 */
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return unauthorized(res, 'Authentication required before role verification');
    }

    if (!allowedRoles.includes(req.user.role)) {
      return forbidden(res, `Forbidden: Requires one of [${allowedRoles.join(', ')}] permissions`);
    }

    return next();
  };
};

const requireAdmin = requireRole(ROLES.ADMIN);
const requireTeamLeader = requireRole(ROLES.ADMIN, ROLES.TEAM_LEADER);

/**
 * Ensures request is tied to an active team membership
 */
const requireTeamMembership = (req, res, next) => {
  if (!req.user) {
    return unauthorized(res, 'Authentication required');
  }

  if (req.user.role === ROLES.ADMIN) {
    return next(); // Admins bypass team constraint
  }

  if (!req.user.teamId) {
    return forbidden(res, 'Action requires active membership in a registered team');
  }

  return next();
};

module.exports = {
  requireRole,
  requireAdmin,
  requireTeamLeader,
  requireTeamMembership
};
