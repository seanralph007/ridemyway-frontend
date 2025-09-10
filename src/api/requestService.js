import api from "./api";

export const createRequest = async (rideId) => {
  const res = await api.post(`/rides/${rideId}/requests`);
  return res.data;
};

export const getRequestsByRide = async (rideId) => {
  const res = await api.get(`/rides/${rideId}/requests`);
  return res.data;
};

export const getMyRequests = async () => {
  const res = await api.get("/requests/my");
  return res.data;
};

export const updateRequestStatus = async (requestId, status) => {
  const res = await api.put(`/requests/${requestId}`, { status });
  return res.data;
};

export const cancelRequest = async (requestId) => {
  const res = await api.delete(`/requests/${requestId}`);
  return res.data;
};
