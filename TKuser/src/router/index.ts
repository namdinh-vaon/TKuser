// Cấu hình Router
import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import UserManagement from "@/views/UserManagement.vue";
import { useLoginStore } from "@/stores/auth";
import Store from "@/views/ProductMangerment.vue";

const routes = [
  {
    path: "/",
    name: "Login",
    component: Login,
    meta: { requiresGuest: true },
  },
  {
    path: "/users",
    name: "UserManagement",
    component: UserManagement,
    meta: { requiresAuth: true },
  },
  {
    path: "/product",
    name: "ProductMangerment",
    component: Store,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const useLogin = useLoginStore();

  if (to.meta.requiresAuth && !useLogin.isLoggedIn) {
    next({ name: "Login", query: { redirect: to.fullPath } });
  } else if (to.meta.requiresGuest && useLogin.isLoggedIn) {
    next({ name: "UserManagement" });
  } else {
    next();
  }
});
export default router;
