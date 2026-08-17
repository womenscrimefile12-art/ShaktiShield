import { useEffect, useMemo, useState } from "react";
import { incidentAPI } from "../services/api";

/* =========================================================
   DEFAULT SAFETY & SELF-DEFENSE CONTENT
========================================================= */

const DEFAULT_TIPS = [
  {
    _id: "default-1",
    title: "Trust Your Instincts",
    category: "Awareness",
    author: "ShaktiShield Team",
    content:
      "If a person, place, or situation makes you uncomfortable, trust your instincts. Move toward a public and well-lit area, stay around other people, and contact someone you trust.",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=85",
  },

  {
    _id: "default-2",
    title: "Stay Aware of Your Surroundings",
    category: "Awareness",
    author: "ShaktiShield Team",
    content:
      "Avoid distractions while walking in unfamiliar areas. Keep your phone accessible but remain aware of people, vehicles, exits, and possible safe locations around you.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=85",
  },

  {
    _id: "default-3",
    title: "Share Your Live Location",
    category: "Travel Safety",
    author: "ShaktiShield Team",
    content:
      "When traveling alone, especially at night, consider sharing your live location with a trusted family member or friend. Let someone know your destination and expected arrival time.",
    image:
      "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1000&q=85",
  },

  {
    _id: "default-4",
    title: "Choose Well-Lit Routes",
    category: "Night Safety",
    author: "ShaktiShield Team",
    content:
      "Prefer roads, entrances, parking areas, and public spaces that are well-lit and populated. Avoid isolated shortcuts whenever possible.",
    image:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=85",
  },

  {
    _id: "default-5",
    title: "Keep Emergency Contacts Ready",
    category: "Emergency",
    author: "ShaktiShield Team",
    content:
      "Keep important emergency contacts saved on your phone. In India, 112 is the unified emergency number. Make sure trusted contacts are easy to reach during an emergency.",
    image:
      "https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=1000&q=85",
  },

  {
    _id: "default-6",
    title: "Keep Your Phone Charged",
    category: "Emergency",
    author: "ShaktiShield Team",
    content:
      "Keep your phone sufficiently charged before traveling. Carry a power bank when you expect to be away from a charging point for a long time.",
    image:
      "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1000&q=85",
  },

  {
    _id: "default-7",
    title: "Basic Self-Defense Awareness",
    category: "Self-Defense",
    author: "ShaktiShield Team",
    content:
      "Learn basic self-defense principles such as maintaining distance, protecting your head and body, creating an opportunity to escape, and seeking help. The primary goal is to get away from danger safely.",
    image:
      "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1000&q=85",
  },

  {
    _id: "default-8",
    title: "Create Distance and Escape",
    category: "Self-Defense",
    author: "ShaktiShield Team",
    content:
      "If someone behaves aggressively, try to maintain distance and position yourself near an exit or other people. Use your voice to attract attention and look for an opportunity to move away safely.",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1000&q=85",
  },

  {
    _id: "default-9",
    title: "Use Your Voice",
    category: "Self-Defense",
    author: "ShaktiShield Team",
    content:
      "A confident and loud voice can attract attention during a threatening situation. Clearly say phrases such as 'Stay away', 'Help', or 'Call the police' when appropriate.",
    image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1000&q=85",
  },

  {
    _id: "default-10",
    title: "Protect Your Personal Information",
    category: "Digital Safety",
    author: "ShaktiShield Team",
    content:
      "Never share passwords, OTPs, banking information, private photographs, or your exact home location with unknown people. Review privacy settings on your social media accounts regularly.",
    image:
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=85",
  },

  {
    _id: "default-11",
    title: "Be Careful When Using Ride Services",
    category: "Travel Safety",
    author: "ShaktiShield Team",
    content:
      "Before entering a cab or ride service, verify the vehicle and driver details. Share your trip information with someone you trust and avoid sharing unnecessary personal information.",
    image:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1000&q=85",
  },

  {
    _id: "default-12",
    title: "Know Your Safe Places",
    category: "Emergency",
    author: "ShaktiShield Team",
    content:
      "When traveling through an unfamiliar area, identify nearby police stations, hospitals, pharmacies, shops, transport stations, and other public places where you can seek help.",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=85",
  },
];

/* =========================================================
   CATEGORY-SPECIFIC IMAGES
========================================================= */

const CATEGORY_IMAGES = {
  Awareness:
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=85",

  "Travel Safety":
    "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1000&q=85",

  "Night Safety":
    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1000&q=85",

  Emergency:
    "https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=1000&q=85",

  "Self-Defense":
    "https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1000&q=85",

  "Digital Safety":
    "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=85",

  Safety:
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1000&q=85",
};

