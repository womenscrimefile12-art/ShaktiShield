import { useCallback, useEffect, useMemo, useState } from "react";
import Map from "../components/Map";

/* =========================================================
   OPENSTREETMAP OVERPASS API
========================================================= */

const OVERPASS_URL =
  "https://overpass-api.de/api/interpreter";

/* =========================================================
   SEARCH SETTINGS
========================================================= */

const SEARCH_RADIUS = 10000; // 10 km

/* =========================================================
   TYPE CONFIGURATION
========================================================= */

const typeConfig = {
  police: {
    icon: "🚔",
    label: "Police",
  },

  hospital: {
    icon: "🏥",
    label: "Hospital",
  },

  shelter: {
    icon: "🏠",
    label: "Shelter",
  },

  community: {
    icon: "🏛️",
    label: "Community",
  },

  pharmacy: {
    icon: "💊",
    label: "Pharmacy",
  },

  other: {
    icon: "📍",
    label: "Other",
  },
};

/* =========================================================
   DISTANCE CALCULATION
   Haversine formula
========================================================= */

const getDistanceInKm = (
  lat1,
  lng1,
  lat2,
  lng2
) => {
  const earthRadius = 6371;

  const dLat =
    ((lat2 - lat1) * Math.PI) / 180;

  const dLng =
    ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) *
      Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
};

/* =========================================================
   DESCRIPTION
========================================================= */

const getDescription = (type) => {
  switch (type) {
    case "police":
      return "Nearby police station mapped in OpenStreetMap.";

    case "hospital":
      return "Nearby hospital or medical facility mapped in OpenStreetMap.";

    case "shelter":
      return "Nearby shelter or support facility mapped in OpenStreetMap.";

    case "community":
      return "Nearby community support facility mapped in OpenStreetMap.";

    case "pharmacy":
      return "Nearby pharmacy mapped in OpenStreetMap.";

    default:
      return "Nearby safety-related location mapped in OpenStreetMap.";
  }
};

/* =========================================================
   CONVERT OPENSTREETMAP RESULT
   INTO SHAKTISHIELD FORMAT
========================================================= */

const convertOSMPlace = (element) => {
  const tags = element.tags || {};

  let lat = element.lat;
  let lng = element.lon;

  /*
   * OSM nodes have lat/lon directly.
   * OSM ways usually have center coordinates.
   */

  if (
    (!lat || !lng) &&
    element.center
  ) {
    lat = element.center.lat;
    lng = element.center.lon;
  }

  if (
    typeof lat !== "number" ||
    typeof lng !== "number"
  ) {
    return null;
  }

  /* =======================================================
     DETERMINE PLACE TYPE
  ======================================================= */

  let type = "other";

  if (
    tags.amenity === "police"
  ) {
    type = "police";
  }

  else if (
    tags.amenity === "hospital" ||
    tags.amenity === "clinic"
  ) {
    type = "hospital";
  }

  else if (
    tags.amenity === "pharmacy"
  ) {
    type = "pharmacy";
  }

  else if (
    tags.amenity === "shelter" ||
    tags.social_facility === "shelter"
  ) {
    type = "shelter";
  }

  else if (
    tags.amenity === "community_centre" ||
    tags.amenity === "social_centre" ||
    tags.amenity === "social_facility"
  ) {
    type = "community";
  }

  /* =======================================================
     ADDRESS
  ======================================================= */

  const addressParts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:suburb"],
    tags["addr:city"],
    tags["addr:state"],
  ].filter(Boolean);

  const address =
    addressParts.length > 0
      ? addressParts.join(", ")
      : "Address available on map";

  /* =======================================================
     RETURN STANDARDIZED OBJECT
  ======================================================= */

  return {
    _id: `osm-${element.type}-${element.id}`,

    name:
      tags.name ||
      `${typeConfig[type].label} nearby`,

    type,

    address,

    phone:
      tags.phone ||
      tags["contact:phone"] ||
      tags["contact:mobile"] ||
      "",

    website:
      tags.website ||
      tags["contact:website"] ||
      "",

    hours:
      tags.opening_hours ||
      "",

    description:
      getDescription(type),

    verified: false,

    source: "OpenStreetMap",

    location: {
      coordinates: [
        Number(lng),
        Number(lat),
      ],
    },
  };
};

