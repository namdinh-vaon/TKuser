import { TOKEN_KEY, USER_KEY } from "./constants";
import { useConfirm } from "primevue/useconfirm";
import { deleteUserAPI } from "@/services/api";
import { useToast } from "primevue/usetoast";

// === Quản lý token trong localStorage ===
export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);
export const setAuthToken = (token: any) =>
  localStorage.setItem(TOKEN_KEY, token);
export const removeAuthToken = () => localStorage.removeItem(TOKEN_KEY);

// === Quản lý thông tin user trong localStorage ===
export const removeUser = () => localStorage.removeItem(USER_KEY);

// ============== Toast ==============
export const useAppToast = () => {
  const toast = useToast();
  const showSuccess = (message: string) => {
    toast.add({
      severity: "success",
      summary: "Thành công",
      detail: message,
      life: 3000,
    });
  };

  const showError = (message: string) => {
    toast.add({
      severity: "error",
      summary: "Lỗi",
      detail: message,
      life: 3000,
    });
  };

  return { showSuccess, showError };
};

// ======== Delete User ===
export function deleteUser() {
  const confirm = useConfirm();
  const { showSuccess, showError } = useAppToast();
  // ConfirmDialog
  const delete_User = (id: number, callback?: () => void) => {
    confirm.require({
      message: "Bạn chắc chắn muốn xoá user?",
      header: "Confirm Delete",
      icon: "pi pi-info-circle",
      rejectLabel: "Cancel",
      rejectProps: {
        label: "Cancel",
        severity: "secondary",
        outlined: true,
      },
      acceptProps: {
        label: "Delete",
        severity: "danger",
      },

      accept: async () => {
        try {
          await deleteUserAPI(id);

          if (callback) callback();
          // Toast
          showSuccess("Xóa thành công!");
        } catch (error) {
          showError("Xóa thất bại");
        }
      },
    });
  };
  return delete_User;
}
