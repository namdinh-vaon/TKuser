<script setup lang="ts">
// Component Login - Hiển thị trang đăng nhập
import { ref } from "vue";
import { useRouter } from "vue-router";
import CreateUser from "../components/useCreateUser.vue";
import { useLoginStore } from "@/stores/auth";
import { useAppToast } from "@/utils/helper";

const { showSuccess, showError } = useAppToast();
const router = useRouter()
const loginStore = useLoginStore();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const showDialog = ref(false);
const checked = ref(false);

const login = async () => {
  try {
    loading.value = true;
    await loginStore.login(email.value, password.value);

    showSuccess("Đăng nhập thành công!")

    router.push("/product");
  } catch (error) {
    showError("Email hoặc mật khẩu không chính xác")
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-100 dark:text-gray-800 dark:bg-gray-800"
  >
    <div
      class="appearance-none w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden dark:bg-gray-300"
    >
      <!-- Header -->
      <div class="bg-blue-500 text-white text-center py-6">
        <h1
          class="text-2xl font-semibold flex items-center justify-center gap-2"
        >
          <img src="../assets/icons/padlock.png" class="w-6 h-6" /> Login
        </h1>
      </div>

      <!-- Form -->
      <div class="p-6 space-y-4">
        <p class="text-center text-gray-500">Sign in to your account</p>

        <!-- Email -->
        <div>
          <label class="block font-medium mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            placeholder="user@example.com"
            class="input-standard"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block font-medium mb-1">Password</label>
          <div class="relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="password"
              placeholder="••••••••••"
              class="input-standard"
            />
            <button
              type="button"
              class="absolute right-3 top-2"
              @click="showPassword = !showPassword"
            >
              <img src="../assets/icons/eye.png" class="w-6 h-6" />
            </button>
          </div>
        </div>

        <!-- Remember -->
        <div class="flex justify-between text-sm">
          <label class="flex items-center gap-2 cursor-pointer">
            <Checkbox v-model="checked" binary />
            Remember me
          </label>

          <a class="text-blue-500 hover:underline cursor-pointer">
            Forgot password?
          </a>
        </div>

        <!-- Button -->
        <button
          class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
          @click="login"
          :disabled="loading"
        >
          {{ loading ? "Signing in..." : "Sign In" }}
        </button>

        <div class="text-center text-gray-500">Don't have an account?</div>

        <button
          class="w-full text-center border rounded-lg py-2 text-blue-500 hover:bg-gray-100"
          @click="showDialog = true"
        >
          Create an Account
        </button>

        <Dialog
          v-model:visible="showDialog"
          modal
          :showHeader="false"
          class="w-[480px] !bg-transparent !shadow-none !border-none"
        >
          <CreateUser @close="showDialog = false" />
        </Dialog>
      </div>
    </div>
  </div>
</template>
