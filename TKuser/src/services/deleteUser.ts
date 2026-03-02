import { useConfirm } from "primevue/useconfirm";
import api from "@/services/api";

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
