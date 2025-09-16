import api from "./api";

// Create new ride
export const createRide = async (rideData) => {
  const res = await api.post("/rides", rideData);
  return res.data;
};

// Get all rides
export const getRides = async () => {
  const res = await api.get("/rides");
  return res.data;
};

// Get single ride
export const getRideById = async (rideId) => {
  const res = await api.get(`/rides/${rideId}`);
  return res.data;
};

// Update ride
export const updateRide = async (rideId, updates) => {
  const res = await api.put(`/rides/${rideId}`, updates);
  return res.data;
};

// Delete ride
export const deleteRideById = async (rideId) => {
  const res = await api.delete(`/rides/${rideId}`);
  return res.data;
};

// Get rides created by logged-in driver
export const getMyOffers = async () => {
  const res = await api.get("/rides/my-offers");
  return res.data;
};
