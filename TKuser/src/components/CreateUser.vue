<script setup lang="ts">
import { ref, watch } from "vue";
import api from "@/services/api";
import { computed } from "vue";
import type { ApiUser } from "@/types/user";
import { useDeleteUser } from "../services/deleteUser";

const props = defineProps<{
  userEdit?: ApiUser | null;
}>();

const title = computed(() =>
  props.userEdit ? "Update User" : "Create New User",
);

const emit = defineEmits(["close", "created", "updated", "deleted"]);

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const role = ref("");
const password = ref("");
const confirmPassword = ref("");

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const loading = ref(false);
const { deleteUser } = useDeleteUser();

watch(
  () => props.userEdit,
  (user) => {
    if (!user) return;

    firstName.value = user.name?.firstname || "";
    lastName.value = user.name?.lastname || "";
    email.value = user.email || "";
    role.value = user.role || "";
  },
  { immediate: true },
);

// Create user
const createUser = async () => {
  const res = await api.post("/users", {
    email: email.value,
    username: email.value,
    password: password.value,
    name: {
      firstname: firstName.value,
      lastname: lastName.value,
    },
    role: role.value,
  });

  emit("created", {
    id: res.data.id,
    email: email.value,
    username: email.value,
    password: password.value,
    name: {
      firstname: firstName.value,
      lastname: lastName.value,
    },
    role: role.value,
  });
};

// Update user
const updateUser = async () => {
  if (!props.userEdit) return;

  const res = await api.put(`/users/${props.userEdit.id}`, {
    id: props.userEdit.id,
    email: email.value,
    username: email.value,
    password: password.value,
    name: {
      firstname: firstName.value,
      lastname: lastName.value,
    },
    role: role.value,
  });

  emit("updated", res.data);
};

// So khớp password
const handleSubmit = async () => {
  if (password.value !== confirmPassword.value) {
    alert("Password không khớp!");
    return;
  }

  try {
    loading.value = true;

    if (props.userEdit) {
      await updateUser();
    } else {
      await createUser();
    }

    emit("close");
  } catch (err) {
    console.log(err);
  } finally {
    loading.value = false;
  }
};

// Delete user
const handleDelete = () => {
  if (!props.userEdit) return;

  deleteUser(props.userEdit.id, () => {
    emit("deleted");
  });
};
</script>
<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <!-- HEADER -->
    <div
      class="bg-blue-500 text-white p-4 flex items-center justify-center gap-3"
    >
      <div
        class="w-10 h-10 rounded-full bg-white text-blue-500 flex items-center justify-center text-3xl font-bold"
      >
        +
      </div>
      <h2 class="text-xl font-semibold">{{ title }}</h2>
    </div>

    <!-- FORM -->
    <div class="p-6 space-y-4">
      <!-- NAME -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="font-medium">First Name</label>
          <input
            v-model="firstName"
            class="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="John"
          />
        </div>

        <div>
          <label class="font-medium">Last Name</label>
          <input
            v-model="lastName"
            class="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Doe"
          />
        </div>
      </div>

      <!-- EMAIL -->
      <div>
        <label class="font-medium">Email</label>
        <input
          v-model="email"
          class="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="john.doe@example.com"
        />
      </div>

      <!-- ROLE -->
      <div>
        <label class="font-medium">Role</label>
        <select
          v-model="role"
          class="w-full border rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Role</option>
          <option>Admin</option>
          <option>Publisher</option>
          <option>Reviewer</option>
          <option>Moderator</option>
        </select>
      </div>

      <!-- PASSWORD -->
      <div class="grid grid-cols-2 gap-4">
        <!-- Password -->
        <div>
          <label class="font-medium">Password</label>
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

        <!-- Confirm Password -->
        <div>
          <label class="font-medium">Confirm Password</label>
          <div class="relative">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              v-model="confirmPassword"
              placeholder="••••••••••"
              class="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="button"
              class="absolute right-3 top-2"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <img src="./icons/eye.png" class="w-6 h-6" />
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
          class="bg-red-500 text-white py-2 rounded hover:bg-red-600 transition w-full"
        >
          Delete User
        </button>

        <button
          class="border border-blue-500 text-blue-500 py-2 rounded hover:bg-blue-50 transition w-full"
          @click="emit('close')"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>
