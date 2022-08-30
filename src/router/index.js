import { createRouter, createWebHashHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Live from "../views/Live.vue";
import Classifiche from "../views/Classifiche.vue";
import Giocatori from "../views/Giocatori.vue";
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
    path: "/classifiche",
    name: "Classifiche",
    component: Classifiche,
  },
  {
    path: "/giocatori",
    name: "Giocatori",
    component: Giocatori,
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
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
