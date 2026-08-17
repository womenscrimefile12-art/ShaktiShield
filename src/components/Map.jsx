import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

/* =========================================================
   DEFAULT PLACE ICON
========================================================= */

const defaultIcon = new L.Icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

/* =========================================================
   USER LOCATION ICON
========================================================= */

const userIcon = L.divIcon({
  className: "shaktishield-user-marker",

  html: `
    <div class="user-location-marker">
      <div class="user-location-pulse"></div>
      <div class="user-location-dot"></div>
    </div>
  `,

  iconSize: [30, 30],
  iconAnchor: [15, 15],
});

/* =========================================================
   MAP VIEW CONTROLLER
========================================================= */

const MapViewController = ({
  center,
  userLocation,
  markers,
}) => {
  const map = useMap();

  useEffect(() => {
    /*
     * If we have the user's location,
     * always keep the map centered around it.
     */

    if (
      userLocation &&
      typeof userLocation.lat === "number" &&
      typeof userLocation.lng === "number"
    ) {
      /*
       * If nearby places exist, fit all markers
       * inside the map.
       */

      if (Array.isArray(markers) && markers.length > 0) {
        const validPoints = markers
          .filter(
            (marker) =>
              Array.isArray(marker.position) &&
              marker.position.length === 2 &&
              typeof marker.position[0] === "number" &&
              typeof marker.position[1] === "number"
          )
          .map((marker) => marker.position);

        if (validPoints.length > 0) {
          const allPoints = [
            [userLocation.lat, userLocation.lng],
            ...validPoints,
          ];

          const bounds = L.latLngBounds(allPoints);

          map.fitBounds(bounds, {
            padding: [45, 45],
            maxZoom: 15,
            animate: true,
          });

          return;
        }
      }

      /*
       * No nearby markers.
       * Just show user's location.
       */

      map.flyTo(
        [userLocation.lat, userLocation.lng],
        14,
        {
          duration: 1.2,
        }
      );

      return;
    }

    /*
     * Fallback to supplied center.
     */

    if (
      Array.isArray(center) &&
      center.length === 2 &&
      typeof center[0] === "number" &&
      typeof center[1] === "number"
    ) {
      map.setView(center, 13);
    }
  }, [
    center,
    userLocation,
    markers,
    map,
  ]);

  return null;
};

/* =========================================================
   MAP COMPONENT
========================================================= */

