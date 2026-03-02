<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import api from "@/services/api";
import CreateUser from "./CreateUser.vue";
import { useLoginStore } from "@/Store/loginStore";

const router = useRouter();

const email = ref("");
const password = ref("");
const remember = ref(false);
const showPassword = ref(false);
const loading = ref(false);
const showDialog = ref(false);
const loginStore = useLoginStore();

const login = async () => {
  if (!email.value || !password.value) {
    alert("Vui lòng nhập đầy đủ thông tin");
    return;
  }

  try {
    loading.value = true;
    await loginStore.login(email.value, password.value);

    alert("Đăng nhập thành công!");

    router.push("/users");
  } catch (err) {
    alert("Sai tài khoản hoặc mật khẩu");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="bg-blue-500 text-white text-center py-6">
        <h1
          class="text-2xl font-semibold flex items-center justify-center gap-2"
        >
          <img src="./icons/padlock.png" class="w-6 h-6" /> Login
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
            class="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
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
              class="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              class="absolute right-3 top-2"
              @click="showPassword = !showPassword"
            >
              <img src="./icons/eye.png" class="w-6 h-6" />
            </button>
          </div>
        </div>

        <!-- Remember -->
        <div class="flex justify-between text-sm">
          <label class="flex items-center gap-2">
            <input type="checkbox" v-model="remember" />
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