/* =========================================================
   FETCH NEARBY PLACES
========================================================= */

const fetchNearbyPlaces = async (
  lat,
  lng
) => {
  /*
   * Search within 10 km of the user.
   */

  const radius = SEARCH_RADIUS;

  const query = `
    [out:json][timeout:30];

    (
      /* POLICE */

      node["amenity"="police"]
        (around:${radius},${lat},${lng});

      way["amenity"="police"]
        (around:${radius},${lat},${lng});

      /* HOSPITAL */

      node["amenity"="hospital"]
        (around:${radius},${lat},${lng});

      way["amenity"="hospital"]
        (around:${radius},${lat},${lng});

      /* CLINIC */

      node["amenity"="clinic"]
        (around:${radius},${lat},${lng});

      way["amenity"="clinic"]
        (around:${radius},${lat},${lng});

      /* PHARMACY */

      node["amenity"="pharmacy"]
        (around:${radius},${lat},${lng});

      way["amenity"="pharmacy"]
        (around:${radius},${lat},${lng});

      /* SHELTER */

      node["amenity"="shelter"]
        (around:${radius},${lat},${lng});

      way["amenity"="shelter"]
        (around:${radius},${lat},${lng});

      node["social_facility"="shelter"]
        (around:${radius},${lat},${lng});

      way["social_facility"="shelter"]
        (around:${radius},${lat},${lng});

      /* COMMUNITY */

      node["amenity"="community_centre"]
        (around:${radius},${lat},${lng});

      way["amenity"="community_centre"]
        (around:${radius},${lat},${lng});

      node["amenity"="social_centre"]
        (around:${radius},${lat},${lng});

      way["amenity"="social_centre"]
        (around:${radius},${lat},${lng});

      node["amenity"="social_facility"]
        (around:${radius},${lat},${lng});

      way["amenity"="social_facility"]
        (around:${radius},${lat},${lng});
    );

    out center tags;
  `;

  const response =
    await fetch(
      OVERPASS_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body:
          "data=" +
          encodeURIComponent(query),
      }
    );

  if (!response.ok) {
    throw new Error(
      "Unable to access nearby safety locations."
    );
  }

  const data =
    await response.json();

  const places =
    (data.elements || [])
      .map(convertOSMPlace)
      .filter(Boolean);

  /*
   * Remove duplicate OSM locations.
   */

  const uniquePlaces = Array.from(
    new Map(
      places.map((place) => [
        place._id,
        place,
      ])
    ).values()
  );

  return uniquePlaces;
};

/* =========================================================
   SAFE PLACES COMPONENT
========================================================= */

