// Cấu hình Axios - HTTP client với interceptor tự động gắn token và xử lý lỗi 401
import axios from "axios";
import { getAuthToken, removeAuthToken, removeUser } from "@/utils/helper";
import { API_BASE_URL } from "./constants";

const instance = axios.create({
  baseURL: API_BASE_URL,
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
      window.location.href = "/";
    }
    return Promise.reject(error);
  },
);

export default instance;
