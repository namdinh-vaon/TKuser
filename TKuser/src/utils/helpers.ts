// === Quản lý token trong localStorage ===
export const getAuthToken = () => localStorage.getItem("token");
export const removeAuthToken = () => localStorage.removeItem("token");

// === Quản lý thông tin user trong localStorage ===
export const removeUser = () => localStorage.removeItem("user");
