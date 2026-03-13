<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useProductStore } from "@/stores/productStore";
import CreateProduct from "@/components/useCreateProduct.vue";
import { type Product } from "@/types/product";
import { getProductAPI } from "@/services/apiProduct";
import { deleteProduct } from "@/utils/helper";
import { useLoginStore } from "@/stores/auth";
import { useRouter } from "vue-router";

const productStore = useProductStore();
const delete_Product = deleteProduct();
const router = useRouter();
const authStore = useLoginStore();

const showDialog = ref(false);
const selectedProduct = ref<Product | null>(null);

onMounted(async () => {
  await productStore.loadProducts();
});

// Mở giao diện tạo Product
const openCreate = () => {
  selectedProduct.value = null;
  showDialog.value = true;
};

// Mở giao diện sửa Product
const openEdit = async (product: Product) => {
  const res = await getProductAPI(product.id);
  selectedProduct.value = res.data;
  showDialog.value = true;
};

const handleLogout = () => {
  authStore.logout();
  router.push("/");
};
</script>
<template>
  <div class="p-6 bg-gray-100 min-h-screen dark:text-gray-800 dark:bg-gray-800">
    <div class="bg-white rounded-xl shadow overflow-hidden dark:bg-gray-400">
      <!-- Header -->
      <div
        class="bg-blue-600 text-white px-12 py-4 overflow-hidden flex items-center justify-between"
      >
        <h2 class="text-xl p-4 font-semibold">Product Management</h2>

        <div class="flex items-center justify-between gap-4">
          <button
            class="cursor-pointer bg-white p-2 text-blue-900 hover:bg-gray-300 rounded"
            @click="router.push('/users')"
          >
            User Management
          </button>
          <button
            class="cursor-pointer bg-white p-2 text-blue-900 hover:bg-gray-300 rounded"
            @click="openCreate"
          >
            + Add New product
          </button>
          <button
            @click="handleLogout"
            class="bg-red-400 text-white px-4 py-2 rounded shadow transition hover:bg-red-500 flex items-center gap-2"
          >
            <span
              ><img src="../assets/icons/logout.png" class="w-4 h-4"
            /></span>
            Logout
          </button>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead
            class="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-white"
          >
            <tr>
              <th class="p-4">#</th>
              <th class="p-4">Image</th>
              <th class="p-4">Title</th>
              <th class="p-4">Price</th>
              <th class="p-4">Category</th>
              <th class="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="product in productStore.paginatedUsers"
              :key="product.id"
              class="border-t hover:bg-gray-50 dark:hover:bg-gray-600 dark:text-white transition-colors"
            >
              <td class="p-4">{{ product.id }}</td>

              <td class="p-4">
                <img
                  :src="product.image"
                  class="w-12 h-12 rounded object-contain bg-gray-50"
                />
              </td>

              <td class="p-4">
                <span class="font-medium">{{ product.title }}</span>
              </td>

              <td class="p-4 font-bold text-blue-600">${{ product.price }}</td>

              <td class="p-4 text-sm text-gray-500 capitalize">
                {{ product.category }}
              </td>

              <td class="p-4 text-center">
                <div class="flex justify-center gap-3">
                  <button
                    class="hover:scale-125 transition-transform"
                    @click="openEdit(product)"
                  >
                    <i class="pi pi-cog text-gray-600"></i>
                  </button>
                  <button
                    class="hover:scale-125 transition-transform"
                    @click="
                      delete_Product(product.id, () =>
                        productStore.deleteProduct(product.id),
                      )
                    "
                  >
                    <i class="pi pi-times text-red-500 font-bold"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-between m-4">
          <!-- show data -->
          <div class="flex items-center gap-1 text-sm text-gray-700">
            Showing
            <span class="font-bold text-gray-900">{{
              productStore.showingData.currentMax
            }}</span>
            out of
            <span class="font-bold text-gray-900">{{
              productStore.showingData.total
            }}</span>
            entries
          </div>

          <!-- page -->
          <div class="flex items-center gap-4 dark:text-gray-800">
            <button
              @click="productStore.currentPage--"
              :disabled="productStore.currentPage === 1"
              class="px-3 py-1"
            >
              Previous
            </button>

            <button
              v-for="page in productStore.totalPages"
              :key="page"
              @click="productStore.currentPage = page"
              :class="[
                'px-3 py-1',
                productStore.currentPage === page
                  ? 'bg-blue-500 text-white'
                  : '',
              ]"
            >
              {{ page }}
            </button>

            <button
              @click="productStore.currentPage++"
              :disabled="productStore.currentPage === productStore.totalPages"
              class="px-3 py-1"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Dialog
    :visible="showDialog"
    modal
    :product-edit="selectedProduct"
    :showHeader="false"
    class="w-[600px] !bg-transparent !shadow-none !border-none"
  >
    <CreateProduct
      :product-edit="selectedProduct"
      @close="showDialog = false"
    />
  </Dialog>
</template>
