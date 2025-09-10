import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { createRide } from "../api/rideService";
import { validateRide } from "../utils/validations";
// import { getCoordinates } from "../utils/mapUtils";
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

  // Handle input changes + fetch lat/lng when origin or destination changes
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setRide((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));

    // if ((name === "origin" || name === "destination") && value.trim()) {
    //   const coords = await getCoordinates(value);
    //   setRide((prev) => ({
    //     ...prev,
    //     [`${name}_lat`]: coords.lat,
    //     [`${name}_lng`]: coords.lng,
    //   }));
    // }
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateRide(ride);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await createRide(ride);
      Swal.fire({
        title: "Success!",
        text: "Ride created successfully.",
        icon: "success",
        confirmButtonColor: "#505050",
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
      {errors.car_type && <p className="error">{errors.car_type}</p>}

      <input
        name="origin"
        value={ride.origin}
        onChange={handleChange}
        placeholder="Origin"
        className="input"
      />
      {errors.origin && <p className="error">{errors.origin}</p>}

      <input
        name="destination"
        value={ride.destination}
        onChange={handleChange}
        placeholder="Destination"
        className="input"
      />
      {errors.destination && <p className="error">{errors.destination}</p>}

      <label>Departure Date & Time:</label>
      <input
        className="input"
        type="datetime-local"
        name="departure_time"
        value={ride.departure_time}
        onChange={handleChange}
      />
      {errors.departure_time && (
        <p className="error">{errors.departure_time}</p>
      )}

      <input
        name="available_seats"
        type="number"
        value={ride.available_seats}
        onChange={handleChange}
        placeholder="Number of available seats"
      />
      {errors.available_seats && (
        <p className="error">{errors.available_seats}</p>
      )}

      <button type="submit">Post Ride</button>
    </form>
  );
}
