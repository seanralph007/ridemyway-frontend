import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getRideById } from "../api/rideService";
import { createRequest } from "../api/requestService";
import { notifySuccess, notifyError } from "../utils/notificationService";
import { calculateDistance } from "../utils/mapUtils";
import LoadingScreen from "../components/LoadingScreen";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Tooltip,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./RideDetails.css";
import { formatDateTime } from "../utils/formatters";

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
  const { user } = useContext(AuthContext);
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
        notifyError("Error", "Ride not found.");
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
      await createRequest(id);
      notifySuccess("Request sent!", "Your ride request was submitted.");
      // navigate(`/rides/${id}`);
    } catch (err) {
      console.error("❌ Failed to request ride:", err);
      notifyError("Error", "Could not request ride. Try again.");
    }
  };

  if (loading) return <LoadingScreen text="Loading ride details..." />;
  if (!ride) return <p className="error">Ride not found.</p>;

  const origin = [ride.origin_lat, ride.origin_lng];
  const destination = [ride.destination_lat, ride.destination_lng];
  const distance = calculateDistance(
    ride.origin_lat,
    ride.origin_lng,
    ride.destination_lat,
    ride.destination_lng
  ).toFixed(1);

  return (
    <div className="container">
      <h2>Going to: {ride.destination}</h2>
      <h3>From: {ride.origin}</h3>
      <p>
        <strong>Driver Name:</strong> {ride.driver_name}
      </p>
      <p>
        <strong>Departure Time:</strong> {formatDateTime(ride.departure_time)}
      </p>
      <p>
        <strong>Available Seats:</strong> {ride.available_seats}
      </p>
      <p>
        <strong>Trip Distance:</strong> {distance} km
      </p>
      <img
        src={
          ride.car_type === "bus"
            ? "/images/busPicx.png"
            : "/images/carPicx.png"
        }
        alt={ride.car_type}
        width={100}
      />
      <br />

      {user ? (
        <>
          {user.id === ride.driver_id ? (
            <p>You are the driver of this vehicle</p>
          ) : (
            <button className="request-btn" onClick={handleRequestRide}>
              Request to Join
            </button>
          )}
        </>
      ) : (
        <p>Login to request for this ride</p>
      )}

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
        >
          <Tooltip sticky>{`${distance} km`}</Tooltip>
        </Polyline>
      </MapContainer>
    </div>
  );
}
