<script setup lang="ts">
import { ref } from "vue";
import { onMounted } from "vue";
import { useProductStore } from "@/stores/productStore";
import Carousel from "primevue/carousel";
import ProgressSpinner from "primevue/progressspinner";
import CreateProduct from "@/components/useCreateProduct.vue";
import { type Product } from "@/types/product";
import { getProductAPI } from "@/services/api";
import Menu from "primevue/menu";
import { computed } from "vue";

const productStore = useProductStore();

const search = ref("");
const showDialog = ref(false);
const selectedProduct = ref<Product | null>(null);

// Menu
const menu = ref();
const items = computed(() => [
  {
    label: "Options",
    items: [
      {
        label: "Sửa",
        icon: "pi pi-pencil",
        command: () => {
          if (selectedProduct.value) {
            openEdit(selectedProduct.value);
          }
        },
      },
      {
        label: "Xóa",
        icon: "pi pi-trash",
      },
    ],
  },
]);
const toggle = (event: any, data: Product) => {
  selectedProduct.value = data;
  menu.value.toggle(event);
};

onMounted(async () => {
  await productStore.fetchProductsByCategory();
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
</script>
<template>
  <div class="bg-gray-100 min-h-screen dark:text-gray-800 dark:bg-gray-800">
    <!-- Header -->
    <div
      class="bg-blue-500 text-white px-12 py-4 overflow-hidden flex items-center justify-between"
    >
      <h2 class="text-2xl">STORE</h2>
      <input
        type="search"
        v-model="search"
        placeholder="Tìm kiếm"
        class="input-standard w-full max-w-md"
      />
      <div class="flex gap-4 text-xl">
        <a href="/users">User Management</a>
        <a href="/">Login</a>
        <button class="cursor-pointer" @click="openCreate">Add product</button>
      </div>
    </div>

    <div class="container mx-auto px-20 py-2">
      <!-- Banner Hero -->
      <div class="h-[400px] w-full overflow-hidden rounded-xl">
        <img
          src="../assets/icons/banner.jpg"
          alt="banner hero"
          class="w-full h-full object-cover"
        />
      </div>

      <div class="container mx-auto py-2">
        <div v-if="productStore.loading" class="flex justify-center py-10">
          <ProgressSpinner />
        </div>

        <div v-else>
          <!-- Electronics -->
          <div
            class="flex justify-between items-center border-b-2 border-blue-600 mb-4 bg-white"
          >
            <h3
              class="bg-blue-600 text-white px-6 py-2 font-bold uppercase text-sm"
            >
              Điện tử
            </h3>
          </div>

          <Carousel
            :value="productStore.electronics"
            :numVisible="5"
            :numScroll="1"
            circular
          >
            <template #item="slotProps">
              <div
                class="relative border border-gray-100 m-1 p-3 bg-white hover:shadow-md transition-all"
              >
                <div class="relative mb-3 flex justify-center">
                  <div class="absolute top-0 right-0">
                    <Button
                      @click="toggle($event, slotProps.data)"
                      class="w-8 h-8 p-0 min-w-0 bg-white border border-gray-200 rounded-full hover:bg-gray-100"
                    >
                      <i class="pi pi-ellipsis-v text-gray-600 text-sm"></i>
                    </Button>
                    <Menu
                      ref="menu"
                      id="overlay_menu"
                      :model="items"
                      :popup="true"
                    />
                  </div>

                  <img
                    :src="slotProps.data.image"
                    class="h-40 object-contain w-full"
                  />
                </div>

                <div class="flex-grow">
                  <h4
                    class="text-sm font-medium text-gray-800 line-clamp-2 h-10 mb-2"
                  >
                    {{ slotProps.data.title }}
                  </h4>
                  <div class="text-red-600 font-bold text-lg">
                    ${{ slotProps.data.price }}
                  </div>
                </div>

                <button
                  class="mt-4 w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700"
                >
                  Thêm vào giỏ
                </button>
              </div>
            </template>
          </Carousel>

          <!-- Jewelery -->
          <div
            class="flex justify-between items-center border-b-2 border-blue-600 mb-4 bg-white"
          >
            <h3
              class="bg-blue-600 text-white px-6 py-2 font-bold uppercase text-sm"
            >
              Trang Sức
            </h3>
          </div>

          <Carousel
            :value="productStore.jewelery"
            :numVisible="5"
            :numScroll="1"
            circular
          >
            <template #item="slotProps">
              <div
                class="border border-gray-100 m-1 p-3 bg-white hover:shadow-md transition-all"
              >
                <div class="relative mb-3 flex justify-center">
                  <div class="absolute top-0 right-0">
                    <Button
                      @click="toggle($event, slotProps.data)"
                      class="w-8 h-8 p-0 min-w-0 bg-white border border-gray-200 rounded-full hover:bg-gray-100"
                    >
                      <i class="pi pi-ellipsis-v text-gray-600 text-sm"></i>
                    </Button>
                    <Menu
                      ref="menu"
                      id="overlay_menu"
                      :model="items"
                      :popup="true"
                    />
                  </div>

                  <img
                    :src="slotProps.data.image"
                    class="h-40 object-contain w-full"
                  />
                </div>

                <div class="flex-grow">
                  <h4
                    class="text-sm font-medium text-gray-800 line-clamp-2 h-10 mb-2"
                  >
                    {{ slotProps.data.title }}
                  </h4>
                  <div class="text-red-600 font-bold text-lg">
                    ${{ slotProps.data.price }}
                  </div>
                </div>

                <button
                  class="mt-4 w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700"
                >
                  Thêm vào giỏ
                </button>
              </div>
            </template>
          </Carousel>

          <!-- Men's clothing -->
          <div
            class="flex justify-between items-center border-b-2 border-blue-600 mb-4 bg-white"
          >
            <h3
              class="bg-blue-600 text-white px-6 py-2 font-bold uppercase text-sm"
            >
              Áo Nam
            </h3>
          </div>

          <Carousel
            :value="productStore.menClothing"
            :numVisible="5"
            :numScroll="1"
            circular
          >
            <template #item="slotProps">
              <div
                class="border border-gray-100 m-1 p-3 bg-white hover:shadow-md transition-all"
              >
                <div class="relative mb-3 flex justify-center">
                  <div class="absolute top-0 right-0">
                    <Button
                      @click="toggle($event, slotProps.data)"
                      class="w-8 h-8 p-0 min-w-0 bg-white border border-gray-200 rounded-full hover:bg-gray-100"
                    >
                      <i class="pi pi-ellipsis-v text-gray-600 text-sm"></i>
                    </Button>
                    <Menu
                      ref="menu"
                      id="overlay_menu"
                      :model="items"
                      :popup="true"
                    />
                  </div>

                  <img
                    :src="slotProps.data.image"
                    class="h-40 object-contain w-full"
                  />
                </div>

                <div class="flex-grow">
                  <h4
                    class="text-sm font-medium text-gray-800 line-clamp-2 h-10 mb-2"
                  >
                    {{ slotProps.data.title }}
                  </h4>
                  <div class="text-red-600 font-bold text-lg">
                    ${{ slotProps.data.price }}
                  </div>
                </div>

                <button
                  class="mt-4 w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700"
                >
                  Thêm vào giỏ
                </button>
              </div>
            </template>
          </Carousel>

          <!-- Women's clothing -->
          <div
            class="flex justify-between items-center border-b-2 border-blue-600 mb-4 bg-white"
          >
            <h3
              class="bg-blue-600 text-white px-6 py-2 font-bold uppercase text-sm"
            >
              Trang Sức
            </h3>
          </div>

          <Carousel
            :value="productStore.womenClothing"
            :numVisible="5"
            :numScroll="1"
            circular
          >
            <template #item="slotProps">
              <div
                class="border border-gray-100 m-1 p-3 bg-white hover:shadow-md transition-all"
              >
                <div class="relative mb-3 flex justify-center">
                  <div class="absolute top-0 right-0">
                    <Button
                      @click="toggle($event, slotProps.data)"
                      class="w-8 h-8 p-0 min-w-0 bg-white border border-gray-200 rounded-full hover:bg-gray-100"
                    >
                      <i class="pi pi-ellipsis-v text-gray-600 text-sm"></i>
                    </Button>
                    <Menu
                      ref="menu"
                      id="overlay_menu"
                      :model="items"
                      :popup="true"
                    />
                  </div>

                  <img
                    :src="slotProps.data.image"
                    class="h-40 object-contain w-full"
                  />
                </div>

                <div class="flex-grow">
                  <h4
                    class="text-sm font-medium text-gray-800 line-clamp-2 h-10 mb-2"
                  >
                    {{ slotProps.data.title }}
                  </h4>
                  <div class="text-red-600 font-bold text-lg">
                    ${{ slotProps.data.price }}
                  </div>
                </div>

                <button
                  class="mt-4 w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700"
                >
                  Thêm vào giỏ
                </button>
              </div>
            </template>
          </Carousel>
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
<style scoped>
/* Đảm bảo mỗi sản phẩm chiếm đúng 1/5 chiều rộng khung hình */
:deep(.p-carousel-item) {
  flex: 0 0 20% !important;
}

/* Tùy chỉnh chiều cao cố định */
.product-card-custom {
  display: flex;
  flex-direction: column;
  height: 480px;
  justify-content: space-between;
}
</style>
