<template>
  <div
    class="collapse navbar-collapse w-auto h-auto h-100"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">
      <!--
      <li class="nav-item">
        <sidenav-item
          url="/home"
          :class="getRoute() === 'home' ? 'active' : ''"
          :navText="this.$store.state.isRTL ? 'لوحة القيادة' : 'Home'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
    -->
      <li class="nav-item">
        <sidenav-item
          url="/live"
          :class="getRoute() === 'live' ? 'active' : ''"
          :navText="this.$store.state.isRTL ? 'الجداول' : 'Live'"
        >
          <template v-slot:icon>
            <i
              class="ni ni-calendar-grid-58 text-warning text-sm opacity-10"
            ></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
          url="/classifiche"
          :class="getRoute() === 'classifiche' ? 'active' : ''"
          :navText="this.$store.state.isRTL ? 'الفواتیر' : 'Classifiche Speciali'"
        >
          <template v-slot:icon>
            <i class="ni ni-trophy text-success text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
      <!--<li class="nav-item">
        <sidenav-item
          url="/giocatori"
          :class="getRoute() === 'giocatori' ? 'active' : ''"
          :navText="this.$store.state.isRTL ? 'الفواتیر' : 'Giocatori'"
        >
          <template v-slot:icon>
            <i class="ni ni-user-run text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>-->
      <!--
      <li class="nav-item">
        <sidenav-item
          url="/profile"
          :class="getRoute() === 'profile' ? 'active' : ''"
          :navText="this.$store.state.isRTL ? 'حساب تعريفي' : 'Personale'"
        >
          <template v-slot:icon>
            <i class="ni ni-single-02 text-dark text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
    -->
      <li class="nav-item">
        <sidenav-item
          url="/signin"
          :class="getRoute() === 'signin' ? 'active' : ''"
          :navText="this.$store.state.isRTL ? 'تسجيل الدخول' : 'Sign In'"
        >
          <template v-slot:icon>
            <i class="ni ni-single-copy-04 text-danger text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>
    </ul>
  </div>
</template>
<script>
import SidenavItem from "./SidenavItem.vue";

export default {
  name: "SidenavList",
  props: {
    cardBg: String
  },
  data() {
    return {
      title: "Argon Dashboard 2",
      controls: "dashboardsExamples",
      isActive: "false"
    };
  },
  components: {
    SidenavItem
  },
  methods: {
    getRoute() {
      const routeArr = this.$route.path.split("/");
      return routeArr[1];
    }
  }
};
</script>
