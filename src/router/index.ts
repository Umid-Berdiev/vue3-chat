import { getToken } from "@/api/config";
import { createRouter, createWebHistory } from "vue-router";
import routes from "./routes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const accessToken = getToken();

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!accessToken) {
      // window.location = "/auth/login";
      next({ path: "/auth/login" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
