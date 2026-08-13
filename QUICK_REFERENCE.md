# CampusFlow - Developer Quick Reference

**Last Updated:** 2026-08-13 | **Status:** MVP Ready for Implementation

---

## 🚀 Quick Start (5 Minutes)

### Backend Setup
```bash
cd server
npm install
cp .env.example .env.local
# Edit .env.local - set MONGODB_URI
npm run seed
npm run dev              # http://localhost:5000
```

### Frontend Setup
```bash
cd client
npm install
cp .env.example .env.local
# VITE_API_URL=http://localhost:5000/api
npm run dev              # http://localhost:5173
```

### Test Login
```
Email: admin@campusflow.com
Password: password123
```

---

## 📚 Documentation Map

| Document | Purpose | Location |
|----------|---------|----------|
| **Implementation Plan** | Detailed folder structure & file responsibilities | `/client/IMPLEMENTATION_PLAN.md` |
| **Implementation Plan** | Detailed API routes & database schemas | `/server/IMPLEMENTATION_PLAN.md` |
| **Project Setup Guide** | Overall project structure & getting started | `/PROJECT_SETUP_GUIDE.md` |
| **Design Brief** | UI/UX guidelines & design tokens | `/CampusFlow_DesignBrief.md` |
| **PRD** | Features & user stories | `/CampusFlow_PRD.md` |
| **TRD** | Technical architecture & stack decisions | `/CampusFlow_TRD.md` |

---

## 🏗️ Folder Structure at a Glance

### Frontend (`/client/src/`)
```
components/    → UI components (buttons, modals, tables)
pages/         → Role-based pages (student, faculty, admin)
services/      → API calls & business logic
hooks/         → Custom React hooks
context/       → Global state (auth, theme)
router/        → React Router setup
config/        → API client & constants
utils/         → Helper functions
```

### Backend (`/server/src/`)
```
models/        → MongoDB schemas
controllers/   → Request handlers
services/      → Business logic
routes/        → API endpoints
middleware/    → Auth, validation, error handling
schemas/       → Zod validation
config/        → Database, environment
utils/         → Helpers, seeding
```

---

## 🔌 Key APIs

### Authentication
```
POST   /api/auth/login              (email, password)
GET    /api/auth/me                 (Protected)
```

### Academics (Core)
```
GET    /api/attendance              (subjectId, date)
POST   /api/attendance              (Submit attendance)
GET    /api/assessments             (subjectId)
POST   /api/assessments             (Create assessment)
GET    /api/dashboard/student/:id   (Risk status + all data)
```

### Admin
```
GET    /api/users                   (List students/faculty)
POST   /api/users                   (Create user)
GET    /api/subjects                (List subjects)
POST   /api/subjects                (Create subject)
```

