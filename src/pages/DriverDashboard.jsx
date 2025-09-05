import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import LoadingScreen from "../components/LoadingScreen";
import { getMyOffers, deleteRideById } from "../api/rideService";
import { updateRequestStatus } from "../api/requestService";
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
      fetchOffers(); // Refresh dashboard
    } catch (err) {
      console.error(`❌ Failed to ${action} request:`, err);
      Swal.fire("Error", `Failed to ${action} request. Try again.`, "error");
    }
  };

  // Delete ride
  const handleDeleteRide = async (rideId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This ride will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#292727",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await deleteRideById(rideId);
      Swal.fire("Deleted!", "Your ride was deleted.", "success");
      fetchOffers();
    } catch (err) {
      console.error("❌ Failed to delete ride:", err);
      Swal.fire("Error", "Something went wrong while deleting.", "error");
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
            <div key={ride.id} className="req-box">
              <h3>
                {ride.origin} ➜ {ride.destination}
                <button
                  className="delete-btn"
                  onClick={() => handleDeleteRide(ride.id)}
                >
                  Delete Ride
                </button>
              </h3>

              <p>
                <strong>Departure:</strong>{" "}
                {new Date(ride.departure_time).toLocaleString()} <br />
                <strong>Available Seats:</strong> {ride.available_seats}
              </p>

              <h4>Passenger Requests:</h4>
              {ride.requests?.length === 0 ? (
                <p>No requests for this ride yet.</p>
              ) : (
                ride.requests.map((req) => (
                  <div key={req.id} className="req-details">
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
