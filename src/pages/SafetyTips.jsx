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
  },
  {
    _id: "default-2",
    title: "Share Your Live Location",
    category: "Travel Safety",
    author: "ShaktiShield Team",
    content:
      "When traveling alone, especially at night, share your live location with a trusted family member or friend. This can help others know where you are.",
  },
  {
    _id: "default-3",
    title: "Stay in Well-Lit Areas",
    category: "Travel Safety",
    author: "ShaktiShield Team",
    content:
      "Prefer well-lit and populated roads. Avoid isolated shortcuts and unfamiliar areas when traveling alone.",
  },
  {
    _id: "default-4",
    title: "Keep Emergency Numbers Ready",
    category: "Emergency",
    author: "ShaktiShield Team",
    content:
      "Keep important emergency numbers saved on your phone. In India, 112 is the unified emergency number.",
  },
  {
    _id: "default-5",
    title: "Keep Your Phone Charged",
    category: "Emergency",
    author: "ShaktiShield Team",
    content:
      "Make sure your phone has enough battery before leaving home. Carry a power bank when traveling for long periods.",
  },
  {
    _id: "default-6",
    title: "Protect Personal Information",
    category: "Digital Safety",
    author: "ShaktiShield Team",
    content:
      "Never share passwords, OTPs, banking details, home addresses, or other sensitive information with unknown people.",
  },
];

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
      const content = String(article.content || "").toLowerCase();
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
  }, [displayArticles, searchTerm, activeCategory]);

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
            <div className="card safety-card" key={item}>
              <div className="skeleton skeleton-card-title" />
              <div className="skeleton skeleton-line" />
              <div className="skeleton skeleton-line short" />
            </div>
          ))}
        </div>
      </section>
    );
  }

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
          <div className="article-header">
            <span className="article-category">
              {selectedArticle.category || "Safety"}
            </span>

            <h1 className="page-title article-title">
              {selectedArticle.title || "Safety Tip"}
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
      </section>
    );
  }

  return (
    <section className="safety-tips-page">
      {/* Page Header */}
      <header className="page-header">
        <span className="section-label">
          SHAKTISHIELD • PERSONAL SAFETY
        </span>

        <h1 className="page-title">
          Safety Tips
        </h1>

        <p className="page-description">
          Practical safety guidance to help you stay
          aware, prepared, and confident in everyday
          situations.
        </p>
      </header>

      {/* API Error */}
      {error && (
        <div className="alert alert-warning" role="alert">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Search */}
      <div className="safety-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>

          <input
            type="search"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search safety tips..."
            aria-label="Search safety tips"
          />

          {searchTerm && (
            <button
              type="button"
              className="clear-search"
              onClick={() => setSearchTerm("")}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
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

      {/* Result Count */}
      <div className="results-info">
        Showing{" "}
        <strong>{filteredArticles.length}</strong>{" "}
        {filteredArticles.length === 1
          ? "safety tip"
          : "safety tips"}
      </div>

      {/* Safety Cards */}
      {filteredArticles.length > 0 ? (
        <div className="grid grid-2 safety-tips-grid">
          {filteredArticles.map((article) => {
            const content = String(
              article.content || ""
            );

            const preview =
              content.length > 140
                ? `${content.substring(0, 140)}...`
                : content;

            return (
              <article
                key={article._id}
                className="card safety-card"
              >
                <div className="safety-card-top">
                  <span
                    className="safety-icon"
                    aria-hidden="true"
                  >
                    🛡️
                  </span>

                  <span className="article-category">
                    {article.category || "Safety"}
                  </span>
                </div>

                <h3 className="safety-card-title">
                  {article.title || "Safety Tip"}
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
              </article>
            );
          })}
        </div>
      ) : (
        <div className="card empty-state">
          <div className="empty-state-icon">
            🔎
          </div>

          <h3>No Safety Tips Found</h3>

          <p>
            We couldn't find any tips matching your
            search. Try another keyword or category.
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
    </section>
  );
};

export default SafetyTips;