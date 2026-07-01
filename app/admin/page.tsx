"use client";

import "../../i18n";
import "../daily-mail/daily-mail.css";
import "../dashboard-common.css";
import "./admin.css";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Sidebar } from "@/components/Sidebar";

// ── TypeScript Interfaces ──
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
}

interface Case {
  id: string;
  refNo: string;
  subject: string;
  officer: string;
  institute: string;
  receivedDate: string;
  priority: "High" | "Medium" | "Low";
  status: "Registered" | "Under Subject Officer" | "Under Investigation" | "Closed";
}

interface Institute {
  id: string;
  name: string;
  province: string;
  code: string;
}

// ── Case Generator for exactly 56 Mock Cases ──
const generateMockCases = (institutes: string[]): Case[] => {
  const priorities: ("High" | "Medium" | "Low")[] = ["High", "Medium", "Low"];
  const cases: Case[] = [];
  
  // 10 Closed Cases
  for (let i = 1; i <= 10; i++) {
    cases.push({
      id: `C-2026-0${i}`,
      refNo: `DCMMS/2026/0${100 + i}`,
      subject: `Misconduct Case Investigation ${i}`,
      officer: i % 2 === 0 ? "Suresh Silva" : "Kamal Perera",
      institute: institutes[i % institutes.length],
      receivedDate: `2026-0${(i % 5) + 1}-10`,
      priority: priorities[i % 3],
      status: "Closed"
    });
  }
  
  // 10 Under Investigation
  for (let i = 11; i <= 20; i++) {
    cases.push({
      id: `C-2026-0${i}`,
      refNo: `DCMMS/2026/0${100 + i}`,
      subject: `Audit report query on funds ${i - 10}`,
      officer: "Suresh Silva",
      institute: institutes[i % institutes.length],
      receivedDate: `2026-0${(i % 5) + 1}-15`,
      priority: priorities[i % 3],
      status: "Under Investigation"
    });
  }
  
  // 5 Under Subject Officer
  for (let i = 21; i <= 25; i++) {
    cases.push({
      id: `C-2026-0${i}`,
      refNo: `DCMMS/2026/0${100 + i}`,
      subject: `Absenteeism review for administrative staff ${i - 20}`,
      officer: "Kamal Perera",
      institute: institutes[i % institutes.length],
      receivedDate: `2026-05-${10 + (i - 20) * 2}`,
      priority: priorities[i % 3],
      status: "Under Subject Officer"
    });
  }
  
  // 31 Registered / New Cases
  for (let i = 26; i <= 56; i++) {
    cases.push({
      id: `C-2026-0${i}`,
      refNo: `DCMMS/2026/0${100 + i}`,
      subject: `General disciplinary inquiry letter reference ${i - 25}`,
      officer: "Unassigned",
      institute: institutes[i % institutes.length],
      receivedDate: `2026-06-${(i % 20) + 1}`,
      priority: priorities[i % 3],
      status: "Registered"
    });
  }
  
  return cases;
};

