import { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import authService from "../api/authService";
import LoadingScreen from "../components/LoadingScreen";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifying email...");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get("token");
      const email = searchParams.get("email");

      if (!token || !email) {
        setMessage("Invalid verification link.");
        setLoading(false);
        return;
      }

      try {
        // ✅ Call authService (not api directly)
        const res = await authService.verifyEmail(token, email);
        setMessage(res.message || "Email verified!");

        // Optional auto-redirect if already logged in
        setTimeout(() => {
          if (user) {
            navigate("/"); // logged-in user → go home
          } else {
            navigate("/login"); // not logged-in user → login
          }
        }, 2000);
      } catch (err) {
        console.error("❌ Verification failed:", err);
        const msg =
          err?.response?.data?.message ||
          "Something went wrong during verification.";
        setMessage(msg);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [searchParams, navigate, user]);

  return (
    <div style={{ textAlign: "center", marginTop: "4rem" }}>
      <h2>Email Verification</h2>
      {loading ? (
        <LoadingScreen text="Verifying your email..." />
      ) : (
        <p>{message}</p>
      )}
    </div>
  );
}
