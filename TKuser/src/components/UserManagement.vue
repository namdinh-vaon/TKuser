<script setup lang="ts">
// Component User Management - Hiển thị trang quản lý người dùng
import { ref, onMounted } from "vue";
import Dialog from "primevue/dialog";
import CreateUser from "./CreateUser.vue";
import api from "@/services/api";
import { useUserStore, type User } from "@/stores/user";
import { useDeleteUser } from "../services/api";

const showDialog = ref(false);
const closeDialog = () => {
  showDialog.value = false;
};
const selectedUser = ref<User | null>(null);
const { deleteUser } = useDeleteUser();
const userStore = useUserStore();

const openCreate = () => {
  selectedUser.value = null;
  showDialog.value = true;
};

onMounted(() => {
  userStore.loadUsers();
});

// Edit
const openEdit = async (user: any) => {
  const res = await api.get(`/users/${user.id}`);
  selectedUser.value = res.data;
  showDialog.value = true;
};

const statusColor = (status: string) => {
  if (status === "Active") return "bg-green-500";
  if (status === "Suspended") return "bg-red-500";
  return "bg-yellow-500";
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
            @click="openCreate"
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
            v-for="user in userStore.paginatedUsers"
            :key="user.id"
            class="border-t hover:bg-gray-50"
          >
            <td class="p-4 text-black">{{ user.id }}</td>

            <!-- Name + avatar -->
            <td class="flex items-center gap-3 py-3">
              <img
                :src="user.avatar"
                class="w-10 h-10 rounded-full object-cover"
              />
              <span class="font-medium text-black"
                >{{ user.name.firstname }} {{ user.name.lastname }}</span
              >
            </td>

            <td class="text-black">{{ user.date }}</td>
            <td class="text-black">{{ user.role }}</td>

            <!-- Status -->
            <td>
              <div class="flex items-center text-black gap-2">
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
                @click="
                  deleteUser(user.id, () => userStore.deleteUser(user.id))
                "
              >
                ❌
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex justify-between m-4">
        <!-- show data -->
        <div class="flex items-center gap-1 text-sm text-gray-700">
          Showing
          <span class="font-bold text-gray-900">{{
            userStore.showingData.currentMax
          }}</span>
          out of
          <span class="font-bold text-gray-900">{{
            userStore.showingData.total
          }}</span>
          entries
        </div>

        <!-- page -->
        <div class="flex items-center gap-4">
          <button
            @click="userStore.currentPage--"
            :disabled="userStore.currentPage === 1"
            class="px-3 py-1 text-black"
          >
            Previous
          </button>

          <button
            v-for="page in userStore.totalPages"
            :key="page"
            @click="userStore.currentPage = page"
            :class="[
              'px-3 py-1 text-black ',
              userStore.currentPage === page ? 'bg-blue-500 text-white' : '',
            ]"
          >
            {{ page }}
          </button>

          <button
            @click="userStore.currentPage++"
            :disabled="userStore.currentPage === userStore.totalPages"
            class="px-3 py-1 text-black"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Footer -->
    </div>
  </div>
  <Dialog
    :visible="showDialog"
    @update:visible="showDialog = $event"
    modal
    :showHeader="false"
    class="w-[480px] !bg-transparent !shadow-none !border-none"
  >
    <CreateUser :userEdit="selectedUser" @close="closeDialog" />
  </Dialog>
</template>
