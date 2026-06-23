"use client";

import { useState } from "react";
import Image from "next/image";

const translations = {
  en: {
    subtitle: "Disciplinary Case Management & Monitoring System",
    portalHeading: "Internal Staff Portal",
    portalDesc: "This system is restricted to authorized personnel of the organization. All activity is logged and monitored in accordance with internal policy.",
    warningCreds: "Credentials are confidential — do not share your account.",
    warningAuth: "Unauthorized access is prohibited and subject to disciplinary action.",
    cardTitle: "Account Access",
    cardSubtitle: "Sign in to your account or register a new one.",
    emailLabel: "E-mail:",
    passwordLabel: "Password :",
    roleLabel: "Role :",
    selectRole: "Select Role",
    roleAdmin: "Administrator",
    roleDailyMail: "Daily mail officer",
    roleSubject: "Subject officer",
    roleInvestigation: "Investigation officer",
    loginBtn: "Login"
  },
  si: {
    subtitle: "විනය නඩු කළමනාකරණ සහ අධීක්ෂණ පද්ධතිය",
    portalHeading: "අභ්‍යන්තර කාර්ය මණ්ඩල ද්වාරය",
    portalDesc: "මෙම පද්ධතිය සංවිධානයේ බලයලත් නිලධාරීන්ට පමණක් සීමා වේ. සියලුම ක්‍රියාකාරකම් අභ්‍යන්තර ප්‍රතිපත්තියට අනුකූලව ලොග් කර නිරීක්ෂණය කරනු ලැබේ.",
    warningCreds: "අක්තපත්‍ර රහස්‍ය වේ — ඔබේ ගිණුම බෙදා නොගන්න.",
    warningAuth: "අනවසර ප්‍රවේශය තහනම් වන අතර විනය ක්‍රියාමාර්ගවලට යටත් වේ.",
    cardTitle: "ගිණුම් ප්‍රවේශය",
    cardSubtitle: "ඔබගේ ගිණුමට ලොග් වන්න හෝ අලුත් එකක් ලියාපදිංචි කරන්න.",
    emailLabel: "විද්‍යුත් තැපෑල:",
    passwordLabel: "මුරපදය :",
    roleLabel: "භූමිකාව :",
    selectRole: "භූමිකාව තෝරන්න",
    roleAdmin: "පරිපාලක",
    roleDailyMail: "දෛනික තැපැල් නිලධාරී",
    roleSubject: "විෂය භාර නිලධාරී",
    roleInvestigation: "විමර්ශන නිලධාරී",
    loginBtn: "ඇතුළු වන්න"
  },
  ta: {
    subtitle: "ஒழுக்காற்று வழக்கு மேலாண்மை மற்றும் கண்காணிப்பு அமைப்பு",
    portalHeading: "உள்வாரி பணியாளர் நுழைவாயில்",
    portalDesc: "இந்த அமைப்பு அமைப்பின் அங்கீகரிக்கப்பட்ட பணியாளர்களுக்கு மட்டுமே வரையறுக்கப்பட்டுள்ளது. அனைத்து செயல்பாடுகளும் உள் கொள்கையின்படி பதிவு செய்யப்பட்டு கண்காணிக்கப்படுகின்றன.",
    warningCreds: "சான்றுகள் ரகசியமானவை — உங்கள் கணக்கைப் பகிர வேண்டாம்.",
    warningAuth: "அங்கீகரிக்கப்படாத அணுகல் தடைசெய்யப்பட்டுள்ளது மற்றும் ஒழுங்கு நடவடிக்கைக்கு உட்பட்டது.",
    cardTitle: "கணக்கு அணுகல்",
    cardSubtitle: "உங்கள் கணக்கில் உள்நுழையவும் அல்லது புதியதை பதிவு செய்யவும்.",
    emailLabel: "மின்னஞ்சல்:",
    passwordLabel: "கடவுச்சொல் :",
    roleLabel: "பதவி :",
    selectRole: "பதவியைத் தேர்ந்தெடுக்கவும்",
    roleAdmin: "நிர்வாகி",
    roleDailyMail: "தினசரி அஞ்சல் அதிகாரி",
    roleSubject: "விடய உத்தியோகத்தர்",
    roleInvestigation: "விசாரணை உத்தியோகத்தர்",
    loginBtn: "உள்நுழைக"
  }
};

export default function Home() {
  const [lang, setLang] = useState<"en" | "si" | "ta">("en");
  const t = translations[lang];

  return (
    <div className="login-page">
      {/* Header Bar */}
      <header className="header">
        <div className="header-logo">
          <Image
            src="/logo.png"
            alt="Ministry of Education Logo"
            width={768}
            height={107}
            className="brand-logo-img"
            priority
          />
        </div>
        <div className="header-title">
          <div className="header-title-sinhala">විනය ශාඛාව</div>
          <div className="header-title-tamil">ஒழுக்காற்றுப் பிரிவு</div>
          <div className="header-title-english">DISCIPLINE BRANCH</div>
        </div>
        <div className="header-lang-selector">
          <button
            type="button"
            className={`lang-btn ${lang === "si" ? "active" : ""}`}
            onClick={() => setLang("si")}
          >
            සිංහල
          </button>
          <button
            type="button"
            className={`lang-btn ${lang === "ta" ? "active" : ""}`}
            onClick={() => setLang("ta")}
          >
            தமிழ்
          </button>
          <button
            type="button"
            className={`lang-btn ${lang === "en" ? "active" : ""}`}
            onClick={() => setLang("en")}
          >
            English
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="main-content">
        <div className="content-grid">

          {/* Left Column - DCMMS branding & Portal Info */}
          <div className="left-panel">
            {/* DCMMS Branding Header */}
            <div className="brand-header">
              <div className="brand-icon-box">
                <Image
                  src="/icon.svg"
                  alt="DCMMS Brand Icon"
                  width={32}
                  height={32}
                  className="brand-icon"
                />
              </div>
              <div className="brand-text">
                <h1 className="brand-title">DCMMS</h1>
                <p className="brand-subtitle">
                  {t.subtitle}
                </p>
              </div>
            </div>

            {/* Internal Staff Portal section */}
            <div className="portal-info">
              <h2 className="portal-heading">{t.portalHeading}</h2>
              <p className="portal-description">
                {t.portalDesc}
              </p>
            </div>

            {/* Warning Notices */}
            <div className="warning-list">
              <div className="warning-item">
                <svg className="warning-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="warning-text">
                  {t.warningCreds}
                </p>
              </div>
              <div className="warning-item">
                <svg className="warning-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="warning-text">
                  {t.warningAuth}
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Account Access Card */}
          <div className="right-panel">
            <div className="login-card">
              {/* Card Header */}
              <div className="card-header">
                <h3 className="card-title">{t.cardTitle}</h3>
                <p className="card-subtitle">
                  {t.cardSubtitle}
                </p>
              </div>

              {/* Form Fields */}
              <form className="login-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    {t.emailLabel}
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
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
                      className="form-select"
                    >
                      <option value="" disabled>{t.selectRole}</option>
                      <option value="admin">{t.roleAdmin}</option>
                      <option value="teacher">{t.roleDailyMail}</option>
                      <option value="parent">{t.roleSubject}</option>
                      <option value="student">{t.roleInvestigation}</option>
                    </select>
                    <div className="select-arrow-container">
                      <svg className="select-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Login Button */}
                <div className="submit-wrapper">
                  <button
                    type="submit"
                    className="btn-login"
                  >
                    {t.loginBtn}
                  </button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
