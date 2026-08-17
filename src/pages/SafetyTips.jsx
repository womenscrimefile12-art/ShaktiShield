import { useEffect, useMemo, useState } from "react";
import { incidentAPI } from "../services/api";

const DEFAULT_TIPS = [
  {
    _id: "default-1",
    title: "Trust Your Instincts",
    category: "Awareness",
    author: "ShaktiShield Team",
    content:
      "If a situation feels unsafe or uncomfortable, trust your instincts. Move to a safe and public location and contact someone you trust.",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80",
  },
  {
    _id: "default-2",
    title: "Share Your Live Location",
    category: "Travel Safety",
    author: "ShaktiShield Team",
    content:
      "When traveling alone, especially at night, share your live location with a trusted family member or friend. This can help others know where you are.",
    image:
      "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=900&q=80",
  },
  {
    _id: "default-3",
    title: "Stay in Well-Lit Areas",
    category: "Travel Safety",
    author: "ShaktiShield Team",
    content:
      "Prefer well-lit and populated roads. Avoid isolated shortcuts and unfamiliar areas when traveling alone.",
    image:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=900&q=80",
  },
  {
    _id: "default-4",
    title: "Keep Emergency Numbers Ready",
    category: "Emergency",
    author: "ShaktiShield Team",
    content:
      "Keep important emergency numbers saved on your phone. In India, 112 is the unified emergency number.",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
  },
  {
    _id: "default-5",
    title: "Keep Your Phone Charged",
    category: "Emergency",
    author: "ShaktiShield Team",
    content:
      "Make sure your phone has enough battery before leaving home. Carry a power bank when traveling for long periods.",
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=900&q=80",
  },
  {
    _id: "default-6",
    title: "Protect Personal Information",
    category: "Digital Safety",
    author: "ShaktiShield Team",
    content:
      "Never share passwords, OTPs, banking details, home addresses, or other sensitive information with unknown people.",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80",
  },
];

const CATEGORY_IMAGES = {
  Awareness:
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80",

  "Travel Safety":
    "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80",

  Emergency:
    "https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=900&q=80",

  "Digital Safety":
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80",

  Safety:
    "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=900&q=80",
};

const getArticleImage = (article) => {
  if (article?.image) {
    return article.image;
  }

  if (article?.imageUrl) {
    return article.imageUrl;
  }

  if (article?.category && CATEGORY_IMAGES[article.category]) {
    return CATEGORY_IMAGES[article.category];
  }

  return CATEGORY_IMAGES.Safety;
};

