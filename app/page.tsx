"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

/* ============================================================
   TRANSLATIONS (trilingual — LGWS 4.0)
   ============================================================ */
const translations = {
  en: {
    subtitle: "Disciplinary Case Management & Monitoring System",
    portalHeading: "Internal Staff Portal",
    portalDesc:
      "This system is restricted to authorized personnel of the organization. All activity is logged and monitored in accordance with internal policy.",
    warningCreds:
      "Credentials are confidential — do not share your account.",
    warningAuth:
      "Unauthorized access is prohibited and subject to disciplinary action.",
    cardTitle: "Account Access",
    cardSubtitle: "Sign in to your account or register a new one.",
    emailLabel: "E-mail:",
    passwordLabel: "Password:",
    roleLabel: "Role:",
    selectRole: "Select Role",
    roleAdmin: "Administrator",
    roleDailyMail: "Daily mail officer",
    roleSubject: "Subject officer",
    roleInvestigation: "Investigation officer",
    loginBtn: "Login",
    footerText:
      "© 2026 Ministry of Education, Sri Lanka. All rights reserved.",
    skipLink: "Skip to main content",
    fontSmall: "Decrease font size",
    fontMedium: "Reset font size",
    fontLarge: "Increase font size",
    docTitle:
      "Login | Disciplinary Case Management & Monitoring System",
  },
  si: {
    subtitle: "විනය නඩු කළමනාකරණ සහ අධීක්ෂණ පද්ධතිය",
    portalHeading: "අභ්‍යන්තර කාර්ය මණ්ඩල ද්වාරය",
    portalDesc:
      "මෙම පද්ධතිය සංවිධානයේ බලයලත් නිලධාරීන්ට පමණක් සීමා වේ. සියලුම ක්‍රියාකාරකම් අභ්‍යන්තර ප්‍රතිපත්තියට අනුකූලව ලොග් කර නිරීක්ෂණය කරනු ලැබේ.",
    warningCreds:
      "අක්තපත්‍ර රහස්‍ය වේ — ඔබේ ගිණුම බෙදා නොගන්න.",
    warningAuth:
      "අනවසර ප්‍රවේශය තහනම් වන අතර විනය ක්‍රියාමාර්ගවලට යටත් වේ.",
    cardTitle: "ගිණුම් ප්‍රවේශය",
    cardSubtitle:
      "ඔබගේ ගිණුමට ලොග් වන්න හෝ අලුත් එකක් ලියාපදිංචි කරන්න.",
    emailLabel: "විද්‍යුත් තැපෑල:",
    passwordLabel: "මුරපදය:",
    roleLabel: "භූමිකාව:",
    selectRole: "භූමිකාව තෝරන්න",
    roleAdmin: "පරිපාලක",
    roleDailyMail: "දෛනික තැපැල් නිලධාරී",
    roleSubject: "විෂය භාර නිලධාරී",
    roleInvestigation: "විමර්ශන නිලධාරී",
    loginBtn: "ඇතුළු වන්න",
    footerText:
      "© 2026 අධ්‍යාපන අමාත්‍යාංශය, ශ්‍රී ලංකාව. සියලුම හිමිකම් ඇවිරිණි.",
    skipLink: "ප්‍රධාන අන්තර්ගතයට යන්න",
    fontSmall: "අකුරු ප්‍රමාණය අඩු කරන්න",
    fontMedium: "අකුරු ප්‍රමාණය යළි සකසන්න",
    fontLarge: "අකුරු ප්‍රමාණය වැඩි කරන්න",
    docTitle: "ඇතුළු වීම | විනය නඩු කළමනාකරණ සහ අධීක්ෂණ පද්ධතිය",
  },
  ta: {
    subtitle:
      "ஒழுக்காற்று வழக்கு மேலாண்மை மற்றும் கண்காணிப்பு அமைப்பு",
    portalHeading: "உள்வாரி பணியாளர் நுழைவாயில்",
    portalDesc:
      "இந்த அமைப்பு அமைப்பின் அங்கீகரிக்கப்பட்ட பணியாளர்களுக்கு மட்டுமே வரையறுக்கப்பட்டுள்ளது. அனைத்து செயல்பாடுகளும் உள் கொள்கையின்படி பதிவு செய்யப்பட்டு கண்காணிக்கப்படுகின்றன.",
    warningCreds:
      "சான்றுகள் ரகசியமானவை — உங்கள் கணக்கைப் பகிர வேண்டாம்.",
    warningAuth:
      "அங்கீகரிக்கப்படாத அணுகல் தடைசெய்யப்பட்டுள்ளது மற்றும் ஒழுங்கு நடவடிக்கைக்கு உட்பட்டது.",
    cardTitle: "கணக்கு அணுகல்",
    cardSubtitle:
      "உங்கள் கணக்கில் உள்நுழையவும் அல்லது புதியதை பதிவு செய்யவும்.",
    emailLabel: "மின்னஞ்சல்:",
    passwordLabel: "கடவுச்சொல்:",
    roleLabel: "பதவி:",
    selectRole: "பதவியைத் தேர்ந்தெடுக்கவும்",
    roleAdmin: "நிர்வாகி",
    roleDailyMail: "தினசரி அஞ்சல் அதிகாரி",
    roleSubject: "விடய உத்தியோகத்தர்",
    roleInvestigation: "விசாரணை உத்தியோகத்தர்",
    loginBtn: "உள்நுழைக",
    footerText:
      "© 2026 கல்வி அமைச்சு, இலங்கை. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.",
    skipLink: "முதன்மை உள்ளடக்கத்திற்கு செல்லவும்",
    fontSmall: "எழுத்து அளவை குறைக்கவும்",
    fontMedium: "எழுத்து அளவை மீட்டமைக்கவும்",
    fontLarge: "எழுத்து அளவை அதிகரிக்கவும்",
    docTitle:
      "உள்நுழைவு | ஒழுக்காற்று வழக்கு மேலாண்மை மற்றும் கண்காணிப்பு அமைப்பு",
  },
};

