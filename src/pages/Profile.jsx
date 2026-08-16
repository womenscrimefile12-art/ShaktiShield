import { useEffect, useState } from "react";
import { userAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ================================
  // LOAD PROFILE
  // ================================

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);

        const { data } = await userAPI.getProfile();

        setForm({
          name: data?.name || "",
          phone: data?.phone || "",
        });
      } catch (err) {
        console.error("Profile loading error:", err);

        setError(
          err?.response?.data?.message ||
            "Unable to load your profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // ================================
  // HANDLE INPUT
  // ================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (message) setMessage("");
    if (error) setError("");
  };

  // ================================
  // UPDATE PROFILE
  // ================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const name = form.name.trim();
    const phone = form.phone.trim();

    if (!name) {
      setError("Please enter your full name.");
      return;
    }

    if (!phone) {
      setError("Please enter your phone number.");
      return;
    }

    setSaving(true);

    try {
      await userAPI.updateProfile({
        name,
        phone,
      });

      setForm({
        name,
        phone,
      });

      setMessage("Your profile has been updated successfully.");
    } catch (err) {
      console.error("Profile update error:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to update your profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  // ================================
  // LOADING STATE
  // ================================

  if (loading) {
    return (
      <div className="loading">
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: "2rem",
              marginBottom: "0.5rem",
            }}
          >
            ⏳
          </div>

          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  // ================================
  // PROFILE
  // ================================

  return (
    <div className="profile-page">
      {/* Page Header */}

      <div className="page-header">
        <span className="section-label">
          ACCOUNT SETTINGS
        </span>

        <h1 className="page-title">
          My Profile
        </h1>

        <p className="page-description">
          Manage your personal information and keep
          your ShaktiShield account up to date.
        </p>
      </div>

      {/* Profile Layout */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "minmax(220px, 280px) minmax(0, 1fr)",
          gap: "1.5rem",
          maxWidth: "900px",
        }}
      >
        {/* Profile Summary */}

        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "2rem 1.5rem",
            height: "fit-content",
          }}
        >
          {/* Avatar */}

          <div
            style={{
              width: "90px",
              height: "90px",
              margin: "0 auto 1rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, #9333ea, #7e22ce)",
              color: "white",
              fontSize: "2.2rem",
              fontWeight: 700,
              boxShadow:
                "0 10px 25px rgb(147 51 234 / 0.2)",
            }}
          >
            {form.name
              ? form.name
                  .charAt(0)
                  .toUpperCase()
              : "👤"}
          </div>

          <h2
            style={{
              fontSize: "1.25rem",
              marginBottom: "0.3rem",
              wordBreak: "break-word",
            }}
          >
            {form.name || "Your Name"}
          </h2>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.85rem",
              wordBreak: "break-word",
            }}
          >
            {user?.email || "No email available"}
          </p>

          {/* Account Badge */}

          <div
            style={{
              marginTop: "1.25rem",
              paddingTop: "1.25rem",
              borderTop:
                "1px solid var(--border)",
            }}
          >
            <span className="badge badge-resolved">
              ✓ Account Active
            </span>
          </div>
        </div>

        {/* Edit Profile */}

        <div className="card">
          <div
            style={{
              marginBottom: "1.5rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.3rem",
                marginBottom: "0.35rem",
              }}
            >
              Personal Information
            </h2>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.85rem",
              }}
            >
              Update the information associated
              with your account.
            </p>
          </div>

          {/* Success Message */}

          {message && (
            <div
              className="alert alert-success"
              role="status"
            >
              <span>✓</span>
              <span>{message}</span>
            </div>
          )}

          {/* Error Message */}

          {error && (
            <div
              className="alert alert-error"
              role="alert"
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}

            <div className="form-group">
              <label htmlFor="profile-email">
                Email Address
              </label>

              <input
                id="profile-email"
                type="email"
                value={user?.email || ""}
                disabled
                style={{
                  background: "#f9fafb",
                  color: "var(--text-muted)",
                  cursor: "not-allowed",
                }}
              />

              <small
                style={{
                  display: "block",
                  marginTop: "0.35rem",
                  color: "var(--text-muted)",
                  fontSize: "0.75rem",
                }}
              >
                Email address cannot be changed here.
              </small>
            </div>

            {/* Full Name */}

            <div className="form-group">
              <label htmlFor="profile-name">
                Full Name
              </label>

              <input
                id="profile-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                disabled={saving}
                required
              />
            </div>

            {/* Phone */}

            <div className="form-group">
              <label htmlFor="profile-phone">
                Phone Number
              </label>

              <input
                id="profile-phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                autoComplete="tel"
                disabled={saving}
                required
              />
            </div>

            {/* Save Button */}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "1.5rem",
              }}
            >
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
                style={{
                  minWidth: "150px",
                  minHeight: "44px",
                }}
              >
                {saving ? (
                  <>
                    <span>⏳</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span>✓</span>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Security Information */}

      <div
        className="card"
        style={{
          maxWidth: "900px",
          marginTop: "1.5rem",
          background:
            "linear-gradient(135deg, #faf5ff, #ffffff)",
          border:
            "1px solid rgb(147 51 234 / 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              flexShrink: 0,
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "rgb(147 51 234 / 0.1)",
              fontSize: "1.2rem",
            }}
          >
            🔒
          </div>

          <div>
            <h3
              style={{
                marginBottom: "0.3rem",
                fontSize: "1rem",
              }}
            >
              Your Privacy Matters
            </h3>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                lineHeight: 1.6,
              }}
            >
              Keep your profile information accurate
              so your emergency contacts can identify
              you quickly when you need assistance.
            </p>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}

      <style>
        {`
          @media (max-width: 700px) {
            .profile-page > div:nth-child(2) {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 480px) {
            .profile-page {
              padding-bottom: 1rem;
            }

            .profile-page .card {
              padding: 1.25rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Profile;