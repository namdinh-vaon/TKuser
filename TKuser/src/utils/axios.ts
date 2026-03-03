import axios from "axios";
import { getAuthToken, removeAuthToken, removeUser } from "@/utils/helpers";

const instance = axios.create({
  baseURL: "http://localhost:3000",
});

//Tự động gắn Bearer token vào mỗi request
instance.interceptors.request.use((config) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

//Chuyển hướng về login khi token hết hạn (401)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      removeAuthToken();
      removeUser();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default instance;
