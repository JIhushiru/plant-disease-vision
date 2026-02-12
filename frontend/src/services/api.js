import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

export async function predictDisease(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/api/predict", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

export async function getClasses() {
  const response = await api.get("/api/classes");
  return response.data;
}

export async function healthCheck() {
  const response = await api.get("/api/health");
  return response.data;
}
