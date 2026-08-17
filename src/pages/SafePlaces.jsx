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

const SEARCH_RADIUS = 5000; // 5 km

/* =========================================================
   TYPE CONFIGURATION
========================================================= */

const typeConfig = {
  police: {
    icon: "🚔",
    label: "Police",
    color: "#2563eb",
    background: "#eff6ff",
  },

  hospital: {
    icon: "🏥",
    label: "Hospital",
    color: "#dc2626",
    background: "#fef2f2",
  },

  shelter: {
    icon: "🏠",
    label: "Shelter",
    color: "#7c3aed",
    background: "#f5f3ff",
  },

  community: {
    icon: "🏛️",
    label: "Community",
    color: "#059669",
    background: "#ecfdf5",
  },

  pharmacy: {
    icon: "💊",
    label: "Pharmacy",
    color: "#0891b2",
    background: "#ecfeff",
  },

  other: {
    icon: "📍",
    label: "Other",
    color: "#64748b",
    background: "#f8fafc",
  },
};

/* =========================================================
   DISTANCE CALCULATION
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
   FORMAT DISTANCE
========================================================= */

const formatDistance = (distance) => {
  if (distance === null || distance === undefined) {
    return "Distance unavailable";
  }

  if (distance < 1) {
    return `${Math.round(distance * 1000)} m away`;
  }

  return `${distance.toFixed(1)} km away`;
};

