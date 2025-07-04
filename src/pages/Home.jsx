import { useEffect, useState } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";
import './Home.css';

export default function Home() {
  const [rides, setRides] = useState([]);

  useEffect(() => {
    const fetchRides = async () => {
      const res = await api.get("/rides");
      setRides(res.data);
    };
    fetchRides();
  }, []);

  return (
    <div className="home-container">
      <h2>Available Rides</h2>
      <div className="details-container">
        {rides.map((ride) => (
          <div key={ride.id} className="ride">
            <p>From {ride.origin} - Going to {ride.destination}</p>
            <p>
              {/* <strong>Departure:</strong> {new Date(ride.departure_time).toLocaleString()} */}
              <strong>Departure:</strong> {new Date(ride.departure_time).toLocaleString(undefined, {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true
                })} <br />
            </p>
            <p>{ride.car_type}</p>
            <img src={ride.car_type === "Bus" ? "/images/busPicx.png" : "/images/carPicx.png"} alt={ride.car_type} width={100} /><br />
            <Link to={`/rides/${ride.id}`} className="link">More Ride Details -- </Link>
          </div>
        ))}        
      </div>
    </div>
  );
}