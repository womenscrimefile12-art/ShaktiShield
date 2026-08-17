/*
 * ShaktiShield Public Edition
 * Frontend-only data layer.
 *
 * IMPORTANT:
 * - User/contact data is stored in localStorage.
 * - SOS alerts are stored locally.
 * - SOS notifications are sent through EmailJS.
 *
 * SOS BEHAVIOR:
 * - One SOS click = one SOS operation.
 * - GPS is supplied by SOSButton.
 * - GPS is NOT requested again here.
 * - Every UNIQUE emergency contact email receives ONE email.
 * - Duplicate email addresses receive only ONE email.
 */

import { sendEmergencyAlert } from "./emailService";

/* =========================================================
   STORAGE
========================================================= */

const STORAGE = {
  users: "shaktishield_users",
  user: "shaktishield_user",
  token: "shaktishield_token",
  contacts: "shaktishield_contacts",
  reports: "shaktishield_reports",
  alerts: "shaktishield_alerts",
};

/* =========================================================
   HELPERS
========================================================= */

const uid = (prefix = "id") =>
  `${prefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

const read = (key, fallback = []) => {
  try {
    const value =
      localStorage.getItem(key);

    if (!value) {
      return fallback;
    }

    return JSON.parse(value) ?? fallback;

  } catch (error) {

    console.error(
      `Error reading localStorage key "${key}":`,
      error
    );

    return fallback;
  }
};

const write = (key, value) => {
  localStorage.setItem(
    key,
    JSON.stringify(value)
  );
};

const response = (data) =>
  Promise.resolve({
    data,
  });

const currentUser = () =>
  read(
    STORAGE.user,
    null
  );

/* =========================================================
   DEFAULT SAFETY TIPS
========================================================= */

const DEFAULT_TIPS = [
  {
    _id: "tip-1",
    title: "Trust Your Instincts",
    category: "Awareness",
    author: "ShaktiShield Team",
    content:
      "If a situation feels unsafe or uncomfortable, trust your instincts. Move to a safe and public location and contact someone you trust.",
  },

  {
    _id: "tip-2",
    title: "Share Your Live Location",
    category: "Travel Safety",
    author: "ShaktiShield Team",
    content:
      "When traveling alone, especially at night, share your live location with a trusted family member or friend. This can help others know where you are.",
  },

  {
    _id: "tip-3",
    title: "Stay in Well-Lit Areas",
    category: "Travel Safety",
    author: "ShaktiShield Team",
    content:
      "Prefer well-lit and populated roads. Avoid isolated shortcuts and unfamiliar areas when traveling alone.",
  },

  {
    _id: "tip-4",
    title: "Keep Emergency Numbers Ready",
    category: "Emergency",
    author: "ShaktiShield Team",
    content:
      "Keep important emergency numbers saved on your phone. In India, 112 is the unified emergency number.",
  },

  {
    _id: "tip-5",
    title: "Keep Your Phone Charged",
    category: "Emergency",
    author: "ShaktiShield Team",
    content:
      "Make sure your phone has enough battery before leaving home. Carry a power bank when traveling for long periods.",
  },

  {
    _id: "tip-6",
    title: "Protect Personal Information",
    category: "Digital Safety",
    author: "ShaktiShield Team",
    content:
      "Never share passwords, OTPs, banking details, home addresses, or other sensitive information with unknown people.",
  },
];

/* =========================================================
   SELF DEFENSE
========================================================= */

const SELF_DEFENSE = [
  {
    _id: "sd-1",
    title: "Basic Stance & Awareness",
    category: "Awareness",
    icon: "🧍‍♀️",
    author: "ShaktiShield Team",
    content:
      "Maintain a balanced posture, keep your surroundings in view, identify exits and avoid distractions. The goal is awareness and creating an opportunity to move to safety.",
  },

  {
    _id: "sd-2",
    title: "Palm Heel Strike",
    category: "Basic Technique",
    icon: "✋",
    author: "ShaktiShield Team",
    content:
      "A palm heel movement can help create distance when you cannot safely disengage. Protect your fingers, maintain balance and use any opening to escape toward a safe place.",
  },

  {
    _id: "sd-3",
    title: "Knee Strike",
    category: "Basic Technique",
    icon: "🥋",
    author: "ShaktiShield Team",
    content:
      "At very close range, a knee movement may help create space when escape is not immediately possible. Once there is an opening, disengage and seek help.",
  },

  {
    _id: "sd-4",
    title: "Breaking a Wrist Grab",
    category: "Escape",
    icon: "🤝",
    author: "ShaktiShield Team",
    content:
      "Focus on creating space and moving toward the weaker part of a grip. Once free, move away immediately instead of continuing the confrontation.",
  },

  {
    _id: "sd-5",
    title: "Verbal De-escalation",
    category: "Awareness",
    icon: "🗣️",
    author: "ShaktiShield Team",
    content:
      "Use a clear voice, set boundaries and maintain distance. If the situation becomes threatening, attract attention and move toward a safer location.",
  },

  {
    _id: "sd-6",
    title: "Creating an Escape Opportunity",
    category: "Escape",
    icon: "🏃‍♀️",
    author: "ShaktiShield Team",
    content:
      "Look for exits, populated areas and opportunities to disengage. The safest objective is often to escape, reach a secure place and contact help.",
  },
];

/* =========================================================
   SAFE PLACES
========================================================= */

const SAFE_PLACES = [
  {
    _id: "sp-1",
    name: "Connaught Place Police Station",
    type: "police",
    address: "Connaught Place, New Delhi",
    phone: "01123411234",
    hours: "Open 24 hours",
    location: {
      type: "Point",
      coordinates: [77.2167, 28.6315],
    },
  },

  {
    _id: "sp-2",
    name: "Lady Hardinge Medical College & Hospital",
    type: "hospital",
    address:
      "Shaheed Bhagat Singh Marg, New Delhi",
    phone: "01123445911",
    hours: "Emergency services available",
    location: {
      type: "Point",
      coordinates: [77.2096, 28.6391],
    },
  },

  {
    _id: "sp-3",
    name: "Safdarjung Hospital",
    type: "hospital",
    address: "Ring Road, New Delhi",
    phone: "01126707444",
    hours: "Emergency services available",
    location: {
      type: "Point",
      coordinates: [77.2066, 28.5672],
    },
  },

  {
    _id: "sp-4",
    name: "India Gate Police Assistance Point",
    type: "police",
    address: "India Gate, New Delhi",
    phone: "112",
    hours: "Emergency assistance",
    location: {
      type: "Point",
      coordinates: [77.2295, 28.6129],
    },
  },

  {
    _id: "sp-5",
    name: "Community Support Centre",
    type: "community",
    address: "Central Delhi",
    phone: "112",
    hours: "Call for availability",
    location: {
      type: "Point",
      coordinates: [77.209, 28.625],
    },
  },

  {
    _id: "sp-6",
    name: "Safe Shelter Support Point",
    type: "shelter",
    address: "New Delhi",
    phone: "112",
    hours: "Contact for availability",
    location: {
      type: "Point",
      coordinates: [77.198, 28.62],
    },
  },
];

/* =========================================================
   AUTH API
========================================================= */

export const authAPI = {

  register: async (data) => {

    const users =
      read(STORAGE.users);

    if (
      users.some(
        (u) =>
          u.email &&
          data.email &&
          u.email.toLowerCase() ===
            data.email.toLowerCase()
      )
    ) {

      throw new Error(
        "An account with this email already exists."
      );
    }

    const user = {

      _id:
        uid("user"),

      name:
        data.name,

      email:
        data.email,

      phone:
        data.phone || "",

      role:
        "user",
    };

    users.push({

      ...user,

      password:
        data.password,
    });

    write(
      STORAGE.users,
      users
    );

    write(
      STORAGE.user,
      user
    );

    localStorage.setItem(
      STORAGE.token,
      `local-${user._id}`
    );

    return response(user);
  },

  login: async ({
    email,
    password,
  }) => {

    const users =
      read(STORAGE.users);

    let user =
      users.find(
        (u) =>
          u.email &&
          email &&
          u.email.toLowerCase() ===
            email.toLowerCase() &&
          u.password ===
            password
      );

    if (
      !user &&
      email &&
      password
    ) {

      user = {

        _id:
          uid("user"),

        name:
          email.split("@")[0] ||
          "ShaktiShield User",

        email,

        phone:
          "",

        role:
          "user",

        password,
      };

      users.push(user);

      write(
        STORAGE.users,
        users
      );
    }

    if (!user) {

      throw new Error(
        "Invalid email or password."
      );
    }

    const safeUser =
      {
        ...user,
      };

    delete safeUser.password;

    write(
      STORAGE.user,
      safeUser
    );

    localStorage.setItem(
      STORAGE.token,
      `local-${user._id}`
    );

    return response(
      safeUser
    );
  },

  getMe: async () =>
    response(
      currentUser()
    ),
};

/* =========================================================
   USER API
========================================================= */

export const userAPI = {

  getProfile: async () =>
    response(
      currentUser() || {
        name:
          "Guest User",

        email:
          "",

        phone:
          "",
      }
    ),

  updateProfile:
    async (data) => {

      const user = {

        ...(currentUser() || {}),

        ...data,
      };

      write(
        STORAGE.user,
        user
      );

      const users =
        read(
          STORAGE.users
        ).map(
          (u) =>
            u._id === user._id
              ? {
                  ...u,
                  ...data,
                }
              : u
        );

      write(
        STORAGE.users,
        users
      );

      return response(
        user
      );
    },

  updateLocation:
    async (data) =>
      response({
        ...currentUser(),
        location: data,
      }),
};

/* =========================================================
   EMERGENCY CONTACT API
========================================================= */

export const contactAPI = {

  getAll: async () => {

    const contacts =
      read(
        STORAGE.contacts
      );

    console.log(
      "📱 Emergency contacts:",
      contacts
    );

    return response(
      contacts
    );
  },

  add: async (data) => {

    const contacts =
      read(
        STORAGE.contacts
      );

    const contact = {

      _id:
        uid("contact"),

      ...data,

      createdAt:
        new Date().toISOString(),
    };

    contacts.push(
      contact
    );

    write(
      STORAGE.contacts,
      contacts
    );

    console.log(
      "✅ Emergency contact added:",
      contact
    );

    return response(
      contact
    );
  },

  update: async (
    id,
    data
  ) => {

    const contacts =
      read(
        STORAGE.contacts
      ).map(
        (c) =>
          c._id === id
            ? {
                ...c,
                ...data,
              }
            : c
      );

    write(
      STORAGE.contacts,
      contacts
    );

    return response(
      contacts.find(
        (c) =>
          c._id === id
      )
    );
  },

  delete: async (id) => {

    const contacts =
      read(
        STORAGE.contacts
      ).filter(
        (c) =>
          c._id !== id
      );

    write(
      STORAGE.contacts,
      contacts
    );

    return response({
      success:
        true,
    });
  },
};

/* =========================================================
   SOS API
========================================================= */

export const sosAPI = {

  /* =======================================================
     SAVE SOS

     IMPORTANT:
     - Does NOT request GPS.
     - Does NOT send email.
     - Only creates and stores the SOS.
     
     SOSButton.jsx handles:
     - GPS
     - unique contacts
     - email sending
  ======================================================= */

  trigger: async (
    data = {}
  ) => {

    try {

      console.log(
        "================================="
      );

      console.log(
        "🚨 SAVING SHAKTISHIELD SOS"
      );

      console.log(
        "================================="
      );

      const user =
        currentUser();

      /* ---------------------------------------------------
         EXISTING ALERTS
      --------------------------------------------------- */

      const alerts =
        read(
          STORAGE.alerts
        );

      /* ---------------------------------------------------
         CREATE ALERT
      --------------------------------------------------- */

      const alert = {

        _id:
          uid("sos"),

        status:
          "active",

        createdAt:
          new Date().toISOString(),

        message:
          data.message ||
          "🚨 Emergency SOS triggered from ShaktiShield.",

        userId:
          user?._id ||
          null,

        userName:
          user?.name ||
          data.user_name ||
          "ShaktiShield User",

        lat:
          data.lat ??
          "",

        lng:
          data.lng ??
          "",

        maps_link:
          data.maps_link ||
          (
            data.lat !== "" &&
            data.lng !== "" &&
            data.lat !== undefined &&
            data.lng !== undefined
              ? `https://www.google.com/maps?q=${data.lat},${data.lng}`
              : "Location unavailable"
          ),
      };

      /* ---------------------------------------------------
         SAVE SOS
      --------------------------------------------------- */

      alerts.unshift(
        alert
      );

      write(
        STORAGE.alerts,
        alerts
      );

      console.log(
        "💾 SOS saved locally:",
        alert
      );

      /* ---------------------------------------------------
         RETURN
      --------------------------------------------------- */

      return response({

        ...alert,

        emailSent:
          false,

        emailsSent:
          0,

        emailsFailed:
          0,

        emailMessage:
          "SOS saved. Notifications are handled separately.",
      });

    } catch (error) {

      console.error(
        "❌ Could not save SOS:",
        error
      );

      throw error;
    }
  },

  /* =======================================================
     SEND EMAIL TO ONE CONTACT

     IMPORTANT:

     This function sends ONE email.

     SOSButton.jsx calls this function once for every
     UNIQUE emergency contact email.

     Example:

     5 contacts
       ↓
     5 unique emails
       ↓
     this function called 5 times
       ↓
     5 emails total
  ======================================================= */

  sendEmailToContact:
    async ({
      contact,
      user,
      lat,
      lng,
      mapsLink,
    }) => {

      /* ---------------------------------------------------
         VALIDATE CONTACT
      --------------------------------------------------- */

      if (
        !contact ||
        !contact.email
      ) {

        return {

          success:
            false,

          error:
            "Emergency contact email is missing.",
        };
      }

      try {

        /* -------------------------------------------------
           NORMALIZE EMAIL
        ------------------------------------------------- */

        const email =
          contact.email
            .trim()
            .toLowerCase();

        console.log(
          "📨 Sending ONE email to:",
          email
        );

        /* -------------------------------------------------
           SEND EMAIL

           GPS is NOT requested here.
        ------------------------------------------------- */

        const result =
          await sendEmergencyAlert({

            user_name:
              user?.name ||
              "ShaktiShield User",

            emergencyEmail:
              email,

            message:
              "🚨 Emergency! An SOS alert has been triggered from ShaktiShield. Please contact the person immediately.",

            lat:
              lat ?? "",

            lng:
              lng ?? "",

            maps_link:
              mapsLink ||
              "Location unavailable",
          });

        /* -------------------------------------------------
           RETURN EMAIL RESULT
        ------------------------------------------------- */

        return result;

      } catch (error) {

        console.error(
          `❌ Failed to send email to ${contact.email}:`,
          error
        );

        return {

          success:
            false,

          email:
            contact.email,

          error:
            error?.message ||
            "Failed to send emergency email.",
        };
      }
    },

  /* =======================================================
     GET MY SOS ALERTS
  ======================================================= */

  getMyAlerts:
    async () => {

      return response(
        read(
          STORAGE.alerts
        )
      );
    },

  /* =======================================================
     CANCEL SOS
  ======================================================= */

  cancel:
    async (id) => {

      const alerts =
        read(
          STORAGE.alerts
        ).map(
          (alert) =>
            alert._id === id
              ? {

                  ...alert,

                  status:
                    "cancelled",

                  cancelledAt:
                    new Date().toISOString(),
                }

              : alert
        );

      write(
        STORAGE.alerts,
        alerts
      );

      return response(
        alerts.find(
          (alert) =>
            alert._id === id
        )
      );
    },

  /* =======================================================
     GET ACTIVE SOS
  ======================================================= */

  getActive:
    async () => {

      return response(
        read(
          STORAGE.alerts
        ).filter(
          (alert) =>
            alert.status ===
            "active"
        )
      );
    },
};

