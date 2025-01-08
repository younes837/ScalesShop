import axios from "axios";
import { useAuth } from "@clerk/nextjs";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Update the request interceptor to use async/await properly
api.interceptors.request.use(async (config) => {
  try {
    const token = await window.Clerk?.session?.getToken();
    console.log(token);

    if (token) {
      // Set both Authorization and Cookie headers
      config.headers.Authorization = `Bearer ${token}`;
      // Ensure content type is not set for FormData
      if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
      }
    } else {
      console.warn("No auth token available");
    }
    return config;
  } catch (error) {
    console.error("Error in request interceptor:", error);
    return Promise.reject(error);
  }
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const productApi = {
  getAll: async (params) => {
    const response = await api.get("/products", { params });
    return response.data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },
  create: async (formData) => {
    try {
      const token = await window.Clerk?.session?.getToken();
      const response = await api.post("/products", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  },
  update: async ({ id, ...product }) => {
    const { data } = await api.put(`/products/${id}`, product);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },
};

export const categoryApi = {
  getAll: async () => {
    const response = await api.get("/categories");
    return response.data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/categories/${id}`);
    return data;
  },
  create: async (category) => {
    const { data } = await api.post("/categories", category);
    return data;
  },
  update: async ({ id, ...category }) => {
    const { data } = await api.put(`/categories/${id}`, category);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  },
};

export const dashboardApi = {
  getStats: async () => {
    const { data } = await api.get("/dashboard/stats");
    return data;
  },
  getRecentSales: async () => {
    const { data } = await api.get("/dashboard/recent-sales");
    return data;
  },
  getRevenue: async () => {
    const { data } = await api.get("/dashboard/revenue");
    return data;
  },
};
