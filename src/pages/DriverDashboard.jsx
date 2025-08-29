import React, { useEffect, useState } from "react";
import LoadingScreen from "../components/LoadingScreen";
import Swal from "sweetalert2";
import api from "../api/api";
import "./Dashboard.css";

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

  // Accept or reject ride requests
  const handleRequestAction = async (requestId, action) => {
    try {
      await api.put(`/ride-requests/${requestId}`, { status: action });
      await fetchOffers(); // Refresh dashboard
    } catch (err) {
      console.error(`Failed to ${action} request:`, err);
      alert(`Failed to ${action} the request. Try again.`);
    }
  };

  if (loading)
    return (
      <div>
        <LoadingScreen text="Loading your dashboard..." />
      </div>
    );
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  // Delete ride
  // const deleteRide = async (rideId) => {
  //   if (!window.confirm("Are you sure you want to delete this ride?")) return;

  //   try {
  //     await api.delete(`/rides/${rideId}`);
  //     alert("Ride deleted.");
  //     fetchOffers(); // Refresh the list
  //   } catch (err) {
  //     console.error("Failed to delete ride:", err);
  //     alert("Failed to delete the ride.");
  //   }
  // };

  const deleteRide = async (rideId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This ride will be permanently deleted.",
      icon: "warning",
      customClass: {
        popup: "swal-popup",
        icon: "swal-icon",
      },
      color: "#252525",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#292727",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/rides/${rideId}`);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Your ride was successfully deleted.",
        timer: 2000,
        showConfirmButton: false,
        color: "#252525",
        customClass: {
          popup: "swal-popup",
          icon: "swal-icon",
        },
      });
      fetchOffers(); // Refresh rides
    } catch (err) {
      console.error("Failed to delete ride:", err);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: "Something went wrong while deleting.",
        color: "#252525",
        customClass: {
          popup: "swal-popup",
        },
      });
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
              className="req-box"
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
                <strong>Departure:</strong>{" "}
                {new Date(ride.departure_time).toLocaleString(undefined, {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}{" "}
                <br />
                {/* {new Date(ride.departure_time).toLocaleString()} <br /> */}
                <strong>Available Seats:</strong> {ride.available_seats}
              </p>

              <h4>Passenger Requests:</h4>

              {ride.requests?.length === 0 ? (
                <p>No requests for this ride yet.</p>
              ) : (
                ride.requests.map((req) => (
                  <div
                    className="req-details"
                    key={req.id}
                    style={{
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
                      <div className="button-container">
                        <button
                          onClick={() =>
                            handleRequestAction(req.id, "accepted")
                          }
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            handleRequestAction(req.id, "rejected")
                          }
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
