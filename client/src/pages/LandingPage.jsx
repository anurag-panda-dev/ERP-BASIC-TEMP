import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext.jsx';
import { ROLES } from '../config/constants.js';
import Button from '../components/common/Button.jsx';
import Modal from '../components/common/Modal.jsx';
import { RiskBadge } from '../components/common/Badge.jsx';

export default function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuthContext();
  const [showGuideModal, setShowGuideModal] = React.useState(false);

  const getDashboardPath = () => {
    if (role === ROLES.ADMIN) return '/admin/dashboard';
    if (role === ROLES.FACULTY) return '/faculty/dashboard';
    return '/student/dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* ── Navigation Bar ────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-500/20">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-indigo-950 bg-clip-text text-transparent">
              CampusFlow
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-primary-600 transition-colors">Features</a>
            <a href="#portals" className="hover:text-primary-600 transition-colors">Portals</a>
            <a href="#risk-detector" className="hover:text-primary-600 transition-colors">Risk Detector</a>
            <button onClick={() => setShowGuideModal(true)} className="hover:text-primary-600 transition-colors font-semibold text-primary-600">
              Role Guide 📖
            </button>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button onClick={() => navigate(getDashboardPath())}>
                Go to Dashboard →
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/login')}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero Section ───────────────────────────────────────────── */}
      <section className="relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden">
        {/* Background Decorative Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold uppercase tracking-wider animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Modern College ERP & Academic Intelligence
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Eliminate Academic Risk. <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-primary-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Empower Campus Operations.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              CampusFlow centralizes attendance, marks, timetables, and notices into one seamless web platform with automated rule-based academic risk detection.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                onClick={() => navigate(isAuthenticated ? getDashboardPath() : '/login')}
                className="w-full sm:w-auto shadow-lg shadow-indigo-500/25"
              >
                {isAuthenticated ? 'Open Dashboard' : 'Get Started Now'} →
              </Button>
              <a href="#features">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Explore Features
                </Button>
              </a>
            </div>

            {/* Quick stats badges */}
            <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                75% Attendance Guard
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Fast 2-Min Faculty Roll Call
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Role-Based RBAC Security
              </span>
            </div>
          </div>

          {/* Interactive Mockup Preview */}
          <div className="mt-12 lg:mt-16 max-w-5xl mx-auto">
            <div className="card p-2 sm:p-4 bg-white/70 backdrop-blur-xl border border-slate-200/80 shadow-2xl shadow-slate-900/10 rounded-2xl overflow-hidden">
              <div className="bg-slate-900 rounded-xl p-4 sm:p-6 text-white space-y-6">
                {/* Mock header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono text-slate-400 ml-2">campusflow.edu / student / dashboard</span>
                  </div>
                  <RiskBadge status="GREEN" />
                </div>

                {/* Hero card simulation */}
                <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Academic Risk Status</span>
                    <h3 className="text-xl font-bold text-white">Good Standing 🟢</h3>
                    <p className="text-xs text-slate-300">Overall Attendance: <strong className="text-emerald-400">84%</strong> · Marks Average: <strong className="text-indigo-400">76%</strong></p>
                  </div>
                  <div className="flex items-center gap-4 text-center">
                    <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-700">
                      <p className="text-lg font-bold text-emerald-400">84%</p>
                      <p className="text-[10px] text-slate-400">Attendance</p>
                    </div>
                    <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-700">
                      <p className="text-lg font-bold text-indigo-400">76%</p>
                      <p className="text-[10px] text-slate-400">Marks</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Risk Detector Feature Highlight ────────────────────────── */}
      <section id="risk-detector" className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Academic Risk Detector</h2>
            <p className="text-slate-600 mt-2">
              Automated rule-based evaluation giving students immediate, color-coded feedback on their standing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card p-6 border-l-4 border-l-emerald-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="badge badge-green text-sm font-semibold">Good Standing</span>
                <span className="text-2xl">🟢</span>
              </div>
              <p className="text-sm font-medium text-slate-900 mb-2">Attendance ≥ 75% AND Marks ≥ 60%</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Student is fully compliant with institutional mandates. No intervention required.
              </p>
            </div>

            <div className="card p-6 border-l-4 border-l-amber-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="badge badge-yellow text-sm font-semibold">Needs Improvement</span>
                <span className="text-2xl">🟡</span>
              </div>
              <p className="text-sm font-medium text-slate-900 mb-2">Attendance &lt; 75% OR Marks &lt; 60%</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Early warning alert. Prompts student to focus on subjects dragging down performance.
              </p>
            </div>

            <div className="card p-6 border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <span className="badge badge-red text-sm font-semibold">At Risk</span>
                <span className="text-2xl">🔴</span>
              </div>
              <p className="text-sm font-medium text-slate-900 mb-2">Attendance &lt; 60% OR Marks &lt; 40%</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Critical alert. Immediate action required to prevent examination debarment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Three Dedicated Portals ───────────────────────────────── */}
      <section id="portals" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Tailored Experience for Every Role</h2>
            <p className="text-slate-600 mt-2">
              Role-Based Access Control ensures every user gets a purpose-built workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Student */}
            <div className="card p-8 space-y-4 hover:border-indigo-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Student Portal</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">✓ Real-time Academic Risk Status</li>
                <li className="flex items-center gap-2">✓ Subject-wise attendance breakdown</li>
                <li className="flex items-center gap-2">✓ Assessment transcript view</li>
                <li className="flex items-center gap-2">✓ Daily & weekly timetable</li>
              </ul>
            </div>

            {/* Faculty */}
            <div className="card p-8 space-y-4 hover:border-indigo-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Faculty Suite</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">✓ 2-minute daily roll call roster</li>
                <li className="flex items-center gap-2">✓ Create assessments & enter marks</li>
                <li className="flex items-center gap-2">✓ Publish results to students</li>
                <li className="flex items-center gap-2">✓ Target announcements to classes</li>
              </ul>
            </div>

            {/* Admin */}
            <div className="card p-8 space-y-4 hover:border-indigo-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900">Admin Command Center</h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">✓ Full User Management (CRUD)</li>
                <li className="flex items-center gap-2">✓ Department & Subject creation</li>
                <li className="flex items-center gap-2">✓ Assign Faculty to subjects</li>
                <li className="flex items-center gap-2">✓ System-wide broadcast notices</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Role Onboarding Modal ─────────────────────────────────── */}
      <Modal
        isOpen={showGuideModal}
        onClose={() => setShowGuideModal(false)}
        title="User Onboarding & Role Sign-Up Guide"
        size="lg"
      >
        <div className="space-y-6 text-sm text-slate-700">
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl">
            <h4 className="font-bold text-indigo-900 mb-1">Architecture Note</h4>
            <p className="text-xs text-indigo-800">
              CampusFlow uses <strong>Clerk</strong> for secure authentication. Every new sign-up is registered with the <strong>Student</strong> role by default. Admins upgrade accounts to <strong>Faculty</strong> or <strong>Admin</strong>.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span>🎓</span> 1. Student Sign-Up
            </h3>
            <ol className="list-decimal pl-5 space-y-1 text-slate-600">
              <li>Click <strong>Get Started</strong> / <strong>Sign In</strong> and enter your email & password.</li>
              <li>Your account is automatically initialized as a Student.</li>
              <li>You will land on the Student Dashboard with access to attendance %, risk detector, and timetable.</li>
            </ol>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span>👩‍🏫</span> 2. Faculty Onboarding
            </h3>
            <ol className="list-decimal pl-5 space-y-1 text-slate-600">
              <li>Faculty members sign up normally via the sign-in page using their official email.</li>
              <li>An <strong>Administrator</strong> opens <strong>Admin Panel → User Management</strong> (<code className="bg-slate-100 px-1 py-0.5 rounded">/admin/users</code>).</li>
              <li>Admin edits the faculty member's profile, changes role to <strong>Faculty</strong>, and assigns their Department & Subjects.</li>
            </ol>
          </div>

          <div className="space-y-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <span>🛡️</span> 3. Admin Account Setup
            </h3>
            <p className="text-slate-600">
              Admin accounts are created during initial database setup via <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs font-mono">npm run seed</code> on the backend, or promoted by an existing Admin in the User Management panel.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
