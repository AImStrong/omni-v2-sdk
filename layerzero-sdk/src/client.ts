import axios from "axios";

export const BASE_URL = "https://scan.layerzero-api.com/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000
});
