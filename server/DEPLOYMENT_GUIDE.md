# CampusFlow Backend - Deployment Guide

## Overview
CampusFlow is a comprehensive college management system built with Express.js, MongoDB, and Clerk authentication. This guide covers setup, configuration, and deployment.

## Prerequisites
- Node.js 18+ and npm
- MongoDB 5.0+ (cloud or local)
- Clerk account for authentication
- Environment variables configured

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the server root directory with the following variables:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campusflow

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_SIGN_IN_URL=/sign-in
CLERK_SIGN_UP_URL=/sign-up
CLERK_AFTER_SIGN_IN_URL=/dashboard
CLERK_AFTER_SIGN_UP_URL=/dashboard

# Application
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=7d
BCRYPT_ROUNDS=10
```

## Running the Server

### Development Mode
```bash
npm run dev
```

Server starts with hot-reload on `http://localhost:5000`

### Production Mode
```bash
npm start
```

### Seed Database (First Time Only)
```bash
npm run seed
```

This creates:
- 5 departments with 3 faculty each
- 250 total students
- 60 subjects across all semesters
- 30 days of attendance records
- Multiple assessments with grades
- System notices
- Complete timetables

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Users (Admin Only)
- `GET /api/users` - List all users
- `POST /api/users` - Create user
- `GET /api/users/:id` - Get user details
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/role/:role` - Get users by role

### Departments (Admin)
- `GET /api/departments` - List departments
- `POST /api/departments` - Create department
- `GET /api/departments/:id` - Get department details
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Subjects
- `GET /api/subjects` - List subjects
- `POST /api/subjects` - Create subject (Admin)
- `GET /api/subjects/:id` - Get subject details
- `PUT /api/subjects/:id` - Update subject (Admin)
- `DELETE /api/subjects/:id` - Delete subject (Admin)
- `POST /api/subjects/:id/assign-faculty` - Assign faculty (Admin)
- `POST /api/subjects/:id/enroll` - Enroll students (Admin)
- `DELETE /api/subjects/:id/student/:studentId` - Remove student (Admin)

### Attendance
- `GET /api/attendance` - List attendance
- `POST /api/attendance` - Submit attendance (Faculty)
- `GET /api/attendance/subject/:id` - Get subject attendance
- `GET /api/attendance/student/:id` - Get student attendance
- `GET /api/attendance/student/:id/range` - Get attendance by date range

### Assessments
- `GET /api/assessments` - List assessments
- `POST /api/assessments` - Create assessment (Faculty)
- `GET /api/assessments/:id` - Get assessment details
- `PUT /api/assessments/:id` - Update assessment (Faculty)
- `DELETE /api/assessments/:id` - Delete assessment (Faculty)
- `POST /api/assessments/:id/marks` - Submit marks (Faculty)
- `PATCH /api/assessments/:id/publish` - Publish assessment (Faculty)
- `GET /api/assessments/student/:id/marks` - Get student marks

### Dashboard
- `GET /api/dashboard/student/:id` - Student dashboard (with risk status)
- `GET /api/dashboard/faculty` - Faculty dashboard (Faculty)
- `GET /api/dashboard/admin` - Admin dashboard (Admin)
- `GET /api/dashboard/risk/:studentId` - Get risk status

### Notices
- `GET /api/notices` - List notices
- `GET /api/notices/:id` - Get notice details
- `POST /api/notices` - Create notice (Admin/Faculty)
- `PUT /api/notices/:id` - Update notice (Admin/Author)
- `DELETE /api/notices/:id` - Delete notice (Admin/Author)

### Timetables
- `GET /api/timetables` - List timetables
- `GET /api/timetables/:id` - Get timetable details
- `POST /api/timetables` - Create timetable (Admin)
- `PUT /api/timetables/:id` - Update timetable (Admin)
- `DELETE /api/timetables/:id` - Delete timetable (Admin)
- `GET /api/timetables/subject/:id` - Get subject timetable
- `GET /api/timetables/today` - Get today's timetable

## Authentication Flow

### User Roles
1. **Admin** - Full system access, user management, approval authority
2. **Faculty** - Subject management, attendance, assessments, notices
3. **Student** - View own data, assessments, attendance, notices

### Risk Status Calculation
- **RED** ⛔ - Attendance < 60% OR Marks < 40%
- **YELLOW** ⚠️ - Attendance < 75% OR Marks < 60%
- **GREEN** ✅ - Attendance ≥ 75% AND Marks ≥ 60%

## Project Structure

```
server/
├── src/
│   ├── app.js                 # Express app configuration
│   ├── server.js              # Server entry point
│   ├── config/                # Configuration files
│   │   ├── database.js        # MongoDB connection
│   │   ├── environment.js     # Environment validation
│   │   └── constants.js       # Application constants
│   ├── controllers/           # Request handlers (9 modules)
│   ├── models/                # Mongoose schemas (7 collections)
│   ├── routes/                # API route definitions
│   ├── services/              # Business logic layer
│   ├── middleware/            # Express middleware
│   ├── schemas/               # Zod validation schemas
│   ├── utils/                 # Utility functions
│   └── utils/seedDatabase.js  # Database seeding script
└── package.json
```

## Database Schema

### Collections
1. **User** - System users with roles (admin, faculty, student)
2. **Department** - Academic departments
3. **Subject** - Courses offered by departments
4. **Attendance** - Daily attendance records
5. **Assessment** - Assignments, exams, internal assessments
6. **Notice** - System announcements
7. **Timetable** - Class schedules

All collections include timestamps and soft-delete flags.

## Error Handling

All API responses follow standard format:
```json
{
  "success": true/false,
  "data": {},
  "message": "Success message",
  "statusCode": 200
}
```

Error responses include status code and descriptive message:
```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

