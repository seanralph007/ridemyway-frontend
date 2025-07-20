import { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying email...");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { fetchUser } = useContext(AuthContext); // ensures user is refreshed after auto-login

  useEffect(() => {
    const verify = async () => {
      //Fetch the query parameters from the URL
      const token = searchParams.get("token");
      const email = searchParams.get("email");

      if (!token || !email) {
        setMessage("Invalid verification link.");
        setLoading(false);
        return;
      }

      try {
        // Call the backend verification
        const res = await api.get(`/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`);
        setMessage(res.data.message || "Email verified!");

        await fetchUser(); // refresh user in AuthContext
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate("/"); // redirect after success
        }, 2000);
      } catch (err) {
        console.error("Verification failed:", err);
        const msg = err?.response?.data?.message || "Something went wrong during verification.";
        setMessage(msg);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [searchParams, navigate, fetchUser]);

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h2>Email Verification</h2>
      <p>{message}</p>
      {loading && <p>Verifying...</p>}
    </div>
  );
}