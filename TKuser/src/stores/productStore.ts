import { defineStore } from "pinia";
import { getProducts, creatNewProducts, updateProduct } from "@/services/api";
import { type Product } from "@/types/product";

export const useProductStore = defineStore("product", {
  state: () => ({
    products: [] as Product[],
    electronics: [] as Product[],
    jewelery: [] as Product[],
    menClothing: [] as Product[],
    womenClothing: [] as Product[],
    loading: false,
  }),
  actions: {
    async fetchProductsByCategory() {
      this.loading = true;
      try {
        const [resElec, resJew, resmenClo, reswomenClo] = await Promise.all([
          getProducts("electronics"),
          getProducts("jewelery"),
          getProducts("men's clothing"),
          getProducts("women's clothing"),
        ]);

        // Gán dữ liệu vào đúng vị trí
        this.electronics = resElec.data;
        this.jewelery = resJew.data;
        this.menClothing = resmenClo.data;
        this.womenClothing = reswomenClo.data;
      } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
      } finally {
        this.loading = false;
      }
    },

    // New product
    async createProduct(payload: any) {
      try {
        const res = await creatNewProducts(payload);
        const newProduct = res.data;

        if (newProduct.category === "electronics") {
          this.electronics.push(newProduct);
        } else if (newProduct.category === "jewelery") {
          this.jewelery.push(newProduct);
        } else if (newProduct.category === "men's clothing") {
          this.menClothing.push(newProduct);
        } else {
          this.womenClothing.push(newProduct);
        }

        return newProduct;
      } catch (error) {
        console.error(error);
      }
    },

    // Update
    async update_Product(id: number, payload: any) {
      const res = await updateProduct(id, payload);
      const updatedProduct = res.data;

      const categories = [
        "electronics",
        "jewelery",
        "menClothing",
        "womenClothing",
      ] as const;

      categories.forEach((product) => {
        const targetArray = this[product] as Product[];
        const index = targetArray.findIndex((p) => p.id === id);

        if (index !== -1) {
          targetArray[index] = {
            ...targetArray[index],
            ...updatedProduct,
          };
        }
      });

      return res.data;
    },
  },
});
