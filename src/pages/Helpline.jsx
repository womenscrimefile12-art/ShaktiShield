import { useMemo, useState } from "react";

/* =========================================================
   SHAKTISHIELD HELPLINES
   Frontend-only static helpline directory
========================================================= */

const helplines = [
  {
    name: "Emergency Response",
    number: "112",
    description:
      "Unified emergency response for police, fire, ambulance and other urgent assistance.",
    icon: "🚨",
    category: "Emergency",
    priority: true,
    location: "India",
  },

  {
    name: "Police Emergency",
    number: "100",
    description:
      "Police emergency assistance for crimes, threats, violence and immediate safety concerns.",
    icon: "👮",
    category: "Emergency",
    priority: true,
    location: "India",
  },

  {
    name: "Women Helpline",
    number: "181",
    description:
      "Support for women facing violence, harassment, domestic abuse and other safety concerns.",
    icon: "👩",
    category: "Women",
    priority: true,
    location: "India",
  },

  {
    name: "Cyber Crime Helpline",
    number: "1930",
    description:
      "Report cybercrime, online harassment, digital fraud and financial cybercrime.",
    icon: "💻",
    category: "Cyber",
    priority: true,
    location: "India",
  },

  {
    name: "Child Helpline",
    number: "1098",
    description:
      "Emergency child protection and assistance for children facing abuse, exploitation or danger.",
    icon: "🧒",
    category: "Child",
    priority: true,
    location: "India",
  },

  {
    name: "Domestic Violence Support",
    number: "181",
    description:
      "Women experiencing domestic violence can seek support and assistance through the Women Helpline.",
    icon: "🛡️",
    category: "Women",
    priority: true,
    location: "India",
  },

  {
    name: "National Commission for Women",
    number: "7827170170",
    description:
      "Helpline associated with women's rights, complaints and support.",
    icon: "⚖️",
    category: "Women",
    priority: false,
    location: "India",
  },

  {
    name: "Senior Citizen Helpline",
    number: "14567",
    description:
      "Support for senior citizens, including assistance related to elder abuse and welfare.",
    icon: "👵",
    category: "Senior Citizens",
    priority: false,
    location: "India",
  },

  {
    name: "Tele-MANAS",
    number: "14416",
    description:
      "Government mental-health support and tele-counselling service.",
    icon: "🧠",
    category: "Health",
    priority: false,
    location: "India",
  },

  {
    name: "Ambulance",
    number: "108",
    description:
      "Emergency ambulance service for urgent medical situations in many parts of India.",
    icon: "🚑",
    category: "Medical",
    priority: true,
    location: "India",
  },

  {
    name: "Railway Security / Assistance",
    number: "139",
    description:
      "Railway assistance and passenger support. Use 112 for an immediate emergency.",
    icon: "🚆",
    category: "Transport",
    priority: false,
    location: "India",
  },

  {
    name: "Fire Emergency",
    number: "101",
    description:
      "Fire and rescue emergency assistance.",
    icon: "🔥",
    category: "Emergency",
    priority: true,
    location: "India",
  },

  {
    name: "Road Accident Emergency",
    number: "112",
    description:
      "For immediate road accidents or dangerous situations, call the unified emergency number.",
    icon: "🚗",
    category: "Emergency",
    priority: true,
    location: "India",
  },

  {
    name: "Bihar Police Emergency",
    number: "100",
    description:
      "Police emergency assistance available in Bihar. For unified emergency response, call 112.",
    icon: "🚔",
    category: "Bihar",
    priority: true,
    location: "Bihar",
  },

  {
    name: "Bihar Women Helpline",
    number: "181",
    description:
      "Women can use the Women Helpline for assistance and support in Bihar.",
    icon: "👩‍🦰",
    category: "Bihar",
    priority: true,
    location: "Bihar",
  },
];

/* =========================================================
   CATEGORY CONFIG
========================================================= */

const categoryConfig = {
  All: {
    icon: "🌎",
  },

  Emergency: {
    icon: "🚨",
  },

  Women: {
    icon: "👩",
  },

  Bihar: {
    icon: "📍",
  },

  Cyber: {
    icon: "💻",
  },

  Child: {
    icon: "🧒",
  },

  Medical: {
    icon: "🏥",
  },

  Health: {
    icon: "🧠",
  },

  Transport: {
    icon: "🚆",
  },

  "Senior Citizens": {
    icon: "👵",
  },
};

