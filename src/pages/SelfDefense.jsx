import { useEffect, useMemo, useState } from "react";
import { incidentAPI } from "../services/api";

const DEFAULT_ARTICLES = [
  {
    _id: "sd1",
    title: "Basic Stance & Awareness",
    category: "Awareness",
    icon: "🧍‍♀️",
    content:
      "Stand with your feet approximately shoulder-width apart and keep your knees slightly bent. Maintain a balanced posture and keep your hands in a comfortable defensive position. Stay aware of your surroundings, identify nearby exits, and avoid becoming distracted while walking alone.",
    author: "ShaktiShield Team",
  },
  {
    _id: "sd2",
    title: "Palm Heel Strike",
    category: "Basic Technique",
    icon: "✋",
    content:
      "The palm heel can be used as a simple defensive technique when you need to create distance from an aggressor. Keep your fingers protected and focus on maintaining your balance. The primary goal is to create an opportunity to move away and reach a safe location rather than continue a confrontation.",
    author: "ShaktiShield Team",
  },
  {
    _id: "sd3",
    title: "Knee Strike",
    category: "Basic Technique",
    icon: "🥋",
    content:
      "A knee strike can be useful at very close range if you are unable to safely disengage. Maintain your balance and use the movement to create enough space to escape. Once you have an opportunity, move toward a populated and secure area and seek help.",
    author: "ShaktiShield Team",
  },
  {
    _id: "sd4",
    title: "Breaking a Wrist Grab",
    category: "Escape",
    icon: "🤝",
    content:
      "If someone grabs your wrist, focus on creating space and moving toward the weakest part of the grip. Keep your movement controlled and immediately try to move away from the person. Once free, do not remain in the confrontation—move toward safety and seek assistance.",
    author: "ShaktiShield Team",
  },
  {
    _id: "sd5",
    title: "Verbal De-escalation",
    category: "Awareness",
    icon: "🗣️",
    content:
      "Use a clear and confident voice to establish boundaries. Avoid unnecessary confrontation and try to maintain a safe distance. If the situation becomes threatening, attract attention from people nearby and move toward a safer location.",
    author: "ShaktiShield Team",
  },
  {
    _id: "sd6",
    title: "Creating an Escape Opportunity",
    category: "Escape",
    icon: "🏃‍♀️",
    content:
      "The safest objective in many dangerous situations is to create an opportunity to escape. Look for exits, move toward well-lit public areas, and attract attention when appropriate. Once you are safe, contact a trusted person or emergency service.",
    author: "ShaktiShield Team",
  },
];