const SafePlaces = () => {
  /* =======================================================
     STATE
  ======================================================= */

  const [places, setPlaces] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [locationLoading, setLocationLoading] =
    useState(true);

  const [locationError, setLocationError] =
    useState("");

  const [error, setError] =
    useState("");

  const [center, setCenter] =
    useState([
      28.6139,
      77.209,
    ]);

  const [userLocation, setUserLocation] =
    useState(null);

  const [search, setSearch] =
    useState("");

  const [selectedType, setSelectedType] =
    useState("all");

  /* =======================================================
     LOAD PLACES
  ======================================================= */

  const loadPlaces =
    useCallback(
      async (
        lat,
        lng,
        showRefresh = false
      ) => {
        try {
          setError("");

          if (showRefresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          const nearbyPlaces =
            await fetchNearbyPlaces(
              lat,
              lng
            );

          setPlaces(
            nearbyPlaces
          );

          if (
            nearbyPlaces.length === 0
          ) {
            setError(
              "No safety-related locations were found within 10 km of your current location."
            );
          }

        } catch (err) {
          console.error(
            "Nearby safety places error:",
            err
          );

          setPlaces([]);

          setError(
            "Unable to load nearby safety locations. Please check your internet connection and try again."
          );

        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      []
    );

  /* =======================================================
     DETECT USER LOCATION
  ======================================================= */

  const detectLocation =
    useCallback(() => {
      setLocationLoading(true);
      setLocationError("");
      setError("");

      if (
        !navigator.geolocation
      ) {
        setLocationLoading(false);
        setLoading(false);

        setLocationError(
          "Location services are not supported by this browser."
        );

        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat =
              position.coords.latitude;

            const lng =
              position.coords.longitude;

            console.log(
              "ShaktiShield user location:",
              lat,
              lng
            );

            /*
             * Save user location.
             */

            setUserLocation({
              lat,
              lng,
            });

            /*
             * Center map on user.
             */

            setCenter([
              lat,
              lng,
            ]);

            /*
             * Find nearby safety places.
             */

            await loadPlaces(
              lat,
              lng
            );

          } catch (err) {
            console.error(
              "Location processing error:",
              err
            );

            setError(
              "Unable to find nearby safety places."
            );

          } finally {
            setLocationLoading(false);
          }
        },

        (geoError) => {
          console.error(
            "Geolocation error:",
            geoError
          );

          setLocationLoading(false);
          setLoading(false);

          if (
            geoError.code ===
            geoError.PERMISSION_DENIED
          ) {
            setLocationError(
              "Location permission was denied. Please allow location access to find safe places near you."
            );
          }

          else if (
            geoError.code ===
            geoError.POSITION_UNAVAILABLE
          ) {
            setLocationError(
              "Your current location could not be determined. Please check your device location settings."
            );
          }

          else if (
            geoError.code ===
            geoError.TIMEOUT
          ) {
            setLocationError(
              "Location request timed out. Please try again."
            );
          }

          else {
            setLocationError(
              "Unable to determine your location."
            );
          }
        },

        {
          enableHighAccuracy: true,

          timeout: 15000,

          maximumAge: 60000,
        }
      );
    }, [loadPlaces]);

  /* =======================================================
     INITIAL LOCATION
  ======================================================= */

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  /* =======================================================
     PROCESS PLACES
  ======================================================= */

  const processedPlaces =
    useMemo(() => {
      return places

        .map((place) => {
          const [
            lng,
            lat,
          ] =
            place.location
              ?.coordinates || [];

          let distance = null;

          if (
            userLocation &&
            typeof lat === "number" &&
            typeof lng === "number"
          ) {
            distance =
              getDistanceInKm(
                userLocation.lat,
                userLocation.lng,
                lat,
                lng
              );
          }

          return {
            ...place,
            distance,
          };
        })

        /* SEARCH */

        .filter((place) => {
          const name =
            place.name
              ?.toLowerCase() || "";

          const address =
            place.address
              ?.toLowerCase() || "";

          const type =
            place.type
              ?.toLowerCase() || "";

          const searchValue =
            search
              .toLowerCase()
              .trim();

          const matchesSearch =
            !searchValue ||
            name.includes(
              searchValue
            ) ||
            address.includes(
              searchValue
            ) ||
            type.includes(
              searchValue
            );

          const matchesType =
            selectedType === "all" ||
            type === selectedType;

          return (
            matchesSearch &&
            matchesType
          );
        })

        /* SORT NEAREST FIRST */

        .sort((a, b) => {
          if (
            a.distance === null
          ) {
            return 1;
          }

          if (
            b.distance === null
          ) {
            return -1;
          }

          return (
            a.distance -
            b.distance
          );
        });
    }, [
      places,
      search,
      selectedType,
      userLocation,
    ]);

  /* =======================================================
     MAP MARKERS
  ======================================================= */

  const markers =
    processedPlaces
      .map((place) => {
        const [
          lng,
          lat,
        ] =
          place.location
            ?.coordinates || [];

        if (
          typeof lat !== "number" ||
          typeof lng !== "number"
        ) {
          return null;
        }

        const config =
          typeConfig[
            place.type
          ] ||
          typeConfig.other;

        const distanceText =
          place.distance !== null
            ? place.distance < 1
              ? `${Math.round(
                  place.distance *
                    1000
                )} m away`
              : `${place.distance.toFixed(
                  1
                )} km away`
            : "";

        return {
          id: place._id,

          position: [
            lat,
            lng,
          ],

          popup: `
            <div style="
              min-width:230px;
              font-family:Arial,sans-serif;
              line-height:1.5;
            ">

              <strong style="
                font-size:15px;
              ">
                ${config.icon}
                ${place.name || "Safety Place"}
              </strong>

              <br/>

              <span style="
                color:#64748b;
                font-size:13px;
              ">
                ${place.address || "Address unavailable"}
              </span>

              ${
                place.phone
                  ? `
                    <br/>
                    📞 ${place.phone}
                  `
                  : ""
              }

              ${
                place.hours
                  ? `
                    <br/>
                    🕐 ${place.hours}
                  `
                  : ""
              }

              ${
                distanceText
                  ? `
                    <br/>
                    📍 ${distanceText}
                  `
                  : ""
              }

              <br/>

              <small style="
                color:#64748b;
              ">
                Data source: OpenStreetMap
              </small>

            </div>
          `,
        };
      })
      .filter(Boolean);

  /* =======================================================
     REFRESH
  ======================================================= */

  const handleRefresh =
    () => {
      if (
        userLocation
      ) {
        loadPlaces(
          userLocation.lat,
          userLocation.lng,
          true
        );
      } else {
        detectLocation();
      }
    };

  /* =======================================================
     DIRECTIONS
  ======================================================= */

  const handleDirections =
    (place) => {
      const [
        lng,
        lat,
      ] =
        place.location
          ?.coordinates || [];

      if (
        typeof lat !== "number" ||
        typeof lng !== "number"
      ) {
        return;
      }

      const url =
        `https://www.google.com/maps/dir/?api=1` +
        `&destination=${lat},${lng}`;

      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );
    };

  /* =======================================================
     CALL
  ======================================================= */

  const handleCall =
    (phone) => {
      if (!phone) {
        return;
      }

      window.location.href =
        `tel:${phone}`;
    };

  /* =======================================================
     EMERGENCY
  ======================================================= */

  const handleEmergency =
    () => {
      window.location.href =
        "tel:112";
    };

  /* =======================================================
     LOADING SCREEN
  ======================================================= */

  if (loading) {
    return (
      <div className="safeplaces-page">

        <div className="safeplaces-loading">

          <div className="loading-icon">
            📍
          </div>

          <h2>
            Finding Safe Places Near You...
          </h2>

          <p>
            ShaktiShield is detecting your
            location and finding nearby
            police stations, hospitals,
            pharmacies and support facilities.
          </p>

        </div>

      </div>
    );
  }

  /* =======================================================
     MAIN UI
  ======================================================= */

  return (
    <div className="safeplaces-page">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="safeplaces-header">

        <div>

          <div className="page-eyebrow">
            🛡️ SHAKTISHIELD SAFETY NETWORK
          </div>

          <h1 className="page-title">
            Safe Places Near You
          </h1>

          <p className="page-subtitle">
            Find nearby police stations,
            hospitals, pharmacies, shelters
            and community support locations
            based on your current GPS location.
          </p>

        </div>

        <button
          className="emergency-button"
          onClick={
            handleEmergency
          }
        >
          🚨 Emergency 112
        </button>

      </div>

      {/* ===================================================
          LOCATION STATUS
      =================================================== */}

      <div className="location-status card">

        <div className="location-content">

          <div className="location-icon">
            📍
          </div>

          <div>

            <strong>

              {locationLoading
                ? "Detecting your location..."

                : userLocation
                ? "Your current location is active"

                : "Location unavailable"}

            </strong>

            <p>

              {locationError ||
                (userLocation
                  ? "Safety places are sorted from nearest to farthest."
                  : "Allow location access to find nearby safety places.")}

            </p>

          </div>

        </div>

        <button
          className="secondary-button"
          onClick={
            detectLocation
          }
          disabled={
            locationLoading
          }
        >
          {locationLoading
            ? "Locating..."
            : "📍 Use My Location"}
        </button>

      </div>

      {/* ===================================================
          SEARCH + FILTER
      =================================================== */}

      <div className="controls card">

        <div className="search-box">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Search police, hospital, pharmacy..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          {search && (
            <button
              className="clear-button"
              onClick={() =>
                setSearch("")
              }
              aria-label="Clear search"
            >
              ✕
            </button>
          )}

        </div>

        <div className="filter-row">

          <button
            className={
              selectedType === "all"
                ? "filter-button active"
                : "filter-button"
            }
            onClick={() =>
              setSelectedType("all")
            }
          >
            All
          </button>

          {Object.entries(
            typeConfig
          ).map(
            ([type, config]) => (
              <button
                key={type}
                className={
                  selectedType ===
                  type
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setSelectedType(
                    type
                  )
                }
              >
                {config.icon}{" "}
                {config.label}
              </button>
            )
          )}

        </div>

      </div>

      {/* ===================================================
          ERROR / NOTICE
      =================================================== */}

      {(error ||
        locationError) && (
        <div className="error-card card">

          <div>

            <strong>
              ⚠️ Safety Network Notice
            </strong>

            <p>
              {error ||
                locationError}
            </p>

          </div>

          <button
            className="secondary-button"
            onClick={
              handleRefresh
            }
          >
            Try Again
          </button>

        </div>
      )}

      {/* ===================================================
          LOCATION SUMMARY
      =================================================== */}

      <div className="verified-banner">

        <div className="verified-banner-icon">
          📍
        </div>

        <div>

          <h2>
            Nearby Safety Places
          </h2>

          <p>
            Real map locations found
            around your current GPS
            position.
          </p>

        </div>

        <div className="verified-total">

          <strong>
            {processedPlaces.length}
          </strong>

          <span>
            Nearby
          </span>

        </div>

      </div>

      {/* ===================================================
          MAP
      =================================================== */}

      <div className="map-section">

        <div className="section-header">

          <div>

            <h2>
              Safety Map
            </h2>

            <p>
              {processedPlaces.length} location
              {processedPlaces.length !== 1
                ? "s"
                : ""}{" "}
              found near you
            </p>

          </div>

          <button
            className="secondary-button"
            onClick={
              handleRefresh
            }
            disabled={
              refreshing
            }
          >
            {refreshing
              ? "↻ Updating..."
              : "↻ Refresh"}
          </button>

        </div>

        <Map
          center={center}
          markers={markers}
          userLocation={
            userLocation
          }
          height="420px"
        />

      </div>

      {/* ===================================================
          PLACES
      =================================================== */}

      <div className="places-section">

        <div className="section-header">

          <div>

            <h2>
              Nearby Places
            </h2>

            <p>
              Closest safety locations
              are shown first.
            </p>

          </div>

        </div>

        {processedPlaces.length ===
        0 ? (

          <div className="empty-state card">

            <div className="empty-icon">
              📍
            </div>

            <h3>
              No Nearby Places Found
            </h3>

            <p>
              No mapped safety locations
              were found within 10 km of
              your current location.
            </p>

            <button
              className="primary-button"
              onClick={
                detectLocation
              }
            >
              📍 Detect Location Again
            </button>

          </div>

        ) : (

          <div className="places-grid">

            {processedPlaces.map(
              (place) => {

                const config =
                  typeConfig[
                    place.type
                  ] ||
                  typeConfig.other;

                return (
                  <div
                    key={
                      place._id
                    }
                    className="safe-place-card card"
                  >

                    {/* PLACE HEADER */}

                    <div className="place-header">

                      <div className="place-icon">
                        {config.icon}
                      </div>

                      <div className="place-title">

                        <h3>
                          {place.name}
                        </h3>

                        <span>
                          {config.label}
                        </span>

                      </div>

                    </div>

                    {/* DESCRIPTION */}

                    {place.description && (
                      <p className="place-description">
                        {place.description}
                      </p>
                    )}

                    {/* SOURCE */}

                    <div className="rating-row">

                      <span>
                        📍 Nearby
                      </span>

                      <span>
                        OpenStreetMap location
                      </span>

                    </div>

                    {/* INFORMATION */}

                    <div className="place-info">

                      <p>
                        📍{" "}
                        {place.address ||
                          "Address unavailable"}
                      </p>

                      {place.phone && (
                        <p>
                          📞{" "}
                          {place.phone}
                        </p>
                      )}

                      {place.hours && (
                        <p>
                          🕐{" "}
                          {place.hours}
                        </p>
                      )}

                      {place.distance !==
                        null && (
                        <p className="distance">

                          📏{" "}

                          {place.distance < 1
                            ? `${Math.round(
                                place.distance *
                                  1000
                              )} m away`
                            : `${place.distance.toFixed(
                                1
                              )} km away`}

                        </p>
                      )}

                    </div>

                    {/* ACTIONS */}

                    <div className="place-actions">

                      <button
                        className="primary-button"
                        onClick={() =>
                          handleDirections(
                            place
                          )
                        }
                      >
                        🧭 Directions
                      </button>

                      {place.phone && (
                        <button
                          className="call-button"
                          onClick={() =>
                            handleCall(
                              place.phone
                            )
                          }
                        >
                          📞 Call
                        </button>
                      )}

                    </div>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>

      {/* ===================================================
          SAFETY NOTICE
      =================================================== */}

      <div className="safety-notice card">

        <div className="notice-icon">
          🛡️
        </div>

        <div>

          <h3>
            Important Safety Notice
          </h3>

          <p>
            Locations are retrieved from
            OpenStreetMap and may not be
            personally verified by
            ShaktiShield. Always confirm
            the location before relying on
            it in an emergency. For immediate
            emergencies in India, call 112.
          </p>

        </div>

      </div>

      {/* ===================================================
          PAGE CSS
      =================================================== */}

      <style>{`

        /* ================================================
           MAIN PAGE
        ================================================ */

        .safeplaces-page {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
          box-sizing: border-box;
        }

        /* ================================================
           HEADER
        ================================================ */

        .safeplaces-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 25px;
        }

        .page-eyebrow {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: var(--primary);
          margin-bottom: 8px;
        }

        .page-title {
          margin: 0 0 8px;
          font-size: 32px;
          font-weight: 850;
          line-height: 1.15;
        }

        .page-subtitle {
          color: var(--text-muted);
          max-width: 720px;
          line-height: 1.6;
          margin: 0;
        }

        /* ================================================
           EMERGENCY
        ================================================ */

        .emergency-button {
          border: none;
          border-radius: 12px;
          padding: 13px 18px;
          background: #dc2626;
          color: white;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          box-shadow:
            0 8px 20px
            rgba(220, 38, 38, 0.25);
          transition: 0.2s;
        }

        .emergency-button:hover {
          transform: translateY(-2px);
          background: #b91c1c;
        }

        .emergency-button:active {
          transform: scale(0.98);
        }

        /* ================================================
           LOCATION STATUS
        ================================================ */

        .location-status {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 16px;
          margin-bottom: 20px;
        }

        .location-content {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .location-icon {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: rgba(59, 130, 246, 0.1);
          font-size: 20px;
          flex-shrink: 0;
        }

        .location-status strong {
          font-size: 14px;
        }

        .location-status p {
          margin: 4px 0 0;
          color: var(--text-muted);
          font-size: 13px;
          line-height: 1.5;
        }

        /* ================================================
           SEARCH + FILTER
        ================================================ */

        .controls {
          padding: 16px;
          margin-bottom: 20px;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid
            rgba(128, 128, 128, 0.25);
          border-radius: 12px;
          padding: 10px 13px;
          margin-bottom: 15px;
          background: white;
        }

        .search-box input {
          flex: 1;
          min-width: 0;
          border: none;
          outline: none;
          background: transparent;
          color: inherit;
          font-size: 15px;
        }

        .clear-button {
          border: none;
          background: transparent;
          cursor: pointer;
          font-size: 16px;
          padding: 3px 6px;
        }

        .filter-row {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .filter-button {
          border: none;
          border-radius: 10px;
          padding: 9px 13px;
          background: rgba(128, 128, 128, 0.1);
          color: inherit;
          cursor: pointer;
          font-weight: 600;
          transition: 0.2s;
        }

        .filter-button:hover {
          transform: translateY(-1px);
        }

        .filter-button.active {
          background:
            var(--primary, #7c3aed);
          color: white;
        }

        /* ================================================
           BUTTONS
        ================================================ */

        .secondary-button,
        .primary-button,
        .call-button {
          border: none;
          border-radius: 10px;
          padding: 10px 14px;
          cursor: pointer;
          font-weight: 700;
          transition: 0.2s;
        }

        .secondary-button {
          background:
            rgba(128, 128, 128, 0.12);
          color: inherit;
        }

        .primary-button {
          background:
            var(--primary, #7c3aed);
          color: white;
        }

        .call-button {
          background: #16a34a;
          color: white;
        }

        .secondary-button:hover,
        .primary-button:hover,
        .call-button:hover {
          transform: translateY(-2px);
          opacity: 0.92;
        }

        .secondary-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* ================================================
           ERROR
        ================================================ */

        .error-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          padding: 15px;
          margin-bottom: 20px;
          border-left: 4px solid #dc2626;
          background: #fff7f7;
        }

        .error-card strong {
          color: #991b1b;
        }

        .error-card p {
          margin: 5px 0 0;
          color: var(--text-muted);
          line-height: 1.5;
        }

        /* ================================================
           RESULTS BANNER
        ================================================ */

        .verified-banner {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 18px;
          margin: 25px 0;
          border-radius: 18px;
          background:
            linear-gradient(
              135deg,
              #eff6ff,
              #ffffff
            );
          border: 1px solid #bfdbfe;
          box-shadow:
            0 8px 25px
            rgba(37, 99, 235, 0.07);
        }

        .verified-banner-icon {
          width: 55px;
          height: 55px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: #dbeafe;
          font-size: 27px;
          flex-shrink: 0;
        }

        .verified-banner h2 {
          margin: 0 0 3px;
          font-size: 20px;
          color: #1d4ed8;
        }

        .verified-banner p {
          margin: 0;
          color: var(--text-muted);
          font-size: 13px;
        }

        .verified-total {
          margin-left: auto;
          text-align: center;
          padding: 8px 16px;
          border-radius: 12px;
          background: white;
          border: 1px solid #dbeafe;
          flex-shrink: 0;
        }

        .verified-total strong {
          display: block;
          color: #2563eb;
          font-size: 20px;
        }

        .verified-total span {
          display: block;
          color: var(--text-muted);
          font-size: 11px;
        }

        /* ================================================
           MAP / PLACES SECTIONS
        ================================================ */

        .map-section,
        .places-section {
          margin-top: 25px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .section-header h2 {
          margin: 0;
          font-size: 22px;
        }

        .section-header p {
          margin: 4px 0 0;
          color: var(--text-muted);
          font-size: 14px;
        }

        /* ================================================
           PLACES GRID
        ================================================ */

        .places-grid {
          display: grid;
          grid-template-columns:
            repeat(
              auto-fit,
              minmax(300px, 1fr)
            );
          gap: 16px;
        }

        .safe-place-card {
          padding: 18px;
          transition: 0.2s;
        }

        .safe-place-card:hover {
          transform: translateY(-4px);
          border-color: #bfdbfe;
          box-shadow:
            0 15px 35px
            rgba(30, 27, 75, 0.1);
        }

        /* ================================================
           PLACE HEADER
        ================================================ */

        .place-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }

        .place-icon {
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background:
            rgba(124, 58, 237, 0.1);
          font-size: 24px;
          flex-shrink: 0;
        }

        .place-title {
          flex: 1;
          min-width: 0;
        }

        .place-title h3 {
          margin: 0;
          font-size: 17px;
          line-height: 1.35;
        }

        .place-title span {
          display: inline-block;
          margin-top: 4px;
          color: var(--text-muted);
          font-size: 13px;
        }

        /* ================================================
           DESCRIPTION
        ================================================ */

        .place-description {
          margin: 14px 0 0;
          color: var(--text-muted);
          font-size: 13px;
          line-height: 1.6;
        }

        /* ================================================
           SOURCE / RATING ROW
        ================================================ */

        .rating-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 14px 0;
          padding: 8px 10px;
          background: #f8fafc;
          border-radius: 10px;
          color: #475569;
          font-size: 12px;
          font-weight: 700;
        }

        .rating-row span:last-child {
          color: var(--text-muted);
          font-weight: 600;
        }

        /* ================================================
           INFORMATION
        ================================================ */

        .place-info {
          margin: 16px 0;
        }

        .place-info p {
          margin: 8px 0;
          color: var(--text-muted);
          font-size: 14px;
          line-height: 1.5;
        }

        .place-info .distance {
          color:
            var(--primary, #7c3aed);
          font-weight: 800;
        }

        /* ================================================
           ACTIONS
        ================================================ */

        .place-actions {
          display: flex;
          gap: 8px;
        }

        .place-actions button {
          flex: 1;
        }

        /* ================================================
           EMPTY STATE
        ================================================ */

        .empty-state {
          text-align: center;
          padding: 50px 20px;
        }

        .empty-icon {
          font-size: 50px;
          margin-bottom: 10px;
        }

        .empty-state h3 {
          margin: 5px 0;
        }

        .empty-state p {
          color: var(--text-muted);
          max-width: 500px;
          margin: 10px auto 20px;
          line-height: 1.6;
        }

        /* ================================================
           SAFETY NOTICE
        ================================================ */

        .safety-notice {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 18px;
          margin-top: 25px;
          border-left:
            4px solid
            var(--primary, #7c3aed);
        }

        .notice-icon {
          font-size: 28px;
          flex-shrink: 0;
        }

        .safety-notice h3 {
          margin: 0;
        }

        .safety-notice p {
          margin: 6px 0 0;
          color: var(--text-muted);
          line-height: 1.6;
        }

        /* ================================================
           LOADING
        ================================================ */

        .safeplaces-loading {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 20px;
        }

        .loading-icon {
          font-size: 50px;
          animation:
            shaktiPulse 1.2s infinite;
        }

        .safeplaces-loading h2 {
          margin-bottom: 8px;
        }

        .safeplaces-loading p {
          color: var(--text-muted);
          max-width: 550px;
          line-height: 1.6;
        }

        @keyframes shaktiPulse {

          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.15);
          }

        }

        /* ================================================
           TABLET
        ================================================ */

        @media (max-width: 768px) {

          .safeplaces-page {
            padding: 12px;
          }

          .safeplaces-header {
            flex-direction: column;
          }

          .emergency-button {
            width: 100%;
          }

          .location-status {
            flex-direction: column;
            align-items: stretch;
          }

          .location-status
            .secondary-button {
            width: 100%;
          }

          .places-grid {
            grid-template-columns: 1fr;
          }

          .section-header {
            align-items: flex-start;
          }

          .verified-banner {
            align-items: flex-start;
          }

        }

        /* ================================================
           MOBILE
        ================================================ */

        @media (max-width: 480px) {

          .safeplaces-page {
            padding: 10px;
          }

          .page-title {
            font-size: 26px;
          }

          .page-subtitle {
            font-size: 14px;
          }

          .filter-row {
            display: grid;
            grid-template-columns:
              1fr 1fr;
          }

          .filter-button {
            width: 100%;
          }

          .place-actions {
            flex-direction: column;
          }

          .verified-banner {
            flex-wrap: wrap;
          }

          .verified-total {
            margin-left: 0;
            width: 100%;
            box-sizing: border-box;
          }

          .error-card {
            flex-direction: column;
            align-items: stretch;
          }

          .error-card
            .secondary-button {
            width: 100%;
          }

          .location-content {
            align-items: flex-start;
          }

        }

      `}</style>

    </div>
  );
};

export default SafePlaces;