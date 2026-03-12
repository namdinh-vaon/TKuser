<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { type Product } from "../types/product";
import { useAppToast } from "@/utils/helper";
import InputNumber from "primevue/inputnumber";
import { useProductStore } from "@/stores/productStore";
import { deleteProduct } from "@/utils/helper";

const { showSuccess, showError } = useAppToast();
const useProduct = useProductStore();
const delete_Product = deleteProduct();

const title = ref("");
const price = ref<number | null>(null);
const description = ref("");
const category = ref("");
const image = ref("");
const imageUrl = ref("");

const loading = ref(false);

const emit = defineEmits(["close"]);

const props = defineProps<{
  productEdit?: Product | null;
}>();

// Chuyền dữ liệu khi update
watch(
  () => props.productEdit,
  (product) => {
    if (product) {
      title.value = product.title;
      price.value = product.price;
      description.value = product.description;
      category.value = product.category;
      imageUrl.value = product.image;
      image.value = product.image;
    } else {
      title.value = "";
      price.value = null;
      description.value = "";
      category.value = "";
      imageUrl.value = "";
      image.value = "";
    }
  },
  { immediate: true },
);

// Button Create/Update
const handleSubmit = async () => {
  try {
    loading.value = true;

    const payload = {
      title: title.value,
      price: price.value,
      description: description.value,
      category: category.value,
      image: image.value,
    };

    if (!props.productEdit) {
      await useProduct.createProduct(payload);
      showSuccess("Tạo thành công!");
    } else {
      await useProduct.update_Product(props.productEdit.id, payload);
      showSuccess("Cập nhật thành công!");
    }
    emit("close");
  } catch (error) {
    showError(props.productEdit ? "Không thể cập nhật!" : "Không thể tạo!");
    console.error(
      props.productEdit ? "Lỗi khi cập nhật!" : "Lỗi khi tạo!",
      error,
    );
  } finally {
    loading.value = false;
  }
};

// Tránh trống thông tin
const isFormInvalid = computed(() => {
  return !title.value.trim() || price.value === null || !category.value;
});

// Delete
const handleDelete = () => {
  if (!props.productEdit) return;

  delete_Product(props.productEdit.id, () => {
    useProduct.deleteProduct(props.productEdit!.id);
    emit("close");
  });
};
</script>
<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-400">
    <div class="flex justify-start items-center gap-3 border-b border-black">
      <div class="w-1 h-12 bg-blue-700"></div>
      <h3 class="text-black text-2xl">
        <template v-if="props.productEdit"
          ><span class="text-blue-700">Update</span> Product</template
        >
        <template v-else>
          <span class="text-blue-700">Add</span> New Product
        </template>
      </h3>
    </div>

    <!-- FORM -->
    <div class="p-6 space-y-4">
      <!-- Title -->
      <div class="w-full">
        <div>
          <label class="block text-xl font-medium text-black">Title</label>
          <input v-model="title" class="input-standard" />
        </div>
      </div>

      <!-- Price -->
      <div>
        <label class="block text-xl font-medium text-black">Price(USD)</label>
        <div
          class="input-standard flex items-center overflow-hidden p-0 focus-within:ring-2 focus-within:ring-blue-500"
        >
          <span
            class="bg-gray-100 font-bold px-3 py-2 text-gray-700 border-r border-gray-900"
            >$</span
          >
          <InputNumber
            v-model="price"
            :minFractionDigits="2"
            fluid
            inputClass="p-inputnumber-input w-full px-3 py-2 border-none  bg-transparent"
          />
        </div>
      </div>

      <!-- Category -->
      <div>
        <label class="font-medium text-xl text-black">Category</label>
        <select v-model="category" class="input-standard">
          <option value="">Select Category</option>
          <option>electronics</option>
          <option>jewelery</option>
          <option>men's clothing</option>
          <option>women's clothing</option>
        </select>
      </div>

      <!-- Description  -->
      <div>
        <label class="block font-medium text-xl text-black">Description </label>
        <textarea
          v-model="description"
          rows="4 "
          cols="30"
          class="input-standard w-full"
          placeholder="Nhập mô tả sản phẩm..."
        />
      </div>

      <!-- Image  -->
      <div class="flex gap-4 w-full">
        <div class="flex-shrink-0">
          <label class="font-medium text-black text-sm">Image Preview</label>
          <div
            class="w-20 h-20 border-2 border-gray-400 rounded-lg flex justify-center items-center overflow-hiden bg-gray-50"
          >
            <img
              v-if="imageUrl"
              :src="imageUrl"
              class="h-full W-full object-cover"
            />
            <i v-else class="pi pi-image text-gray-400 text-2xl"></i>
          </div>
        </div>
        <div class="flex-grow">
          <label class="block font-medium text-black mb-1 text-sm"
            >Image URL</label
          >
          <input
            v-model="imageUrl"
            class="input-standard w-full"
            placeholder="Nhập liên kết ảnh..."
          />
        </div>
      </div>
    </div>

    <!--- Button --->
    <div class="gap-3 flex justify-end pb-4 pr-4">
      <button
        class="border border-blue-500 text-blue-500 p-2 rounded hover:bg-blue-50 dark:hover:bg-gray-300 transition"
        @click="emit('close')"
      >
        Cancel
      </button>

      <button
        class="bg-red-400 text-white p-2 rounded hover:bg-red-500 transition"
        @click="handleDelete"
      >
        Delete
      </button>

      <button
        @click="handleSubmit"
        :disabled="loading || isFormInvalid"
        class="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition disabled:opacity-50 p-2"
      >
        {{ loading ? "Save Product..." : "Save Product" }}
      </button>
    </div>
  </div>
</template>
