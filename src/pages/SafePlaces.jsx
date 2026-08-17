import { useCallback, useEffect, useMemo, useState } from "react";
import Map from "../components/Map";

/* =========================================================
   OPENSTREETMAP
========================================================= */

const OVERPASS_URL =
  "https://overpass-api.de/api/interpreter";

const SEARCH_RADIUS = 10000;

/* =========================================================
   CATEGORY CONFIG
========================================================= */

const typeConfig = {
  all: {
    icon: "🌎",
    label: "All Nearby",
  },

  police: {
    icon: "🚔",
    label: "Police",
  },

  hospital: {
    icon: "🏥",
    label: "Hospital",
  },

  pharmacy: {
    icon: "💊",
    label: "Pharmacy",
  },

  mall: {
    icon: "🛍️",
    label: "Shopping Mall",
  },

  supermarket: {
    icon: "🛒",
    label: "Supermarket",
  },

  hotel: {
    icon: "🏨",
    label: "Hotel",
  },

  restaurant: {
    icon: "🍽️",
    label: "Restaurant",
  },

  bank: {
    icon: "🏦",
    label: "Bank / ATM",
  },

  school: {
    icon: "🏫",
    label: "School",
  },

  transport: {
    icon: "🚌",
    label: "Transport",
  },

  fuel: {
    icon: "⛽",
    label: "Fuel Station",
  },

  community: {
    icon: "🏛️",
    label: "Community",
  },

  shop: {
    icon: "🏪",
    label: "Shop",
  },

  other: {
    icon: "📍",
    label: "Other",
  },
};

/* =========================================================
   IMPORTANT PATNA POLICE STATIONS

   These are permanent quick-access places.
   Directions use Google Maps search so the user gets
   live routing from their current location.
========================================================= */

const PATNA_POLICE = [
  {
    id: "patna-police-kotwali",
    name: "Kotwali Police Station",
    type: "police",
    area: "Kotwali / Patna Junction Area",
    address: "Kotwali, Patna, Bihar",
    phone: "",
  },

  {
    id: "patna-police-gandhi-maidan",
    name: "Gandhi Maidan Police Station",
    type: "police",
    area: "Gandhi Maidan",
    address:
      "Udyog Bhawan, E Gandhi Maidan Road, Patna, Bihar 800004",
    phone: "06122673519",
  },

  {
    id: "patna-police-kadamkuan",
    name: "Kadamkuan Police Station",
    type: "police",
    area: "Kadamkuan / Rajendra Nagar",
    address:
      "Rajendra Nagar, Patna, Bihar 800016",
    phone: "",
  },

  {
    id: "patna-police-kankarbagh",
    name: "Kankarbagh Police Station",
    type: "police",
    area: "Kankarbagh",
    address:
      "Malahi Pakdi Road, Housing Board Colony, Kankarbagh, Patna 800020",
    phone: "06122352563",
  },

  {
    id: "patna-police-jakkanpur",
    name: "Jakkanpur Police Station",
    type: "police",
    area: "Mithapur",
    address:
      "Mithapur Road, Mithapur, Patna, Bihar 800001",
    phone: "06122349999",
  },

  {
    id: "patna-police-gardanibagh",
    name: "Gardanibagh Police Station",
    type: "police",
    area: "Gardanibagh",
    address:
      "Khagaul Road, Gardanibagh, Patna, Bihar 800001",
    phone: "09431822162",
  },

  {
    id: "patna-police-patliputra",
    name: "Patliputra Police Station",
    type: "police",
    area: "Patliputra Colony",
    address:
      "North Sri Krishna Puri, Patna, Bihar 800013",
    phone: "09431822157",
  },

  {
    id: "patna-police-shastrinagar",
    name: "Shastri Nagar Police Station",
    type: "police",
    area: "Shastri Nagar",
    address:
      "Shastri Nagar Road, Rajbansi Nagar, Patna, Bihar",
    phone: "09431822121",
  },

  {
    id: "patna-police-sachivalaya",
    name: "Sachivalaya Police Station",
    type: "police",
    area: "R-Block / Sachivalaya",
    address:
      "Mangles Road, near Satmurti Statue, Sachivalaya, Patna",
    phone: "09431822161",
  },

  {
    id: "patna-police-city-chowk",
    name: "Patna City Chowk Police Station",
    type: "police",
    area: "Patna City",
    address:
      "Haji Ganj Road, Jhauganj, Hajiganj, Patna 800008",
    phone: "06122641831",
  },
];

/* =========================================================
   IMPORTANT PATNA HOSPITALS

   Major government + private hospitals.
========================================================= */

