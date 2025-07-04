import React, { useEffect, useState } from "react";
import api from "../api/api";
import './Dashboard.css';

const DriverDashboard = () => {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all ride offers + their requests
  const fetchOffers = async () => {
    try {
      const res = await api.get("/rides/my-offers");
      setRides(res.data);
    } catch (err) {
      console.error("Failed to fetch offers:", err);
      setError("Unable to load your rides. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // Accept or reject ride request
  const handleRequestAction = async (requestId, action) => {
    try {
      await api.put(`/ride-requests/${requestId}`, { status: action });
      await fetchOffers(); // Refresh dashboard
    } catch (err) {
      console.error(`Failed to ${action} request:`, err);
      alert(`Failed to ${action} the request. Try again.`);
    }
  };

  if (loading) return <p>Loading your dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Delete ride
  const deleteRide = async (rideId) => {
    if (!window.confirm("Are you sure you want to delete this ride?")) return;
  
    try {
      await api.delete(`/rides/${rideId}`);
      alert("Ride deleted.");
      fetchOffers(); // Refresh the list
    } catch (err) {
      console.error("❌ Failed to delete ride:", err);
      alert("Failed to delete the ride.");
    }
  };
  

  return (
    <div className="dashboard-container">
      <h2>Driver Dashboard</h2>
      <div className="req-container">
        {rides.length === 0 ? (
          <p>You haven't offered any rides yet.</p>
        ) : (
          rides.map((ride) => (
            <div
              key={ride.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1.5rem",
              }}
            >
              <h3>
                {ride.origin} ➜ {ride.destination}
                <button
                  style={{ marginLeft: "1rem", color: "red" }}
                  onClick={() => deleteRide(ride.id)}
                >
                  Delete Ride
                </button>
              </h3>
              <p>
                <strong>Departure:</strong>{new Date(ride.departure_time).toLocaleString(undefined, {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true
                })} <br />
                {/* {new Date(ride.departure_time).toLocaleString()} <br /> */}
                <strong>Available Seats:</strong> {ride.available_seats}
              </p>

              <h4>Passenger Requests:</h4>

              {ride.requests?.length === 0 ? (
                <p>No requests for this ride yet.</p>
              ) : (
                ride.requests.map((req) => (
                  <div
                    key={req.id}
                    style={{
                      backgroundColor: "#f9f9f9",
                      padding: "0.75rem",
                      borderRadius: "6px",
                      marginBottom: "0.75rem",
                    }}
                  >
                    <p>
                      <strong>Passenger:</strong> {req.passenger_name} <br />
                      <strong>Status:</strong> {req.status}
                    </p>

                    {req.status === "pending" && (
                      <div>
                        <button
                          onClick={() => handleRequestAction(req.id, "accepted")}
                          style={{ marginRight: "0.5rem" }}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRequestAction(req.id, "rejected")}
                          style={{ color: "red" }}
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          ))
        )}        
      </div>

    </div>
  );
};

export default DriverDashboard;