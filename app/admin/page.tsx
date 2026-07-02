"use client";
import React, { useState } from "react";
import { Folder, Search, CheckCircle2, User, ChevronDown } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts";
import "./admin.css";

const monthlyData = [
  { name: "Aug", cases: 7 },
  { name: "Sep", cases: 6 },
  { name: "Oct", cases: 5 },
  { name: "Nov", cases: 10 },
  { name: "Dec", cases: 5 },
  { name: "Jan", cases: 7 },
  { name: "Feb", cases: 6 },
  { name: "Mar", cases: 6 },
  { name: "Apr", cases: 9 },
  { name: "May", cases: 5 },
  { name: "Jun", cases: 6 },
  { name: "Jul", cases: 0 },
];

const dailyData = [
  { name: "Mon", cases: 3 },
  { name: "Tue", cases: 5 },
  { name: "Wed", cases: 2 },
  { name: "Thu", cases: 4 },
  { name: "Fri", cases: 6 },
  { name: "Sat", cases: 1 },
  { name: "Sun", cases: 0 },
];

const weeklyData = [
  { name: "W1", cases: 12 },
  { name: "W2", cases: 9 },
  { name: "W3", cases: 15 },
  { name: "W4", cases: 8 },
  { name: "W5", cases: 11 },
  { name: "W6", cases: 14 },
  { name: "W7", cases: 7 },
  { name: "W8", cases: 10 },
];

const yearlyData = [
  { name: "2020", cases: 42 },
  { name: "2021", cases: 58 },
  { name: "2022", cases: 65 },
  { name: "2023", cases: 71 },
  { name: "2024", cases: 78 },
  { name: "2025", cases: 84 },
  { name: "2026", cases: 40 },
];

const chartDataMap: Record<string, typeof monthlyData> = {
  Daily: dailyData,
  Weekly: weeklyData,
  Monthly: monthlyData,
  Yearly: yearlyData,
};

const statusData = [
  { name: "Under Investigation", value: 45, color: "#6366f1" },
  { name: "Closed", value: 35, color: "#10b981" },
  { name: "Under Subject Officer", value: 20, color: "#f59e0b" },
];

const typeData = [
  { name: "Fraud", value: 16, color: "#6366f1" },
  { name: "Cybercrime", value: 14, color: "#8b5cf6" },
  { name: "Assault", value: 12, color: "#0ea5e9" },
  { name: "Theft", value: 15, color: "#f59e0b" },
  { name: "Narcotics", value: 11, color: "#10b981" },
  { name: "Forgery", value: 13, color: "#3b82f6" },
];

const recentCases = [
  { id: "1", caseNo: "CASE-2026-0084", dateFiled: "2026-06-28", subject: "Misuse of government funds in procurement", assignedTo: "N. Senanayake", priority: "High", status: "Under Investigation" },
  { id: "2", caseNo: "CASE-2026-0083", dateFiled: "2026-06-25", subject: "Unauthorized data access in IT department", assignedTo: "S. Silva", priority: "High", status: "Under Investigation" },
  { id: "3", caseNo: "CASE-2026-0082", dateFiled: "2026-06-22", subject: "Employee misconduct during office hours", assignedTo: "K. Perera", priority: "Medium", status: "Under Subject Officer" },
  { id: "4", caseNo: "CASE-2026-0081", dateFiled: "2026-06-20", subject: "Forged attendance records submission", assignedTo: "R. Fernando", priority: "Medium", status: "Under Subject Officer" },
  { id: "5", caseNo: "CASE-2026-0080", dateFiled: "2026-06-18", subject: "Property damage at Colombo branch office", assignedTo: "N. Senanayake", priority: "Low", status: "Closed" },
  { id: "6", caseNo: "CASE-2026-0079", dateFiled: "2026-06-15", subject: "Harassment complaint filed by junior staff", assignedTo: "S. Silva", priority: "High", status: "Under Investigation" },
  { id: "7", caseNo: "CASE-2026-0078", dateFiled: "2026-06-12", subject: "Inventory discrepancy in Kandy warehouse", assignedTo: "K. Perera", priority: "Low", status: "Closed" },
];

