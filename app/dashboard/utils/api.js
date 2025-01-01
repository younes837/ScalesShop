import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export const productApi = {
  getAll: async () => {
    const { data } = await api.get("/products");
    return data;
  },
  getById: async (id) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
  },
  create: async (product) => {
    const { data } = await api.post("/products", product);
    return data;
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
    const { data } = await api.get("/categories");
    return data;
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
