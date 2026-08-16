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

  return (
    <section className="sos-page">
      {/* Header */}
      <header className="page-header">
        <span className="section-label">
          SHAKTISHIELD • EMERGENCY RESPONSE
        </span>

        <h1 className="page-title">
          SOS Emergency
        </h1>

        <p className="page-description">
          Quickly alert your emergency contacts when you
          are in danger or need immediate assistance.
        </p>
      </header>

      {/* Success Message */}
      {message && (
        <div
          className="alert alert-success sos-alert-message"
          role="status"
        >
          <span className="message-icon">✓</span>
          <span>{message}</span>

          <button
            type="button"
            className="alert-close"
            onClick={() => setMessage("")}
            aria-label="Close message"
          >
            ×
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          className="alert alert-error sos-alert-message"
          role="alert"
        >
          <span className="message-icon">⚠️</span>
          <span>{error}</span>

          <button
            type="button"
            className="alert-close"
            onClick={() => setError("")}
            aria-label="Close error"
          >
            ×
          </button>
        </div>
      )}

      {/* Emergency SOS Card */}
      <div className="card sos-main-card">
        <div className="sos-icon-wrapper">
          <span className="sos-shield-icon">
            🛡️
          </span>
        </div>

        <h2 className="sos-main-title">
          Are You in Danger?
        </h2>

        <p className="sos-main-description">
          Press the SOS button to send an emergency
          alert to your registered emergency contacts.
          Your location may be shared according to your
          configured emergency settings.
        </p>

        <div className="sos-button-container">
          <SOSButton
            onTriggered={handleTriggered}
          />
        </div>

        <div className="sos-warning">
          <span>⚠️</span>

          <p>
            Only use SOS during a genuine emergency.
            Make sure your emergency contacts are
            updated and your location permissions are
            enabled when required.
          </p>
        </div>
      </div>

      {/* Active Alert Status */}
      {activeAlerts.length > 0 && (
        <div className="active-alert-card">
          <div className="active-alert-icon">
            🚨
          </div>

          <div>
            <h3>Active Emergency Alert</h3>

            <p>
              You currently have{" "}
              <strong>
                {activeAlerts.length}
              </strong>{" "}
              active emergency{" "}
              {activeAlerts.length === 1
                ? "alert"
                : "alerts"}
              .
            </p>
          </div>
        </div>
      )}

      {/* Alert History */}
      <div className="alert-history-section">
        <div className="section-heading-row">
          <div>
            <h2>Alert History</h2>

            <p>
              View your previous emergency alerts and
              their current status.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline refresh-button"
            onClick={fetchAlerts}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "↻ Refresh"}
          </button>
        </div>

        {/* Loading */}
        {loading && alerts.length === 0 ? (
          <div className="grid">
            {[1, 2, 3].map((item) => (
              <div
                className="card alert-history-card"
                key={item}
              >
                <div className="skeleton skeleton-small" />
                <div className="skeleton skeleton-medium" />
                <div className="skeleton skeleton-line" />
              </div>
            ))}
          </div>
        ) : alerts.length === 0 ? (
          /* Empty State */
          <div className="card empty-alert-state">
            <div className="empty-alert-icon">
              🛡️
            </div>

            <h3>No Emergency Alerts</h3>

            <p>
              You haven't triggered any SOS alerts yet.
              Your emergency alert history will appear
              here.
            </p>
          </div>
        ) : (
          /* Alert List */
          <div className="grid alert-history-grid">
            {alerts.map((alert) => (
              <article
                key={alert._id}
                className="card alert-history-card"
              >
                <div className="alert-history-header">
                  <div className="alert-type">
                    <span className="alert-history-icon">
                      🚨
                    </span>

                    <div>
                      <h3>Emergency SOS</h3>

                      <span
                        className={getStatusClass(
                          alert.status
                        )}
                      >
                        {alert.status || "unknown"}
                      </span>
                    </div>
                  </div>

                  <span className="alert-date">
                    {formatDate(alert.createdAt)}
                  </span>
                </div>

                <div className="alert-history-content">
                  <p>
                    {alert.message ||
                      "Emergency alert triggered."}
                  </p>
                </div>

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
                        : "Cancel Alert"}
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SOS;