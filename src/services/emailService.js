import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_ynf7gsp";
const TEMPLATE_ID = "template_nvazo5l";
const PUBLIC_KEY = "OcYnrCBPC4sbrAFA3";

export const sendEmergencyAlert = async ({
  user_name,
  emergencyEmail,
  message,
}) => {
  try {
    // ============================================
    // CHECK RECIPIENT
    // ============================================

    if (!emergencyEmail || !emergencyEmail.trim()) {
      throw new Error("Emergency contact email is missing.");
    }

    console.log("🚨 Preparing emergency email...");
    console.log("📧 Recipient:", emergencyEmail);

    // ============================================
    // GET LOCATION
    // ============================================

    let lat = "";
    let lng = "";
    let maps_link = "Location unavailable";

    try {
      const position = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
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
            timeout: 10000,
            maximumAge: 0,
          }
        );
      });

      lat = position.coords.latitude;
      lng = position.coords.longitude;

      maps_link = `https://www.google.com/maps?q=${lat},${lng}`;

      console.log("📍 Location obtained:");
      console.log("Latitude:", lat);
      console.log("Longitude:", lng);
      console.log("Maps:", maps_link);
    } catch (locationError) {
      // IMPORTANT:
      // GPS failure should NOT stop the emergency email.
      console.warn(
        "⚠️ Could not get location:",
        locationError.message
      );

      maps_link = "Location unavailable";
    }

    // ============================================
    // CURRENT TIME
    // ============================================

    const time = new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "medium",
    });

    // ============================================
    // EMAILJS TEMPLATE PARAMETERS
    // ============================================

    const templateParams = {
      user_name: user_name || "ShaktiShield User",

      time,

      maps_link,

      lat,

      lng,

      message:
        message ||
        "🚨 Emergency! SOS has been activated through ShaktiShield.",

      to_email: emergencyEmail,
    };

    console.log("📨 EmailJS parameters:");
    console.log(templateParams);

    // ============================================
    // SEND EMAIL
    // ============================================

    const emailResponse = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams,
      {
        publicKey: PUBLIC_KEY,
      }
    );

    console.log(
      "✅ Emergency email sent successfully!"
    );

    console.log(
      "EmailJS status:",
      emailResponse.status
    );

    console.log(
      "EmailJS text:",
      emailResponse.text
    );

    // ============================================
    // SUCCESS
    // ============================================

    return {
      success: true,
      latitude: lat,
      longitude: lng,
      maps_link,
      time,
    };
  } catch (error) {
    // ============================================
    // EMAILJS ERROR
    // ============================================

    console.error(
      "❌ Emergency email failed!"
    );

    console.error("Error:", error);

    console.error(
      "Error message:",
      error?.message
    );

    console.error(
      "Error text:",
      error?.text
    );

    return {
      success: false,

      error:
        error?.text ||
        error?.message ||
        "Failed to send emergency alert.",
    };
  }
};