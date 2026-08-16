import { useState } from "react";
import { incidentAPI } from "../services/api";

const INITIAL_FORM = {
  title: "",
  description: "",
  category: "harassment",
  address: "",
  isAnonymous: false,
};

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

const ReportIncident = () => {
  const [form, setForm] = useState(INITIAL_FORM);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [locationStatus, setLocationStatus] = useState("idle");

  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
        reject(new Error("Geolocation is not supported."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        resolve,
        reject,
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  };

  /* =====================================================
     SUBMIT REPORT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");
    setLocationStatus("loading");

    /* ---------------------------------------------
       BASIC VALIDATION
    --------------------------------------------- */

    const title = form.title.trim();
    const description = form.description.trim();
    const address = form.address.trim();

    if (!title) {
      setError("Please enter a title for the incident.");
      setLoading(false);
      setLocationStatus("idle");
      return;
    }

    if (title.length < 5) {
      setError("Incident title should contain at least 5 characters.");
      setLoading(false);
      setLocationStatus("idle");
      return;
    }

    if (!description) {
      setError("Please provide a description of the incident.");
      setLoading(false);
      setLocationStatus("idle");
      return;
    }

    if (description.length < 20) {
      setError(
        "Please provide a little more detail about what happened."
      );
      setLoading(false);
      setLocationStatus("idle");
      return;
    }

    try {
      let lat = null;
      let lng = null;

      /* ---------------------------------------------
         GET LOCATION
      --------------------------------------------- */

      try {
        const position = await getCurrentLocation();

        lat = position.coords.latitude;
        lng = position.coords.longitude;

        setLocationStatus("success");
      } catch (locationError) {
        console.warn(
          "Location unavailable:",
          locationError
        );

        /*
         * Reporting should still work even if the user
         * denies location permission.
         */

        setLocationStatus("unavailable");
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

      setMessage(
        "Incident reported successfully. Thank you for helping keep our community safe."
      );

      setForm(INITIAL_FORM);

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
     UI
  ===================================================== */

  return (
    <div className="safety-tips-page">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="page-header">

        <span className="section-label">
          COMMUNITY SAFETY
        </span>

        <h1 className="page-title">
          Report an Incident
        </h1>

        <p className="page-description">
          Help make your community safer by reporting
          incidents, unsafe situations, or suspicious
          activities. Your report can help identify
          safety concerns and protect others.
        </p>

      </div>

      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {message && (
        <div
          className="alert alert-success"
          role="alert"
        >
          <span
            style={{
              fontSize: "1.2rem",
            }}
          >
            ✓
          </span>

          <span>{message}</span>
        </div>
      )}

      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && (
        <div
          className="alert alert-error"
          role="alert"
        >
          <span
            style={{
              fontSize: "1.2rem",
            }}
          >
            ⚠️
          </span>

          <span>{error}</span>
        </div>
      )}

      {/* =================================================
          REPORT FORM
      ================================================= */}

      <div
        className="card"
        style={{
          maxWidth: "750px",
          margin: "0 auto",
        }}
      >

        {/* FORM HEADER */}

        <div
          style={{
            marginBottom: "2rem",
            paddingBottom: "1.25rem",
            borderBottom:
              "1px solid var(--border)",
          }}
        >
          <h2
            style={{
              fontSize: "1.4rem",
              marginBottom: "0.4rem",
            }}
          >
            Incident Details
          </h2>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.9rem",
            }}
          >
            Please provide accurate information
            about the incident.
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* =================================================
              TITLE
          ================================================= */}

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

            <small
              style={{
                display: "block",
                marginTop: "0.35rem",
                color: "var(--text-muted)",
                fontSize: "0.75rem",
              }}
            >
              {form.title.length}/100 characters
            </small>

          </div>

          {/* =================================================
              CATEGORY
          ================================================= */}

          <div className="form-group">

            <label htmlFor="incident-category">
              Incident Category *
            </label>

            <select
              id="incident-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              {CATEGORIES.map((category) => (
                <option
                  key={category.value}
                  value={category.value}
                >
                  {category.icon} {category.label}
                </option>
              ))}
            </select>

          </div>

          {/* =================================================
              DESCRIPTION
          ================================================= */}

          <div className="form-group">

            <label htmlFor="incident-description">
              What Happened? *
            </label>

            <textarea
              id="incident-description"
              name="description"
              rows={6}
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what happened, when it happened, and any important details..."
              maxLength={1500}
              required
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "0.35rem",
                gap: "1rem",
              }}
            >
              <small
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.75rem",
                }}
              >
                Please avoid sharing unnecessary
                personal information.
              </small>

              <small
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.75rem",
                  whiteSpace: "nowrap",
                }}
              >
                {form.description.length}/1500
              </small>
            </div>

          </div>

          {/* =================================================
              ADDRESS
          ================================================= */}

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
              placeholder="Where did this happen?"
              maxLength={250}
            />

            <small
              style={{
                display: "block",
                marginTop: "0.4rem",
                color: "var(--text-muted)",
                fontSize: "0.78rem",
              }}
            >
              You can provide a nearby landmark,
              street, or general area.
            </small>

          </div>

          {/* =================================================
              LOCATION STATUS
          ================================================= */}

          {locationStatus === "loading" && (
            <div
              className="alert alert-warning"
              style={{
                marginBottom: "1rem",
              }}
            >
              📍 Getting your current location...
            </div>
          )}

          {locationStatus === "success" && (
            <div
              className="alert alert-success"
              style={{
                marginBottom: "1rem",
              }}
            >
              📍 Your location has been attached
              to this report.
            </div>
          )}

          {locationStatus === "unavailable" && (
            <div
              className="alert alert-warning"
              style={{
                marginBottom: "1rem",
              }}
            >
              📍 Location was unavailable. Your
              report will still be submitted using
              the address you provided.
            </div>
          )}

          {/* =================================================
              ANONYMOUS REPORT
          ================================================= */}

          <div
            style={{
              padding: "1rem",
              marginBottom: "1.5rem",
              borderRadius: "12px",
              background:
                "rgb(147 51 234 / 0.05)",
              border:
                "1px solid rgb(147 51 234 / 0.12)",
            }}
          >

            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                cursor: "pointer",
              }}
            >

              <input
                type="checkbox"
                name="isAnonymous"
                checked={form.isAnonymous}
                onChange={handleChange}
                style={{
                  width: "18px",
                  height: "18px",
                  marginTop: "2px",
                  accentColor:
                    "var(--primary)",
                  flexShrink: 0,
                }}
              />

              <span>
                <strong>
                  Submit anonymously
                </strong>

                <span
                  style={{
                    display: "block",
                    marginTop: "0.25rem",
                    color:
                      "var(--text-muted)",
                    fontSize: "0.82rem",
                    lineHeight: 1.5,
                  }}
                >
                  Your identity will not be displayed
                  as the reporter of this incident.
                </span>
              </span>

            </label>

          </div>

          {/* =================================================
              PRIVACY NOTICE
          ================================================= */}

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
              marginBottom: "1.5rem",
              padding: "1rem",
              borderRadius: "10px",
              background: "#f9fafb",
              border:
                "1px solid var(--border)",
            }}
          >

            <span
              style={{
                fontSize: "1.1rem",
              }}
            >
              🔒
            </span>

            <p
              style={{
                color:
                  "var(--text-muted)",
                fontSize: "0.8rem",
                lineHeight: 1.6,
              }}
            >
              Please do not include passwords,
              financial information, or other
              highly sensitive personal information
              in your report.
            </p>

          </div>

          {/* =================================================
              SUBMIT BUTTON
          ================================================= */}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: "100%",
              minHeight: "48px",
              fontSize: "1rem",
            }}
          >
            {loading
              ? "Submitting Report..."
              : "🚨 Submit Incident Report"}
          </button>

        </form>

      </div>

      {/* =================================================
          SAFETY NOTICE
      ================================================= */}

      <div
        className="card"
        style={{
          maxWidth: "750px",
          margin: "1.5rem auto 0",
          background:
            "linear-gradient(135deg, #fff7ed, #ffffff)",
          border:
            "1px solid rgb(245 158 11 / 0.2)",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "0.9rem",
          }}
        >

          <span
            style={{
              fontSize: "1.4rem",
            }}
          >
            🚨
          </span>

          <div>

            <h3
              style={{
                marginBottom: "0.35rem",
                fontSize: "1rem",
              }}
            >
              Immediate Danger?
            </h3>

            <p
              style={{
                color:
                  "var(--text-muted)",
                fontSize: "0.85rem",
                lineHeight: 1.6,
              }}
            >
              If you are currently in immediate
              danger, use the ShaktiShield SOS
              feature or contact the appropriate
              emergency service. An incident report
              is not a replacement for emergency
              assistance.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ReportIncident;