/* =========================================================
   GET ARTICLE IMAGE
========================================================= */

const getArticleImage = (article) => {
  if (article?.image) {
    return article.image;
  }

  if (article?.imageUrl) {
    return article.imageUrl;
  }

  if (
    article?.category &&
    CATEGORY_IMAGES[article.category]
  ) {
    return CATEGORY_IMAGES[article.category];
  }

  return CATEGORY_IMAGES.Safety;
};

/* =========================================================
   CATEGORY ICON
========================================================= */

const getCategoryIcon = (category) => {
  switch (category) {
    case "Self-Defense":
      return "🥋";

    case "Emergency":
      return "🚨";

    case "Travel Safety":
      return "📍";

    case "Night Safety":
      return "🌙";

    case "Digital Safety":
      return "🔐";

    case "Awareness":
      return "👁️";

    default:
      return "🛡️";
  }
};

/* =========================================================
   SAFETY TIPS COMPONENT
========================================================= */

const SafetyTips = () => {
  const [articles, setArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] =
    useState(null);

  const [searchTerm, setSearchTerm] =
    useState("");

  const [activeCategory, setActiveCategory] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  /* =======================================================
     LOAD ARTICLES
  ======================================================= */

  useEffect(() => {
    let isMounted = true;

    const fetchSafetyTips = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await incidentAPI.getArticles({
            category: "tips",
          });

        if (!isMounted) return;

        const data = Array.isArray(
          response?.data
        )
          ? response.data
          : [];

        setArticles(data);
      } catch (err) {
        console.error(
          "Failed to load safety tips:",
          err
        );

        if (isMounted) {
          setArticles([]);

          setError(
            "Unable to load online safety tips. Showing recommended safety and self-defense tips instead."
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

  /* =======================================================
     DISPLAY ARTICLES
  ======================================================= */

  const displayArticles =
    articles.length > 0
      ? articles
      : DEFAULT_TIPS;

  /* =======================================================
     CATEGORIES
  ======================================================= */

  const categories = useMemo(() => {
    const uniqueCategories =
      displayArticles
        .map(
          (article) => article.category
        )
        .filter(Boolean);

    return [
      "All",
      ...new Set(uniqueCategories),
    ];
  }, [displayArticles]);

  /* =======================================================
     FILTER ARTICLES
  ======================================================= */

  const filteredArticles = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    return displayArticles.filter(
      (article) => {
        const title = String(
          article.title || ""
        ).toLowerCase();

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
          article.category ===
            activeCategory;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );
  }, [
    displayArticles,
    searchTerm,
    activeCategory,
  ]);

  /* =======================================================
     OPEN ARTICLE
  ======================================================= */

  const openArticle = (article) => {
    setSelectedArticle(article);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     CLOSE ARTICLE
  ======================================================= */

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

          {[1, 2, 3, 4].map(
            (item) => (
              <div
                className="card safety-card"
                key={item}
              >

                <div className="skeleton skeleton-image" />

                <div className="skeleton skeleton-card-title" />

                <div className="skeleton skeleton-line" />

                <div className="skeleton skeleton-line short" />

              </div>
            )
          )}

        </div>

        <style>{`

          .skeleton {
            background:
              linear-gradient(
                90deg,
                #f1f5f9,
                #e2e8f0,
                #f1f5f9
              );

            background-size: 200% 100%;

            animation:
              skeletonLoading 1.5s infinite;

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

          <div className="article-image-wrapper">

            <img
              src={getArticleImage(
                selectedArticle
              )}
              alt={
                selectedArticle.title ||
                "Safety tip"
              }
              className="article-hero-image"
              onError={(event) => {
                event.currentTarget.src =
                  CATEGORY_IMAGES.Safety;
              }}
            />

            <div className="article-image-badge">

              {getCategoryIcon(
                selectedArticle.category
              )}

              <span>
                {selectedArticle.category ||
                  "Safety"}
              </span>

            </div>

          </div>

          <div className="article-header">

            <span className="article-category">

              {getCategoryIcon(
                selectedArticle.category
              )}

              {" "}

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

          <div className="article-safety-note">

            <span>
              🛡️
            </span>

            <div>

              <strong>
                Safety First
              </strong>

              <p>
                The primary goal in a
                dangerous situation is to
                get away safely and seek
                help.
              </p>

            </div>

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

          .article-image-wrapper {
            position: relative;
          }

          .article-hero-image {
            width: 100%;
            height: 400px;
            object-fit: cover;
            border-radius: 18px 18px 0 0;
            display: block;
          }

          .article-image-badge {
            position: absolute;
            bottom: 18px;
            left: 22px;

            display: flex;
            align-items: center;
            gap: 7px;

            padding: 9px 14px;

            border-radius: 999px;

            background:
              rgba(15, 23, 42, 0.82);

            color: white;

            font-size: 13px;
            font-weight: 800;

            backdrop-filter: blur(8px);
          }

          .safety-article {
            overflow: hidden;
          }

          .article-header {
            padding: 28px 30px 10px;
          }

          .article-content {
            padding:
              10px 30px 25px;

            line-height: 1.9;

            color:
              var(--text, #334155);

            font-size: 16px;

            white-space: pre-line;
          }

          .article-safety-note {
            margin:
              0 30px 25px;

            padding: 16px;

            display: flex;

            gap: 12px;

            border-radius: 14px;

            background:
              rgba(124, 58, 237, 0.07);

            border:
              1px solid
              rgba(124, 58, 237, 0.12);
          }

          .article-safety-note > span {
            font-size: 24px;
          }

          .article-safety-note strong {
            display: block;
            margin-bottom: 4px;
          }

          .article-safety-note p {
            margin: 0;
            color: var(--text-muted);
            font-size: 13px;
            line-height: 1.5;
          }

          .article-footer {
            padding:
              0 30px 30px;
          }

          @media (max-width: 600px) {

            .article-hero-image {
              height: 240px;
            }

            .article-header,
            .article-content,
            .article-footer {
              padding-left: 18px;
              padding-right: 18px;
            }

            .article-safety-note {
              margin-left: 18px;
              margin-right: 18px;
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
            Safety Tips & Self-Defense
          </h1>

          <p className="page-description">

            Practical guidance for staying
            aware, prepared, and confident
            in everyday situations.

          </p>

          <div className="hero-safety-badges">

            <span>
              🛡️ Stay Aware
            </span>

            <span>
              🥋 Learn Defense
            </span>

            <span>
              📍 Stay Prepared
            </span>

            <span>
              🚨 Get Help
            </span>

          </div>

        </div>

        <div className="safety-hero-image-wrapper">

          <img
            src="https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1200&q=90"
            alt="Self defense and personal safety"
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
              Be aware. Be prepared. Be confident.
            </small>

          </div>

        </div>

      </header>

      {/* =====================================================
          QUICK SAFETY BANNER
      ===================================================== */}

      <div className="quick-safety-banner">

        <div className="quick-safety-item">

          <span>👁️</span>

          <div>
            <strong>
              Stay Alert
            </strong>

            <small>
              Know what is happening around you.
            </small>
          </div>

        </div>

        <div className="quick-safety-item">

          <span>🥋</span>

          <div>
            <strong>
              Learn Self-Defense
            </strong>

            <small>
              Learn practical defensive awareness.
            </small>
          </div>

        </div>

        <div className="quick-safety-item">

          <span>🚨</span>

          <div>
            <strong>
              Know Your Exit
            </strong>

            <small>
              Move toward people and safe places.
            </small>
          </div>

        </div>

      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div
          className="alert alert-warning"
          role="alert"
        >

          <span>
            ⚠️
          </span>

          <span>
            {error}
          </span>

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
            placeholder="Search safety, self-defense, emergency..."
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

          {categories.map(
            (category) => (

              <button
                key={category}
                type="button"
                className={`
                  category-button
                  ${
                    activeCategory ===
                    category
                      ? "active"
                      : ""
                  }
                `}
                onClick={() =>
                  setActiveCategory(
                    category
                  )
                }
              >

                {category === "All"
                  ? "🌎"
                  : getCategoryIcon(
                      category
                    )}

                {" "}

                {category}

              </button>

            )
          )}

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

          {filteredArticles.map(
            (article) => {

              const content = String(
                article.content || ""
              );

              const preview =
                content.length > 150
                  ? `${content.substring(
                      0,
                      150
                    )}...`
                  : content;

              const category =
                article.category ||
                "Safety";

              return (

                <article
                  key={article._id}
                  className="card safety-card"
                >

                  {/* IMAGE */}

                  <div className="safety-card-image-wrapper">

                    <img
                      src={getArticleImage(
                        article
                      )}
                      alt={
                        article.title ||
                        "Safety tip"
                      }
                      className="safety-card-image"
                      loading="lazy"
                      onError={(
                        event
                      ) => {
                        event.currentTarget.src =
                          CATEGORY_IMAGES.Safety;
                      }}
                    />

                    <div className="image-category-badge">

                      {getCategoryIcon(
                        category
                      )}

                      {" "}

                      {category}

                    </div>

                  </div>

                  {/* CONTENT */}

                  <div className="safety-card-content">

                    <div className="safety-card-top">

                      <span
                        className="safety-icon"
                        aria-hidden="true"
                      >
                        {getCategoryIcon(
                          category
                        )}
                      </span>

                      <span className="article-category">

                        {category}

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
                          openArticle(
                            article
                          )
                        }
                      >
                        Read More →
                      </button>

                    </div>

                  </div>

                </article>

              );
            }
          )}

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
          SELF-DEFENSE FEATURE
      ===================================================== */}

      <div className="defense-feature">

        <div className="defense-feature-image">

          <img
            src="https://images.unsplash.com/photo-1555597673-b21d5c935865?auto=format&fit=crop&w=1000&q=90"
            alt="Self defense training"
          />

          <div className="defense-image-badge">
            🥋 Self-Defense
          </div>

        </div>

        <div className="defense-feature-content">

          <span className="section-label">
            SELF-DEFENSE AWARENESS
          </span>

          <h2>
            Your first defense is awareness.
          </h2>

          <p>

            Self-defense is not only about
            physical techniques. Staying aware,
            maintaining distance, using your
            voice, identifying exits, and knowing
            when to leave a situation are all
            important safety skills.

          </p>

          <div className="defense-points">

            <div>
              <span>01</span>

              <strong>
                Stay aware
              </strong>

              <small>
                Observe people and surroundings.
              </small>
            </div>

            <div>
              <span>02</span>

              <strong>
                Create distance
              </strong>

              <small>
                Keep space between you and danger.
              </small>
            </div>

            <div>
              <span>03</span>

              <strong>
                Escape safely
              </strong>

              <small>
                Look for an opportunity to move away.
              </small>
            </div>

          </div>

        </div>

      </div>

      {/* =====================================================
          SAFETY REMINDER
      ===================================================== */}

      <div className="safety-reminder">

        <div className="reminder-image">

          <img
            src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=900&q=90"
            alt="Location and emergency safety"
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

            Keep your phone charged, share
            your location with someone you
            trust, know your emergency contacts,
            and identify public places where you
            can seek help.

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

            <span>
              ✓ Know nearby public places
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

          grid-template-columns:
            1.05fr 0.95fr;

          gap: 35px;

          align-items: center;

          margin-bottom: 30px;

          padding: 10px 0;

        }

        .safety-hero-content {
          padding: 15px 0;
        }

        .safety-hero-image-wrapper {

          position: relative;

          height: 350px;

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
              transparent 30%,
              rgba(15, 23, 42, 0.78)
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
          font-size: 30px;
        }

        .hero-image-overlay strong {
          font-size: 21px;
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

          background:
            rgba(124, 58, 237, 0.08);

          color:
            var(--primary, #7c3aed);

          font-size: 13px;

          font-weight: 700;

        }

        /* =========================================
           QUICK SAFETY BANNER
        ========================================= */

        .quick-safety-banner {

          display: grid;

          grid-template-columns:
            repeat(3, 1fr);

          gap: 14px;

          margin-bottom: 30px;

        }

        .quick-safety-item {

          display: flex;

          align-items: center;

          gap: 12px;

          padding: 16px;

          border-radius: 15px;

          background: white;

          border:
            1px solid
            rgba(124, 58, 237, 0.1);

          box-shadow:
            0 7px 20px
            rgba(30, 27, 75, 0.06);

        }

        .quick-safety-item > span {

          width: 42px;
          height: 42px;

          display: grid;
          place-items: center;

          border-radius: 12px;

          background:
            rgba(124, 58, 237, 0.09);

          font-size: 21px;

          flex-shrink: 0;

        }

        .quick-safety-item strong {

          display: block;

          font-size: 14px;

          margin-bottom: 3px;

        }

        .quick-safety-item small {

          color: var(--text-muted);

          font-size: 12px;

          line-height: 1.4;

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

          border:
            1px solid
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

          background:
            rgba(128, 128, 128, 0.1);

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
           SAFETY CARD
        ========================================= */

        .safety-card {

          padding: 0;

          overflow: hidden;

          transition: 0.25s ease;

        }

        .safety-card:hover {

          transform:
            translateY(-5px);

          box-shadow:
            0 18px 40px
            rgba(30, 27, 75, 0.13);

        }

        .safety-card-image-wrapper {

          position: relative;

          height: 215px;

          overflow: hidden;

        }

        .safety-card-image {

          width: 100%;

          height: 100%;

          object-fit: cover;

          display: block;

          transition:
            transform 0.4s ease;

        }

        .safety-card:hover
        .safety-card-image {

          transform:
            scale(1.06);

        }

        .image-category-badge {

          position: absolute;

          left: 14px;

          bottom: 14px;

          padding: 7px 11px;

          border-radius: 999px;

          background:
            rgba(15, 23, 42, 0.84);

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

          width: 40px;

          height: 40px;

          display: grid;

          place-items: center;

          border-radius: 11px;

          background:
            rgba(124, 58, 237, 0.1);

          font-size: 20px;

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

          margin:
            0 0 10px;

          font-size: 19px;

          line-height: 1.35;

        }

        .safety-card-description {

          margin: 0;

          color:
            var(--text-muted);

          line-height: 1.65;

          font-size: 14px;

          min-height: 68px;

        }

        .safety-card-footer {

          display: flex;

          justify-content:
            space-between;

          align-items: center;

          gap: 12px;

          margin-top: 20px;

          padding-top: 14px;

          border-top:
            1px solid
            var(--border, #e5e7eb);

        }

        .article-author {

          color:
            var(--text-muted);

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
           SELF DEFENSE FEATURE
        ========================================= */

        .defense-feature {

          display: grid;

          grid-template-columns:
            0.9fr 1.1fr;

          margin-top: 45px;

          overflow: hidden;

          border-radius: 22px;

          background:
            linear-gradient(
              135deg,
              #f5f3ff,
              #ffffff
            );

          border:
            1px solid
            rgba(124, 58, 237, 0.13);

          box-shadow:
            0 14px 35px
            rgba(30, 27, 75, 0.08);

        }

        .defense-feature-image {

          min-height: 360px;

          position: relative;

          overflow: hidden;

        }

        .defense-feature-image img {

          width: 100%;

          height: 100%;

          object-fit: cover;

          display: block;

        }

        .defense-image-badge {

          position: absolute;

          bottom: 18px;

          left: 18px;

          padding: 9px 14px;

          border-radius: 999px;

          background:
            rgba(15, 23, 42, 0.82);

          color: white;

          font-size: 13px;

          font-weight: 800;

          backdrop-filter: blur(8px);

        }

        .defense-feature-content {

          padding: 38px;

          display: flex;

          flex-direction: column;

          justify-content: center;

        }

        .defense-feature-content h2 {

          margin:
            10px 0;

          font-size: 29px;

          line-height: 1.25;

        }

        .defense-feature-content > p {

          color:
            var(--text-muted);

          line-height: 1.75;

          margin: 0 0 22px;

        }

        .defense-points {

          display: grid;

          gap: 12px;

        }

        .defense-points > div {

          display: grid;

          grid-template-columns:
            42px 1fr;

          column-gap: 10px;

          align-items: center;

        }

        .defense-points span {

          grid-row:
            span 2;

          width: 38px;

          height: 38px;

          display: grid;

          place-items: center;

          border-radius: 10px;

          background:
            rgba(124, 58, 237, 0.1);

          color:
            var(--primary, #7c3aed);

          font-size: 11px;

          font-weight: 900;

        }

        .defense-points strong {
          font-size: 14px;
        }

        .defense-points small {

          color:
            var(--text-muted);

          font-size: 12px;

        }

        /* =========================================
           SAFETY REMINDER
        ========================================= */

        .safety-reminder {

          display: grid;

          grid-template-columns:
            0.8fr 1.2fr;

          margin-top: 40px;

          overflow: hidden;

          border-radius: 22px;

          background:
            linear-gradient(
              135deg,
              #f5f3ff,
              #ffffff
            );

          border:
            1px solid
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

          margin:
            10px 0;

          font-size: 27px;

          line-height: 1.25;

        }

        .reminder-content p {

          color:
            var(--text-muted);

          line-height: 1.7;

          margin:
            0 0 18px;

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

          color:
            var(--text-muted);

          max-width: 500px;

          margin:
            10px auto 20px;

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
            height: 300px;
          }

          .quick-safety-banner {

            grid-template-columns: 1fr;

          }

          .defense-feature {

            grid-template-columns: 1fr;

          }

          .defense-feature-image {

            min-height: 280px;

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

            height: 240px;

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

            height: 190px;

          }

          .safety-card-content {

            padding: 16px;

          }

          .safety-card-footer {

            align-items: flex-start;

            flex-direction: column;

          }

          .defense-feature-content {

            padding: 24px;

          }

          .defense-feature-content h2 {

            font-size: 23px;

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