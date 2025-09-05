import axios from "axios";

// Create an Axios instance for the whole app
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // send cookies (for JWT auth in httpOnly cookies)
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
