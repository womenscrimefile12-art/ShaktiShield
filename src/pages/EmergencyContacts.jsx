import { useEffect, useMemo, useState } from "react";
import { contactAPI } from "../services/api";

const INITIAL_FORM = {
  name: "",
  phone: "",
  email: "",
  relationship: "",
  isPrimary: false,
};

const relationshipIcons = {
  Mother: "👩",
  Father: "👨",
  Sister: "👩‍🦰",
  Brother: "👨‍🦱",
  Friend: "🤝",
  Spouse: "💞",
  Relative: "👪",
  Guardian: "🛡️",
  Other: "👤",
};

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);

  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* =====================================================
     FETCH CONTACTS
  ===================================================== */

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await contactAPI.getAll();

      setContacts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch emergency contacts:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to load emergency contacts. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  /* =====================================================
     FORM HANDLING
  ===================================================== */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setShowForm(false);
  };

  /* =====================================================
     ADD CONTACT
  ===================================================== */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = form.name.trim();
    const trimmedPhone = form.phone.trim();
    const trimmedEmail = form.email.trim();
    const trimmedRelationship = form.relationship.trim();

    if (
      !trimmedName ||
      !trimmedPhone ||
      !trimmedEmail ||
      !trimmedRelationship
    ) {
      setError(
        "Please fill in name, phone, email and relationship."
      );
      return;
    }

    if (!/^[0-9+\-\s()]{7,20}$/.test(trimmedPhone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setSaving(true);

      await contactAPI.add({
        name: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail,
        relationship: trimmedRelationship,
        isPrimary: form.isPrimary,
      });

      setSuccess("Emergency contact added successfully.");

      resetForm();

      await fetchContacts();
    } catch (err) {
      console.error("Failed to add contact:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to add emergency contact. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     DELETE CONTACT
  ===================================================== */

  const handleDelete = async (id) => {
    const contact = contacts.find((item) => item._id === id);

    const confirmed = window.confirm(
      `Are you sure you want to remove ${
        contact?.name || "this contact"
      } from your emergency contacts?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await contactAPI.delete(id);

      setSuccess("Emergency contact removed successfully.");

      await fetchContacts();
    } catch (err) {
      console.error("Failed to delete contact:", err);

      setError(
        err?.response?.data?.message ||
          "Unable to remove contact. Please try again."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /* =====================================================
     CALL CONTACT
  ===================================================== */

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  /* =====================================================
     STATS
  ===================================================== */

  const primaryContact = useMemo(
    () => contacts.find((contact) => contact.isPrimary),
    [contacts]
  );

  const stats = {
    total: contacts.length,
    primary: contacts.filter((contact) => contact.isPrimary).length,
    reachable: contacts.filter(
      (contact) => contact.phone || contact.email
    ).length,
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="loading">
        <div className="contacts-loading">
          <div className="loading-shield">🛡️</div>

          <h3>Loading your trusted contacts</h3>

          <p>
            Securely retrieving your emergency contact list...
          </p>

          <div className="skeleton loading-bar" />
        </div>
      </div>
    );
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="safety-tips-page contacts-page">

      {/* =================================================
          HERO HEADER
      ================================================= */}

      <section className="contacts-hero">

        <div className="contacts-hero-content">

          <div className="contacts-hero-badge">
            <span>🛡️</span>
            EMERGENCY NETWORK
          </div>

          <h1 className="page-title">
            Your Trusted
            <span> Emergency Contacts</span>
          </h1>

          <p className="page-description">
            Keep the people you trust just one tap away.
            These contacts can be reached quickly when
            you need help or activate SOS.
          </p>

          <div className="contacts-hero-actions">

            <button
              type="button"
              className="btn btn-primary contacts-add-btn"
              onClick={() => {
                setShowForm((prev) => !prev);
                setError("");
                setSuccess("");
              }}
            >
              {showForm ? "✕ Close Form" : "＋ Add Contact"}
            </button>

            <span className="contacts-security-note">
              🔒 Your contact information is protected
            </span>

          </div>

        </div>

        <div className="contacts-hero-visual">

          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />

          <div className="hero-shield">
            🛡️
          </div>

          <div className="hero-floating-card hero-floating-top">
            <span>🚨</span>
            <div>
              <strong>SOS Ready</strong>
              <small>Contacts connected</small>
            </div>
          </div>

          <div className="hero-floating-card hero-floating-bottom">
            <span>✓</span>
            <div>
              <strong>Protected</strong>
              <small>Trusted network</small>
            </div>
          </div>

        </div>

      </section>

      {/* =================================================
          ALERTS
      ================================================= */}

      {success && (
        <div className="alert alert-success contacts-alert">
          <span className="contacts-alert-icon">✓</span>

          <span>{success}</span>

          <button
            type="button"
            className="alert-close"
            onClick={() => setSuccess("")}
            aria-label="Close success message"
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div className="alert alert-error contacts-alert">
          <span className="contacts-alert-icon">⚠️</span>

          <span>{error}</span>

          <button
            type="button"
            className="alert-close"
            onClick={() => setError("")}
            aria-label="Close error message"
          >
            ×
          </button>
        </div>
      )}

      {/* =================================================
          STATS
      ================================================= */}

      <section className="contacts-stats">

        <div className="contact-stat-card">
          <div className="contact-stat-icon purple">
            👥
          </div>

          <div>
            <span>Total Contacts</span>
            <strong>{stats.total}</strong>
          </div>
        </div>

        <div className="contact-stat-card">
          <div className="contact-stat-icon red">
            ⭐
          </div>

          <div>
            <span>Primary Contact</span>
            <strong>
              {stats.primary > 0 ? "Set" : "Not Set"}
            </strong>
          </div>
        </div>

        <div className="contact-stat-card">
          <div className="contact-stat-icon green">
            📡
          </div>

          <div>
            <span>Reachable</span>
            <strong>{stats.reachable}</strong>
          </div>
        </div>

      </section>

      {/* =================================================
          ADD CONTACT FORM
      ================================================= */}

      {showForm && (
        <section className="contact-form-card">

          <div className="contact-form-header">

            <div className="contact-form-icon">
              ＋
            </div>

            <div>
              <span className="section-label">
                NEW CONTACT
              </span>

              <h2>
                Add someone you trust
              </h2>

              <p>
                Their details can be used when your
                emergency response is activated.
              </p>
            </div>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="contact-form-grid">

              {/* NAME */}

              <div className="form-group">
                <label htmlFor="contact-name">
                  Full Name *
                </label>

                <div className="input-with-icon">
                  <span>👤</span>

                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Priya Sharma"
                    maxLength={100}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>

              {/* PHONE */}

              <div className="form-group">
                <label htmlFor="contact-phone">
                  Phone Number *
                </label>

                <div className="input-with-icon">
                  <span>📞</span>

                  <input
                    id="contact-phone"
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    maxLength={20}
                    autoComplete="tel"
                    required
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div className="form-group">
                <label htmlFor="contact-email">
                  Email Address *
                </label>

                <div className="input-with-icon">
                  <span>✉️</span>

                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="priya@gmail.com"
                    maxLength={150}
                    autoComplete="email"
                    required
                  />
                </div>

                <small className="form-helper">
                  SOS notifications can be sent to this address.
                </small>
              </div>

              {/* RELATIONSHIP */}

              <div className="form-group">
                <label htmlFor="contact-relationship">
                  Relationship *
                </label>

                <div className="input-with-icon select-input">
                  <span>
                    {relationshipIcons[form.relationship] || "👥"}
                  </span>

                  <select
                    id="contact-relationship"
                    name="relationship"
                    value={form.relationship}
                    onChange={handleChange}
                    required
                  >
                    <option value="">
                      Select relationship
                    </option>

                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Sister">Sister</option>
                    <option value="Brother">Brother</option>
                    <option value="Friend">Friend</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Relative">Relative</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

            </div>

            {/* PRIMARY */}

            <label className="primary-contact-toggle">

              <div className="primary-toggle-left">

                <div className="primary-toggle-icon">
                  ⭐
                </div>

                <div>
                  <strong>
                    Make this the primary contact
                  </strong>

                  <small>
                    Your primary contact is your first
                    trusted person for emergency response.
                  </small>
                </div>

              </div>

              <input
                type="checkbox"
                name="isPrimary"
                checked={form.isPrimary}
                onChange={handleChange}
              />

            </label>

            {/* ACTIONS */}

            <div className="contact-form-actions">

              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <span className="button-spinner" />
                    Saving...
                  </>
                ) : (
                  <>✓ Save Contact</>
                )}
              </button>

              <button
                type="button"
                className="btn btn-outline"
                onClick={resetForm}
                disabled={saving}
              >
                Cancel
              </button>

            </div>

          </form>
        </section>
      )}

      {/* =================================================
          SAFETY NOTICE
      ================================================= */}

      <section className="contacts-safety-banner">

        <div className="contacts-safety-icon">
          🛡️
        </div>

        <div className="contacts-safety-content">

          <span>SAFETY TIP</span>

          <h3>
            Keep your emergency network up to date
          </h3>

          <p>
            Add people who are likely to answer quickly.
            Make sure their phone numbers and email
            addresses are current.
          </p>

        </div>

        <div className="contacts-safety-checks">

          <div>
            <span>✓</span>
            Trusted person
          </div>

          <div>
            <span>✓</span>
            Current phone
          </div>

          <div>
            <span>✓</span>
            Current email
          </div>

        </div>

      </section>

      {/* =================================================
          PRIMARY CONTACT
      ================================================= */}

      {primaryContact && (
        <section className="primary-contact-highlight">

          <div className="primary-highlight-left">

            <div className="primary-highlight-avatar">
              {primaryContact.name
                ?.charAt(0)
                ?.toUpperCase() || "?"}
            </div>

            <div>
              <span>
                ⭐ PRIMARY EMERGENCY CONTACT
              </span>

              <h3>
                {primaryContact.name}
              </h3>

              <p>
                {primaryContact.relationship}
              </p>
            </div>

          </div>

          <button
            type="button"
            className="btn btn-danger"
            onClick={() =>
              handleCall(primaryContact.phone)
            }
          >
            📞 Call Primary
          </button>

        </section>
      )}

      {/* =================================================
          CONTACTS HEADER
      ================================================= */}

      {contacts.length > 0 && (
        <div className="contacts-list-header">

          <div>
            <span className="section-label">
              YOUR NETWORK
            </span>

            <h2>
              Trusted Contacts
            </h2>

            <p>
              {contacts.length}{" "}
              {contacts.length === 1
                ? "person"
                : "people"}{" "}
              in your emergency network
            </p>
          </div>

          <div className="network-status">
            <span className="network-status-dot" />
            Emergency network ready
          </div>

        </div>
      )}

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {contacts.length === 0 ? (
        <div className="card empty-state enhanced-empty-state">

          <div className="empty-contact-illustration">
            <div>👥</div>
            <span>＋</span>
          </div>

          <span className="section-label">
            BUILD YOUR SAFETY NETWORK
          </span>

          <h3>
            No emergency contacts yet
          </h3>

          <p>
            Add a family member, friend, guardian or
            another trusted person. They'll be ready
            to help when you need them most.
          </p>

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            ＋ Add Your First Contact
          </button>

        </div>
      ) : (

        /* =================================================
           CONTACT GRID
        ================================================= */

        <div className="contacts-grid">

          {contacts.map((contact) => {

            const avatarLetter =
              contact.name
                ?.charAt(0)
                ?.toUpperCase() || "?";

            const relationshipIcon =
              relationshipIcons[
                contact.relationship
              ] || "👤";

            return (
              <article
                key={contact._id}
                className={`enhanced-contact-card ${
                  contact.isPrimary
                    ? "primary-contact-card"
                    : ""
                }`}
              >

                {/* PRIMARY TOP BAR */}

                {contact.isPrimary && (
                  <div className="primary-card-bar">
                    ⭐ PRIMARY CONTACT
                  </div>
                )}

                {/* CARD HEADER */}

                <div className="enhanced-contact-header">

                  <div
                    className={`contact-avatar ${
                      contact.isPrimary
                        ? "primary-avatar"
                        : ""
                    }`}
                  >
                    {avatarLetter}
                  </div>

                  <div className="contact-name-block">

                    <h3>
                      {contact.name}
                    </h3>

                    <div className="contact-relationship">
                      <span>
                        {relationshipIcon}
                      </span>

                      {contact.relationship ||
                        "Trusted Contact"}
                    </div>

                  </div>

                  <div className="contact-status">
                    <span />
                    Ready
                  </div>

                </div>

                {/* DETAILS */}

                <div className="enhanced-contact-details">

                  <a
                    href={`tel:${contact.phone}`}
                    className="contact-detail-row"
                  >
                    <div className="contact-detail-icon">
                      📞
                    </div>

                    <div>
                      <small>Phone</small>
                      <strong>
                        {contact.phone}
                      </strong>
                    </div>

                    <span className="detail-arrow">
                      →
                    </span>
                  </a>

                  <a
                    href={`mailto:${contact.email}`}
                    className="contact-detail-row"
                  >
                    <div className="contact-detail-icon">
                      ✉️
                    </div>

                    <div>
                      <small>Email</small>

                      <strong className="contact-email-text">
                        {contact.email ||
                          "No email added"}
                      </strong>
                    </div>

                    <span className="detail-arrow">
                      →
                    </span>
                  </a>

                </div>

                {/* ACTIONS */}

                <div className="enhanced-contact-actions">

                  <button
                    type="button"
                    className="contact-call-btn"
                    onClick={() =>
                      handleCall(contact.phone)
                    }
                  >
                    <span>📞</span>
                    Call Now
                  </button>

                  <button
                    type="button"
                    className="contact-remove-btn"
                    onClick={() =>
                      handleDelete(contact._id)
                    }
                    disabled={
                      deletingId === contact._id
                    }
                    aria-label={`Remove ${contact.name}`}
                  >
                    {deletingId === contact._id
                      ? "..."
                      : "🗑️"}
                  </button>

                </div>

              </article>
            );
          })}

        </div>
      )}

    </div>
  );
};

export default EmergencyContacts;