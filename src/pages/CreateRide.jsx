import { useState } from "react";
import Swal from "sweetalert2";
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import "./CreateRide.css";

export default function CreateRide() {
  const [ride, setRide] = useState({
    origin: "",
    origin_lat: null,
    origin_lng: null,
    destination: "",
    destination_lat: null,
    destination_lng: null,
    departure_time: "",
    car_type: "",
    available_seats: 0,
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // fetch lat/lng for a place
  const fetchCoordinates = async (place) => {
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

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setRide((prev) => ({ ...prev, [name]: value }));
    setErrors({ ...errors, [name]: "" }); // clear field error

    // If origin/destination is updated, also fetch lat/lng
    if (name === "origin" && value.trim()) {
      const coords = await fetchCoordinates(value);
      setRide((prev) => ({
        ...prev,
        origin: value,
        origin_lat: coords.lat,
        origin_lng: coords.lng,
      }));
    }
    if (name === "destination" && value.trim()) {
      const coords = await fetchCoordinates(value);
      setRide((prev) => ({
        ...prev,
        destination: value,
        destination_lat: coords.lat,
        destination_lng: coords.lng,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!ride.origin.trim()) newErrors.origin = "Origin is required";
    if (!ride.destination.trim())
      newErrors.destination = "Destination is required";
    if (!ride.departure_time)
      newErrors.departure_time = "Departure time is required";
    if (!ride.car_type) newErrors.car_type = "Car type is required";
    if (
      !ride.available_seats ||
      isNaN(ride.available_seats) ||
      ride.available_seats <= 0
    ) {
      newErrors.available_seats = "Enter a valid number of available seats";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await api.post("/rides", ride);
      Swal.fire({
        title: "Success!",
        text: "Ride created successfully.",
        icon: "success",
        customClass: {
          popup: "my-swal-popup",
          title: "my-swal-title",
          content: "my-swal-content",
          icon: "my-swal-icon",
        },
        confirmButtonText: "Ok",
        confirmButtonColor: "#505050",
        background: "#cccccc",
        color: "#252525",
      });
      navigate("/");
    } catch (err) {
      console.error("❌ Failed to create ride:", err);
      Swal.fire("Error", "Could not create ride. Please try again.", "error");
    }
  };

  return (
    <form className="create-ride-container" onSubmit={handleSubmit}>
      <h2>Create Ride</h2>

      <select
        className="carType"
        name="car_type"
        value={ride.car_type}
        onChange={handleChange}
      >
        <option value="">Select Car type</option>
        <option value="car">Car</option>
        <option value="bus">Bus</option>
      </select>
      {errors.car_type && <p style={{ color: "red" }}>{errors.car_type}</p>}

      <input
        name="origin"
        value={ride.origin}
        onChange={handleChange}
        placeholder="Origin"
        className="input"
      />
      {errors.origin && <p style={{ color: "red" }}>{errors.origin}</p>}

      <input
        name="destination"
        value={ride.destination}
        onChange={handleChange}
        placeholder="Destination"
        className="input"
      />
      {errors.destination && (
        <p style={{ color: "red" }}>{errors.destination}</p>
      )}

      <label>Departure Date & Time:</label>
      <input
        className="input"
        type="datetime-local"
        name="departure_time"
        value={ride.departure_time}
        onChange={handleChange}
      />
      {errors.departure_time && (
        <p style={{ color: "red" }}>{errors.departure_time}</p>
      )}

      <input
        name="available_seats"
        type="number"
        value={ride.available_seats}
        onChange={handleChange}
        placeholder="Number of available seats"
      />
      {errors.available_seats && (
        <p style={{ color: "red" }}>{errors.available_seats}</p>
      )}

      <button type="submit">Post Ride</button>
    </form>
  );
}
