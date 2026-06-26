"use client";

import "../../../i18n";
import "../../daily-mail/daily-mail.css";
import "../../dashboard-common.css";
import "../subject.css";
import "./add-details.css";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Sidebar } from "@/components/Sidebar";
import Link from "next/link";

function CaseDetailsForm() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const caseNoParam = searchParams?.get("caseNo") || "CA/2026/01";

  // Accessibility & language state
  const [fontScale, setFontScale] = useState<"small" | "medium" | "large">("medium");
  const lang = i18n.language;

  // Format date statically to match mockup
  const getFormattedDate = () => {
    const date = new Date("2026-06-23");
    if (lang === "si") {
      return date.toLocaleDateString("si-LK", { day: "numeric", month: "long", year: "numeric" });
    }
    if (lang === "ta") {
      return date.toLocaleDateString("ta-LK", { day: "numeric", month: "long", year: "numeric" });
    }
    return "23 June, 2026";
  };

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
    document.title = `${t("addSubjectDetailsTitle")} | DCMMS`;
  }, [lang, t]);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  // Form States - Left Card ("Add Details")
  const [subjectOfficer, setSubjectOfficer] = useState("");
  const [reportState, setReportState] = useState("");
  const [receivedDate, setReceivedDate] = useState("2026-06-23");
  const [stepTaken, setStepTaken] = useState("");
  const [refNo, setRefNo] = useState(caseNoParam);
  const [fileRelated, setFileRelated] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");

  // Form States - Right Card ("If officer concerned with the Complaint")
  const [isConcerned, setIsConcerned] = useState<"yes" | "no">("no");
  const [officerName, setOfficerName] = useState("");
  const [officerDob, setOfficerDob] = useState("");
  const [officerNic, setOfficerNic] = useState("");
  const [officerPosition, setOfficerPosition] = useState("");
  const [officerApptDate, setOfficerApptDate] = useState("");
  const [officerAddress, setOfficerAddress] = useState("");

  // Pre-populate fields from localStorage if details already exist for this case number
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDetails = localStorage.getItem("dcmms_case_details");
      if (storedDetails) {
        try {
          const detailsMap = JSON.parse(storedDetails);
          const existing = detailsMap[caseNoParam];
          if (existing) {
            setSubjectOfficer(existing.subjectOfficer || "");
            setReportState(existing.reportState || "");
            setReceivedDate(existing.receivedDate || "2026-06-23");
            setStepTaken(existing.stepTaken || "");
            setRefNo(existing.caseNo || caseNoParam);
            setFileRelated(existing.fileRelated || "");
            setSpecialNotes(existing.specialNotes || "");
            setIsConcerned(existing.isConcerned || "no");
            setOfficerName(existing.officerName || "");
            setOfficerDob(existing.officerDob || "");
            setOfficerNic(existing.officerNic || "");
            setOfficerPosition(existing.officerPosition || "");
            setOfficerApptDate(existing.officerApptDate || "");
            setOfficerAddress(existing.officerAddress || "");
          }
        } catch (e) {
          console.error("Failed to parse case details from localStorage", e);
        }
      }
    }
  }, [caseNoParam]);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/");
  };

  // Submit case details form handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!refNo) {
      alert("Reference Number is required.");
      return;
    }

    const caseDetails = {
      caseNo: refNo,
      subjectOfficer,
      reportState,
      receivedDate,
      stepTaken,
      fileRelated,
      specialNotes,
      isConcerned,
      officerName,
      officerDob,
      officerNic,
      officerPosition,
      officerApptDate,
      officerAddress,
    };

    if (typeof window !== "undefined") {
      // Save details map
      const storedDetails = localStorage.getItem("dcmms_case_details") || "{}";
      let detailsMap = {};
      try {
        detailsMap = JSON.parse(storedDetails);
      } catch (err) {
        console.error(err);
      }
      (detailsMap as any)[refNo] = caseDetails;
      localStorage.setItem("dcmms_case_details", JSON.stringify(detailsMap));

      // Update state in main cases list in localStorage if it exists
      const storedCases = localStorage.getItem("dcmms_cases");
      if (storedCases) {
        try {
          const casesList = JSON.parse(storedCases);
          const updatedCases = casesList.map((item: any) => {
            if (item.caseNo === refNo) {
              return {
                ...item,
                status: reportState || item.status, // Update status to report state if selected
              };
            }
            return item;
          });
          localStorage.setItem("dcmms_cases", JSON.stringify(updatedCases));
        } catch (err) {
          console.error(err);
        }
      }
    }

    alert("Case details updated successfully!");
    router.push("/subject");
  };

  // Save as draft handler
  const handleSaveDraft = (e: React.MouseEvent) => {
    e.preventDefault();

    if (!refNo) {
      alert("Please fill in the Reference Number to save as draft.");
      return;
    }

    const draftDetails = {
      caseNo: refNo,
      subjectOfficer,
      reportState: reportState || "Pending",
      receivedDate,
      stepTaken,
      fileRelated,
      specialNotes,
      isConcerned,
      officerName,
      officerDob,
      officerNic,
      officerPosition,
      officerApptDate,
      officerAddress,
      isDraft: true,
    };

    if (typeof window !== "undefined") {
      const storedDetails = localStorage.getItem("dcmms_case_details") || "{}";
      let detailsMap = {};
      try {
        detailsMap = JSON.parse(storedDetails);
      } catch (err) {
        console.error(err);
      }
      (detailsMap as any)[refNo] = draftDetails;
      localStorage.setItem("dcmms_case_details", JSON.stringify(detailsMap));
    }

    alert("Draft saved successfully!");
    router.push("/subject");
  };

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
        role="subject"
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
                <h2 className="dashboard-main-title">Subject Officer</h2>
                <p className="dashboard-main-subtitle">{t("subjectOfficerDesc")}</p>
              </div>
            </div>

            <div className="dashboard-header-right">
              {/* Date display badge */}
              <div className="date-badge">
                <span suppressHydrationWarning>{getFormattedDate()}</span>
                <svg className="date-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
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

          {/* Form container section */}
          <section className="add-details-page-wrapper">
            <div className="add-details-main-card">
              <form onSubmit={handleSubmit}>
                {/* Layout title area */}
                <div className="add-details-header-container">
                  <div className="add-details-header-left">
                    <h1 className="add-details-title">{t("addSubjectDetailsTitle")}</h1>
                    <p className="add-details-subtitle">{t("addSubjectDetailsDesc")}</p>
                  </div>
                  <div className="add-details-header-right-btns">
                    <Link href="/subject" className="btn-back-home">
                      <svg
                        className="btn-back-home-icon"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                      {t("backToHome")}
                    </Link>
                    <button
                      type="button"
                      className="btn-action-draft-top"
                      onClick={handleSaveDraft}
                    >
                      {t("saveAsDraft")}
                    </button>
                  </div>
                </div>

                <div className="add-details-cards-grid">
                {/* ───────────────── Left Card ("Add Details") ───────────────── */}
                <div className="add-details-card">
                  <h2 className="card-title-header">
                    <svg
                      className="card-title-icon"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    {t("addDetails")}
                  </h2>

                  <div className="left-card-form">
                    {/* Subject Officer Select */}
                    <div className="form-field-group field-subject-officer">
                      <label htmlFor="subjectOfficer" className="field-label">
                        {t("subjectOfficerLabel")}
                      </label>
                      <div className="select-wrapper">
                        <select
                          id="subjectOfficer"
                          value={subjectOfficer}
                          onChange={(e) => setSubjectOfficer(e.target.value)}
                          className="field-select"
                        >
                          <option value="">{t("selectRole")}</option>
                          <option value="Kamal Perera">{t("optKamalPerera")}</option>
                          <option value="Suresh Silva">{t("optSureshSilva")}</option>
                          <option value="Aruni Rajapaksha">{t("optAruniRajapaksha")}</option>
                        </select>
                        <div className="select-arrow-container">
                          <svg
                            className="select-arrow-icon"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Report State Select */}
                    <div className="form-field-group field-report-state">
                      <label htmlFor="reportState" className="field-label">
                        {t("reportState")}
                      </label>
                      <div className="select-wrapper">
                        <select
                          id="reportState"
                          value={reportState}
                          onChange={(e) => setReportState(e.target.value)}
                          className="field-select"
                        >
                          <option value="">Choose report state</option>
                          <option value="In Progress">{t("statusInProgress")}</option>
                          <option value="Pending">{t("statusPending")}</option>
                          <option value="Closed">{t("statusClosed")}</option>
                        </select>
                        <div className="select-arrow-container">
                          <svg
                            className="select-arrow-icon"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Received Date */}
                    <div className="form-field-group field-received-date">
                      <label htmlFor="receivedDate" className="field-label">
                        {t("receivedDate")}
                      </label>
                      <div className="input-icon-wrapper">
                        <input
                          id="receivedDate"
                          type="date"
                          value={receivedDate}
                          onChange={(e) => setReceivedDate(e.target.value)}
                          className="field-input input-with-right-icon"
                        />
                        <svg
                          className="input-right-icon"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Step Taken */}
                    <div className="form-field-group field-step-taken">
                      <label htmlFor="stepTaken" className="field-label">
                        {t("stepTaken")}
                      </label>
                      <textarea
                        id="stepTaken"
                        value={stepTaken}
                        onChange={(e) => setStepTaken(e.target.value)}
                        className="field-textarea"
                      />
                    </div>

                    {/* Reference Number */}
                    <div className="form-field-group field-reference-number">
                      <label htmlFor="refNo" className="field-label">
                        {t("refNo")} <span className="required-star">*</span>
                      </label>
                      <input
                        id="refNo"
                        type="text"
                        required
                        value={refNo}
                        onChange={(e) => setRefNo(e.target.value)}
                        className="field-input"
                      />
                    </div>

                    {/* File related to Letter */}
                    <div className="form-field-group field-file-related">
                      <label htmlFor="fileRelated" className="field-label">
                        {t("fileRelatedToLetter")}
                      </label>
                      <input
                        id="fileRelated"
                        type="text"
                        value={fileRelated}
                        onChange={(e) => setFileRelated(e.target.value)}
                        className="field-input"
                      />
                    </div>

                    {/* Special Notes */}
                    <div className="form-field-group field-special-notes">
                      <label htmlFor="specialNotes" className="field-label">
                        {t("specialNotes")}
                      </label>
                      <input
                        id="specialNotes"
                        type="text"
                        value={specialNotes}
                        onChange={(e) => setSpecialNotes(e.target.value)}
                        className="field-input"
                      />
                    </div>
                  </div>
                </div>

                {/* ───────────────── Right Card ("If officer concerned with Complaint") ───────────────── */}
                <div className="add-details-card">
                  <div className="right-card-form">
                    {/* Concern Question and square checkbox-style radios */}
                    <div className="form-field-group">
                      <span className="field-label">{t("officerConcernedQuestion")}</span>
                      <div className="radio-group-container">
                        <label className="radio-option-label">
                          <input
                            type="radio"
                            name="isConcerned"
                            value="yes"
                            checked={isConcerned === "yes"}
                            onChange={() => setIsConcerned("yes")}
                            className="radio-input-square"
                          />
                          {t("yesLabel")}
                        </label>
                        <label className="radio-option-label">
                          <input
                            type="radio"
                            name="isConcerned"
                            value="no"
                            checked={isConcerned === "no"}
                            onChange={() => setIsConcerned("no")}
                            className="radio-input-square"
                          />
                          {t("noLabel")}
                        </label>
                      </div>
                    </div>

                    {/* Name */}
                    <div className="form-field-group">
                      <label htmlFor="officerName" className="field-label">
                        {t("concernedName")}
                      </label>
                      <input
                        id="officerName"
                        type="text"
                        value={officerName}
                        onChange={(e) => setOfficerName(e.target.value)}
                        className="field-input"
                      />
                    </div>

                    {/* Date of Birth and NIC Number side-by-side */}
                    <div className="dob-nic-row">
                      <div className="form-field-group">
                        <label htmlFor="officerDob" className="field-label">
                          {t("dateOfBirth")}
                        </label>
                        <div className="input-icon-wrapper">
                          <input
                            id="officerDob"
                            type="date"
                            value={officerDob}
                            onChange={(e) => setOfficerDob(e.target.value)}
                            className="field-input input-with-right-icon"
                          />
                          <svg
                            className="input-right-icon"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="form-field-group">
                        <label htmlFor="officerNic" className="field-label">
                          {t("nicNumber")}
                        </label>
                        <input
                          id="officerNic"
                          type="text"
                          value={officerNic}
                          onChange={(e) => setOfficerNic(e.target.value)}
                          className="field-input"
                        />
                      </div>
                    </div>

                    {/* Position */}
                    <div className="form-field-group">
                      <label htmlFor="officerPosition" className="field-label">
                        {t("positionLabel")}
                      </label>
                      <input
                        id="officerPosition"
                        type="text"
                        value={officerPosition}
                        onChange={(e) => setOfficerPosition(e.target.value)}
                        className="field-input"
                      />
                    </div>

                    {/* Appointment Date */}
                    <div className="form-field-group">
                      <label htmlFor="officerApptDate" className="field-label">
                        {t("appointmentDate")}
                      </label>
                      <div className="input-icon-wrapper">
                        <input
                          id="officerApptDate"
                          type="date"
                          value={officerApptDate}
                          onChange={(e) => setOfficerApptDate(e.target.value)}
                          className="field-input input-with-right-icon"
                        />
                        <svg
                          className="input-right-icon"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="form-field-group">
                      <label htmlFor="officerAddress" className="field-label">
                        {t("addressLabel")}
                      </label>
                      <input
                        id="officerAddress"
                        type="text"
                        value={officerAddress}
                        onChange={(e) => setOfficerAddress(e.target.value)}
                        className="field-input"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="add-details-form-actions">
                <button
                  type="button"
                  className="btn-action-cancel"
                  onClick={() => router.push("/subject")}
                >
                  {t("cancelBtn")}
                </button>
                <button
                  type="submit"
                  className="btn-action-submit"
                >
                  {t("submitBtn")}
                </button>
              </div>
            </form>
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

export default function AddCaseDetailsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CaseDetailsForm />
    </Suspense>
  );
}
