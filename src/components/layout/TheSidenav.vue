<template>
  <div
    v-show="this.$store.state.layout === 'default'"
    class="min-height-200 position-absolute w-100"
    :class="`${this.$store.state.darkMode ? 'bg-transparent' : 'bg-success'}`"
  />
  <aside
    class="my-3 overflow-auto border-0 sidenav navbar navbar-vertical navbar-expand-xs border-radius-xl fixed-start ms-3"
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
</template>

<script>
import SidenavList from "./SidenavList.vue";

export default {
  name: "TheSidenav",
  components: {
    SidenavList
  },
  props: ["custom_class", "layout"],
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
    }
  }
};
</script>
