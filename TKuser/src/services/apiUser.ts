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