/* =========================================================
   CONVERT OSM RESULT
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

  const response = await fetch(
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

  const uniquePlaces =
    Array.from(
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

  /*
   * No Delhi fallback.
   * The map will wait for the user's actual location.
   */

  const [center, setCenter] =
    useState(null);

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

          /*
           * Calculate distance immediately.
           */

          const placesWithDistance =
            nearbyPlaces
              .map((place) => {
                const [
                  placeLng,
                  placeLat,
                ] =
                  place.location
                    ?.coordinates || [];

                if (
                  typeof placeLat !== "number" ||
                  typeof placeLng !== "number"
                ) {
                  return {
                    ...place,
                    distance: null,
                  };
                }

                return {
                  ...place,

                  distance:
                    getDistanceInKm(
                      lat,
                      lng,
                      placeLat,
                      placeLng
                    ),
                };
              })
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

          setPlaces(
            placesWithDistance
          );

          if (
            placesWithDistance.length === 0
          ) {
            setError(
              "No safety-related locations were found within 5 km of your current location."
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
     DETECT CURRENT USER LOCATION
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
              "ShaktiShield current user location:",
              lat,
              lng
            );

            /*
             * Store exact current location.
             */

            setUserLocation({
              lat,
              lng,
            });

            /*
             * Center map on exact location.
             */

            setCenter([
              lat,
              lng,
            ]);

            /*
             * Find safety locations
             * around current location.
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
              "Location permission was denied. Please allow location access in your browser settings."
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
              "Unable to determine your current location."
            );
          }
        },

        {
          /*
           * High accuracy is useful for
           * safety-location searches.
           */

          enableHighAccuracy: true,

          timeout: 15000,

          /*
           * Don't use an old position.
           * This makes the page more
           * location accurate.
           */

          maximumAge: 30000,
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
     PROCESS / FILTER PLACES
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

          let distance =
            place.distance ?? null;

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

        /*
         * SEARCH
         */

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

        /*
         * NEAREST FIRST
         */

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
     NEAREST PLACE
  ======================================================= */

  const nearestPlace =
    useMemo(() => {
      if (
        !userLocation ||
        processedPlaces.length === 0
      ) {
        return null;
      }

      return processedPlaces[0];
    }, [
      processedPlaces,
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
          formatDistance(
            place.distance
          );

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

              <br/>

              <span style="
                color:#2563eb;
                font-weight:bold;
              ">
                📍 ${distanceText}
              </span>

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

          <div className="location-loader">
            📍
          </div>

          <h2>
            Finding Safe Places Near You...
          </h2>

          <p>
            ShaktiShield is detecting your
            current GPS location and searching
            nearby police stations, hospitals,
            pharmacies and support facilities.
          </p>

          <div className="location-loading-pill">
            <span className="pulse-dot" />
            Using your current location
          </div>

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
          CURRENT LOCATION CARD
      =================================================== */}

      <div className="current-location-card card">

        <div className="current-location-left">

          <div className="gps-icon">
            📍
          </div>

          <div>

            <div className="current-location-title">
              {locationLoading
                ? "Detecting your location..."
                : userLocation
                ? "Your current location"
                : "Location unavailable"}
            </div>

            <p className="current-location-text">

              {locationError ||
                (userLocation
                  ? "Nearby safety places are calculated from your current GPS position."
                  : "Allow location access to find safe places near you.")}

            </p>

            {userLocation && (
              <div className="coordinates">

                <span>
                  Latitude:{" "}
                  {userLocation.lat.toFixed(5)}
                </span>

                <span>
                  Longitude:{" "}
                  {userLocation.lng.toFixed(5)}
                </span>

              </div>
            )}

          </div>

        </div>

        <button
          className="location-button"
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
          LOCATION NOTICE
      =================================================== */}

      {locationError && (
        <div className="location-help card">

          <div className="help-icon">
            💡
          </div>

          <div>

            <strong>
              Location access is required
            </strong>

            <p>
              To show safe places near you,
              allow location permission in your
              browser and then click
              <b> Use My Location</b>.
            </p>

          </div>

        </div>
      )}

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
            🌎 All
          </button>

          {Object.entries(
            typeConfig
          ).map(
            ([type, config]) => (
              <button
                key={type}
                className={
                  selectedType === type
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

          <div className="error-content">

            <div className="error-icon">
              ⚠️
            </div>

            <div>

              <strong>
                Safety Network Notice
              </strong>

              <p>
                {error ||
                  locationError}
              </p>

            </div>

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
          NEAREST PLACE HIGHLIGHT
      =================================================== */}

      {nearestPlace &&
        !search &&
        selectedType === "all" && (
          <div className="nearest-card">

            <div className="nearest-icon">
              ⭐
            </div>

            <div className="nearest-content">

              <span className="nearest-label">
                NEAREST SAFETY LOCATION
              </span>

              <h2>
                {nearestPlace.name}
              </h2>

              <p>
                {typeConfig[
                  nearestPlace.type
                ]?.icon}{" "}
                {typeConfig[
                  nearestPlace.type
                ]?.label}{" "}
                •{" "}
                {formatDistance(
                  nearestPlace.distance
                )}
              </p>

            </div>

            <button
              className="nearest-button"
              onClick={() =>
                handleDirections(
                  nearestPlace
                )
              }
            >
              🧭 Go There
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
            Safety Places Around You
          </h2>

          <p>
            Locations are searched within
            5 km of your current GPS position.
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
              🗺️ Safety Map
            </h2>

            <p>
              Showing safety locations
              around your current position.
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

        {center ? (
          <Map
            center={center}
            markers={markers}
            userLocation={
              userLocation
            }
            height="420px"
          />
        ) : (
          <div className="map-placeholder">

            <div>
              📍
            </div>

            <h3>
              Waiting for your location
            </h3>

            <p>
              Allow location access to
              display safe places around you.
            </p>

            <button
              className="primary-button"
              onClick={
                detectLocation
              }
            >
              📍 Detect My Location
            </button>

          </div>
        )}

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
              🔍
            </div>

            <h3>
              No Nearby Places Found
            </h3>

            <p>
              No mapped safety locations
              were found within 5 km of your
              current location.
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
              (place, index) => {

                const config =
                  typeConfig[
                    place.type
                  ] ||
                  typeConfig.other;

                const isNearest =
                  index === 0 &&
                  !search &&
                  selectedType === "all";

                return (
                  <div
                    key={
                      place._id
                    }
                    className={
                      isNearest
                        ? "safe-place-card card nearest-place-card"
                        : "safe-place-card card"
                    }
                  >

                    {isNearest && (
                      <div className="nearest-badge">
                        ⭐ Nearest to you
                      </div>
                    )}

                    {/* PLACE HEADER */}

                    <div className="place-header">

                      <div
                        className="place-icon"
                        style={{
                          background:
                            config.background,
                        }}
                      >
                        {config.icon}
                      </div>

                      <div className="place-title">

                        <h3>
                          {place.name}
                        </h3>

                        <span
                          style={{
                            color:
                              config.color,
                          }}
                        >
                          {config.label}
                        </span>

                      </div>

                    </div>

                    {/* IMAGE / VISUAL AREA */}

                    <div
                      className="place-visual"
                      style={{
                        background:
                          `linear-gradient(135deg, ${config.background}, #ffffff)`,
                      }}
                    >

                      <div className="visual-icon">
                        {config.icon}
                      </div>

                      <div>

                        <strong>
                          Nearby Safety Support
                        </strong>

                        <span>
                          OpenStreetMap location
                        </span>

                      </div>

                    </div>

                    {/* DESCRIPTION */}

                    {place.description && (
                      <p className="place-description">
                        {place.description}
                      </p>
                    )}

                    {/* DISTANCE */}

                    <div className="distance-highlight">

                      <span>
                        📍 Distance from you
                      </span>

                      <strong>
                        {formatDistance(
                          place.distance
                        )}
                      </strong>

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

                    </div>

                    {/* SOURCE */}

                    <div className="source-row">

                      <span>
                        🗺️ OpenStreetMap
                      </span>

                      <span>
                        Location data
                      </span>

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
          HOW IT WORKS
      =================================================== */}

      <div className="how-it-works card">

        <div className="how-header">

          <div className="how-icon">
            🛡️
          </div>

          <div>

            <h2>
              How ShaktiShield Finds Safe Places
            </h2>

            <p>
              Your safety comes first.
            </p>

          </div>

        </div>

        <div className="steps-grid">

          <div className="step">

            <div className="step-number">
              1
            </div>

            <div>

              <strong>
                📍 Your Location
              </strong>

              <p>
                Your browser provides your
                current GPS coordinates.
              </p>

            </div>

          </div>

          <div className="step">

            <div className="step-number">
              2
            </div>

            <div>

              <strong>
                🔎 Nearby Search
              </strong>

              <p>
                ShaktiShield searches safety
                facilities within 5 km.
              </p>

            </div>

          </div>

          <div className="step">

            <div className="step-number">
              3
            </div>

            <div>

              <strong>
                📏 Distance
              </strong>

              <p>
                Places are sorted from nearest
                to farthest.
              </p>

            </div>

          </div>

          <div className="step">

            <div className="step-number">
              4
            </div>

            <div>

              <strong>
                🧭 Get Directions
              </strong>

              <p>
                Open Google Maps to navigate
                to the selected location.
              </p>

            </div>

          </div>

        </div>

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
            ShaktiShield. Map data may
            sometimes be incomplete or
            outdated. Always confirm the
            location before relying on it
            in an emergency.
          </p>

          <p className="emergency-note">
            🚨 For immediate emergencies
            in India, call <strong>112</strong>.
          </p>

        </div>

      </div>

      {/* ===================================================
          PAGE CSS
      =================================================== */}

      <style>{`

        /* ================================================
           MAIN
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

        /* ================================================
           CURRENT LOCATION
        ================================================ */

        .current-location-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 18px;
          margin-bottom: 20px;
          border: 1px solid #bfdbfe;
          background:
            linear-gradient(
              135deg,
              #eff6ff,
              #ffffff
            );
        }

        .current-location-left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }

        .gps-icon {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: #dbeafe;
          font-size: 26px;
          flex-shrink: 0;
        }

        .current-location-title {
          font-size: 16px;
          font-weight: 800;
          color: #1e3a8a;
        }

        .current-location-text {
          margin: 5px 0 0;
          color: var(--text-muted);
          font-size: 13px;
          line-height: 1.5;
        }

        .coordinates {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 8px;
          color: #475569;
          font-size: 11px;
          font-family: monospace;
        }

        .location-button {
          border: none;
          border-radius: 11px;
          padding: 11px 16px;
          background: #2563eb;
          color: white;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
          transition: 0.2s;
        }

        .location-button:hover {
          transform: translateY(-2px);
          background: #1d4ed8;
        }

        .location-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        /* ================================================
           LOCATION HELP
        ================================================ */

        .location-help {
          display: flex;
          gap: 14px;
          align-items: flex-start;
          padding: 15px;
          margin-bottom: 20px;
          border-left: 4px solid #f59e0b;
          background: #fffbeb;
        }

        .help-icon {
          font-size: 24px;
        }

        .location-help strong {
          color: #92400e;
        }

        .location-help p {
          margin: 5px 0 0;
          color: #78350f;
          line-height: 1.5;
          font-size: 13px;
        }

        /* ================================================
           CONTROLS
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
          background:
            rgba(128, 128, 128, 0.1);
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

        .error-content {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .error-icon {
          font-size: 22px;
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
           NEAREST CARD
        ================================================ */

        .nearest-card {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 18px;
          margin: 25px 0;
          border-radius: 18px;
          color: white;
          background:
            linear-gradient(
              135deg,
              #7c3aed,
              #4f46e5
            );
          box-shadow:
            0 12px 30px
            rgba(79, 70, 229, 0.22);
        }

        .nearest-icon {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background:
            rgba(255,255,255,0.16);
          font-size: 25px;
          flex-shrink: 0;
        }

        .nearest-content {
          flex: 1;
          min-width: 0;
        }

        .nearest-label {
          display: block;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 1.2px;
          opacity: 0.8;
        }

        .nearest-content h2 {
          margin: 4px 0;
          font-size: 19px;
        }

        .nearest-content p {
          margin: 0;
          font-size: 13px;
          opacity: 0.9;
        }

        .nearest-button {
          border: none;
          border-radius: 10px;
          padding: 10px 14px;
          background: white;
          color: #4f46e5;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
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
           MAP
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

        .map-placeholder {
          min-height: 420px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 20px;
          border-radius: 18px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .map-placeholder > div {
          font-size: 50px;
          margin-bottom: 8px;
        }

        .map-placeholder h3 {
          margin: 5px 0;
        }

        .map-placeholder p {
          color: var(--text-muted);
          max-width: 450px;
          line-height: 1.5;
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
          position: relative;
          overflow: hidden;
        }

        .safe-place-card:hover {
          transform: translateY(-4px);
          border-color: #bfdbfe;
          box-shadow:
            0 15px 35px
            rgba(30, 27, 75, 0.1);
        }

        .nearest-place-card {
          border: 2px solid #8b5cf6;
        }

        .nearest-badge {
          position: absolute;
          top: 0;
          right: 0;
          padding: 6px 10px;
          border-radius:
            0 0 0 10px;
          background: #7c3aed;
          color: white;
          font-size: 10px;
          font-weight: 800;
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
          font-size: 13px;
          font-weight: 700;
        }

        /* ================================================
           VISUAL AREA
        ================================================ */

        .place-visual {
          display: flex;
          align-items: center;
          gap: 12px;
          min-height: 75px;
          margin-top: 15px;
          padding: 12px;
          border-radius: 14px;
        }

        .visual-icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: white;
          font-size: 25px;
          box-shadow:
            0 4px 12px
            rgba(0,0,0,0.05);
        }

        .place-visual strong {
          display: block;
          font-size: 13px;
        }

        .place-visual span {
          display: block;
          margin-top: 3px;
          color: var(--text-muted);
          font-size: 11px;
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
           DISTANCE
        ================================================ */

        .distance-highlight {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 14px;
          padding: 10px 12px;
          border-radius: 10px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
        }

        .distance-highlight span {
          color: #166534;
          font-size: 12px;
          font-weight: 700;
        }

        .distance-highlight strong {
          color: #15803d;
          font-size: 13px;
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

        /* ================================================
           SOURCE
        ================================================ */

        .source-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin: 12px 0;
          padding: 8px 10px;
          border-radius: 9px;
          background: #f8fafc;
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
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
           HOW IT WORKS
        ================================================ */

        .how-it-works {
          padding: 20px;
          margin-top: 28px;
          background:
            linear-gradient(
              135deg,
              #faf5ff,
              #ffffff
            );
        }

        .how-header {
          display: flex;
          align-items: center;
          gap: 13px;
          margin-bottom: 20px;
        }

        .how-icon {
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #ede9fe;
          font-size: 24px;
        }

        .how-header h2 {
          margin: 0;
          font-size: 20px;
        }

        .how-header p {
          margin: 4px 0 0;
          color: var(--text-muted);
          font-size: 13px;
        }

        .steps-grid {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 15px;
        }

        .step {
          display: flex;
          gap: 10px;
          padding: 14px;
          border-radius: 12px;
          background: white;
          border: 1px solid #ede9fe;
        }

        .step-number {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #7c3aed;
          color: white;
          font-weight: 800;
          flex-shrink: 0;
        }

        .step strong {
          font-size: 13px;
        }

        .step p {
          margin: 4px 0 0;
          color: var(--text-muted);
          font-size: 11px;
          line-height: 1.5;
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

        .safety-notice .emergency-note {
          color: #991b1b;
          font-weight: 600;
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

        .location-loader {
          width: 75px;
          height: 75px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #dbeafe;
          font-size: 38px;
          animation:
            locationPulse 1.4s infinite;
        }

        .safeplaces-loading h2 {
          margin: 20px 0 8px;
        }

        .safeplaces-loading p {
          color: var(--text-muted);
          max-width: 550px;
          line-height: 1.6;
        }

        .location-loading-pill {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 12px;
          padding: 8px 12px;
          border-radius: 20px;
          background: #eff6ff;
          color: #1d4ed8;
          font-size: 12px;
          font-weight: 700;
        }

        .pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #2563eb;
          animation:
            dotPulse 1s infinite;
        }

        @keyframes locationPulse {

          0%,
          100% {
            transform: scale(1);
            box-shadow:
              0 0 0 0
              rgba(37, 99, 235, 0.25);
          }

          50% {
            transform: scale(1.08);
            box-shadow:
              0 0 0 15px
              rgba(37, 99, 235, 0);
          }

        }

        @keyframes dotPulse {

          0%,
          100% {
            opacity: 0.4;
          }

          50% {
            opacity: 1;
          }

        }

        /* ================================================
           TABLET
        ================================================ */

        @media (max-width: 900px) {

          .steps-grid {
            grid-template-columns:
              repeat(2, 1fr);
          }

        }

        /* ================================================
           MOBILE
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

          .current-location-card {
            flex-direction: column;
            align-items: stretch;
          }

          .location-button {
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

          .nearest-card {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .nearest-button {
            width: 100%;
          }

        }

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

          .coordinates {
            flex-direction: column;
            gap: 3px;
          }

          .steps-grid {
            grid-template-columns: 1fr;
          }

          .safety-notice {
            flex-direction: column;
          }

        }

      `}</style>

    </div>
  );
};

export default SafePlaces;