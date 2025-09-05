import api from "./api";

const rideService = {
  // Create a new ride (Driver only)
  createRide: async (rideData) => {
    const res = await api.post("/rides", rideData);
    return res.data; // e.g., { ride, message }
  },

  // Get all rides
  getRides: async () => {
    const res = await api.get("/rides");
    return res.data; // e.g., { rides: [...] }
  },

  // Get ride by ID
  getRideById: async (rideId) => {
    const res = await api.get(`/rides/${rideId}`);
    return res.data; // e.g., { ride }
  },

  // Update ride details (Driver only)
  updateRide: async (rideId, updates) => {
    const res = await api.put(`/rides/${rideId}`, updates);
    return res.data; // e.g., { updatedRide }
  },

  // Delete ride (Driver only)
  deleteRide: async (rideId) => {
    const res = await api.delete(`/rides/${rideId}`);
    return res.data; // e.g., { message }
  },
};

export default rideService;
