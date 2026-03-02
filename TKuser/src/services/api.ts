import axios from "axios";

const api = axios.create({
  baseURL: "https://fakestoreapi.com",
});

export default api;

// GET user theo id
export const getUser = (id: number) => {
  return api.get(`/users/${id}`);
};

// UPDATE user (PUT)
export const updateUser = (id: number, data: any) => {
  return api.put(`/users/${id}`, data);
};
