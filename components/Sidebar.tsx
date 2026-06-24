"use client";

import React from "react";
import { useTranslation } from "react-i18next";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  handleLogout: (e: React.MouseEvent) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  setIsModalOpen,
  handleLogout,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Backdrop overlay for viewport */}
      {isSidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setIsSidebarOpen(false)} />
      )}

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
    </>
  );
};
