import { clerkClient } from '@clerk/express';
import { HTTP_STATUS, ROLES } from '../config/constants.js';
import { AppError } from '../utils/errorHandler.js';
import logger from '../utils/logger.js';

export const requireAuth = (req, res, next) => {
  const auth = req.auth;

  if (!auth || !auth.userId) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Authentication required',
      statusCode: HTTP_STATUS.UNAUTHORIZED,
    });
  }

  req.user = {
    userId: auth.userId,
  };

  next();
};

export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(HTTP_STATUS.FORBIDDEN).json({
        success: false,
        message: 'Access forbidden: insufficient permissions',
        statusCode: HTTP_STATUS.FORBIDDEN,
      });
    }

    next();
  };
};

export const attachUserRole = async (req, res, next) => {
  try {
    const auth = req.auth;

    if (!auth || !auth.userId) {
      return next();
    }

    // Try to get user from Clerk's metadata or from your database
    // For now, we'll fetch from database if the user model stores the role
    // This will be integrated with the User model after it's created
    req.user = {
      userId: auth.userId,
      email: auth.user?.emailAddresses?.[0]?.emailAddress || '',
    };

    next();
  } catch (error) {
    logger.error('Error attaching user role:', error);
    next();
  }
};

export const optionalAuth = (req, res, next) => {
  const auth = req.auth;

  if (auth && auth.userId) {
    req.user = {
      userId: auth.userId,
    };
  }

  next();
};
