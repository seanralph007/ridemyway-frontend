import { useState } from "react";
import Swal from 'sweetalert2';
import api from "../api/api";
import { useNavigate } from "react-router-dom";
import './CreateRide.css';
// import Select from 'react-select'

export default function CreateRide() {
  const [ride, setRide] = useState({ origin: "", destination: "", departure_time: "", car_type: "", available_seats: 0 });
  const navigate = useNavigate();

  const handleChange = (e) => setRide({ ...ride, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    })
    navigate("/");
  };

  // const options = [
  //   {value: 'driver', label: 'Bus'},
  //   {value: 'passenger', label: 'Car'}
  // ]

  return (
    <form className="create-ride-container" onSubmit={handleSubmit}>
      <h2>Create Ride</h2>
      <select className="carType" name="car_type" value={ride.car_type} onChange={handleChange}>
        <option value="">Select Car type</option>
        <option value="car">Car</option>
        <option value="bus">Bus</option>
      </select>
      {/* <select name="car_type" value={ride.car_type} onChange={handleChange} className="carType">
        <option value="bus">Bus</option>
        <option value="car">Car</option>
      </select> */}
      {/* <Select className='carType' options={options} placeholder='Choose car type ...' value={ride.carType} /> */}
      <input name="origin" value={ride.origin} onChange={handleChange} placeholder="Origin" className="input"/>
      <input name="destination" value={ride.destination} onChange={handleChange} placeholder="Destination" className="input"/>
      <label>Departure Date & Time:</label>
      <input
        className="input"
        type="datetime-local"
        name="departure_time"
        value={ride.departure_time}
        onChange={handleChange}
      />

      <input name="available_seats" value={ride.available_seats} onChange={handleChange} placeholder="Number of available seats" />
      <button type="submit">Post Ride</button>
    </form>
  );
}