export default function AdminDashboard() {
  const [chartPeriod, setChartPeriod] = useState("Monthly");
  const chartData = chartDataMap[chartPeriod];

  return (
    <div className="admin-dashboard-container">
      {/* Header section */}
      <div className="admin-dashboard-header">
        <div>
          <h2 className="admin-dashboard-title">Dashboard</h2>
          <p className="admin-dashboard-subtitle">
            5 officers · 3 institutes · 84 total cases
          </p>
        </div>
        <div className="admin-filters-container">
          <div style={{ position: 'relative' }}>
            <select aria-label="Filter by case type" className="admin-filter-select">
              <option>All types</option>
            </select>
            <div className="admin-filter-icon">
              <ChevronDown style={{ width: 16, height: 16 }} />
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <select aria-label="Filter by status" className="admin-filter-select">
              <option>All statuses</option>
            </select>
            <div className="admin-filter-icon">
              <ChevronDown style={{ width: 16, height: 16 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <StatCard
          title="TOTAL CASES"
          value="84"
          subtitle="All registered"
          icon={<Folder style={{ width: 20, height: 20, color: '#4f46e5' }} />}
          iconBg="#eef2ff"
        />
        <StatCard
          title="UNDER INVESTIGATION"
          value="25"
          subtitle="Active investigations"
          icon={<Search style={{ width: 20, height: 20, color: '#2563eb' }} />}
          iconBg="#eff6ff"
        />
        <StatCard
          title="CLOSED"
          value="37"
          subtitle="Resolved cases"
          icon={<CheckCircle2 style={{ width: 20, height: 20, color: '#059669' }} />}
          iconBg="#ecfdf5"
        />
        <StatCard
          title="UNDER SUBJECT OFFICER"
          value="22"
          subtitle="Awaiting subject officer"
          icon={<User style={{ width: 20, height: 20, color: '#d97706' }} />}
          iconBg="#fffbeb"
        />
      </div>

      {/* Chart Section */}
      <div className="admin-chart-card">
        <div className="admin-chart-header">
          <div>
            <h3 className="admin-chart-title">Cases over time</h3>
            <p className="admin-chart-subtitle">New cases per period</p>
          </div>
          <div className="admin-chart-filters">
            {["Daily", "Weekly", "Monthly", "Yearly"].map((period) => (
              <button
                key={period}
                className={chartPeriod === period ? "admin-chart-filter-btn-active" : "admin-chart-filter-btn"}
                onClick={() => setChartPeriod(period)}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="admin-chart-wrapper">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="caseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F46E5" stopOpacity={0.3} />
                  <stop offset="50%" stopColor="#818CF8" stopOpacity={0.12} />
                  <stop offset="100%" stopColor="#C7D2FE" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#6B7280', fontSize: 12 }}
                ticks={[0, 3, 6, 9, 12]}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                cursor={{ stroke: '#E5E7EB', strokeWidth: 1, strokeDasharray: '5 5' }}
              />
              <Area 
                type="monotone" 
                dataKey="cases" 
                stroke="#4F46E5" 
                strokeWidth={3}
                fill="url(#caseGradient)"
                dot={false}
                activeDot={{ r: 6, fill: '#4F46E5', stroke: '#fff', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Charts Section */}
      <div className="admin-secondary-charts-grid">
        {/* Status Distribution */}
        <div className="admin-chart-card">
          <h3 className="admin-secondary-chart-title">Status distribution</h3>
          <div className="admin-pie-chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconType="circle"
                  formatter={(value) => <span style={{ fontSize: 14, color: '#4b5563', marginLeft: 4 }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cases by type */}
        <div className="admin-chart-card">
          <h3 className="admin-secondary-chart-title">Cases by type</h3>
          <div className="admin-bar-chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={typeData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }}
                  ticks={[0, 4, 8, 12, 16]}
                />
                <Tooltip 
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Recent Cases Section ── */}
      <section className="letters-list-section">
        <div className="letters-list-header">
          <h3 className="section-title">
            <svg style={{ width: 20, height: 20, marginRight: 8, flexShrink: 0 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Recent Cases</span>
          </h3>
          <div className="letters-filters-group">
            <div className="search-box">
              <svg style={{ width: 18, height: 18, position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search cases..."
                className="search-input"
              />
            </div>
            <a href="#" className="view-all-reset-link">
              View All <span className="arrow-span">→</span>
            </a>
          </div>
        </div>

        <div className="table-responsive-container">
          <table className="letters-data-table">
            <thead>
              <tr>
                <th scope="col">Case No</th>
                <th scope="col">Date Filed</th>
                <th scope="col">Subject</th>
                <th scope="col">Assigned To</th>
                <th scope="col">Priority</th>
                <th scope="col">Status</th>
                <th scope="col" style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recentCases.map((item) => (
                <tr key={item.id} className="letter-table-row">
                  <td style={{ fontWeight: 600, color: '#1e293b' }}>{item.caseNo}</td>
                  <td>{item.dateFiled}</td>
                  <td className="subject-cell">{item.subject}</td>
                  <td>{item.assignedTo}</td>
                  <td>
                    <span className={`badge-badge ${
                      item.priority === "High" ? "badge-priority-high" :
                      item.priority === "Medium" ? "badge-priority-medium" : "badge-priority-low"
                    }`}>
                      {item.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`badge-badge ${
                      item.status === "Under Investigation" ? "badge-status-inprogress" :
                      item.status === "Closed" ? "badge-status-closed" : "badge-status-pending"
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <a href="#" className="add-details-link">View</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  iconBg 
}: { 
  title: string; 
  value: string; 
  subtitle: string; 
  icon: React.ReactNode; 
  iconBg: string; 
}) {
  return (
    <div className="admin-stat-card">
      <div className="admin-stat-header">
        <div className="admin-stat-title">
          {title}
        </div>
        <div className="admin-stat-icon-wrapper" style={{ backgroundColor: iconBg }}>
          {icon}
        </div>
      </div>
      <div>
        <div className="admin-stat-value">{value}</div>
        <div className="admin-stat-subtitle">{subtitle}</div>
      </div>
    </div>
  );
}
