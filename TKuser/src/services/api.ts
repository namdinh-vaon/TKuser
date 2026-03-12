import instance from "@/utils/axios";

// ========== Users ==========
// Login user
export const loginUser = (username: string, password: string) => {
  return instance.post("/auth/login", {
    username,
    password,
  });
};

// GET user theo id
export const getUserAPI = (id: number) => {
  return instance.get(`/users/${id}`);
};

// GET user danh sach
export const getUsers = () => {
  return instance.get("/users");
};

// POST new user
export const createUserAPI = (payload: any) => {
  return instance.post("/users", payload);
};

// UPDATE user
export const updateUser = (id: number, data: any) => {
  return instance.put(`/users/${id}`, data);
};

// DELETE user
export const deleteUserAPI = (id: number) => {
  return instance.delete(`/users/${id}`);
};

// ========== Products ==========
// Get Products
export const getProducts = (category: string) => {
  return instance.get(`/products/category/${category}`);
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
