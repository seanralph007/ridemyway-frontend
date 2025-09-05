import { useEffect, useState } from "react";
import LoadingScreen from "../components/LoadingScreen";
import Swal from "sweetalert2";
import api from "../api/api";
import "./Dashboard.css";
import React from "react";

export default function PassengerDashboard() {
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await api.get("/rides/my-requests");
        setMyRequests(res.data);
      } catch (err) {
        console.error("Failed to fetch passenger requests:", err);
        setError("Could not load your ride requests.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const deleteRequest = async (requestId) => {
    const result = await Swal.fire({
      title: "Cancel Ride Request?",
      text: "This action cannot be undone.",
      icon: "warning",
      customClass: {
        popup: "swal-popup",
        icon: "swal-icon",
      },
      color: "#252525",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#292727",
      confirmButtonText: "Yes, cancel it!",
      cancelButtonText: "No",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/ride-requests/${requestId}`);
      Swal.fire({
        title: "Cancelled!",
        text: "Your ride request was successfully removed.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        color: "#252525",
        customClass: {
          popup: "swal-popup",
          icon: "swal-icon",
        },
      });

      setMyRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      console.error("Failed to delete request:", err.message);
      Swal.fire({
        title: "Error",
        text: "Could not cancel the request. Please try again.",
        icon: "error",
      });
    }
  };

  if (loading) return <LoadingScreen text="Loading your ride requests..." />;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="dashboard-container">
      <h2>Passenger Dashboard</h2>
      <p className="req-subtitle">Your ride requests:</p>
      <div className="req-container">
        {myRequests.length === 0 ? (
          <p>You have not requested any rides yet.</p>
        ) : (
          myRequests.map((req) => (
            <div
              className="request"
              key={req.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "1rem",
                marginBottom: "1rem",
                background: "#cccccc",
              }}
            >
              <p>
                <strong>Destination:</strong> {req.destination} <br />
                <strong>Departure Time:</strong>{" "}
                {new Date(req.departure_time).toLocaleString(undefined, {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}{" "}
                <br />
                <strong>Status:</strong>{" "}
                <span
                  style={{
                    color:
                      req.status === "accepted"
                        ? "green"
                        : req.status === "rejected"
                        ? "red"
                        : "orange",
                    fontWeight: "bold",
                  }}
                >
                  {req.status.toUpperCase()}
                </span>
                {/* <span
                  style={{
                    color:
                      req.status === "accepted"
                        ? "green"
                        : req.status === "rejected"
                        ? "red"
                        : "orange",
                    fontWeight: "bold"
                  }}
                >
                  {req.status.toUpperCase()}
                </span> */}
              </p>
              <button
                style={{
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  color: "red",
                }}
                onClick={() => deleteRequest(req.id)}
              >
                {req.status === "accepted"
                  ? "Delete"
                  : req.status === "rejected"
                  ? "Delete"
                  : "Cancel Request"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
