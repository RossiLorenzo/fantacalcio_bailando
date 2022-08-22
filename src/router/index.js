import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Live from "../views/Live.vue";
import Formazioni from "../views/Formazioni.vue";
import Profile from "../views/Profile.vue";
import Signin from "../views/Signin.vue";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/signin",
  },
  {
    path: "/home",
    name: "Home",
    component: Dashboard,
  },
  {
    path: "/live",
    name: "Live",
    component: Live,
  },
  {
    path: "/formazioni",
    name: "Formazioni",
    component: Formazioni,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/signin",
    name: "Signin",
    component: Signin,
  }
  
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
