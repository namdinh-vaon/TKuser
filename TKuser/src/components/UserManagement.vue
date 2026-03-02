<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import Dialog from "primevue/dialog";
import CreateUser from "./CreateUser.vue";
import api from "@/services/api";
import type { ApiUser } from "@/types/user";
import { useDeleteUser } from "../services/deleteUser";

export interface User {
  id: number;
  name: {
    firstname: string;
    lastname: string;
  };
  email: string;
  username: string;
  password: string;
  avatar: string;
  date: string;
  role: string;
  status: "Active" | "Inactive" | "Suspended";
}

const showDialog = ref(false);
const users = ref<User[]>([]);
const selectedUser = ref<ApiUser | null>(null);
const { deleteUser } = useDeleteUser();

// Sửa user
const updateUser = (updatedUser: any) => {
  const index = users.value.findIndex((u) => u.id === updatedUser.id);

  if (index !== -1) {
    users.value[index] = updatedUser;
  }
};

// Mở dialog update
const openEdit = async (user: any) => {
  const res = await api.get(`/users/${user.id}`);
  selectedUser.value = res.data;
  showDialog.value = true;
};

// Add user
const addUser = (user: any) => {
  const maxId = users.value.length
    ? Math.max(...users.value.map((u) => u.id))
    : 0;
  const newId = maxId + 1;

  users.value.push({
    id: newId,
    name: user.name,
    email: user.email,
    username: user.username,
    password: user.password,
    avatar: "https://i.pravatar.cc/150?img=" + user.id,
    date: new Date().toLocaleDateString(),
    role: user.role || "User",
    status: "Active",
  });

  currentPage.value = 1;
};

const loadUsers = async () => {
  try {
    const res = await api.get("/users");

    users.value = res.data.map((u: any) => ({
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
  } catch (err) {
    console.log(err);
  }
};
onMounted(loadUsers);

const statusColor = (status: string) => {
  if (status === "Active") return "bg-green-500";
  if (status === "Suspended") return "bg-red-500";
  return "bg-yellow-500";
};

const currentPage = ref(1);
const pageSize = 5;

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return users.value.slice(start, end);
});

const totalPages = computed(() => Math.ceil(users.value.length / pageSize));

const removeUser = (id: number) => {
  users.value = users.value.filter((u) => u.id !== id);
};
</script>

<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="bg-white rounded-xl shadow overflow-hidden">
      <!-- Header -->
      <div class="bg-blue-500 text-white px-6 py-4 flex justify-between">
        <h2 class="text-xl font-semibold">User Management</h2>

        <div class="flex gap-3">
          <button class="bg-white text-gray-700 px-4 py-2 rounded shadow">
            Export to Excel
          </button>

          <button
            class="bg-white text-gray-700 px-4 py-2 rounded shadow"
            @click="
              () => {
                selectedUser = null;
                showDialog = true;
              }
            "
          >
            + Add New User
          </button>
        </div>
      </div>

      <!-- Table -->
      <table class="w-full text-left">
        <thead class="bg-gray-100 text-gray-600">
          <tr>
            <th class="p-4">#</th>
            <th>Name</th>
            <th>Date Created</th>
            <th>Role</th>
            <th>Status</th>
            <th class="text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="user in paginatedUsers"
            :key="user.id"
            class="border-t hover:bg-gray-50"
          >
            <td class="p-4">{{ user.id }}</td>

            <!-- Name + avatar -->
            <td class="flex items-center gap-3 py-3">
              <img
                :src="user.avatar"
                class="w-10 h-10 rounded-full object-cover"
              />
              <span class="font-medium"
                >{{ user.name.firstname }} {{ user.name.lastname }}</span
              >
            </td>

            <td>{{ user.date }}</td>
            <td>{{ user.role }}</td>

            <!-- Status -->
            <td>
              <div class="flex items-center gap-2">
                <span
                  class="w-3 h-3 rounded-full"
                  :class="statusColor(user.status)"
                ></span>
                {{ user.status }}
              </div>
            </td>

            <!-- Action -->
            <td class="text-center">
              <button class="text-blue-500 mr-3" @click="openEdit(user)">
                ⚙️
              </button>
              <button
                class="text-red-500"
                @click="deleteUser(user.id, () => removeUser(user.id))"
              >
                ❌
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex justify-end gap-2 m-4">
        <!-- page -->
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-3 py-1"
        >
          Previous
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
          :class="[
            'px-3 py-1 ',
            currentPage === page ? 'bg-blue-500 text-white' : '',
          ]"
        >
          {{ page }}
        </button>

        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-3 py-1"
        >
          Next
        </button>
      </div>

      <!-- Footer -->
    </div>
  </div>
  <Dialog
    v-model:visible="showDialog"
    modal
    :showHeader="false"
    class="w-[480px] !bg-transparent !shadow-none !border-none"
  >
    <CreateUser
      v-if="showDialog"
      :userEdit="selectedUser"
      @close="showDialog = false"
      @created="addUser"
      @updated="updateUser"
    />
  </Dialog>
</template>
