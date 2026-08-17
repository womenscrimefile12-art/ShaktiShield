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
      accent: "#ef4444",
    },
    {
      icon: "📍",
      title: "Find Safe Places",
      description:
        "Discover nearby police stations, hospitals and important safety locations when you need them.",
      link: "/login",
      action: "Explore Places",
      accent: "#3b82f6",
    },
    {
      icon: "📞",
      title: "Emergency Contacts",
      description:
        "Create and manage trusted people who can be contacted quickly during an emergency.",
      link: "/login",
      action: "Manage Contacts",
      accent: "#9333ea",
    },
    {
      icon: "📝",
      title: "Incident Reporting",
      description:
        "Report safety incidents and contribute to creating safer and more aware communities.",
      link: "/login",
      action: "Report Safely",
      accent: "#f59e0b",
    },
    {
      icon: "💡",
      title: "Safety Tips",
      description:
        "Access practical safety guides and awareness resources for everyday situations.",
      link: "/safety-tips",
      action: "Read Tips",
      accent: "#10b981",
    },
    {
      icon: "🥋",
      title: "Self Defense",
      description:
        "Learn basic awareness, escape and personal safety techniques for challenging situations.",
      link: "/self-defense",
      action: "Learn More",
      accent: "#ec4899",
    },
  ];

  const steps = [
    {
      number: "01",
      icon: "👤",
      title: "Create Your Account",
      description:
        "Build your personal ShaktiShield safety profile in just a few moments.",
    },
    {
      number: "02",
      icon: "📞",
      title: "Add Trusted Contacts",
      description:
        "Connect family members or friends who can be reached during an emergency.",
    },
    {
      number: "03",
      icon: "🛡️",
      title: "Stay Protected",
      description:
        "Use SOS, safety resources and emergency services whenever you need support.",
    },
  ];

  const emergencyNumbers = [
    {
      number: "112",
      title: "Emergency",
      description: "Police • Fire • Ambulance",
      icon: "🚨",
    },
    {
      number: "181",
      title: "Women Helpline",
      description: "Women support services",
      icon: "👩",
    },
    {
      number: "1930",
      title: "Cyber Crime",
      description: "Online fraud & cyber crime",
      icon: "💻",
    },
    {
      number: "1098",
      title: "Child Helpline",
      description: "Child protection support",
      icon: "🧒",
    },
  ];

  return (
    <div className="home-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 15% 20%, rgba(216,180,254,.22), transparent 30%), radial-gradient(circle at 85% 70%, rgba(255,255,255,.10), transparent 25%), linear-gradient(135deg,#581c87 0%,#7e22ce 45%,#9333ea 100%)",
          color: "white",
          minHeight: "650px",
          display: "flex",
          alignItems: "center",
        }}
      >

        {/* Background decorations */}

        <div
          style={{
            position: "absolute",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,.08)",
            top: "-230px",
            right: "-160px",
          }}
        />

        <div
          style={{
            position: "absolute",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,.07)",
            bottom: "-180px",
            left: "-130px",
          }}
        />

        <div
          className="container"
          style={{
            position: "relative",
            zIndex: 2,
            padding: "5rem 1.5rem",
          }}
        >

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0,1.2fr) minmax(300px,.8fr)",
              gap: "4rem",
              alignItems: "center",
            }}
          >

            {/* LEFT */}

            <div>

              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".55rem",
                  padding: ".45rem .85rem",
                  borderRadius: "999px",
                  background: "rgba(255,255,255,.10)",
                  border: "1px solid rgba(255,255,255,.18)",
                  backdropFilter: "blur(12px)",
                  marginBottom: "1.4rem",
                  fontSize: ".72rem",
                  fontWeight: 700,
                  letterSpacing: "1.5px",
                }}
              >
                <span>🛡️</span>
                PERSONAL SAFETY PLATFORM
              </div>

              <h1
                style={{
                  fontSize:
                    "clamp(3rem,7vw,5.8rem)",
                  lineHeight: 1,
                  fontWeight: 850,
                  letterSpacing: "-3px",
                  marginBottom: "1.5rem",
                }}
              >
                Your safety.
                <br />
                <span
                  style={{
                    color: "#e9d5ff",
                  }}
                >
                  Your shield.
                </span>
              </h1>

              <p
                style={{
                  maxWidth: "650px",
                  fontSize:
                    "clamp(1rem,2vw,1.2rem)",
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,.82)",
                  marginBottom: "2rem",
                }}
              >
                ShaktiShield brings emergency response,
                trusted contacts, safety resources and
                location-based assistance together in one
                platform designed to help you stay prepared.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: ".8rem",
                  flexWrap: "wrap",
                }}
              >

                <Link
                  to="/register"
                  className="btn"
                  style={{
                    background: "white",
                    color: "#7e22ce",
                    padding: ".9rem 1.5rem",
                    borderRadius: "12px",
                    fontWeight: 750,
                    boxShadow:
                      "0 12px 30px rgba(0,0,0,.18)",
                  }}
                >
                  Get Protected →
                </Link>

                <Link
                  to="/safety-tips"
                  className="btn"
                  style={{
                    background:
                      "rgba(255,255,255,.10)",
                    color: "white",
                    border:
                      "1px solid rgba(255,255,255,.25)",
                    padding: ".9rem 1.5rem",
                    borderRadius: "12px",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  Explore Safety
                </Link>

              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1.5rem",
                  flexWrap: "wrap",
                  marginTop: "2rem",
                  color: "rgba(255,255,255,.72)",
                  fontSize: ".78rem",
                }}
              >
                <span>✓ Emergency assistance</span>
                <span>✓ Trusted contacts</span>
                <span>✓ Safety resources</span>
              </div>

            </div>

            {/* RIGHT — SOS VISUAL */}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >

              <div
                style={{
                  width: "min(360px,90vw)",
                  height: "360px",
                  borderRadius: "40px",
                  background:
                    "rgba(255,255,255,.09)",
                  border:
                    "1px solid rgba(255,255,255,.18)",
                  backdropFilter: "blur(20px)",
                  boxShadow:
                    "0 30px 80px rgba(0,0,0,.25)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >

                <div
                  style={{
                    position: "absolute",
                    width: "250px",
                    height: "250px",
                    borderRadius: "50%",
                    border:
                      "1px solid rgba(255,255,255,.12)",
                  }}
                />

                <div
                  style={{
                    width: "155px",
                    height: "155px",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(145deg,#ef4444,#b91c1c)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "4rem",
                    boxShadow:
                      "0 0 0 15px rgba(239,68,68,.12), 0 20px 50px rgba(0,0,0,.3)",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  🆘
                </div>

                <h3
                  style={{
                    marginTop: "1.5rem",
                    marginBottom: ".3rem",
                    fontSize: "1.3rem",
                  }}
                >
                  Emergency SOS
                </h3>

                <p
                  style={{
                    color: "rgba(255,255,255,.65)",
                    fontSize: ".82rem",
                  }}
                >
                  Help when you need it most
                </p>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          TRUST STRIP
      ===================================================== */}

      <section
        style={{
          background: "#fff",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          className="container"
          style={{
            padding: "1.4rem 1.5rem",
            display: "flex",
            justifyContent: "center",
            gap: "2.5rem",
            flexWrap: "wrap",
            color: "var(--text-muted)",
            fontSize: ".8rem",
            fontWeight: 600,
          }}
        >
          <span>🛡️ Safety First</span>
          <span>🔒 Privacy Focused</span>
          <span>📍 Location Assistance</span>
          <span>🚨 Emergency Ready</span>
        </div>
      </section>

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section
        className="container"
        style={{
          padding: "5rem 1.5rem 2.5rem",
          textAlign: "center",
        }}
      >

        <span className="section-label">
          WHY SHAKTISHIELD?
        </span>

        <h2
          style={{
            fontSize:
              "clamp(2rem,4vw,3rem)",
            letterSpacing: "-1px",
            marginBottom: "1rem",
          }}
        >
          Safety tools. One trusted platform.
        </h2>

        <p
          style={{
            maxWidth: "720px",
            margin: "0 auto",
            color: "var(--text-muted)",
            lineHeight: 1.8,
          }}
        >
          From emergency response to everyday safety
          education, ShaktiShield helps you prepare,
          respond and stay connected.
        </p>

      </section>

      {/* =====================================================
          FEATURES
      ===================================================== */}

      <section
        className="container"
        style={{
          padding: "1.5rem 1.5rem 5rem",
        }}
      >

        <div className="grid grid-3">

          {features.map((feature) => (

            <div
              key={feature.title}
              className="card"
              style={{
                position: "relative",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                height: "100%",
                padding: "1.8rem",
                border:
                  "1px solid rgba(147,51,234,.08)",
                transition:
                  "transform .25s ease, box-shadow .25s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-7px)";
                e.currentTarget.style.boxShadow =
                  "0 20px 45px rgba(0,0,0,.10)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform =
                  "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "";
              }}
            >

              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: feature.accent,
                }}
              />

              <div
                style={{
                  width: "58px",
                  height: "58px",
                  borderRadius: "17px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `${feature.accent}12`,
                  fontSize: "1.7rem",
                  marginBottom: "1.2rem",
                }}
              >
                {feature.icon}
              </div>

              <h3
                style={{
                  fontSize: "1.15rem",
                  marginBottom: ".6rem",
                }}
              >
                {feature.title}
              </h3>

              <p
                style={{
                  flex: 1,
                  color: "var(--text-muted)",
                  fontSize: ".87rem",
                  lineHeight: 1.7,
                  marginBottom: "1.3rem",
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
          EMERGENCY NUMBERS
      ===================================================== */}

      <section
        style={{
          background:
            "linear-gradient(135deg,#faf5ff,#ffffff)",
          borderTop:
            "1px solid rgba(147,51,234,.08)",
          borderBottom:
            "1px solid rgba(147,51,234,.08)",
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
              marginBottom: "2.5rem",
            }}
          >

            <span className="section-label">
              QUICK ACCESS
            </span>

            <h2
              style={{
                fontSize:
                  "clamp(1.8rem,4vw,2.5rem)",
                marginBottom: ".6rem",
              }}
            >
              Important Emergency Numbers
            </h2>

            <p
              style={{
                color: "var(--text-muted)",
              }}
            >
              Keep these numbers accessible when you need
              immediate assistance.
            </p>

          </div>

          <div className="grid grid-4">

            {emergencyNumbers.map((item) => (

              <a
                href={`tel:${item.number}`}
                key={item.number}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >

                <div
                  className="card"
                  style={{
                    height: "100%",
                    textAlign: "center",
                    padding: "1.5rem 1rem",
                    transition:
                      "transform .2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-5px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(0)";
                  }}
                >

                  <div
                    style={{
                      fontSize: "1.8rem",
                      marginBottom: ".6rem",
                    }}
                  >
                    {item.icon}
                  </div>

                  <div
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: 850,
                      color: "var(--primary)",
                      marginBottom: ".2rem",
                    }}
                  >
                    {item.number}
                  </div>

                  <strong
                    style={{
                      display: "block",
                      marginBottom: ".25rem",
                    }}
                  >
                    {item.title}
                  </strong>

                  <span
                    style={{
                      color: "var(--text-muted)",
                      fontSize: ".72rem",
                    }}
                  >
                    {item.description}
                  </span>

                </div>

              </a>

            ))}

          </div>

        </div>

      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section
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
                "clamp(1.8rem,4vw,2.5rem)",
            }}
          >
            Get protected in three steps
          </h2>

        </div>

        <div className="grid grid-3">

          {steps.map((step, index) => (

            <div
              key={step.number}
              style={{
                position: "relative",
                textAlign: "center",
                padding: "1.5rem",
              }}
            >

              <div
                style={{
                  width: "72px",
                  height: "72px",
                  margin: "0 auto 1rem",
                  borderRadius: "22px",
                  background:
                    "linear-gradient(135deg,#f3e8ff,#faf5ff)",
                  border:
                    "1px solid rgba(147,51,234,.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.8rem",
                }}
              >
                {step.icon}
              </div>

              <span
                style={{
                  color: "var(--primary)",
                  fontSize: ".7rem",
                  fontWeight: 800,
                  letterSpacing: "2px",
                }}
              >
                STEP {step.number}
              </span>

              <h3
                style={{
                  margin: ".5rem 0",
                }}
              >
                {step.title}
              </h3>

              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: ".87rem",
                  lineHeight: 1.7,
                }}
              >
                {step.description}
              </p>

              {index < steps.length - 1 && (
                <span
                  style={{
                    position: "absolute",
                    top: "50px",
                    right: "-20px",
                    color:
                      "rgba(147,51,234,.25)",
                    fontSize: "1.5rem",
                  }}
                >
                  →
                </span>
              )}

            </div>

          ))}

        </div>

      </section>

      {/* =====================================================
          SAFETY PHILOSOPHY
      ===================================================== */}

      <section
        style={{
          background: "#181026",
          color: "white",
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
              display: "grid",
              gridTemplateColumns:
                "minmax(0,1fr) minmax(280px,.8fr)",
              gap: "3rem",
              alignItems: "center",
            }}
          >

            <div>

              <span
                style={{
                  color: "#d8b4fe",
                  fontSize: ".72rem",
                  fontWeight: 800,
                  letterSpacing: "2px",
                }}
              >
                MORE THAN AN SOS BUTTON
              </span>

              <h2
                style={{
                  fontSize:
                    "clamp(2rem,4vw,3.2rem)",
                  lineHeight: 1.15,
                  margin: "1rem 0",
                }}
              >
                Prepare today.
                <br />
                Stay safer tomorrow.
              </h2>

              <p
                style={{
                  maxWidth: "620px",
                  color:
                    "rgba(255,255,255,.68)",
                  lineHeight: 1.8,
                }}
              >
                Personal safety is not only about what
                happens during an emergency. It is also
                about preparation, awareness, trusted
                connections and knowing where to find help.
              </p>

              <Link
                to="/safety-tips"
                className="btn"
                style={{
                  marginTop: "1.5rem",
                  background: "white",
                  color: "#7e22ce",
                  padding: ".8rem 1.4rem",
                }}
              >
                Explore Safety Resources →
              </Link>

            </div>

            <div
              style={{
                display: "grid",
                gap: ".8rem",
              }}
            >

              {[
                ["🧠", "Build awareness"],
                ["📞", "Stay connected"],
                ["📍", "Know safe places"],
                ["🚨", "Be emergency ready"],
              ].map(([icon, text]) => (

                <div
                  key={text}
                  style={{
                    padding: "1rem",
                    borderRadius: "14px",
                    background:
                      "rgba(255,255,255,.06)",
                    border:
                      "1px solid rgba(255,255,255,.08)",
                    display: "flex",
                    alignItems: "center",
                    gap: ".8rem",
                  }}
                >
                  <span>{icon}</span>
                  <strong>{text}</strong>
                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section
        style={{
          background:
            "linear-gradient(135deg,#faf5ff,#ffffff)",
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
              width: "75px",
              height: "75px",
              margin: "0 auto 1.2rem",
              borderRadius: "24px",
              background:
                "linear-gradient(135deg,#9333ea,#7e22ce)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "2rem",
              boxShadow:
                "0 15px 35px rgba(126,34,206,.25)",
            }}
          >
            🛡️
          </div>

          <h2
            style={{
              fontSize:
                "clamp(2rem,4vw,3rem)",
              marginBottom: ".8rem",
            }}
          >
            Your safety matters.
          </h2>

          <p
            style={{
              maxWidth: "600px",
              margin: "0 auto 1.5rem",
              color: "var(--text-muted)",
              lineHeight: 1.8,
            }}
          >
            Don't wait for an emergency to prepare.
            Create your safety network and keep the
            right resources within reach.
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: ".8rem",
              flexWrap: "wrap",
            }}
          >

            <Link
              to="/register"
              className="btn btn-primary"
              style={{
                padding: ".85rem 1.5rem",
              }}
            >
              Create Your Account →
            </Link>

            <Link
              to="/safety-tips"
              className="btn btn-outline"
              style={{
                padding: ".85rem 1.5rem",
              }}
            >
              Learn Safety Tips
            </Link>

          </div>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        style={{
          background: "#110d1c",
          color: "white",
        }}
      >

        <div
          className="container"
          style={{
            padding: "3rem 1.5rem 1.5rem",
          }}
        >

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0,1.5fr) repeat(2,minmax(130px,1fr))",
              gap: "2rem",
              paddingBottom: "2rem",
            }}
          >

            <div>

              <div
                style={{
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  marginBottom: ".7rem",
                }}
              >
                🛡️ ShaktiShield
              </div>

              <p
                style={{
                  maxWidth: "380px",
                  color:
                    "rgba(255,255,255,.55)",
                  fontSize: ".82rem",
                  lineHeight: 1.7,
                }}
              >
                A personal safety platform designed
                to help people stay connected,
                prepared and informed.
              </p>

            </div>

            <div>

              <strong>Explore</strong>

              <div
                style={{
                  display: "grid",
                  gap: ".6rem",
                  marginTop: ".8rem",
                  fontSize: ".8rem",
                }}
              >
                <Link
                  to="/safety-tips"
                  style={{
                    color:
                      "rgba(255,255,255,.55)",
                  }}
                >
                  Safety Tips
                </Link>

                <Link
                  to="/self-defense"
                  style={{
                    color:
                      "rgba(255,255,255,.55)",
                  }}
                >
                  Self Defense
                </Link>

                <Link
                  to="/helpline"
                  style={{
                    color:
                      "rgba(255,255,255,.55)",
                  }}
                >
                  Helplines
                </Link>
              </div>

            </div>

            <div>

              <strong>Account</strong>

              <div
                style={{
                  display: "grid",
                  gap: ".6rem",
                  marginTop: ".8rem",
                  fontSize: ".8rem",
                }}
              >

                <Link
                  to="/login"
                  style={{
                    color:
                      "rgba(255,255,255,.55)",
                  }}
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  style={{
                    color:
                      "rgba(255,255,255,.55)",
                  }}
                >
                  Create Account
                </Link>

              </div>

            </div>

          </div>

          <div
            style={{
              borderTop:
                "1px solid rgba(255,255,255,.08)",
              paddingTop: "1.2rem",
              textAlign: "center",
              color:
                "rgba(255,255,255,.4)",
              fontSize: ".72rem",
            }}
          >
            © 2026 ShaktiShield · Empowering people
            to stay safe, connected and prepared.
          </div>

        </div>

      </footer>

    </div>
  );
};

export default Home;