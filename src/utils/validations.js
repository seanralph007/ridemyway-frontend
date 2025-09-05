// 🔑 Login form validation
export const validateLogin = ({ email, password }) => {
  const errors = {};
  if (!email.trim()) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Invalid email format";

  if (!password.trim()) errors.password = "Password is required";
  return errors;
};

// 📝 SignUp form validation
export const validateSignup = ({
  name,
  email,
  role,
  password,
  confirmPassword,
}) => {
  const errors = {};

  if (!name.trim()) errors.name = "Name is required";

  if (!email.trim()) errors.email = "Email is required";
  else if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Invalid email format";

  if (!role) errors.role = "Role is required";

  if (!password.trim()) errors.password = "Password is required";
  //   else if (password.length < 6)
  //     errors.password = "Password must be at least 6 characters";

  if (password !== confirmPassword)
    errors.confirmPassword = "Passwords do not match";

  return errors;
};
