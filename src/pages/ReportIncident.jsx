import { useState } from "react";
import { incidentAPI } from "../services/api";

/* =====================================================
   INITIAL FORM
===================================================== */

const INITIAL_FORM = {
  title: "",
  description: "",
  category: "harassment",
  address: "",
  isAnonymous: false,
};

/* =====================================================
   INCIDENT CATEGORIES
===================================================== */

const CATEGORIES = [
  {
    value: "harassment",
    label: "Harassment",
    icon: "⚠️",
  },
  {
    value: "assault",
    label: "Assault",
    icon: "🚨",
  },
  {
    value: "stalking",
    label: "Stalking",
    icon: "👁️",
  },
  {
    value: "theft",
    label: "Theft",
    icon: "🔒",
  },
  {
    value: "other",
    label: "Other",
    icon: "📋",
  },
];

/* =====================================================
   REPORT INCIDENT
===================================================== */

const ReportIncident = () => {
  const [form, setForm] = useState(INITIAL_FORM);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  /* Location states */
  const [locationStatus, setLocationStatus] =
    useState("idle");

  const [coordinates, setCoordinates] =
    useState(null);

  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setError("");
    setMessage("");
  };

  /* =====================================================
     GET CURRENT LOCATION
  ===================================================== */

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(
          new Error(
            "Geolocation is not supported by this browser."
          )
        );
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    });
  };

  /* =====================================================
     USE MY LOCATION
  ===================================================== */

  const handleUseLocation = async () => {
    setLocationStatus("loading");
    setError("");
    setMessage("");

    try {
      const position =
        await getCurrentLocation();

      const lat =
        position.coords.latitude;

      const lng =
        position.coords.longitude;

      setCoordinates({
        lat,
        lng,
      });

      setLocationStatus("success");
    } catch (err) {
      console.error(
        "Unable to detect location:",
        err
      );

      setCoordinates(null);
      setLocationStatus("error");

      if (err?.code === 1) {
        setError(
          "Location permission was denied. Please allow location access in your browser or enter the area manually."
        );
      } else if (err?.code === 2) {
        setError(
          "Your location could not be determined. Please try again."
        );
      } else {
        setError(
          "Unable to detect your location. Please try again."
        );
      }
    }
  };

  /* =====================================================
     GOOGLE MAPS LOCATION
  ===================================================== */

  const openGoogleMaps = () => {
    if (!coordinates) return;

    const url = `https://www.google.com/maps?q=${coordinates.lat},${coordinates.lng}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* =====================================================
     SUBMIT REPORT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    /* ---------------------------------------------
       VALIDATION
    --------------------------------------------- */

    const title = form.title.trim();
    const description =
      form.description.trim();
    const address = form.address.trim();

    if (!title) {
      setError(
        "Please enter a title for the incident."
      );
      setLoading(false);
      return;
    }

    if (title.length < 5) {
      setError(
        "Incident title should contain at least 5 characters."
      );
      setLoading(false);
      return;
    }

    if (!description) {
      setError(
        "Please provide a description of the incident."
      );
      setLoading(false);
      return;
    }

    if (description.length < 20) {
      setError(
        "Please provide a little more detail about what happened."
      );
      setLoading(false);
      return;
    }

    try {
      let lat = coordinates?.lat || null;
      let lng = coordinates?.lng || null;

      /* ---------------------------------------------
         IF LOCATION WAS NOT ALREADY DETECTED,
         TRY ON SUBMIT
      --------------------------------------------- */

      if (!coordinates) {
        setLocationStatus("loading");

        try {
          const position =
            await getCurrentLocation();

          lat =
            position.coords.latitude;

          lng =
            position.coords.longitude;

          setCoordinates({
            lat,
            lng,
          });

          setLocationStatus("success");
        } catch (locationError) {
          console.warn(
            "Location unavailable:",
            locationError
          );

          setLocationStatus(
            "unavailable"
          );
        }
      }

      /* ---------------------------------------------
         SEND REPORT
      --------------------------------------------- */

      await incidentAPI.report({
        title,
        description,
        category: form.category,
        address,
        isAnonymous: form.isAnonymous,
        lat,
        lng,
      });

      /* ---------------------------------------------
         SUCCESS
      --------------------------------------------- */

      setMessage(
        "Incident reported successfully. Thank you for helping keep our community safe."
      );

      setForm(INITIAL_FORM);
      setCoordinates(null);
      setLocationStatus("idle");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.error(
        "Incident report failed:",
        err
      );

      setError(
        err?.response?.data?.message ||
          "Unable to submit the incident report. Please try again."
      );

      setLocationStatus("idle");
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     DESCRIPTION PROGRESS
  ===================================================== */

  const descriptionLength =
    form.description.length;

  const descriptionPercentage =
    Math.min(
      (descriptionLength / 1500) * 100,
      100
    );

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="report-incident-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="report-hero">

        <div className="report-hero-content">

          <span className="section-label">
            COMMUNITY SAFETY
          </span>

          <h1 className="page-title">
            Report an Incident
          </h1>

          <p className="page-description">
            Help make your community safer by
            reporting incidents, unsafe
            situations, or suspicious
            activities. Your report can help
            identify safety concerns and
            protect others.
          </p>

          <div className="report-badges">

            <span>
              🛡️ Community Protection
            </span>

            <span>
              🔒 Privacy Aware
            </span>

            <span>
              📍 Location Support
            </span>

          </div>

        </div>

        <div className="report-hero-visual">

          <div className="hero-shield">
            🛡️
          </div>

          <strong>
            Your Report Matters
          </strong>

          <span>
            Speak up. Stay safe.
          </span>

        </div>

      </div>

      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {message && (
        <div
          className="report-alert success-alert"
          role="alert"
        >
          <div className="alert-icon">
            ✓
          </div>

          <div>
            <strong>
              Report Submitted
            </strong>

            <p>
              {message}
            </p>
          </div>
        </div>
      )}

      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && (
        <div
          className="report-alert error-alert"
          role="alert"
        >
          <div className="alert-icon">
            ⚠️
          </div>

          <div>
            <strong>
              Please check the following
            </strong>

            <p>
              {error}
            </p>
          </div>
        </div>
      )}

      {/* =================================================
          EMERGENCY WARNING
      ================================================= */}

      <div className="emergency-banner">

        <div className="emergency-icon">
          🚨
        </div>

        <div className="emergency-content">

          <strong>
            Are you in immediate danger?
          </strong>

          <p>
            This report form is not a
            replacement for emergency
            assistance. If you are in immediate
            danger in India, call{" "}
            <strong>112</strong> or use the
            ShaktiShield SOS feature.
          </p>

        </div>

        <a
          href="tel:112"
          className="emergency-call"
        >
          📞 Call 112
        </a>

      </div>

      {/* =================================================
          FORM
      ================================================= */}

      <div className="report-layout">

        <div className="card report-form-card">

          <div className="form-heading">

            <div>
              <span className="section-label">
                INCIDENT REPORT
              </span>

              <h2>
                Incident Details
              </h2>

              <p>
                Provide as much accurate
                information as you can.
              </p>
            </div>

            <div className="form-number">
              01
            </div>

          </div>

          <form onSubmit={handleSubmit}>

            {/* =========================================
                TITLE
            ========================================= */}

            <div className="form-group">

              <label htmlFor="incident-title">
                Incident Title *
              </label>

              <input
                id="incident-title"
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Harassment near bus stop"
                maxLength={100}
                required
              />

              <div className="field-meta">

                <span>
                  Give your report a short,
                  descriptive title.
                </span>

                <span>
                  {form.title.length}/100
                </span>

              </div>

            </div>

            {/* =========================================
                CATEGORY
            ========================================= */}

            <div className="form-group">

              <label>
                What type of incident was it? *
              </label>

              <div className="category-grid">

                {CATEGORIES.map(
                  (item) => (
                    <button
                      key={item.value}
                      type="button"
                      className={`category-card ${
                        form.category ===
                        item.value
                          ? "selected"
                          : ""
                      }`}
                      onClick={() =>
                        setForm(
                          (prev) => ({
                            ...prev,
                            category:
                              item.value,
                          })
                        )
                      }
                    >

                      <span>
                        {item.icon}
                      </span>

                      <strong>
                        {item.label}
                      </strong>

                    </button>
                  )
                )}

              </div>

            </div>

            {/* =========================================
                DESCRIPTION
            ========================================= */}

            <div className="form-group">

              <label htmlFor="incident-description">
                What Happened? *
              </label>

              <textarea
                id="incident-description"
                name="description"
                rows={7}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe what happened, when it happened, and any important details..."
                maxLength={1500}
                required
              />

              <div className="character-section">

                <div className="character-bar">

                  <div
                    style={{
                      width: `${descriptionPercentage}%`,
                    }}
                  />

                </div>

                <div className="field-meta">

                  <span>
                    Avoid unnecessary personal
                    information.
                  </span>

                  <span>
                    {descriptionLength}/1500
                  </span>

                </div>

              </div>

            </div>

            {/* =========================================
                ADDRESS
            ========================================= */}

            <div className="form-group">

              <label htmlFor="incident-address">
                Location / Address
              </label>

              <input
                id="incident-address"
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Street, landmark, area or nearby place"
                maxLength={250}
              />

              <small className="help-text">
                You can enter a nearby landmark,
                street, or general area.
              </small>

            </div>

            {/* =========================================
                GPS LOCATION
            ========================================= */}

            <div className="location-box">

              <div className="location-box-header">

                <div className="location-icon">
                  📍
                </div>

                <div>
                  <h3>
                    Incident Location
                  </h3>

                  <p>
                    Attach your current GPS
                    location to this report.
                  </p>
                </div>

              </div>

              <button
                type="button"
                className="location-button"
                onClick={
                  handleUseLocation
                }
                disabled={
                  locationStatus ===
                  "loading"
                }
              >

                {locationStatus ===
                "loading"
                  ? "📍 Detecting Location..."
                  : coordinates
                  ? "✓ Location Detected"
                  : "📍 Use My Current Location"}

              </button>

              {/* LOCATION SUCCESS */}

              {coordinates && (
                <div className="location-result">

                  <div className="location-success">
                    <span>
                      ✓
                    </span>

                    <strong>
                      GPS location attached
                    </strong>
                  </div>

                  <div className="coordinates">

                    <div>
                      <small>
                        Latitude
                      </small>

                      <strong>
                        {coordinates.lat.toFixed(
                          6
                        )}
                      </strong>
                    </div>

                    <div>
                      <small>
                        Longitude
                      </small>

                      <strong>
                        {coordinates.lng.toFixed(
                          6
                        )}
                      </strong>
                    </div>

                  </div>

                  <button
                    type="button"
                    className="maps-button"
                    onClick={
                      openGoogleMaps
                    }
                  >
                    🗺️ Open Location in Google
                    Maps →
                  </button>

                </div>
              )}

              {/* LOCATION ERROR */}

              {locationStatus ===
                "error" && (
                <div className="location-error">
                  ⚠️ Unable to detect your
                  location. Please check your
                  browser location permission.
                </div>
              )}

              {locationStatus ===
                "unavailable" && (
                <div className="location-warning">
                  📍 GPS location was not
                  available. Your report can
                  still be submitted using the
                  address above.
                </div>
              )}

            </div>

            {/* =========================================
                ANONYMOUS
            ========================================= */}

            <div className="anonymous-box">

              <label className="anonymous-label">

                <input
                  type="checkbox"
                  name="isAnonymous"
                  checked={
                    form.isAnonymous
                  }
                  onChange={handleChange}
                />

                <span className="custom-check">
                  {form.isAnonymous
                    ? "✓"
                    : ""}
                </span>

                <span>

                  <strong>
                    Submit anonymously
                  </strong>

                  <small>
                    Your identity will not be
                    displayed as the reporter
                    of this incident.
                  </small>

                </span>

              </label>

            </div>

            {/* =========================================
                PRIVACY
            ========================================= */}

            <div className="privacy-box">

              <span>
                🔒
              </span>

              <p>
                Please do not include passwords,
                OTPs, financial information,
                or other highly sensitive
                personal information in your
                report.
              </p>

            </div>

            {/* =========================================
                SUBMIT
            ========================================= */}

            <button
              type="submit"
              className="submit-report-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="loading-spinner" />
                  Submitting Report...
                </>
              ) : (
                <>
                  🚨 Submit Incident Report
                </>
              )}

            </button>

          </form>

        </div>

        {/* =================================================
            SIDE INFORMATION
        ================================================= */}

        <aside className="report-sidebar">

          <div className="sidebar-card">

            <div className="sidebar-icon">
              🛡️
            </div>

            <h3>
              Why Report?
            </h3>

            <p>
              Your information can help identify
              unsafe areas and improve awareness
              within the community.
            </p>

            <div className="sidebar-points">

              <div>
                <span>✓</span>
                Identify safety concerns
              </div>

              <div>
                <span>✓</span>
                Help others stay aware
              </div>

              <div>
                <span>✓</span>
                Build community awareness
              </div>

            </div>

          </div>

          <div className="sidebar-card purple-card">

            <div className="sidebar-icon">
              📍
            </div>

            <h3>
              Location Privacy
            </h3>

            <p>
              GPS coordinates are only attached
              when your browser provides your
              current location.
            </p>

            <div className="privacy-mini">
              🔒 Location-aware reporting
            </div>

          </div>

          <div className="sidebar-card emergency-side">

            <div className="sidebar-icon">
              🚨
            </div>

            <h3>
              Need Immediate Help?
            </h3>

            <p>
              Do not wait for an incident report
              if you are currently in danger.
            </p>

            <a
              href="tel:112"
              className="sidebar-emergency-button"
            >
              📞 Call Emergency 112
            </a>

          </div>

        </aside>

      </div>

      {/* =================================================
          FOOTER NOTICE
      ================================================= */}

      <div className="report-footer-notice">

        <span>
          🛡️
        </span>

        <div>

          <strong>
            Report responsibly
          </strong>

          <p>
            Please provide truthful and accurate
            information. Do not submit reports
            intended to harass, threaten, or
            falsely accuse another person.
          </p>

        </div>

      </div>

      {/* =================================================
          PAGE CSS
      ================================================= */}

      <style>{`

        /* ================================================
           PAGE
        ================================================ */

        .report-incident-page {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding-bottom: 40px;
        }

        /* ================================================
           HERO
        ================================================ */

        .report-hero {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 35px;
          align-items: center;
          margin-bottom: 30px;
        }

        .report-hero-content {
          padding: 10px 0;
        }

        .report-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 20px;
        }

        .report-badges span {
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(124, 58, 237, 0.08);
          color: var(--primary, #7c3aed);
          font-size: 12px;
          font-weight: 700;
        }

        .report-hero-visual {
          min-height: 260px;
          border-radius: 24px;
          background:
            linear-gradient(
              145deg,
              #7c3aed,
              #4c1d95
            );
          color: white;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 30px;
          box-sizing: border-box;
          box-shadow:
            0 20px 45px
            rgba(76, 29, 149, 0.22);
        }

        .hero-shield {
          width: 82px;
          height: 82px;
          border-radius: 24px;
          display: grid;
          place-items: center;
          background: rgba(255,255,255,0.15);
          font-size: 42px;
          margin-bottom: 18px;
          box-shadow:
            0 10px 30px
            rgba(0,0,0,0.15);
        }

        .report-hero-visual strong {
          font-size: 23px;
          margin-bottom: 6px;
        }

        .report-hero-visual > span {
          opacity: 0.85;
          font-size: 14px;
        }

        /* ================================================
           ALERTS
        ================================================ */

        .report-alert {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          padding: 15px 18px;
          border-radius: 14px;
          margin-bottom: 18px;
        }

        .report-alert p {
          margin: 4px 0 0;
          font-size: 13px;
          line-height: 1.5;
        }

        .success-alert {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #065f46;
        }

        .error-alert {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
        }

        .alert-icon {
          font-size: 19px;
          flex-shrink: 0;
        }

        /* ================================================
           EMERGENCY BANNER
        ================================================ */

        .emergency-banner {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 16px 18px;
          margin-bottom: 25px;
          border-radius: 16px;
          background:
            linear-gradient(
              135deg,
              #fff7ed,
              #fff
            );
          border: 1px solid
            rgba(245, 158, 11, 0.28);
        }

        .emergency-icon {
          width: 48px;
          height: 48px;
          flex-shrink: 0;
          border-radius: 13px;
          display: grid;
          place-items: center;
          background: #ffedd5;
          font-size: 23px;
        }

        .emergency-content {
          flex: 1;
        }

        .emergency-content strong {
          color: #9a3412;
        }

        .emergency-content p {
          margin: 4px 0 0;
          color: #78716c;
          font-size: 13px;
          line-height: 1.5;
        }

        .emergency-call {
          text-decoration: none;
          white-space: nowrap;
          padding: 10px 15px;
          border-radius: 10px;
          background: #dc2626;
          color: white;
          font-size: 13px;
          font-weight: 800;
        }

        .emergency-call:hover {
          background: #b91c1c;
        }

        /* ================================================
           MAIN LAYOUT
        ================================================ */

        .report-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 300px;
          gap: 25px;
          align-items: start;
        }

        .report-form-card {
          padding: 30px;
        }

        /* ================================================
           FORM HEADER
        ================================================ */

        .form-heading {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 15px;
          padding-bottom: 20px;
          margin-bottom: 25px;
          border-bottom:
            1px solid var(--border, #e5e7eb);
        }

        .form-heading h2 {
          margin: 7px 0 4px;
          font-size: 23px;
        }

        .form-heading p {
          margin: 0;
          color: var(--text-muted);
          font-size: 13px;
        }

        .form-number {
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: rgba(124, 58, 237, 0.09);
          color: var(--primary, #7c3aed);
          font-weight: 900;
          font-size: 13px;
        }

        /* ================================================
           FORM
        ================================================ */

        .form-group {
          margin-bottom: 24px;
        }

        .form-group label {
          display: block;
          margin-bottom: 8px;
          font-weight: 750;
          font-size: 14px;
        }

        .form-group input:not([type="checkbox"]),
        .form-group textarea {
          width: 100%;
          box-sizing: border-box;
          border: 1px solid
            var(--border, #d1d5db);
          border-radius: 12px;
          padding: 13px 14px;
          outline: none;
          background: white;
          color: #1e293b;
          font-size: 14px;
          transition: 0.2s;
        }

        .form-group input:not([type="checkbox"]):focus,
        .form-group textarea:focus {
          border-color:
            var(--primary, #7c3aed);
          box-shadow:
            0 0 0 3px
            rgba(124,58,237,0.09);
        }

        .form-group textarea {
          resize: vertical;
          min-height: 150px;
          line-height: 1.6;
        }

        .field-meta {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          margin-top: 6px;
          color: var(--text-muted);
          font-size: 11px;
        }

        .help-text {
          display: block;
          margin-top: 6px;
          color: var(--text-muted);
          font-size: 11px;
        }

        /* ================================================
           CATEGORY
        ================================================ */

        .category-grid {
          display: grid;
          grid-template-columns:
            repeat(5, minmax(0, 1fr));
          gap: 8px;
        }

        .category-card {
          min-height: 85px;
          border: 1px solid
            var(--border, #e5e7eb);
          border-radius: 12px;
          background: white;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 7px;
          color: #334155;
          transition: 0.2s;
        }

        .category-card span {
          font-size: 22px;
        }

        .category-card strong {
          font-size: 11px;
        }

        .category-card:hover {
          transform: translateY(-2px);
          border-color:
            rgba(124,58,237,0.4);
        }

        .category-card.selected {
          border-color:
            var(--primary, #7c3aed);
          background:
            rgba(124,58,237,0.07);
          color:
            var(--primary, #7c3aed);
          box-shadow:
            0 5px 15px
            rgba(124,58,237,0.08);
        }

        /* ================================================
           DESCRIPTION BAR
        ================================================ */

        .character-section {
          margin-top: 6px;
        }

        .character-bar {
          height: 3px;
          width: 100%;
          background: #e5e7eb;
          border-radius: 10px;
          overflow: hidden;
        }

        .character-bar div {
          height: 100%;
          background:
            var(--primary, #7c3aed);
          border-radius: inherit;
          transition: width 0.2s;
        }

        /* ================================================
           LOCATION
        ================================================ */

        .location-box {
          padding: 18px;
          margin-bottom: 24px;
          border-radius: 15px;
          background:
            linear-gradient(
              135deg,
              #f5f3ff,
              #ffffff
            );
          border: 1px solid
            rgba(124,58,237,0.15);
        }

        .location-box-header {
          display: flex;
          gap: 12px;
          align-items: flex-start;
          margin-bottom: 14px;
        }

        .location-icon {
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          border-radius: 11px;
          display: grid;
          place-items: center;
          background:
            rgba(124,58,237,0.1);
          font-size: 20px;
        }

        .location-box h3 {
          margin: 1px 0 3px;
          font-size: 15px;
        }

        .location-box p {
          margin: 0;
          color: var(--text-muted);
          font-size: 12px;
        }

        .location-button {
          width: 100%;
          min-height: 45px;
          border: none;
          border-radius: 11px;
          background:
            var(--primary, #7c3aed);
          color: white;
          font-weight: 800;
          cursor: pointer;
          transition: 0.2s;
        }

        .location-button:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(0.96);
        }

        .location-button:disabled {
          opacity: 0.65;
          cursor: wait;
        }

        .location-result {
          margin-top: 13px;
          padding: 13px;
          border-radius: 11px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
        }

        .location-success {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #166534;
          font-size: 13px;
          margin-bottom: 12px;
        }

        .coordinates {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 10px;
        }

        .coordinates div {
          padding: 9px;
          background: white;
          border-radius: 8px;
          border: 1px solid #dcfce7;
        }

        .coordinates small {
          display: block;
          color: #64748b;
          font-size: 10px;
          margin-bottom: 3px;
        }

        .coordinates strong {
          font-size: 12px;
          color: #334155;
          word-break: break-all;
        }

        .maps-button {
          width: 100%;
          border: none;
          border-radius: 9px;
          padding: 10px;
          background: white;
          color: #166534;
          border: 1px solid #bbf7d0;
          cursor: pointer;
          font-weight: 750;
          font-size: 12px;
        }

        .maps-button:hover {
          background: #f0fdf4;
        }

        .location-error,
        .location-warning {
          margin-top: 10px;
          padding: 10px;
          border-radius: 9px;
          background: #fff7ed;
          color: #9a3412;
          font-size: 12px;
          line-height: 1.5;
        }

        /* ================================================
           ANONYMOUS
        ================================================ */

        .anonymous-box {
          padding: 15px;
          margin-bottom: 17px;
          border-radius: 13px;
          background:
            rgba(124,58,237,0.05);
          border: 1px solid
            rgba(124,58,237,0.12);
        }

        .anonymous-label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
        }

        .anonymous-label input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .custom-check {
          width: 19px;
          height: 19px;
          flex-shrink: 0;
          display: grid;
          place-items: center;
          border-radius: 5px;
          border: 1px solid #cbd5e1;
          background: white;
          color: white;
          font-size: 12px;
          font-weight: 900;
        }

        .anonymous-label input:checked
        + .custom-check {
          background:
            var(--primary, #7c3aed);
          border-color:
            var(--primary, #7c3aed);
        }

        .anonymous-label strong {
          display: block;
          font-size: 13px;
        }

        .anonymous-label small {
          display: block;
          margin-top: 4px;
          color: var(--text-muted);
          font-size: 11px;
          line-height: 1.5;
        }

        /* ================================================
           PRIVACY
        ================================================ */

        .privacy-box {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 18px;
          padding: 12px;
          border-radius: 10px;
          background: #f8fafc;
          border: 1px solid
            var(--border, #e5e7eb);
        }

        .privacy-box p {
          margin: 0;
          color: var(--text-muted);
          font-size: 11px;
          line-height: 1.6;
        }

        /* ================================================
           SUBMIT
        ================================================ */

        .submit-report-button {
          width: 100%;
          min-height: 50px;
          border: none;
          border-radius: 12px;
          background:
            linear-gradient(
              135deg,
              #7c3aed,
              #6d28d9
            );
          color: white;
          font-size: 14px;
          font-weight: 850;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          transition: 0.2s;
          box-shadow:
            0 8px 20px
            rgba(124,58,237,0.2);
        }

        .submit-report-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow:
            0 12px 25px
            rgba(124,58,237,0.25);
        }

        .submit-report-button:disabled {
          opacity: 0.65;
          cursor: wait;
        }

        .loading-spinner {
          width: 17px;
          height: 17px;
          border: 2px solid
            rgba(255,255,255,0.4);
          border-top-color: white;
          border-radius: 50%;
          animation:
            reportSpin 0.8s linear infinite;
        }

        @keyframes reportSpin {
          to {
            transform: rotate(360deg);
          }
        }

        /* ================================================
           SIDEBAR
        ================================================ */

        .report-sidebar {
          display: flex;
          flex-direction: column;
          gap: 15px;
          position: sticky;
          top: 20px;
        }

        .sidebar-card {
          padding: 20px;
          border-radius: 17px;
          background: white;
          border: 1px solid
            var(--border, #e5e7eb);
          box-shadow:
            0 8px 25px
            rgba(30,27,75,0.05);
        }

        .sidebar-icon {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background:
            rgba(124,58,237,0.09);
          font-size: 21px;
          margin-bottom: 13px;
        }

        .sidebar-card h3 {
          margin: 0 0 7px;
          font-size: 16px;
        }

        .sidebar-card > p {
          margin: 0;
          color: var(--text-muted);
          font-size: 12px;
          line-height: 1.65;
        }

        .sidebar-points {
          display: flex;
          flex-direction: column;
          gap: 9px;
          margin-top: 16px;
          color: #475569;
          font-size: 12px;
          font-weight: 650;
        }

        .sidebar-points div {
          display: flex;
          gap: 8px;
        }

        .sidebar-points span {
          color: #16a34a;
          font-weight: 900;
        }

        .purple-card {
          background:
            linear-gradient(
              145deg,
              #faf5ff,
              white
            );
        }

        .privacy-mini {
          margin-top: 14px;
          padding: 8px 10px;
          border-radius: 8px;
          background: white;
          color: #6d28d9;
          font-size: 11px;
          font-weight: 700;
        }

        .emergency-side {
          background:
            linear-gradient(
              145deg,
              #fff7ed,
              white
            );
          border-color:
            rgba(245,158,11,0.2);
        }

        .sidebar-emergency-button {
          display: block;
          text-align: center;
          text-decoration: none;
          margin-top: 14px;
          padding: 11px;
          border-radius: 10px;
          background: #dc2626;
          color: white;
          font-size: 12px;
          font-weight: 800;
        }

        .sidebar-emergency-button:hover {
          background: #b91c1c;
        }

        /* ================================================
           FOOTER NOTICE
        ================================================ */

        .report-footer-notice {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-top: 25px;
          padding: 17px;
          border-radius: 14px;
          background: #f8fafc;
          border: 1px solid
            var(--border, #e5e7eb);
        }

        .report-footer-notice > span {
          font-size: 20px;
        }

        .report-footer-notice strong {
          font-size: 13px;
        }

        .report-footer-notice p {
          margin: 4px 0 0;
          color: var(--text-muted);
          font-size: 11px;
          line-height: 1.6;
        }

        /* ================================================
           RESPONSIVE
        ================================================ */

        @media (max-width: 900px) {

          .report-layout {
            grid-template-columns: 1fr;
          }

          .report-sidebar {
            position: static;
            display: grid;
            grid-template-columns:
              repeat(3, 1fr);
          }

          .report-hero {
            grid-template-columns: 1fr;
          }

          .report-hero-visual {
            min-height: 210px;
          }

        }

        @media (max-width: 700px) {

          .category-grid {
            grid-template-columns:
              repeat(3, 1fr);
          }

          .emergency-banner {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .emergency-content {
            min-width: 200px;
          }

          .emergency-call {
            width: 100%;
            text-align: center;
            box-sizing: border-box;
          }

          .report-sidebar {
            grid-template-columns: 1fr;
          }

        }

        @media (max-width: 600px) {

          .report-form-card {
            padding: 20px 16px;
          }

          .report-hero-visual {
            border-radius: 18px;
          }

          .form-heading h2 {
            font-size: 20px;
          }

          .category-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .category-card {
            min-height: 75px;
          }

          .coordinates {
            grid-template-columns: 1fr;
          }

          .report-badges span {
            font-size: 10px;
          }

        }

      `}</style>

    </div>
  );
};

export default ReportIncident;