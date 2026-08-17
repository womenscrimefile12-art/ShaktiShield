import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const user = await login(email, password);

      if (user?.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to sign in. Please check your credentials and try again."
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

      {/* Login Container */}

      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo / Brand */}

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

        {/* Login Card */}

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
              marginBottom: "1.75rem",
            }}
          >
            <h2
              style={{
                fontSize: "1.5rem",
                marginBottom: "0.35rem",
              }}
            >
              Welcome Back 👋
            </h2>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.88rem",
              }}
            >
              Sign in to access your safety dashboard.
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
            {/* Email */}

            <div className="form-group">
              <label htmlFor="email">
                Email Address
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>

            {/* Password */}

            <div className="form-group">
              <label htmlFor="password">
                Password
              </label>

              <div
                style={{
                  position: "relative",
                }}
              >
                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={loading}
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
                    transform:
                      "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    color: "var(--text-muted)",
                    fontSize: "1.1rem",
                    padding: "0.25rem",
                    cursor: loading
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Forgot Password */}

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "-0.5rem",
                marginBottom: "0.75rem",
              }}
            >
              <Link
                to="/forgot-password"
                style={{
                  color: "#9333ea",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In */}

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{
                width: "100%",
                minHeight: "46px",
                marginTop: "0.5rem",
              }}
            >
              {loading ? (
                <>
                  <span>⏳</span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <span>→</span>
                </>
              )}
            </button>
          </form>

          {/* Register */}

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
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  fontWeight: 700,
                }}
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Security Information */}

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
          <span>🔒</span>

          <span>
            Your account and safety information are
            protected.
          </span>
        </div>

        {/* Back Home */}

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

export default Login;