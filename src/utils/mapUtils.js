import L from "leaflet";

// Calculate distance between two coordinates (Haversine formula)
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

// Format coordinates into "Lat, Lng"
export const formatCoordinates = (lat, lon) => {
  return `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
};

// Fetch lat/lng for a place using Nominatim API
export const fetchCoordinates = async (place) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        place
      )}`
    );
    const data = await res.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
      };
    }
  } catch (err) {
    console.error("❌ Failed to fetch coordinates:", err);
  }
  return { lat: null, lng: null };
};

// Fit map bounds to all rides
export const getRidesBounds = (rides) => {
  const bounds = L.latLngBounds([]);
  rides.forEach((ride) => {
    if (ride.origin_lat && ride.origin_lng) {
      bounds.extend([ride.origin_lat, ride.origin_lng]);
    }
    if (ride.destination_lat && ride.destination_lng) {
      bounds.extend([ride.destination_lat, ride.destination_lng]);
    }
  });
  return bounds.isValid() ? bounds : null;
};
