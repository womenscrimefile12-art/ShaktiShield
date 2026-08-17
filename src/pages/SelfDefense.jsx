import { useEffect, useMemo, useState } from "react";
import { incidentAPI } from "../services/api";

/* =====================================================
   IMAGE FALLBACK
===================================================== */

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80";

/* =====================================================
   DEFAULT SELF DEFENSE ARTICLES
===================================================== */

const DEFAULT_ARTICLES = [
  {
    _id: "sd1",
    title: "Basic Stance & Awareness",
    category: "Awareness",
    icon: "🧍‍♀️",
    image:
      "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1200&q=80",
    content:
      "Stand with your feet approximately shoulder-width apart and keep your knees slightly bent. Maintain a balanced posture and keep your hands in a comfortable defensive position. Stay aware of your surroundings, identify nearby exits, and avoid becoming distracted while walking alone.",
    author: "ShaktiShield Team",
  },

  {
    _id: "sd2",
    title: "Palm Heel Strike",
    category: "Basic Technique",
    icon: "✋",
    image:
      "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1200&q=80",
    content:
      "The palm heel can be used as a simple defensive technique when you need to create distance from an aggressor. Keep your fingers protected and focus on maintaining your balance. The primary goal is to create an opportunity to move away and reach a safe location rather than continue a confrontation.",
    author: "ShaktiShield Team",
  },

  {
    _id: "sd3",
    title: "Knee Strike",
    category: "Basic Technique",
    icon: "🥋",
    image:
      "https://images.unsplash.com/photo-1606335543042-57c525922933?auto=format&fit=crop&w=1200&q=80",
    content:
      "A knee strike can be useful at very close range if you are unable to safely disengage. Maintain your balance and use the movement to create enough space to escape. Once you have an opportunity, move toward a populated and secure area and seek help.",
    author: "ShaktiShield Team",
  },

  {
    _id: "sd4",
    title: "Breaking a Wrist Grab",
    category: "Escape",
    icon: "🤝",
    image:
      "https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=1200&q=80",
    content:
      "If someone grabs your wrist, focus on creating space and moving toward the weakest part of the grip. Keep your movement controlled and immediately try to move away from the person. Once free, do not remain in the confrontation—move toward safety and seek assistance.",
    author: "ShaktiShield Team",
  },

  {
    _id: "sd5",
    title: "Verbal De-escalation",
    category: "Awareness",
    icon: "🗣️",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
    content:
      "Use a clear and confident voice to establish boundaries. Avoid unnecessary confrontation and try to maintain a safe distance. If the situation becomes threatening, attract attention from people nearby and move toward a safer location.",
    author: "ShaktiShield Team",
  },

  {
    _id: "sd6",
    title: "Creating an Escape Opportunity",
    category: "Escape",
    icon: "🏃‍♀️",
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80",
    content:
      "The safest objective in many dangerous situations is to create an opportunity to escape. Look for exits, move toward well-lit public areas, and attract attention when appropriate. Once you are safe, contact a trusted person or emergency service.",
    author: "ShaktiShield Team",
  },
];

