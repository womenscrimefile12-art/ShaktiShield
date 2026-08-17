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
   DEFAULT SAFETY-PLACE ICON
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
   MAP CENTER CONTROLLER
   Moves map when user's location changes.
========================================================= */

const MapCenterController = ({
  center,
  userLocation,
}) => {
  const map = useMap();

  useEffect(() => {
    if (
      userLocation &&
      typeof userLocation.lat === "number" &&
      typeof userLocation.lng === "number"
    ) {
      map.flyTo(
        [userLocation.lat, userLocation.lng],
        14,
        {
          duration: 1.2,
        }
      );

      return;
    }

    if (
      Array.isArray(center) &&
      center.length === 2
    ) {
      map.setView(center);
    }
  }, [center, userLocation, map]);

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
  return (
    <div
      style={{
        borderRadius: "var(--radius, 16px)",
        overflow: "hidden",
        height,
        width: "100%",
        position: "relative",
      }}
    >
      <MapContainer
        center={center}
        zoom={zoom}
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
        />

        {/* =================================================
            MOVE MAP TO USER
        ================================================= */}

        <MapCenterController
          center={center}
          userLocation={userLocation}
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
              >
                <Popup>
                  <div
                    style={{
                      minWidth: "180px",
                      textAlign: "center",
                    }}
                  >
                    <strong>
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
                  </div>
                </Popup>
              </Marker>

              {/* Accuracy / location area */}

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
            SAFETY PLACE MARKERS
        ================================================= */}

        {markers.map((marker, index) => (
          <Marker
            key={
              marker.id ||
              marker._id ||
              index
            }
            position={marker.position}
            icon={defaultIcon}
          >
            {marker.popup && (
              <Popup>
                <div
                  dangerouslySetInnerHTML={{
                    __html: marker.popup,
                  }}
                />
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>

      {/* ===================================================
          MAP LEGEND
      =================================================== */}

      {userLocation && (
        <div
          style={{
            position: "absolute",
            bottom: "14px",
            left: "14px",
            zIndex: 1000,
            background: "rgba(255,255,255,0.95)",
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

      {/* ===================================================
          MARKER CSS
      =================================================== */}

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
            background: rgba(37, 99, 235, 0.22);
            animation: shaktiLocationPulse 1.8s infinite;
          }

          .user-location-dot {
            position: relative;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #2563eb;
            border: 3px solid white;
            box-shadow:
              0 2px 8px rgba(0, 0, 0, 0.3);
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
        `}
      </style>
    </div>
  );
};

export default Map;