import User from '../models/User.js';
import logger from '../utils/logger.js';
import { AppError } from '../utils/errorHandler.js';
import { HTTP_STATUS } from '../config/constants.js';

export const getOrCreateUser = async (clerkId, email, name) => {
  try {
    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({
        clerkId,
        email,
        name,
        role: 'student',
      });
      logger.info(`✅ New user created: ${email}`);
    }

    return user;
  } catch (error) {
    logger.error('Error in getOrCreateUser:', error);
    throw new AppError('Failed to get or create user', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getUserByClerkId = async (clerkId) => {
  try {
    const user = await User.findOne({ clerkId })
      .populate('department')
      .populate('enrolledSubjects');

    return user;
  } catch (error) {
    logger.error('Error in getUserByClerkId:', error);
    throw new AppError('Failed to fetch user', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const updateUserRole = async (userId, role, departmentId = null, semester = null) => {
  try {
    const updateData = { role };

    if (departmentId) updateData.department = departmentId;
    if (semester) updateData.semester = semester;

    const user = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    logger.info(`✅ User role updated: ${user.email} -> ${role}`);
    return user;
  } catch (error) {
    logger.error('Error in updateUserRole:', error);
    throw error;
  }
};

export const deactivateUser = async (userId) => {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    logger.info(`✅ User deactivated: ${user.email}`);
    return user;
  } catch (error) {
    logger.error('Error in deactivateUser:', error);
    throw error;
  }
};
