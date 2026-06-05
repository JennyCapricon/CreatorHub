import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  getMe: () => api.get("/auth/me"),
  updateProfile: (data) => api.put("/auth/profile", data),
  updatePreferences: (data) => api.put("/auth/preferences", data),
};

export const captions = {
  generate: (data) => api.post("/captions/generate", data),
  getHistory: () => api.get("/captions/history"),
  save: (id) => api.put(`/captions/${id}/save`),
};

export const ideas = {
  getAll: (params) => api.get("/ideas", { params }),
  create: (data) => api.post("/ideas", data),
  update: (id, data) => api.put(`/ideas/${id}`, data),
  delete: (id) => api.delete(`/ideas/${id}`),
};

export const posts = {
  getAll: (params) => api.get("/posts", { params }),
  create: (data) => api.post("/posts", data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
};

export const trends = {
  getAll: (params) => api.get("/trends", { params }),
  create: (data) => api.post("/trends", data),
  update: (id, data) => api.put(`/trends/${id}`, data),
  delete: (id) => api.delete(`/trends/${id}`),
};

export const analytics = {
  get: (params) => api.get("/analytics", { params }),
  sync: (data) => api.post("/analytics/sync", data),
};

export const linkinbio = {
  get: () => api.get("/linkinbio"),
  update: (data) => api.put("/linkinbio", data),
  getPublic: (username) => api.get(`/linkinbio/public/${username}`),
};

export default api;
