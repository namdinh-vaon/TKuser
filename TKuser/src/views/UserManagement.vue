<script setup lang="ts">
// Component User Management - Hiển thị trang quản lý người dùng
import { ref, onMounted } from "vue";
import CreateUser from "../components/useCreateUser.vue";
import { useUserStore } from "@/stores/userStore";
import { type User } from "../types/user";
import { getUserAPI } from "../services/apiUser";
import { useLoginStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { deleteUser } from "@/utils/helper";

const showDialog = ref(false);

const selectedUser = ref<User | null>(null);
const delete_User = deleteUser();
const userStore = useUserStore();
const router = useRouter();
const authStore = useLoginStore();

const openCreate = () => {
  selectedUser.value = null;
  showDialog.value = true;
};

onMounted(() => {
  userStore.loadUsers();
});

// Mở giao diện Update
const openEdit = async (user: User) => {
  const res = await getUserAPI(user.id);
  selectedUser.value = res.data;
  showDialog.value = true;
};

const statusColor = (status: string) => {
  if (status === "Active") return "bg-green-500";
  if (status === "Suspended") return "bg-red-500";
  return "bg-yellow-500";
};

// Log out
const handleLogout = () => {
  authStore.logout();
  router.push("/");
};
</script>

<template>
  <div class="p-6 bg-gray-100 min-h-screen dark:text-gray-800 dark:bg-gray-800">
    <div class="bg-white rounded-xl shadow overflow-hidden dark:bg-gray-400">
      <!-- Header -->
      <div class="bg-blue-600 text-white px-6 py-4 flex justify-between">
        <h2 class="text-xl font-semibold">User Management</h2>

        <div class="flex flex-wrap gap-3">
          <button
            @click="router.push('/product')"
            class="bg-white text-gray-700 px-4 py-2 rounded shadow transition hover:bg-gray-300 dark:text-gray-900 dark:bg-gray-400"
          >
            Product Management
          </button>

          <button
            class="bg-white text-gray-700 px-4 py-2 rounded shadow transition hover:bg-gray-300 dark:text-gray-900 dark:bg-gray-400 dark:hover:bg-gray-300"
          >
            Export to Excel
          </button>

          <button
            class="bg-white text-gray-700 px-4 py-2 rounded shadow transition hover:bg-gray-300 dark:text-gray-900 dark:bg-gray-400 dark:hover:bg-gray-300"
            @click="openCreate"
          >
            + Add New User
          </button>

          <button
            class="bg-red-400 text-white px-4 py-2 rounded shadow transition hover:bg-red-500 flex items-center gap-2"
            @click="handleLogout"
          >
            <span
              ><img src="../assets/icons/logout.png" class="w-4 h-4"
            /></span>
            Logout
          </button>
        </div>
      </div>

      <!-- Table -->
      <table class="w-full text-left">
        <thead class="bg-gray-100 text-gray-700 dark:bg-gray-500">
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
            class="border-t hover:bg-gray-50 dark:hover:bg-gray-300"
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
              <div class="flex justify-center items-center gap-3">
                <button
                  class="hover:scale-125 transition-transform"
                  @click="openEdit(user)"
                >
                  <i class="pi pi-cog text-gray-600"></i>
                </button>

                <button
                  class="hover:scale-125 transition-transform"
                  @click="
                    delete_User(user.id, () => userStore.deleteUser(user.id))
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
            userStore.showingData.currentMax
          }}</span>
          out of
          <span class="font-bold text-gray-900">{{
            userStore.showingData.total
          }}</span>
          entries
        </div>

        <!-- page -->
        <div class="flex items-center gap-4 dark:text-gray-800">
          <button
            @click="userStore.currentPage--"
            :disabled="userStore.currentPage === 1"
            class="px-3 py-1"
          >
            Previous
          </button>

          <button
            v-for="page in userStore.totalPages"
            :key="page"
            @click="userStore.currentPage = page"
            :class="[
              'px-3 py-1',
              userStore.currentPage === page ? 'bg-blue-500 text-white' : '',
            ]"
          >
            {{ page }}
          </button>

          <button
            @click="userStore.currentPage++"
            :disabled="userStore.currentPage === userStore.totalPages"
            class="px-3 py-1"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
  <Dialog
    :visible="showDialog"
    modal
    :showHeader="false"
    class="w-[480px] !bg-transparent !shadow-none !border-none"
  >
    <CreateUser :userEdit="selectedUser" @close="showDialog = false" />
  </Dialog>
</template>
