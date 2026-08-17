// src/components/SOSButton.jsx

import { useRef, useState } from "react";

import {
  sosAPI,
  contactAPI,
  userAPI,
} from "../services/api";

// =========================================================
// SOS BUTTON
// =========================================================

const SOSButton = ({
  onTriggered,
}) => {

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // =======================================================
  // PREVENT DOUBLE CLICK
  //
  // This is stronger than only using React state.
  // =======================================================

  const sendingRef =
    useRef(false);

  // =======================================================
  // GET GPS LOCATION
  //
  // This is called ONLY ONCE.
  // =======================================================

  const getCurrentLocation = () => {

    return new Promise(
      (resolve, reject) => {

        if (
          !navigator.geolocation
        ) {
          reject(
            new Error(
              "Geolocation is not supported by this browser."
            )
          );

          return;
        }

        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,

            timeout: 15000,

            maximumAge: 30000,
          }
        );
      }
    );
  };

  // =======================================================
  // HANDLE SOS
  // =======================================================

  const handleSOS = async () => {

    // -----------------------------------------------------
    // STOP DOUBLE CLICK
    // -----------------------------------------------------

    if (sendingRef.current) {

      console.warn(
        "⚠️ SOS is already being processed."
      );

      return;
    }

    // -----------------------------------------------------
    // CONFIRM
    // -----------------------------------------------------

    const confirmed =
      window.confirm(
        "🚨 Trigger SOS alert?\n\n" +
        "All your emergency contacts will be notified."
      );

    if (!confirmed) {
      return;
    }

    // -----------------------------------------------------
    // LOCK BUTTON
    // -----------------------------------------------------

    sendingRef.current = true;

    setLoading(true);

    setError("");

    try {

      // ===================================================
      // STEP 1 — GET CURRENT USER
      // ===================================================

      const {
        data: user,
      } =
        await userAPI.getProfile();

      console.log(
        "👤 Current user:",
        user
      );

      // ===================================================
      // STEP 2 — GET ALL EMERGENCY CONTACTS
      // ===================================================

      const {
        data: contacts,
      } =
        await contactAPI.getAll();

      console.log(
        "📱 Emergency contacts:",
        contacts
      );

      // ---------------------------------------------------
      // CHECK CONTACTS
      // ---------------------------------------------------

      if (
        !Array.isArray(contacts) ||
        contacts.length === 0
      ) {

        throw new Error(
          "No emergency contacts found. Please add emergency contacts first."
        );
      }

      // ===================================================
      // STEP 3 — KEEP ONLY CONTACTS WITH EMAIL
      // ===================================================

      const contactsWithEmail =
        contacts.filter(
          (contact) => {

            return (
              contact &&
              typeof contact.email === "string" &&
              contact.email.trim() !== ""
            );
          }
        );

      if (
        contactsWithEmail.length === 0
      ) {

        throw new Error(
          "Your emergency contacts do not have email addresses."
        );
      }

      // ===================================================
      // STEP 4 — REMOVE DUPLICATE EMAIL ADDRESSES
      //
      // Example:
      //
      // Mother  → abc@gmail.com
      // Father  → abc@gmail.com
      // Sister  → sister@gmail.com
      //
      // Result:
      //
      // abc@gmail.com
      // sister@gmail.com
      //
      // Therefore abc@gmail.com receives only ONE email.
      // ===================================================

      const uniqueEmails =
        new Set();

      const uniqueContacts =
        [];

      for (
        const contact of contactsWithEmail
      ) {

        const email =
          contact.email
            .trim()
            .toLowerCase();

        if (
          !uniqueEmails.has(email)
        ) {

          uniqueEmails.add(email);

          uniqueContacts.push({
            ...contact,

            email,
          });
        }
      }

      console.log(
        "================================="
      );

      console.log(
        "📧 UNIQUE EMERGENCY CONTACTS"
      );

      console.log(
        uniqueContacts.map(
          (contact) => contact.email
        )
      );

      console.log(
        "Total:",
        uniqueContacts.length
      );

      console.log(
        "================================="
      );

      // ===================================================
      // STEP 5 — GET LOCATION ONCE
      // ===================================================

      let lat = "";

      let lng = "";

      let mapsLink =
        "Location unavailable";

      try {

        console.log(
          "📍 Getting location..."
        );

        const position =
          await getCurrentLocation();

        lat =
          position.coords.latitude;

        lng =
          position.coords.longitude;

        mapsLink =
          `https://www.google.com/maps?q=${lat},${lng}`;

        console.log(
          "✅ Location received:",
          {
            lat,
            lng,
          }
        );

      } catch (locationError) {

        console.warn(
          "⚠️ Could not get location:",
          locationError
        );

        // -------------------------------------------------
        // SOS SHOULD STILL CONTINUE
        // -------------------------------------------------

        mapsLink =
          "Location unavailable";
      }

      // ===================================================
      // STEP 6 — SAVE SOS
      //
      // IMPORTANT:
      //
      // sosAPI.trigger() ONLY saves the SOS.
      //
      // It DOES NOT send email.
      // ===================================================

      const {
        data: sosData,
      } =
        await sosAPI.trigger({

          lat,

          lng,

          maps_link:
            mapsLink,

          message:
            "🚨 Emergency! An SOS alert has been triggered from ShaktiShield.",

          user_name:
            user?.name ||
            "ShaktiShield User",
        });

      console.log(
        "💾 SOS saved:",
        sosData
      );

      // ===================================================
      // STEP 7 — SEND TO EVERY UNIQUE CONTACT
      //
      // 5 contacts = 5 emails.
      //
      // Each contact gets ONE email.
      // ===================================================

      const results =
        [];

      for (
        const contact of uniqueContacts
      ) {

        console.log(
          "📨 Sending to:",
          contact.email
        );

        try {

          const result =
            await sosAPI.sendEmailToContact({

              contact,

              user,

              lat,

              lng,

              mapsLink,
            });

          results.push({

            email:
              contact.email,

            name:
              contact.name ||
              contact.email,

            success:
              result.success,

            error:
              result.error ||
              null,
          });

        } catch (emailError) {

          console.error(
            "❌ Failed for:",
            contact.email,
            emailError
          );

          results.push({

            email:
              contact.email,

            name:
              contact.name ||
              contact.email,

            success:
              false,

            error:
              emailError?.message ||
              "Email failed",
          });
        }
      }

      // ===================================================
      // STEP 8 — COUNT RESULTS
      // ===================================================

      const successful =
        results.filter(
          (result) =>
            result.success === true
        );

      const failed =
        results.filter(
          (result) =>
            result.success !== true
        );

      console.log(
        "================================="
      );

      console.log(
        "🚨 SOS COMPLETE"
      );

      console.log(
        "Unique contacts:",
        uniqueContacts.length
      );

      console.log(
        "Emails successfully sent:",
        successful.length
      );

      console.log(
        "Emails failed:",
        failed.length
      );

      console.log(
        "================================="
      );

      // ===================================================
      // STEP 9 — NOTIFY PARENT COMPONENT
      // ===================================================

      if (onTriggered) {

        onTriggered({

          ...sosData,

          emailResults:
            results,

          emailsSent:
            successful.length,

          emailsFailed:
            failed.length,
        });
      }

      // ===================================================
      // STEP 10 — SHOW RESULT
      // ===================================================

      if (
        successful.length > 0
      ) {

        alert(
          "🚨 SOS ALERT SENT\n\n" +

          `${successful.length} emergency contact(s) were notified.` +

          (
            failed.length > 0
              ? `\n\n${failed.length} contact(s) could not be notified.`
              : ""
          )
        );

      } else {

        throw new Error(
          "SOS was saved, but no emergency notification could be sent."
        );
      }

    } catch (err) {

      console.error(
        "❌ SOS ERROR:",
        err
      );

      setError(
        err?.message ||
        "Failed to trigger SOS."
      );

    } finally {

      // ---------------------------------------------------
      // UNLOCK BUTTON
      // ---------------------------------------------------

      sendingRef.current =
        false;

      setLoading(false);
    }
  };

  // =======================================================
  // UI
  // =======================================================

  return (
    <div
      style={{
        textAlign: "center",
      }}
    >

      <button
        type="button"

        onClick={handleSOS}

        disabled={loading}

        aria-label="Emergency SOS"

        style={{
          width: "160px",

          height: "160px",

          borderRadius: "50%",

          background:
            loading
              ? "#fca5a5"
              : "var(--danger)",

          color: "#ffffff",

          border:
            "6px solid #fecaca",

          fontSize: "1.5rem",

          fontWeight: 800,

          cursor:
            loading
              ? "not-allowed"
              : "pointer",

          boxShadow:
            "0 0 30px rgba(239, 68, 68, 0.4)",

          animation:
            loading
              ? "none"
              : "shaktiSOSPulse 2s infinite",

          transition:
            "transform 0.2s",
        }}
      >

        {loading
          ? "Sending..."
          : "SOS"}

      </button>

      {error && (

        <p
          className="alert alert-error"

          style={{
            marginTop: "1rem",

            maxWidth: "400px",

            marginLeft: "auto",

            marginRight: "auto",
          }}
        >
          {error}
        </p>

      )}

      <style>
        {`
          @keyframes shaktiSOSPulse {

            0%, 100% {
              box-shadow:
                0 0 30px
                rgba(239, 68, 68, 0.4);
            }

            50% {
              box-shadow:
                0 0 50px
                rgba(239, 68, 68, 0.75);
            }

          }
        `}
      </style>

    </div>
  );
};

export default SOSButton;