import api from "./api";

export const createRide = async (rideData) => {
  const res = await api.post("/rides", rideData);
  return res.data;
};

export const getRides = async () => {
  const res = await api.get("/rides");
  return res.data;
};

export const getRideById = async (rideId) => {
  const res = await api.get(`/rides/${rideId}`);
  return res.data;
};

export const updateRide = async (rideId, updates) => {
  const res = await api.put(`/rides/${rideId}`, updates);
  return res.data;
};

export const deleteRide = async (rideId) => {
  const res = await api.delete(`/rides/${rideId}`);
  return res.data;
};
