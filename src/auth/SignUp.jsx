import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./AuthStyles.css";

export default function Signup() {
  const { signup, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.role.trim())
      newErrors.role = "Select a role between 'Driver' or 'Passenger'";
    if (!form.password.trim()) newErrors.password = "Password is required";
    if (!form.confirmPassword.trim())
      newErrors.confirmPassword = "Confirm Password is required";
    if (
      form.password &&
      form.confirmPassword &&
      form.password !== form.confirmPassword
    ) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...userData } = form; //removed confirm password input before sending
      await signup(userData);
      await login(form.email, form.password);
      navigate("/");
    } catch (err) {
      console.error("Signup/login error:", err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Signup or auto-login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="signup-container" onSubmit={handleSubmit}>
      <h2>Signup</h2>

      {errors.role && <p style={{ color: "red" }}>{errors.role}</p>}
      <select
        className="role"
        name="role"
        value={form.role}
        onChange={handleChange}
      >
        <option value="">Select Role</option>
        <option value="passenger">Passenger</option>
        <option value="driver">Driver</option>
      </select>

      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
      />
      {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}

      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

      <input
        name="password"
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

      <input
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        value={form.confirmPassword}
        onChange={handleChange}
      />
      {errors.confirmPassword && (
        <p style={{ color: "red" }}>{errors.confirmPassword}</p>
      )}

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Signup"}
      </button>
    </form>
  );
}
