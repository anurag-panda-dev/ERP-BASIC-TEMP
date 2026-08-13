import * as dashboardService from '../services/dashboardService.js';
import { successResponse } from '../utils/responseFormatter.js';
import { asyncHandler, AppError } from '../utils/errorHandler.js';
import { HTTP_STATUS } from '../config/constants.js';
import logger from '../utils/logger.js';

export const getStudentDashboard = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const dashboard = await dashboardService.getStudentDashboard(studentId);

  res.json(successResponse(dashboard, 'Student dashboard fetched successfully'));
});

export const getFacultyDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  // Try to get the actual user ID from database
  // For now, use the Clerk userId
  const dashboard = await dashboardService.getFacultyDashboard(userId);

  res.json(successResponse(dashboard, 'Faculty dashboard fetched successfully'));
});

export const getAdminDashboard = asyncHandler(async (req, res) => {
  const dashboard = await dashboardService.getAdminDashboard();

  res.json(successResponse(dashboard, 'Admin dashboard fetched successfully'));
});

export const getRiskStatus = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  try {
    const dashboard = await dashboardService.getStudentDashboard(studentId);

    res.json(
      successResponse(dashboard.riskStatus, 'Risk status fetched successfully')
    );
  } catch (error) {
    logger.error('Error fetching risk status:', error);
    throw error;
  }
});
