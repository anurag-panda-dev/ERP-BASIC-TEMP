import User from '../models/User.js';
import * as authService from '../services/authService.js';
import { successResponse, paginatedResponse } from '../utils/responseFormatter.js';
import { asyncHandler, AppError } from '../utils/errorHandler.js';
import { getPaginationParams } from '../utils/validators.js';
import { HTTP_STATUS } from '../config/constants.js';
import logger from '../utils/logger.js';

export const getAllUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPaginationParams(req.query);
  const { role, department, search } = req.query;

  let query = { isActive: true };

  if (role) query.role = role;
  if (department) query.department = department;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { userId: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(query)
    .populate('department', 'name code')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalCount = await User.countDocuments(query);

  res.json(paginatedResponse(users, totalCount, page, limit, 'Users fetched successfully'));
});

export const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id).populate('department', 'name code');

  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  res.json(successResponse(user, 'User fetched successfully'));
});

export const createUser = asyncHandler(async (req, res) => {
  const { userId, name, email, role, department, semester, phone } = req.validatedBody;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { userId }],
  });

  if (existingUser) {
    throw new AppError('User already exists with this email or ID', HTTP_STATUS.CONFLICT);
  }

  const user = await User.create({
    userId,
    name,
    email,
    role,
    department: department || null,
    semester: semester || null,
    phone: phone || null,
    clerkId: `manual-${email}-${Date.now()}`, // Fallback for manually created users
  });

  logger.info(`✅ New user created: ${email}`);

  res.status(HTTP_STATUS.CREATED).json(
    successResponse(user, 'User created successfully', HTTP_STATUS.CREATED)
  );
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, role, department, semester, phone } = req.validatedBody;

  const user = await User.findById(id);

  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  // Check for email duplication if email is being updated
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError('Email already in use', HTTP_STATUS.CONFLICT);
    }
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  if (department) user.department = department;
  if (semester) user.semester = semester;
  if (phone) user.phone = phone;

  await user.save();

  logger.info(`✅ User updated: ${user.email}`);

  res.json(successResponse(user, 'User updated successfully'));
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true });

  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  logger.info(`✅ User deleted: ${user.email}`);

  res.json(successResponse({ id: user._id }, 'User deleted successfully'));
});

export const getUsersByRole = asyncHandler(async (req, res) => {
  const { role } = req.params;
  const { page, limit, skip } = getPaginationParams(req.query);

  if (!['admin', 'faculty', 'student'].includes(role)) {
    throw new AppError('Invalid role', HTTP_STATUS.BAD_REQUEST);
  }

  const users = await User.find({ role, isActive: true })
    .populate('department', 'name code')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalCount = await User.countDocuments({ role, isActive: true });

  res.json(paginatedResponse(users, totalCount, page, limit, `${role}s fetched successfully`));
});

export const enrollStudentInDepartment = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const { departmentId, semester } = req.body;

  const user = await authService.updateUserRole(studentId, 'student', departmentId, semester);

  res.json(successResponse(user, 'Student enrolled successfully'));
});

export const assignFacultyRole = asyncHandler(async (req, res) => {
  const { facultyId } = req.params;
  const { departmentId } = req.body;

  const user = await authService.updateUserRole(facultyId, 'faculty', departmentId);

  res.json(successResponse(user, 'Faculty role assigned successfully'));
});
