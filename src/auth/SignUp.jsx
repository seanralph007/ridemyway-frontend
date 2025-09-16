import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { validateSignup } from "../utils/validations";
import InputField from "../components/forms/InputField";
import SelectField from "../components/forms/SelectField";
import ValidationError from "../components/forms/ValidationError";
import { notifySuccess, notifyError } from "../utils/notificationService";
import "./AuthStyles.css";

export default function SignUp() {
  const { signup, login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

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

    const validationErrors = validateSignup(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      const { confirmPassword, ...userData } = formData;
      await signup(userData);

      await login(formData.email, formData.password);

      notifySuccess("Signup successful", "Welcome aboard!");
      navigate("/");
    } catch (err) {
      const message =
        err?.response?.data?.message || "Signup or auto-login failed";
      notifyError("Error", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="signup-container" onSubmit={handleSubmit}>
      <h2>Signup</h2>

      {errors.role && <ValidationError message={errors.role} />}
      <SelectField
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="role"
        options={[
          { value: "", label: "Select Role" },
          { value: "passenger", label: "Passenger" },
          { value: "driver", label: "Driver" },
        ]}
      />

      <InputField
        name="name"
        placeholder="Name"
        value={formData.name}
        onChange={handleChange}
      />
      {errors.name && <ValidationError message={errors.name} />}

      <InputField
        name="email"
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />
      {errors.email && <ValidationError message={errors.email} />}

      <InputField
        name="password"
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
      {errors.password && <ValidationError message={errors.password} />}

      <InputField
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleChange}
      />
      {errors.confirmPassword && (
        <ValidationError message={errors.confirmPassword} />
      )}

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Signup"}
      </button>
    </form>
  );
}
