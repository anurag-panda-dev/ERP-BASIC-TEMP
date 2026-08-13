import * as noticeService from '../services/noticeService.js';
import { successResponse } from '../utils/responseFormatter.js';
import { asyncHandler, AppError } from '../utils/errorHandler.js';
import { HTTP_STATUS } from '../config/constants.js';
import logger from '../utils/logger.js';

export const getNotices = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const userRole = req.query.role || 'student';

  const result = await noticeService.getNotices(req.query, userId, userRole);

  res.json(successResponse(result, 'Notices fetched successfully'));
});

export const getNoticeById = asyncHandler(async (req, res) => {
  const { noticeId } = req.params;

  const notice = await noticeService.getNoticeById(noticeId);

  res.json(successResponse(notice, 'Notice fetched successfully'));
});

export const createNotice = asyncHandler(async (req, res) => {
  const userId = req.user?.userId;
  const { title, content, audience, targetSubject, targetDepartment, expiryDate } =
    req.validatedBody;

  const noticeData = {
    title,
    content,
    audience: audience || 'global',
    expiryDate: expiryDate ? new Date(expiryDate) : null,
  };

  if (targetSubject) noticeData.targetSubject = targetSubject;
  if (targetDepartment) noticeData.targetDepartment = targetDepartment;

  const notice = await noticeService.createNotice(noticeData, userId);

  logger.info(`✅ Notice created: ${title}`);

  res.status(HTTP_STATUS.CREATED).json(
    successResponse(notice, 'Notice created successfully', HTTP_STATUS.CREATED)
  );
});

export const updateNotice = asyncHandler(async (req, res) => {
  const { noticeId } = req.params;
  const userId = req.user?.userId;
  const { title, content, audience, targetSubject, isPublished, expiryDate } =
    req.validatedBody;

  const updateData = {};

  if (title) updateData.title = title;
  if (content) updateData.content = content;
  if (audience) updateData.audience = audience;
  if (targetSubject) updateData.targetSubject = targetSubject;
  if (isPublished !== undefined) updateData.isPublished = isPublished;
  if (expiryDate) updateData.expiryDate = new Date(expiryDate);

  const notice = await noticeService.updateNotice(noticeId, updateData, userId);

  logger.info(`✅ Notice updated: ${noticeId}`);

  res.json(successResponse(notice, 'Notice updated successfully'));
});

export const deleteNotice = asyncHandler(async (req, res) => {
  const { noticeId } = req.params;
  const userId = req.user?.userId;

  await noticeService.deleteNotice(noticeId, userId);

  logger.info(`✅ Notice deleted: ${noticeId}`);

  res.json(successResponse({ id: noticeId }, 'Notice deleted successfully'));
});
