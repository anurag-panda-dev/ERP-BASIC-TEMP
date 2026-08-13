import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from './context/AuthContext.jsx';
import { ROLES } from './config/constants.js';

import RootLayout from './components/layout/RootLayout.jsx';
import ProtectedRoute from './components/layout/ProtectedRoute.jsx';

import LandingPage from './pages/LandingPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import UnauthorizedPage from './pages/UnauthorizedPage.jsx';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import StudentAttendanceDetail from './pages/student/StudentAttendanceDetail.jsx';
import StudentMarksDetail from './pages/student/StudentMarksDetail.jsx';
import StudentTimetable from './pages/student/StudentTimetable.jsx';
import StudentNotices from './pages/student/StudentNotices.jsx';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard.jsx';
import FacultyTakeAttendance from './pages/faculty/FacultyTakeAttendance.jsx';
import FacultyEnterMarks from './pages/faculty/FacultyEnterMarks.jsx';
import FacultyMyClasses from './pages/faculty/FacultyMyClasses.jsx';
import FacultyNotices from './pages/faculty/FacultyNotices.jsx';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminUserManagement from './pages/admin/AdminUserManagement.jsx';
import AdminDepartmentManagement from './pages/admin/AdminDepartmentManagement.jsx';
import AdminSubjectManagement from './pages/admin/AdminSubjectManagement.jsx';
import AdminNoticeManagement from './pages/admin/AdminNoticeManagement.jsx';

function IndexRedirect() {
  const { isAuthenticated, role, isLoading } = useAuthContext();

  if (isLoading) return null;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (role === ROLES.ADMIN) return <Navigate to="/admin/dashboard" replace />;
  if (role === ROLES.FACULTY) return <Navigate to="/faculty/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login/*" element={<LoginPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Authenticated Layout */}
      <Route element={<RootLayout />}>
        {/* Student Routes */}
        <Route element={<ProtectedRoute roles={ROLES.STUDENT} />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/student/attendance" element={<StudentAttendanceDetail />} />
          <Route path="/student/marks" element={<StudentMarksDetail />} />
          <Route path="/student/timetable" element={<StudentTimetable />} />
          <Route path="/student/notices" element={<StudentNotices />} />
        </Route>

        {/* Faculty Routes */}
        <Route element={<ProtectedRoute roles={ROLES.FACULTY} />}>
          <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
          <Route path="/faculty/take-attendance" element={<FacultyTakeAttendance />} />
          <Route path="/faculty/enter-marks" element={<FacultyEnterMarks />} />
          <Route path="/faculty/my-classes" element={<FacultyMyClasses />} />
          <Route path="/faculty/notices" element={<FacultyNotices />} />
        </Route>

        {/* Admin Routes */}
        <Route element={<ProtectedRoute roles={ROLES.ADMIN} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUserManagement />} />
          <Route path="/admin/departments" element={<AdminDepartmentManagement />} />
          <Route path="/admin/subjects" element={<AdminSubjectManagement />} />
          <Route path="/admin/notices" element={<AdminNoticeManagement />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
