import Login from "@/views/auth/Login.vue";
import Signup from "@/views/auth/Signup.vue";
import HomeView from "@/views/HomeView.vue";
import Messaging from "@/views/Messaging.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/AboutView.vue"),
  },
  {
    path: "/messaging",
    name: "messaging",
    component: Messaging,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/auth/signup",
    name: "signup",
    component: Signup,
  },
  {
    path: "/auth/login",
    name: "login",
    component: Login,
  },
];

export default routes;
