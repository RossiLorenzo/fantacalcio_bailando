<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="row">
          <div class="col-lg-9 mb-lg-0 mb-4">
            <div class="card">
              <div class="p-3 pb-0 card-header">
                <div class="d-flex justify-content-between">
                  <h6 class="mb-2">Squadre</h6>
                </div>
              </div>
              <div class="table-responsive">
                <table class="table align-items-center">
                  <thead>
                    <tr>
                      <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Squadra</th>
                      <th
                        class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                      >Crediti Rimasti</th>
                      <th
                        class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                      >Miglior Giocatore</th>
                      <th
                        class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                      >Formazione Preferita</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(squadra, index) in squadre" :key="index">
                      <td>
                        <div class="d-flex px-2 py-1">
                          <div>
                            <img
                              :src="'https://d2lhpso9w1g8dk.cloudfront.net/web/risorse/maglietta_2023/' + squadra.Jersey"
                              class="avatar avatar-xs me-3"
                            />
                          </div>
                          <div class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-sm">{{ squadra.Name }}</h6>
                            <p class="text-xs text-secondary mb-0">{{ squadra.Coach }}</p>
                          </div>
                        </div>
                      </td>
                      <td class="align-middle text-center">
                        <div class="d-flex align-items-center justify-content-center">
                        <span class="me-2 text-xs font-weight-bold">{{ squadra.Crediti }}</span>
                        <argon-progress color="success" :percentage="squadra.Crediti/5" />
                        </div>
                      </td>
                      <td class="align-middle text-center">
                        <span class="text-secondary text-xs font-weight-bold">{{ squadra.Crediti }}</span>
                      </td>
                      <!--<td class="text-sm align-middle">
                        <div class="text-center col">
                          <p class="mb-0 text-xs font-weight-bold">Bounce:</p>
                          <h6 class="mb-0 text-sm">{{ sale.bounce }}</h6>
                        </div>
                      </td>-->
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="col-lg-3" >
            <div v-for="(carta, index2) in cards" :key="index2">
              <card 
                :title="carta.title"
                :value="carta.value"
                :percentage="carta.percentage"
                :iconClass="carta.iconClass"
                :iconBackground="carta.iconBackground"
                :detail="carta.detail"
                directionReverse
              ></card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import ArgonProgress from "@/components/ArgonProgress.vue";
import Card from "@/examples/Cards/Card.vue";
import Cookies from 'js-cookie';

export default {
  name: "dashboard-default",
  data() {
    return {
      cards: {
        prossima: {
            title: "Prossima Partita",
            value: "5 Giorni",
            percentage: "",
            iconClass: "ni ni-calendar-grid-58",
            detail: "",
            iconBackground: "bg-gradient-warning",
          },
        miglior_portiere: {
            title: "Miglior Portiere",
            value: "Maignan",
            percentage: "12",
            iconClass: "ni ni-calendar-grid-58",
            detail: "Punti",
            iconBackground: "bg-gradient-warning",
          }
      },
      squadre: { },
    };
  },
  components: {
    ArgonProgress,
    Card
  },
  async created() {
      // API con squadre
      let url = 'https://appleghe.fantacalcio.it/api/v1/v1_lega/squadre';
      let cors_url = 'https://vast-forest-31073.herokuapp.com/' + url;
      let response = await fetch(cors_url, { 
        method: 'get', 
        headers: {
          'Content-Type': 'application/json',
          'app_key': 'c3885bc5a83a16e6366083570a0a576d9eda44ef',
          'lega_token': Cookies.get('lega_token'),
          'user_token': Cookies.get('utente_token')
        }
      });
      let data = await response.json();
      if (data['success']) {
        for (var i = 0; i < data['data'].length; i++) {
          var s = data['data'][i];
          this.squadre[s['id']] = {
            'Name': s.n,
            'Coach': s.nu,
            'Jersey': s.ms,
            'Crediti': s.cr,
            'Team': s.cal
          }
        }
        console.log(this.squadre) 
      }
      return;
    }
};
</script>
