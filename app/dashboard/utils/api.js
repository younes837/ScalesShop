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
    try {
      console.log("API call with ID:", id);
      const { data } = await api.get(`/products/${id}`);
      console.log("API response:", data);
      return data;
    } catch (error) {
      console.error("Error in getById:", error);
      throw error;
    }
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
    const { data } = await api.patch(`/products/${id}`, product);
    return data;
  },
  delete: async (id) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },
  updateImages: async ({ productId, existingImageIds, primaryImageId }) => {
    const { data } = await api.patch(`/products/${productId}/images`, {
      existingImageIds,
      primaryImageId,
    });
    return data;
  },
  deleteImage: async (productId, imageId) => {
    const { data } = await api.delete(
      `/products/${productId}/images/${imageId}`
    );
    return data;
  },
  uploadImages: async (formData) => {
    const { data } = await api.post("/products/images/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
  update: async (id, data) => {
    const response = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update category");
    }

    return response.json();
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