/* Font scale map — LGWS 4.0 mandates at least 3 sizes */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function Home() {
  const [lang, setLang] = useState<"en" | "si" | "ta">("en");
  const [fontScale, setFontScale] = useState<"small" | "medium" | "large">(
    "medium"
  );
  const t = translations[lang];

  /* Sync html[lang] and document.title with active language */
  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = t.docTitle;
  }, [lang, t.docTitle]);

  return (
    <div
      className="login-page"
      data-font-scale={fontScale}
    >
      {/* ── Skip Navigation Link (WCAG 2.4.1) ─────────────── */}
      <a href="#main-content" className="skip-link">
        {t.skipLink}
      </a>

      {/* ── Header Bar ──────────────────────────────────────── */}
      <header className="header">
        {/* Logo */}
        <div className="header-logo">
          <Image
            src={`${basePath}/logo.png`}
            alt="Ministry of Education, Sri Lanka — Official Logo"
            width={768}
            height={107}
            className="brand-logo-img"
            priority
          />
        </div>

        {/* Trilingual Title */}
        <div className="header-title" role="banner">
          <div className="header-title-sinhala" lang="si">
            විනය ශාඛාව
          </div>
          <div className="header-title-tamil" lang="ta">
            ஒழுக்காற்றுப் பிரிவு
          </div>
          <div className="header-title-english" lang="en">
            DISCIPLINE BRANCH
          </div>
        </div>

        {/* Accessibility Controls Bar */}
        <div
          className="header-controls-bar"
          role="group"
          aria-label="Accessibility controls"
        >
          {/* Font Size Adjuster (LGWS 4.0 requirement) */}
          <div
            className="controls-group"
            role="radiogroup"
            aria-label="Font size"
          >
            <label
              className={`size-btn size-btn-small${
                fontScale === "small" ? " active" : ""
              }`}
            >
              <input
                type="radio"
                name="fontScale"
                value="small"
                checked={fontScale === "small"}
                onChange={() => setFontScale("small")}
                aria-label={t.fontSmall}
                className="sr-only"
              />
              A
            </label>
            <label
              className={`size-btn size-btn-medium${
                fontScale === "medium" ? " active" : ""
              }`}
            >
              <input
                type="radio"
                name="fontScale"
                value="medium"
                checked={fontScale === "medium"}
                onChange={() => setFontScale("medium")}
                aria-label={t.fontMedium}
                className="sr-only"
              />
              A
            </label>
            <label
              className={`size-btn size-btn-large${
                fontScale === "large" ? " active" : ""
              }`}
            >
              <input
                type="radio"
                name="fontScale"
                value="large"
                checked={fontScale === "large"}
                onChange={() => setFontScale("large")}
                aria-label={t.fontLarge}
                className="sr-only"
              />
              A
            </label>
          </div>

          <div className="controls-divider" aria-hidden="true" />

          {/* Language Switcher (LGWS 4.0 — trilingual) */}
          <div
            className="header-lang-selector"
            role="radiogroup"
            aria-label="Language selector"
          >
            <label
              className={`lang-btn${lang === "si" ? " active" : ""}`}
              lang="si"
            >
              <input
                type="radio"
                name="language"
                value="si"
                checked={lang === "si"}
                onChange={() => setLang("si")}
                aria-label="Switch language to Sinhala"
                className="sr-only"
              />
              සිංහල
            </label>
            <label
              className={`lang-btn${lang === "ta" ? " active" : ""}`}
              lang="ta"
            >
              <input
                type="radio"
                name="language"
                value="ta"
                checked={lang === "ta"}
                onChange={() => setLang("ta")}
                aria-label="Switch language to Tamil"
                className="sr-only"
              />
              தமிழ்
            </label>
            <label
              className={`lang-btn${lang === "en" ? " active" : ""}`}
              lang="en"
            >
              <input
                type="radio"
                name="language"
                value="en"
                checked={lang === "en"}
                onChange={() => setLang("en")}
                aria-label="Switch language to English"
                className="sr-only"
              />
              English
            </label>
          </div>
        </div>
      </header>

      {/* ── Main Body ───────────────────────────────────────── */}
      <main id="main-content" className="main-content">
        <div className="content-grid">

          {/* Left Column — DCMMS Branding & Portal Info */}
          <div className="left-panel">
            {/* DCMMS Branding Header */}
            <div className="brand-header">
              <div className="brand-icon-box" aria-hidden="true">
                <Image
                  src={`${basePath}/icon.svg`}
                  alt=""
                  width={32}
                  height={32}
                  className="brand-icon"
                />
              </div>
              <div className="brand-text">
                <h1 className="brand-title">DCMMS</h1>
                <p className="brand-subtitle">{t.subtitle}</p>
              </div>
            </div>

            {/* Internal Staff Portal section */}
            <div className="portal-info">
              <h2 className="portal-heading">{t.portalHeading}</h2>
              <p className="portal-description">{t.portalDesc}</p>
            </div>

            {/* Security Warning Notices */}
            <div
              className="warning-list"
              role="note"
              aria-label="Security Warnings"
            >
              <div className="warning-item">
                <svg
                  className="warning-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                <p className="warning-text">{t.warningCreds}</p>
              </div>
              <div className="warning-item">
                <svg
                  className="warning-icon"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <p className="warning-text">{t.warningAuth}</p>
              </div>
            </div>
          </div>

          {/* Right Column — Account Access Card */}
          <div className="right-panel">
            <div className="login-card">
              {/* Card Header */}
              <div className="card-header">
                <h2 className="card-title">{t.cardTitle}</h2>
                <p className="card-subtitle">{t.cardSubtitle}</p>
              </div>

              {/* Login Form */}
              <form className="login-form" noValidate>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    {t.emailLabel}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    aria-required="true"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password" className="form-label">
                    {t.passwordLabel}
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    aria-required="true"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role" className="form-label">
                    {t.roleLabel}
                  </label>
                  <div className="select-wrapper">
                    <select
                      id="role"
                      name="role"
                      required
                      defaultValue=""
                      aria-required="true"
                      className="form-select"
                    >
                      <option value="" disabled>
                        {t.selectRole}
                      </option>
                      <option value="admin">{t.roleAdmin}</option>
                      <option value="dailymail">{t.roleDailyMail}</option>
                      <option value="subject">{t.roleSubject}</option>
                      <option value="investigation">
                        {t.roleInvestigation}
                      </option>
                    </select>
                    <div className="select-arrow-container" aria-hidden="true">
                      <svg
                        className="select-arrow"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Login Button */}
                <div className="submit-wrapper">
                  <button type="submit" className="btn-login">
                    {t.loginBtn}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="footer">
        <p className="footer-text">{t.footerText}</p>
      </footer>
    </div>
  );
}
