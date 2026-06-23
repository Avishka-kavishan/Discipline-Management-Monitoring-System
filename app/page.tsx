import Image from "next/image";

export default function Home() {
  return (
    <div className="login-page">
      {/* Header Bar */}
      <header className="header">
        <div className="header-logo">
          <Image
            src="/logo.png"
            alt="Ministry of Education Logo"
            width={320}
            height={70}
            className="h-12 w-auto object-contain"
            priority
          />
        </div>
        <div className="header-title">
          DEPARTMENT OF DISCIPLINE
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
                  Disciplinary Case Management & Monitoring System
                </p>
              </div>
            </div>

            {/* Internal Staff Portal section */}
            <div className="portal-info">
              <h2 className="portal-heading">Internal Staff Portal</h2>
              <p className="portal-description">
                This system is restricted to authorized personnel of the organization. All activity is logged and monitored in accordance with internal policy.
              </p>
            </div>

            {/* Warning Notices */}
            <div className="warning-list">
              <div className="warning-item">
                <svg className="warning-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="warning-text">
                  Credentials are confidential — do not share your account.
                </p>
              </div>
              <div className="warning-item">
                <svg className="warning-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <p className="warning-text">
                  Unauthorized access is prohibited and subject to disciplinary action.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Account Access Card */}
          <div className="right-panel">
            <div className="login-card">
              {/* Card Header */}
              <div className="card-header">
                <h3 className="card-title">Account Access</h3>
                <p className="card-subtitle">
                  Sign in to your account or register a new one.
                </p>
              </div>

              {/* Form Fields */}
              <form className="login-form">
                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    E-mail:
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
                    Password :
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
                    Role :
                  </label>
                  <div className="select-wrapper">
                    <select
                      id="role"
                      name="role"
                      required
                      defaultValue=""
                      className="form-select"
                    >
                      <option value="" disabled>Select Role</option>
                      <option value="admin">Administrator</option>
                      <option value="teacher">Teacher</option>
                      <option value="parent">Parent</option>
                      <option value="student">Student</option>
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
                    Login
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
