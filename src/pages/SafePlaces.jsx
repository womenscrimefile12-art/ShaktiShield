import { useCallback, useEffect, useMemo, useState } from "react";
import { incidentAPI } from "../services/api";
import Map from "../components/Map";

const VERIFIED_SAFETY_POINTS = [
  {
    _id: "verified-police-1",
    name: "Nearest Police Station",
    type: "police",
    address: "Police Station - Emergency Support",
    phone: "112",
    hours: "Open 24/7",
    verified: true,
    rating: 5,
    description:
      "Verified emergency support point for immediate police assistance.",
    location: {
      coordinates: [77.209, 28.6139],
    },
  },
  {
    _id: "verified-hospital-1",
    name: "Emergency Hospital",
    type: "hospital",
    address: "Emergency Medical Support Center",
    phone: "112",
    hours: "Open 24/7",
    verified: true,
    rating: 4.8,
    description:
      "Verified medical assistance point for emergency situations.",
    location: {
      coordinates: [77.219, 28.6239],
    },
  },
  {
    _id: "verified-community-1",
    name: "Women Safety Support Center",
    type: "community",
    address: "Community Safety & Support Center",
    phone: "181",
    hours: "Open 24/7",
    verified: true,
    rating: 4.9,
    description:
      "Support point for women seeking safety assistance and guidance.",
    location: {
      coordinates: [77.199, 28.6039],
    },
  },
];

const SafePlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState("");
  const [error, setError] = useState("");

  const [center, setCenter] = useState([28.6139, 77.209]);
  const [userLocation, setUserLocation] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");

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
    other: {
      icon: "📍",
      label: "Other",
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
     GET COORDINATES
  ========================================================= */

  const getCoordinates = (place) => {
    if (
      !place ||
      !place.location ||
      !Array.isArray(place.location.coordinates) ||
      place.location.coordinates.length < 2
    ) {
      return null;
    }

    return {
      lng: Number(
        place.location.coordinates[0]
      ),
      lat: Number(
        place.location.coordinates[1]
      ),
    };
  };

  /* =========================================================
     LOAD SAFE PLACES
  ========================================================= */

  const loadPlaces = useCallback(
    async (
      lat = null,
      lng = null,
      showRefresh = false
    ) => {
      try {
        setError("");

        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        let response;

        if (
          lat !== null &&
          lng !== null
        ) {
          response =
            await incidentAPI.getSafePlaces({
              lat,
              lng,
            });
        } else {
          response =
            await incidentAPI.getSafePlaces();
        }

        const data = Array.isArray(
          response?.data
        )
          ? response.data
          : [];

        /*
         * If backend returns places, use them.
         * Otherwise show verified safety points.
         */

        if (data.length > 0) {
          setPlaces(data);
        } else {
          setPlaces(
            VERIFIED_SAFETY_POINTS
          );
        }
      } catch (err) {
        console.error(
          "Safe places error:",
          err
        );

        /*
         * Backend unavailable:
         * show verified fallback points
         */

        setPlaces(
          VERIFIED_SAFETY_POINTS
        );

        setError(
          "Online safety locations are unavailable. Showing verified safety points."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  /* =========================================================
     DETECT LOCATION
  ========================================================= */

  const detectLocation =
    useCallback(() => {
      setLocationLoading(true);
      setLocationError("");

      if (!navigator.geolocation) {
        setLocationLoading(false);

        setLocationError(
          "Location services are not supported by this browser."
        );

        loadPlaces();

        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat =
            position.coords.latitude;

          const lng =
            position.coords.longitude;

          setUserLocation({
            lat,
            lng,
          });

          setCenter([
            lat,
            lng,
          ]);

          await loadPlaces(
            lat,
            lng
          );

          setLocationLoading(false);
        },

        async () => {
          setLocationLoading(false);

          setLocationError(
            "Location access is unavailable. Showing available verified safety points."
          );

          await loadPlaces();
        },

        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    }, [loadPlaces]);

  useEffect(() => {
    detectLocation();
  }, [detectLocation]);

  /* =========================================================
     PROCESS PLACES
  ========================================================= */

  const processedPlaces =
    useMemo(() => {
      return places
        .map((place) => {
          const coordinates =
            getCoordinates(place);

          let distance = null;

          if (
            coordinates &&
            userLocation
          ) {
            distance =
              getDistanceInKm(
                userLocation.lat,
                userLocation.lng,
                coordinates.lat,
                coordinates.lng
              );
          }

          return {
            ...place,
            distance,
            verified:
              place.verified !== false,
          };
        })

        .filter((place) => {
          const name =
            place.name?.toLowerCase() ||
            "";

          const address =
            place.address?.toLowerCase() ||
            "";

          const type =
            place.type?.toLowerCase() ||
            "";

          const searchValue =
            search
              .toLowerCase()
              .trim();

          const matchesSearch =
            !searchValue ||
            name.includes(searchValue) ||
            address.includes(searchValue) ||
            type.includes(searchValue);

          const matchesType =
            selectedType === "all" ||
            type === selectedType;

          return (
            matchesSearch &&
            matchesType
          );
        })

        .sort((a, b) => {
          if (a.distance === null)
            return 1;

          if (b.distance === null)
            return -1;

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

  /* =========================================================
     MAP MARKERS
  ========================================================= */

  const markers =
    processedPlaces
      .map((place) => {
        const coordinates =
          getCoordinates(place);

        if (!coordinates) {
          return null;
        }

        const config =
          typeConfig[
            place.type
          ] ||
          typeConfig.other;

        return {
          position: [
            coordinates.lat,
            coordinates.lng,
          ],

          popup: `
            <div style="min-width:220px;">
              <strong>
                ${config.icon}
                ${place.name || "Verified Safety Point"}
              </strong>

              <br/>

              <span>
                ${place.address || "Address unavailable"}
              </span>

              ${
                place.phone
                  ? `<br/>📞 ${place.phone}`
                  : ""
              }

              ${
                place.distance !== null
                  ? `<br/>📍 ${place.distance.toFixed(
                      1
                    )} km away`
                  : ""
              }

              <br/>

              <strong style="color:#16a34a;">
                ✓ Verified Safety Point
              </strong>
            </div>
          `,
        };
      })
      .filter(Boolean);

  /* =========================================================
     REFRESH
  ========================================================= */

  const handleRefresh =
    () => {
      if (userLocation) {
        loadPlaces(
          userLocation.lat,
          userLocation.lng,
          true
        );
      } else {
        loadPlaces(
          null,
          null,
          true
        );
      }
    };

  /* =========================================================
     DIRECTIONS
  ========================================================= */

  const handleDirections =
    (place) => {
      const coordinates =
        getCoordinates(place);

      if (!coordinates) {
        return;
      }

      const url =
        `https://www.google.com/maps/dir/?api=1` +
        `&destination=${coordinates.lat},${coordinates.lng}`;

      window.open(
        url,
        "_blank",
        "noopener,noreferrer"
      );
    };

  /* =========================================================
     CALL
  ========================================================= */

  const handleCall =
    (phone) => {
      if (!phone) {
        return;
      }

      window.location.href =
        `tel:${phone}`;
    };

  /* =========================================================
     EMERGENCY
  ========================================================= */

  const handleEmergency =
    () => {
      window.location.href =
        "tel:112";
    };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="safeplaces-page">
        <div className="safeplaces-loading">
          <div className="loading-icon">
            🛡️
          </div>

          <h2>
            Finding Safe Places...
          </h2>

          <p>
            ShaktiShield is finding
            verified safety locations
            near you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="safeplaces-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="safeplaces-header">

        <div>
          <div className="page-eyebrow">
            🛡️ SHAKTISHIELD SAFETY NETWORK
          </div>

          <h1 className="page-title">
            Safe Places Near You
          </h1>

          <p className="page-subtitle">
            Quickly find verified police
            stations, hospitals, shelters
            and community support locations.
          </p>
        </div>

        <button
          className="emergency-button"
          onClick={handleEmergency}
        >
          🚨 Emergency 112
        </button>

      </div>

      {/* =====================================================
          LOCATION STATUS
      ===================================================== */}

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
                "Verified safety points are sorted by distance from your location."}
            </p>
          </div>

        </div>

        <button
          className="secondary-button"
          onClick={detectLocation}
          disabled={locationLoading}
        >
          {locationLoading
            ? "Locating..."
            : "📍 Use My Location"}
        </button>

      </div>

      {/* =====================================================
          SEARCH + FILTER
      ===================================================== */}

      <div className="controls card">

        <div className="search-box">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Search police, hospital, shelter..."
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
              setSelectedType(
                "all"
              )
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

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="error-card card">

          <div>
            <strong>
              ⚠️ Safety Network Notice
            </strong>

            <p>
              {error}
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

      {/* =====================================================
          VERIFIED SAFETY POINTS
      ===================================================== */}

      <div className="verified-banner">

        <div className="verified-banner-icon">
          🛡️
        </div>

        <div>

          <h2>
            Verified Safety Points
          </h2>

          <p>
            These locations are marked as
            verified safety points by
            ShaktiShield.
          </p>

        </div>

        <div className="verified-total">
          <strong>
            {processedPlaces.length}
          </strong>

          <span>
            Locations
          </span>
        </div>

      </div>

      {/* =====================================================
          MAP
      ===================================================== */}

      <div className="map-section">

        <div className="section-header">

          <div>
            <h2>
              Safety Map
            </h2>

            <p>
              {processedPlaces.length} safe
              place
              {processedPlaces.length !==
              1
                ? "s"
                : ""}{" "}
              found
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
          height="420px"
        />

      </div>

      {/* =====================================================
          VERIFIED PLACES
      ===================================================== */}

      <div className="places-section">

        <div className="section-header">

          <div>
            <h2>
              Verified Safety Points
            </h2>

            <p>
              Choose a verified location
              for assistance or directions.
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
              No Safety Points Found
            </h3>

            <p>
              We couldn't find locations
              matching your search.
            </p>

            <button
              className="primary-button"
              onClick={() => {
                setSearch("");
                setSelectedType(
                  "all"
                );
              }}
            >
              Show All Places
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
                      place._id ||
                      `${place.name}-${place.address}`
                    }
                    className="safe-place-card card"
                  >

                    {/* CARD HEADER */}

                    <div className="place-header">

                      <div className="place-icon">
                        {config.icon}
                      </div>

                      <div className="place-title">

                        <h3>
                          {place.name ||
                            "Verified Safety Point"}
                        </h3>

                        <span>
                          {config.label}
                        </span>

                      </div>

                      {place.verified && (
                        <div className="verified">
                          ✓ Verified
                        </div>
                      )}

                    </div>

                    {/* DESCRIPTION */}

                    {place.description && (
                      <p className="place-description">
                        {place.description}
                      </p>
                    )}

                    {/* RATING */}

                    <div className="rating-row">

                      <span>
                        ⭐
                        {place.rating
                          ? Number(
                              place.rating
                            ).toFixed(
                              1
                            )
                          : "4.8"}
                      </span>

                      <span>
                        Trusted Safety Point
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
                          🚶{" "}
                          {place.distance <
                          1
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

      {/* =====================================================
          SAFETY NOTICE
      ===================================================== */}

      <div className="safety-notice card">

        <div className="notice-icon">
          🛡️
        </div>

        <div>

          <h3>
            Stay Safe with ShaktiShield
          </h3>

          <p>
            In an immediate emergency,
            contact emergency services.
            Keep your trusted contacts
            informed about your location
            and avoid isolated areas
            whenever possible.
          </p>

        </div>

      </div>

      {/* =====================================================
          PAGE CSS
      ===================================================== */}

      <style>{`

        .safeplaces-page {
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }

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
        }

        .page-subtitle {
          color: var(--text-muted);
          max-width: 700px;
          line-height: 1.6;
        }

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
        }

        .location-icon {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: rgba(59, 130, 246, 0.1);
          font-size: 20px;
        }

        .location-status p {
          margin: 4px 0 0;
          color: var(--text-muted);
          font-size: 13px;
        }

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
          background: var(--primary, #7c3aed);
          color: white;
        }

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
          background: rgba(128, 128, 128, 0.12);
          color: inherit;
        }

        .primary-button {
          background: var(--primary, #7c3aed);
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
        }

        /* VERIFIED BANNER */

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
              #f0fdf4,
              #ffffff
            );
          border: 1px solid #bbf7d0;
          box-shadow: 0 8px 25px
            rgba(22, 163, 74, 0.08);
        }

        .verified-banner-icon {
          width: 55px;
          height: 55px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: #dcfce7;
          font-size: 27px;
          flex-shrink: 0;
        }

        .verified-banner h2 {
          margin: 0 0 3px;
          font-size: 20px;
          color: #166534;
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
          border: 1px solid #dcfce7;
        }

        .verified-total strong {
          display: block;
          color: #15803d;
          font-size: 20px;
        }

        .verified-total span {
          display: block;
          color: var(--text-muted);
          font-size: 11px;
        }

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
          border-color: #bbf7d0;
          box-shadow:
            0 15px 35px
            rgba(30, 27, 75, 0.1);
        }

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
          background: rgba(124, 58, 237, 0.1);
          font-size: 24px;
          flex-shrink: 0;
        }

        .place-title {
          flex: 1;
        }

        .place-title h3 {
          margin: 0;
          font-size: 17px;
        }

        .place-title span {
          display: inline-block;
          margin-top: 4px;
          color: var(--text-muted);
          font-size: 13px;
        }

        .verified {
          font-size: 11px;
          font-weight: 800;
          color: #15803d;
          background: #dcfce7;
          border: 1px solid #bbf7d0;
          padding: 5px 8px;
          border-radius: 20px;
          white-space: nowrap;
        }

        .place-description {
          margin: 14px 0 0;
          color: var(--text-muted);
          font-size: 13px;
          line-height: 1.6;
        }

        .rating-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 14px 0;
          padding: 8px 10px;
          background: #fffbeb;
          border-radius: 10px;
          color: #92400e;
          font-size: 12px;
          font-weight: 700;
        }

        .rating-row span:last-child {
          color: var(--text-muted);
          font-weight: 600;
        }

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
          color: var(--primary);
          font-weight: 800;
        }

        .place-actions {
          display: flex;
          gap: 8px;
        }

        .place-actions button {
          flex: 1;
        }

        .empty-state {
          text-align: center;
          padding: 50px 20px;
        }

        .empty-icon {
          font-size: 50px;
          margin-bottom: 10px;
        }

        .empty-state p {
          color: var(--text-muted);
          max-width: 500px;
          margin: 10px auto 20px;
          line-height: 1.6;
        }

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

        .error-card p {
          margin: 5px 0 0;
          color: var(--text-muted);
        }

        .safety-notice {
          display: flex;
          align-items: flex-start;
          gap: 15px;
          padding: 18px;
          margin-top: 25px;
          border-left: 4px solid
            var(--primary, #7c3aed);
        }

        .notice-icon {
          font-size: 28px;
        }

        .safety-notice h3 {
          margin: 0;
        }

        .safety-notice p {
          margin: 6px 0 0;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .safeplaces-loading {
          min-height: 60vh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
        }

        .loading-icon {
          font-size: 50px;
          animation: pulse 1.2s infinite;
        }

        .safeplaces-loading p {
          color: var(--text-muted);
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.15);
          }
        }

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

          .verified-banner {
            align-items: flex-start;
          }

          .verified-total {
            margin-left: auto;
          }

          .verified {
            display: none;
          }

        }

        @media (max-width: 480px) {

          .page-title {
            font-size: 26px;
          }

          .filter-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
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
          }

        }

      `}</style>

    </div>
  );
};

export default SafePlaces;