import { createRouter, createWebHistory } from "vue-router";
import Login from "@/components/Login.vue";
import UserManagement from "@/components/UserManagement.vue";

const routes = [
  { path: "/", component: Login },
  { path: "/users", component: UserManagement },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
