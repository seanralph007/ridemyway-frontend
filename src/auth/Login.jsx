import { useState, useContext } from "react";
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import './AuthStyles.css'

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // Usestate that declares the  Loading state

  // Validate the form/ make sure the name and password is provided before proceeding
  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password.trim()) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true); // Start the loading
    setErrors({}); // Clear old errors

    try {
      await login(email, password);
      navigate("/");
    } catch (error) {
      // Show backend error message if there is any
      const message = err?.response?.data?.message || "Login failed";
      alert(message);
    } finally {
      setLoading(false); // Stop the loading
    }
  };

  return (
    <form className='login-container' onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        className="input"
        placeholder="Email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setErrors({ ...errors, email: "" }); // Clear individual error
        }}
      />
      {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

      <input
        className="input"
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setErrors({ ...errors, password: "" });
        }}
      />
      {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

      <button className="button" type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}