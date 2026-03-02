import { defineStore } from "pinia";
import api from "@/services/api";

export interface User {
  id: number;
  name: {
    firstname: string;
    lastname: string;
  };
  email: string;
  username: string;
  password: string;
  avatar: string;
  date: string;
  role: string;
  status: "Active" | "Inactive" | "Suspended";
}

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [] as User[],
    currentPage: 1,
    pageSize: 5,
  }),

  getters: {
    paginatedUsers(state) {
      const start = (state.currentPage - 1) * state.pageSize;
      return state.users.slice(start, start + state.pageSize);
    },

    totalPages(state) {
      return Math.ceil(state.users.length / state.pageSize);
    },
  },

  actions: {
    async loadUsers() {
      const res = await api.get("/users");

      this.users = res.data.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        username: u.username,
        password: u.password,
        avatar: `https://i.pravatar.cc/150?img=${u.id}`,
        date: new Date().toLocaleDateString(),
        role: "User",
        status: "Active",
      }));
    },

    addUser(user: any) {
      const maxId = this.users.length
        ? Math.max(...this.users.map((u) => u.id))
        : 0;

      this.users.push({
        id: maxId + 1,
        name: user.name,
        email: user.email,
        username: user.username,
        password: user.password,
        avatar: "https://i.pravatar.cc/150?img=" + user.id,
        date: new Date().toLocaleDateString(),
        role: user.role || "User",
        status: "Active",
      });
    },

    updateUser(updatedUser: User) {
      const index = this.users.findIndex((u) => u.id === updatedUser.id);
      if (index !== -1) this.users[index] = updatedUser;
    },

    removeUser(id: number) {
      this.users = this.users.filter((u) => u.id !== id);
    },

    setPage(page: number) {
      this.currentPage = page;
    },
  },
});
