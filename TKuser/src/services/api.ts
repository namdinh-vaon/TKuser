import axios from "axios";
import { useConfirm } from "primevue/useconfirm";

const api = axios.create({
  baseURL: "https://fakestoreapi.com",
});

export default api;

// GET user theo id
export const getUser = (id: number) => {
  return api.get(`/users/${id}`);
};

// GET user danh sach
export const getUsers = () => {
  return api.get("/users");
};

export const createUserAPI = (payload: any) => {
  return api.post("/users", payload);
};

// UPDATE user (PUT)
export const updateUser = (id: number, data: any) => {
  return api.put(`/users/${id}`, data);
};

export function useDeleteUser() {
  const confirm = useConfirm();

  const deleteUser = (id: number, callback?: () => void) => {
    confirm.require({
      message: "Bạn chắc chắn muốn xoá user?",
      header: "Confirm Delete",

      accept: async () => {
        await api.delete(`/users/${id}`);
        callback?.();
      },
    });
  };

  return { deleteUser };
}
