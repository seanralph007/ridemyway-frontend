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

// Validate ride creation form
export const validateRide = (ride) => {
  const errors = {};
  if (!ride.origin?.trim()) errors.origin = "Origin is required";
  if (!ride.destination?.trim()) errors.destination = "Destination is required";
  if (!ride.departure_time)
    errors.departure_time = "Departure time is required";
  if (!ride.car_type) errors.car_type = "Car type is required";
  if (!ride.available_seats || ride.available_seats <= 0) {
    errors.available_seats = "Enter a valid number of seats";
  }
  return errors;
};
