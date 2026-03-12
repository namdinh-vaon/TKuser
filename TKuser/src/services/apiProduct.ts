import instance from "@/utils/axios";

// ========== Products ==========
// Get Products
export const getProducts = () => {
  return instance.get(`/products`);
};

// New Products
export const creatNewProducts = (payload: any) => {
  return instance.post("/products", payload);
};

// Update Products
export const updateProduct = (id: number, data: any) => {
  return instance.put(`/products/${id}`, data);
};

// GET product theo id
export const getProductAPI = (id: number) => {
  return instance.get(`/products/${id}`);
};

// Delete product
export const deleteProductAPI = (id: number) => {
  return instance.delete(`/products/${id}`);
};
