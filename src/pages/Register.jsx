import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // ========================================
  // HANDLE INPUT
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  // ========================================
  // VALIDATION
  // ========================================

  const validateForm = () => {
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const password = form.password;

    if (!name) {
      return "Please enter your full name.";
    }

    if (name.length < 2) {
      return "Name must contain at least 2 characters.";
    }

    if (!email) {
      return "Please enter your email address.";
    }

    if (!phone) {
      return "Please enter your phone number.";
    }

    if (password.length < 6) {
      return "Password must contain at least 6 characters.";
    }

    return "";
  };

  // ========================================
  // SUBMIT
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });

      navigate("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
        background:
          "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 50%, #ffffff 100%)",
      }}
    >
      {/* Decorative Background */}

      <div
        style={{
          position: "fixed",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "rgb(147 51 234 / 0.06)",
          top: "-100px",
          right: "-80px",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "fixed",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background: "rgb(147 51 234 / 0.05)",
          bottom: "-100px",
          left: "-70px",
          pointerEvents: "none",
        }}
      />

      {/* Main Container */}

      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Brand */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              width: "70px",
              height: "70px",
              margin: "0 auto 1rem",
              borderRadius: "22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(135deg, #9333ea, #7e22ce)",
              boxShadow:
                "0 10px 25px rgb(147 51 234 / 0.25)",
              fontSize: "2rem",
            }}
          >
            🛡️
          </div>

          <h1
            style={{
              color: "var(--primary)",
              fontSize: "1.8rem",
              fontWeight: 800,
              marginBottom: "0.3rem",
            }}
          >
            ShaktiShield
          </h1>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "0.9rem",
            }}
          >
            Your personal safety companion
          </p>
        </div>

        {/* Registration Card */}

        <div
          className="card"
          style={{
            padding: "2rem",
            boxShadow:
              "0 20px 50px rgb(30 27 75 / 0.12)",
            border:
              "1px solid rgb(147 51 234 / 0.08)",
          }}
        >
          {/* Header */}

          <div
            style={{
              marginBottom: "1.5rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                marginBottom: "0.35rem",
              }}
            >
              Create Your Account ✨
            </h2>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.88rem",
              }}
            >
              Join ShaktiShield and take control of
              your personal safety.
            </p>
          </div>

          {/* Error */}

          {error && (
            <div
              className="alert alert-error"
              role="alert"
              style={{
                marginBottom: "1.25rem",
              }}
            >
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}

          <form onSubmit={handleSubmit}>
            {/* Full Name */}

            <div className="form-group">
              <label htmlFor="register-name">
                Full Name
              </label>

              <input
                id="register-name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                autoComplete="name"
                disabled={loading}
                required
              />
            </div>

            {/* Email */}

            <div className="form-group">
              <label htmlFor="register-email">
                Email Address
              </label>

              <input
                id="register-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                disabled={loading}
                required
              />
            </div>

            {/* Phone */}

            <div className="form-group">
              <label htmlFor="register-phone">
                Phone Number
              </label>

              <input
                id="register-phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                autoComplete="tel"
                disabled={loading}
                required
              />
            </div>

            {/* Password */}

            <div className="form-group">
              <label htmlFor="register-password">
                Password
              </label>

              <div
                style={{
                  position: "relative",
                }}
              >
                <input
                  id="register-password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  minLength={6}
                  disabled={loading}
                  required
                  style={{
                    paddingRight: "3rem",
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  style={{
                    position: "absolute",
                    right: "0.7rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    color: "var(--text-muted)",
                    fontSize: "1.1rem",
                    padding: "0.25rem",
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              <small
                style={{
                  display: "block",
                  marginTop: "0.4rem",
                  color: "var(--text-muted)",
                  fontSize: "0.75rem",
                }}
              >
                Password must contain at least
                6 characters.
              </small>
            </div>

            {/* Terms */}

            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.6rem",
                marginBottom: "1.25rem",
                color: "var(--text-muted)",
                fontSize: "0.78rem",
                lineHeight: 1.5,
              }}
            >
              <span>🔐</span>

              <span>
                Your information is used to provide
                safety services and emergency
                assistance through ShaktiShield.
              </span>
            </div>

            {/* Register Button */}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: "100%",
                minHeight: "46px",
              }}
            >
              {loading ? (
                <>
                  <span>⏳</span>
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}

          <div
            style={{
              textAlign: "center",
              marginTop: "1.5rem",
              paddingTop: "1.25rem",
              borderTop:
                "1px solid var(--border)",
            }}
          >
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.88rem",
              }}
            >
              Already have an account?{" "}
              <Link
                to="/login"
                style={{
                  fontWeight: 700,
                }}
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        {/* Security */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            marginTop: "1.25rem",
            color: "var(--text-muted)",
            fontSize: "0.75rem",
            textAlign: "center",
          }}
        >
          <span>🛡️</span>

          <span>
            Your safety. Your privacy. Your control.
          </span>
        </div>

        {/* Home Link */}

        <div
          style={{
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          <Link
            to="/"
            style={{
              fontSize: "0.82rem",
              color: "var(--text-muted)",
            }}
          >
            ← Back to ShaktiShield Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;