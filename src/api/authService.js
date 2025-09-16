import api from "./api";

const authService = {
  // login: async (email, password) => {
  //   const res = await api.post("/auth/login", { email, password });
  //   return res.data; // { user, message }
  // },

  // signup: async (userData) => {
  //   const res = await api.post("/auth/signup", userData);
  //   return res.data; // { message, user }
  // },

  // logout: async () => {
  //   const res = await api.post("/auth/logout");
  //   return res.data; // { message }
  // },

  // fetchUser: async () => {
  //   const res = await api.get("/auth/me");
  //   return res.data; // { user }
  // },

  verifyEmail: async (token, email) => {
    const res = await api.get(
      `/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`
    );
    return res.data;
  },
};

export default authService;
