import User from '../models/User.js';
import * as authService from '../services/authService.js';
import { successResponse } from '../utils/responseFormatter.js';
import { asyncHandler } from '../utils/errorHandler.js';
import { HTTP_STATUS } from '../config/constants.js';
import logger from '../utils/logger.js';

export const registerUser = asyncHandler(async (req, res) => {
  const { clerkId, email, name } = req.body;

  const user = await authService.getOrCreateUser(clerkId, email, name);

  res.status(HTTP_STATUS.CREATED).json(
    successResponse(user, 'User registered successfully', HTTP_STATUS.CREATED)
  );
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const clerkId = req.auth?.userId;

  if (!clerkId) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Authentication required',
      statusCode: HTTP_STATUS.UNAUTHORIZED,
    });
  }

  const user = await authService.getUserByClerkId(clerkId);

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'User not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
    });
  }

  res.json(successResponse(user, 'User fetched successfully'));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const clerkId = req.auth?.userId;

  if (!clerkId) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({
      success: false,
      message: 'Authentication required',
      statusCode: HTTP_STATUS.UNAUTHORIZED,
    });
  }

  const user = await User.findOne({ clerkId });

  if (!user) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: 'User not found',
      statusCode: HTTP_STATUS.NOT_FOUND,
    });
  }

  if (name) user.name = name;
  if (phone) user.phone = phone;

  await user.save();

  res.json(successResponse(user, 'Profile updated successfully'));
});

export const healthCheck = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date(),
  });
});
