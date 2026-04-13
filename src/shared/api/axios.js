import axios from "axios";
import { loadAuthStorage } from "../lib/storage";

export const axiosInstance = axios.create({
  baseURL: "https://api.redclass.redberryinternship.ge/api",
});

axiosInstance.interceptors.request.use((config) => {
  const storedAuth = loadAuthStorage();

  if (storedAuth?.token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${storedAuth.token}`,
    };
  }

  return config;
});
