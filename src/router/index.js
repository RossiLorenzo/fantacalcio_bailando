import { createRouter, createWebHashHistory } from "vue-router";
import Live from "../views/Live.vue";
import Signin from "../views/Signin.vue";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/signin",
  },
  {
    path: "/live",
    name: "Live",
    component: Live,
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  }
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
