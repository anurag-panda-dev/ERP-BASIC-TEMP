# CampusFlow - MERN Stack Implementation Guide

**Project:** Smart College ERP System  
**Stack:** MERN (MongoDB, Express.js, React.js, Node.js)  
**Architecture:** Monolithic Three-Tier (Client, Server, Database)  
**Deployment:** Local development ready, production-ready with configuration

---

## 📋 Quick Navigation

- **[Frontend Plan](/client/IMPLEMENTATION_PLAN.md)** - React app structure, components, routing
- **[Backend Plan](/server/IMPLEMENTATION_PLAN.md)** - Express API, database models, services
- **[Design Brief](CampusFlow_DesignBrief.md)** - UI/UX guidelines and design tokens
- **[Product Requirements](CampusFlow_PRD.md)** - Features, user stories, acceptance criteria
- **[Technical Requirements](CampusFlow_TRD.md)** - Architecture, tech stack, scalability

---

## 🏗️ Project Structure

```
E-College-management-system/
├── client/                          # React frontend (Vite)
│   ├── IMPLEMENTATION_PLAN.md       # Detailed frontend structure
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Role-based page components
│   │   ├── services/                # API integration layer
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── context/                 # Auth & theme state
│   │   ├── router/                  # React Router setup
│   │   ├── styles/                  # Tailwind CSS config
│   │   └── utils/                   # Helper functions
│   ├── package.json                 # Dependencies & scripts
│   └── vite.config.js              # Vite configuration
│
├── server/                          # Express.js backend
│   ├── IMPLEMENTATION_PLAN.md       # Detailed backend structure
│   ├── src/
│   │   ├── config/                  # App configuration
│   │   ├── middleware/              # Express middleware
│   │   ├── models/                  # MongoDB schemas
│   │   ├── controllers/             # Request handlers
│   │   ├── services/                # Business logic
│   │   ├── routes/                  # API endpoints
│   │   ├── schemas/                 # Zod validation
│   │   ├── utils/                   # Utilities & seeding
│   │   ├── app.js                   # Express app setup
│   │   └── server.js                # Server entry point
│   ├── package.json                 # Dependencies & scripts
│   └── nodemon.json                 # Dev server config
│
├── CampusFlow_DesignBrief.md        # Design system & guidelines
├── CampusFlow_PRD.md                # Product requirements
├── CampusFlow_TRD.md                # Technical architecture
├── idea.md                          # Project overview
└── PROJECT_SETUP_GUIDE.md          # This file
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** 18.0.0 or higher
- **npm/yarn:** Latest stable version
- **MongoDB:** 5.0+ (local or cloud like MongoDB Atlas)
- **Git:** For version control

### Step 1: Clone/Setup Project
```bash
# Navigate to project root
cd E-College-management-system

# Create .env files from templates
cd server && cp .env.example .env.local && cd ..
cd client && cp .env.example .env.local && cd ..
```

### Step 2: Setup Backend
```bash
cd server

# Install dependencies
npm install

# Update .env.local with MongoDB URI
# Example: MONGODB_URI=mongodb://localhost:27017/campusflow
# Or: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/campusflow

# Start development server
npm run dev                    # Runs on http://localhost:5000

# In another terminal, seed database with test data
npm run seed
```

**Default Test Credentials (After Seeding):**
```
Admin:    admin@campusflow.com / password123
Faculty:  faculty1@campus.com / password123
Student:  student1@campus.com / password123
```

### Step 3: Setup Frontend
```bash
cd client

# Install dependencies
npm install

# Update .env.local to point to backend
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev                    # Runs on http://localhost:5173
```

### Step 4: Test the Application
1. Open browser at `http://localhost:5173`
2. Login with test credentials
3. Navigate through student/faculty/admin dashboards
4. Verify API calls in browser DevTools (Network tab)

---

## 🛠️ Development Workflow

### Working on Frontend
```bash
cd client
npm run dev              # Start dev server with hot reload
npm run lint            # Check code quality
npm run format          # Format code with Prettier
npm run build           # Build for production
```

### Working on Backend
```bash
cd server
npm run dev             # Start with nodemon (auto-reload)
npm run lint            # Check code quality
npm run seed            # Populate test data
npm run test            # Run tests
npm start               # Production start
```

### Making API Calls from Frontend
The frontend uses Axios with automatic JWT injection:
```javascript
// In src/services/api/userService.js
import api from '../../config/api';

export const getUsers = async (page = 1, limit = 20) => {
  const response = await api.get('/users', {
    params: { page, limit }
  });
  return response.data;
};
```

