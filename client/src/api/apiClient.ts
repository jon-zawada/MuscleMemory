import axios, { type CreateAxiosDefaults } from "axios";

const TIMEOUT_DURATION = 10_000; // 10 Seconds
const API_BASE_URL = "http://localhost:3001/api"; // TODO: add production url later

const defaultConfig: CreateAxiosDefaults = {
  baseURL: API_BASE_URL,
  timeout: TIMEOUT_DURATION,
  withCredentials: true,
};

const apiClient = axios.create({ ...defaultConfig });

export default apiClient;
