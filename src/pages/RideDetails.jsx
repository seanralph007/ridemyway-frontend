import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getRideById } from "../api/rideService";
import { requestRide } from "../api/requestService";
import LoadingScreen from "../components/LoadingScreen";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./RideDetails.css";

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function RideDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch ride details
  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await getRideById(id);
        setRide(res);
      } catch (err) {
        console.error("❌ Failed to fetch ride:", err);
        Swal.fire("Error", "Ride not found.", "error");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchRide();
  }, [id, navigate]);

  // Request to join ride
  const handleRequestRide = async () => {
    try {
      await requestRide(id);
      Swal.fire("Success!", "Ride request sent successfully.", "success");
      navigate("/passenger-dashboard");
    } catch (err) {
      console.error("❌ Failed to request ride:", err);
      Swal.fire("Error", "Could not request ride. Try again.", "error");
    }
  };

  if (loading) return <LoadingScreen text="Loading ride details..." />;
  if (!ride) return <p className="error">Ride not found.</p>;

  const origin = [ride.origin_lat, ride.origin_lng];
  const destination = [ride.destination_lat, ride.destination_lng];

  return (
    <div className="ride-details-container">
      <h2>
        {ride.origin} ➜ {ride.destination}
      </h2>

      <p>
        <strong>Departure:</strong>{" "}
        {new Date(ride.departure_time).toLocaleString()} <br />
        <strong>Car Type:</strong> {ride.car_type} <br />
        <strong>Seats Available:</strong> {ride.available_seats}
      </p>

      {/* Map */}
      <MapContainer
        center={origin}
        zoom={8}
        style={{ height: "300px", width: "100%", margin: "1rem 0" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Marker position={origin}>
          <Popup>{ride.origin}</Popup>
        </Marker>
        <Marker position={destination}>
          <Popup>{ride.destination}</Popup>
        </Marker>
        <Polyline
          positions={[origin, destination]}
          pathOptions={{ color: "blue" }}
        />
      </MapContainer>

      <button className="request-btn" onClick={handleRequestRide}>
        Request Ride
      </button>
    </div>
  );
}