/* =========================================================
   INCIDENT API
========================================================= */

export const incidentAPI = {

  report: async (data) => {

    const reports =
      read(
        STORAGE.reports
      );

    const item = {

      _id:
        uid("incident"),

      ...data,

      status:
        "submitted",

      createdAt:
        new Date().toISOString(),
    };

    reports.unshift(
      item
    );

    write(
      STORAGE.reports,
      reports
    );

    return response(
      item
    );
  },

  getMy:
    async () =>
      response(
        read(
          STORAGE.reports
        )
      ),

  getSafePlaces:
    async () =>
      response(
        SAFE_PLACES
      ),

  getArticles:
    async ({
      category,
    } = {}) =>
      response(
        category ===
          "self-defense"
          ? SELF_DEFENSE
          : DEFAULT_TIPS
      ),

  getArticle:
    async (id) =>
      response(
        [
          ...DEFAULT_TIPS,
          ...SELF_DEFENSE,
        ].find(
          (a) =>
            a._id === id
        ) || null
      ),
};

/* =========================================================
   ADMIN API
========================================================= */

export const adminAPI = {

  getStats:
    async () =>
      response({

        users:
          read(
            STORAGE.users
          ).length,

        reports:
          read(
            STORAGE.reports
          ).length,

        sosAlerts:
          read(
            STORAGE.alerts
          ).length,

        safePlaces:
          SAFE_PLACES.length,
      }),

  getUsers:
    async () =>
      response(
        read(
          STORAGE.users
        ).map(
          ({
            password,
            ...u
          }) => u
        )
      ),

  toggleUser:
    async () =>
      response({
        success:
          true,
      }),

  getSOSAlerts:
    async () =>
      response(
        read(
          STORAGE.alerts
        )
      ),

  resolveSOS:
    async (id) => {

      const alerts =
        read(
          STORAGE.alerts
        ).map(
          (a) =>
            a._id === id
              ? {
                  ...a,
                  status:
                    "resolved",
                }
              : a
        );

      write(
        STORAGE.alerts,
        alerts
      );

      return response(
        alerts.find(
          (a) =>
            a._id === id
        )
      );
    },

  getIncidents:
    async () =>
      response(
        read(
          STORAGE.reports
        )
      ),

  updateIncident:
    async (
      id,
      data
    ) => {

      const reports =
        read(
          STORAGE.reports
        ).map(
          (r) =>
            r._id === id
              ? {
                  ...r,
                  ...data,
                }
              : r
        );

      write(
        STORAGE.reports,
        reports
      );

      return response(
        reports.find(
          (r) =>
            r._id === id
        )
      );
    },

  createSafePlace:
    async (data) =>
      response({

        _id:
          uid("place"),

        ...data,
      }),

  createArticle:
    async (data) =>
      response({

        _id:
          uid("article"),

        ...data,
      }),

  getAnalytics:
    async () =>
      response({

        reports:
          read(
            STORAGE.reports
          ).length,

        alerts:
          read(
            STORAGE.alerts
          ).length,
      }),
};

/* =========================================================
   DEFAULT EXPORT
========================================================= */

export default {
  authAPI,
  userAPI,
  contactAPI,
  sosAPI,
  incidentAPI,
  adminAPI,
};