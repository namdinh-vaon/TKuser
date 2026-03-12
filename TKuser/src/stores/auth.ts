// Store xác thực
import { defineStore } from "pinia";
import { loginUser } from "@/services/apiUser";
import { getAuthToken, removeAuthToken, setAuthToken } from "@/utils/helper";

export const useLoginStore = defineStore("login", {
  state: () => ({
    token: getAuthToken() || "",
    isLoggedIn: !!getAuthToken(),
  }),

  actions: {
    async login(username: string, password: string) {
      const res = await loginUser(username, password);

      this.token = res.data.token;
      this.isLoggedIn = true;
      setAuthToken(this.token);
    },

    logout() {
      this.token = "";
      this.isLoggedIn = false;
      removeAuthToken();
    },
  },
});
