import api from "./api";

const authService = {
  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data; // e.g., { user, message }
  },

  signup: async (userData) => {
    const res = await api.post("/auth/signup", userData);
    return res.data; // e.g., { message, user }
  },

  logout: async () => {
    const res = await api.post("/auth/logout");
    return res.data; // e.g., { message }
  },

  fetchUser: async () => {
    const res = await api.get("/auth/me");
    return res.data; // e.g., { user }
  },
};

export default authService;
