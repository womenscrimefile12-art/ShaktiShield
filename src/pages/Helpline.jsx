import { useMemo, useState } from "react";

const helplines = [
  {
    name: "Emergency Response",
    number: "112",
    description:
      "Unified emergency number for police, fire, ambulance and other emergency services.",
    icon: "🚨",
    category: "Emergency",
    priority: true,
  },
  {
    name: "Women Helpline",
    number: "181",
    description:
      "Women Helpline providing emergency and non-emergency support and connecting women with appropriate services.",
    icon: "👩",
    category: "Women",
    priority: true,
  },
  {
    name: "Police Emergency",
    number: "100",
    description:
      "Police emergency helpline.",
    icon: "👮",
    category: "Emergency",
    priority: false,
  },
  {
    name: "Cyber Crime Helpline",
    number: "1930",
    description:
      "Report cyber crimes, online harassment and financial cyber fraud.",
    icon: "💻",
    category: "Cyber",
    priority: true,
  },
  {
    name: "Child Helpline",
    number: "1098",
    description:
      "Child protection and emergency support helpline.",
    icon: "🧒",
    category: "Child",
    priority: false,
  },
  {
    name: "Domestic Violence Support",
    number: "181",
    description:
      "Support and assistance for women experiencing domestic violence and abuse.",
    icon: "🛡️",
    category: "Women",
    priority: false,
  },
  {
    name: "National Commission for Women",
    number: "7827170170",
    description:
      "National Commission for Women helpline for women's rights and complaints.",
    icon: "⚖️",
    category: "Women",
    priority: false,
  },
  {
    name: "Senior Citizen Helpline",
    number: "14567",
    description:
      "Support and assistance for senior citizens, including elder abuse concerns.",
    icon: "👵",
    category: "Senior Citizens",
    priority: false,
  },
  {
    name: "Tele-MANAS",
    number: "14416",
    description:
      "Government mental health support and tele-counselling service.",
    icon: "🧠",
    category: "Mental Health",
    priority: false,
  },
];

