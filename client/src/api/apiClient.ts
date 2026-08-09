import axios, { type CreateAxiosDefaults, type InternalAxiosRequestConfig } from "axios";
import { tokenStore } from "../context/tokenStore";

const TIMEOUT_DURATION = 10_000; // 10 Seconds
const API_BASE_URL = "http://localhost:3001/api"; // TODO: add production url later

const defaultConfig: CreateAxiosDefaults = {
  baseURL: API_BASE_URL,
  timeout: TIMEOUT_DURATION,
  withCredentials: true,
};

const apiClient = axios.create({ ...defaultConfig });

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