/* =========================================================
   COMPONENT
========================================================= */

const Helpline = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [copiedNumber, setCopiedNumber] = useState("");

  /* =======================================================
     CATEGORIES
  ======================================================= */

  const categories = useMemo(() => {
    return [
      "All",
      ...new Set(
        helplines.map(
          (item) => item.category
        )
      ),
    ];
  }, []);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredHelplines = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return helplines.filter(
      (helpline) => {
        const matchesSearch =
          !query ||
          helpline.name
            .toLowerCase()
            .includes(query) ||
          helpline.number
            .toLowerCase()
            .includes(query) ||
          helpline.description
            .toLowerCase()
            .includes(query) ||
          helpline.location
            .toLowerCase()
            .includes(query);

        const matchesCategory =
          category === "All" ||
          helpline.category ===
            category;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );
  }, [search, category]);

  /* =======================================================
     CALL
  ======================================================= */

  const handleCall = (number) => {
    window.location.href =
      `tel:${number}`;
  };

  /* =======================================================
     COPY
  ======================================================= */

  const handleCopy = async (
    number
  ) => {
    try {
      await navigator.clipboard.writeText(
        number
      );

      setCopiedNumber(number);

      setTimeout(() => {
        setCopiedNumber("");
      }, 1800);
    } catch (error) {
      console.error(
        "Unable to copy:",
        error
      );
    }
  };

  /* =======================================================
     CLEAR
  ======================================================= */

  const clearFilters = () => {
    setSearch("");
    setCategory("All");
  };

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="helpline-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="helpline-header">

        <div>

          <span className="section-label">
            SHAKTISHIELD EMERGENCY NETWORK
          </span>

          <h1 className="page-title">
            Emergency Helpline Numbers
          </h1>

          <p className="page-description">
            Quick access to emergency,
            women-safety, cybercrime,
            medical, child-protection and
            public support services across
            India, with additional Bihar
            resources.
          </p>

        </div>

        <div className="header-badge">
          🇮🇳 India Support
        </div>

      </div>

      {/* =================================================
          EMERGENCY BANNER
      ================================================= */}

      <div className="emergency-banner">

        <div className="emergency-icon">
          🚨
        </div>

        <div className="emergency-content">

          <h2>
            Immediate Emergency?
          </h2>

          <p>
            If you are in immediate danger,
            call <strong>112</strong> for
            emergency assistance.
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
          QUICK ACTIONS
      ================================================= */}

      <div className="quick-actions">

        <a
          href="tel:112"
          className="quick-action emergency"
        >
          <span>🚨</span>
          <div>
            <strong>Emergency</strong>
            <small>112</small>
          </div>
        </a>

        <a
          href="tel:181"
          className="quick-action women"
        >
          <span>👩</span>
          <div>
            <strong>Women Helpline</strong>
            <small>181</small>
          </div>
        </a>

        <a
          href="tel:1930"
          className="quick-action cyber"
        >
          <span>💻</span>
          <div>
            <strong>Cyber Crime</strong>
            <small>1930</small>
          </div>
        </a>

        <a
          href="tel:108"
          className="quick-action medical"
        >
          <span>🚑</span>
          <div>
            <strong>Ambulance</strong>
            <small>108</small>
          </div>
        </a>

      </div>

      {/* =================================================
          SEARCH / FILTER
      ================================================= */}

      <div className="controls-card">

        <div className="search-wrapper">

          <span className="search-symbol">
            🔍
          </span>

          <input
            type="search"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search helpline, service, number or location..."
          />

          {search && (
            <button
              type="button"
              className="clear-button"
              onClick={() =>
                setSearch("")
              }
            >
              ×
            </button>
          )}

        </div>

        <div className="category-scroll">

          {categories.map(
            (item) => {

              const config =
                categoryConfig[
                  item
                ] || {
                  icon: "📞",
                };

              return (
                <button
                  key={item}
                  type="button"
                  className={
                    category === item
                      ? "category-button active"
                      : "category-button"
                  }
                  onClick={() =>
                    setCategory(item)
                  }
                >
                  {config.icon}{" "}
                  {item}
                </button>
              );
            }
          )}

        </div>

      </div>

      {/* =================================================
          RESULTS SUMMARY
      ================================================= */}

      <div className="results-header">

        <div>

          <h2>
            Available Support
          </h2>

          <p>
            Showing{" "}
            <strong>
              {filteredHelplines.length}
            </strong>{" "}
            {filteredHelplines.length ===
            1
              ? "service"
              : "services"}
          </p>

        </div>

        {(search ||
          category !== "All") && (
          <button
            type="button"
            className="reset-button"
            onClick={
              clearFilters
            }
          >
            Clear Filters
          </button>
        )}

      </div>

      {/* =================================================
          EMPTY
      ================================================= */}

      {filteredHelplines.length ===
      0 ? (

        <div className="empty-state">

          <div className="empty-icon">
            🔎
          </div>

          <h3>
            No Helplines Found
          </h3>

          <p>
            Try another search term
            or choose a different
            category.
          </p>

          <button
            type="button"
            onClick={
              clearFilters
            }
          >
            Show All Helplines
          </button>

        </div>

      ) : (

        <div className="helpline-grid">

          {filteredHelplines.map(
            (helpline) => (

              <div
                key={`${helpline.name}-${helpline.number}`}
                className={
                  helpline.priority
                    ? "helpline-card priority-card"
                    : "helpline-card"
                }
              >

                {/* PRIORITY */}

                {helpline.priority && (
                  <div className="priority-label">
                    🚨 Important
                  </div>
                )}

                {/* TOP */}

                <div className="helpline-top">

                  <div className="helpline-icon">
                    {helpline.icon}
                  </div>

                  <div className="helpline-title">

                    <h3>
                      {helpline.name}
                    </h3>

                    <span>
                      {helpline.category}
                    </span>

                  </div>

                </div>

                {/* LOCATION */}

                <div className="location-tag">
                  📍 {helpline.location}
                </div>

                {/* NUMBER */}

                <div className="number-box">

                  <a
                    href={`tel:${helpline.number}`}
                    className="number"
                  >
                    {helpline.number}
                  </a>

                  <button
                    type="button"
                    className="copy-button"
                    onClick={() =>
                      handleCopy(
                        helpline.number
                      )
                    }
                    title="Copy number"
                  >
                    {copiedNumber ===
                    helpline.number
                      ? "✓"
                      : "📋"}
                  </button>

                </div>

                {copiedNumber ===
                  helpline.number && (
                  <div className="copied-message">
                    Number copied
                  </div>
                )}

                {/* DESCRIPTION */}

                <p className="helpline-description">
                  {helpline.description}
                </p>

                {/* ACTIONS */}

                <div className="helpline-actions">

                  <button
                    type="button"
                    className={
                      helpline.priority
                        ? "call-button danger"
                        : "call-button"
                    }
                    onClick={() =>
                      handleCall(
                        helpline.number
                      )
                    }
                  >
                    📞 Call Now
                  </button>

                  <button
                    type="button"
                    className="copy-action"
                    onClick={() =>
                      handleCopy(
                        helpline.number
                      )
                    }
                  >
                    📋 Copy
                  </button>

                </div>

              </div>

            )
          )}

        </div>

      )}

      {/* =================================================
          BIHAR / PATNA SECTION
      ================================================= */}

      <div className="bihar-card">

        <div className="bihar-icon">
          📍
        </div>

        <div>

          <span className="mini-label">
            BIHAR SAFETY SUPPORT
          </span>

          <h2>
            Need local assistance in Patna?
          </h2>

          <p>
            Use ShaktiShield's{" "}
            <strong>
              Nearby Places
            </strong>{" "}
            section to locate police
            stations, hospitals,
            pharmacies and other public
            facilities around your
            current GPS location.
          </p>

        </div>

      </div>

      {/* =================================================
          HOW TO USE
      ================================================= */}

      <div className="how-card">

        <div className="how-header">

          <div className="how-icon">
            🛡️
          </div>

          <div>

            <h2>
              How to Use ShaktiShield
              Helplines
            </h2>

            <p>
              Choose the service that best
              matches your situation.
            </p>

          </div>

        </div>

        <div className="steps">

          <div className="step">

            <span>1</span>

            <div>
              <strong>
                Identify the service
              </strong>

              <p>
                Select police, emergency,
                medical, cybercrime or
                another appropriate service.
              </p>
            </div>

          </div>

          <div className="step">

            <span>2</span>

            <div>
              <strong>
                Tap Call Now
              </strong>

              <p>
                Your phone's calling
                application will open with
                the number ready to call.
              </p>
            </div>

          </div>

          <div className="step">

            <span>3</span>

            <div>
              <strong>
                Explain your situation
              </strong>

              <p>
                Clearly explain where you
                are and what assistance you
                need.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          SAFETY NOTICE
      ================================================= */}

      <div className="safety-notice">

        <div className="notice-icon">
          ⚠️
        </div>

        <div>

          <h3>
            Important Safety Information
          </h3>

          <p>
            Helpline numbers, services and
            operating procedures can change.
            This directory is provided for
            quick access to publicly listed
            support numbers. In an immediate
            emergency, use <strong>112</strong>
            or the appropriate emergency
            service.
          </p>

          <p>
            ShaktiShield is not a replacement
            for official emergency services.
          </p>

        </div>

      </div>

      {/* =================================================
          CSS
      ================================================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .helpline-page {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 24px;
        }

        /* HEADER */

        .helpline-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 24px;
        }

        .section-label {
          display: inline-block;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 1.7px;
          color: var(--primary, #7c3aed);
          margin-bottom: 8px;
        }

        .page-title {
          margin: 0 0 10px;
          font-size: 34px;
          font-weight: 850;
          line-height: 1.15;
        }

        .page-description {
          max-width: 760px;
          margin: 0;
          color: var(--text-muted, #64748b);
          line-height: 1.65;
        }

        .header-badge {
          padding: 10px 14px;
          border-radius: 999px;
          background: #f5f3ff;
          border: 1px solid #ddd6fe;
          color: #6d28d9;
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        /* EMERGENCY */

        .emergency-banner {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          margin-bottom: 18px;
          border-radius: 18px;
          background:
            linear-gradient(
              135deg,
              #fff1f2,
              #ffffff
            );
          border: 1px solid #fecaca;
          box-shadow:
            0 8px 30px
            rgba(239, 68, 68, .08);
        }

        .emergency-icon {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 16px;
          background: #fee2e2;
          font-size: 29px;
        }

        .emergency-content {
          flex: 1;
        }

        .emergency-content h2 {
          margin: 0 0 4px;
          font-size: 18px;
        }

        .emergency-content p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.5;
        }

        .emergency-call {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 140px;
          padding: 12px 18px;
          border-radius: 11px;
          background: #dc2626;
          color: white;
          text-decoration: none;
          font-weight: 850;
          transition: .2s;
        }

        .emergency-call:hover {
          transform: translateY(-2px);
          background: #b91c1c;
        }

        /* QUICK ACTIONS */

        .quick-actions {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 22px;
        }

        .quick-action {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          border-radius: 15px;
          text-decoration: none;
          color: inherit;
          background: white;
          border: 1px solid #e2e8f0;
          transition: .2s;
        }

        .quick-action:hover {
          transform: translateY(-3px);
          box-shadow:
            0 10px 25px
            rgba(0,0,0,.07);
        }

        .quick-action > span {
          width: 43px;
          height: 43px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #f8fafc;
          font-size: 21px;
        }

        .quick-action strong {
          display: block;
          font-size: 13px;
        }

        .quick-action small {
          display: block;
          margin-top: 3px;
          color: #64748b;
          font-weight: 800;
        }

        .quick-action.emergency {
          border-left: 4px solid #dc2626;
        }

        .quick-action.women {
          border-left: 4px solid #db2777;
        }

        .quick-action.cyber {
          border-left: 4px solid #2563eb;
        }

        .quick-action.medical {
          border-left: 4px solid #16a34a;
        }

        /* CONTROLS */

        .controls-card {
          padding: 16px;
          margin-bottom: 22px;
          border-radius: 17px;
          background: white;
          border: 1px solid #e2e8f0;
        }

        .search-wrapper {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          margin-bottom: 14px;
        }

        .search-symbol {
          font-size: 17px;
        }

        .search-wrapper input {
          flex: 1;
          min-width: 0;
          border: none;
          outline: none;
          background: transparent;
          font-size: 14px;
          color: inherit;
        }

        .clear-button {
          width: 27px;
          height: 27px;
          border: none;
          border-radius: 50%;
          background: #f1f5f9;
          cursor: pointer;
          font-size: 17px;
        }

        .category-scroll {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .category-button {
          border: none;
          border-radius: 10px;
          padding: 9px 13px;
          background: #f1f5f9;
          color: #334155;
          cursor: pointer;
          font-weight: 750;
          font-size: 12px;
          transition: .2s;
        }

        .category-button:hover {
          background: #ede9fe;
          color: #6d28d9;
        }

        .category-button.active {
          background: #7c3aed;
          color: white;
          box-shadow:
            0 5px 14px
            rgba(124, 58, 237, .2);
        }

        /* RESULTS */

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .results-header h2 {
          margin: 0;
          font-size: 21px;
        }

        .results-header p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 13px;
        }

        .reset-button {
          border: none;
          border-radius: 9px;
          padding: 9px 13px;
          background: #f1f5f9;
          cursor: pointer;
          font-weight: 750;
        }

        /* GRID */

        .helpline-grid {
          display: grid;
          grid-template-columns:
            repeat(
              auto-fit,
              minmax(300px, 1fr)
            );
          gap: 17px;
        }

        /* CARD */

        .helpline-card {
          position: relative;
          overflow: hidden;
          padding: 19px;
          border-radius: 17px;
          background: white;
          border: 1px solid #e2e8f0;
          transition: .22s;
        }

        .helpline-card:hover {
          transform: translateY(-4px);
          box-shadow:
            0 15px 35px
            rgba(15, 23, 42, .09);
        }

        .priority-card {
          border-left: 4px solid #dc2626;
        }

        .helpline-card:not(.priority-card) {
          border-left: 4px solid #7c3aed;
        }

        .priority-label {
          position: absolute;
          top: 15px;
          right: 15px;
          padding: 5px 8px;
          border-radius: 999px;
          background: #fee2e2;
          color: #b91c1c;
          font-size: 10px;
          font-weight: 900;
        }

        .helpline-top {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-right: 80px;
        }

        .helpline-icon {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 14px;
          background: #f5f3ff;
          font-size: 25px;
        }

        .helpline-title h3 {
          margin: 0 0 4px;
          font-size: 15px;
          line-height: 1.35;
        }

        .helpline-title span {
          color: #7c3aed;
          font-size: 11px;
          font-weight: 850;
        }

        .location-tag {
          display: inline-block;
          margin-top: 13px;
          padding: 5px 8px;
          border-radius: 7px;
          background: #f8fafc;
          color: #64748b;
          font-size: 10px;
          font-weight: 750;
        }

        /* NUMBER */

        .number-box {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 13px;
          padding: 10px;
          border-radius: 11px;
          background: #f5f3ff;
          border: 1px solid #ede9fe;
        }

        .number {
          color: #6d28d9;
          text-decoration: none;
          font-size: 25px;
          font-weight: 900;
          letter-spacing: .5px;
        }

        .copy-button {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          box-shadow:
            0 2px 8px
            rgba(0,0,0,.06);
        }

        .copied-message {
          text-align: center;
          margin-top: 5px;
          color: #16a34a;
          font-size: 11px;
          font-weight: 750;
        }

        .helpline-description {
          min-height: 55px;
          margin: 13px 0;
          color: #64748b;
          font-size: 12.5px;
          line-height: 1.6;
        }

        /* ACTIONS */

        .helpline-actions {
          display: flex;
          gap: 8px;
        }

        .call-button,
        .copy-action {
          flex: 1;
          border: none;
          border-radius: 9px;
          padding: 10px;
          cursor: pointer;
          font-weight: 800;
          font-size: 12px;
          transition: .2s;
        }

        .call-button {
          background: #7c3aed;
          color: white;
        }

        .call-button.danger {
          background: #dc2626;
        }

        .call-button:hover,
        .copy-action:hover {
          transform: translateY(-1px);
        }

        .copy-action {
          background: #f1f5f9;
          color: #334155;
        }

        /* BIHAR */

        .bihar-card {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          margin-top: 27px;
          padding: 20px;
          border-radius: 17px;
          background:
            linear-gradient(
              135deg,
              #eff6ff,
              #ffffff
            );
          border: 1px solid #bfdbfe;
        }

        .bihar-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 13px;
          background: #dbeafe;
          font-size: 24px;
        }

        .mini-label {
          color: #2563eb;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1px;
        }

        .bihar-card h2 {
          margin: 5px 0;
          font-size: 18px;
        }

        .bihar-card p {
          margin: 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.6;
        }

        /* HOW */

        .how-card {
          margin-top: 22px;
          padding: 21px;
          border-radius: 17px;
          background: #faf5ff;
          border: 1px solid #ede9fe;
        }

        .how-header {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .how-icon {
          font-size: 28px;
        }

        .how-header h2 {
          margin: 0;
          font-size: 18px;
        }

        .how-header p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 12px;
        }

        .steps {
          display: grid;
          grid-template-columns:
            repeat(3, 1fr);
          gap: 12px;
          margin-top: 18px;
        }

        .step {
          display: flex;
          gap: 10px;
          padding: 14px;
          border-radius: 12px;
          background: white;
        }

        .step > span {
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          border-radius: 50%;
          background: #7c3aed;
          color: white;
          font-size: 12px;
          font-weight: 900;
        }

        .step strong {
          font-size: 12px;
        }

        .step p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 11px;
          line-height: 1.5;
        }

        /* SAFETY */

        .safety-notice {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          margin-top: 22px;
          padding: 20px;
          border-radius: 17px;
          background:
            linear-gradient(
              135deg,
              #fff7ed,
              #ffffff
            );
          border: 1px solid #fed7aa;
        }

        .notice-icon {
          font-size: 26px;
        }

        .safety-notice h3 {
          margin: 0 0 5px;
          font-size: 16px;
        }

        .safety-notice p {
          margin: 6px 0;
          color: #64748b;
          font-size: 12px;
          line-height: 1.6;
        }

        /* EMPTY */

        .empty-state {
          padding: 55px 20px;
          text-align: center;
          border-radius: 17px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .empty-icon {
          font-size: 45px;
        }

        .empty-state h3 {
          margin: 10px 0 5px;
        }

        .empty-state p {
          color: #64748b;
          font-size: 13px;
        }

        .empty-state button {
          margin-top: 10px;
          border: none;
          border-radius: 9px;
          padding: 10px 15px;
          background: #7c3aed;
          color: white;
          cursor: pointer;
          font-weight: 800;
        }

        /* RESPONSIVE */

        @media (max-width: 900px) {

          .quick-actions {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .steps {
            grid-template-columns: 1fr;
          }

        }

        @media (max-width: 700px) {

          .helpline-page {
            padding: 14px;
          }

          .helpline-header {
            flex-direction: column;
          }

          .header-badge {
            align-self: flex-start;
          }

          .page-title {
            font-size: 28px;
          }

          .emergency-banner {
            flex-wrap: wrap;
          }

          .emergency-call {
            width: 100%;
          }

          .category-scroll {
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 4px;
          }

          .category-button {
            white-space: nowrap;
          }

          .results-header {
            align-items: flex-start;
          }

          .bihar-card {
            flex-direction: column;
          }

        }

        @media (max-width: 480px) {

          .quick-actions {
            grid-template-columns: 1fr;
          }

          .helpline-grid {
            grid-template-columns: 1fr;
          }

          .helpline-top {
            padding-right: 0;
          }

          .priority-label {
            position: static;
            display: inline-block;
            margin-bottom: 12px;
          }

          .number {
            font-size: 22px;
          }

          .helpline-actions {
            flex-direction: column;
          }

          .results-header {
            flex-direction: column;
          }

          .reset-button {
            width: 100%;
          }

        }

      `}</style>

    </div>
  );
};

export default Helpline;