// Store người dùng - Quản lý tạo, sửa, xóa và hiện danh sách người dùng
import { defineStore } from "pinia";
import { getUsers, updateUser, createUserAPI } from "@/services/api";
import { type User } from "../types/user";

export const useUserStore = defineStore("user", {
  state: () => ({
    users: [] as User[],
    totalItems: 0,
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

    showingData(): { currentMax: number; total: number } {
      if (this.totalItems === 0) {
        return { currentMax: 0, total: 0 };
      }

      // Công thức tính số tích lũy đến trang hiện tại
      const potentialCount = this.currentPage * this.pageSize;
      const currentMax = Math.min(potentialCount, this.totalItems);

      return {
        currentMax,
        total: this.totalItems,
      };
    },
  },

  actions: {
    /* ================= LOAD ================= */
    async loadUsers() {
      const res = await getUsers();

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

      this.totalItems = this.users.length;
    },

    /* ================= SHOW USER (ENTRIES) ================= */
    setUsersData(data: any[], total: number) {
      this.users = data;
      this.totalItems = total;
    },

    /* ================= CREATE ================= */
    async createUser(payload: any) {
      await createUserAPI(payload);

      const newId =
        this.users.length > 0
          ? Math.max(...this.users.map((u) => u.id)) + 1
          : 1;

      const newUser: User = {
        id: newId,

        name: payload.name,
        email: payload.email,
        username: payload.username,
        password: payload.password,

        avatar: `https://i.pravatar.cc/150?img=${newId}`,
        date: new Date().toLocaleDateString(),
        role: payload.role || "User",
        status: "Active",
      };

      this.users.push(newUser);
      this.totalItems = this.users.length;

      return newUser;
    },

    /* ================= UPDATE ================= */
    async updateUser(id: number, payload: any) {
      const res = await updateUser(id, payload);

      const index = this.users.findIndex((u) => u.id === id);

      if (index !== -1) {
        this.users[index] = {
          ...this.users[index],
          ...payload,
        };
      }

      return res.data;
    },

    /* ================= DELETE ================= */
    async deleteUser(id: number) {
      // xoá local
      this.users = this.users.filter((u) => u.id !== id);
      this.totalItems = this.users.length;

      if (this.paginatedUsers.length === 0 && this.currentPage > 1) {
        this.currentPage--;
      }
    },

    /* ================= PAGINATION ================= */
    setPage(page: number) {
      this.currentPage = page;
    },
  },
});
