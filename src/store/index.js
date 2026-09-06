import { createStore } from "vuex";

export default createStore({
  state: {
    hideConfigButton: false,
    isPinned: true,
    showConfig: false,
    sidebarType: "bg-white",
    isRTL: false,
    mcolor: "",
    darkMode: false,
    isNavFixed: false,
    isAbsolute: false,
    showNavs: true,
    showSidenav: true,
    showNavbar: true,
    showFooter: true,
    showMain: true,
    layout: "default",
    calciatori: {},
    giornata: null,
    giornataAttuale: null,
    stagione: null,
    // Serie A giornata = lega giornata + delay. The lega starts a few Serie A
    // giornate late, so the two numberings differ all season.
    delay: 0
  },
  mutations: {
    toggleConfigurator(state) {
      state.showConfig = !state.showConfig;
    },
    navbarMinimize(state) {
      const sidenav_show = document.querySelector(".g-sidenav-show");
      if (sidenav_show.classList.contains("g-sidenav-hidden")) {
        sidenav_show.classList.remove("g-sidenav-hidden");
        sidenav_show.classList.add("g-sidenav-pinned");
        state.isPinned = true;
      } else {
        sidenav_show.classList.add("g-sidenav-hidden");
        sidenav_show.classList.remove("g-sidenav-pinned");
        state.isPinned = false;
      }
    },
    sidebarType(state, payload) {
      state.sidebarType = payload;
    },
    navbarFixed(state) {
      state.isNavFixed = !state.isNavFixed;
    },
    getData(state, newData) {
      state.data = newData;
    },
    setGiornata(state, giornata) {
      state.giornata = giornata;
    },
    setGiornataAttuale(state, giornata) {
      state.giornataAttuale = giornata;
    },
    setStagione(state, stagione) {
      state.stagione = stagione;
    },
    setDelay(state, delay) {
      state.delay = delay;
    }
  },
  actions: {
    toggleSidebarColor({ commit }, payload) {
      commit("sidebarType", payload);
    }
  },
  getters: {}
});