const SelfDefense = () => {
  const [articles, setArticles] = useState([]);
  const [selected, setSelected] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* =====================================================
     FETCH ARTICLES
  ===================================================== */

  useEffect(() => {
    let mounted = true;

    const fetchArticles = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await incidentAPI.getArticles({
          category: "self-defense",
        });

        if (mounted && Array.isArray(data)) {
          setArticles(data);
        }
      } catch (err) {
        console.error(
          "Failed to load self-defense articles:",
          err
        );

        if (mounted) {
          setError(
            "Online self-defense articles could not be loaded. Showing essential safety guides instead."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchArticles();

    return () => {
      mounted = false;
    };
  }, []);

  /* =====================================================
     DISPLAY ARTICLES
  ===================================================== */

  const displayArticles =
    articles.length > 0 ? articles : DEFAULT_ARTICLES;

  /* =====================================================
     CATEGORIES
  ===================================================== */

  const categories = useMemo(() => {
    const values = displayArticles
      .map((article) => article.category)
      .filter(Boolean);

    return ["All", ...new Set(values)];
  }, [displayArticles]);

  /* =====================================================
     FILTER ARTICLES
  ===================================================== */

  const filteredArticles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return displayArticles.filter((article) => {
      const matchesSearch =
        !query ||
        article.title?.toLowerCase().includes(query) ||
        article.content?.toLowerCase().includes(query);

      const matchesCategory =
        category === "All" ||
        article.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [displayArticles, search, category]);

  /* =====================================================
     ARTICLE DETAIL VIEW
  ===================================================== */

  if (selected) {
    return (
      <div className="safety-tips-page">

        {/* BACK BUTTON */}

        <button
          type="button"
          onClick={() => setSelected(null)}
          className="btn btn-outline back-button"
        >
          ← Back to Self Defense
        </button>

        {/* ARTICLE */}

        <article className="card safety-article">

          <div className="article-header">

            <div
              className="safety-icon"
              style={{
                width: "58px",
                height: "58px",
                fontSize: "1.6rem",
                marginBottom: "1rem",
              }}
            >
              {selected.icon || "🥋"}
            </div>

            <span className="article-category">
              {selected.category || "Self Defense"}
            </span>

            <h1 className="page-title article-title">
              {selected.title}
            </h1>

            <p className="article-author">
              By {selected.author || "ShaktiShield Team"}
            </p>

          </div>

          {/* CONTENT */}

          <div className="article-content">
            {selected.content}
          </div>

          {/* SAFETY MESSAGE */}

          <div
            className="article-footer"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.75rem",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>
              🛡️
            </span>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                lineHeight: 1.7,
              }}
            >
              Self-defense techniques should primarily
              be used to create an opportunity to escape.
              Whenever possible, avoid confrontation,
              move toward a safe public location, and
              seek help.
            </p>
          </div>

        </article>

      </div>
    );
  }

  /* =====================================================
     MAIN PAGE
  ===================================================== */

  return (
    <div className="safety-tips-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-header">

        <span className="section-label">
          PERSONAL SAFETY
        </span>

        <h1 className="page-title">
          Self Defense Techniques
        </h1>

        <p className="page-description">
          Learn basic awareness, escape, and personal
          safety techniques. The goal of self-defense
          is to stay safe, create distance, and reach
          a secure location.
        </p>

      </div>

      {/* =================================================
          SAFETY NOTICE
      ================================================= */}

      <div
        className="card"
        style={{
          marginBottom: "1.5rem",
          background:
            "linear-gradient(135deg, #faf5ff, #ffffff)",
          border:
            "1px solid rgb(147 51 234 / 0.15)",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
          }}
        >

          <div className="safety-icon">
            🛡️
          </div>

          <div>

            <h3
              style={{
                marginBottom: "0.35rem",
              }}
            >
              Safety First
            </h3>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.88rem",
                lineHeight: 1.7,
              }}
            >
              These guides are for general awareness
              and education. Consider taking a
              professional self-defense course to learn
              techniques safely under qualified
              supervision.
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          ERROR / FALLBACK MESSAGE
      ================================================= */}

      {error && (
        <div
          className="alert alert-warning"
          role="alert"
        >
          <span>ℹ️</span>
          <span>{error}</span>
        </div>
      )}

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="safety-controls">

        <div className="search-box">

          <span
            className="search-icon"
            aria-hidden="true"
          >
            🔍
          </span>

          <input
            type="search"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search self-defense guides..."
            aria-label="Search self-defense guides"
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

      {/* =================================================
          CATEGORIES
      ================================================= */}

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

      {/* =================================================
          RESULTS
      ================================================= */}

      {!loading && (
        <div className="results-info">
          Showing{" "}
          <strong>
            {filteredArticles.length}
          </strong>{" "}
          {filteredArticles.length === 1
            ? "guide"
            : "guides"}
        </div>
      )}

      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (
        <div className="grid grid-2">

          {[1, 2, 3, 4].map((item) => (
            <div
              className="card"
              key={item}
            >
              <div
                className="skeleton"
                style={{
                  width: "50px",
                  height: "50px",
                  marginBottom: "1rem",
                }}
              />

              <div
                className="skeleton skeleton-card-title"
              />

              <div
                className="skeleton skeleton-line"
              />

              <div
                className="skeleton skeleton-line short"
              />
            </div>
          ))}

        </div>
      ) : filteredArticles.length === 0 ? (

        /* =================================================
           EMPTY STATE
        ================================================= */

        <div className="card empty-state">

          <div className="empty-state-icon">
            🔍
          </div>

          <h3>
            No Guides Found
          </h3>

          <p>
            We couldn't find any self-defense guides
            matching your search. Try another keyword
            or select a different category.
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

        /* =================================================
           ARTICLE GRID
        ================================================= */

        <div className="grid grid-2 safety-tips-grid">

          {filteredArticles.map((article) => (

            <article
              key={article._id}
              className="card safety-card"
              onClick={() =>
                setSelected(article)
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" ||
                  e.key === " "
                ) {
                  e.preventDefault();
                  setSelected(article);
                }
              }}
            >

              {/* CARD TOP */}

              <div className="safety-card-top">

                <div className="safety-icon">
                  {article.icon || "🥋"}
                </div>

                <span className="article-category">
                  {article.category ||
                    "Self Defense"}
                </span>

              </div>

              {/* TITLE */}

              <h2 className="safety-card-title">
                {article.title}
              </h2>

              {/* DESCRIPTION */}

              <p className="safety-card-description">
                {article.content?.length > 140
                  ? `${article.content.substring(
                      0,
                      140
                    )}...`
                  : article.content}
              </p>

              {/* FOOTER */}

              <div className="safety-card-footer">

                <span className="article-author">
                  By{" "}
                  {article.author ||
                    "ShaktiShield Team"}
                </span>

                <button
                  type="button"
                  className="read-more-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected(article);
                  }}
                >
                  Learn More →
                </button>

              </div>

            </article>

          ))}

        </div>
      )}

      {/* =================================================
          BOTTOM SAFETY NOTICE
      ================================================= */}

      <div
        className="card"
        style={{
          marginTop: "2rem",
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
              }}
            >
              If You Are in Immediate Danger
            </h3>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                lineHeight: 1.7,
              }}
            >
              Your first priority should be getting
              to a safe location. Use the ShaktiShield
              SOS feature or contact the appropriate
              emergency service if you need immediate
              assistance.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default SelfDefense;