import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import api from "../api/api";
import LoadingScreen from "../components/LoadingScreen";
import "./RideDetails.css";
import Swal from "sweetalert2";

export default function RideDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [ride, setRide] = useState(null);

  useEffect(() => {
    const fetchRide = async () => {
      try {
        const res = await api.get(`/rides/${id}`);
        if (!res.data) {
          console.log("Ride not found");
        } else {
          setRide(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch ride", err);
      }
    };
    fetchRide();
  }, [id]);

  const requestJoin = async () => {
    await api.post(`/rides/${id}/request`);
    Swal.fire({
      title: "Request sent!",
      customClass: {
        popup: "swal-popup",
        title: "swal-title",
      },
      confirmButtonText: "Ok",
      confirmButtonColor: "#292727",
      background: "#cccccc",
      color: "#252525",
    });
    // alert("Request sent");
  };

  return ride ? (
    <div className="container">
      <h2>Going to: {ride.destination}</h2>
      <p>
        <strong>Driver Name:</strong> {ride.driver_name}
      </p>
      <p>
        <strong>Departure Time:</strong>{" "}
        {new Date(ride.departure_time).toLocaleString("en-US")}
      </p>
      <p>
        <strong>Available Seats:</strong> {ride.available_seats}
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
          {user.id === ride.driver_id && (
            <p>You are the driver of this vehicle</p>
          )}
          {user.id !== ride.driver_id && (
            <button onClick={requestJoin}>Request to Join</button>
          )}
        </>
      ) : (
        <>
          <p>Login to request for this ride</p>
          {/* <button style={{ textDecoration: "none", color: "red" }}><Link to="/login" >Login</Link></button> */}
        </>
      )}
    </div>
  ) : (
    <div className="loading">
      <LoadingScreen text="Loading ride details..." />
    </div>
  );
}