export default function AdminPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  // ── Layout, Theme, A11y & Language State ──
  const [fontScale, setFontScale] = useState<"small" | "medium" | "large">("medium");
  const lang = i18n.language;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"analytics" | "users">("analytics");

  // ── Modals State ──
  const [isAddInstituteOpen, setIsAddInstituteOpen] = useState(false);
  const [isAddOfficerOpen, setIsAddOfficerOpen] = useState(false);

  // Form Fields State
  const [newInstName, setNewInstName] = useState("");
  const [newInstProvince, setNewInstProvince] = useState("Western");
  const [newInstCode, setNewInstCode] = useState("");
  const [newInstError, setNewInstError] = useState("");

  const [newOfficerName, setNewOfficerName] = useState("");
  const [newOfficerEmail, setNewOfficerEmail] = useState("");
  const [newOfficerRole, setNewOfficerRole] = useState("roleInvestigation");
  const [newOfficerError, setNewOfficerError] = useState("");

  // Toast Success Alert State
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // ── Interactive Chart Hover/Tooltip State ──
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [tooltipText, setTooltipText] = useState("");

  // ── Initial Mock State Data ──
  const [institutes, setInstitutes] = useState<Institute[]>([
    { id: "1", name: "Ministry of Education", province: "Western", code: "MOE-HQ" },
    { id: "2", name: "Provincial Department", province: "Western", code: "PROV-WP" },
    { id: "3", name: "Zonal Office - Galle", province: "Southern", code: "ZONE-GL" },
    { id: "4", name: "Zonal Office - Jaffna", province: "Northern", code: "ZONE-JF" },
    { id: "5", name: "National School - Royal College", province: "Western", code: "NS-RC" }
  ]);

  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "Aruni Rajapaksha", email: "arunirajapaksha@gmail.com", role: t("roleAdmin"), status: "Active" },
    { id: "2", name: "Nathasha Sathsarani", email: "nathashasathsarani209@gmail.com", role: t("roleDailyMail"), status: "Active" },
    { id: "3", name: "Kamal Perera", email: "kamalperera@gmail.com", role: t("roleSubject"), status: "Active" },
    { id: "4", name: "Suresh Silva", email: "sureshsilva@gmail.com", role: t("roleInvestigation"), status: "Active" }
  ]);

  const instNames = useMemo(() => institutes.map(i => i.name), [institutes]);
  const [cases, setCases] = useState<Case[]>(() => generateMockCases(instNames));

  // ── Power BI Interactive Slicer Filter States ──
  const [filterInstitute, setFilterInstitute] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // ── Synchronization of Local Storage and Headers ──
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = `${t("adminDashboardTitle")} | DCMMS`;
  }, [lang, t]);

  // Escape key a11y listener to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSidebarOpen(false);
        setIsAddInstituteOpen(false);
        setIsAddOfficerOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/");
  };

  // Toast trigger helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // ── Interactive Action Modals Handlers ──
  const handleAddInstituteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstName || !newInstCode) {
      setNewInstError("Please fill out all fields.");
      return;
    }
    const newInst: Institute = {
      id: String(institutes.length + 1),
      name: newInstName,
      province: newInstProvince,
      code: newInstCode.toUpperCase()
    };
    setInstitutes([...institutes, newInst]);
    triggerToast(lang === "si" ? "ආයතනය සාර්ථකව එක් කරන ලදී!" : lang === "ta" ? "நிறுவனம் வெற்றிகரமாக சேர்க்கப்பட்டது!" : "Institute added successfully!");
    
    // Clear & Close
    setNewInstName("");
    setNewInstCode("");
    setNewInstError("");
    setIsAddInstituteOpen(false);
  };

  const handleAddOfficerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfficerName || !newOfficerEmail) {
      setNewOfficerError("Please fill out all fields.");
      return;
    }
    const roleLabel = 
      newOfficerRole === "roleAdmin" ? t("roleAdmin") :
      newOfficerRole === "roleDailyMail" ? t("roleDailyMail") :
      newOfficerRole === "roleSubject" ? t("roleSubject") : t("roleInvestigation");

    const newStaff: User = {
      id: String(users.length + 1),
      name: newOfficerName,
      email: newOfficerEmail,
      role: roleLabel,
      status: "Active"
    };
    setUsers([...users, newStaff]);
    triggerToast(lang === "si" ? "නිලධාරියා සාර්ථකව එක් කරන ලදී!" : lang === "ta" ? "அதிகாரி வெற்றிகரமாக சேர்க்கப்பட்டார்!" : "Officer registered successfully!");
    
    // Clear & Close
    setNewOfficerName("");
    setNewOfficerEmail("");
    setNewOfficerError("");
    setIsAddOfficerOpen(false);
  };

  // Trigger specific officer modal preset
  const openOfficerModalWithRole = (roleKey: string) => {
    setNewOfficerRole(roleKey);
    setIsAddOfficerOpen(true);
  };

  // ── Slicer Filter Logic (Power BI interactive mechanics) ──
  const filteredCases = useMemo(() => {
    return cases.filter((item) => {
      const matchInst = filterInstitute === "All" || item.institute === filterInstitute;
      const matchPriority = filterPriority === "All" || item.priority === filterPriority;
      const matchStatus = filterStatus === "All" || item.status === filterStatus;
      const matchSearch = searchQuery === "" || 
        item.refNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.officer.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchInst && matchPriority && matchStatus && matchSearch;
    });
  }, [cases, filterInstitute, filterPriority, filterStatus, searchQuery]);

  // ── Metrics Calculation (Dynamic updates based on filters) ──
  const metrics = useMemo(() => {
    const total = filteredCases.length;
    const closed = filteredCases.filter(c => c.status === "Closed").length;
    const underInvestigation = filteredCases.filter(c => c.status === "Under Investigation").length;
    const underSubject = filteredCases.filter(c => c.status === "Under Subject Officer").length;
    
    return { total, closed, underInvestigation, underSubject };
  }, [filteredCases]);

  // ── Chart Data Calculations ──
  // 1. Cases by Institute (Bar Chart)
  const casesByInstitute = useMemo(() => {
    const counts: Record<string, number> = {};
    // Seed with all current institutes
    institutes.forEach(inst => {
      counts[inst.name] = 0;
    });
    // Add counts from filtered list
    filteredCases.forEach(c => {
      if (counts[c.institute] !== undefined) {
        counts[c.institute]++;
      }
    });
    
    const maxVal = Math.max(...Object.values(counts), 1);
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percent: Math.round((count / maxVal) * 100)
    }));
  }, [filteredCases, institutes]);

  // 2. Cases by Status (Donut Chart calculations)
  const casesByStatus = useMemo(() => {
    const statusCounts = {
      Registered: filteredCases.filter(c => c.status === "Registered").length,
      "Under Subject Officer": filteredCases.filter(c => c.status === "Under Subject Officer").length,
      "Under Investigation": filteredCases.filter(c => c.status === "Under Investigation").length,
      Closed: filteredCases.filter(c => c.status === "Closed").length,
    };
    
    const total = Object.values(statusCounts).reduce((a, b) => a + b, 0) || 1;
    
    return [
      { name: "Registered", count: statusCounts.Registered, color: "#1565c0", percent: Math.round((statusCounts.Registered / total) * 100) },
      { name: "Under Subject", count: statusCounts["Under Subject Officer"], color: "#9e9d24", percent: Math.round((statusCounts["Under Subject Officer"] / total) * 100) },
      { name: "Under Investigation", count: statusCounts["Under Investigation"], color: "#e65100", percent: Math.round((statusCounts["Under Investigation"] / total) * 100) },
      { name: "Closed", count: statusCounts.Closed, color: "#c62828", percent: Math.round((statusCounts.Closed / total) * 100) }
    ];
  }, [filteredCases]);

  // Donut chart path drawing values
  const donutDrawValues = useMemo(() => {
    let accumulatedPercent = 0;
    return casesByStatus.map((slice) => {
      const dashArray = `${slice.percent} ${100 - slice.percent}`;
      const dashOffset = 100 - accumulatedPercent;
      accumulatedPercent += slice.percent;
      return {
        ...slice,
        dashArray,
        dashOffset
      };
    });
  }, [casesByStatus]);

  // 3. Monthly intake statistics (Trend Chart)
  const monthlyTrendData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const counts = [0, 0, 0, 0, 0, 0];
    
    filteredCases.forEach((c) => {
      const monthIdx = parseInt(c.receivedDate.split("-")[1], 10) - 1;
      if (monthIdx >= 0 && monthIdx < 6) {
        counts[monthIdx]++;
      }
    });
    
    const maxVal = Math.max(...counts, 1);
    const points = counts.map((count, index) => {
      const x = 50 + index * 100;
      const y = 160 - (count / maxVal) * 120; // 160 is base height, 120 range
      return { month: months[index], count, x, y };
    });

    const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    const areaPath = points.length > 0 
      ? `${linePath} L ${points[points.length - 1].x} 160 L ${points[0].x} 160 Z`
      : "";

    return { points, linePath, areaPath };
  }, [filteredCases]);

  // Reset Slicer Panel filters
  const resetAllFilters = () => {
    setFilterInstitute("All");
    setFilterPriority("All");
    setFilterStatus("All");
    setSearchQuery("");
  };

  return (
    <div className="admin-container dashboard-container" data-font-scale={fontScale}>
      {/* ── Skip Link (A11y compliance) ── */}
      <a href="#dashboard-main-content" className="skip-link">
        {t("skipLink")}
      </a>

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
        role="admin"
      />

      <div className="dashboard-layout">
        {/* ============================================================
           MAIN WORKSPACE CONTENT AREA
           ============================================================ */}
        <main id="dashboard-main-content" className="dashboard-content" style={{ padding: 0 }}>
          
          {/* ── Header exactly matching the Screenshot ── */}
          <header className="dashboard-header">
            <div className="dashboard-header-left">
              <button
                className="menu-toggle-btn"
                aria-label="Toggle Sidebar Menu"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                aria-expanded={isSidebarOpen ? "true" : "false"}
              >
                <svg className="hamburger-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="dashboard-title-area">
                <h1 className="dashboard-main-title">
                  {lang === "si" ? "පරිපාලක" : lang === "ta" ? "நிர்வாகி" : "Admin"}
                </h1>
                <p className="dashboard-main-subtitle">
                  {lang === "si" 
                    ? "විනය කළමනාකරණ පද්ධතිය අධීක්ෂණය සහ කළමනාකරණය කරන්න." 
                    : lang === "ta" 
                    ? "ஒழுக்க மேலாண்மை அமைப்பை மேற்பார்வையிட்டு நிர்வகிக்கவும்." 
                    : "Oversee and manage the disciplinary management system."}
                </p>
              </div>
            </div>

            <div className="dashboard-header-right">
              {/* Localized Live Date */}
              <div className="date-badge">
                <svg className="date-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span suppressHydrationWarning>
                  {new Date().toLocaleDateString(
                    lang === "si" ? "si-LK" : lang === "ta" ? "ta-LK" : "en-US",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </span>
              </div>

              <div className="divider-line" aria-hidden="true" />

              {/* Accessibility Font Size Radio Adjusters */}
              <div className="accessibility-adjuster-bar" role="radiogroup" aria-label="Font Sizing Adjustment">
                <button 
                  className={`size-btn size-btn-small${fontScale === "small" ? " active" : ""}`}
                  onClick={() => setFontScale("small")}
                  aria-label={t("fontSmall")}
                >
                  A
                </button>
                <button 
                  className={`size-btn size-btn-medium${fontScale === "medium" ? " active" : ""}`}
                  onClick={() => setFontScale("medium")}
                  aria-label={t("fontMedium")}
                >
                  A
                </button>
                <button 
                  className={`size-btn size-btn-large${fontScale === "large" ? " active" : ""}`}
                  onClick={() => setFontScale("large")}
                  aria-label={t("fontLarge")}
                >
                  A
                </button>
              </div>

              <div className="divider-line" aria-hidden="true" />

              {/* Language Switcher Pills */}
              <div className="trilingual-language-selector" role="radiogroup" aria-label="Translate Dashboard Language">
                <button 
                  className={`lang-btn${lang === "si" ? " active" : ""}`}
                  onClick={() => changeLanguage("si")}
                  aria-label="Switch dashboard language to Sinhala"
                >
                  Sinhala
                </button>
                <button 
                  className={`lang-btn${lang === "ta" ? " active" : ""}`}
                  onClick={() => changeLanguage("ta")}
                  aria-label="Switch dashboard language to Tamil"
                >
                  Tamil
                </button>
                <button 
                  className={`lang-btn${lang === "en" ? " active" : ""}`}
                  onClick={() => changeLanguage("en")}
                  aria-label="Switch dashboard language to English"
                >
                  English
                </button>
              </div>
            </div>
          </header>

          {/* ── Welcome Nathasha Banner Section ── */}
          <section className="welcome-greeting-section">
            <h2 className="greeting-text">
              {lang === "si" ? "සාදරයෙන් පිළිගනිමු, නතාෂා!" : lang === "ta" ? "வரவேற்கிறோம், நடாஷா!" : "Welcome, Nathasha!"}
            </h2>
          </section>

          {/* ── Quick Action Pills (Screenshot Matching) ── */}
          <section className="quick-actions-pills-row">
            <button className="action-pill-btn pill-cyan" onClick={() => setIsAddInstituteOpen(true)}>
              <span>+</span> Add Institute
            </button>
            <button className="action-pill-btn pill-blue" onClick={() => openOfficerModalWithRole("roleInvestigation")}>
              <span>+</span> Add Investigation officer
            </button>
            <button className="action-pill-btn pill-purple" onClick={() => openOfficerModalWithRole("roleDailyMail")}>
              <span>+</span> Add Daily Reporter
            </button>
            <button className="action-pill-btn pill-darkblue" onClick={() => openOfficerModalWithRole("roleSubject")}>
              <span>+</span> Add Subject officer
            </button>
          </section>

          {/* ── Stat Cards (Screenshot Matching counts: 56, 10, 10, 05) ── */}
          <section className="screenshot-stats-grid">
            {/* Total Cases */}
            <div className="screenshot-stat-card">
              <div className="stat-left-box">
                <svg className="stat-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="stat-card-label">Total Cases</span>
              </div>
              <span className="stat-right-val val-blue">
                {String(metrics.total).padStart(2, "0")}
              </span>
            </div>

            {/* Closed Cases */}
            <div className="screenshot-stat-card">
              <div className="stat-left-box">
                <svg className="stat-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
                </svg>
                <span className="stat-card-label">Closed Cases</span>
              </div>
              <span className="stat-right-val val-red">
                {String(metrics.closed).padStart(2, "0")}
              </span>
            </div>

            {/* Under Investigation Officer */}
            <div className="screenshot-stat-card">
              <div className="stat-left-box">
                <svg className="stat-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H17" />
                </svg>
                <span className="stat-card-label">Under Investigation Officer</span>
              </div>
              <span className="stat-right-val val-orange">
                {String(metrics.underInvestigation).padStart(2, "0")}
              </span>
            </div>

            {/* Under Subject Officer */}
            <div className="screenshot-stat-card">
              <div className="stat-left-box">
                <svg className="stat-card-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="stat-card-label">Under Subject Officer</span>
              </div>
              <span className="stat-right-val val-lime">
                {String(metrics.underSubject).padStart(2, "0")}
              </span>
            </div>
          </section>

          {/* ── Sub Navigation Tabs ── */}
          <nav className="admin-tab-nav-bar" aria-label="Admin Sections">
            <button
              className={`admin-tab-btn${activeTab === "analytics" ? " active" : ""}`}
              onClick={() => setActiveTab("analytics")}
            >
              Analytics Dashboard (Power BI)
            </button>
            <button
              className={`admin-tab-btn${activeTab === "users" ? " active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              User Account Directory ({users.length})
            </button>
          </nav>

          {/* ============================================================
             TAB 1: POWER BI ANALYTICS DASHBOARD
             ============================================================ */}
          {activeTab === "analytics" && (
            <div style={{ animation: "fadeIn 0.2s" }}>
              
              {/* ── Power BI Interactive Filter Slicer ── */}
              <section className="slicer-filter-panel">
                <div className="slicer-header">
                  <div className="slicer-title">
                    <svg className="slicer-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Interactive Filters (Slicer Panel)
                  </div>
                  <button className="reset-filter-btn" onClick={resetAllFilters}>
                    Reset Slicers
                  </button>
                </div>

                <div className="slicers-grid">
                  {/* Slicer 1: Institute */}
                  <div className="slicer-control">
                    <label className="slicer-label" htmlFor="slicer-institute">Institute</label>
                    <select
                      id="slicer-institute"
                      className="slicer-select"
                      value={filterInstitute}
                      onChange={(e) => setFilterInstitute(e.target.value)}
                    >
                      <option value="All">All Institutes</option>
                      {institutes.map(inst => (
                        <option key={inst.id} value={inst.name}>{inst.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Slicer 2: Priority */}
                  <div className="slicer-control">
                    <label className="slicer-label" htmlFor="slicer-priority">Priority</label>
                    <select
                      id="slicer-priority"
                      className="slicer-select"
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                    >
                      <option value="All">All Priorities</option>
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Low">Low Priority</option>
                    </select>
                  </div>

                  {/* Slicer 3: Case Status */}
                  <div className="slicer-control">
                    <label className="slicer-label" htmlFor="slicer-status">Case Status</label>
                    <select
                      id="slicer-status"
                      className="slicer-select"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="All">All Statuses</option>
                      <option value="Registered">Registered (Unassigned)</option>
                      <option value="Under Subject Officer">Under Subject Officer</option>
                      <option value="Under Investigation">Under Investigation</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  {/* Slicer 4: Real-time Search */}
                  <div className="slicer-control">
                    <label className="slicer-label" htmlFor="slicer-search">Search Keyword</label>
                    <input
                      id="slicer-search"
                      type="text"
                      className="slicer-input"
                      placeholder="Search Ref, Subject, Officer..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </section>

              {/* ── Charts Grid ── */}
              <section className="pbi-charts-container">
                {/* 1. Bar Chart: Cases by Institute */}
                <div className="pbi-chart-card">
                  <h3 className="pbi-chart-title">Cases by Educational Institute</h3>
                  <div className="bar-chart-list">
                    {casesByInstitute.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="bar-chart-row"
                        onClick={() => setFilterInstitute(item.name === filterInstitute ? "All" : item.name)}
                        title={`Click to filter by ${item.name}`}
                      >
                        <div className="bar-label" title={item.name}>{item.name}</div>
                        <div className="bar-container">
                          <div 
                            className="bar-fill" 
                            style={{ 
                              width: `${item.percent}%`,
                              background: item.name === filterInstitute 
                                ? "linear-gradient(90deg, #1d4ed8 0%, #1e3a8a 100%)"
                                : "linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%)"
                            }}
                          >
                            {item.percent > 12 && (
                              <span className="bar-percentage">{item.percent}%</span>
                            )}
                          </div>
                        </div>
                        <div className="bar-value">{item.count}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Donut Chart: Case Status Breakdown */}
                <div className="pbi-chart-card">
                  <h3 className="pbi-chart-title">Case Status Distribution</h3>
                  <div className="donut-chart-wrapper">
                    <div className="donut-svg-box">
                      <svg width="100%" height="100%" viewBox="0 0 42 42" className="donut-svg">
                        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="#cbd5e1" strokeWidth="6" />
                        {donutDrawValues.map((slice, idx) => slice.percent > 0 && (
                          <circle
                            key={idx}
                            className="donut-slice"
                            cx="21"
                            cy="21"
                            r="15.915"
                            fill="transparent"
                            stroke={slice.color}
                            strokeWidth="5"
                            strokeDasharray={slice.dashArray}
                            strokeDashoffset={slice.dashOffset}
                            onClick={() => setFilterStatus(slice.name === "Under Subject" ? "Under Subject Officer" : slice.name === filterStatus ? "All" : slice.name)}
                          >
                            <title>{`${slice.name}: ${slice.count} cases (${slice.percent}%)`}</title>
                          </circle>
                        ))}
                      </svg>
                      
                      <div className="donut-center-text">
                        <span className="donut-center-num">{metrics.total}</span>
                        <span className="donut-center-label">Cases</span>
                      </div>
                    </div>

                    <div className="donut-legend">
                      {casesByStatus.map((slice, idx) => (
                        <div 
                          key={idx} 
                          className="legend-item"
                          onClick={() => setFilterStatus(slice.name === "Under Subject" ? "Under Subject Officer" : slice.name === filterStatus ? "All" : slice.name)}
                        >
                          <span className="legend-color-dot" style={{ backgroundColor: slice.color }} />
                          <span>{slice.name} ({slice.count})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Trend Line Chart (Full Width) */}
                <div className="pbi-chart-card chart-full-width">
                  <h3 className="pbi-chart-title">Monthly Case Registration Trend (2026)</h3>
                  <div className="trend-chart-wrapper">
                    <svg className="trend-svg" viewBox="0 0 600 200" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      {[40, 80, 120, 160].map((yVal, index) => (
                        <line key={index} x1="30" y1={yVal} x2="570" y2={yVal} stroke="#e2e8f0" strokeDasharray="4 4" />
                      ))}

                      {/* Area Fill */}
                      {monthlyTrendData.areaPath && (
                        <path d={monthlyTrendData.areaPath} fill="url(#areaGrad)" />
                      )}

                      {/* Connection Line */}
                      {monthlyTrendData.linePath && (
                        <path d={monthlyTrendData.linePath} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
                      )}

                      {/* Trend Points */}
                      {monthlyTrendData.points.map((p, i) => (
                        <circle
                          key={i}
                          className="trend-dot"
                          cx={p.x}
                          cy={p.y}
                          r="5"
                          fill="#ffffff"
                          stroke="#2563eb"
                          strokeWidth="3"
                          onMouseEnter={() => {
                            setHoveredPoint(i);
                            setTooltipPos({ x: p.x, y: p.y });
                            setTooltipText(`${p.month}: ${p.count} Cases`);
                          }}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      ))}

                      {/* X Axis Labels */}
                      {monthlyTrendData.points.map((p, i) => (
                        <text key={i} x={p.x} y="185" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="700">
                          {p.month}
                        </text>
                      ))}
                    </svg>

                    {/* Chart Point Tooltip */}
                    {hoveredPoint !== null && (
                      <div 
                        className="chart-tooltip"
                        style={{ 
                          left: `${(tooltipPos.x / 600) * 100}%`,
                          top: `${(tooltipPos.y / 200) * 100}%` 
                        }}
                      >
                        {tooltipText}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* ── Cases Ledger Table ── */}
              <section className="letters-list-section pbi-table-section">
                <div className="letters-list-header">
                  <h3 className="section-title">Disciplinary Cases Ledger</h3>
                  <div className="letters-filters-group">
                    <span className="badge-badge badge-status-active" style={{ fontSize: "12px", fontWeight: "700" }}>
                      Showing {filteredCases.length} of {cases.length} entries
                    </span>
                  </div>
                </div>

                <div className="table-responsive-container">
                  <table className="letters-data-table">
                    <thead>
                      <tr>
                        <th scope="col">Case Ref</th>
                        <th scope="col">Subject Description</th>
                        <th scope="col">Assigned Officer</th>
                        <th scope="col">Institute</th>
                        <th scope="col">Priority</th>
                        <th scope="col">Status</th>
                        <th scope="col" className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCases.length > 0 ? (
                        filteredCases.map((item) => (
                          <tr key={item.id} className="letter-table-row">
                            <td className="font-semibold text-primary">{item.refNo}</td>
                            <td title={item.subject} style={{ maxWidth: "250px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              {item.subject}
                            </td>
                            <td>{item.officer}</td>
                            <td>{item.institute}</td>
                            <td>
                              <span className={`badge-priority priority-${item.priority.toLowerCase()}`}>
                                {item.priority}
                              </span>
                            </td>
                            <td>
                              <span className={`badge-badge ${
                                item.status === "Closed" ? "badge-status-active" : "badge-status-pending"
                              }`} style={{
                                backgroundColor: 
                                  item.status === "Under Investigation" ? "#fff3e0" :
                                  item.status === "Under Subject Officer" ? "#f9fbe7" : 
                                  item.status === "Closed" ? "#e8f5e9" : "#e3f2fd",
                                color:
                                  item.status === "Under Investigation" ? "#e65100" :
                                  item.status === "Under Subject Officer" ? "#827717" : 
                                  item.status === "Closed" ? "#2e7d32" : "#1565c0"
                              }}>
                                {item.status === "Under Subject Officer" ? "Under Subject" : item.status}
                              </span>
                            </td>
                            <td className="text-center actions-cell">
                              <select
                                className="slicer-select"
                                style={{ padding: "4px 8px", fontSize: "11px", width: "auto" }}
                                value={item.status}
                                onChange={(e) => {
                                  const newStatus = e.target.value as any;
                                  // Update status locally
                                  setCases(cases.map(c => c.id === item.id ? { ...c, status: newStatus } : c));
                                  triggerToast(`Status of ${item.refNo} updated to ${newStatus}`);
                                }}
                              >
                                <option value="Registered">Registered</option>
                                <option value="Under Subject Officer">Under Subject</option>
                                <option value="Under Investigation">Under Investigation</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center py-4 text-muted">
                            No cases found matching the active slicers
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* ============================================================
             TAB 2: USER DIRECTORY
             ============================================================ */}
          {activeTab === "users" && (
            <div style={{ animation: "fadeIn 0.2s" }}>
              <section className="letters-list-section" style={{ margin: "24px" }}>
                <div className="letters-list-header">
                  <h3 className="section-title">User Account Directory</h3>
                  <div className="letters-filters-group">
                    <div className="search-box">
                      <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name, role, email..."
                        className="search-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="table-responsive-container">
                  <table className="letters-data-table">
                    <thead>
                      <tr>
                        <th scope="col">User Name</th>
                        <th scope="col">E-mail Address</th>
                        <th scope="col">Assigned System Role</th>
                        <th scope="col">Account Status</th>
                        <th scope="col" className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.filter(u => 
                        u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        u.role.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        u.email.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map((user) => (
                        <tr key={user.id} className="letter-table-row">
                          <td className="font-semibold text-primary">{user.name}</td>
                          <td>{user.email}</td>
                          <td>{user.role}</td>
                          <td>
                            <span className="badge-badge badge-status-active">
                              {user.status}
                            </span>
                          </td>
                          <td className="text-center actions-cell">
                            <button
                              className="btn-action-view"
                              onClick={() => {
                                alert(`User details:\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}`);
                              }}
                              title="Inspect Details"
                            >
                              <svg className="action-row-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* Centered Footer */}
          <footer className="admin-footer-bar">
            {t("footerText")}
          </footer>
        </main>
      </div>

      {/* ============================================================
         MODAL 1: ADD INSTITUTE
         ============================================================ */}
      {isAddInstituteOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-inst-title">
          <div className="modal-content-card">
            <div className="modal-header-box">
              <h3 id="modal-inst-title" className="modal-title-text">Add New Educational Institute</h3>
              <button className="modal-close-x" onClick={() => setIsAddInstituteOpen(false)} aria-label="Close modal">&times;</button>
            </div>
            
            <form onSubmit={handleAddInstituteSubmit}>
              <div className="modal-body-form">
                {newInstError && (
                  <div className="form-error-msg">{newInstError}</div>
                )}
                
                <div className="form-group-item">
                  <label className="form-label-txt" htmlFor="inst-name">Name of Institute</label>
                  <input
                    id="inst-name"
                    type="text"
                    className="form-input-box"
                    placeholder="e.g. Zonal Office - Kandy"
                    value={newInstName}
                    onChange={(e) => setNewInstName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group-item">
                  <label className="form-label-txt" htmlFor="inst-province">Province/Region</label>
                  <select
                    id="inst-province"
                    className="form-select-box"
                    value={newInstProvince}
                    onChange={(e) => setNewInstProvince(e.target.value)}
                  >
                    <option value="Western">Western</option>
                    <option value="Central">Central</option>
                    <option value="Southern">Southern</option>
                    <option value="Northern">Northern</option>
                    <option value="Eastern">Eastern</option>
                    <option value="North Western">North Western</option>
                    <option value="North Central">North Central</option>
                    <option value="Uva">Uva</option>
                    <option value="Sabaragamuwa">Sabaragamuwa</option>
                  </select>
                </div>

                <div className="form-group-item">
                  <label className="form-label-txt" htmlFor="inst-code">Institute Code</label>
                  <input
                    id="inst-code"
                    type="text"
                    className="form-input-box"
                    placeholder="e.g. ZONE-KD"
                    value={newInstCode}
                    onChange={(e) => setNewInstCode(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="modal-footer-box">
                <button type="button" className="btn-form-cancel" onClick={() => setIsAddInstituteOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-form-submit">
                  Save Institute
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================
         MODAL 2: ADD OFFICER/STAFF (Unified creation modal)
         ============================================================ */}
      {isAddOfficerOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-off-title">
          <div className="modal-content-card">
            <div className="modal-header-box">
              <h3 id="modal-off-title" className="modal-title-text">
                Add Disciplinary Staff Account
              </h3>
              <button className="modal-close-x" onClick={() => setIsAddOfficerOpen(false)} aria-label="Close modal">&times;</button>
            </div>
            
            <form onSubmit={handleAddOfficerSubmit}>
              <div className="modal-body-form">
                {newOfficerError && (
                  <div className="form-error-msg">{newOfficerError}</div>
                )}
                
                <div className="form-group-item">
                  <label className="form-label-txt" htmlFor="off-name">Officer Full Name</label>
                  <input
                    id="off-name"
                    type="text"
                    className="form-input-box"
                    placeholder="e.g. Ranjith Bandara"
                    value={newOfficerName}
                    onChange={(e) => setNewOfficerName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group-item">
                  <label className="form-label-txt" htmlFor="off-email">E-mail Address</label>
                  <input
                    id="off-email"
                    type="email"
                    className="form-input-box"
                    placeholder="e.g. ranjithbandara@gmail.com"
                    value={newOfficerEmail}
                    onChange={(e) => setNewOfficerEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group-item">
                  <label className="form-label-txt" htmlFor="off-role">Assigned System Role</label>
                  <select
                    id="off-role"
                    className="form-select-box"
                    value={newOfficerRole}
                    onChange={(e) => setNewOfficerRole(e.target.value)}
                  >
                    <option value="roleAdmin">Administrator</option>
                    <option value="roleDailyMail">Daily mail officer</option>
                    <option value="roleSubject">Subject officer</option>
                    <option value="roleInvestigation">Investigation officer</option>
                  </select>
                </div>
              </div>
              
              <div className="modal-footer-box">
                <button type="button" className="btn-form-cancel" onClick={() => setIsAddOfficerOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-form-submit">
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Alert message banner */}
      {showToast && (
        <div className="toast-success-banner" role="status" aria-live="polite">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
