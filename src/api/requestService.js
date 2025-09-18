import api from "./api";

// Create a ride request
export const createRequest = async (id) => {
  const res = await api.post(`/rides/${id}/request`);
  return res.data;
};

// Get requests for a specific ride
export const getRequestsByRide = async (id) => {
  const res = await api.get(`/rides/${id}/requests`);
  return res.data;
};

// Get logged-in user's requests
export const getMyRequests = async () => {
  const res = await api.get("/rides/my-requests");
  return res.data;
};

// Update request status
export const updateRequestStatus = async (requestId, status) => {
  const res = await api.put(`/ride-requests/${requestId}`, { status });
  return res.data;
};

// Cancel a request
export const cancelRequest = async (requestId) => {
  const res = await api.delete(`/ride-requests/${requestId}`);
  return res.data;
};

// Delete request completely (for accepted/rejected states)
export const deleteRequest = async (requestId) => {
  const res = await api.delete(`/ride-requests/${requestId}`);
  return res.data;
};

// Request to join a ride (alias for createRequest)
export const requestRide = async (id) => {
  return createRequest(id);
};
