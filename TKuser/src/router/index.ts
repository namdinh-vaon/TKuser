import { createRouter, createWebHistory } from "vue-router";
import Login from "@/components/Login.vue";
import UserTable from "@/components/UserManagement.vue";

const routes = [
  { path: "/", component: Login },
  { path: "/users", component: UserTable },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
