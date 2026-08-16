import { useEffect, useState } from "react";
import { contactAPI } from "../services/api";

const INITIAL_FORM = {
  name: "",
  phone: "",
  relationship: "",
  isPrimary: false,
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
    const trimmedRelationship = form.relationship.trim();

    if (!trimmedName || !trimmedPhone || !trimmedRelationship) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!/^[0-9+\-\s()]{7,20}$/.test(trimmedPhone)) {
      setError("Please enter a valid phone number.");
      return;
    }

    try {
      setSaving(true);

      await contactAPI.add({
        name: trimmedName,
        phone: trimmedPhone,
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
     PHONE CALL
  ===================================================== */

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="loading">
        <div>
          <p style={{ textAlign: "center", marginBottom: "0.5rem" }}>
            Loading emergency contacts...
          </p>

          <div
            className="skeleton"
            style={{
              width: "220px",
              height: "8px",
              margin: "0 auto",
            }}
          />
        </div>
      </div>
    );
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="safety-tips-page">

      {/* PAGE HEADER */}
      <div
        className="page-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <div>
          <span className="section-label">
            EMERGENCY SUPPORT
          </span>

          <h1 className="page-title">
            Emergency Contacts
          </h1>

          <p className="page-description">
            Add trusted people who can be contacted quickly during
            an emergency. Your contacts can help you get immediate
            assistance when you need it most.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setShowForm((prev) => !prev);
            setError("");
            setSuccess("");
          }}
        >
          {showForm ? "✕ Cancel" : "＋ Add Contact"}
        </button>
      </div>

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="alert alert-success">
          <span>✓</span>
          <span>{success}</span>
        </div>
      )}

      {/* ERROR MESSAGE */}
      {error && (
        <div className="alert alert-error">
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* =================================================
          ADD CONTACT FORM
      ================================================= */}

      {showForm && (
        <div
          className="card"
          style={{
            maxWidth: "650px",
            marginBottom: "2rem",
          }}
        >
          <div style={{ marginBottom: "1.5rem" }}>
            <h2
              style={{
                marginBottom: "0.35rem",
                fontSize: "1.35rem",
              }}
            >
              Add Emergency Contact
            </h2>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
              }}
            >
              Enter the details of someone you trust.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="form-group">
              <label htmlFor="contact-name">
                Full Name *
              </label>

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

            {/* PHONE */}
            <div className="form-group">
              <label htmlFor="contact-phone">
                Phone Number *
              </label>

              <input
                id="contact-phone"
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. +91 9876543210"
                maxLength={20}
                autoComplete="tel"
                required
              />
            </div>

            {/* RELATIONSHIP */}
            <div className="form-group">
              <label htmlFor="contact-relationship">
                Relationship *
              </label>

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

                <option value="Mother">
                  Mother
                </option>

                <option value="Father">
                  Father
                </option>

                <option value="Sister">
                  Sister
                </option>

                <option value="Brother">
                  Brother
                </option>

                <option value="Friend">
                  Friend
                </option>

                <option value="Spouse">
                  Spouse
                </option>

                <option value="Relative">
                  Relative
                </option>

                <option value="Guardian">
                  Guardian
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            {/* PRIMARY CONTACT */}
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.65rem",
                marginBottom: "1.5rem",
                cursor: "pointer",
                fontWeight: 500,
              }}
            >
              <input
                type="checkbox"
                name="isPrimary"
                checked={form.isPrimary}
                onChange={handleChange}
                style={{
                  width: "18px",
                  height: "18px",
                  accentColor: "var(--primary)",
                }}
              />

              <span>
                Set as primary emergency contact
              </span>
            </label>

            {/* FORM ACTIONS */}
            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving ? "Saving..." : "✓ Save Contact"}
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
        </div>
      )}

      {/* =================================================
          CONTACT INFORMATION
      ================================================= */}

      <div
        className="card"
        style={{
          marginBottom: "1.5rem",
          background:
            "linear-gradient(135deg, #faf5ff, #ffffff)",
          border: "1px solid rgb(147 51 234 / 0.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
          }}
        >
          <div
            style={{
              width: "45px",
              height: "45px",
              minWidth: "45px",
              borderRadius: "12px",
              background: "rgb(147 51 234 / 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.3rem",
            }}
          >
            🛡️
          </div>

          <div>
            <h3 style={{ marginBottom: "0.3rem" }}>
              Keep trusted people close
            </h3>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                lineHeight: 1.6,
              }}
            >
              Your primary contact can be prioritized when
              an SOS emergency is triggered.
            </p>
          </div>
        </div>
      </div>

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {contacts.length === 0 ? (
        <div className="card empty-state">

          <div className="empty-state-icon">
            👥
          </div>

          <h3>
            No Emergency Contacts
          </h3>

          <p>
            You haven't added any emergency contacts yet.
            Add a trusted family member, friend, or guardian
            so they can be reached quickly during an emergency.
          </p>

          <button
            className="btn btn-primary"
            onClick={() => setShowForm(true)}
          >
            ＋ Add Your First Contact
          </button>
        </div>
      ) : (
        <>
          {/* CONTACT COUNT */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "1.3rem",
                  marginBottom: "0.2rem",
                }}
              >
                Your Trusted Contacts
              </h2>

              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                }}
              >
                {contacts.length}{" "}
                {contacts.length === 1
                  ? "contact"
                  : "contacts"}{" "}
                saved
              </p>
            </div>
          </div>

          {/* =================================================
              CONTACT GRID
          ================================================= */}

          <div className="grid grid-2">

            {contacts.map((contact) => (
              <div
                key={contact._id}
                className="card"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  border:
                    contact.isPrimary
                      ? "1px solid rgb(147 51 234 / 0.25)"
                      : "1px solid var(--border)",
                }}
              >

                {/* PRIMARY INDICATOR */}
                {contact.isPrimary && (
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      height: "4px",
                      background:
                        "var(--primary)",
                    }}
                  />
                )}

                {/* CONTACT HEADER */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: "1rem",
                    marginBottom: "1.25rem",
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.9rem",
                    }}
                  >

                    <div
                      style={{
                        width: "50px",
                        height: "50px",
                        minWidth: "50px",
                        borderRadius: "50%",
                        background:
                          "rgb(147 51 234 / 0.1)",
                        color: "var(--primary)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.2rem",
                        fontWeight: 700,
                      }}
                    >
                      {contact.name
                        ?.charAt(0)
                        ?.toUpperCase() || "?"}
                    </div>

                    <div>
                      <h3
                        style={{
                          marginBottom: "0.25rem",
                          fontSize: "1.1rem",
                        }}
                      >
                        {contact.name}
                      </h3>

                      {contact.isPrimary && (
                        <span className="badge badge-active">
                          ⭐ Primary
                        </span>
                      )}
                    </div>

                  </div>
                </div>

                {/* CONTACT DETAILS */}
                <div
                  style={{
                    display: "grid",
                    gap: "0.8rem",
                    marginBottom: "1.25rem",
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.1rem",
                      }}
                    >
                      📞
                    </span>

                    <div>
                      <small
                        style={{
                          display: "block",
                          color: "var(--text-muted)",
                          fontSize: "0.72rem",
                        }}
                      >
                        Phone
                      </small>

                      <strong
                        style={{
                          fontSize: "0.9rem",
                        }}
                      >
                        {contact.phone}
                      </strong>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.75rem",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.1rem",
                      }}
                    >
                      👤
                    </span>

                    <div>
                      <small
                        style={{
                          display: "block",
                          color: "var(--text-muted)",
                          fontSize: "0.72rem",
                        }}
                      >
                        Relationship
                      </small>

                      <strong
                        style={{
                          fontSize: "0.9rem",
                        }}
                      >
                        {contact.relationship}
                      </strong>
                    </div>
                  </div>

                </div>

                {/* ACTIONS */}
                <div
                  style={{
                    display: "flex",
                    gap: "0.65rem",
                    paddingTop: "1rem",
                    borderTop:
                      "1px solid var(--border)",
                  }}
                >

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() =>
                      handleCall(contact.phone)
                    }
                    style={{
                      flex: 1,
                    }}
                  >
                    📞 Call
                  </button>

                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() =>
                      handleDelete(contact._id)
                    }
                    disabled={
                      deletingId === contact._id
                    }
                    style={{
                      color: "var(--danger)",
                      borderColor: "var(--danger)",
                    }}
                  >
                    {deletingId === contact._id
                      ? "Removing..."
                      : "Remove"}
                  </button>

                </div>

              </div>
            ))}

          </div>
        </>
      )}
    </div>
  );
};

export default EmergencyContacts;