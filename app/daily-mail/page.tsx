"use client";

import "../../i18n";
import "./daily-mail.css";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

interface Letter {
  id: string;
  refNo: string;
  receivedDate: string;
  letterDate: string;
  senderName: string;
  senderAddress: string;
  subject: string;
  priority: "high" | "medium" | "low";
  status: "registered" | "assigned" | "pending";
}

export default function DailyMailPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  // Accessibility & language state
  const [fontScale, setFontScale] = useState<"small" | "medium" | "large">("medium");
  const lang = i18n.language;

  // Mobile sidebar visibility state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Close sidebar on Escape key press (A11y compliance)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Sync document properties
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = `${t("dailyMailReporter")} | DCMMS`;
  }, [lang, t]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Letters listing mock data state
  const [letters, setLetters] = useState<Letter[]>([
    {
      id: "1",
      refNo: "DCMMS/2026/001",
      receivedDate: "2026-06-20",
      letterDate: "2026-06-18",
      senderName: "W. M. Perera (Principal - Royal College)",
      senderAddress: "Royal College, Colombo 07",
      subject: "Complaint on student discipline issues",
      priority: "high",
      status: "registered",
    },
    {
      id: "2",
      refNo: "DCMMS/2026/002",
      receivedDate: "2026-06-22",
      letterDate: "2026-06-20",
      senderName: "S. K. Rajan (Zonal Director - Jaffna)",
      senderAddress: "Zonal Education Office, Jaffna",
      subject: "Teacher absenteeism inquiry report",
      priority: "medium",
      status: "assigned",
    },
    {
      id: "3",
      refNo: "DCMMS/2026/003",
      receivedDate: "2026-06-23",
      letterDate: "2026-06-21",
      senderName: "Ministry of Education (Secretary)",
      senderAddress: "Isurupaya, Battaramulla",
      subject: "Guidelines for annual sport meets",
      priority: "low",
      status: "pending",
    },
  ]);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "high" | "medium" | "low">("all");

  // Modal form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLetterForm, setNewLetterForm] = useState({
    refNo: "",
    senderName: "",
    senderAddress: "",
    letterDate: "",
    receivedDate: "",
    subject: "",
    priority: "medium" as "high" | "medium" | "low",
    status: "registered" as "registered" | "assigned" | "pending",
  });

  // Success Notification Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  // Trigger toast notification helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  // Log out handler
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/");
  };

  // Register New Letter Submit Handler
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check basic required fields
    if (!newLetterForm.refNo || !newLetterForm.senderName || !newLetterForm.subject) {
      alert("Please fill in all required fields (Reference Number, Sender Name, and Subject).");
      return;
    }

    const createdLetter: Letter = {
      id: Date.now().toString(),
      refNo: newLetterForm.refNo,
      senderName: newLetterForm.senderName,
      senderAddress: newLetterForm.senderAddress || "N/A",
      letterDate: newLetterForm.letterDate || new Date().toISOString().split("T")[0],
      receivedDate: newLetterForm.receivedDate || new Date().toISOString().split("T")[0],
      subject: newLetterForm.subject,
      priority: newLetterForm.priority,
      status: newLetterForm.status,
    };

    setLetters([createdLetter, ...letters]);
    setIsModalOpen(false);

    // Reset Form
    setNewLetterForm({
      refNo: "",
      senderName: "",
      senderAddress: "",
      letterDate: "",
      receivedDate: "",
      subject: "",
      priority: "medium",
      status: "registered",
    });

    triggerToast(t("toastSuccess"));
  };

  // Filter letters list in real-time
  const filteredLetters = letters.filter((letter) => {
    const matchesSearch =
      letter.refNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      letter.subject.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority = priorityFilter === "all" || letter.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  // Handle reset search filters
  const handleResetFilters = (e: React.MouseEvent) => {
    e.preventDefault();
    setSearchQuery("");
    setPriorityFilter("all");
  };

  return (
    <div className="dashboard-container" data-font-scale={fontScale}>
      {/* ── Skip Link (A11y) ── */}
      <a href="#dashboard-main-content" className="skip-link">
        {t("skipLink")}
      </a>

      {/* Backdrop overlay for mobile viewport */}
      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* ── Layout Grid Wrapper ── */}
      <div className="dashboard-layout">
        
        {/* ============================================================
           SIDEBAR PANEL
           ============================================================ */}
        <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
          {/* Logo & Close Button Header */}
          <div className="sidebar-header">
            <div className="sidebar-brand">
              <div className="sidebar-brand-icon">
                <svg className="scales-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v17M12 5l-8 3M12 5l8 3M4 8v5c0 2 2 3 4 3s4-1 4-3V8M20 8v5c0 2-2 3-4 3s-4-1-4-3V8" />
                </svg>
              </div>
              <div className="sidebar-brand-text">
                <h1 className="sidebar-brand-title">DCMMS</h1>
                <p className="sidebar-brand-subtitle">{t("subtitle")}</p>
              </div>
            </div>

            <button 
              className="btn-sidebar-close" 
              onClick={() => setIsSidebarOpen(false)} 
              aria-label="Close sidebar"
            >
              <svg className="close-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Quick Action Sidebar Button */}
          <div className="sidebar-action-wrapper">
            <button className="btn-sidebar-action" onClick={() => setIsModalOpen(true)}>
              <span className="plus-icon">+</span> {t("newLetterBtn")}
            </button>
          </div>

          {/* Sidebar Menu Navigation Links */}
          <nav className="sidebar-menu" aria-label="Sidebar navigation">
            <ul className="sidebar-menu-list">
              <li>
                <a href="#" className="sidebar-menu-item active">
                  <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a href="#" className="sidebar-menu-item" onClick={(e) => { e.preventDefault(); setIsModalOpen(true); }}>
                  <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Register Letter</span>
                </a>
              </li>
              <li>
                <a href="#" className="sidebar-menu-item">
                  <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2m16 4h-2a2 2 0 00-2 2v1a2 2 0 00-2 2H8a2 2 0 00-2-2v-1a2 2 0 00-2-2H2" />
                  </svg>
                  <span>Inbox</span>
                  <span className="badge-count">5</span>
                </a>
              </li>
              <li>
                <a href="#" className="sidebar-menu-item">
                  <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Reports</span>
                </a>
              </li>
            </ul>
          </nav>

          {/* Sidebar Footer User Info and Logout */}
          <div className="sidebar-footer">
            <div className="user-profile-box">
              <div className="user-avatar-circle">
                <span>NS</span>
              </div>
              <div className="user-details">
                <span className="user-name">{t("welcomeUser")}</span>
                <span className="user-email">{t("profileEmail")}</span>
              </div>
            </div>
            <a href="#" className="logout-link" onClick={handleLogout}>
              <svg className="logout-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>{t("logout")}</span>
            </a>
          </div>
        </aside>

        {/* ============================================================
           MAIN WORKSPACE CONTENT AREA
           ============================================================ */}
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
                <h2 className="dashboard-main-title">{t("dailyMailReporter")}</h2>
                <p className="dashboard-main-subtitle">{t("registerLettersDesc")}</p>
              </div>
            </div>

            <div className="dashboard-header-right">
              {/* Date display badge */}
              <div className="date-badge">
                <svg className="date-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>June 24, 2026</span>
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
            <h3 className="greeting-text">{t("goodMorning")}</h3>
          </section>

          {/* ── Quick Action Hero Cards (Figma Hero Banner) ── */}
          <section className="hero-banner-card-section">
            <div className="hero-action-card">
              <div className="hero-action-graphics">
                <div className="hero-circle-plus-badge">
                  <svg className="hero-plus-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>
              <div className="hero-action-details">
                <h4 className="hero-action-title">{t("registerLetterComplainBanner")}</h4>
                <p className="hero-action-description">Easily log new incoming correspondence and files for dispatching to subject officers.</p>
                <button className="btn-hero-action" onClick={() => setIsModalOpen(true)}>
                  {t("newLetterBtn")}
                </button>
              </div>
            </div>
          </section>

          {/* ── Letter Entries Section ── */}
          <section className="letters-list-section">
            
            {/* Header Filter Panel */}
            <div className="letters-list-header">
              <h3 className="section-title">{t("letterEntries")}</h3>
              
              <div className="letters-filters-group">
                {/* Search Bar Input */}
                <div className="search-box">
                  <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t("searchLettersPlaceholder")}
                    className="search-input"
                  />
                </div>

                {/* Priority Selection Filter */}
                <div className="filter-dropdown-wrapper">
                  <svg className="filter-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  <select
                    value={priorityFilter}
                    onChange={(e: any) => setPriorityFilter(e.target.value)}
                    className="filter-priority-select"
                    aria-label={t("priority")}
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                {/* Reset filters action */}
                <a href="#" className="view-all-reset-link" onClick={handleResetFilters}>
                  {t("viewAll")} <span className="arrow-span">→</span>
                </a>
              </div>
            </div>

            {/* letters listing dynamic display grid/table */}
            <div className="table-responsive-container">
              <table className="letters-data-table">
                <thead>
                  <tr>
                    <th scope="col">{t("refNo")}</th>
                    <th scope="col">{t("receivedDate")}</th>
                    <th scope="col">{t("senderName")}</th>
                    <th scope="col">{t("subjectText")}</th>
                    <th scope="col">{t("priority")}</th>
                    <th scope="col">{t("status")}</th>
                    <th scope="col" className="text-center">{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLetters.length > 0 ? (
                    filteredLetters.map((letter) => (
                      <tr key={letter.id} className="letter-table-row">
                        <td className="font-semibold text-primary">{letter.refNo}</td>
                        <td>{letter.receivedDate}</td>
                        <td>
                          <div className="sender-cell">
                            <span className="sender-display-name">{letter.senderName}</span>
                            <span className="sender-display-address">{letter.senderAddress}</span>
                          </div>
                        </td>
                        <td className="subject-cell">{letter.subject}</td>
                        <td>
                          <span className={`badge-badge badge-priority-${letter.priority}`}>
                            {t(`priority${letter.priority.charAt(0).toUpperCase() + letter.priority.slice(1)}`)}
                          </span>
                        </td>
                        <td>
                          <span className={`badge-badge badge-status-${letter.status}`}>
                            {t(`status${letter.status.charAt(0).toUpperCase() + letter.status.slice(1)}`)}
                          </span>
                        </td>
                        <td className="text-center actions-cell">
                          <button
                            className="btn-action-view"
                            onClick={() => {
                              alert(`Letter Ref: ${letter.refNo}\nSubject: ${letter.subject}\nSender: ${letter.senderName}\nAddress: ${letter.senderAddress}`);
                            }}
                            title="View Details"
                          >
                            <svg className="action-row-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="empty-table-state-cell">
                        <div className="empty-state-card">
                          <svg className="empty-state-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 19v-8.93a2 2 0 01.89-1.664l8-5.333a2 2 0 012.22 0l8 5.333A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-2.25-1.5a2 2 0 00-2.22 0l-2.25 1.5" />
                          </svg>
                          <p>{t("noLettersFound")}</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ── Footer Branding Notice ── */}
          <footer className="dashboard-content-footer">
            <p>{t("footerText")}</p>
          </footer>
        </main>
      </div>

      {/* ============================================================
         REGISTER NEW LETTER BACKDROP MODAL FORM
         ============================================================ */}
      {isModalOpen && (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="modal-card">
            
            {/* Modal Header */}
            <div className="modal-header">
              <h3 id="modal-title" className="modal-title">{t("newLetterModalTitle")}</h3>
              <button className="modal-close-x-btn" onClick={() => setIsModalOpen(false)} aria-label="Close modal">
                &times;
              </button>
            </div>

            {/* Modal Body / Register Letter Input Form */}
            <form onSubmit={handleRegisterSubmit} className="modal-form">
              
              <div className="modal-form-grid">
                
                {/* Reference Number */}
                <div className="modal-form-group">
                  <label htmlFor="modal-refNo" className="modal-label">
                    {t("refNo")} <span className="required-star">*</span>
                  </label>
                  <input
                    id="modal-refNo"
                    type="text"
                    required
                    value={newLetterForm.refNo}
                    onChange={(e) => setNewLetterForm({ ...newLetterForm, refNo: e.target.value })}
                    placeholder={t("refPlaceholder")}
                    className="modal-input"
                  />
                </div>

                {/* Sender Name */}
                <div className="modal-form-group">
                  <label htmlFor="modal-sender" className="modal-label">
                    {t("senderName")} <span className="required-star">*</span>
                  </label>
                  <input
                    id="modal-sender"
                    type="text"
                    required
                    value={newLetterForm.senderName}
                    onChange={(e) => setNewLetterForm({ ...newLetterForm, senderName: e.target.value })}
                    placeholder={t("senderPlaceholder")}
                    className="modal-input"
                  />
                </div>

                {/* Sender Address */}
                <div className="modal-form-group full-width">
                  <label htmlFor="modal-address" className="modal-label">
                    {t("senderAddress")}
                  </label>
                  <textarea
                    id="modal-address"
                    rows={2}
                    value={newLetterForm.senderAddress}
                    onChange={(e) => setNewLetterForm({ ...newLetterForm, senderAddress: e.target.value })}
                    placeholder="e.g., School address or organization department"
                    className="modal-textarea"
                  />
                </div>

                {/* Letter Date */}
                <div className="modal-form-group">
                  <label htmlFor="modal-letterDate" className="modal-label">
                    {t("letterDate")}
                  </label>
                  <input
                    id="modal-letterDate"
                    type="date"
                    value={newLetterForm.letterDate}
                    onChange={(e) => setNewLetterForm({ ...newLetterForm, letterDate: e.target.value })}
                    className="modal-input"
                  />
                </div>

                {/* Received Date */}
                <div className="modal-form-group">
                  <label htmlFor="modal-receivedDate" className="modal-label">
                    {t("receivedDate")}
                  </label>
                  <input
                    id="modal-receivedDate"
                    type="date"
                    value={newLetterForm.receivedDate}
                    onChange={(e) => setNewLetterForm({ ...newLetterForm, receivedDate: e.target.value })}
                    className="modal-input"
                  />
                </div>

                {/* Subject Description */}
                <div className="modal-form-group full-width">
                  <label htmlFor="modal-subject" className="modal-label">
                    {t("subjectText")} <span className="required-star">*</span>
                  </label>
                  <input
                    id="modal-subject"
                    type="text"
                    required
                    value={newLetterForm.subject}
                    onChange={(e) => setNewLetterForm({ ...newLetterForm, subject: e.target.value })}
                    placeholder={t("subjectPlaceholder")}
                    className="modal-input"
                  />
                </div>

                {/* Priority Selection */}
                <div className="modal-form-group">
                  <label htmlFor="modal-priority" className="modal-label">
                    {t("priority")}
                  </label>
                  <select
                    id="modal-priority"
                    value={newLetterForm.priority}
                    onChange={(e: any) => setNewLetterForm({ ...newLetterForm, priority: e.target.value })}
                    className="modal-select"
                  >
                    <option value="high">{t("priorityHigh")}</option>
                    <option value="medium">{t("priorityMedium")}</option>
                    <option value="low">{t("priorityLow")}</option>
                  </select>
                </div>

                {/* Status Selection */}
                <div className="modal-form-group">
                  <label htmlFor="modal-status" className="modal-label">
                    {t("status")}
                  </label>
                  <select
                    id="modal-status"
                    value={newLetterForm.status}
                    onChange={(e: any) => setNewLetterForm({ ...newLetterForm, status: e.target.value })}
                    className="modal-select"
                  >
                    <option value="registered">{t("statusRegistered")}</option>
                    <option value="assigned">{t("statusAssigned")}</option>
                    <option value="pending">{t("statusPending")}</option>
                  </select>
                </div>

              </div>

              {/* Form Action Buttons */}
              <div className="modal-footer">
                <button type="button" className="btn-modal-cancel" onClick={() => setIsModalOpen(false)}>
                  {t("cancelBtn")}
                </button>
                <button type="submit" className="btn-modal-save">
                  {t("saveBtn")}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ============================================================
         SUCCESS TOAST COMPONENT
         ============================================================ */}
      <div className={`toast-notification${showToast ? " show" : ""}`} role="status" aria-live="polite">
        <svg className="toast-success-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{toastMessage}</span>
      </div>

    </div>
  );
}