### Backend: Adding New Features
1. **Define Zod Schema** → `src/schemas/featureSchemas.js`
2. **Create Model** → `src/models/Feature.js`
3. **Implement Service** → `src/services/featureService.js`
4. **Create Controller** → `src/controllers/featureController.js`
5. **Define Routes** → `src/routes/features.js`
6. **Register Routes** → `src/routes/index.js`

---

## 📊 Key Features

### ✅ Phase 1: MVP (Core Functionality)
- [x] Role-based authentication (Admin, Faculty, Student)
- [x] Student dashboard with Academic Risk Detector
- [x] Faculty attendance marking & grade entry
- [x] Admin user and course management
- [x] Subject-wise attendance tracking
- [x] Assessment/marks management
- [x] Global notices & announcements
- [x] Timetable display

### ⏳ Phase 2: Enhancements (Future)
- [ ] Fee management module
- [ ] Examination scheduling & results
- [ ] Library management
- [ ] Student-faculty messaging
- [ ] Leave application system
- [ ] Placement portal

### 🎯 Academic Risk Detector Logic
```
🔴 RED (At Risk):
   - Attendance < 60% OR Marks < 40%
   
🟡 YELLOW (Needs Improvement):
   - Attendance < 75% OR Marks < 60%
   
🟢 GREEN (Good Standing):
   - Attendance >= 75% AND Marks >= 60%
```

---

## 🗄️ Database Design

### Core Collections
- **Users** - Students, Faculty, Admins
- **Departments** - Course departments
- **Subjects** - Courses offered
- **Attendance** - Daily attendance records
- **Assessments** - Marks/grades for assignments
- **Notices** - Announcements
- **Timetables** - Class schedules

### Key Indexes
```javascript
// For fast queries and sorting
db.users.createIndex({ email: 1 }, { unique: true });
db.subjects.createIndex({ department: 1, semester: 1 });
db.attendance.createIndex({ subject: 1, date: 1 });
db.notices.createIndex({ createdAt: -1 });
```

---

## 🔐 Security Considerations

### Frontend
- JWT tokens stored in localStorage (configurable for sessionStorage)
- Protected routes redirect unauthenticated users to login
- Role-based UI rendering (Admin features hidden from students)
- Input validation with Zod before API calls

### Backend
- **Password Security:** bcryptjs with 10 salt rounds
- **Authentication:** JWT with configurable expiry (default 7 days)
- **Authorization:** Role-based middleware on sensitive endpoints
- **Validation:** Zod schema validation on all inputs
- **Error Handling:** Generic error messages to prevent information leakage
- **CORS:** Whitelist frontend origin in production

### Environment Variables
**NEVER commit `.env.local` or `.env.production` files. They contain secrets.**

```bash
# Backend (.env.local)
MONGODB_URI=...          # Keep private
JWT_SECRET=...           # Keep private (min 32 chars)

# Frontend (.env.local)
VITE_API_URL=...         # Can be public (not sensitive)
```

---

## 📈 Performance & Scalability

### Frontend Optimization
- Code splitting by role (lazy load admin pages)
- Skeleton loaders for better perceived performance
- TanStack Query caching to reduce API calls
- Memoization of heavy components

### Backend Optimization
- MongoDB indexes on frequently queried fields
- Pagination on all list endpoints
- Aggregation pipelines for dashboard queries
- Connection pooling with Mongoose

### Database Optimization
- Compound indexes on subject + date for attendance
- TTL indexes for automatic session cleanup (optional)
- Field projection to return only needed data
- Batch operations for bulk updates

---

## 🧪 Testing Strategy

### Unit Tests (Services & Utilities)
```bash
cd server
npm test -- src/__tests__/services/attendanceService.test.js
```

### Integration Tests (Routes & Controllers)
```bash
cd server
npm test -- src/__tests__/routes/
```

### End-to-End Tests (User Journeys)
```bash
# Frontend
cd client
npm run test:e2e

# Backend
cd server
npm run test:e2e
```

---

## 📚 API Documentation

### Authentication Endpoints
```
POST   /api/auth/login              → { token, user }
GET    /api/auth/me                 → { user } (Protected)
```

### User Management (Admin)
```
GET    /api/users?page=1&limit=20   → { users, total }
POST   /api/users                   → { userId, name, email, ... }
PUT    /api/users/:id               → { user }
DELETE /api/users/:id               → { message }
```

### Academics
```
GET    /api/attendance?subjectId=... → { records }
POST   /api/attendance              → { message }
GET    /api/assessments?subjectId=...→ { assessments }
POST   /api/assessments             → { assessment }
```

### Dashboards
```
GET    /api/dashboard/student/:id   → { attendance%, marks%, riskStatus, notices }
GET    /api/dashboard/faculty       → { todaySchedule, pendingAttendance }
GET    /api/dashboard/admin         → { stats }
```

