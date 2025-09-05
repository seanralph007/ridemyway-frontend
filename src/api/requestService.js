import api from "./api";

const requestService = {
  // Passenger requests to join a ride
  createRequest: async (rideId) => {
    const res = await api.post(`/rides/${rideId}/requests`);
    return res.data; // e.g., { request, message }
  },

  // Get all requests for a ride (Driver only)
  getRequestsByRide: async (rideId) => {
    const res = await api.get(`/rides/${rideId}/requests`);
    return res.data; // e.g., { requests: [...] }
  },

  // Get requests made by the logged-in passenger
  getMyRequests: async () => {
    const res = await api.get("/requests/my");
    return res.data; // e.g., { requests: [...] }
  },

  // Update request status (Driver approves/rejects)
  updateRequestStatus: async (requestId, status) => {
    const res = await api.put(`/requests/${requestId}`, { status });
    return res.data; // e.g., { updatedRequest }
  },

  // Cancel a request (Passenger only)
  cancelRequest: async (requestId) => {
    const res = await api.delete(`/requests/${requestId}`);
    return res.data; // e.g., { message }
  },
};

export default requestService;