**Full API Docs:** See [Backend Plan - Section 5](server/IMPLEMENTATION_PLAN.md#5-api-structure-restful)

---

## 🧩 Component Hierarchy

### Student Dashboard (Example Flow)
```
StudentDashboard
├── RiskDetectorCard          (Hero card - Red/Yellow/Green status)
├── AttendanceChart           (Visual attendance overview)
├── MarksChart                (Visual marks overview)
├── TodaysTimetable           (Mini timetable widget)
└── RecentNotices             (Notice feed)
```

### Faculty Take Attendance (Example Flow)
```
FacultyTakeAttendance
├── ClassSelector             (Select subject & date)
└── AttendanceRoster          (Student list)
    └── AttendanceToggle      (Present/Absent for each student)
```

---

## 🎯 Risk Detector Logic

```javascript
function calculateRiskStatus(attendancePercent, marksPercent) {
  if (attendancePercent < 60 || marksPercent < 40) {
    return { status: 'RED', message: 'At Risk' };
  }
  if (attendancePercent < 75 || marksPercent < 60) {
    return { status: 'YELLOW', message: 'Needs Improvement' };
  }
  return { status: 'GREEN', message: 'Good Standing' };
}
```

**Displayed on Student Dashboard** → Updates in real-time as attendance/marks change

---

## 🔐 Authentication Flow

```
1. User submits credentials
   ↓
2. Backend validates & returns JWT token
   ↓
3. Frontend stores JWT in localStorage
   ↓
4. Axios interceptor injects JWT in Authorization header
   ↓
5. Backend middleware verifies JWT on protected routes
   ↓
6. User redirected to login if JWT invalid/expired
```

**Files:**
- Frontend: `src/context/AuthContext.jsx`, `src/config/api.js`
- Backend: `src/middleware/authMiddleware.js`, `src/controllers/authController.js`

---

## 📊 Database Collections

| Collection | Key Fields | Indexes |
|-----------|-----------|---------|
| **Users** | userId, email, password, role, department, semester | email (unique), userId (unique), role |
| **Subjects** | subjectCode, name, department, semester, assignedFaculty | subjectCode (unique), department+semester |
| **Attendance** | subject, date, records[] | subject+date (compound) |
| **Assessments** | subject, title, maxMarks, records[] | subject |
| **Notices** | title, content, author, audience, targetSubject | createdAt (desc) |

**Schema Details:** See [Backend Plan - Section 4](server/IMPLEMENTATION_PLAN.md#34-mongoose-models)

---

## 🧪 Testing Checklist

### Unit Tests (Services)
- [ ] Risk detector calculation
- [ ] Attendance percentage calculation
- [ ] Password hashing & comparison
- [ ] Token generation & validation

### Integration Tests (Routes)
- [ ] Login with valid/invalid credentials
- [ ] CRUD operations on users
- [ ] Attendance submission & retrieval
- [ ] Dashboard aggregation queries

### E2E Tests (User Journeys)
- [ ] Student: Login → View Dashboard → Check Risk Status
- [ ] Faculty: Login → Take Attendance → Submit Marks
- [ ] Admin: Login → Create Users → Assign Faculty

---

## ⚠️ Common Pitfalls & Solutions

| Issue | Solution |
|-------|----------|
| CORS Error | Check `CORS_ORIGIN` in backend `.env.local` |
| MongoDB Connection Failed | Ensure MongoDB running or correct `MONGODB_URI` |
| JWT Expired | Frontend auto-redirects to login |
| Port Already in Use | Change `PORT` in backend `.env.local` |
| Attendance Wrong Calculation | Verify only sessions after enrollment counted |
| Password Not Hashing | Check bcrypt rounds in `authService.js` |

---

## 🚦 Implementation Timeline

### Week 1: Foundation
- [ ] Setup both projects
- [ ] Implement authentication
- [ ] Create user management
- [ ] Setup database

### Week 2: Core Features
- [ ] Attendance tracking
- [ ] Marks management
- [ ] Student dashboard
- [ ] Faculty portal

### Week 3: Polish & Deploy
- [ ] Admin dashboard
- [ ] Notices & timetable
- [ ] Testing & optimization
- [ ] Deployment setup

---

## 📋 Environment Variables Checklist

### Backend (.env.local)
```
✓ PORT=5000
✓ MONGODB_URI=mongodb://localhost:27017/campusflow
✓ JWT_SECRET=<32+ character strong key>
✓ CORS_ORIGIN=http://localhost:5173
✓ NODE_ENV=development
```

### Frontend (.env.local)
```
✓ VITE_API_URL=http://localhost:5000/api
✓ VITE_APP_NAME=CampusFlow
```

---

## 🎨 Design Tokens Quick Reference

### Colors
- **Primary:** `#4F46E5` (Indigo-600)
- **Success/Green:** `#10B981` (Emerald-500)
- **Warning/Yellow:** `#F59E0B` (Amber-500)
- **Danger/Red:** `#EF4444` (Red-500)
- **Background:** `#F8FAFC` (Slate-50)
- **Text Primary:** `#0F172A` (Slate-900)
- **Text Secondary:** `#64748B` (Slate-500)

### Typography
- **Font:** Inter (sans-serif)
- **Base Size:** 16px (1rem)
- **H1:** 36px, Bold
- **H2:** 24px, Semibold
- **Body:** 16px, Regular
- **Small:** 14px, Medium

### Spacing
- **Base Unit:** 4px
- **Scale:** 4, 8, 12, 16, 24, 32px

### Border Radius
- **Buttons & Inputs:** 6px
- **Cards & Modals:** 12px

---

## 🔄 Development Workflow

### Adding a New Feature

**Backend:**
1. Create Zod schema in `src/schemas/`
2. Create/update model in `src/models/`
3. Implement service logic in `src/services/`
4. Create controller in `src/controllers/`
5. Define routes in `src/routes/`
6. Register in `src/routes/index.js`
7. Test with Postman/curl

**Frontend:**
1. Create API service in `src/services/api/`
2. Create TanStack Query hook in `src/queries/`
3. Create component in `src/components/`
4. Add route in `src/router/index.jsx`
5. Integrate into page
6. Test in browser

---

## 🐛 Debug Tips

### Frontend
```javascript
// Check API calls
// DevTools → Network tab → Filter by "Fetch/XHR"

// Check state
// React DevTools → Components → Inspect context/hooks

// Check localStorage
// DevTools → Application → Local Storage → Check JWT token
```

### Backend
```javascript
// Check logs
// npm run dev → Console output shows requests

// Test API directly
// curl -H "Authorization: Bearer <token>" http://localhost:5000/api/users

// Check database
// mongosh → db.users.find() → View documents
```

---

## 📱 Responsive Design Breakpoints

### Mobile-First (Tailwind CSS)
- **sm:** 640px - Tablets
- **md:** 768px - Small laptops  
- **lg:** 1024px - Desktop
- **xl:** 1280px - Large desktop

**Example:**
```jsx
<div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
  Responsive grid
</div>
```

---

## 🚀 Deployment Checklist

### Before Going Live
- [ ] All `.env.local` files removed from git
- [ ] `.env.example` templates in place
- [ ] API error messages don't leak sensitive data
- [ ] HTTPS enabled (for production)
- [ ] Rate limiting enabled
- [ ] Database backups configured
- [ ] Monitoring & logging setup
- [ ] Security audit passed
- [ ] Load testing completed
- [ ] Cross-browser testing done

---

## 🤝 Code Review Checklist

- [ ] Follows folder structure from implementation plan
- [ ] Services handle business logic (not components)
- [ ] Controllers are thin (parse request, call service, format response)
- [ ] Error handling covers edge cases
- [ ] Zod validation on all inputs
- [ ] No hardcoded values (use constants)
- [ ] No API calls directly in components
- [ ] Proper error boundaries
- [ ] Accessible (WCAG AA contrast, focus states)
- [ ] Mobile responsive
- [ ] Tests written (unit + integration)

---

## 💡 Pro Tips

1. **Seed Data Often:** `npm run seed` populates realistic test data instantly
2. **Use Nodemon:** Automatically restarts backend on file changes
3. **DevTools:** Master React DevTools for component inspection
4. **API Testing:** Use Postman/Insomnia for API testing before frontend integration
5. **Git Commits:** Commit after each feature (atomic commits make debugging easier)
6. **Component Props:** Use TypeScript JSDoc or Zod for prop validation
7. **Loading States:** Always show skeleton loaders while fetching
8. **Error Messages:** Be specific (not just "Error occurred")

---

## 📞 Quick Links

- [Frontend Plan](client/IMPLEMENTATION_PLAN.md)
- [Backend Plan](server/IMPLEMENTATION_PLAN.md)
- [Project Setup Guide](PROJECT_SETUP_GUIDE.md)
- [Design Brief](CampusFlow_DesignBrief.md)
- [Product Requirements](CampusFlow_PRD.md)
- [Technical Requirements](CampusFlow_TRD.md)

---

**Next Step:** Start with backend setup, then frontend. Follow the implementation plans exactly.

**Questions?** Refer to the detailed implementation plans or project setup guide.
