<template>
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0">
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Log In</h4>
                  <p class="mb-0">Email, Password di fantacalcio.it</p>
                  <i><p class="mb-0 text-secondary text-xs">L'accesso e' ristretto ai partecipanti della lega "Bailando"</p></i>
                  <div v-if="failed && !is_bailando_league">
                    <br>
                    <argon-badge variant="gradient" color="danger"> Solo per utenti Bailando League </argon-badge>
                  </div>
                  <div v-else-if="failed">
                    <br>
                    <argon-badge variant="gradient" color="danger"> Login fallito - Riprova </argon-badge>
                  </div>
                  <div v-else-if="is_bailando_league">
                      <br>
                      <argon-badge variant="gradient" color="success"> Login riuscito </argon-badge>
                  </div>
                </div>
                <div class="card-body">
                  <div>
                    <div class="mb-3">
                      <input v-model="email" type="email" placeholder="Email" name="email" class="form-control form-control-lg" />

                    </div>
                    <div class="mb-3">
                      <input v-model="password" type="password" placeholder="Password" name="password" class="form-control form-control-lg" />
                    </div>
                    <div class="text-center">
                      <div v-if="loading">
                        <br>
                        <argon-badge
                          variant="gradient"
                          color="warning"
                          class="mt-4"
                          fullWidth
                          size="lg"
                        > Autenticazione in Corso </argon-badge>
                      </div>
                      <div v-else>
                        <argon-button
                          class="mt-4"
                          variant="gradient"
                          color="success"
                          fullWidth
                          v-on:click="auth"
                          size="lg"
                        >Log in</argon-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column"
            >
              <div
                class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style="background-image: url('https://content.fantacalcio.it/web/img/sponsor/default/login_background.png');
          background-size: cover;"
              >
                <span class="mask bg-gradient-success opacity-4"></span>
                <i><p
                  class="text-white position-relative"
                >"Di voi italiani non capisco la fissazione per il fantacalcio. Se mi fermate, è per dirmi: "Ehi, ti ho comprato al Fantacalcio, devi segnarmi!" Non vi importa se una squadra vinca o perda: vi importa che io segni. E non lo fate neanche per soldi. Siete un po' strani, eh." </p></i>
                <b><p class="text-white position-relative">[Suso]</p></b>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import ArgonButton from "@/components/ui/ArgonButton.vue";
import ArgonBadge from "@/components/ui/ArgonBadge.vue";
import Cookies from 'js-cookie';
import router from "@/router/index.js"

import login from "@/utils/login.js";

const body = document.getElementsByTagName("body")[0];

export default {
  name: "Signin",
  components: {
    ArgonButton,
    ArgonBadge
  },
  data() {
    return {
      email: '',
      password: '',
      lega: '',
      failed: false,
      loading: false,
      is_bailando_league: false
    }
  },
  created() {
    this.$store.state.hideConfigButton = true;
    this.$store.state.showNavbar = false;
    this.$store.state.showSidenav = false;
    this.$store.state.showFooter = false;
    body.classList.remove("bg-gray-100");

  },
  beforeUnmount() {
    this.$store.state.hideConfigButton = false;
    this.$store.state.showNavbar = true;
    this.$store.state.showSidenav = true;
    this.$store.state.showFooter = true;
    body.classList.add("bg-gray-100");
  },
  methods: {
    async auth () {
      this.loading = true;
      Cookies.set('fanta_username', this.email, {expires: 31});
      Cookies.set('fanta_password', this.password, {expires: 31});
      let successful_login = await login(this.email, this.password);
      this.loading = false;
      if(successful_login){ router.push('/live') };
      if(!successful_login){ console.log('Failed') };
    }
  }
};
</script>
