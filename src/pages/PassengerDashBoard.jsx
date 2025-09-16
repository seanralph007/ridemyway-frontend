import { useEffect, useState } from "react";
import LoadingScreen from "../components/LoadingScreen";
import {
  getMyRequests,
  cancelRequest,
  deleteRequest,
} from "../api/requestService";
import {
  notifySuccess,
  notifyError,
  confirmAction,
} from "../utils/notificationService";
import "./Dashboard.css";

export default function PassengerDashboard() {
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch passenger requests
  const fetchRequests = async () => {
    try {
      const res = await getMyRequests();
      setMyRequests(res);
    } catch (err) {
      console.error("❌ Failed to fetch passenger requests:", err);
      setError("Could not load your ride requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Cancel or Delete request
  const handleDeleteOrCancel = async (request) => {
    const isPending = request.status === "pending";

    const result = await confirmAction(
      isPending ? "Cancel Ride Request?" : "Delete Ride Request?",
      isPending
        ? "Do you really want to cancel this ride request?"
        : "This action cannot be undone.",
      isPending ? "Yes, cancel it!" : "Yes, delete it!"
    );

    if (!result.isConfirmed) return;

    try {
      if (isPending) {
        await cancelRequest(request.id);
        notifySuccess(
          "Cancelled!",
          "Your ride request was successfully removed."
        );
      } else {
        await deleteRequest(request.id);
        notifySuccess("Deleted!", "Your ride request was deleted.");
      }

      setMyRequests((prev) => prev.filter((r) => r.id !== request.id));
    } catch (err) {
      console.error("❌ Failed to cancel/delete request:", err.message);
      notifyError("Error", "Could not process your request. Please try again.");
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
                <strong>Destination:</strong>{" "}
                {req.ride?.destination || req.destination} <br />
                <strong>Departure Time:</strong>{" "}
                {new Date(
                  req.ride?.departure_time || req.departure_time
                ).toLocaleString(undefined, {
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
              </p>

              <button
                style={{
                  border: "1px solid #ccc",
                  cursor: "pointer",
                  color: "red",
                }}
                onClick={() => handleDeleteOrCancel(req)}
              >
                {req.status === "pending" ? "Cancel Request" : "Delete"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
