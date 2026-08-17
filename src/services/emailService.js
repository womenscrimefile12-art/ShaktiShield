// src/services/emailService.js

import emailjs from "@emailjs/browser";

// =========================================================
// EMAILJS CONFIGURATION
// =========================================================

const SERVICE_ID = "service_ynf7gsp";
const TEMPLATE_ID = "template_nvazo5l";
const PUBLIC_KEY = "OcYnrCBPC4sbrAFA3";

// =========================================================
// SEND ONE EMERGENCY EMAIL
//
// IMPORTANT:
// This function sends ONLY ONE email.
// It does NOT get the user's location.
// The location is received from SOSButton.
// =========================================================

export const sendEmergencyAlert = async ({
  user_name,
  emergencyEmail,
  message,
  lat = "",
  lng = "",
  maps_link = "",
}) => {
  try {
    // -----------------------------------------------------
    // CLEAN EMAIL
    // -----------------------------------------------------

    const recipient =
      typeof emergencyEmail === "string"
        ? emergencyEmail.trim().toLowerCase()
        : "";

    if (!recipient) {
      return {
        success: false,
        error: "Emergency contact email is missing.",
      };
    }

    // -----------------------------------------------------
    // GOOGLE MAPS LINK
    // -----------------------------------------------------

    let finalMapsLink = maps_link;

    if (
      !finalMapsLink &&
      lat !== "" &&
      lng !== ""
    ) {
      finalMapsLink =
        `https://www.google.com/maps?q=${lat},${lng}`;
    }

    if (!finalMapsLink) {
      finalMapsLink = "Location unavailable";
    }

    // -----------------------------------------------------
    // CURRENT TIME
    // -----------------------------------------------------

    const time =
      new Date().toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "medium",
      });

    // -----------------------------------------------------
    // EMAILJS TEMPLATE DATA
    // -----------------------------------------------------

    const templateParams = {
      user_name:
        user_name ||
        "ShaktiShield User",

      time,

      maps_link:
        finalMapsLink,

      lat,

      lng,

      message:
        message ||
        "🚨 Emergency! SOS has been activated through ShaktiShield.",

      to_email:
        recipient,
    };

    console.log(
      "📨 Sending ONE emergency email:",
      recipient
    );

    // -----------------------------------------------------
    // SEND ONE EMAIL
    // -----------------------------------------------------

    const result =
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        {
          publicKey: PUBLIC_KEY,
        }
      );

    console.log(
      "✅ Email sent successfully:",
      recipient
    );

    console.log(
      "EmailJS response:",
      result.status
    );

    return {
      success: true,

      email:
        recipient,

      latitude:
        lat,

      longitude:
        lng,

      maps_link:
        finalMapsLink,

      time,
    };

  } catch (error) {

    console.error(
      "❌ EmailJS failed:",
      error
    );

    return {
      success: false,

      email:
        emergencyEmail,

      error:
        error?.text ||
        error?.message ||
        "Failed to send emergency email.",
    };
  }
};