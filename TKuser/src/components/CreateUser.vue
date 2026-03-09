<script setup lang="ts">
// Component Create or Update - Hiển thị dialog tạo mới hoặc cập nhật người dùng
import { ref, watch } from "vue";
import { deleteUser } from "@/utils/helper";
import { useUserStore } from "@/stores/userStore";
import { type User } from "../types/user";
import { useAppToast } from "@/utils/helper";

const delete_User = deleteUser();
const userStore = useUserStore();
const { showSuccess, showError } = useAppToast();

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const role = ref("");
const password = ref("");
const confirmPassword = ref("");

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);

const emit = defineEmits(["close"]);

const props = defineProps<{
  userEdit?: User | null;
}>();

watch(
  () => props.userEdit,
  (user) => {
    if (!user) return;

    firstName.value = user.name.firstname;
    lastName.value = user.name.lastname;
    email.value = user.email;
    password.value = user.password;
    role.value = user.role;
  },
  { immediate: true },
);

const handleSubmit = async () => {
  if (!props.userEdit) {
    if (password.value !== confirmPassword.value) {
      showError("Mật khẩu không trùng khớp!");
      return;
    }
  }

  try {
    loading.value = true;

    const payload = {
      email: email.value,
      username: email.value,
      password: password.value,
      name: {
        firstname: firstName.value,
        lastname: lastName.value,
      },
      role: role.value,
    };

    if (!props.userEdit) {
      await userStore.createUser(payload);
      showSuccess("Tạo thành công!");
    } else {
      await userStore.updateUser(props.userEdit.id, payload);
      showSuccess("Cập nhật thành công!");
    }

    emit("close");
  } catch (error) {
    showError(props.userEdit ? "Không thể cập nhật!" : "Không thể tạo!");
    console.error(props.userEdit ? "Lỗi khi cập nhật!" : "Lỗi khi tạo!", error);
  } finally {
    loading.value = false;
  }
};

const handleDelete = () => {
  if (!props.userEdit) return;

  delete_User(props.userEdit.id, () => {
    userStore.deleteUser(props.userEdit!.id);
    emit("close");
  });
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden dark:bg-gray-400">
    <!-- HEADER -->
    <div
      class="bg-blue-500 text-white p-4 flex items-center justify-center gap-3"
    >
      <div
        class="w-10 h-10 rounded-full bg-white text-blue-500 flex items-center justify-center text-3xl font-bold"
      >
        +
      </div>
      <h2 class="text-xl font-semibold">
        {{ props.userEdit ? "Update User" : "Create New User" }}
      </h2>
    </div>

    <!-- FORM -->
    <div class="p-6 space-y-4">
      <!-- NAME -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="font-medium text-black">First Name</label>
          <input
            v-model="firstName"
            class="input-standard"
            placeholder="John"
          />
        </div>

        <div>
          <label class="font-medium text-black">Last Name</label>
          <input v-model="lastName" class="input-standard" placeholder="Doe" />
        </div>
      </div>

      <!-- EMAIL -->
      <div>
        <label class="font-medium text-black">Email</label>
        <input
          v-model="email"
          class="input-standard"
          placeholder="john.doe@example.com"
        />
      </div>

      <!-- ROLE -->
      <div>
        <label class="font-medium text-black">Role</label>
        <select v-model="role" class="input-standard">
          <option value="">Select Role</option>
          <option>Admin</option>
          <option>Publisher</option>
          <option>Reviewer</option>
          <option>Moderator</option>
        </select>
      </div>

      <!-- PASSWORD -->
      <div :class="[props.userEdit ? 'block' : 'grid grid-cols-2 gap-4']">
        <!-- Password -->
        <div>
          <label class="font-medium text-black">Password</label>
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

        <!-- Confirm Password -->
        <div v-if="!props.userEdit">
          <label class="font- text-black">Confirm Password</label>
          <div class="relative">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              placeholder="••••••••••"
              class="input-standard"
            />
            <button
              type="button"
              class="absolute right-3 top-2"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <img src="../assets/icons/eye.png" class="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      <!-- BUTTONS -->
      <div class="space-y-3 pt-2">
        <button
          @click="handleSubmit"
          :disabled="loading"
          class="bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition w-full disabled:opacity-50"
        >
          {{
            loading
              ? props.userEdit
                ? "Updating..."
                : "Creating..."
              : props.userEdit
                ? "Update User"
                : "Create User"
          }}
        </button>

        <button
          v-if="props.userEdit"
          @click="handleDelete"
          class="bg-red-400 text-white py-2 rounded hover:bg-red-500 transition w-full"
        >
          Delete User
        </button>

        <button
          class="border border-blue-500 text-blue-500 py-2 rounded hover:bg-blue-50 dark:hover:bg-gray-300 transition w-full"
          @click="emit('close')"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