**Full API docs:** See [Backend Plan - Section 5](server/IMPLEMENTATION_PLAN.md#5-api-structure-restful)

---

## 🐛 Common Issues & Solutions

### Issue: MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB locally or update MONGODB_URI in .env.local
```bash
# Local MongoDB
mongod              # If installed locally

# Or use MongoDB Atlas (cloud)
# Update: MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/campusflow
```

### Issue: CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Ensure backend CORS_ORIGIN in .env matches frontend URL
```bash
# Backend .env.local
CORS_ORIGIN=http://localhost:5173
```

### Issue: Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:** Change port in .env or kill existing process
```bash
# Backend .env.local
PORT=5001

# Or kill process
# Windows: taskkill /PID <pid> /F
# Mac/Linux: kill -9 <pid>
```

### Issue: JWT Token Expired
```
Error: 401 Unauthorized - Token expired
```
**Solution:** Frontend auto-redirects to login on 401. Credentials are cleared automatically.

---

## 📦 Deployment

### Frontend Deployment (Vercel/Netlify)
```bash
cd client
npm run build          # Creates dist/ folder
# Deploy dist/ folder to Vercel/Netlify/AWS S3
```

**Environment Variables (Production):**
```
VITE_API_URL=https://api.campusflow.com/api
```

### Backend Deployment (Heroku/Railway/AWS)
```bash
cd server
# Set environment variables on hosting platform
npm run build          # If using TypeScript (not needed for Node.js)
npm start              # Runs on specified PORT
```

**Environment Variables (Production):**
```
MONGODB_URI=<production-mongodb-url>
JWT_SECRET=<strong-secret-key>
NODE_ENV=production
CORS_ORIGIN=https://campusflow.vercel.app
```

---

## 📞 Support & Resources

### Documentation
- **Express.js:** https://expressjs.com/
- **React:** https://react.dev/
- **MongoDB/Mongoose:** https://mongoosejs.com/
- **Tailwind CSS:** https://tailwindcss.com/
- **Vite:** https://vitejs.dev/

### Design System
- **Design Brief:** [CampusFlow_DesignBrief.md](CampusFlow_DesignBrief.md)
- **Colors:** Indigo (#4F46E5) for primary, Slate for neutral
- **Typography:** Inter font, 4px spacing scale
- **Components:** See design tokens in both plans

---

## ✅ Pre-Launch Checklist

### Before First Commit
- [ ] Read both implementation plans thoroughly
- [ ] Understand folder structure for frontend and backend
- [ ] Review design brief for UI/UX consistency
- [ ] Check all environment variable templates

### Before Development Start
- [ ] Setup both client and server folders with dependencies
- [ ] Configure MongoDB connection
- [ ] Seed test data with `npm run seed`
- [ ] Test login flow with test credentials
- [ ] Verify API communication in browser DevTools

### Before Deployment
- [ ] All features from PRD implemented
- [ ] Security best practices followed
- [ ] Environment variables properly configured
- [ ] Comprehensive testing completed
- [ ] Performance optimized
- [ ] Error handling covers edge cases

---

## 🎓 Learning Path

### Week 1: Foundation
1. Understand MERN stack basics
2. Setup development environment
3. Implement authentication (Login/JWT)
4. Create user management module

### Week 2: Core Features
1. Implement attendance tracking
2. Implement marks/assessment management
3. Build student dashboard with risk detector
4. Build faculty portal for data entry

### Week 3: Polish & Enhancement
1. Admin dashboard and reporting
2. Notices and announcements
3. Performance optimization
4. Comprehensive error handling
5. Security audit

---

## 📝 Notes for AI Implementation

When building this project with AI assistance:

1. **Follow the Plans Precisely:** Both implementation plans provide exact folder structures and file responsibilities. Stick to them.

2. **Component Isolation:** Each component should be self-contained with clear props and exports.

3. **Service Layer:** Keep API calls isolated in the services directory. Never call APIs directly from components.

4. **Error Handling:** Implement comprehensive error handling at all layers (frontend forms, API calls, backend routes).

5. **Testing:** Write tests alongside implementation. Each service should have corresponding tests.

6. **Documentation:** Maintain inline comments for complex logic, especially in services and risk detector calculations.

7. **Git Commits:** Create meaningful commits at each feature completion (e.g., "feat: implement risk detector logic", "fix: attendance calculation edge case").

8. **Code Review:** Before merging, ensure code follows established patterns from the implementation plans.

---

**Last Updated:** 2026-08-13  
**Version:** 1.0 - MVP Implementation Plan
