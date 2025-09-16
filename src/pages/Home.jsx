// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { getRidesBounds, calculateDistance } from "../utils/mapUtils";
import "./Home.css";

import "leaflet/dist/leaflet.css";

// Fix default Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// 🔹 Auto-fit component
function FitBounds({ rides }) {
  const map = useMap();
  useEffect(() => {
    const bounds = getRidesBounds(rides);
    if (bounds) map.fitBounds(bounds, { padding: [50, 50] });
  }, [rides, map]);
  return null;
}

export default function Home() {
  const [rides, setRides] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const res = await api.get("/rides");
      setRides(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch rides:", err);
    }
  };

  // Filter rides by destination search
  const filteredRides = rides.filter((ride) =>
    ride.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="home-container">
      <h2>Find a Ride</h2>

      {/* Search bar */}
      <input
        type="text"
        className="search-bar"
        placeholder="Where to go?"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Map */}
      <MapContainer
        center={[6.4474, 7.5139]}
        zoom={7}
        style={{ height: "400px", width: "100%", marginTop: "1rem" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <FitBounds rides={filteredRides} />

        {filteredRides.map((ride) => {
          const origin = [ride.origin_lat, ride.origin_lng];
          const destination = [ride.destination_lat, ride.destination_lng];

          return (
            <div key={ride.id}>
              {/* Origin */}
              {ride.origin_lat && ride.origin_lng && (
                <Marker position={origin}>
                  <Popup>
                    <b>{ride.origin}</b> → {ride.destination}
                    <br />
                    {ride.car_type} | {ride.available_seats} seats
                  </Popup>
                </Marker>
              )}
              {/* Destination */}
              {ride.destination_lat && ride.destination_lng && (
                <Marker position={destination}>
                  <Popup>
                    <b>{ride.destination}</b>
                  </Popup>
                </Marker>
              )}
              {/* Line */}
              {ride.origin_lat &&
                ride.origin_lng &&
                ride.destination_lat &&
                ride.destination_lng && (
                  <Polyline
                    positions={[origin, destination]}
                    pathOptions={{ color: "blue", weight: 4 }}
                  />
                )}
            </div>
          );
        })}
      </MapContainer>

      {/* Ride list */}
      <h3>Available Rides</h3>
      <div className="ride-list">
        {filteredRides.length > 0 ? (
          filteredRides.map((ride) => {
            let distance = null;
            if (
              ride.origin_lat &&
              ride.origin_lng &&
              ride.destination_lat &&
              ride.destination_lng
            ) {
              distance = calculateDistance(
                ride.origin_lat,
                ride.origin_lng,
                ride.destination_lat,
                ride.destination_lng
              );
            }

            return (
              <div key={ride.id} className="ride-card">
                <h4>
                  {ride.origin} → {ride.destination}
                </h4>
                <p>
                  Departure:{" "}
                  {new Date(ride.departure_time).toLocaleString(undefined, {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </p>
                {distance && <p>Distance: {distance.toFixed(1)} km</p>}
                <img
                  src={
                    ride.car_type === "bus"
                      ? "/images/busPicx.png"
                      : "/images/carPicx.png"
                  }
                  alt={ride.car_type}
                  width={100}
                />
                <p>{ride.available_seats} seats available</p>
                <br />
                <Link to={`/rides/${ride.id}`} className="link">
                  More Ride Details →
                </Link>
              </div>
            );
          })
        ) : (
          <p className="loading">No rides currently available.</p>
        )}
      </div>
    </div>
  );
}