const SafetyTips = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchSafetyTips = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await incidentAPI.getArticles({
          category: "tips",
        });

        if (!isMounted) return;

        const data = Array.isArray(response?.data)
          ? response.data
          : [];

        setArticles(data);
      } catch (err) {
        console.error("Failed to load safety tips:", err);

        if (isMounted) {
          setArticles([]);
          setError(
            "Unable to load online safety tips. Showing recommended tips instead."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSafetyTips();

    return () => {
      isMounted = false;
    };
  }, []);

  const displayArticles =
    articles.length > 0 ? articles : DEFAULT_TIPS;

  const categories = useMemo(() => {
    const uniqueCategories = displayArticles
      .map((article) => article.category)
      .filter(Boolean);

    return ["All", ...new Set(uniqueCategories)];
  }, [displayArticles]);

  const filteredArticles = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return displayArticles.filter((article) => {
      const title = String(article.title || "").toLowerCase();

      const content = String(
        article.content || ""
      ).toLowerCase();

      const category = String(
        article.category || ""
      ).toLowerCase();

      const matchesSearch =
        !search ||
        title.includes(search) ||
        content.includes(search) ||
        category.includes(search);

      const matchesCategory =
        activeCategory === "All" ||
        article.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [
    displayArticles,
    searchTerm,
    activeCategory,
  ]);

  const openArticle = (article) => {
    setSelectedArticle(article);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const closeArticle = () => {
    setSelectedArticle(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <section className="safety-tips-page">
        <div className="page-header">
          <span className="section-label">
            SHAKTISHIELD • PERSONAL SAFETY
          </span>

          <div className="skeleton skeleton-title" />

          <div className="skeleton skeleton-text" />
        </div>

        <div className="grid grid-2">
          {[1, 2, 3, 4].map((item) => (
            <div
              className="card safety-card"
              key={item}
            >
              <div className="skeleton skeleton-image" />

              <div className="skeleton skeleton-card-title" />

              <div className="skeleton skeleton-line" />

              <div className="skeleton skeleton-line short" />
            </div>
          ))}
        </div>

        <style>{`
          .skeleton {
            background: linear-gradient(
              90deg,
              #f1f5f9,
              #e2e8f0,
              #f1f5f9
            );
            background-size: 200% 100%;
            animation: skeletonLoading 1.5s infinite;
            border-radius: 10px;
          }

          .skeleton-title {
            width: 260px;
            height: 40px;
            margin: 15px 0;
          }

          .skeleton-text {
            width: 80%;
            height: 20px;
          }

          .skeleton-image {
            width: 100%;
            height: 180px;
            margin-bottom: 18px;
          }

          .skeleton-card-title {
            width: 65%;
            height: 25px;
            margin-bottom: 15px;
          }

          .skeleton-line {
            width: 90%;
            height: 14px;
            margin-bottom: 8px;
          }

          .skeleton-line.short {
            width: 60%;
          }

          @keyframes skeletonLoading {
            0% {
              background-position: 200% 0;
            }

            100% {
              background-position: -200% 0;
            }
          }
        `}</style>
      </section>
    );
  }

  /* =========================================================
     SINGLE ARTICLE
  ========================================================= */

  if (selectedArticle) {
    return (
      <section className="safety-tips-page">
        <button
          type="button"
          className="btn btn-outline back-button"
          onClick={closeArticle}
        >
          ← Back to Safety Tips
        </button>

        <article className="card safety-article">
          <img
            src={getArticleImage(selectedArticle)}
            alt={selectedArticle.title || "Safety tip"}
            className="article-hero-image"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />

          <div className="article-header">
            <span className="article-category">
              {selectedArticle.category ||
                "Safety"}
            </span>

            <h1 className="page-title article-title">
              {selectedArticle.title ||
                "Safety Tip"}
            </h1>

            <p className="article-author">
              By{" "}
              {selectedArticle.author ||
                "ShaktiShield Team"}
            </p>
          </div>

          <div className="article-content">
            {selectedArticle.content ||
              "No content available."}
          </div>

          <div className="article-footer">
            <button
              type="button"
              className="btn btn-primary"
              onClick={closeArticle}
            >
              ← View All Safety Tips
            </button>
          </div>
        </article>

        <style>{`
          .article-hero-image {
            width: 100%;
            height: 350px;
            object-fit: cover;
            border-radius: 18px 18px 0 0;
            display: block;
          }

          .safety-article {
            overflow: hidden;
          }

          .article-header {
            padding: 28px 30px 10px;
          }

          .article-content {
            padding: 10px 30px 30px;
            line-height: 1.9;
            color: var(--text, #334155);
            font-size: 16px;
            white-space: pre-line;
          }

          .article-footer {
            padding: 0 30px 30px;
          }

          @media (max-width: 600px) {
            .article-hero-image {
              height: 220px;
            }

            .article-header,
            .article-content,
            .article-footer {
              padding-left: 18px;
              padding-right: 18px;
            }
          }
        `}</style>
      </section>
    );
  }

  /* =========================================================
     MAIN PAGE
  ========================================================= */

  return (
    <section className="safety-tips-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <header className="safety-hero">

        <div className="safety-hero-content">

          <span className="section-label">
            SHAKTISHIELD • PERSONAL SAFETY
          </span>

          <h1 className="page-title">
            Safety Tips
          </h1>

          <p className="page-description">
            Practical safety guidance to help you
            stay aware, prepared, and confident
            in everyday situations.
          </p>

          <div className="hero-safety-badges">

            <span>
              🛡️ Stay Aware
            </span>

            <span>
              📍 Stay Prepared
            </span>

            <span>
              🚨 Stay Safe
            </span>

          </div>

        </div>

        <div className="safety-hero-image-wrapper">

          <img
            src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1000&q=85"
            alt="Personal safety and awareness"
            className="safety-hero-image"
          />

          <div className="hero-image-overlay">
            <span>
              🛡️
            </span>

            <strong>
              Your Safety Matters
            </strong>

            <small>
              Be aware. Be prepared.
            </small>
          </div>

        </div>

      </header>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div
          className="alert alert-warning"
          role="alert"
        >
          <span>⚠️</span>

          <span>{error}</span>
        </div>
      )}

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="safety-controls">

        <div className="search-box">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="search"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
            placeholder="Search safety tips..."
            aria-label="Search safety tips"
          />

          {searchTerm && (
            <button
              type="button"
              className="clear-search"
              onClick={() =>
                setSearchTerm("")
              }
              aria-label="Clear search"
            >
              ×
            </button>
          )}

        </div>

      </div>

      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      {categories.length > 1 && (
        <div className="category-list">

          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`category-button ${
                activeCategory === category
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveCategory(category)
              }
            >
              {category}
            </button>
          ))}

        </div>
      )}

      {/* =====================================================
          RESULT COUNT
      ===================================================== */}

      <div className="results-info">

        Showing{" "}

        <strong>
          {filteredArticles.length}
        </strong>{" "}

        {filteredArticles.length === 1
          ? "safety tip"
          : "safety tips"}

      </div>

      {/* =====================================================
          SAFETY CARDS
      ===================================================== */}

      {filteredArticles.length > 0 ? (

        <div className="grid grid-2 safety-tips-grid">

          {filteredArticles.map((article) => {

            const content = String(
              article.content || ""
            );

            const preview =
              content.length > 140
                ? `${content.substring(
                    0,
                    140
                  )}...`
                : content;

            return (
              <article
                key={article._id}
                className="card safety-card"
              >

                {/* IMAGE */}

                <div className="safety-card-image-wrapper">

                  <img
                    src={getArticleImage(article)}
                    alt={
                      article.title ||
                      "Safety tip"
                    }
                    className="safety-card-image"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.src =
                        CATEGORY_IMAGES.Safety;
                    }}
                  />

                  <div className="image-category-badge">
                    {article.category ||
                      "Safety"}
                  </div>

                </div>

                {/* CARD CONTENT */}

                <div className="safety-card-content">

                  <div className="safety-card-top">

                    <span
                      className="safety-icon"
                      aria-hidden="true"
                    >
                      🛡️
                    </span>

                    <span className="article-category">
                      {article.category ||
                        "Safety"}
                    </span>

                  </div>

                  <h3 className="safety-card-title">
                    {article.title ||
                      "Safety Tip"}
                  </h3>

                  <p className="safety-card-description">
                    {preview ||
                      "Read this safety tip to learn more."}
                  </p>

                  <div className="safety-card-footer">

                    <span className="article-author">
                      {article.author ||
                        "ShaktiShield Team"}
                    </span>

                    <button
                      type="button"
                      className="read-more-button"
                      onClick={() =>
                        openArticle(article)
                      }
                    >
                      Read More →
                    </button>

                  </div>

                </div>

              </article>
            );
          })}

        </div>

      ) : (

        <div className="card empty-state">

          <div className="empty-state-icon">
            🔎
          </div>

          <h3>
            No Safety Tips Found
          </h3>

          <p>
            We couldn't find any tips
            matching your search. Try
            another keyword or category.
          </p>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setSearchTerm("");
              setActiveCategory("All");
            }}
          >
            Reset Filters
          </button>

        </div>

      )}

      {/* =====================================================
          SAFETY REMINDER
      ===================================================== */}

      <div className="safety-reminder">

        <div className="reminder-image">

          <img
            src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80"
            alt="Stay connected during emergencies"
          />

        </div>

        <div className="reminder-content">

          <span className="section-label">
            SAFETY REMINDER
          </span>

          <h2>
            Stay prepared before an emergency happens.
          </h2>

          <p>
            Keep your phone charged, share your
            location with someone you trust, know
            your emergency contacts, and avoid
            isolated areas whenever possible.
          </p>

          <div className="reminder-points">

            <span>
              ✓ Keep emergency contacts ready
            </span>

            <span>
              ✓ Keep your phone charged
            </span>

            <span>
              ✓ Know your surroundings
            </span>

          </div>

        </div>

      </div>

      {/* =====================================================
          PAGE CSS
      ===================================================== */}

      <style>{`

        /* =========================================
           HERO
        ========================================= */

        .safety-hero {
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          gap: 35px;
          align-items: center;
          margin-bottom: 35px;
          padding: 10px 0;
        }

        .safety-hero-content {
          padding: 15px 0;
        }

        .safety-hero-image-wrapper {
          position: relative;
          height: 330px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow:
            0 20px 45px
            rgba(30, 27, 75, 0.16);
        }

        .safety-hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .safety-hero-image-wrapper::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              180deg,
              transparent 35%,
              rgba(15, 23, 42, 0.7)
            );
        }

        .hero-image-overlay {
          position: absolute;
          z-index: 2;
          bottom: 22px;
          left: 22px;
          right: 22px;
          color: white;
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .hero-image-overlay span {
          font-size: 28px;
        }

        .hero-image-overlay strong {
          font-size: 20px;
        }

        .hero-image-overlay small {
          opacity: 0.9;
        }

        .hero-safety-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 22px;
        }

        .hero-safety-badges span {
          padding: 9px 13px;
          border-radius: 999px;
          background: rgba(124, 58, 237, 0.08);
          color: var(--primary, #7c3aed);
          font-size: 13px;
          font-weight: 700;
        }

        /* =========================================
           SEARCH
        ========================================= */

        .safety-controls {
          margin-bottom: 18px;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          box-sizing: border-box;
          border: 1px solid
            rgba(128, 128, 128, 0.25);
          border-radius: 14px;
          padding: 13px 15px;
          background: white;
        }

        .search-box input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          color: inherit;
          font-size: 15px;
        }

        .search-icon {
          font-size: 17px;
        }

        .clear-search {
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 22px;
        }

        /* =========================================
           CATEGORIES
        ========================================= */

        .category-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 18px;
        }

        .category-button {
          border: none;
          border-radius: 999px;
          padding: 9px 15px;
          background: rgba(128, 128, 128, 0.1);
          color: inherit;
          cursor: pointer;
          font-weight: 600;
          transition: 0.2s;
        }

        .category-button:hover {
          transform: translateY(-1px);
        }

        .category-button.active {
          background:
            var(--primary, #7c3aed);
          color: white;
        }

        /* =========================================
           RESULTS
        ========================================= */

        .results-info {
          margin-bottom: 18px;
          color: var(--text-muted);
          font-size: 14px;
        }

        /* =========================================
           CARD
        ========================================= */

        .safety-card {
          padding: 0;
          overflow: hidden;
          transition: 0.25s ease;
        }

        .safety-card:hover {
          transform: translateY(-5px);
          box-shadow:
            0 18px 40px
            rgba(30, 27, 75, 0.13);
        }

        .safety-card-image-wrapper {
          position: relative;
          height: 200px;
          overflow: hidden;
        }

        .safety-card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .safety-card:hover
        .safety-card-image {
          transform: scale(1.05);
        }

        .image-category-badge {
          position: absolute;
          left: 14px;
          bottom: 14px;
          padding: 7px 11px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.82);
          color: white;
          font-size: 12px;
          font-weight: 700;
          backdrop-filter: blur(5px);
        }

        .safety-card-content {
          padding: 20px;
        }

        .safety-card-top {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 13px;
        }

        .safety-icon {
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background:
            rgba(124, 58, 237, 0.1);
          font-size: 19px;
        }

        .article-category {
          display: inline-block;
          padding: 6px 10px;
          border-radius: 999px;
          background:
            rgba(124, 58, 237, 0.08);
          color:
            var(--primary, #7c3aed);
          font-size: 12px;
          font-weight: 800;
        }

        .safety-card-title {
          margin: 0 0 10px;
          font-size: 19px;
          line-height: 1.35;
        }

        .safety-card-description {
          margin: 0;
          color: var(--text-muted);
          line-height: 1.65;
          font-size: 14px;
          min-height: 68px;
        }

        .safety-card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-top: 20px;
          padding-top: 14px;
          border-top:
            1px solid var(--border, #e5e7eb);
        }

        .article-author {
          color: var(--text-muted);
          font-size: 12px;
        }

        .read-more-button {
          border: none;
          background: transparent;
          color:
            var(--primary, #7c3aed);
          cursor: pointer;
          font-weight: 800;
          font-size: 13px;
          white-space: nowrap;
        }

        .read-more-button:hover {
          text-decoration: underline;
        }

        /* =========================================
           SAFETY REMINDER
        ========================================= */

        .safety-reminder {
          display: grid;
          grid-template-columns: 0.8fr 1.2fr;
          margin-top: 40px;
          overflow: hidden;
          border-radius: 22px;
          background:
            linear-gradient(
              135deg,
              #f5f3ff,
              #ffffff
            );
          border: 1px solid
            rgba(124, 58, 237, 0.12);
          box-shadow:
            0 12px 35px
            rgba(30, 27, 75, 0.08);
        }

        .reminder-image {
          min-height: 280px;
        }

        .reminder-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .reminder-content {
          padding: 35px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .reminder-content h2 {
          margin: 10px 0;
          font-size: 27px;
          line-height: 1.25;
        }

        .reminder-content p {
          color: var(--text-muted);
          line-height: 1.7;
          margin: 0 0 18px;
        }

        .reminder-points {
          display: flex;
          flex-direction: column;
          gap: 8px;
          color: #475569;
          font-size: 14px;
          font-weight: 600;
        }

        /* =========================================
           EMPTY STATE
        ========================================= */

        .empty-state {
          text-align: center;
          padding: 55px 20px;
        }

        .empty-state-icon {
          font-size: 50px;
          margin-bottom: 10px;
        }

        .empty-state p {
          color: var(--text-muted);
          max-width: 500px;
          margin: 10px auto 20px;
          line-height: 1.6;
        }

        /* =========================================
           RESPONSIVE
        ========================================= */

        @media (max-width: 850px) {

          .safety-hero {
            grid-template-columns: 1fr;
          }

          .safety-hero-image-wrapper {
            height: 280px;
          }

          .safety-reminder {
            grid-template-columns: 1fr;
          }

          .reminder-image {
            min-height: 220px;
          }

        }

        @media (max-width: 600px) {

          .safety-hero-image-wrapper {
            height: 230px;
            border-radius: 18px;
          }

          .hero-safety-badges {
            gap: 6px;
          }

          .hero-safety-badges span {
            font-size: 11px;
            padding: 7px 9px;
          }

          .safety-card-image-wrapper {
            height: 180px;
          }

          .safety-card-content {
            padding: 16px;
          }

          .safety-card-footer {
            align-items: flex-start;
            flex-direction: column;
          }

          .reminder-content {
            padding: 22px;
          }

          .reminder-content h2 {
            font-size: 22px;
          }

        }

      `}</style>

    </section>
  );
};

export default SafetyTips;