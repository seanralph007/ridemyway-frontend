// Format full date + time (old dashboard style)
export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString(undefined, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

// Format date to readable string
export const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Format time (e.g. 14:30 → 2:30 PM)
export const formatTime = (timeString) => {
  const date = new Date(`1970-01-01T${timeString}Z`);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

// Format number into currency (e.g. 2000 → ₦2,000)
export const formatCurrency = (amount, currency = "NGN") => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
  }).format(amount);
};
