import { defineStore } from "pinia";
import api from "@/services/api";

export const useLoginStore = defineStore("login", {
  state: () => ({
    token: localStorage.getItem("token") || "",
    isLoggedIn: !!localStorage.getItem("token"),
  }),

  actions: {
    async login(username: string, password: string) {
      const res = await api.post("/auth/login", {
        username,
        password,
      });

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