const Helpline = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(helplines.map((item) => item.category)),
    ];
  }, []);

  const filteredHelplines = useMemo(() => {
    const query = search.trim().toLowerCase();

    return helplines.filter((helpline) => {
      const matchesSearch =
        !query ||
        helpline.name.toLowerCase().includes(query) ||
        helpline.number
          .toLowerCase()
          .includes(query) ||
        helpline.description
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        category === "All" ||
        helpline.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [search, category]);

  const handleCall = (number) => {
    window.location.href = `tel:${number}`;
  };

  return (
    <div className="safety-tips-page">

      {/* =========================================
          HEADER
      ========================================= */}

      <div className="page-header">

        <span className="section-label">
          EMERGENCY SUPPORT
        </span>

        <h1 className="page-title">
          Helpline Numbers
        </h1>

        <p className="page-description">
          Quick access to important emergency,
          women-safety, cybercrime, child-protection
          and support helplines in India.
        </p>

      </div>

      {/* =========================================
          EMERGENCY BANNER
      ========================================= */}

      <div
        className="card"
        style={{
          marginBottom: "1.5rem",
          background:
            "linear-gradient(135deg, #fef2f2, #ffffff)",
          border:
            "1px solid rgb(239 68 68 / 0.2)",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >

          <div
            style={{
              width: "52px",
              height: "52px",
              minWidth: "52px",
              borderRadius: "14px",
              background:
                "rgb(239 68 68 / 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
            }}
          >
            🚨
          </div>

          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: "1.15rem",
                marginBottom: "0.25rem",
              }}
            >
              Immediate Emergency?
            </h2>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.85rem",
              }}
            >
              Call the national emergency number
              for immediate assistance.
            </p>
          </div>

          <a
            href="tel:112"
            className="btn btn-danger"
            style={{
              minWidth: "130px",
            }}
          >
            📞 Call 112
          </a>

        </div>

      </div>

      {/* =========================================
          SEARCH
      ========================================= */}

      <div className="safety-controls">

        <div className="search-box">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="search"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search helpline, service or number..."
            aria-label="Search helplines"
          />

          {search && (
            <button
              type="button"
              className="clear-search"
              onClick={() => setSearch("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}

        </div>

      </div>

      {/* =========================================
          CATEGORIES
      ========================================= */}

      <div className="category-list">

        {categories.map((item) => (
          <button
            key={item}
            type="button"
            className={`category-button ${
              category === item ? "active" : ""
            }`}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}

      </div>

      {/* =========================================
          RESULTS
      ========================================= */}

      <div className="results-info">
        Showing{" "}
        <strong>
          {filteredHelplines.length}
        </strong>{" "}
        {filteredHelplines.length === 1
          ? "helpline"
          : "helplines"}
      </div>

      {/* =========================================
          HELPLINE GRID
      ========================================= */}

      {filteredHelplines.length === 0 ? (

        <div className="card empty-state">

          <div className="empty-state-icon">
            🔍
          </div>

          <h3>
            No Helplines Found
          </h3>

          <p>
            No helpline matches your search.
            Try another keyword or category.
          </p>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setSearch("");
              setCategory("All");
            }}
          >
            Clear Filters
          </button>

        </div>

      ) : (

        <div className="grid grid-2">

          {filteredHelplines.map((helpline) => (

            <div
              key={`${helpline.name}-${helpline.number}`}
              className="card"
              style={{
                position: "relative",
                overflow: "hidden",
                borderLeft: helpline.priority
                  ? "4px solid var(--danger)"
                  : "4px solid var(--primary)",
              }}
            >

              {/* PRIORITY LABEL */}

              {helpline.priority && (
                <span
                  className="badge badge-active"
                  style={{
                    position: "absolute",
                    top: "1rem",
                    right: "1rem",
                  }}
                >
                  Important
                </span>
              )}

              {/* HEADER */}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.9rem",
                  marginBottom: "1rem",
                  paddingRight:
                    helpline.priority
                      ? "5rem"
                      : "0",
                }}
              >

                <div
                  className="safety-icon"
                  style={{
                    flexShrink: 0,
                  }}
                >
                  {helpline.icon}
                </div>

                <div>

                  <h3
                    style={{
                      fontSize: "1.05rem",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {helpline.name}
                  </h3>

                  <span className="article-category">
                    {helpline.category}
                  </span>

                </div>

              </div>

              {/* NUMBER */}

              <div
                style={{
                  padding: "0.9rem 1rem",
                  marginBottom: "0.9rem",
                  borderRadius: "10px",
                  background:
                    "rgb(147 51 234 / 0.05)",
                  textAlign: "center",
                }}
              >

                <a
                  href={`tel:${helpline.number}`}
                  style={{
                    color: "var(--primary)",
                    fontSize: "1.7rem",
                    fontWeight: 800,
                    letterSpacing: "0.5px",
                  }}
                  aria-label={`Call ${helpline.name}`}
                >
                  {helpline.number}
                </a>

              </div>

              {/* DESCRIPTION */}

              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                  minHeight: "45px",
                  marginBottom: "1rem",
                }}
              >
                {helpline.description}
              </p>

              {/* CALL BUTTON */}

              <button
                type="button"
                className={
                  helpline.priority
                    ? "btn btn-danger"
                    : "btn btn-primary"
                }
                onClick={() =>
                  handleCall(helpline.number)
                }
                style={{
                  width: "100%",
                }}
              >
                📞 Call Now
              </button>

            </div>

          ))}

        </div>

      )}

      {/* =========================================
          SAFETY INFORMATION
      ========================================= */}

      <div
        className="card"
        style={{
          marginTop: "2rem",
          background:
            "linear-gradient(135deg, #faf5ff, #ffffff)",
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
              fontSize: "1.3rem",
            }}
          >
            🛡️
          </span>

          <div>

            <h3
              style={{
                marginBottom: "0.4rem",
              }}
            >
              Important Safety Information
            </h3>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.82rem",
                lineHeight: 1.7,
              }}
            >
              Helpline availability and services can
              change. In an immediate emergency, use
              the appropriate emergency service. This
              page is intended to provide quick access
              to publicly listed support numbers.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Helpline;