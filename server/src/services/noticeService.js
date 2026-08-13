import Notice from '../models/Notice.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';
import { AppError } from '../utils/errorHandler.js';
import { HTTP_STATUS, PAGINATION } from '../config/constants.js';
import { getPaginationParams } from '../utils/validators.js';

export const createNotice = async (data, authorId) => {
  try {
    const notice = await Notice.create({
      ...data,
      author: authorId,
    });

    return await notice.populate('author', 'name email role');
  } catch (error) {
    logger.error('Error creating notice:', error);
    throw new AppError('Failed to create notice', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getNotices = async (query, userId, userRole) => {
  try {
    const { page, limit, skip } = getPaginationParams(query);

    let filterQuery = { isPublished: true };

    if (userRole === 'student') {
      const user = await User.findById(userId);
      filterQuery = {
        $or: [
          { audience: 'global' },
          {
            audience: 'class',
            targetSubject: { $in: user.enrolledSubjects },
          },
          {
            audience: 'department',
            targetDepartment: user.department,
          },
        ],
        isPublished: true,
      };
    } else if (userRole === 'faculty') {
      filterQuery = {
        $or: [
          { audience: 'global' },
          { author: userId },
        ],
        isPublished: true,
      };
    }

    const notices = await Notice.find(filterQuery)
      .populate('author', 'name email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await Notice.countDocuments(filterQuery);

    return {
      notices,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + limit < totalCount,
      },
    };
  } catch (error) {
    logger.error('Error fetching notices:', error);
    throw new AppError('Failed to fetch notices', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getNoticeById = async (noticeId) => {
  try {
    const notice = await Notice.findById(noticeId).populate('author', 'name email role');

    if (!notice) {
      throw new AppError('Notice not found', HTTP_STATUS.NOT_FOUND);
    }

    return notice;
  } catch (error) {
    logger.error('Error fetching notice:', error);
    throw error;
  }
};

export const updateNotice = async (noticeId, data, userId) => {
  try {
    const notice = await Notice.findById(noticeId);

    if (!notice) {
      throw new AppError('Notice not found', HTTP_STATUS.NOT_FOUND);
    }

    if (notice.author.toString() !== userId) {
      throw new AppError('Unauthorized to update this notice', HTTP_STATUS.FORBIDDEN);
    }

    Object.assign(notice, data);
    await notice.save();

    return await notice.populate('author', 'name email role');
  } catch (error) {
    logger.error('Error updating notice:', error);
    throw error;
  }
};

export const deleteNotice = async (noticeId, userId) => {
  try {
    const notice = await Notice.findById(noticeId);

    if (!notice) {
      throw new AppError('Notice not found', HTTP_STATUS.NOT_FOUND);
    }

    if (notice.author.toString() !== userId) {
      throw new AppError('Unauthorized to delete this notice', HTTP_STATUS.FORBIDDEN);
    }

    await Notice.findByIdAndDelete(noticeId);
    return { message: 'Notice deleted successfully' };
  } catch (error) {
    logger.error('Error deleting notice:', error);
    throw error;
  }
};
