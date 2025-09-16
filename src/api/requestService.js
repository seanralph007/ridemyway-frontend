// import api from "./api";

// export const createRequest = async (rideId) => {
//   const res = await api.post(`/rides/${rideId}/requests`);
//   return res.data;
// };

// export const getRequestsByRide = async (rideId) => {
//   const res = await api.get(`/rides/${rideId}/requests`);
//   return res.data;
// };

// export const getMyRequests = async () => {
//   const res = await api.get("/requests/my");
//   return res.data;
// };

// export const updateRequestStatus = async (requestId, status) => {
//   const res = await api.put(`/requests/${requestId}`, { status });
//   return res.data;
// };

// export const cancelRequest = async (requestId) => {
//   const res = await api.delete(`/requests/${requestId}`);
//   return res.data;
// };

// /**
//  * Request to join a ride (old behavior support)
//  */
// export const requestRide = async (rideId) => {
//   const res = await api.post(`/rides/${rideId}/request`);
//   return res.data;
// };

// /**
//  * Delete request (accepted/rejected states)
//  */
// export const deleteRequest = async (requestId) => {
//   const res = await api.delete(`/ride-requests/${requestId}`);
//   return res.data;
// };

import api from "./api";

// Create a ride request
export const createRequest = async (rideId) => {
  const res = await api.post(`/rides/${rideId}/requests`);
  return res.data;
};

// Get requests for a specific ride
export const getRequestsByRide = async (rideId) => {
  const res = await api.get(`/rides/${rideId}/requests`);
  return res.data;
};

// Get logged-in user's requests
export const getMyRequests = async () => {
  const res = await api.get("/requests/my");
  return res.data;
};

// Update request status
export const updateRequestStatus = async (requestId, status) => {
  const res = await api.put(`/requests/${requestId}`, { status });
  return res.data;
};

// Cancel a request
export const cancelRequest = async (requestId) => {
  const res = await api.delete(`/requests/${requestId}`);
  return res.data;
};

// Delete request completely (for accepted/rejected states)
export const deleteRequest = async (requestId) => {
  const res = await api.delete(`/ride-requests/${requestId}`);
  return res.data;
};

// Request to join a ride (alias for createRequest)
export const requestRide = async (rideId) => {
  return createRequest(rideId);
};
