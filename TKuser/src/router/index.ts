// Cấu hình Router
import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import UserManagement from "@/views/UserManagement.vue";
import { useLoginStore } from "@/stores/auth";

const routes = [
  { path: "/", name: "Login", component: Login },
  {
    path: "/users",
    name: "UserManagement",
    component: UserManagement,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const loginStore = useLoginStore();

  if (to.meta.requiresAuth && !loginStore.isLoggedIn) {
    // Chưa đăng nhập → chuyển về login, lưu lại đường dẫn để redirect sau
    next({ name: "Login", query: { redirect: to.fullPath } });
  } else if (to.meta.requiresGuest && loginStore.isLoggedIn) {
    // Đã đăng nhập → không cho vào trang login/register
    next({ name: "UserManagement" });
  } else {
    next();
  }
});

export default router;