/* =====================================================
   SELF DEFENSE COMPONENT
===================================================== */

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
      const title = String(
        article.title || ""
      ).toLowerCase();

      const content = String(
        article.content || ""
      ).toLowerCase();

      const articleCategory = String(
        article.category || ""
      ).toLowerCase();

      const matchesSearch =
        !query ||
        title.includes(query) ||
        content.includes(query) ||
        articleCategory.includes(query);

      const matchesCategory =
        category === "All" ||
        article.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [displayArticles, search, category]);

  /* =====================================================
     OPEN ARTICLE
  ===================================================== */

  const openArticle = (article) => {
    setSelected(article);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =====================================================
     IMAGE FALLBACK
  ===================================================== */

  const getArticleImage = (article) => {
    return (
      article.image ||
      article.imageUrl ||
      DEFAULT_IMAGE
    );
  };

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

          {/* HERO IMAGE */}

          <div className="self-defense-detail-image">
            <img
              src={getArticleImage(selected)}
              alt={selected.title || "Self defense"}
              onError={(e) => {
                e.currentTarget.src = DEFAULT_IMAGE;
              }}
            />

            <div className="self-defense-image-overlay">
              <span>
                {selected.icon || "🥋"}
              </span>

              <span>
                {selected.category ||
                  "Self Defense"}
              </span>
            </div>
          </div>

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
              {selected.category ||
                "Self Defense"}
            </span>

            <h1 className="page-title article-title">
              {selected.title}
            </h1>

            <p className="article-author">
              By{" "}
              {selected.author ||
                "ShaktiShield Team"}
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
            <span
              style={{
                fontSize: "1.2rem",
              }}
            >
              🛡️
            </span>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                lineHeight: 1.7,
              }}
            >
              Self-defense techniques should
              primarily be used to create an
              opportunity to escape. Whenever
              possible, avoid confrontation,
              move toward a safe public location,
              and seek help.
            </p>
          </div>

        </article>

        {/* PAGE CSS */}

        <style>{`

          .self-defense-detail-image {
            position: relative;
            width: 100%;
            height: 340px;
            overflow: hidden;
            border-radius: 18px;
            margin-bottom: 2rem;
            background: #f1f5f9;
          }

          .self-defense-detail-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
          }

          .self-defense-image-overlay {
            position: absolute;
            left: 20px;
            bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 10px 15px;
            border-radius: 12px;
            background: rgba(15, 23, 42, 0.78);
            color: white;
            font-weight: 700;
            backdrop-filter: blur(8px);
          }

          .self-defense-image-overlay span:first-child {
            font-size: 1.5rem;
          }

          @media (max-width: 600px) {
            .self-defense-detail-image {
              height: 230px;
              border-radius: 14px;
            }

            .self-defense-image-overlay {
              left: 12px;
              bottom: 12px;
              font-size: 0.85rem;
            }
          }

        `}</style>

      </div>
    );
  }

  /* =====================================================
     MAIN PAGE
  ===================================================== */

  return (
    <div className="safety-tips-page">

      {/* =================================================
          HERO SECTION
      ================================================= */}

      <div className="self-defense-hero">

        <div className="self-defense-hero-content">

          <span className="section-label">
            PERSONAL SAFETY
          </span>

          <h1 className="page-title">
            Self Defense Techniques
          </h1>

          <p className="page-description">
            Learn basic awareness, escape, and
            personal safety techniques. The goal
            of self-defense is to stay safe,
            create distance, and reach a secure
            location.
          </p>

        </div>

        <div className="self-defense-hero-image">

          <img
            src={DEFAULT_ARTICLES[0].image}
            alt="Self defense awareness"
            onError={(e) => {
              e.currentTarget.src =
                DEFAULT_IMAGE;
            }}
          />

          <div className="hero-image-label">
            🛡️ Stay Aware • Stay Safe
          </div>

        </div>

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
              These guides are for general
              awareness and education. Consider
              taking a professional self-defense
              course to learn techniques safely
              under qualified supervision.
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          ERROR
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
              category === item
                ? "active"
                : ""
            }`}
            onClick={() =>
              setCategory(item)
            }
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
                  width: "100%",
                  height: "180px",
                  marginBottom: "1rem",
                  borderRadius: "14px",
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
            We couldn't find any self-defense
            guides matching your search.
            Try another keyword or select a
            different category.
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
              className="card safety-card self-defense-card"
              onClick={() =>
                openArticle(article)
              }
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" ||
                  e.key === " "
                ) {
                  e.preventDefault();
                  openArticle(article);
                }
              }}
            >

              {/* IMAGE */}

              <div className="self-defense-card-image">

                <img
                  src={getArticleImage(article)}
                  alt={
                    article.title ||
                    "Self defense technique"
                  }
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src =
                      DEFAULT_IMAGE;
                  }}
                />

                <div className="self-defense-card-icon">
                  {article.icon || "🥋"}
                </div>

              </div>

              {/* CARD CONTENT */}

              <div className="self-defense-card-content">

                <div className="safety-card-top">

                  <span className="article-category">
                    {article.category ||
                      "Self Defense"}
                  </span>

                </div>

                <h2 className="safety-card-title">
                  {article.title}
                </h2>

                <p className="safety-card-description">
                  {article.content?.length > 140
                    ? `${article.content.substring(
                        0,
                        140
                      )}...`
                    : article.content}
                </p>

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
                      openArticle(article);
                    }}
                  >
                    Learn More →
                  </button>

                </div>

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
              Your first priority should be
              getting to a safe location. Use
              the ShaktiShield SOS feature or
              contact the appropriate emergency
              service if you need immediate
              assistance.
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          PAGE-SPECIFIC CSS
      ================================================= */}

      <style>{`

        /* ================================================
           HERO
        ================================================ */

        .self-defense-hero {
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          gap: 30px;
          align-items: center;
          margin-bottom: 28px;
        }

        .self-defense-hero-content {
          padding: 10px 0;
        }

        .self-defense-hero-image {
          position: relative;
          height: 260px;
          border-radius: 22px;
          overflow: hidden;
          box-shadow:
            0 20px 45px
            rgba(30, 27, 75, 0.15);
        }

        .self-defense-hero-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .hero-image-label {
          position: absolute;
          bottom: 15px;
          left: 15px;
          padding: 9px 14px;
          border-radius: 12px;
          background: rgba(15, 23, 42, 0.78);
          color: white;
          font-size: 13px;
          font-weight: 700;
          backdrop-filter: blur(8px);
        }

        /* ================================================
           CARD IMAGE
        ================================================ */

        .self-defense-card {
          padding: 0;
          overflow: hidden;
          cursor: pointer;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .self-defense-card:hover {
          transform: translateY(-5px);
          box-shadow:
            0 18px 40px
            rgba(30, 27, 75, 0.13);
        }

        .self-defense-card:focus-visible {
          outline:
            3px solid
            var(--primary, #7c3aed);
          outline-offset: 3px;
        }

        .self-defense-card-image {
          position: relative;
          width: 100%;
          height: 190px;
          overflow: hidden;
          background: #f1f5f9;
        }

        .self-defense-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition:
            transform 0.35s ease;
        }

        .self-defense-card:hover
        .self-defense-card-image img {
          transform: scale(1.05);
        }

        .self-defense-card-icon {
          position: absolute;
          bottom: 12px;
          left: 14px;
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: white;
          font-size: 24px;
          box-shadow:
            0 8px 20px
            rgba(0, 0, 0, 0.16);
        }

        .self-defense-card-content {
          padding: 18px;
        }

        .self-defense-card-content
        .safety-card-top {
          margin-bottom: 10px;
        }

        /* ================================================
           DETAIL IMAGE
        ================================================ */

        .self-defense-detail-image {
          position: relative;
          width: 100%;
          height: 340px;
          overflow: hidden;
          border-radius: 18px;
          margin-bottom: 2rem;
          background: #f1f5f9;
        }

        .self-defense-detail-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .self-defense-image-overlay {
          position: absolute;
          left: 20px;
          bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 15px;
          border-radius: 12px;
          background:
            rgba(15, 23, 42, 0.78);
          color: white;
          font-weight: 700;
          backdrop-filter: blur(8px);
        }

        .self-defense-image-overlay
        span:first-child {
          font-size: 1.5rem;
        }

        /* ================================================
           MOBILE
        ================================================ */

        @media (max-width: 800px) {

          .self-defense-hero {
            grid-template-columns: 1fr;
          }

          .self-defense-hero-image {
            height: 230px;
          }

        }

        @media (max-width: 600px) {

          .self-defense-card-image {
            height: 180px;
          }

          .self-defense-detail-image {
            height: 230px;
            border-radius: 14px;
          }

          .self-defense-image-overlay {
            left: 12px;
            bottom: 12px;
            font-size: 0.85rem;
          }

        }

      `}</style>

    </div>
  );
};

export default SelfDefense;