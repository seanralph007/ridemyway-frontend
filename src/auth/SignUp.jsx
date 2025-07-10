import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import './AuthStyles.css';
import Select from 'react-select'

export default function Signup() {
  const { signup, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // loading state

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    if (!form.password.trim()) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrors({}); // clear old errors
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true); // START loading
    try {
      await signup(form);
      console.log("Signup successful");
      await login(form.email, form.password);
      console.log("Auto-login successful");
      navigate("/");
    } catch (err) {
      console.error("Signup/login error:", err?.response?.data || err.message);
      alert(err?.response?.data?.message || "Signup or auto-login failed");
    }
    
  };

//   const options = [
//     {value: 'driver', label: 'Driver'},
//     {value: 'passenger', label: 'Passenger'}
//  ]

  return (
    <form className="container" onSubmit={handleSubmit}>
      <h2>Signup</h2>
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
      {/* <Select className='role' options={options} placeholder='Choose role ...' /> */}
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

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Signup"}
      </button>
    </form>
  );
}
