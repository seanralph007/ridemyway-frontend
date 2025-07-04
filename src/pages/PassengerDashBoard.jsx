import { useEffect, useState } from "react";
import api from "../api/api";
import './Dashboard.css';

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
    const confirm = window.confirm("Are you sure you want to cancel this request?");
    if (!confirm) return;
  
    try {
      await api.delete(`/ride-requests/${requestId}`);
      alert("Request cancelled.");
      setMyRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (err) {
      console.error("Failed to delete request:", err.message);
      alert("Could not delete request.");
    }
  };

  if (loading) return <p>Loading your ride requests...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="dashboard-container">
      <h2>Passenger Dashboard</h2>
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
                background: "#f9f9f9"
              }}
            >
              <p>
                <strong>Destination:</strong> {req.destination} <br />
                <strong>Departure Time:</strong> {new Date(req.departure_time).toLocaleString(undefined, {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true
                })} <br />
                <strong>Status:</strong>{" "}
                <span style={{ color: req.status === "accepted" ? "green" : req.status === "rejected" ? "red" : "orange", fontWeight: "bold" }}>
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
                style={{border: "1px solid #ccc", cursor: "pointer", color: "red" }}
                onClick={() => deleteRequest(req.id)}
              >
                {req.status === 'accepted' ? 'Delete': req.status === 'rejected' ? 'Delete' : 'Cancel Request'}
              </button>
            </div>
          ))
        )}        
      </div>

    </div>
  );
}