// src/utils/mapUtils.js
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

// Geocode dummy function (replace with API later)
export const geocodeAddress = async (address) => {
  return { lat: 6.5244, lon: 3.3792 }; // Lagos as fallback
};

// 🔹 Fit map bounds to all rides
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
