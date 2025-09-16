import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { validateLogin } from "../utils/validations";
import InputField from "../components/forms/InputField";
import ValidationError from "../components/forms/ValidationError";
import { notifyError } from "../utils/notificationService";
import "./AuthStyles.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateLogin(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      await login(formData.email, formData.password);
      navigate("/");
    } catch (error) {
      const message = error?.response?.data?.message || "Login failed";
      notifyError("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="login-container" onSubmit={handleSubmit}>
      <h2>Login</h2>

      <InputField
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
        className="input"
      />
      {errors.email && <ValidationError message={errors.email} />}

      <InputField
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
        className="input"
      />
      {errors.password && <ValidationError message={errors.password} />}

        <button className="button" type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