const PATNA_HOSPITALS = [
  {
    id: "patna-hospital-pmch",
    name: "Patna Medical College & Hospital (PMCH)",
    type: "hospital",
    area: "Ashok Rajpath",
    address:
      "Ashok Rajpath, Patna, Bihar 800004",
    phone: "06122300132",
  },

  {
    id: "patna-hospital-nmch",
    name: "Nalanda Medical College & Hospital (NMCH)",
    type: "hospital",
    area: "Agam Kuan",
    address:
      "Agam Kuan, Patna, Bihar 800007",
    phone: "06122918523",
  },

  {
    id: "patna-hospital-igims",
    name: "Indira Gandhi Institute of Medical Sciences (IGIMS)",
    type: "hospital",
    area: "Sheikhpura",
    address:
      "Sheikhpura, Patna, Bihar 800014",
    phone: "06122297631",
  },

  {
    id: "patna-hospital-aiims",
    name: "AIIMS Patna",
    type: "hospital",
    area: "Phulwari Sharif",
    address:
      "Phulwari Sharif, Patna, Bihar 801507",
    phone: "06122451070",
  },

  {
    id: "patna-hospital-paras",
    name: "Paras HMRI Hospital",
    type: "hospital",
    area: "Raja Bazar / Bailey Road",
    address:
      "NH 30, Bailey Road, Raja Bazar, Patna, Bihar 800014",
    phone: "06127107700",
  },

  {
    id: "patna-hospital-jay-prabha",
    name: "Jay Prabha Medanta Super Specialty Hospital",
    type: "hospital",
    area: "Kankarbagh",
    address:
      "Housing Board Colony, Kankarbagh, Patna, Bihar 800020",
    phone: "06123505050",
  },

  {
    id: "patna-hospital-apollo",
    name: "BIG Apollo Spectra Hospitals",
    type: "hospital",
    area: "Agam Kuan",
    address:
      "Sheetla Mandir Road, Agam Kuan, Patna, Bihar 800030",
    phone: "06123540100",
  },

  {
    id: "patna-hospital-asian-city",
    name: "Asian City Hospital",
    type: "hospital",
    area: "Patliputra Colony",
    address:
      "Patliputra Industrial Area, Patliputra Colony, Patna 800013",
    phone: "09696396896",
  },

  {
    id: "patna-hospital-ford",
    name: "Ford Hospital & Research Center",
    type: "hospital",
    area: "Khemnichak",
    address:
      "New Bypass, NH-30, Khemnichak, Patna, Bihar 800030",
    phone: "09798215884",
  },

  {
    id: "patna-hospital-kurji",
    name: "Kurji Holy Family Hospital",
    type: "hospital",
    area: "Kurji",
    address:
      "Kurji, Patna, Bihar",
    phone: "06122262540",
  },

  {
    id: "patna-hospital-mahavir",
    name: "Mahavir Cancer Institute",
    type: "hospital",
    area: "Phulwari Sharif",
    address:
      "Phulwari Sharif, Patna, Bihar",
    phone: "06122250127",
  },

  {
    id: "patna-hospital-ruban",
    name: "Ruban Memorial Hospital",
    type: "hospital",
    area: "Patliputra Colony",
    address:
      "Patliputra Colony, Patna, Bihar",
    phone: "",
  },
];

/* =========================================================
   ALL FIXED PATNA PLACES
========================================================= */

const PATNA_EMERGENCY_PLACES = [
  ...PATNA_POLICE,
  ...PATNA_HOSPITALS,
];

/* =========================================================
   DISTANCE
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
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
};

/* =========================================================
   DISTANCE FORMAT
========================================================= */

const formatDistance = (distance) => {
  if (
    distance === null ||
    distance === undefined
  ) {
    return "Distance unavailable";
  }

  if (distance < 1) {
    return `${Math.round(distance * 1000)} m away`;
  }

  return `${distance.toFixed(1)} km away`;
};

/* =========================================================
   OSM CATEGORY
========================================================= */

const getPlaceType = (tags) => {
  if (tags.amenity === "police") {
    return "police";
  }

  if (
    tags.amenity === "hospital" ||
    tags.healthcare === "hospital" ||
    tags.amenity === "clinic" ||
    tags.healthcare === "clinic"
  ) {
    return "hospital";
  }

  if (
    tags.amenity === "pharmacy" ||
    tags.healthcare === "pharmacy"
  ) {
    return "pharmacy";
  }

  if (tags.shop === "mall") {
    return "mall";
  }

  if (tags.shop === "supermarket") {
    return "supermarket";
  }

  if (
    tags.tourism === "hotel" ||
    tags.tourism === "motel" ||
    tags.tourism === "guest_house" ||
    tags.tourism === "hostel"
  ) {
    return "hotel";
  }

  if (
    tags.amenity === "restaurant" ||
    tags.amenity === "fast_food" ||
    tags.amenity === "cafe"
  ) {
    return "restaurant";
  }

  if (
    tags.amenity === "bank" ||
    tags.amenity === "atm"
  ) {
    return "bank";
  }

  if (
    tags.amenity === "school" ||
    tags.amenity === "college" ||
    tags.amenity === "university"
  ) {
    return "school";
  }

  if (
    tags.public_transport ||
    tags.highway === "bus_stop" ||
    tags.railway === "station" ||
    tags.railway === "halt" ||
    tags.amenity === "bus_station"
  ) {
    return "transport";
  }

  if (tags.amenity === "fuel") {
    return "fuel";
  }

  if (
    tags.amenity === "community_centre" ||
    tags.amenity === "social_centre" ||
    tags.amenity === "social_facility" ||
    tags.amenity === "shelter"
  ) {
    return "community";
  }

  if (tags.shop) {
    return "shop";
  }

  return "other";
};

