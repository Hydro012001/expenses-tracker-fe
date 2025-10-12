import axios from "axios";
import { getCookie, removeToken } from "./authUtils";
const API_BASE_URL = import.meta.env.VITE_API_URL;

export const api = axios.create({
  baseURL: API_BASE_URL + "/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getCookie("expenses_token");

    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 400 || status === 401) {
      removeToken("expenses_token");
    }

    return Promise.reject(error);
  }
);
