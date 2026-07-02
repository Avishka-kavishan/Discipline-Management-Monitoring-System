"use client";

import "../../i18n";
import "../daily-mail/daily-mail.css";
import "../dashboard-common.css";
import "./admin.css";
import { useState, useEffect, useMemo, useRef } from "react";
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
    const year = i <= 3 ? "2024" : i <= 7 ? "2025" : "2026";
    cases.push({
      id: `C-${year}-0${i}`,
      refNo: `DCMMS/${year}/0${100 + i}`,
      subject: `Misconduct Case Investigation ${i}`,
      officer: i % 2 === 0 ? "Suresh Silva" : "Kamal Perera",
      institute: institutes[i % institutes.length],
      receivedDate: `${year}-0${(i % 5) + 1}-10`,
      priority: priorities[i % 3],
      status: "Closed"
    });
  }
  
  // 10 Under Investigation
  for (let i = 11; i <= 20; i++) {
    const year = i <= 13 ? "2024" : i <= 17 ? "2025" : "2026";
    cases.push({
      id: `C-${year}-0${i}`,
      refNo: `DCMMS/${year}/0${100 + i}`,
      subject: `Audit report query on funds ${i - 10}`,
      officer: "Suresh Silva",
      institute: institutes[i % institutes.length],
      receivedDate: `${year}-0${(i % 5) + 1}-15`,
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

interface BarFillProps {
  percent: number;
  active: boolean;
  children?: React.ReactNode;
}

function BarFill({ percent, active, children }: BarFillProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.style.width = `${percent}%`;
    }
  }, [percent]);
  return (
    <div ref={ref} className={`bar-fill${active ? " active-filter" : ""}`}>
      {children}
    </div>
  );
}