/* =========================================================
   ADDRESS
========================================================= */

const getAddress = (tags) => {
  const parts = [
    tags["addr:housenumber"],
    tags["addr:street"],
    tags["addr:suburb"],
    tags["addr:neighbourhood"],
    tags["addr:city"],
    tags["addr:state"],
  ].filter(Boolean);

  if (parts.length > 0) {
    return parts.join(", ");
  }

  return (
    tags["addr:full"] ||
    "Address not available"
  );
};

/* =========================================================
   CONVERT OSM
========================================================= */

const convertOSMPlace = (element) => {
  const tags = element.tags || {};

  let lat = element.lat;
  let lng = element.lon;

  if (
    (typeof lat !== "number" ||
      typeof lng !== "number") &&
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

  const type = getPlaceType(tags);

  const config =
    typeConfig[type] ||
    typeConfig.other;

  return {
    _id:
      `osm-${element.type}-${element.id}`,

    name:
      tags.name ||
      tags.brand ||
      `${config.label} nearby`,

    type,

    address: getAddress(tags),

    phone:
      tags.phone ||
      tags["contact:phone"] ||
      "",

    website:
      tags.website ||
      tags["contact:website"] ||
      "",

    openingHours:
      tags.opening_hours ||
      "",

    location: {
      coordinates: [
        Number(lng),
        Number(lat),
      ],
    },

    source: "OpenStreetMap",
  };
};

/* =========================================================
   FETCH OSM
========================================================= */

const fetchNearbyPlaces = async (
  lat,
  lng
) => {
  const query = `
    [out:json][timeout:60];

    (
      node["amenity"="police"](around:${SEARCH_RADIUS},${lat},${lng});
      way["amenity"="police"](around:${SEARCH_RADIUS},${lat},${lng});

      node["amenity"="hospital"](around:${SEARCH_RADIUS},${lat},${lng});
      way["amenity"="hospital"](around:${SEARCH_RADIUS},${lat},${lng});

      node["amenity"="clinic"](around:${SEARCH_RADIUS},${lat},${lng});
      way["amenity"="clinic"](around:${SEARCH_RADIUS},${lat},${lng});

      node["amenity"="pharmacy"](around:${SEARCH_RADIUS},${lat},${lng});
      way["amenity"="pharmacy"](around:${SEARCH_RADIUS},${lat},${lng});

      node["shop"="mall"](around:${SEARCH_RADIUS},${lat},${lng});
      way["shop"="mall"](around:${SEARCH_RADIUS},${lat},${lng});

      node["shop"="supermarket"](around:${SEARCH_RADIUS},${lat},${lng});
      way["shop"="supermarket"](around:${SEARCH_RADIUS},${lat},${lng});

      node["tourism"="hotel"](around:${SEARCH_RADIUS},${lat},${lng});
      way["tourism"="hotel"](around:${SEARCH_RADIUS},${lat},${lng});

      node["tourism"="guest_house"](around:${SEARCH_RADIUS},${lat},${lng});
      way["tourism"="guest_house"](around:${SEARCH_RADIUS},${lat},${lng});

      node["tourism"="hostel"](around:${SEARCH_RADIUS},${lat},${lng});
      way["tourism"="hostel"](around:${SEARCH_RADIUS},${lat},${lng});

      node["amenity"="restaurant"](around:${SEARCH_RADIUS},${lat},${lng});
      way["amenity"="restaurant"](around:${SEARCH_RADIUS},${lat},${lng});

      node["amenity"="cafe"](around:${SEARCH_RADIUS},${lat},${lng});
      way["amenity"="cafe"](around:${SEARCH_RADIUS},${lat},${lng});

      node["amenity"="fast_food"](around:${SEARCH_RADIUS},${lat},${lng});
      way["amenity"="fast_food"](around:${SEARCH_RADIUS},${lat},${lng});

      node["amenity"="bank"](around:${SEARCH_RADIUS},${lat},${lng});
      way["amenity"="bank"](around:${SEARCH_RADIUS},${lat},${lng});

      node["amenity"="atm"](around:${SEARCH_RADIUS},${lat},${lng});
      way["amenity"="atm"](around:${SEARCH_RADIUS},${lat},${lng});

      node["amenity"="school"](around:${SEARCH_RADIUS},${lat},${lng});
      way["amenity"="school"](around:${SEARCH_RADIUS},${lat},${lng});

      node["amenity"="college"](around:${SEARCH_RADIUS},${lat},${lng});
      way["amenity"="college"](around:${SEARCH_RADIUS},${lat},${lng});

      node["amenity"="university"](around:${SEARCH_RADIUS},${lat},${lng});
      way["amenity"="university"](around:${SEARCH_RADIUS},${lat},${lng});

      node["highway"="bus_stop"](around:${SEARCH_RADIUS},${lat},${lng});
      node["amenity"="bus_station"](around:${SEARCH_RADIUS},${lat},${lng});
      way["amenity"="bus_station"](around:${SEARCH_RADIUS},${lat},${lng});

      node["railway"="station"](around:${SEARCH_RADIUS},${lat},${lng});
      way["railway"="station"](around:${SEARCH_RADIUS},${lat},${lng});

      node["railway"="halt"](around:${SEARCH_RADIUS},${lat},${lng});

      node["amenity"="fuel"](around:${SEARCH_RADIUS},${lat},${lng});
      way["amenity"="fuel"](around:${SEARCH_RADIUS},${lat},${lng});

      node["amenity"="community_centre"](around:${SEARCH_RADIUS},${lat},${lng});
      way["amenity"="community_centre"](around:${SEARCH_RADIUS},${lat},${lng});

      node["amenity"="social_centre"](around:${SEARCH_RADIUS},${lat},${lng});
      way["amenity"="social_centre"](around:${SEARCH_RADIUS},${lat},${lng});

      node["amenity"="shelter"](around:${SEARCH_RADIUS},${lat},${lng});
      way["amenity"="shelter"](around:${SEARCH_RADIUS},${lat},${lng});

      node["shop"](around:${SEARCH_RADIUS},${lat},${lng});
      way["shop"](around:${SEARCH_RADIUS},${lat},${lng});
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
      `OpenStreetMap returned error ${response.status}.`
    );
  }

  const data =
    await response.json();

  return Array.from(
    new Map(
      (data.elements || [])
        .map(convertOSMPlace)
        .filter(Boolean)
        .map((place) => [
          place._id,
          place,
        ])
    ).values()
  );
};

/* =========================================================
   GOOGLE MAPS DIRECTIONS
========================================================= */

const getDirectionsUrl = (
  place
) => {
  const destination = encodeURIComponent(
    `${place.name}, ${place.address}, Patna, Bihar, India`
  );

  return (
    `https://www.google.com/maps/dir/?api=1` +
    `&destination=${destination}` +
    `&travelmode=driving`
  );
};

