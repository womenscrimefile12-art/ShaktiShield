import { Link } from "react-router-dom";

const Home = () => {
  const features = [
    {
      icon: "🚨",
      title: "One-Tap SOS",
      description:
        "Send an emergency alert to your trusted contacts and share your location when you need immediate help.",
      link: "/login",
      action: "Get Protected",
    },
    {
      icon: "📍",
      title: "Find Safe Places",
      description:
        "Discover nearby police stations, hospitals and other important safety locations.",
      link: "/login",
      action: "Explore Places",
    },
    {
      icon: "📞",
      title: "Emergency Contacts",
      description:
        "Create and manage trusted contacts who can be notified during an emergency.",
      link: "/login",
      action: "Manage Contacts",
    },
    {
      icon: "📝",
      title: "Incident Reporting",
      description:
        "Report safety incidents and contribute to creating safer communities.",
      link: "/login",
      action: "Report Safely",
    },
    {
      icon: "💡",
      title: "Safety Tips",
      description:
        "Access practical safety guides and awareness resources for everyday situations.",
      link: "/safety-tips",
      action: "Read Tips",
    },
    {
      icon: "🥋",
      title: "Self Defense",
      description:
        "Learn basic awareness, escape and personal safety techniques.",
      link: "/self-defense",
      action: "Learn More",
    },
  ];

  const steps = [
    {
      number: "01",
      icon: "👤",
      title: "Create Your Account",
      description:
        "Register with ShaktiShield and create your personal safety profile.",
    },
    {
      number: "02",
      icon: "📞",
      title: "Add Trusted Contacts",
      description:
        "Add family members or friends who can receive emergency alerts.",
    },
    {
      number: "03",
      icon: "🛡️",
      title: "Stay Protected",
      description:
        "Use SOS, safety resources and emergency services whenever you need them.",
    },
  ];

  return (
    <div>

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <header
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #9333ea 0%, #7e22ce 55%, #581c87 100%)",
          color: "white",
          padding: "5rem 0 6rem",
        }}
      >

        {/* Decorative circles */}

        <div
          style={{
            position: "absolute",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: "rgb(255 255 255 / 0.06)",
            top: "-150px",
            right: "-100px",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "rgb(255 255 255 / 0.05)",
            bottom: "-120px",
            left: "-80px",
          }}
        />

        <div
          className="container"
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
          }}
        >

          {/* Logo */}

          <div
            style={{
              width: "78px",
              height: "78px",
              margin: "0 auto 1.5rem",
              borderRadius: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgb(255 255 255 / 0.15)",
              border:
                "1px solid rgb(255 255 255 / 0.2)",
              fontSize: "2.4rem",
              backdropFilter: "blur(10px)",
            }}
          >
            🛡️
          </div>

          <span
            style={{
              display: "inline-block",
              marginBottom: "1rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "2px",
              opacity: 0.85,
            }}
          >
            PERSONAL SAFETY PLATFORM
          </span>

          <h1
            style={{
              fontSize:
                "clamp(2.5rem, 7vw, 4.5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: "1.25rem",
            }}
          >
            ShaktiShield
          </h1>

          <p
            style={{
              maxWidth: "720px",
              margin: "0 auto 2rem",
              fontSize:
                "clamp(1rem, 2vw, 1.25rem)",
              lineHeight: 1.7,
              opacity: 0.9,
            }}
          >
            Your personal safety companion.
            Stay connected, stay protected and
            stay empowered wherever you go.
          </p>

          {/* Buttons */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >

            <Link
              to="/register"
              className="btn"
              style={{
                background: "white",
                color: "var(--primary)",
                minWidth: "150px",
                padding: "0.8rem 1.4rem",
              }}
            >
              Get Started →
            </Link>

            <Link
              to="/login"
              className="btn btn-outline"
              style={{
                borderColor: "white",
                color: "white",
                minWidth: "120px",
                padding: "0.8rem 1.4rem",
              }}
            >
              Login
            </Link>

          </div>

          {/* Trust message */}

          <p
            style={{
              marginTop: "1.5rem",
              fontSize: "0.78rem",
              opacity: 0.75,
            }}
          >
            🔒 Your safety and privacy matter to us.
          </p>

        </div>
      </header>

      {/* =====================================================
          INTRODUCTION
      ===================================================== */}

      <section
        className="container"
        style={{
          padding:
            "4rem 1.5rem 2rem",
          textAlign: "center",
        }}
      >

        <span className="section-label">
          WHY SHAKTISHIELD?
        </span>

        <h2
          style={{
            fontSize:
              "clamp(1.8rem, 4vw, 2.5rem)",
            marginBottom: "1rem",
          }}
        >
          Safety at your fingertips
        </h2>

        <p
          style={{
            maxWidth: "700px",
            margin: "0 auto",
            color: "var(--text-muted)",
            lineHeight: 1.8,
          }}
        >
          ShaktiShield brings essential personal
          safety tools together in one easy-to-use
          platform. From emergency SOS to safety
          education, everything is designed to help
          you feel more prepared and connected.
        </p>

      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section
        className="container"
        style={{
          padding: "2rem 1.5rem 5rem",
        }}
      >

        <div className="grid grid-3">

          {features.map((feature) => (

            <div
              key={feature.title}
              className="card"
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                textAlign: "center",
                padding: "2rem 1.5rem",
                border:
                  "1px solid rgb(147 51 234 / 0.08)",
                transition:
                  "transform 0.25s ease, box-shadow 0.25s ease",
              }}
            >

              {/* Icon */}

              <div
                style={{
                  width: "64px",
                  height: "64px",
                  margin: "0 auto 1.2rem",
                  borderRadius: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "rgb(147 51 234 / 0.08)",
                  fontSize: "1.8rem",
                }}
              >
                {feature.icon}
              </div>

              <h3
                style={{
                  marginBottom: "0.6rem",
                  fontSize: "1.15rem",
                }}
              >
                {feature.title}
              </h3>

              <p
                style={{
                  flex: 1,
                  color: "var(--text-muted)",
                  fontSize: "0.88rem",
                  lineHeight: 1.7,
                  marginBottom: "1.25rem",
                }}
              >
                {feature.description}
              </p>

              <Link
                to={feature.link}
                className="read-more-button"
              >
                {feature.action} →
              </Link>

            </div>

          ))}

        </div>

      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section
        style={{
          background: "#ffffff",
          borderTop:
            "1px solid var(--border)",
          borderBottom:
            "1px solid var(--border)",
        }}
      >

        <div
          className="container"
          style={{
            padding: "5rem 1.5rem",
          }}
        >

          <div
            style={{
              textAlign: "center",
              marginBottom: "3rem",
            }}
          >

            <span className="section-label">
              SIMPLE & QUICK
            </span>

            <h2
              style={{
                fontSize:
                  "clamp(1.8rem, 4vw, 2.5rem)",
                marginBottom: "0.75rem",
              }}
            >
              How ShaktiShield Works
            </h2>

            <p
              style={{
                color: "var(--text-muted)",
              }}
            >
              Get started in just three simple steps.
            </p>

          </div>

          <div className="grid grid-3">

            {steps.map((step) => (

              <div
                key={step.number}
                style={{
                  position: "relative",
                  textAlign: "center",
                  padding: "1rem",
                }}
              >

                <span
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "var(--primary-light)",
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    letterSpacing: "2px",
                  }}
                >
                  STEP {step.number}
                </span>

                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    margin: "0 auto 1rem",
                    borderRadius: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background:
                      "rgb(147 51 234 / 0.08)",
                    fontSize: "1.7rem",
                  }}
                >
                  {step.icon}
                </div>

                <h3
                  style={{
                    marginBottom: "0.5rem",
                  }}
                >
                  {step.title}
                </h3>

                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.88rem",
                    lineHeight: 1.7,
                  }}
                >
                  {step.description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          CTA
      ===================================================== */}

      <section
        style={{
          background:
            "linear-gradient(135deg, #faf5ff, #ffffff)",
        }}
      >

        <div
          className="container"
          style={{
            padding: "5rem 1.5rem",
            textAlign: "center",
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
                "rgb(147 51 234 / 0.1)",
              fontSize: "2rem",
            }}
          >
            🛡️
          </div>

          <h2
            style={{
              fontSize:
                "clamp(1.8rem, 4vw, 2.5rem)",
              marginBottom: "0.75rem",
            }}
          >
            Your safety matters.
          </h2>

          <p
            style={{
              maxWidth: "600px",
              margin: "0 auto 1.5rem",
              color: "var(--text-muted)",
              lineHeight: 1.7,
            }}
          >
            Be prepared before an emergency happens.
            Create your ShaktiShield account and set
            up your safety network today.
          </p>

          <Link
            to="/register"
            className="btn btn-primary"
            style={{
              padding: "0.8rem 1.5rem",
            }}
          >
            Create Your Account →
          </Link>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        style={{
          background: "#1e1b4b",
          color: "white",
        }}
      >

        <div
          className="container"
          style={{
            padding: "2.5rem 1.5rem",
            textAlign: "center",
          }}
        >

          <div
            style={{
              fontSize: "1.5rem",
              marginBottom: "0.5rem",
            }}
          >
            🛡️ ShaktiShield
          </div>

          <p
            style={{
              color: "rgb(255 255 255 / 0.7)",
              fontSize: "0.85rem",
              marginBottom: "1rem",
            }}
          >
            Your personal safety companion.
          </p>

          <div
            style={{
              height: "1px",
              background:
                "rgb(255 255 255 / 0.1)",
              marginBottom: "1rem",
            }}
          />

          <p
            style={{
              color: "rgb(255 255 255 / 0.55)",
              fontSize: "0.75rem",
            }}
          >
            © 2026 ShaktiShield. Empowering people
            to stay safe, connected and prepared.
          </p>

        </div>

      </footer>

    </div>
  );
};

export default Home;