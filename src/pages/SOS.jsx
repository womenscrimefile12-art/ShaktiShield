import { useCallback, useEffect, useState } from "react";
import SOSButton from "../components/SOSButton";
import { sosAPI } from "../services/api";

const SOS = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await sosAPI.getMyAlerts();

      const data = Array.isArray(response?.data)
        ? response.data
        : [];

      setAlerts(data);
    } catch (err) {
      console.error("Failed to fetch SOS alerts:", err);

      setError(
        "Unable to load your emergency alert history. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleTriggered = async () => {
    setMessage(
      "SOS alert sent successfully. Your emergency contacts have been notified."
    );

    setError("");

    await fetchAlerts();
  };

  const handleCancel = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this emergency alert?"
    );

    if (!confirmed) return;

    try {
      setCancellingId(id);
      setError("");
      setMessage("");

      await sosAPI.cancel(id);

      setMessage("SOS alert has been cancelled successfully.");

      await fetchAlerts();
    } catch (err) {
      console.error("Failed to cancel SOS alert:", err);

      setError(
        "Unable to cancel the SOS alert. Please try again."
      );
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusClass = (status) => {
    if (status === "active") {
      return "badge badge-active";
    }

    if (status === "cancelled") {
      return "badge badge-cancelled";
    }

    return "badge badge-resolved";
  };

  const formatDate = (date) => {
    if (!date) return "Unknown date";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Unknown date";
    }

    return parsedDate.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const activeAlerts = alerts.filter(
    (alert) => alert.status === "active"
  );

  const resolvedAlerts = alerts.filter(
    (alert) => alert.status === "resolved"
  );

  const cancelledAlerts = alerts.filter(
    (alert) => alert.status === "cancelled"
  );

  return (
    <section className="sos-page">

      {/* =====================================================
          PAGE HEADER
      ===================================================== */}

      <header className="page-header sos-page-header">

        <div className="sos-header-badge">
          <span className="status-dot" />
          SHAKTISHIELD • EMERGENCY RESPONSE
        </div>

        <h1 className="page-title">
          SOS Emergency
        </h1>

        <p className="page-description">
          One tap can alert your trusted emergency contacts
          when you need immediate help.
        </p>

      </header>


      {/* =====================================================
          NOTIFICATIONS
      ===================================================== */}

      {message && (
        <div
          className="sos-notification success"
          role="status"
        >
          <div className="notification-icon">
            ✓
          </div>

          <div className="notification-content">
            <strong>Alert Update</strong>
            <span>{message}</span>
          </div>

          <button
            type="button"
            onClick={() => setMessage("")}
            className="notification-close"
            aria-label="Close message"
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div
          className="sos-notification error"
          role="alert"
        >
          <div className="notification-icon">
            !
          </div>

          <div className="notification-content">
            <strong>Something went wrong</strong>
            <span>{error}</span>
          </div>

          <button
            type="button"
            onClick={() => setError("")}
            className="notification-close"
            aria-label="Close error"
          >
            ×
          </button>
        </div>
      )}


      {/* =====================================================
          MAIN SOS HERO
      ===================================================== */}

      <div className="sos-hero-card">

        <div className="sos-hero-glow glow-one" />
        <div className="sos-hero-glow glow-two" />

        <div className="sos-hero-content">

          <div className="sos-live-status">
            <span className="live-dot" />
            EMERGENCY SYSTEM READY
          </div>

          <div className="sos-shield-container">

            <div className="sos-outer-ring">
              <div className="sos-middle-ring">
                <div className="sos-shield">
                  🛡️
                </div>
              </div>
            </div>

          </div>

          <h2 className="sos-hero-title">
            Are You in Danger?
          </h2>

          <p className="sos-hero-text">
            Press the SOS button to immediately trigger
            your emergency response and notify your
            registered contacts.
          </p>

          <div className="sos-button-wrapper">
            <SOSButton
              onTriggered={handleTriggered}
            />
          </div>

          <div className="sos-security-note">
            <span>🔒</span>
            <span>
              Your emergency information is handled
              according to your configured settings.
            </span>
          </div>

        </div>

      </div>


      {/* =====================================================
          QUICK EMERGENCY ACTIONS
      ===================================================== */}

      <div className="sos-quick-actions">

        <div className="sos-quick-card">
          <div className="quick-card-icon red">
            🚨
          </div>

          <div>
            <strong>Emergency</strong>
            <span>Use SOS immediately</span>
          </div>
        </div>

        <div className="sos-quick-card">
          <div className="quick-card-icon purple">
            📍
          </div>

          <div>
            <strong>Location</strong>
            <span>Share your location</span>
          </div>
        </div>

        <div className="sos-quick-card">
          <div className="quick-card-icon green">
            👥
          </div>

          <div>
            <strong>Contacts</strong>
            <span>Trusted contacts notified</span>
          </div>
        </div>

        <div className="sos-quick-card">
          <div className="quick-card-icon blue">
            🛡️
          </div>

          <div>
            <strong>Protection</strong>
            <span>Stay calm and move safe</span>
          </div>
        </div>

      </div>


      {/* =====================================================
          ACTIVE ALERT
      ===================================================== */}

      {activeAlerts.length > 0 && (
        <div className="active-alert-card enhanced-active-alert">

          <div className="active-alert-left">

            <div className="active-alert-icon pulse-alert">
              🚨
            </div>

            <div>
              <div className="active-alert-label">
                LIVE EMERGENCY
              </div>

              <h3>
                Active Emergency Alert
              </h3>

              <p>
                You currently have{" "}
                <strong>
                  {activeAlerts.length}
                </strong>{" "}
                active emergency{" "}
                {activeAlerts.length === 1
                  ? "alert"
                  : "alerts"}.
              </p>
            </div>

          </div>

          <div className="active-alert-indicator">
            <span />
            Active
          </div>

        </div>
      )}


      {/* =====================================================
          STATISTICS
      ===================================================== */}

      <div className="sos-stat-grid">

        <div className="sos-stat-card">
          <span className="stat-icon">🚨</span>

          <div>
            <strong>{alerts.length}</strong>
            <span>Total Alerts</span>
          </div>
        </div>

        <div className="sos-stat-card">
          <span className="stat-icon active">
            ⚡
          </span>

          <div>
            <strong>{activeAlerts.length}</strong>
            <span>Active</span>
          </div>
        </div>

        <div className="sos-stat-card">
          <span className="stat-icon resolved">
            ✓
          </span>

          <div>
            <strong>{resolvedAlerts.length}</strong>
            <span>Resolved</span>
          </div>
        </div>

        <div className="sos-stat-card">
          <span className="stat-icon cancelled">
            ×
          </span>

          <div>
            <strong>{cancelledAlerts.length}</strong>
            <span>Cancelled</span>
          </div>
        </div>

      </div>


      {/* =====================================================
          ALERT HISTORY
      ===================================================== */}

      <div className="alert-history-section">

        <div className="section-heading-row sos-history-heading">

          <div>
            <span className="section-label">
              ACTIVITY
            </span>

            <h2>
              Emergency Alert History
            </h2>

            <p>
              Review your previous SOS alerts and
              their current status.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline refresh-button"
            onClick={fetchAlerts}
            disabled={loading}
          >
            <span className={loading ? "refresh-spin" : ""}>
              ↻
            </span>

            {loading
              ? "Refreshing..."
              : "Refresh"}
          </button>

        </div>


        {/* =================================================
            LOADING STATE
        ================================================= */}

        {loading && alerts.length === 0 ? (

          <div className="sos-loading-grid">

            {[1, 2, 3].map((item) => (
              <div
                className="sos-history-skeleton"
                key={item}
              >
                <div className="skeleton skeleton-circle" />

                <div className="skeleton-content">
                  <div className="skeleton skeleton-small" />
                  <div className="skeleton skeleton-medium" />
                  <div className="skeleton skeleton-line" />
                </div>
              </div>
            ))}

          </div>

        ) : alerts.length === 0 ? (

          /* =================================================
             EMPTY STATE
          ================================================= */

          <div className="empty-alert-state enhanced-empty-state">

            <div className="empty-shield">
              🛡️
            </div>

            <span className="empty-label">
              ALL CLEAR
            </span>

            <h3>
              No Emergency Alerts
            </h3>

            <p>
              You haven't triggered any SOS alerts yet.
              Your emergency activity will appear here
              when an alert is created.
            </p>

            <div className="empty-security">
              <span>✓</span>
              Your emergency system is ready
            </div>

          </div>

        ) : (

          /* =================================================
             ALERT LIST
          ================================================= */

          <div className="grid alert-history-grid">

            {alerts.map((alert) => (

              <article
                key={alert._id}
                className={`card alert-history-card enhanced-history-card ${
                  alert.status === "active"
                    ? "history-active"
                    : ""
                }`}
              >

                {/* CARD TOP */}

                <div className="alert-history-header">

                  <div className="alert-type">

                    <div
                      className={`history-icon ${
                        alert.status
                      }`}
                    >
                      🚨
                    </div>

                    <div>
                      <h3>
                        Emergency SOS
                      </h3>

                      <span
                        className={getStatusClass(
                          alert.status
                        )}
                      >
                        {alert.status || "unknown"}
                      </span>
                    </div>

                  </div>

                  <div className="alert-date">
                    <span>TRIGGERED</span>
                    {formatDate(alert.createdAt)}
                  </div>

                </div>


                {/* DIVIDER */}

                <div className="history-divider" />


                {/* MESSAGE */}

                <div className="alert-history-content">

                  <div className="history-message-icon">
                    💬
                  </div>

                  <p>
                    {alert.message ||
                      "Emergency alert triggered."}
                  </p>

                </div>


                {/* LOCATION INFO */}

                <div className="history-meta">

                  <span>
                    📍 Emergency response
                  </span>

                  <span>
                    🛡️ ShaktiShield
                  </span>

                </div>


                {/* ACTION */}

                {alert.status === "active" && (

                  <div className="alert-history-actions">

                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() =>
                        handleCancel(alert._id)
                      }
                      disabled={
                        cancellingId === alert._id
                      }
                    >
                      {cancellingId === alert._id
                        ? "Cancelling..."
                        : "Cancel Emergency Alert"}
                    </button>

                  </div>

                )}

              </article>

            ))}

          </div>

        )}

      </div>


      {/* =====================================================
          SAFETY REMINDER
      ===================================================== */}

      <div className="sos-safety-footer">

        <div className="safety-footer-icon">
          💡
        </div>

        <div>
          <strong>
            Emergency Safety Reminder
          </strong>

          <p>
            Use SOS only when you genuinely need
            emergency assistance. Keep your trusted
            contacts updated and allow location
            permissions when your emergency settings
            require them.
          </p>
        </div>

      </div>

    </section>
  );
};

export default SOS;