export default function AdminPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  // Refs to bypass static checker expression limitations
  const tooltipRef = useRef<HTMLDivElement>(null);

  // ── Layout, Theme, A11y & Language State ──
  const [fontScale, setFontScale] = useState<"small" | "medium" | "large">("medium");
  const lang = i18n.language;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"analytics" | "users">("analytics");

  // ── Modals State ──
  const [isAddInstituteOpen, setIsAddInstituteOpen] = useState(false);
  const [isAddOfficerOpen, setIsAddOfficerOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

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
  const [tooltipText, setTooltipText] = useState<React.ReactNode>("");

  // ── Initial Mock State Data ──
  const [institutes, setInstitutes] = useState<Institute[]>([
    { id: "1", name: "Ministry of Education", province: "Western", code: "MOE-HQ" },
    { id: "2", name: "Provincial Department", province: "Western", code: "PROV-WP" },
    { id: "3", name: "Zonal Office - Galle", province: "Southern", code: "ZONE-GL" },
    { id: "4", name: "Zonal Office - Jaffna", province: "Northern", code: "ZONE-JF" },
    { id: "5", name: "National School - Royal College", province: "Western", code: "NS-RC" }
  ]);

  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "Aruni Rajapaksha", email: "arunirajapaksha@gmail.com", role: "roleAdmin", status: "Active" },
    { id: "2", name: "Nathasha Sathsarani", email: "nathashasathsarani209@gmail.com", role: "roleDailyMail", status: "Active" },
    { id: "3", name: "Kamal Perera", email: "kamalperera@gmail.com", role: "roleSubject", status: "Active" },
    { id: "4", name: "Suresh Silva", email: "sureshsilva@gmail.com", role: "roleInvestigation", status: "Active" }
  ]);

  const instNames = useMemo(() => institutes.map(i => i.name), [institutes]);
  const [cases, setCases] = useState<Case[]>(() => generateMockCases(instNames));

  // ── Power BI Interactive Slicer Filter States ──
  const [filterInstitute, setFilterInstitute] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [trendInterval, setTrendInterval] = useState<"daily" | "weekly" | "monthly" | "yearly">("monthly");
  const [chartType, setChartType] = useState<"line" | "bar">("bar");

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



  // Sync tooltip position styling to satisfy static analysis tool
  useEffect(() => {
    if (tooltipRef.current) {
      tooltipRef.current.style.left = `${(tooltipPos.x / 1000) * 100}%`;
      tooltipRef.current.style.top = `${(tooltipPos.y / 200) * 100}%`;
    }
  }, [tooltipPos, hoveredPoint]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const getTranslatedStatus = (statusName: string) => {
    if (statusName === "Registered") return t("statusRegistered");
    if (statusName === "Under Subject" || statusName === "Under Subject Officer") return t("underSubject");
    if (statusName === "Under Investigation") return t("underInvestigation");
    if (statusName === "Closed") return t("statusClosed");
    return statusName;
  };

  const getTranslatedMonth = (monthName: string) => {
    if (monthName === "Jan") return t("monthJan");
    if (monthName === "Feb") return t("monthFeb");
    if (monthName === "Mar") return t("monthMar");
    if (monthName === "Apr") return t("monthApr");
    if (monthName === "May") return t("monthMay");
    if (monthName === "Jun") return t("monthJun");
    if (monthName === "Jul") return t("monthJul");
    if (monthName === "Aug") return t("monthAug");
    if (monthName === "Sep") return t("monthSep");
    if (monthName === "Oct") return t("monthOct");
    if (monthName === "Nov") return t("monthNov");
    if (monthName === "Dec") return t("monthDec");
    return monthName;
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
      setNewInstError(t("pleaseFillAllFields"));
      return;
    }
    const newInst: Institute = {
      id: String(institutes.length + 1),
      name: newInstName,
      province: newInstProvince,
      code: newInstCode.toUpperCase()
    };
    setInstitutes([...institutes, newInst]);
    triggerToast(t("instituteAddedSuccess"));
    
    // Clear & Close
    setNewInstName("");
    setNewInstCode("");
    setNewInstError("");
    setIsAddInstituteOpen(false);
  };

  const handleAddOfficerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfficerName || !newOfficerEmail) {
      setNewOfficerError(t("pleaseFillAllFields"));
      return;
    }

    const newStaff: User = {
      id: String(users.length + 1),
      name: newOfficerName,
      email: newOfficerEmail,
      role: newOfficerRole,
      status: "Active"
    };
    setUsers([...users, newStaff]);
    triggerToast(t("officerAddedSuccess"));
    
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

  // Institute cases by status breakdown for vertical stacked bars
  const casesByInstituteWithStatus = useMemo(() => {
    return institutes.map(inst => {
      const instCases = filteredCases.filter(c => c.institute === inst.name);
      const registered = instCases.filter(c => c.status === "Registered").length;
      const inProgress = instCases.filter(c => c.status === "Under Subject Officer" || c.status === "Under Investigation").length;
      const closed = instCases.filter(c => c.status === "Closed").length;
      const total = instCases.length;
      return {
        name: inst.name,
        code: inst.code,
        registered,
        inProgress,
        closed,
        total
      };
    });
  }, [filteredCases, institutes]);

  const maxInstCount = useMemo(() => {
    return Math.max(...casesByInstituteWithStatus.map(item => item.total), 1);
  }, [casesByInstituteWithStatus]);

  // 3. Dynamic intake statistics (Trend Chart)
  const trendData = useMemo(() => {
    let items: {
      label: string;
      counts: {
        Registered: number;
        "Under Subject Officer": number;
        "Under Investigation": number;
        Closed: number;
        total: number;
      };
    }[] = [];
    
    // Find min and max dates in filteredCases
    const dates = filteredCases.map(c => new Date(c.receivedDate)).filter(d => !isNaN(d.getTime()));
    
    // Fallbacks if no cases match
    const minDate = dates.length > 0 ? new Date(Math.min(...dates.map(d => d.getTime()))) : new Date(2024, 0, 1);
    const maxDate = dates.length > 0 ? new Date(Math.max(...dates.map(d => d.getTime()))) : new Date(2026, 6, 2);

    const getCounts = (filterFn: (c: Case) => boolean) => {
      const filtered = filteredCases.filter(filterFn);
      return {
        Registered: filtered.filter(c => c.status === "Registered").length,
        "Under Subject Officer": filtered.filter(c => c.status === "Under Subject Officer").length,
        "Under Investigation": filtered.filter(c => c.status === "Under Investigation").length,
        Closed: filtered.filter(c => c.status === "Closed").length,
        total: filtered.length
      };
    };
    
    if (trendInterval === "daily") {
      // Generate all days from minDate to maxDate
      const days: Date[] = [];
      const current = new Date(minDate);
      let countDays = 0;
      // Cap at 366 days safety to avoid huge ranges causing lag
      while (current <= maxDate && countDays < 366) {
        days.push(new Date(current));
        current.setDate(current.getDate() + 1);
        countDays++;
      }
      
      items = days.map(d => {
        const dateStr = d.toISOString().split("T")[0];
        const label = d.toLocaleDateString(lang === "si" ? "si-LK" : lang === "ta" ? "ta-LK" : "en-US", { year: "numeric", month: "short", day: "numeric" });
        return {
          label,
          counts: getCounts(c => c.receivedDate === dateStr)
        };
      });
    } else if (trendInterval === "weekly") {
      // Group by week starting Monday
      const getMonday = (d: Date) => {
        const date = new Date(d);
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(date.setDate(diff));
      };
      
      const startMonday = getMonday(minDate);
      const endMonday = getMonday(maxDate);
      
      const weeks: Date[] = [];
      const current = new Date(startMonday);
      let countWeeks = 0;
      // Safety cap at 53 weeks
      while (current <= endMonday && countWeeks < 53) {
        weeks.push(new Date(current));
        current.setDate(current.getDate() + 7);
        countWeeks++;
      }
      
      items = weeks.map(monday => {
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        
        const startStr = monday.toISOString().split("T")[0];
        const endStr = sunday.toISOString().split("T")[0];
        
        const label = `${monday.toLocaleDateString(lang === "si" ? "si-LK" : lang === "ta" ? "ta-LK" : "en-US", { month: "short", day: "numeric" })} - ${sunday.toLocaleDateString(lang === "si" ? "si-LK" : lang === "ta" ? "ta-LK" : "en-US", { month: "short", day: "numeric" })}`;
        return {
          label,
          counts: getCounts(c => c.receivedDate >= startStr && c.receivedDate <= endStr)
        };
      });
    } else if (trendInterval === "monthly") {
      const startYear = minDate.getFullYear();
      const startMonth = minDate.getMonth();
      const endYear = maxDate.getFullYear();
      const endMonth = maxDate.getMonth();
      
      const months = [];
      let y = startYear;
      let m = startMonth;
      
      while (y < endYear || (y === endYear && m <= endMonth)) {
        months.push({ year: y, month: m });
        m++;
        if (m > 11) {
          m = 0;
          y++;
        }
      }
      
      const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      items = months.map(item => {
        const monthNum = String(item.month + 1).padStart(2, "0");
        const translatedMonth = getTranslatedMonth(monthLabels[item.month]);
        const label = `${translatedMonth} ${item.year}`;
        return {
          label,
          counts: getCounts(c => c.receivedDate.startsWith(`${item.year}-${monthNum}`))
        };
      });
    } else if (trendInterval === "yearly") {
      const startYear = minDate.getFullYear();
      const endYear = maxDate.getFullYear();
      const years = [];
      for (let yr = startYear; yr <= endYear; yr++) {
        years.push(yr);
      }
      
      items = years.map(yr => {
        return {
          label: String(yr),
          counts: getCounts(c => c.receivedDate.startsWith(String(yr)))
        };
      });
    }

    // Dynamic width calculation for horizontal scrolling
    const itemWidth = trendInterval === "daily" ? 35 : trendInterval === "weekly" ? 90 : trendInterval === "monthly" ? 80 : 140;
    const paddingLeft = 60;
    const paddingRight = 60;
    const calculatedWidth = paddingLeft + paddingRight + items.length * itemWidth;
    const width = Math.max(950, calculatedWidth);

    const maxVal = Math.max(...items.map(item => Math.max(item.counts.Registered, item.counts["Under Subject Officer"], item.counts["Under Investigation"], item.counts.Closed)), 1);
    const maxTotalVal = Math.max(...items.map(item => item.counts.total), 1);
    const chartWidth = width - paddingLeft - paddingRight;
    const numPoints = items.length;
    
    const points = items.map((item, index) => {
      const x = paddingLeft + (index / Math.max(numPoints - 1, 1)) * chartWidth;
      const y = 160 - (item.counts.total / maxTotalVal) * 120; // 160 base height, 120 range
      return { label: item.label, count: item.counts.total, x, y };
    });

    const statusKeys = [
      { key: "Registered", color: "#cffafe" },
      { key: "Under Subject Officer", color: "#fef08a" },
      { key: "Under Investigation", color: "#ffffff" },
      { key: "Closed", color: "#a7f3d0" }
    ] as const;

    const getBezierPath = (pts: {x: number, y: number}[]) => {
      if (pts.length === 0) return "";
      if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
      let path = `M ${pts[0].x} ${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
        const p0 = pts[i];
        const p1 = pts[i + 1];
        const cpX1 = p0.x + (p1.x - p0.x) / 2;
        const cpY1 = p0.y;
        const cpX2 = p0.x + (p1.x - p0.x) / 2;
        const cpY2 = p1.y;
        path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
      }
      return path;
    };

    const statusLines = statusKeys.map((status) => {
      const linePoints = items.map((item, index) => {
        const x = paddingLeft + (index / Math.max(numPoints - 1, 1)) * chartWidth;
        const count = item.counts[status.key];
        const y = 160 - (count / maxVal) * 120;
        return { x, y, count };
      });

      const linePath = getBezierPath(linePoints);
      const areaPath = linePoints.length > 0 
        ? `${linePath} L ${linePoints[linePoints.length - 1].x} 160 L ${linePoints[0].x} 160 Z`
        : "";

      return {
        key: status.key,
        color: status.color,
        points: linePoints,
        linePath,
        areaPath
      };
    });

    return { items, points, statusLines, maxVal, maxTotalVal, width };
  }, [filteredCases, trendInterval, lang, t]);

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
        <main id="dashboard-main-content" className="dashboard-content">
          
          {/* ── Top App Bar Header ── */}
          <header className="dashboard-header">
            <div className="dashboard-header-left">
              <button 
                className="menu-toggle-btn" 
                aria-label="Toggle Sidebar Menu"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                {...(isSidebarOpen ? { "aria-expanded": "true" } : { "aria-expanded": "false" })}
              >
                <svg className="hamburger-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="dashboard-title-area">
                <h2 className="dashboard-main-title">{t("adminDashboardTitle")}</h2>
                <p className="dashboard-main-subtitle">{t("adminDashboardDesc")}</p>
              </div>
            </div>

            <div className="dashboard-header-right">
              {/* Date display badge */}
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

              {/* Accessibility Scale Radio Group */}
              <div className="accessibility-adjuster-bar" role="radiogroup" aria-label="Font Sizing Adjustment">
                <label className={`size-btn size-btn-small${fontScale === "small" ? " active" : ""}`}>
                  <input
                    type="radio"
                    name="dashboardFontScale"
                    value="small"
                    checked={fontScale === "small"}
                    onChange={() => setFontScale("small")}
                    aria-label={t("fontSmall")}
                    className="sr-only"
                  />
                  A
                </label>
                <label className={`size-btn size-btn-medium${fontScale === "medium" ? " active" : ""}`}>
                  <input
                    type="radio"
                    name="dashboardFontScale"
                    value="medium"
                    checked={fontScale === "medium"}
                    onChange={() => setFontScale("medium")}
                    aria-label={t("fontMedium")}
                    className="sr-only"
                  />
                  A
                </label>
                <label className={`size-btn size-btn-large${fontScale === "large" ? " active" : ""}`}>
                  <input
                    type="radio"
                    name="dashboardFontScale"
                    value="large"
                    checked={fontScale === "large"}
                    onChange={() => setFontScale("large")}
                    aria-label={t("fontLarge")}
                    className="sr-only"
                  />
                  A
                </label>
              </div>

              <div className="divider-line" aria-hidden="true" />

              {/* Translation controls */}
              <div className="trilingual-language-selector" role="radiogroup" aria-label="Translate Dashboard Language">
                <label className={`lang-btn${lang === "si" ? " active" : ""}`} lang="si">
                  <input
                    type="radio"
                    name="dashboardLang"
                    value="si"
                    checked={lang === "si"}
                    onChange={() => changeLanguage("si")}
                    aria-label="Switch dashboard language to Sinhala"
                    className="sr-only"
                  />
                  සිංහල
                </label>
                <label className={`lang-btn${lang === "ta" ? " active" : ""}`} lang="ta">
                  <input
                    type="radio"
                    name="dashboardLang"
                    value="ta"
                    checked={lang === "ta"}
                    onChange={() => changeLanguage("ta")}
                    aria-label="Switch dashboard language to Tamil"
                    className="sr-only"
                  />
                  தமிழ்
                </label>
                <label className={`lang-btn${lang === "en" ? " active" : ""}`} lang="en">
                  <input
                    type="radio"
                    name="dashboardLang"
                    value="en"
                    checked={lang === "en"}
                    onChange={() => changeLanguage("en")}
                    aria-label="Switch dashboard language to English"
                    className="sr-only"
                  />
                  English
                </label>
              </div>
            </div>
          </header>

          {/* ── Dynamic Welcome Banner Greeting ── */}
          <section className="welcome-greeting-section">
            <h3 className="greeting-text">
              {lang === "si" ? "සාදරයෙන් පිළිගනිමු, නතාෂා!" : lang === "ta" ? "வரவேற்கிறோம், நடாஷா!" : "Welcome, Nathasha!"}
            </h3>
          </section>

          {/* ── Quick Action Pills (Screenshot Matching) ── */}
          <section className="quick-actions-pills-row">
            <button className="action-pill-btn pill-cyan" onClick={() => setIsAddInstituteOpen(true)}>
              <span>+</span> {t("addInstitute")}
            </button>
            <button className="action-pill-btn pill-blue" onClick={() => openOfficerModalWithRole("roleInvestigation")}>
              <span>+</span> {t("addInvestigationOfficer")}
            </button>
            <button className="action-pill-btn pill-purple" onClick={() => openOfficerModalWithRole("roleDailyMail")}>
              <span>+</span> {t("addDailyReporter")}
            </button>
            <button className="action-pill-btn pill-darkblue" onClick={() => openOfficerModalWithRole("roleSubject")}>
              <span>+</span> {t("addSubjectOfficer")}
            </button>
          </section>

          {/* Stats section */}
          <section className="dashboard-stats-grid subject-stats-grid">
            {/* Total Cases */}
            <div className="stat-card-total">
              <div className="stat-card-header-inner">
                <div className="stat-card-title-group">
                  <svg className="stat-card-icon icon-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h4>{t("totalCases")}</h4>
                </div>
                <span className="stat-card-badge">+8%</span>
              </div>
              <div className="stat-card-body-row">
                <p className="stat-value text-blue">
                  {String(metrics.total).padStart(2, "0")}
                </p>
                <svg className="sparkline" viewBox="0 0 100 30" width="70" height="24">
                  <path d="M 0 25 Q 25 5 50 20 T 100 12" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="100" cy="12" r="3" fill="#ffffff" />
                </svg>
              </div>
            </div>

            {/* Closed Cases */}
            <div className="stat-card-close">
              <div className="stat-card-header-inner">
                <div className="stat-card-title-group">
                  <svg className="stat-card-icon icon-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4>{t("closedCases")}</h4>
                </div>
                <span className="stat-card-badge">+12%</span>
              </div>
              <div className="stat-card-body-row">
                <p className="stat-value text-green">
                  {String(metrics.closed).padStart(2, "0")}
                </p>
                <svg className="sparkline" viewBox="0 0 100 30" width="70" height="24">
                  <path d="M 0 20 Q 30 10 50 22 T 100 15" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="100" cy="15" r="3" fill="#ffffff" />
                </svg>
              </div>
            </div>

            {/* Under Investigation */}
            <div className="stat-card-inprogress">
              <div className="stat-card-header-inner">
                <div className="stat-card-title-group">
                  <svg className="stat-card-icon icon-orange" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18" />
                  </svg>
                  <h4>{t("underInvestigation")}</h4>
                </div>
                <span className="stat-card-badge">+18%</span>
              </div>
              <div className="stat-card-body-row">
                <p className="stat-value text-orange">
                  {String(metrics.underInvestigation).padStart(2, "0")}
                </p>
                <svg className="sparkline" viewBox="0 0 100 30" width="70" height="24">
                  <path d="M 0 15 Q 25 25 50 10 T 100 18" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="100" cy="18" r="3" fill="#ffffff" />
                </svg>
              </div>
            </div>

            {/* Under Subject */}
            <div className="stat-card-pending">
              <div className="stat-card-header-inner">
                <div className="stat-card-title-group">
                  <svg className="stat-card-icon icon-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4>{t("underSubject")}</h4>
                </div>
                <span className="stat-card-badge">+15%</span>
              </div>
              <div className="stat-card-body-row">
                <p className="stat-value text-yellow">
                  {String(metrics.underSubject).padStart(2, "0")}
                </p>
                <svg className="sparkline" viewBox="0 0 100 30" width="70" height="24">
                  <path d="M 0 22 Q 25 8 50 18 T 100 10" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
                  <circle cx="100" cy="10" r="3" fill="#ffffff" />
                </svg>
              </div>
            </div>
          </section>

          {/* ── Sub Navigation Tabs ── */}
          <nav className="admin-tab-nav-bar" aria-label="Admin Sections">
            <button
              className={`admin-tab-btn${activeTab === "analytics" ? " active" : ""}`}
              onClick={() => setActiveTab("analytics")}
            >
              {t("analyticsDashboardTab")}
            </button>
            <button
              className={`admin-tab-btn${activeTab === "users" ? " active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              {t("userDirectoryTab")} ({users.length})
            </button>
          </nav>

          {/* ============================================================
             TAB 1: POWER BI ANALYTICS DASHBOARD
             ============================================================ */}
          {activeTab === "analytics" && (
            <div className="admin-tab-content">
              
              {/* ── Power BI Interactive Filter Slicer ── */}
              <section className="slicer-filter-panel">
                <div className="slicer-header">
                  <div className="slicer-title">
                    <svg className="slicer-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    {t("slicerTitle")}
                  </div>
                  <button className="reset-filter-btn" onClick={resetAllFilters}>
                    {t("resetSlicers")}
                  </button>
                </div>

                <div className="slicers-grid">
                  {/* Slicer 1: Institute */}
                  <div className="slicer-control">
                    <label className="slicer-label" htmlFor="slicer-institute">{t("institute")}</label>
                    <select
                      id="slicer-institute"
                      className="slicer-select"
                      value={filterInstitute}
                      onChange={(e) => setFilterInstitute(e.target.value)}
                    >
                      <option value="All">{t("allInstitutes")}</option>
                      {institutes.map(inst => (
                        <option key={inst.id} value={inst.name}>{inst.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Slicer 2: Priority */}
                  <div className="slicer-control">
                    <label className="slicer-label" htmlFor="slicer-priority">{t("priority")}</label>
                    <select
                      id="slicer-priority"
                      className="slicer-select"
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                    >
                      <option value="All">{t("allPriorities")}</option>
                      <option value="High">{t("highPriority")}</option>
                      <option value="Medium">{t("mediumPriority")}</option>
                      <option value="Low">{t("lowPriority")}</option>
                    </select>
                  </div>

                  {/* Slicer 3: Case Status */}
                  <div className="slicer-control">
                    <label className="slicer-label" htmlFor="slicer-status">{t("status")}</label>
                    <select
                      id="slicer-status"
                      className="slicer-select"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="All">{t("allStatuses")}</option>
                      <option value="Registered">{t("statusRegistered")} ({t("unassigned")})</option>
                      <option value="Under Subject Officer">{t("underSubject")}</option>
                      <option value="Under Investigation">{t("underInvestigation")}</option>
                      <option value="Closed">{t("statusClosed")}</option>
                    </select>
                  </div>

                  {/* Slicer 4: Real-time Search */}
                  <div className="slicer-control">
                    <label className="slicer-label" htmlFor="slicer-search">{t("searchKeyword")}</label>
<input
                      id="slicer-search"
                      type="text"
                      className="slicer-input"
                      placeholder={t("searchKeywordPlaceholder")}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </section>

              {/* ── Charts Grid ── */}
              <section className="pbi-charts-container">
                {/* 1. Bar Chart: Cases by Institute */}
                <div className="pbi-chart-card pbi-chart-card-premium">
                  <div className="pbi-chart-header-row">
                    <h3 className="pbi-chart-title pbi-chart-title-clean">
                      {t("casesByInstituteChart")}
                    </h3>
                    <span className="pbi-chart-filter-all-btn">
                      {t("allInstitutes")} <svg width="10" height="6" viewBox="0 0 10 6" fill="none"><path d="M1 1L5 5L9 1" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  </div>

                  <div className="vertical-stacked-chart-container">
                    <svg width="100%" height="160" viewBox="0 0 400 160">
                      {casesByInstituteWithStatus.map((item, idx) => {
                        const x = 40 + idx * 80;
                        const maxBarHeight = 90;
                        const barYStart = 30;
                        const hClosed = item.total > 0 ? (item.closed / maxInstCount) * maxBarHeight : 0;
                        const hInProgress = item.total > 0 ? (item.inProgress / maxInstCount) * maxBarHeight : 0;
                        const hRegistered = item.total > 0 ? (item.registered / maxInstCount) * maxBarHeight : 0;
                        const yBase = 120;

                        return (
                          <g 
                            key={idx} 
                            className="bar-group-interactive"
                            onClick={() => setFilterInstitute(item.name === filterInstitute ? "All" : item.name)}
                          >
                            <text x={x} y="15" textAnchor="middle" fill="#64748b" fontSize="11" fontWeight="700">
                              {item.code}
                            </text>
                            <rect x={x - 4} y={barYStart} width="8" height={maxBarHeight} rx="4" fill="#f1f5f9" />
                            {hRegistered > 0 && (
                              <rect x={x - 4} y={yBase - hClosed - hInProgress - hRegistered} width="8" height={hRegistered} rx="4" fill="#cbd5e1" />
                            )}
                            {hInProgress > 0 && (
                              <rect x={x - 4} y={yBase - hClosed - hInProgress} width="8" height={hInProgress} rx="4" fill="#1e293b" />
                            )}
                            {hClosed > 0 && (
                              <rect x={x - 4} y={yBase - hClosed} width="8" height={hClosed} rx="4" fill="#10b981" />
                            )}
                            <rect
                              x={x - 20}
                              y={10}
                              width="40"
                              height="140"
                              fill="transparent"
                              onMouseEnter={() => {
                                setHoveredPoint(idx + 100);
                                setTooltipPos({ x: x + 10, y: yBase - hClosed - hInProgress - hRegistered });
                                const tooltipContent = (
                                  <div className="tooltip-container">
                                    <div className="tooltip-title">
                                      {item.name}
                                    </div>
                                    <div className="tooltip-row">
                                      <span className="tooltip-label">
                                        <span className="chart-legend-dot green-card-dot-registered" />
                                        {t("statusRegistered")}:
                                      </span>
                                      <span className="tooltip-value">{item.registered}</span>
                                    </div>
                                    <div className="tooltip-row">
                                      <span className="tooltip-label">
                                        <span className="chart-legend-dot legend-dot-inprogress" />
                                        {t("statusInProgress")}:
                                      </span>
                                      <span className="tooltip-value">{item.inProgress}</span>
                                    </div>
                                    <div className="tooltip-row">
                                      <span className="tooltip-label">
                                        <span className="chart-legend-dot legend-dot-closed" />
                                        {t("statusClosed")}:
                                      </span>
                                      <span className="tooltip-value">{item.closed}</span>
                                    </div>
                                    <div className="tooltip-total-row">
                                      <span>{t("totalCases")}</span>
                                      <span>{item.total}</span>
                                    </div>
                                  </div>
                                );
                                setTooltipText(tooltipContent);
                              }}
                              onMouseLeave={() => setHoveredPoint(null)}
                            />
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  <div className="chart-legend-flex">
                    <div className="chart-legend-item">
                      <span className="chart-legend-dot legend-dot-closed" />
                      <span>{t("statusClosed")}</span>
                    </div>
                    <div className="chart-legend-item">
                      <span className="chart-legend-dot legend-dot-inprogress" />
                      <span>{t("statusInProgress")}</span>
                    </div>
                    <div className="chart-legend-item">
                      <span className="chart-legend-dot legend-dot-registered" />
                      <span>{t("statusRegistered")}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Donut Chart: Case Status Breakdown */}
                <div className="pbi-chart-card">
                  <h3 className="pbi-chart-title">{t("caseStatusDistributionChart")}</h3>
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
                            <title>{`${getTranslatedStatus(slice.name)}: ${slice.count} ${t("cases").toLowerCase()} (${slice.percent}%)`}</title>
                          </circle>
                        ))}
                      </svg>
                      
                      <div className="donut-center-text">
                        <span className="donut-center-num">{metrics.total}</span>
                        <span className="donut-center-label">{t("cases")}</span>
                      </div>
                    </div>

                    <div className="donut-legend">
                      {casesByStatus.map((slice, idx) => (
                        <div 
                          key={idx} 
                          className="legend-item"
                          onClick={() => setFilterStatus(slice.name === "Under Subject" ? "Under Subject Officer" : slice.name === filterStatus ? "All" : slice.name)}
                        >
                          <span className={`legend-color-dot dot-${slice.name.toLowerCase().replace(" ", "-")}`} />
                          <span>{getTranslatedStatus(slice.name)} ({slice.count})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. Trend Line/Bar Chart (Full Width) */}
                <div className="pbi-chart-card chart-full-width trend-chart-card-green">
                  <div className="chart-header-row">
                    <div className="chart-title-legend-col">
                      <h3 className="pbi-chart-title">{t("caseRegistrationTrendChart")}</h3>
                      <div className="chart-legend-row">
                        {[
                          { key: "Registered", label: t("statusRegistered") },
                          { key: "Under Subject Officer", label: t("underSubject") },
                          { key: "Under Investigation", label: t("underInvestigation") },
                          { key: "Closed", label: t("statusClosed") }
                        ].map((s) => (
                          <div key={s.key} className="chart-legend-item-white">
                            <span className={`chart-legend-dot green-card-dot-${s.key.toLowerCase().replace(/ /g, "-")}`} />
                            <span>{s.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="chart-header-controls">
                      {/* Interval selector */}
                      <div className="trend-interval-selector" role="radiogroup" aria-label="Select trend interval">
                        <button
                          className={`interval-btn${trendInterval === "daily" ? " active" : ""}`}
                          onClick={() => {
                            setTrendInterval("daily");
                            setChartType("line");
                          }}
                          type="button"
                        >
                          {t("dailyTrend")}
                        </button>
                        <button
                          className={`interval-btn${trendInterval === "weekly" ? " active" : ""}`}
                          onClick={() => {
                            setTrendInterval("weekly");
                            setChartType("line");
                          }}
                          type="button"
                        >
                          {t("weeklyTrend")}
                        </button>
                        <button
                          className={`interval-btn${trendInterval === "monthly" ? " active" : ""}`}
                          onClick={() => {
                            setTrendInterval("monthly");
                            setChartType("line");
                          }}
                          type="button"
                        >
                          {t("monthlyTrend")}
                        </button>
                        <button
                          className={`interval-btn${trendInterval === "yearly" ? " active" : ""}`}
                          onClick={() => {
                            setTrendInterval("yearly");
                            setChartType("line");
                          }}
                          type="button"
                        >
                          {t("yearlyTrend")}
                        </button>
                      </div>

                      {/* Chart Type selector */}
                      <div className="trend-interval-selector" role="radiogroup" aria-label="Select chart type">
                        <button
                          className={`interval-btn${chartType === "bar" ? " active" : ""}`}
                          onClick={() => setChartType("bar")}
                          type="button"
                        >
                          {t("barChart")}
                        </button>
                        <button
                          className={`interval-btn${chartType === "line" ? " active" : ""}`}
                          onClick={() => setChartType("line")}
                          type="button"
                        >
                          {t("lineChart")}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="trend-chart-wrapper scrollable-chart-container">
                    <svg className="trend-svg" viewBox={`0 0 ${trendData.width} 200`} width={trendData.width} height="200">
                      <defs>
                        <linearGradient id="whiteAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.00" />
                        </linearGradient>
                      </defs>

                      {/* Grid Lines */}
                      {[40, 80, 120, 160].map((yVal, index) => (
                        <line key={index} x1="50" y1={yVal} x2={trendData.width - 50} y2={yVal} stroke="rgba(255, 255, 255, 0.15)" strokeDasharray="4 4" />
                      ))}

                      {/* Crosshair (Vertical guide line on hover) */}
                      {hoveredPoint !== null && (
                        <line
                          x1={trendData.points[hoveredPoint].x}
                          y1={40}
                          x2={trendData.points[hoveredPoint].x}
                          y2={160}
                          stroke="rgba(255,255,255,0.4)"
                          strokeWidth="1.5"
                          strokeDasharray="3 3"
                          pointerEvents="none"
                        />
                      )}

                      {/* Connection Lines (Line Chart Only) */}
                      {chartType === "line" && trendData.statusLines.map((line) => (
                        <g key={`lines-group-${line.key}`}>
                          <path
                            d={line.areaPath}
                            fill="url(#whiteAreaGrad)"
                            pointerEvents="none"
                          />
                          <path
                            d={line.linePath}
                            fill="none"
                            stroke={line.color}
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </g>
                      ))}

                      {/* Bar Columns (Stacked Bar Chart Only) */}
                      {chartType === "bar" && trendData.items.map((item, i) => {
                        const x = trendData.points[i].x;
                        const barWidth = trendInterval === "daily" ? 12 : trendInterval === "weekly" ? 35 : trendInterval === "monthly" ? 25 : 55;
                        
                        const statusColors = [
                          { key: "Closed", color: "#a7f3d0" },
                          { key: "Under Investigation", color: "#ffffff" },
                          { key: "Under Subject Officer", color: "#fef08a" },
                          { key: "Registered", color: "#cffafe" }
                        ] as const;

                        let currentY = 160;
                        return (
                          <g key={`bar-group-${i}`}>
                            {statusColors.map((status) => {
                              const count = item.counts[status.key];
                              if (count === 0) return null;
                              const height = (count / trendData.maxTotalVal) * 120;
                              const y = currentY - height;
                              currentY = y;
                              return (
                                <rect
                                  key={`bar-${status.key}-${i}`}
                                  x={x - barWidth / 2}
                                  y={y}
                                  width={barWidth}
                                  height={Math.max(height, 1)}
                                  fill={status.color}
                                  className="trend-bar-segment"
                                />
                              );
                            })}
                          </g>
                        );
                      })}

                      {/* Glowing Highlighted Dots on Hover (Line Chart Only) */}
                      {chartType === "line" && hoveredPoint !== null && trendData.statusLines.map((line) => {
                        const p = line.points[hoveredPoint];
                        if (p.count === 0 && trendInterval === "daily") {
                          return null;
                        }
                        return (
                          <g key={`glow-${line.key}`}>
                            <circle cx={p.x} cy={p.y} r="8" fill="#ffffff" fillOpacity="0.3" pointerEvents="none" />
                            <circle cx={p.x} cy={p.y} r="4" fill="#ffffff" pointerEvents="none" />
                          </g>
                        );
                      })}

                      {/* Point Value Labels (High-contrast badges showing TOTAL count at peak, Bar Chart Only) */}
                      {chartType === "bar" && trendData.points.map((p, i) => {
                        if (trendInterval === "daily" && p.count === 0) {
                          return null;
                        }
                        const isDoubleDigit = p.count >= 10;
                        const badgeWidth = isDoubleDigit ? 24 : 18;
                        const badgeHeight = 16;
                        return (
                          <g key={`val-${i}`} className="trend-badge-group" pointerEvents="none">
                            <rect
                              x={p.x - badgeWidth / 2}
                              y={p.y - 24}
                              width={badgeWidth}
                              height={badgeHeight}
                              rx="4"
                              ry="4"
                              fill="#1e293b"
                              stroke="#ffffff"
                              strokeWidth="1.5"
                            />
                            <text
                              x={p.x}
                              y={p.y - 12}
                              textAnchor="middle"
                              fill="#ffffff"
                              fontSize="9"
                              fontWeight="800"
                            >
                              {p.count}
                            </text>
                          </g>
                        );
                      })}

                      {/* X Axis Labels */}
                      {trendData.points.map((p, i) => {
                        if (trendInterval === "daily" && i % 3 !== 0 && i !== trendData.points.length - 1) {
                          return null;
                        }
                        return (
                          <text key={i} x={p.x} y="190" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="11" fontWeight="700">
                            {p.label}
                          </text>
                        );
                      })}

                      {/* Transparent Hover Catcher Overlay Zones */}
                      {trendData.points.map((p, i) => {
                        const catcherWidth = trendInterval === "daily" ? 16 : trendInterval === "weekly" ? 45 : trendInterval === "monthly" ? 40 : 70;
                        const item = trendData.items[i];
                        return (
                          <rect
                            key={`hover-catcher-${i}`}
                            x={p.x - catcherWidth / 2}
                            y={30}
                            width={catcherWidth}
                            height={140}
                            fill="transparent"
                            className="trend-catcher-rect"
                            onMouseEnter={() => {
                              setHoveredPoint(i);
                              setTooltipPos({ x: p.x, y: p.y });
                              
                              const tooltipContent = (
                                <div className="tooltip-container">
                                  <div className="tooltip-title">
                                    {item.label}
                                  </div>
                                  {[
                                    { key: "Registered", label: t("statusRegistered") },
                                    { key: "Under Subject Officer", label: t("underSubject") },
                                    { key: "Under Investigation", label: t("underInvestigation") },
                                    { key: "Closed", label: t("statusClosed") }
                                  ].map(s => (
                                    <div key={s.key} className="tooltip-row">
                                      <span className="tooltip-label">
                                        <span className={`chart-legend-dot green-card-dot-${s.key.toLowerCase().replace(/ /g, "-")}`} />
                                        {s.label}
                                      </span>
                                      <span className="tooltip-value">{item.counts[s.key as keyof typeof item.counts]}</span>
                                    </div>
                                  ))}
                                  <div className="tooltip-total-row">
                                    <span>{t("totalCases")}</span>
                                    <span>{item.counts.total}</span>
                                  </div>
                                </div>
                              );
                              setTooltipText(tooltipContent);
                            }}
                            onMouseLeave={() => setHoveredPoint(null)}
                          />
                        );
                      })}
                    </svg>

                    {/* Chart Point Tooltip */}
                    {hoveredPoint !== null && (
                      <div ref={tooltipRef} className="chart-tooltip">
                        {tooltipText}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section className="letters-list-section">
                <div className="letters-list-header">
                  <h3 className="section-title">{t("disciplinaryCasesLedger")}</h3>
                  <div className="letters-filters-group">
                    <span className="badge-badge badge-status-active ledger-badge-info">
                      {t("showingEntries", { count: filteredCases.length, total: cases.length })}
                    </span>
                    <button className="see-all-btn" onClick={() => setShowAll(prev => !prev)}>
                      {showAll ? t("showLess") : t("seeAll")}
                    </button>
                  </div>
                </div>

                <div className="table-responsive-container">
                  <table className="letters-data-table">
                    <thead>
                      <tr>
                        <th scope="col">{t("caseRef")}</th>
                        <th scope="col">{t("subjectDescription")}</th>
                        <th scope="col">{t("assignedOfficer")}</th>
                        <th scope="col">{t("institute")}</th>
                        <th scope="col">{t("priority")}</th>
                        <th scope="col">{t("status")}</th>
                        <th scope="col" className="text-center">{t("actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCases.length > 0 ? (
                        filteredCases.slice(0, showAll ? filteredCases.length : 15).map((item) => (
                          <tr key={item.id} className="letter-table-row">
                            <td className="font-semibold text-primary">{item.refNo}</td>
                            <td title={item.subject} className="table-cell-truncate">
                              {item.subject}
                            </td>
                            <td>{item.officer}</td>
                            <td>{item.institute}</td>
                            <td>
                              <span className={`badge-priority priority-${item.priority.toLowerCase()}`}>
                                {item.priority === "High" ? t("priorityHigh") : item.priority === "Medium" ? t("priorityMedium") : t("priorityLow")}
                              </span>
                            </td>
                            <td>
                              <span className={`badge-badge ${
                                item.status === "Under Investigation" ? "badge-status-under-investigation" :
                                item.status === "Under Subject Officer" ? "badge-status-under-subject" :
                                item.status === "Closed" ? "badge-status-closed" : "badge-status-registered"
                              }`}>
                                {getTranslatedStatus(item.status)}
                              </span>
                            </td>
                            <td className="text-center actions-cell">
                              <select
                                className="slicer-select table-status-select"
                                aria-label="Change case status"
                                value={item.status}
                                onChange={(e) => {
                                  const newStatus = e.target.value as any;
                                  // Update status locally
                                  setCases(cases.map(c => c.id === item.id ? { ...c, status: newStatus } : c));
                                  triggerToast(t("statusUpdatedToast", { refNo: item.refNo, status: getTranslatedStatus(newStatus) }));
                                }}
                              >
                                <option value="Registered">{t("statusRegistered")}</option>
                                <option value="Under Subject Officer">{t("underSubject")}</option>
                                <option value="Under Investigation">{t("underInvestigation")}</option>
                                <option value="Closed">{t("statusClosed")}</option>
                              </select>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center py-4 text-muted">
                            {t("noCasesFound")}
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
            <div className="admin-tab-content">
              <section className="letters-list-section users-directory-section">
                <div className="letters-list-header">
                  <h3 className="section-title">{t("userDirectoryTitle")}</h3>
                  <div className="letters-filters-group">
                    <div className="search-box">
                      <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t("searchUserPlaceholder")}
                        className="search-input"
                      />
                    </div>
                  </div>
                </div>

                <div className="table-responsive-container">
                  <table className="letters-data-table">
                    <thead>
                      <tr>
                        <th scope="col">{t("userName")}</th>
                        <th scope="col">{t("emailAddress")}</th>
                        <th scope="col">{t("assignedSystemRole")}</th>
                        <th scope="col">{t("accountStatus")}</th>
                        <th scope="col" className="text-center">{t("actions")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.filter(u => 
                        u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        t(u.role).toLowerCase().includes(searchQuery.toLowerCase()) || 
                        u.email.toLowerCase().includes(searchQuery.toLowerCase())
                      ).map((user) => (
                        <tr key={user.id} className="letter-table-row">
                          <td className="font-semibold text-primary">{user.name}</td>
                          <td>{user.email}</td>
                          <td>{t(user.role)}</td>
                          <td>
                            <span className="badge-badge badge-status-active">
                              {t(user.status === "Active" ? "active" : "inactive")}
                            </span>
                          </td>
                          <td className="text-center actions-cell">
                            <button
                              className="btn-action-view"
                              onClick={() => {
                                alert(`${t("userDetailsPrompt")}\n${t("userName")}: ${user.name}\n${t("emailAddress")}: ${user.email}\n${t("assignedSystemRole")}: ${t(user.role)}`);
                              }}
                              title={t("inspectDetails")}
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

          {/* ── Footer Branding Notice ── */}
          <footer className="dashboard-content-footer">
            <p>{t("footerText")}</p>
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
              <h3 id="modal-inst-title" className="modal-title-text">{t("addNewInstituteTitle")}</h3>
              <button className="modal-close-x" onClick={() => setIsAddInstituteOpen(false)} aria-label="Close modal">&times;</button>
            </div>
            
            <form onSubmit={handleAddInstituteSubmit}>
              <div className="modal-body-form">
                {newInstError && (
                  <div className="form-error-msg">{newInstError}</div>
                )}
                
                <div className="form-group-item">
                  <label className="form-label-txt" htmlFor="inst-name">{t("nameOfInstitute")}</label>
                  <input
                    id="inst-name"
                    type="text"
                    className="form-input-box"
                    placeholder={t("placeholderInstNameExample")}
                    value={newInstName}
                    onChange={(e) => setNewInstName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group-item">
                  <label className="form-label-txt" htmlFor="inst-province">{t("provinceRegion")}</label>
                  <select
                    id="inst-province"
                    className="form-select-box"
                    value={newInstProvince}
                    onChange={(e) => setNewInstProvince(e.target.value)}
                  >
                    <option value="Western">{t("provinceWestern")}</option>
                    <option value="Central">{t("provinceCentral")}</option>
                    <option value="Southern">{t("provinceSouthern")}</option>
                    <option value="Northern">{t("provinceNorthern")}</option>
                    <option value="Eastern">{t("provinceEastern")}</option>
                    <option value="North Western">{t("provinceNorthWestern")}</option>
                    <option value="North Central">{t("provinceNorthCentral")}</option>
                    <option value="Uva">{t("provinceUva")}</option>
                    <option value="Sabaragamuwa">{t("provinceSabaragamuwa")}</option>
                  </select>
                </div>

                <div className="form-group-item">
                  <label className="form-label-txt" htmlFor="inst-code">{t("instituteCode")}</label>
                  <input
                    id="inst-code"
                    type="text"
                    className="form-input-box"
                    placeholder={t("placeholderInstCodeExample")}
                    value={newInstCode}
                    onChange={(e) => setNewInstCode(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="modal-footer-box">
                <button type="button" className="btn-form-cancel" onClick={() => setIsAddInstituteOpen(false)}>
                  {t("cancelBtn")}
                </button>
                <button type="submit" className="btn-form-submit">
                  {t("saveInstituteBtn")}
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
                {t("addStaffAccountTitle")}
              </h3>
              <button className="modal-close-x" onClick={() => setIsAddOfficerOpen(false)} aria-label="Close modal">&times;</button>
            </div>
            
            <form onSubmit={handleAddOfficerSubmit}>
              <div className="modal-body-form">
                {newOfficerError && (
                  <div className="form-error-msg">{newOfficerError}</div>
                )}
                
                <div className="form-group-item">
                  <label className="form-label-txt" htmlFor="off-name">{t("officerFullName")}</label>
                  <input
                    id="off-name"
                    type="text"
                    className="form-input-box"
                    placeholder={t("placeholderOfficerNameExample")}
                    value={newOfficerName}
                    onChange={(e) => setNewOfficerName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group-item">
                  <label className="form-label-txt" htmlFor="off-email">{t("emailAddress")}</label>
                  <input
                    id="off-email"
                    type="email"
                    className="form-input-box"
                    placeholder={t("placeholderEmailExample")}
                    value={newOfficerEmail}
                    onChange={(e) => setNewOfficerEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group-item">
                  <label className="form-label-txt" htmlFor="off-role">{t("assignedSystemRole")}</label>
                  <select
                    id="off-role"
                    className="form-select-box"
                    value={newOfficerRole}
                    onChange={(e) => setNewOfficerRole(e.target.value)}
                  >
                    <option value="roleAdmin">{t("roleAdmin")}</option>
                    <option value="roleDailyMail">{t("roleDailyMail")}</option>
                    <option value="roleSubject">{t("roleSubject")}</option>
                    <option value="roleInvestigation">{t("roleInvestigation")}</option>
                  </select>
                </div>
              </div>
              
              <div className="modal-footer-box">
                <button type="button" className="btn-form-cancel" onClick={() => setIsAddOfficerOpen(false)}>
                  {t("cancelBtn")}
                </button>
                <button type="submit" className="btn-form-submit">
                  {t("saveAccountBtn")}
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
