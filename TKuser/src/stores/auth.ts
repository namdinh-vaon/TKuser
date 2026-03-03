// Store xác thực
import { defineStore } from "pinia";
import { loginUser } from "@/services/api";

export const useLoginStore = defineStore("login", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    isLoggedIn: !!localStorage.getItem("token"),
  }),

  actions: {
    async login(username: string, password: string) {
      const res = await loginUser(username, password);

      this.token = res.data.token;
      this.isLoggedIn = true;
      localStorage.setItem("token", this.token);
    },

    logout() {
      this.token = "";
      this.isLoggedIn = false;
      localStorage.removeItem("token");
    },
  },
});
