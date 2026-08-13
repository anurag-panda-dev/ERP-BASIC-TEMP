export const successResponse = (data, message = 'Success', statusCode = 200) => ({
  success: true,
  message,
  statusCode,
  data,
});

export const errorResponse = (message, statusCode = 400, errors = null) => ({
  success: false,
  message,
  statusCode,
  ...(errors && { errors }),
});

export const paginatedResponse = (
  data,
  totalCount,
  page,
  limit,
  message = 'Success'
) => ({
  success: true,
  message,
  data,
  pagination: {
    page,
    limit,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    hasMore: page * limit < totalCount,
  },
});
