"use client";

import "../../i18n";
import "../daily-mail/daily-mail.css";
import "../dashboard-common.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Sidebar } from "@/components/Sidebar";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
}

export default function AdminPage() {
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
    document.title = `${t("adminDashboardTitle")} | DCMMS`;
  }, [lang, t]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // User management mock data state
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Aruni Rajapaksha",
      email: "arunirajapaksha@gmail.com",
      role: t("roleAdmin"),
      status: "Active",
    },
    {
      id: "2",
      name: "Nathasha Sathsarani",
      email: "nathashasathsarani209@gmail.com",
      role: t("roleDailyMail"),
      status: "Active",
    },
    {
      id: "3",
      name: "Kamal Perera",
      email: "kamalperera@gmail.com",
      role: t("roleSubject"),
      status: "Active",
    },
    {
      id: "4",
      name: "Suresh Silva",
      email: "sureshsilva@gmail.com",
      role: t("roleInvestigation"),
      status: "Active",
    },
  ]);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Log out handler
  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/");
  };

  // Filter users list in real-time
  const filteredUsers = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="dashboard-container" data-font-scale={fontScale}>
      {/* ── Skip Link (A11y) ── */}
      <a href="#dashboard-main-content" className="skip-link">
        {t("skipLink")}
      </a>

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
        role="admin"
      />

      {/* ── Layout Grid Wrapper ── */}
      <div className="dashboard-layout">
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
                  {new Date("2026-06-24").toLocaleDateString(
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
            <h3 className="greeting-text">{t("goodMorningAdmin")}</h3>
          </section>

          {/* Stats section */}
          <section className="dashboard-stats-grid">
            <div className="hero-action-card">
              <h4>Total Users</h4>
              <p>{users.length}</p>
            </div>
            <div className="hero-action-card">
              <h4>System Status</h4>
              <p className="val-success">Operational</p>
            </div>
            <div className="hero-action-card">
              <h4>Active Sessions</h4>
              <p>1</p>
            </div>
            <div className="hero-action-card">
              <h4>Error Logs</h4>
              <p>0</p>
            </div>
          </section>

          {/* ── User Management Section ── */}
          <section className="letters-list-section">
            {/* Header Filter Panel */}
            <div className="letters-list-header">
              <h3 className="section-title">User Accounts</h3>

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
                    placeholder="Search users..."
                    className="search-input"
                  />
                </div>
              </div>
            </div>

            {/* users listing table */}
            <div className="table-responsive-container">
              <table className="letters-data-table">
                <thead>
                  <tr>
                    <th scope="col">User Name</th>
                    <th scope="col">E-mail Address</th>
                    <th scope="col">Role</th>
                    <th scope="col">Status</th>
                    <th scope="col" className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
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
                              alert(`User Details:\nName: ${user.name}\nEmail: ${user.email}\nRole: ${user.role}`);
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
                      <td colSpan={5} className="text-center py-4 text-muted">
                        No users found matching search
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