/* =========================================================
   SAFE PLACES
========================================================= */

const SafePlaces = () => {
  const [places, setPlaces] =
    useState([]);

  const [userLocation, setUserLocation] =
    useState(null);

  const [center, setCenter] =
    useState(null);

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

  const [search, setSearch] =
    useState("");

  const [selectedType, setSelectedType] =
    useState("all");

  /* =======================================================
     LOAD LIVE PLACES
  ======================================================= */

  const loadPlaces =
    useCallback(
      async (
        lat,
        lng,
        refresh = false
      ) => {
        try {
          setError("");

          if (refresh) {
            setRefreshing(true);
          } else {
            setLoading(true);
          }

          const result =
            await fetchNearbyPlaces(
              lat,
              lng
            );

          const withDistance =
            result
              .map((place) => {
                const [
                  placeLng,
                  placeLat,
                ] =
                  place.location
                    ?.coordinates || [];

                if (
                  typeof placeLat !==
                    "number" ||
                  typeof placeLng !==
                    "number"
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
            withDistance
          );
        } catch (err) {
          console.error(
            "Nearby places error:",
            err
          );

          setPlaces([]);

          setError(
            err.message ||
              "Unable to load nearby places."
          );
        } finally {
          setLoading(false);
          setRefreshing(false);
        }
      },
      []
    );

  /* =======================================================
     LOCATION
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
          "Your browser does not support location services."
        );

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

          try {
            await loadPlaces(
              lat,
              lng
            );
          } finally {
            setLocationLoading(false);
          }
        },

        (geoError) => {
          console.error(
            "GPS error:",
            geoError
          );

          setLocationLoading(false);
          setLoading(false);

          if (
            geoError.code ===
            geoError.PERMISSION_DENIED
          ) {
            setLocationError(
              "Location permission was denied. Please allow location access and try again."
            );
          } else if (
            geoError.code ===
            geoError.POSITION_UNAVAILABLE
          ) {
            setLocationError(
              "Your current location could not be determined."
            );
          } else if (
            geoError.code ===
            geoError.TIMEOUT
          ) {
            setLocationError(
              "Location request timed out. Please try again."
            );
          } else {
            setLocationError(
              "Unable to determine your current location."
            );
          }
        },

        {
          enableHighAccuracy: true,
          timeout: 20000,
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
     FILTER LIVE PLACES
  ======================================================= */

  const processedPlaces =
    useMemo(() => {
      const searchValue =
        search
          .toLowerCase()
          .trim();

      return places
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
    ]);

  /* =======================================================
     FIXED PATNA PLACES FILTER
  ======================================================= */

  const patnaPlaces =
    useMemo(() => {
      const searchValue =
        search
          .toLowerCase()
          .trim();

      return PATNA_EMERGENCY_PLACES.filter(
        (place) => {
          const matchesSearch =
            !searchValue ||
            place.name
              .toLowerCase()
              .includes(searchValue) ||
            place.address
              .toLowerCase()
              .includes(searchValue) ||
            place.area
              .toLowerCase()
              .includes(searchValue);

          const matchesType =
            selectedType === "all" ||
            selectedType ===
              place.type;

          return (
            matchesSearch &&
            matchesType
          );
        }
      );
    }, [
      search,
      selectedType,
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

        return {
          id: place._id,

          position: [
            lat,
            lng,
          ],

          popup: `
            <div style="
              min-width:220px;
              font-family:Arial,sans-serif;
              line-height:1.5;
            ">

              <strong style="
                font-size:15px;
              ">
                ${config.icon}
                ${place.name}
              </strong>

              <br/>

              <span style="
                color:#64748b;
                font-size:12px;
              ">
                ${config.label}
              </span>

              <br/>

              <span style="
                color:#64748b;
                font-size:12px;
              ">
                📍 ${place.address}
              </span>

              ${
                place.phone
                  ? `<br/>📞 ${place.phone}`
                  : ""
              }

              <br/>

              <strong style="
                color:#2563eb;
              ">
                📍 ${formatDistance(
                  place.distance
                )}
              </strong>

              <br/>

              <small style="
                color:#94a3b8;
              ">
                OpenStreetMap
              </small>

            </div>
          `,
        };
      })
      .filter(Boolean);

  /* =======================================================
     DIRECTIONS
  ======================================================= */

  const handleDirections =
    (place) => {
      const url =
        getDirectionsUrl(place);

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
      if (!phone) return;

      window.location.href =
        `tel:${phone}`;
    };

  /* =======================================================
     EMERGENCY 112
  ======================================================= */

  const handleEmergency =
    () => {
      window.location.href =
        "tel:112";
    };

  /* =======================================================
     REFRESH
  ======================================================= */

  const handleRefresh =
    () => {
      if (userLocation) {
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
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="nearby-page">

        <div className="nearby-loading">

          <div className="nearby-loading-icon">
            📍
          </div>

          <h2>
            Finding Places Near You...
          </h2>

          <p>
            ShaktiShield is finding nearby
            police stations, hospitals,
            pharmacies, shops, hotels,
            restaurants and other public
            places.
          </p>

          <div className="loading-pill">
            <span />
            Using your current GPS location
          </div>

        </div>

      </div>
    );
  }

  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <div className="nearby-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="nearby-header">

        <div>

          <div className="eyebrow">
            📍 SHAKTISHIELD LOCATION NETWORK
          </div>

          <h1>
            Nearby Safe & Emergency Places
          </h1>

          <p>
            Find nearby police stations,
            hospitals and public places around
            your current location. Important
            Patna emergency facilities are also
            available for quick access.
          </p>

        </div>

        <button
          className="emergency-button"
          onClick={handleEmergency}
        >
          🚨 Emergency 112
        </button>

      </div>

      {/* =================================================
          LOCATION
      ================================================= */}

      <div className="location-card">

        <div className="location-left">

          <div className="location-icon">
            📍
          </div>

          <div>

            <strong>
              Your current location
            </strong>

            <p>
              {locationError ||
                "Nearby places are calculated from your current GPS position."}
            </p>

            {userLocation && (
              <div className="coordinates">
                Latitude:{" "}
                {userLocation.lat.toFixed(5)}
                {"   "}
                Longitude:{" "}
                {userLocation.lng.toFixed(5)}
              </div>
            )}

          </div>

        </div>

        <button
          className="location-button"
          onClick={detectLocation}
          disabled={locationLoading}
        >
          {locationLoading
            ? "Locating..."
            : "📍 Use My Location"}
        </button>

      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="controls">

        <div className="search-box">

          <span>🔍</span>

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search police stations, hospitals or nearby places..."
          />

          {search && (
            <button
              onClick={() =>
                setSearch("")
              }
            >
              ✕
            </button>
          )}

        </div>

        <div className="filters">

          {Object.entries(
            typeConfig
          ).map(
            ([type, config]) => (
              <button
                key={type}
                className={
                  selectedType === type
                    ? "filter active"
                    : "filter"
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

      {/* =================================================
          NOTICE
      ================================================= */}

      {(error ||
        locationError) && (
        <div className="notice">

          <div>
            ⚠️
          </div>

          <div>

            <strong>
              Nearby Places Notice
            </strong>

            <p>
              {error ||
                locationError}
            </p>

          </div>

          <button
            onClick={
              handleRefresh
            }
          >
            Try Again
          </button>

        </div>
      )}

      {/* =================================================
          QUICK EMERGENCY ACCESS
      ================================================= */}

      <section className="emergency-section">

        <div className="section-heading">

          <div>

            <h2>
              🚨 Patna Emergency Facilities
            </h2>

            <p>
              Important police stations and
              major hospitals for quick access.
            </p>

          </div>

          <span className="verified-badge">
            Patna
          </span>

        </div>

        {patnaPlaces.length === 0 ? (
          <div className="empty-small">
            No matching Patna emergency
            facilities found.
          </div>
        ) : (
          <div className="places-grid">

            {patnaPlaces.map(
              (place) => {

                const config =
                  typeConfig[
                    place.type
                  ];

                return (
                  <div
                    className="place-card emergency-place"
                    key={
                      place.id
                    }
                  >

                    <div className="place-top">

                      <div className="place-icon">
                        {config.icon}
                      </div>

                      <div>

                        <h3>
                          {place.name}
                        </h3>

                        <span>
                          {config.label}
                        </span>

                      </div>

                    </div>

                    <div className="area">
                      📌 {place.area}
                    </div>

                    <p className="address">
                      📍 {place.address}
                    </p>

                    {place.phone && (
                      <p className="phone">
                        📞 {place.phone}
                      </p>
                    )}

                    <div className="source">
                      🛡️ Patna Emergency Directory
                    </div>

                    <div className="actions">

                      <button
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
                          className="call"
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

      </section>

      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="summary">

        <div className="summary-icon">
          📍
        </div>

        <div>

          <h2>
            Live Places Around You
          </h2>

          <p>
            OpenStreetMap locations within
            10 km of your GPS position.
          </p>

        </div>

        <div className="count">

          <strong>
            {processedPlaces.length}
          </strong>

          <span>
            Nearby
          </span>

        </div>

      </div>

      {/* =================================================
          MAP
      ================================================= */}

      <div className="map-section">

        <div className="section-heading">

          <div>

            <h2>
              🗺️ Nearby Places Map
            </h2>

            <p>
              Live locations around your
              current position.
            </p>

          </div>

          <button
            onClick={
              handleRefresh
            }
            disabled={refreshing}
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
              display nearby places.
            </p>

            <button
              onClick={
                detectLocation
              }
            >
              📍 Detect My Location
            </button>

          </div>
        )}

      </div>

      {/* =================================================
          LIVE PLACES
      ================================================= */}

      <div className="places-section">

        <div className="section-heading">

          <div>

            <h2>
              Nearby Places
            </h2>

            <p>
              Closest live locations are
              shown first.
            </p>

          </div>

        </div>

        {processedPlaces.length === 0 ? (

          <div className="empty">

            <div>
              🔍
            </div>

            <h3>
              No Nearby Places Found
            </h3>

            <p>
              Try changing the category or
              refreshing your location.
            </p>

            <button
              onClick={
                handleRefresh
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
                    className="place-card"
                    key={
                      place._id
                    }
                  >

                    <div className="place-top">

                      <div className="place-icon">
                        {config.icon}
                      </div>

                      <div>

                        <h3>
                          {place.name}
                        </h3>

                        <span>
                          {config.label}
                        </span>

                      </div>

                    </div>

                    <div className="distance">
                      📍{" "}
                      {formatDistance(
                        place.distance
                      )}
                    </div>

                    <p className="address">
                      📍 {place.address}
                    </p>

                    {place.phone && (
                      <p className="phone">
                        📞 {place.phone}
                      </p>
                    )}

                    {place.openingHours && (
                      <p className="hours">
                        🕐{" "}
                        {place.openingHours}
                      </p>
                    )}

                    <div className="source">
                      🗺️ OpenStreetMap
                    </div>

                    <div className="actions">

                      <button
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
                          className="call"
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

      {/* =================================================
          HOW IT WORKS
      ================================================= */}

      <div className="info-card">

        <div className="info-icon">
          🛡️
        </div>

        <div>

          <h3>
            How ShaktiShield Finds Places
          </h3>

          <p>
            ShaktiShield combines live
            OpenStreetMap results with a
            curated Patna emergency directory.
            This means important police
            stations and hospitals remain easy
            to access even when live map data
            is incomplete.
          </p>

          <div className="info-grid">

            <div>
              <strong>1</strong>
              <span>
                📍 GPS Location
              </span>
            </div>

            <div>
              <strong>2</strong>
              <span>
                🔎 Nearby Search
              </span>
            </div>

            <div>
              <strong>3</strong>
              <span>
                📏 Distance
              </span>
            </div>

            <div>
              <strong>4</strong>
              <span>
                🧭 Directions
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* =================================================
          SAFETY NOTICE
      ================================================= */}

      <div className="safety-notice">

        <div className="safety-icon">
          🚨
        </div>

        <div>

          <h3>
            Important Safety Notice
          </h3>

          <p>
            For immediate danger, do not wait
            for the map or nearby-place search.
            Call emergency services immediately.
          </p>

          <button
            className="call-112"
            onClick={
              handleEmergency
            }
          >
            🚨 Call Emergency 112
          </button>

        </div>

      </div>

      {/* =================================================
          CSS
      ================================================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        .nearby-page {
          width: 100%;
          max-width: 1400px;
          margin: auto;
          padding: 24px;
        }

        .nearby-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          margin-bottom: 24px;
        }

        .eyebrow {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.5px;
          color: var(--primary, #7c3aed);
          margin-bottom: 8px;
        }

        .nearby-header h1 {
          margin: 0 0 8px;
          font-size: 34px;
          font-weight: 850;
        }

        .nearby-header p {
          max-width: 780px;
          margin: 0;
          color: var(--text-muted, #64748b);
          line-height: 1.65;
        }

        .emergency-button {
          border: none;
          border-radius: 12px;
          padding: 14px 18px;
          background: #dc2626;
          color: white;
          font-weight: 800;
          cursor: pointer;
          white-space: nowrap;
          box-shadow: 0 8px 20px rgba(220,38,38,.2);
        }

        .emergency-button:hover {
          background: #b91c1c;
          transform: translateY(-1px);
        }

        .location-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          padding: 18px;
          margin-bottom: 18px;
          border-radius: 16px;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
        }

        .location-left {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .location-icon {
          width: 54px;
          height: 54px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          background: #dbeafe;
          font-size: 26px;
        }

        .location-left strong {
          color: #1e3a8a;
          font-size: 16px;
        }

        .location-left p {
          margin: 5px 0;
          color: #64748b;
          font-size: 13px;
        }

        .coordinates {
          font-family: monospace;
          color: #475569;
          font-size: 11px;
        }

        .location-button {
          border: none;
          border-radius: 10px;
          padding: 11px 16px;
          background: #2563eb;
          color: white;
          font-weight: 800;
          cursor: pointer;
        }

        .location-button:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        .controls {
          padding: 16px;
          border-radius: 16px;
          background: white;
          border: 1px solid #e2e8f0;
          margin-bottom: 20px;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 10px;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 11px 13px;
          margin-bottom: 14px;
        }

        .search-box input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 15px;
          background: transparent;
        }

        .search-box button {
          border: none;
          background: transparent;
          cursor: pointer;
        }

        .filters {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .filter {
          border: none;
          border-radius: 10px;
          padding: 9px 12px;
          background: #f1f5f9;
          cursor: pointer;
          font-weight: 700;
        }

        .filter:hover {
          background: #e2e8f0;
        }

        .filter.active {
          background: #7c3aed;
          color: white;
        }

        .notice {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          margin-bottom: 20px;
          border-left: 4px solid #f59e0b;
          border-radius: 10px;
          background: #fffbeb;
        }

        .notice p {
          margin: 4px 0 0;
          color: #78350f;
          font-size: 13px;
        }

        .notice button {
          margin-left: auto;
          border: none;
          border-radius: 8px;
          padding: 9px 13px;
          background: #7c3aed;
          color: white;
          cursor: pointer;
          font-weight: 700;
        }

        .emergency-section {
          margin: 30px 0;
          padding: 20px;
          border-radius: 18px;
          background:
            linear-gradient(
              135deg,
              #fff7ed,
              #ffffff
            );
          border: 1px solid #fed7aa;
        }

        .verified-badge {
          padding: 8px 12px;
          border-radius: 20px;
          background: #fef3c7;
          color: #92400e;
          font-size: 12px;
          font-weight: 800;
        }

        .emergency-place {
          border-color: #fed7aa;
        }

        .emergency-place:hover {
          border-color: #fb923c;
        }

        .area {
          margin-top: 12px;
          padding: 8px 10px;
          border-radius: 8px;
          background: #fff7ed;
          color: #9a3412;
          font-size: 12px;
          font-weight: 700;
        }

        .summary {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px;
          margin: 20px 0;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .summary-icon {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #dbeafe;
          font-size: 25px;
        }

        .summary h2 {
          margin: 0;
          font-size: 20px;
        }

        .summary p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 13px;
        }

        .count {
          margin-left: auto;
          min-width: 75px;
          text-align: center;
          padding: 8px 12px;
          border-radius: 10px;
          background: white;
        }

        .count strong {
          display: block;
          font-size: 20px;
          color: #2563eb;
        }

        .count span {
          font-size: 11px;
          color: #64748b;
        }

        .map-section,
        .places-section {
          margin-top: 30px;
        }

        .section-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 15px;
        }

        .section-heading h2 {
          margin: 0;
          font-size: 22px;
        }

        .section-heading p {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 13px;
        }

        .section-heading button {
          border: none;
          border-radius: 9px;
          padding: 9px 13px;
          background: #f1f5f9;
          cursor: pointer;
          font-weight: 700;
        }

        .section-heading button:hover {
          background: #e2e8f0;
        }

        .map-placeholder {
          min-height: 420px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          border-radius: 16px;
          background: #f8fafc;
        }

        .map-placeholder > div {
          font-size: 50px;
        }

        .map-placeholder p {
          color: #64748b;
        }

        .map-placeholder button {
          border: none;
          border-radius: 10px;
          padding: 11px 15px;
          background: #7c3aed;
          color: white;
          font-weight: 700;
          cursor: pointer;
        }

        .places-grid {
          display: grid;
          grid-template-columns:
            repeat(auto-fit, minmax(290px, 1fr));
          gap: 16px;
        }

        .place-card {
          padding: 18px;
          border-radius: 16px;
          background: white;
          border: 1px solid #e2e8f0;
          transition: .2s;
        }

        .place-card:hover {
          transform: translateY(-3px);
          box-shadow:
            0 12px 30px
            rgba(0,0,0,.08);
        }

        .place-top {
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .place-icon {
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          background: #f1f5f9;
          font-size: 24px;
          flex-shrink: 0;
        }

        .place-top h3 {
          margin: 0;
          font-size: 16px;
          line-height: 1.35;
        }

        .place-top span {
          display: inline-block;
          margin-top: 4px;
          color: #7c3aed;
          font-size: 12px;
          font-weight: 800;
        }

        .distance {
          margin-top: 14px;
          padding: 9px 11px;
          border-radius: 9px;
          background: #eff6ff;
          color: #1d4ed8;
          font-weight: 800;
          font-size: 13px;
        }

        .address,
        .phone,
        .hours {
          color: #64748b;
          font-size: 13px;
          line-height: 1.5;
        }

        .address {
          margin-top: 14px;
        }

        .source {
          margin-top: 12px;
          padding: 7px 9px;
          border-radius: 8px;
          background: #f8fafc;
          color: #64748b;
          font-size: 11px;
          font-weight: 700;
        }

        .actions {
          display: flex;
          gap: 8px;
          margin-top: 14px;
        }

        .actions button {
          flex: 1;
          border: none;
          border-radius: 9px;
          padding: 10px;
          background: #7c3aed;
          color: white;
          cursor: pointer;
          font-weight: 700;
        }

        .actions button:hover {
          opacity: .9;
        }

        .actions .call {
          background: #16a34a;
        }

        .empty {
          padding: 55px 20px;
          text-align: center;
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
        }

        .empty > div {
          font-size: 50px;
        }

        .empty p {
          max-width: 500px;
          margin: 10px auto 20px;
          color: #64748b;
          line-height: 1.5;
        }

        .empty button {
          border: none;
          border-radius: 10px;
          padding: 11px 16px;
          background: #7c3aed;
          color: white;
          font-weight: 700;
          cursor: pointer;
        }

        .empty-small {
          padding: 30px;
          text-align: center;
          color: #64748b;
          background: white;
          border-radius: 12px;
        }

        .info-card,
        .safety-notice {
          display: flex;
          gap: 15px;
          margin-top: 30px;
          padding: 20px;
          border-radius: 16px;
          background: #faf5ff;
          border: 1px solid #ede9fe;
        }

        .info-icon,
        .safety-icon {
          font-size: 28px;
        }

        .info-card h3,
        .safety-notice h3 {
          margin: 0;
        }

        .info-card p,
        .safety-notice p {
          color: #64748b;
          line-height: 1.6;
        }

        .info-grid {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 10px;
          margin-top: 15px;
        }

        .info-grid div {
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 12px;
          border-radius: 10px;
          background: white;
        }

        .info-grid strong {
          width: 25px;
          height: 25px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #7c3aed;
          color: white;
        }

        .info-grid span {
          font-size: 12px;
          font-weight: 700;
        }

        .call-112 {
          border: none;
          border-radius: 10px;
          padding: 11px 16px;
          background: #dc2626;
          color: white;
          font-weight: 800;
          cursor: pointer;
        }

        .nearby-loading {
          min-height: 65vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 20px;
        }

        .nearby-loading-icon {
          width: 75px;
          height: 75px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #dbeafe;
          font-size: 38px;
          animation: pulse 1.5s infinite;
        }

        .nearby-loading p {
          max-width: 600px;
          color: #64748b;
          line-height: 1.6;
        }

        .loading-pill {
          padding: 8px 13px;
          border-radius: 20px;
          background: #eff6ff;
          color: #2563eb;
          font-size: 12px;
          font-weight: 700;
        }

        .loading-pill span {
          display: inline-block;
          width: 8px;
          height: 8px;
          margin-right: 6px;
          border-radius: 50%;
          background: #2563eb;
        }

        @keyframes pulse {
          50% {
            transform: scale(1.08);
          }
        }

        @media (max-width: 768px) {

          .nearby-page {
            padding: 12px;
          }

          .nearby-header {
            flex-direction: column;
          }

          .emergency-button {
            width: 100%;
          }

          .location-card {
            flex-direction: column;
            align-items: stretch;
          }

          .location-button {
            width: 100%;
          }

          .summary {
            flex-wrap: wrap;
          }

          .count {
            margin-left: 0;
          }

          .info-grid {
            grid-template-columns: 1fr 1fr;
          }

        }

        @media (max-width: 480px) {

          .nearby-header h1 {
            font-size: 27px;
          }

          .filters {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .filter {
            width: 100%;
          }

          .places-grid {
            grid-template-columns: 1fr;
          }

          .section-heading {
            align-items: flex-start;
          }

          .actions {
            flex-direction: column;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .notice {
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .notice button {
            margin-left: 0;
          }

        }

      `}</style>

    </div>
  );
};

export default SafePlaces;