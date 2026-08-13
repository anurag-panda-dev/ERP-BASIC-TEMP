import React from 'react';
import {
  RadialBarChart, RadialBar, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
} from 'recharts';

/**
 * Attendance Chart — horizontal bar chart per subject.
 */
export function AttendanceChart({ subjects = [] }) {
  const data = subjects.map((s) => ({
    name: s.subject?.name || s.subjectName || s.name || 'Subject',
    attendance: Math.round(s.attendancePercentage ?? s.percentage ?? 0),
  }));

  const getColor = (val) =>
    val >= 75 ? '#10B981' : val >= 60 ? '#F59E0B' : '#EF4444';

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        No attendance data available.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ left: 16, right: 32, top: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
        <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`}
          tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" width={110}
          tick={{ fontSize: 12, fill: '#475569' }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(v) => [`${v}%`, 'Attendance']}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
        />
        {/* 75% threshold line */}
        <Bar dataKey="attendance" radius={[0, 4, 4, 0]} maxBarSize={20}>
          {data.map((entry, i) => (
            <Cell key={i} fill={getColor(entry.attendance)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/**
 * Marks Chart — bar chart per subject.
 */
export function MarksChart({ subjects = [] }) {
  const data = subjects.map((s) => ({
    name: s.subject?.name || s.subjectName || s.name || 'Subject',
    marks: Math.round(s.marksPercentage ?? s.percentage ?? 0),
  }));

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-slate-400 text-sm">
        No marks data available yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ left: 16, right: 32, top: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
        <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`}
          tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" width={110}
          tick={{ fontSize: 12, fill: '#475569' }} axisLine={false} tickLine={false} />
        <Tooltip
          formatter={(v) => [`${v}%`, 'Score']}
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #E2E8F0' }}
        />
        <Bar dataKey="marks" radius={[0, 4, 4, 0]} maxBarSize={20}>
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.marks >= 60 ? '#6366F1' : entry.marks >= 40 ? '#F59E0B' : '#EF4444'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
