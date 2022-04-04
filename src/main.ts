import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";

console.log("ok0");
// axios.interceptors.response.use(undefined, async function (error) {
//   console.log("ok1");

//   if (error) {
//     const originalRequest = error.config;
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//     } else {
//       localStorage.removeItem("token");
//       window.location = "/auth/login";
//     }
//   }
// });

const app = createApp(App);

app.use(router);

app.mount("#app");
