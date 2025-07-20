import { useState } from "react";
import Swal from 'sweetalert2';
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import './CreateRide.css';
// import Select from 'react-select'

export default function CreateRide() {
  const [ride, setRide] = useState({
    origin: "",
    destination: "",
    departure_time: "",
    car_type: "",
    available_seats: 0
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setRide({ ...ride, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear field error
  };

  const validateForm = () => {
    const newErrors = {};
    if (!ride.origin.trim()) newErrors.origin = "Origin is required";
    if (!ride.destination.trim()) newErrors.destination = "Destination is required";
    if (!ride.departure_time) newErrors.departure_time = "Departure time is required";
    if (!ride.car_type) newErrors.car_type = "Car type is required";
    if (!ride.available_seats || isNaN(ride.available_seats) || ride.available_seats <= 0) {
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
        title: 'Success!',
        text: 'Ride created successfully.',
        icon: 'success',
        customClass: {
          popup: 'my-swal-popup',
          title: 'my-swal-title',
          content: 'my-swal-content',
          icon: 'my-swal-icon',
        },
        confirmButtonText: 'Ok',
        confirmButtonColor: '#505050',
        background: '#cccccc',
        color: '#252525'
      });
      navigate("/");
    } catch (err) {
      console.error("Failed to create ride:", err);
      Swal.fire("Error", "Could not create ride. Please try again.", "error");
    }
  };

  // const options = [
  //   {value: 'driver', label: 'Bus'},
  //   {value: 'passenger', label: 'Car'}
  // ]

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

      {/* <select name="car_type" value={ride.car_type} onChange={handleChange} className="carType">
        <option value="bus">Bus</option>
        <option value="car">Car</option>
      </select> */}
      {/* <Select className='carType' options={options} placeholder='Choose car type ...' value={ride.carType} /> */}

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
      {errors.destination && <p style={{ color: "red" }}>{errors.destination}</p>}

      <label>Departure Date & Time:</label>
      <input
        className="input"
        type="datetime-local"
        name="departure_time"
        value={ride.departure_time}
        onChange={handleChange}
      />
      {errors.departure_time && <p style={{ color: "red" }}>{errors.departure_time}</p>}

      <input
        name="available_seats"
        type="number"
        value={ride.available_seats}
        onChange={handleChange}
        placeholder="Number of available seats"
      />
      {errors.available_seats && <p style={{ color: "red" }}>{errors.available_seats}</p>}

      <button type="submit">Post Ride</button>
    </form>
  );
}
