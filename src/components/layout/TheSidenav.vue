<template>
  <!-- Desktop Sidebar -->
  <div
    v-show="this.$store.state.layout === 'default'"
    class="min-height-200 position-absolute w-100 d-none d-xl-block"
    :class="`${this.$store.state.darkMode ? 'bg-transparent' : 'bg-success'}`"
  />
  <aside
    class="my-3 overflow-auto border-0 sidenav navbar navbar-vertical navbar-expand-xs border-radius-xl fixed-start ms-3 d-none d-xl-block"
    :class="`${
      this.$store.state.layout === 'landing'
        ? 'bg-transparent shadow-none'
        : ' '
    } ${this.$store.state.sidebarType}`"
    id="sidenav-main"
  >
    <div class="sidenav-header">
      <div class="m-0 navbar-brand" to="/">
        <img
          src="https://leghe.fantacalcio.it/favicon.png"
          class="navbar-brand-img h-100"
          alt="main_logo"
        />
        <span class="ms-2 font-weight-bold me-2">Fantacalcio 2025</span>
      </div>
    </div>
    <hr class="mt-0 horizontal dark" />
    <div class="px-3 pb-3" v-if="this.$store.state.giornataAttuale">
      <label class="form-label text-xs text-uppercase font-weight-bold mb-2">Giornata</label>
      <select
        class="form-select form-select-sm"
        :value="this.$store.state.giornata"
        @change="onGiornataChange"
      >
        <option
          v-for="g in giornateOptions"
          :key="g"
          :value="g"
        >
          Giornata {{ g }}{{ g === this.$store.state.giornataAttuale ? ' (attuale)' : '' }}
        </option>
      </select>
    </div>
    <hr class="mt-0 horizontal dark" v-if="this.$store.state.giornataAttuale" />
    <sidenav-list :cardBg="custom_class" />
  </aside>

  <!-- Mobile Navbar -->
  <nav class="navbar navbar-expand-xl d-xl-none fixed-top bg-white shadow-sm py-2 px-3">
    <div class="container-fluid">
      <div class="navbar-brand d-flex align-items-center">
        <img
          src="https://leghe.fantacalcio.it/favicon.png"
          class="me-2"
          alt="main_logo"
          style="height: 28px;"
        />
        <span class="font-weight-bold text-sm">Fantacalcio 2025</span>
      </div>
      <button
        class="navbar-toggler border-0 p-1"
        type="button"
        @click="toggleMobileMenu"
        aria-label="Toggle navigation"
      >
        <i class="fas fa-ellipsis-v text-dark" style="font-size: 1.2rem;"></i>
      </button>
    </div>
  </nav>

  <!-- Mobile Menu Overlay -->
  <div
    v-if="mobileMenuOpen"
    class="mobile-menu-overlay d-xl-none"
    @click="closeMobileMenu"
  ></div>

  <!-- Mobile Menu Dropdown -->
  <div
    v-if="mobileMenuOpen"
    class="mobile-menu d-xl-none bg-white shadow-lg border-radius-lg"
  >
    <div class="p-3" v-if="this.$store.state.giornataAttuale">
      <label class="form-label text-xs text-uppercase font-weight-bold mb-2">Giornata</label>
      <select
        class="form-select form-select-sm"
        :value="this.$store.state.giornata"
        @change="onGiornataChange"
      >
        <option
          v-for="g in giornateOptions"
          :key="g"
          :value="g"
        >
          Giornata {{ g }}{{ g === this.$store.state.giornataAttuale ? ' (attuale)' : '' }}
        </option>
      </select>
    </div>
    <hr class="my-0 horizontal dark" v-if="this.$store.state.giornataAttuale" />
    <sidenav-list :cardBg="custom_class" @item-clicked="closeMobileMenu" />
  </div>
</template>

<script>
import SidenavList from "./SidenavList.vue";

export default {
  name: "TheSidenav",
  components: {
    SidenavList
  },
  props: ["custom_class", "layout"],
  data() {
    return {
      mobileMenuOpen: false
    };
  },
  computed: {
    giornateOptions() {
      const attuale = this.$store.state.giornataAttuale;
      if (!attuale) return [];
      const options = [];
      for (let i = 1; i <= attuale; i++) {
        options.push(i);
      }
      return options;
    }
  },
  methods: {
    onGiornataChange(event) {
      const newGiornata = parseInt(event.target.value, 10);
      this.$store.commit('setGiornata', newGiornata);
    },
    toggleMobileMenu() {
      this.mobileMenuOpen = !this.mobileMenuOpen;
    },
    closeMobileMenu() {
      this.mobileMenuOpen = false;
    }
  }
};
</script>

<style scoped>
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1040;
}

.mobile-menu {
  position: fixed;
  top: 56px;
  right: 12px;
  width: 280px;
  max-width: calc(100vw - 24px);
  z-index: 1050;
  max-height: calc(100vh - 70px);
  overflow-y: auto;
}

#sidenav-main {
  width: 220px;
  max-width: 220px;
  min-width: 220px;
}
</style>