const Map = ({
  center = [28.6139, 77.209],
  zoom = 13,
  markers = [],
  userLocation = null,
  height = "400px",
}) => {
  /*
   * Safety check:
   * Only use valid markers.
   */

  const validMarkers = Array.isArray(markers)
    ? markers.filter(
        (marker) =>
          marker &&
          Array.isArray(marker.position) &&
          marker.position.length === 2 &&
          typeof marker.position[0] === "number" &&
          typeof marker.position[1] === "number"
      )
    : [];

  return (
    <div
      style={{
        borderRadius: "var(--radius, 16px)",
        overflow: "hidden",
        height,
        width: "100%",
        position: "relative",
        background: "#e2e8f0",
      }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        {/* =================================================
            OPENSTREETMAP
        ================================================= */}

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* =================================================
            MAP VIEW CONTROLLER
        ================================================= */}

        <MapViewController
          center={center}
          userLocation={userLocation}
          markers={validMarkers}
        />

        {/* =================================================
            USER LOCATION
        ================================================= */}

        {userLocation &&
          typeof userLocation.lat === "number" &&
          typeof userLocation.lng === "number" && (
            <>
              <Marker
                position={[
                  userLocation.lat,
                  userLocation.lng,
                ]}
                icon={userIcon}
                zIndexOffset={1000}
              >
                <Popup>
                  <div
                    style={{
                      minWidth: "180px",
                      textAlign: "center",
                      fontFamily:
                        "Arial, sans-serif",
                    }}
                  >
                    <strong
                      style={{
                        fontSize: "15px",
                      }}
                    >
                      📍 You are here
                    </strong>

                    <br />

                    <span
                      style={{
                        color: "#64748b",
                        fontSize: "12px",
                      }}
                    >
                      Your current GPS location
                    </span>

                    <br />

                    <span
                      style={{
                        color: "#475569",
                        fontSize: "11px",
                      }}
                    >
                      {userLocation.lat.toFixed(
                        5
                      )}
                      ,{" "}
                      {userLocation.lng.toFixed(
                        5
                      )}
                    </span>
                  </div>
                </Popup>
              </Marker>

              {/* GPS AREA */}

              <Circle
                center={[
                  userLocation.lat,
                  userLocation.lng,
                ]}
                radius={100}
                pathOptions={{
                  fillColor: "#2563eb",
                  fillOpacity: 0.08,
                  color: "#2563eb",
                  opacity: 0.25,
                  weight: 1,
                }}
              />
            </>
          )}

        {/* =================================================
            NEARBY PLACE MARKERS
        ================================================= */}

        {validMarkers.map(
          (marker, index) => (
            <Marker
              key={
                marker.id ||
                marker._id ||
                `nearby-place-${index}`
              }
              position={marker.position}
              icon={
                marker.icon || defaultIcon
              }
            >
              {marker.popup && (
                <Popup>
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        marker.popup,
                    }}
                  />
                </Popup>
              )}
            </Marker>
          )
        )}
      </MapContainer>

      {/* =================================================
          MAP INFORMATION
      ================================================= */}

      {userLocation && (
        <div
          style={{
            position: "absolute",
            bottom: "14px",
            left: "14px",
            zIndex: 1000,
            background:
              "rgba(255,255,255,0.96)",
            padding: "9px 12px",
            borderRadius: "10px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.15)",
            fontSize: "12px",
            fontWeight: 700,
            color: "#334155",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "9px",
              height: "9px",
              borderRadius: "50%",
              background: "#2563eb",
              marginRight: "7px",
            }}
          />

          Your Location
        </div>
      )}

      {/* =================================================
          PLACE COUNT
      ================================================= */}

      {validMarkers.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: "14px",
            right: "14px",
            zIndex: 1000,
            background:
              "rgba(255,255,255,0.96)",
            padding: "8px 12px",
            borderRadius: "10px",
            boxShadow:
              "0 4px 15px rgba(0,0,0,0.15)",
            fontSize: "12px",
            fontWeight: 800,
            color: "#334155",
          }}
        >
          📍 {validMarkers.length} places
        </div>
      )}

      {/* =================================================
          NO PLACES INDICATOR
      ================================================= */}

      {userLocation &&
        validMarkers.length === 0 && (
          <div
            style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              zIndex: 1000,
              background:
                "rgba(255,255,255,0.96)",
              padding: "8px 12px",
              borderRadius: "10px",
              boxShadow:
                "0 4px 15px rgba(0,0,0,0.15)",
              fontSize: "12px",
              fontWeight: 700,
              color: "#64748b",
            }}
          >
            🔎 Searching nearby places...
          </div>
        )}
    </div>
  );
};

/* =========================================================
   MAP MARKER CSS
========================================================= */

const MapStyles = () => (
  <style>
    {`
      .shaktishield-user-marker {
        background: transparent !important;
        border: none !important;
      }

      .user-location-marker {
        position: relative;
        width: 30px;
        height: 30px;

        display: flex;
        align-items: center;
        justify-content: center;
      }

      .user-location-pulse {
        position: absolute;

        width: 30px;
        height: 30px;

        border-radius: 50%;

        background:
          rgba(37, 99, 235, 0.22);

        animation:
          shaktiLocationPulse 1.8s infinite;
      }

      .user-location-dot {
        position: relative;

        width: 14px;
        height: 14px;

        border-radius: 50%;

        background: #2563eb;

        border: 3px solid white;

        box-shadow:
          0 2px 8px
          rgba(0, 0, 0, 0.3);

        z-index: 2;
      }

      @keyframes shaktiLocationPulse {

        0% {
          transform: scale(0.7);
          opacity: 0.8;
        }

        70% {
          transform: scale(1.5);
          opacity: 0;
        }

        100% {
          transform: scale(1.5);
          opacity: 0;
        }

      }

      .leaflet-popup-content {
        margin: 12px 14px;
      }

      .leaflet-popup-content-wrapper {
        border-radius: 12px;
      }

      .leaflet-container {
        font-family:
          Arial,
          sans-serif;
      }
    `}
  </style>
);

/* =========================================================
   FINAL EXPORT
========================================================= */

const MapWithStyles = (props) => {
  return (
    <>
      <Map {...props} />
      <MapStyles />
    </>
  );
};

export default MapWithStyles;