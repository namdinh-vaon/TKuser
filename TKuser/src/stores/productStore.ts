import { defineStore } from "pinia";
import {
  getProducts,
  creatNewProducts,
  updateProduct,
} from "@/services/apiProduct";
import { type Product } from "@/types/product";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [] as Product[],

    totalItems: 0,
    currentPage: 1,
    pageSize: 5,
  }),

  getters: {
    paginatedUsers(state) {
      const start = (state.currentPage - 1) * state.pageSize;
      return state.products.slice(start, start + state.pageSize);
    },

    totalPages(state) {
      return Math.ceil(state.products.length / state.pageSize);
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
    async loadProducts() {
      const res = await getProducts();

      this.products = res.data.map((u: any) => ({
        id: u.id,
        title: u.title,
        price: u.price,
        description: u.description,
        category: u.category,
        image: u.image,
      }));

      this.totalItems = this.products.length;
    },

    async createProduct(payload: any) {
      await creatNewProducts(payload);

      const newId =
        this.products.length > 0
          ? Math.max(...this.products.map((u) => u.id)) + 1
          : 1;

      const newProduct: Product = {
        id: newId,

        title: payload.title,
        price: payload.price,
        description: payload.description,
        category: payload.category,
        image: payload.image,
      };

      this.products.push(newProduct);
      this.totalItems = this.products.length;

      return newProduct;
    },

    /* ================= UPDATE ================= */
    async update_Product(id: number, payload: any) {
      const res = await updateProduct(id, payload);

      const index = this.products.findIndex((u) => u.id === id);

      if (index !== -1) {
        this.products[index] = {
          ...this.products[index],
          ...payload,
        };
      }

      return res.data;
    },

    /* ================= DELETE ================= */
    async deleteProduct(id: number) {
      this.products = this.products.filter((u) => u.id !== id);
      this.totalItems = this.products.length;

      if (this.paginatedUsers.length === 0 && this.currentPage > 1) {
        this.currentPage--;
      }
    },
  },
});
