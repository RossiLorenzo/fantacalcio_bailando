<template>
  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar
          isBlur="blur  border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"
          v-bind:darkMode="true"
          isBtn="bg-gradient-success"
        />
      </div>
    </div>
  </div>
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
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonBadge from "@/components/ArgonBadge.vue";
import Cookies from 'js-cookie';
import router from "@/router/index.js"
const body = document.getElementsByTagName("body")[0];

export default {
  name: "signin",
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
      let url = 'https://appleghe.fantacalcio.it/api/v1/v1_utente/login';
      let cors_url = 'https://sheltered-tor-74618.herokuapp.com/' + url;
      let form_data = {
        username: this.email,
        password: this.password
      };
      let response = await fetch(cors_url, { 
        method: 'post', 
        headers: {
          'Content-Type': 'application/json',
          'app_key': 'c3885bc5a83a16e6366083570a0a576d9eda44ef'
        },
        body: JSON.stringify(form_data) 
      });
      let data = await response.json();
      this.loading = false; 
      if (data['success']) {
        this.is_bailando_league = data['data']['leghe'].map(y => y.id).includes(1113631);
        if (this.is_bailando_league) {
          Cookies.set('utente_token', data['data']['utente']['utente_token']);
          Cookies.set('lega_token', data['data']['leghe'][0]['token']);
          router.push('/live')
        }
        else { 
          this.failed = true;  
        }
      }
      else { 
        this.failed = true;  
      }
      return;
    }

  }

};
</script>
