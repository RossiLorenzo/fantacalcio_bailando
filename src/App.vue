<template>
  <div
    v-show="this.$store.state.layout === 'landing'"
    class="landing-bg h-100 bg-gradient-primary position-fixed w-100"
  ></div>
  <the-sidenav
    :custom_class="this.$store.state.mcolor"
    :class="[
      this.$store.state.isTransparent,
      this.$store.state.isRTL ? 'fixed-end' : 'fixed-start'
    ]"
    v-if="this.$store.state.showSidenav"
  />
<main
    class="main-content position-relative max-height-vh-100 h-100 border-radius-lg"
    :class="{ 'main-content-desktop': this.$store.state.showSidenav }"
  >
    <router-view />
  </main>
</template>

<script>
import TheSidenav from "@/components/layout/TheSidenav.vue";

export default {
  name: "App",
  components: {
    TheSidenav,
  },
  computed: {
    navClasses() {
      return {
        "position-sticky bg-white left-auto top-2 z-index-sticky":
          this.$store.state.isNavFixed && !this.$store.state.darkMode,
        "position-sticky bg-default left-auto top-2 z-index-sticky":
          this.$store.state.isNavFixed && this.$store.state.darkMode,
        "position-absolute px-4 mx-0 w-100 z-index-2": this.$store.state
          .isAbsolute,
        "px-0 mx-4": !this.$store.state.isAbsolute
      };
    }
  },
  async beforeCreate() {
    this.$store.state.isTransparent = "bg-transparent";
  }
};
</script>

<style scoped>
@media (min-width: 1200px) {
  .main-content-desktop {
    margin-left: 244px;
  }
}

@media (max-width: 1199.98px) {
  .main-content {
    padding-top: 26px;
  }
}
</style>
