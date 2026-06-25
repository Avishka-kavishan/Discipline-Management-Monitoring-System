"use client";

import "../../../i18n";
import "../daily-mail.css";
import "./register.css";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Sidebar } from "@/components/Sidebar";
import Link from "next/link";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function RegisterComplaintPage() {
  const { t, i18n } = useTranslation();
  const router = useRouter();

  // Accessibility & language state
  const [fontScale, setFontScale] = useState<"small" | "medium" | "large">("medium");
  const lang = i18n.language;

  // Mobile sidebar visibility state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Form State
  const [formState, setFormState] = useState({
    letterNo: "",
    senderName: "",
    letterType: "",
    officerName: "",
    subjectCategory: "",
    instituteName: "",
    refNo: "",
    letterDate: "",
    subject: "", // maps to Letter Title
    regionProvince: "" as "region" | "province" | "",
    receivedDate: "",
  });

  // Sync document properties
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = `Register New Complaint | DCMMS`;
  }, [lang]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/");
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Enforce required fields validation
    if (!formState.senderName || !formState.subjectCategory || !formState.refNo) {
      alert("Please fill in all required fields (Reference Number, Name of Sender, and Subject Category).");
      return;
    }

    const newLetter = {
      id: Date.now().toString(),
      refNo: formState.refNo,
      senderName: formState.senderName,
      senderAddress: "N/A", // Default
      letterDate: formState.letterDate || new Date().toISOString().split("T")[0],
      receivedDate: formState.receivedDate || new Date().toISOString().split("T")[0],
      subject: formState.subject || "N/A", // maps to subject / title
      priority: "medium" as const,
      status: "registered" as const,
      // Extra fields captured
      letterNo: formState.letterNo,
      letterType: formState.letterType,
      officerName: formState.officerName,
      subjectCategory: formState.subjectCategory,
      instituteName: formState.instituteName,
      regionProvince: formState.regionProvince,
    };

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dcmms_letters");
      let lettersList = [];
      if (stored) {
        try {
          lettersList = JSON.parse(stored);
        } catch (err) {
          console.error("Failed to parse letters list", err);
        }
      }
      localStorage.setItem("dcmms_letters", JSON.stringify([newLetter, ...lettersList]));
      localStorage.setItem("show_register_success", "true");
    }

    router.push("/daily-mail");
  };

  // Save draft Handler
  const handleSaveDraft = (e: React.MouseEvent) => {
    e.preventDefault();

    // Draft requires at least Reference number to identify it
    if (!formState.refNo) {
      alert("Please fill in the Reference Number to save as draft.");
      return;
    }

    const draftLetter = {
      id: Date.now().toString(),
      refNo: formState.refNo,
      senderName: formState.senderName || "Unknown Sender",
      senderAddress: "N/A",
      letterDate: formState.letterDate || new Date().toISOString().split("T")[0],
      receivedDate: formState.receivedDate || new Date().toISOString().split("T")[0],
      subject: formState.subject || "Draft Complaint",
      priority: "low" as const,
      status: "pending" as const, // drafts are set to pending
      // Extra fields
      letterNo: formState.letterNo,
      letterType: formState.letterType,
      officerName: formState.officerName,
      subjectCategory: formState.subjectCategory,
      instituteName: formState.instituteName,
      regionProvince: formState.regionProvince,
    };

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dcmms_letters");
      let lettersList = [];
      if (stored) {
        try {
          lettersList = JSON.parse(stored);
        } catch (err) {
          console.error("Failed to parse letters list", err);
        }
      }
      localStorage.setItem("dcmms_letters", JSON.stringify([draftLetter, ...lettersList]));
      localStorage.setItem("show_register_success", "true");
    }

    router.push("/daily-mail");
  };

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

  return (
    <div className="dashboard-container" data-font-scale={fontScale}>
      {/* Skip Link (A11y) */}
      <a href="#dashboard-main-content" className="skip-link">
        {t("skipLink")}
      </a>

      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogout={handleLogout}
      />

      <div className="dashboard-layout">
        <main id="dashboard-main-content" className="dashboard-content">
          
          {/* Top App Bar Header */}
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

          {/* Standalone register complaint container */}
          <section className="register-page-wrapper">
            <div className="register-card">
              
              {/* Layout title area */}
              <div className="register-header-container">
                <div className="register-header-left">
                  <h1 className="register-title">Register New Complaint</h1>
                  <p className="register-subtitle">Enter the general details of the received letter.</p>
                </div>
                <Link href="/daily-mail" className="btn-back-home">
                  <svg className="btn-back-home-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Home
                </Link>
              </div>

              {/* Form entries section */}
              <div className="entries-container">
                <h2 className="entries-header">
                  <svg className="entries-header-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Letter Entries
                </h2>

                <form onSubmit={handleSubmit} className="register-grid-form">
                  
                  {/* Column 1 */}
                  <div className="form-field-group">
                    <label htmlFor="letterNo" className="field-label">Letter No.</label>
                    <input
                      id="letterNo"
                      type="text"
                      value={formState.letterNo}
                      onChange={(e) => setFormState({ ...formState, letterNo: e.target.value })}
                      placeholder="Enter letter number"
                      className="field-input"
                    />
                  </div>

                  {/* Column 2 */}
                  <div className="form-field-group">
                    <label htmlFor="senderName" className="field-label">Name of Sender <span className="required-star">*</span></label>
                    <input
                      id="senderName"
                      type="text"
                      required
                      value={formState.senderName}
                      onChange={(e) => setFormState({ ...formState, senderName: e.target.value })}
                      placeholder="Enter sender's name"
                      className="field-input"
                    />
                  </div>

                  {/* Column 3 */}
                  <div className="form-field-group">
                    <label htmlFor="letterType" className="field-label">Letter Type</label>
                    <input
                      id="letterType"
                      type="text"
                      value={formState.letterType}
                      onChange={(e) => setFormState({ ...formState, letterType: e.target.value })}
                      placeholder="Enter letter type"
                      className="field-input"
                    />
                  </div>

                  {/* Row 2 - Column 1 */}
                  <div className="form-field-group">
                    <label htmlFor="officerName" className="field-label">Name of Officer</label>
                    <select
                      id="officerName"
                      value={formState.officerName}
                      onChange={(e) => setFormState({ ...formState, officerName: e.target.value })}
                      className="field-select"
                    >
                      <option value="">Select Officer</option>
                      <option value="Kamal Perera">Kamal Perera (Subject Officer)</option>
                      <option value="Suresh Silva">Suresh Silva (Investigation Officer)</option>
                      <option value="Aruni Rajapaksha">Aruni Rajapaksha (Administrator)</option>
                    </select>
                  </div>

                  {/* Row 2 - Column 2 */}
                  <div className="form-field-group">
                    <label htmlFor="subjectCategory" className="field-label">Subject Category <span className="required-star">*</span></label>
                    <select
                      id="subjectCategory"
                      required
                      value={formState.subjectCategory}
                      onChange={(e) => setFormState({ ...formState, subjectCategory: e.target.value })}
                      className="field-select"
                    >
                      <option value="">Select Category</option>
                      <option value="Student Misconduct">Student Misconduct</option>
                      <option value="Teacher Absenteeism">Teacher Absenteeism</option>
                      <option value="Financial Mismanagement">Financial Mismanagement</option>
                      <option value="Administrative Issues">Administrative Issues</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Row 2 - Column 3 */}
                  <div className="form-field-group">
                    <label htmlFor="instituteName" className="field-label">Institute Name</label>
                    <div className="input-icon-wrapper">
                      <svg className="input-left-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        id="instituteName"
                        type="text"
                        value={formState.instituteName}
                        onChange={(e) => setFormState({ ...formState, instituteName: e.target.value })}
                        placeholder="Search institute name"
                        className="field-input input-with-left-icon"
                      />
                    </div>
                  </div>

                  {/* Row 3 - Column 1 */}
                  <div className="form-field-group">
                    <label htmlFor="refNo" className="field-label">Reference Number <span className="required-star">*</span></label>
                    <input
                      id="refNo"
                      type="text"
                      required
                      value={formState.refNo}
                      onChange={(e) => setFormState({ ...formState, refNo: e.target.value })}
                      placeholder="e.g. DCMMS/2026/001"
                      className="field-input"
                    />
                  </div>

                  {/* Row 3 - Column 2 */}
                  <div className="form-field-group">
                    <label htmlFor="letterDate" className="field-label">Letter Date.</label>
                    <div className="input-icon-wrapper">
                      <input
                        id="letterDate"
                        type="date"
                        value={formState.letterDate}
                        onChange={(e) => setFormState({ ...formState, letterDate: e.target.value })}
                        className="field-input input-with-right-icon"
                      />
                      <svg className="input-right-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  {/* Row 3 - Column 3 (Spans 2 rows) */}
                  <div className="form-field-group grid-row-span-2">
                    <label htmlFor="subject" className="field-label">Letter Title</label>
                    <textarea
                      id="subject"
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      placeholder="Enter letter title"
                      className="field-textarea"
                    />
                  </div>

                  {/* Row 4 - Column 1 */}
                  <div className="form-field-group">
                    <span className="field-label">Region/Province</span>
                    <div className="radio-group-container">
                      <label className="radio-option-label">
                        <input
                          type="radio"
                          name="regionProvince"
                          value="region"
                          checked={formState.regionProvince === "region"}
                          onChange={() => setFormState({ ...formState, regionProvince: "region" })}
                          className="radio-input-styled"
                          aria-label="Region"
                        />
                        Region
                      </label>
                      <label className="radio-option-label">
                        <input
                          type="radio"
                          name="regionProvince"
                          value="province"
                          checked={formState.regionProvince === "province"}
                          onChange={() => setFormState({ ...formState, regionProvince: "province" })}
                          className="radio-input-styled"
                          aria-label="Province"
                        />
                        Province
                      </label>
                    </div>
                  </div>

                  {/* Row 4 - Column 2 */}
                  <div className="form-field-group">
                    <label htmlFor="receivedDate" className="field-label">Received Date</label>
                    <div className="input-icon-wrapper">
                      <input
                        id="receivedDate"
                        type="date"
                        value={formState.receivedDate}
                        onChange={(e) => setFormState({ ...formState, receivedDate: e.target.value })}
                        className="field-input input-with-right-icon"
                      />
                      <svg className="input-right-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  {/* Form Action Buttons */}
                  <div className="register-form-actions">
                    <button
                      type="button"
                      className="btn-action-cancel"
                      onClick={() => router.push("/daily-mail")}
                    >
                      {t("cancelBtn")}
                    </button>
                    <button
                      type="button"
                      className="btn-action-draft"
                      onClick={handleSaveDraft}
                    >
                      Save as draft
                    </button>
                    <button
                      type="submit"
                      className="btn-action-submit"
                    >
                      Submit
                    </button>
                  </div>

                </form>
              </div>

            </div>
          </section>

          {/* Footer Branding Notice */}
          <footer className="dashboard-content-footer">
            <p>{t("footerText")}</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