## Development Commands

```bash
npm run dev      # Start development server with hot-reload
npm start        # Start production server
npm run seed     # Populate database with sample data
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
npm run test     # Run tests (when configured)
```

## Logging

The system uses a custom logger with levels:
- `info` - General information
- `error` - Error messages
- `warn` - Warnings
- `debug` - Debug info (development only)

All logs include ISO timestamps.

## Performance Optimizations

1. **Database Indexes**
   - Unique indexes on email, userId, clerkId
   - Compound indexes on frequently queried fields
   - Sparse indexes on optional fields

2. **Query Optimization**
   - Pagination implemented (default 20 items/page, max 100)
   - Selective field population via MongoDB projections
   - Efficient aggregation pipelines

3. **Caching Strategies**
   - Session-based auth token caching
   - Dashboard data calculated on-demand

## Deployment

### Heroku Deployment
```bash
heroku login
heroku create app-name
git push heroku main
heroku config:set KEY=VALUE  # Set environment variables
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY src ./src
EXPOSE 5000
CMD ["npm", "start"]
```

### MongoDB Atlas Setup
1. Create cluster on MongoDB Atlas
2. Create database user with strong password
3. Add IP whitelist (0.0.0.0/0 for development)
4. Get connection string and set in `.env`

## Monitoring & Debugging

### Check Server Health
```bash
curl http://localhost:5000/health
```

### View Logs
Development logs output to console with timestamps.

### Database Connection Issues
Check `.env` MONGODB_URI format and network connectivity.

## Support & Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**MongoDB Connection Error**
- Verify connection string in `.env`
- Check network access in MongoDB Atlas
- Ensure credentials are correct

**Clerk Authentication Issues**
- Verify CLERK keys are correct
- Check Clerk application settings
- Ensure CORS_ORIGIN matches frontend URL

## Security Considerations

1. Never commit `.env` to version control
2. Use strong JWT_SECRET in production
3. Enable HTTPS in production
4. Validate all inputs via Zod schemas
5. Use rate limiting middleware (not yet implemented)
6. Regular security audits

## Next Steps

- Implement rate limiting middleware
- Add request logging and monitoring
- Setup automated testing
- Configure CI/CD pipeline
- Implement caching layer (Redis)
- Add request tracing for debugging

---

**For questions or issues, refer to the implementation plan documentation.**
