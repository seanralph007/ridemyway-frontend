import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import LoadingScreen from "../components/LoadingScreen";
import { getMyRequests, cancelRequest } from "../api/requestService";
import "./Dashboard.css";

export default function PassengerDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch passenger's ride requests
  const fetchRequests = async () => {
    try {
      const res = await getMyRequests();
      setRequests(res);
    } catch (err) {
      console.error("❌ Failed to fetch requests:", err);
      setError("Unable to load your ride requests. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Cancel request
  const handleCancel = async (requestId) => {
    const result = await Swal.fire({
      title: "Cancel request?",
      text: "Do you really want to cancel this ride request?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#292727",
      confirmButtonText: "Yes, cancel it!",
    });

    if (!result.isConfirmed) return;

    try {
      await cancelRequest(requestId);
      Swal.fire("Cancelled!", "Your request was cancelled.", "success");
      fetchRequests();
    } catch (err) {
      console.error("❌ Failed to cancel request:", err);
      Swal.fire("Error", "Something went wrong while cancelling.", "error");
    }
  };

  if (loading) return <LoadingScreen text="Loading your dashboard..." />;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="dashboard-container">
      <h2>Passenger Dashboard</h2>
      <div className="req-container">
        {requests.length === 0 ? (
          <p>You haven't requested any rides yet.</p>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="req-box">
              <h3>
                {req.ride.origin} ➜ {req.ride.destination}
              </h3>

              <p>
                <strong>Departure:</strong>{" "}
                {new Date(req.ride.departure_time).toLocaleString()} <br />
                <strong>Status:</strong> {req.status}
              </p>

              {req.status === "pending" && (
                <button
                  className="cancel-btn"
                  onClick={() => handleCancel(req.id)}
                >
                  Cancel Request
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
