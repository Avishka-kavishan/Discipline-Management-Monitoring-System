"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
  setIsModalOpen?: (isOpen: boolean) => void;
  handleLogout: (e: React.MouseEvent) => void;
  role?: "admin" | "dailymail" | "subject" | "investigation";
}

interface MenuItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  setIsModalOpen,
  handleLogout,
  role,
}) => {
  const { t } = useTranslation();
  const pathname = usePathname() || "";

  // Auto-detect role from path if not provided explicitly
  const activeRole =
    role ||
    (pathname.includes("/admin")
      ? "admin"
      : pathname.includes("/subject")
        ? "subject"
        : pathname.includes("/investigation")
          ? "investigation"
          : "dailymail");

  // Determine user information based on active role
  let userName = t("welcomeUser");
  let userEmail = t("profileEmail");
  let userInitials = "NS";

  if (activeRole === "admin") {
    userName = t("adminName");
    userEmail = t("adminEmail");
    userInitials = "AR";
  } else if (activeRole === "subject") {
    userName = t("subjectName");
    userEmail = t("subjectEmail");
    userInitials = "KP";
  } else if (activeRole === "investigation") {
    userName = t("investigationName");
    userEmail = t("investigationEmail");
    userInitials = "SS";
  }

  // Quick Action button based on active role
  let quickActionButton = null;
  if (activeRole === "dailymail") {
    quickActionButton = (
      <Link href="/daily-mail/register" className="btn-sidebar-action" style={{ textDecoration: 'none' }}>
        <span className="plus-icon">+</span> {t("newLetterBtn")}
      </Link>
    );
  } else if (activeRole === "admin") {
    quickActionButton = (
      <button className="btn-sidebar-action" onClick={() => alert("Create User functionality coming soon!")}>
        <span className="plus-icon">+</span> Create User
      </button>
    );
  } else if (activeRole === "subject") {
    quickActionButton = (
      <button className="btn-sidebar-action" onClick={() => alert("New Case registration coming soon!")}>
        <span className="plus-icon">+</span> New Case
      </button>
    );
  } else if (activeRole === "investigation") {
    quickActionButton = (
      <button className="btn-sidebar-action" onClick={() => alert("New Inquiry setup coming soon!")}>
        <span className="plus-icon">+</span> New Inquiry
      </button>
    );
  }

  // Navigation menu items list configuration
  const menuItems: Record<"admin" | "dailymail" | "subject" | "investigation", MenuItem[]> = {
    dailymail: [],
    admin: [
      {
        id: "dashboard",
        label: "Dashboard",
        href: `${basePath}/admin`,
        icon: (
          <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
        isActive: pathname.endsWith("/admin"),
      },
      {
        id: "users",
        label: "User Management",
        href: "#",
        icon: (
          <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
        isActive: false,
      },
      {
        id: "settings",
        label: "System Settings",
        href: "#",
        icon: (
          <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        ),
        isActive: false,
      },
      {
        id: "logs",
        label: "Audit Logs",
        href: "#",
        icon: (
          <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        isActive: false,
      },
    ],
    subject: [
      {
        id: "dashboard",
        label: "Dashboard",
        href: `${basePath}/subject`,
        icon: (
          <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
        isActive: pathname.endsWith("/subject"),
      },
      {
        id: "cases",
        label: "Assigned Cases",
        href: "#",
        badge: 3,
        icon: (
          <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        ),
        isActive: false,
      },
      {
        id: "inquiries",
        label: "Inquiries",
        href: "#",
        icon: (
          <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        ),
        isActive: false,
      },
      {
        id: "reports",
        label: "Reports",
        href: "#",
        icon: (
          <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        isActive: false,
      },
    ],
    investigation: [
      {
        id: "dashboard",
        label: "Dashboard",
        href: `${basePath}/investigation`,
        icon: (
          <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        ),
        isActive: pathname.endsWith("/investigation"),
      },
      {
        id: "investigations",
        label: "Investigations",
        href: "#",
        badge: 2,
        icon: (
          <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10.5 8.5V13" />
          </svg>
        ),
        isActive: false,
      },
      {
        id: "evidence",
        label: "Evidence Records",
        href: "#",
        icon: (
          <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 009 15c0-1.18-.91-2.164-2.09-2.201a5.122 5.122 0 00-4.74 2.817m9.886-3m-3-3.75a3 3 0 11-6 0 3 3 0 016 0zM16.5 7.5h3.75m0 0v3.75m0-3.75L16.5 11.25" />
          </svg>
        ),
        isActive: false,
      },
      {
        id: "reports",
        label: "Reports",
        href: "#",
        icon: (
          <svg className="menu-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        ),
        isActive: false,
      },
    ],
  };

  const activeMenuItems = menuItems[activeRole] || menuItems.dailymail;

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
              <Image
                src={`${basePath}/icon.svg`}
                alt="DCMMS Logo"
                width={24}
                height={24}
                priority
              />
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
        {quickActionButton && (
          <div className="sidebar-action-wrapper">
            {quickActionButton}
          </div>
        )}

        {/* Sidebar Menu Navigation Links */}
        <nav className="sidebar-menu" aria-label="Sidebar navigation">
          <ul className="sidebar-menu-list">
            {activeMenuItems.map((item) => (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={item.onClick}
                  className={`sidebar-menu-item ${item.isActive ? "active" : ""}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="badge-count">{item.badge}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer User Info and Logout */}
        <div className="sidebar-footer">
          <div className="user-profile-box">
            <div className="user-avatar-circle">
              <span>{userInitials}</span>
            </div>
            <div className="user-details">
              <span className="user-name">{userName}</span>
              <span className="user-email">{userEmail}</span>
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
