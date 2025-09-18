import { useEffect, useState } from "react";
import LoadingScreen from "../components/LoadingScreen";
import { getMyOffers, deleteRideById } from "../api/rideService";
import { updateRequestStatus } from "../api/requestService";
import {
  notifySuccess,
  notifyError,
  confirmAction,
} from "../utils/notificationService";
import { formatDateTime } from "../utils/formatters";
import "./Dashboard.css";

export default function DriverDashboard() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch driver's ride offers
  const fetchOffers = async () => {
    try {
      const res = await getMyOffers();
      setRides(res);
    } catch (err) {
      console.error("❌ Failed to fetch offers:", err);
      setError("Unable to load your rides. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // Accept/reject requests
  const handleRequestAction = async (requestId, action) => {
    try {
      await updateRequestStatus(requestId, action);
      notifySuccess("Success", `Request ${action} successfully.`);
      fetchOffers(); // Refresh dashboard
    } catch (err) {
      console.error(`❌ Failed to ${action} request:`, err);
      notifyError("Error", `Failed to ${action} request. Try again.`);
    }
  };

  // Delete ride
  const handleDeleteRide = async (rideId) => {
    const result = await confirmAction(
      "Are you sure?",
      "This ride will be permanently deleted.",
      "Yes, delete it!"
    );

    if (!result.isConfirmed) return;

    try {
      await deleteRideById(rideId);
      notifySuccess("Deleted!", "Your ride was successfully deleted.");
      fetchOffers();
    } catch (err) {
      console.error("❌ Failed to delete ride:", err);
      notifyError("Oops!", "Something went wrong while deleting.");
    }
  };

  if (loading) return <LoadingScreen text="Loading your dashboard..." />;
  if (error) return <p className="error">{error}</p>;

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
              {/* <h3>
                {ride.origin} ➜ {ride.destination}
                <br></br>
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteRide(ride.id)}
                >
                  Delete Ride
                </button>
              </h3> */}
              <button
                className="delete-btn"
                onClick={() => handleDeleteRide(ride.id)}
              >
                Delete Ride
              </button>
              <h3>
                {ride.origin} ➜ {ride.destination}
              </h3>

              <p>
                <strong>Departure:</strong>{" "}
                {formatDateTime(ride.departure_time)} <br />
                <strong>Available Seats:</strong> {ride.available_seats}
              </p>

              <h4>Passenger Requests:</h4>
              {ride.requests?.length === 0 ? (
                <p>No requests for this ride yet.</p>
              ) : (
                ride.requests.map((req) => (
                  <div
                    key={req.id}
                    className="req-details"
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
}
