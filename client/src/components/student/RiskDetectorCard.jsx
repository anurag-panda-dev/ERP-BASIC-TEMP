import React from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
import { RISK_CONFIG } from '../../config/constants.js';

/**
 * Progress Ring SVG component.
 */
function ProgressRing({ percentage = 0, color = '#4F46E5', size = 80, strokeWidth = 8 }) {
  const r       = (size - strokeWidth) / 2;
  const circ    = 2 * Math.PI * r;
  const offset  = circ - (Math.min(percentage, 100) / 100) * circ;

  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E2E8F0" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="progress-ring transition-all duration-700"
      />
      <text
        x="50%" y="50%"
        dominantBaseline="middle" textAnchor="middle"
        className="rotate-90 origin-center text-xs font-bold fill-slate-900"
        style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%', fontSize: '14px', fontWeight: 700 }}
      >
        {Math.round(percentage)}%
      </text>
    </svg>
  );
}

/**
 * Risk Detector Hero Card — the most prominent element on the student dashboard.
 */
export default function RiskDetectorCard({ riskStatus, attendancePercent = 0, marksPercent = 0 }) {
  const navigate = useNavigate();
  const status   = riskStatus?.status || riskStatus || 'GREEN';
  const config   = RISK_CONFIG[status] || RISK_CONFIG.GREEN;

  const icons = {
    GREEN: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    YELLOW: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
      </svg>
    ),
    RED: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div
      className={clsx(
        'card border-2 p-6 animate-fade-in',
        config.borderClass, config.bgClass
      )}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Left: Status info */}
        <div className="flex items-start gap-4 flex-1">
          <div className={clsx('p-3 rounded-xl', config.bgClass, 'border', config.borderClass)}>
            <span className={config.textClass}>{icons[status]}</span>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Academic Risk Status
            </p>
            <h2 className={clsx('text-2xl font-bold mb-2', config.textClass)}>
              {config.label}
            </h2>
            <p className="text-sm text-slate-600 max-w-sm">
              {status === 'GREEN'  && 'You are meeting all academic requirements. Keep up the great work!'}
              {status === 'YELLOW' && 'Your attendance or marks need attention. Review subject details below.'}
              {status === 'RED'    && 'Immediate action required. You are at risk of academic debarment.'}
            </p>
            <button
              onClick={() => navigate('/student/attendance')}
              className={clsx('mt-3 text-sm font-medium underline underline-offset-2', config.textClass, 'hover:opacity-80 transition-opacity')}
            >
              View detailed breakdown →
            </button>
          </div>
        </div>

        {/* Right: Progress rings */}
        <div className="flex items-center gap-6 sm:gap-8 shrink-0">
          <div className="flex flex-col items-center gap-1">
            <ProgressRing
              percentage={attendancePercent}
              color={
                attendancePercent >= 75 ? '#10B981' :
                attendancePercent >= 60 ? '#F59E0B' : '#EF4444'
              }
            />
            <span className="text-xs font-medium text-slate-500">Attendance</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <ProgressRing
              percentage={marksPercent}
              color={
                marksPercent >= 60 ? '#10B981' :
                marksPercent >= 40 ? '#F59E0B' : '#EF4444'
              }
            />
            <span className="text-xs font-medium text-slate-500">Marks</span>
          </div>
        </div>
      </div>
    </div>
  );
}
