
<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-12">
        <div class="row">
          <!-- <div v-if=""></div> -->
          <div class="col-lg-3 mb-lg-4" v-for="(formazione, index) in formazioni" :key="index">
            <div class="card">
              <div class="p-3 pb-0 card-header">
                <div class="d-flex px-2 py-1">
                          <div>
                            <img
                              :src="'https://d2lhpso9w1g8dk.cloudfront.net/web/risorse/maglietta_2022/' + formazione.Jersey"
                              class="avatar avatar-sm me-3"
                              alt="user1"
                            />
                          </div>
                  <div class="d-flex flex-column justify-content-center">
                  <h6 class="mb-0 text-xs">{{ formazione.Name }}</h6>
                    <p class="text-xs text-secondary mb-0">{{ formazione.Coach }}</p>
                  </div>
                </div>
                <div class="d-flex flex-column justify-content-center">
                  <p class="text-secondary text-xs font-weight-bolder opacity-7">Modulo: <b>{{ formazione.Modulo }}</b> - Aggiornata: <b>{{ formazione.Ultimo_Aggiornamento }}H</b></p>
                </div>
              </div>
              <div class="table-responsive">
                <table class="table align-items-center">
                <thead>
                  <th></th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Punti</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2">Goals</th>
                </thead>
                  
                  <tbody>
                    <tr>
                      <td style="padding: 0rem 0.5rem !important">
                        <h6 class="mb-0 text-xs" style="padding: 0rem 0.5rem !important;">Fatti</h6>
                      </td>
                      <td class="align-middle text-left">
                        <ArgonBadge size="sm" variant="gradient" color="secondary"> {{ formazione.Punti }} </ArgonBadge>
                      </td>
                      <td class="align-middle text-left">
                        <ArgonBadge size="sm" variant="gradient" color="secondary"> {{ Math.max(Math.floor((formazione.Punti- 66)/4)+1, 0) }} </ArgonBadge>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding: 0rem 0.5rem !important">
                        <h6 class="mb-0 text-xs" style="padding: 0rem 0.5rem !important;">Previsti</h6>
                      </td>
                      <td class="align-middle text-left">
                        <ArgonBadge size="sm" variant="gradient" color="secondary"> {{ formazione.Punti_Previsti }} </ArgonBadge>
                      </td>
                      <td class="align-middle text-left">
                        <ArgonBadge size="sm" variant="gradient" color="secondary"> {{ Math.max(Math.floor((formazione.Punti_Previsti - 66)/4)+1, 0) }} </ArgonBadge>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div class="table-responsive">
                <table class="table align-items-center">
                  <thead>
                    <tr>
                      <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Giocatore</th>
                      <th
                        class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
                      >Voto</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(giocatore, index2) in formazione[formazione.Mostra]" :key="index2">
                    <td style="padding: 0rem 0.5rem !important">
                      <div class="d-flex px-2 py-1">
                        <div>
                          <!--<img
                            :src="'https://content.fantacalcio.it/web/campioncini/small/' + calciatori[giocatore.id].Image + '.png?v=12'"
                            class="avatar avatar-xs me-3 circular"
                            alt="user1"
                          />-->
                        </div>
                        <div class="d-flex flex-column justify-content-center">
                          <h6 class="mb-0 text-xs" style="padding: 0rem 0.5rem !important;">{{ giocatore.n }}</h6>
                          <p class="text-xxs text-secondary mb-0" style="padding: 0rem 0.5rem !important;">{{ mapping_roles[giocatore.r] }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="align-middle text-left">
                      <div v-if="giocatore.fv == 100"></div>
                      <ArgonBadge v-else-if="giocatore.fv >= 8" size="sm" variant="gradient" color="info"> {{ giocatore.fv }} </ArgonBadge>
                      <ArgonBadge v-else-if="giocatore.fv >= 6" size="sm" variant="gradient" color="success"> {{ giocatore.fv }} </ArgonBadge>
                      <ArgonBadge v-else-if="giocatore.fv >= 5" size="sm" variant="gradient" color="warning"> {{ giocatore.fv }} </ArgonBadge>
                      <ArgonBadge v-else size="sm" variant="gradient" color="danger"> {{ giocatore.fv }} </ArgonBadge>
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

              <div class="container-fluid pb-2">
                <div class="row">
                  <div class="col-lg-6">
                    <argon-button :class="'bottone_Titolari_' + index" color="success" size="sm" variant="outline" v-on:click="switch_tit_panca">Titolari</argon-button>
                  </div>
                  <div class="col-lg-6">
                    <argon-button :class="'bottone_Panchinari_' + index" color="secondary" size="sm" variant="outline" v-on:click="switch_tit_panca">Panca</argon-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
import ArgonButton from "@/components/ArgonButton.vue";
import ArgonBadge from "@/components/ArgonBadge.vue";
import Cookies from 'js-cookie';

export default {
  name: "Live",
  components: {
    ArgonButton,
    ArgonBadge
  },
  data() {
    return {
      formazioni: {},
      mapping_roles: {
        'P': 'Portiere',
        'D': 'Difensore',
        'C': 'Centrocampista',
        'A': 'Attaccante'
      },
      calciatori: {},
      giornata: 1
    };
  },
  async created() {
      // Utility function to send a CORS request
      async function cors_request(url, params){
        let cors_url = 'https://vast-forest-31073.herokuapp.com/' + url;
        let response = await fetch(cors_url, params);
        let data = await response.json();
        console.log(data);
        return data;
      };
      // Calciatori
      let calciatori_data = await cors_request(
        'https://appleghe.fantacalcio.it/api/v1/v1_calciatori/lista',
        { 
          method: 'get', 
          headers: {
            'Content-Type': 'application/json',
            'app_key': 'c3885bc5a83a16e6366083570a0a576d9eda44ef'
          }
        }
      )
      // Timing
      let timer = await cors_request(
        'https://appleghe.fantacalcio.it/api/v1/v1_lega/timer',
        { 
          method: 'get', 
          headers: {
            'Content-Type': 'application/json',
            'app_key': 'c3885bc5a83a16e6366083570a0a576d9eda44ef'
          }
        }
      )
      // API con calciatori
      if (calciatori_data['success']) {
        for (let i = 0; i < calciatori_data['data'].length; i++) {
          let id = calciatori_data['data'][i]['id'];
          this.calciatori[id] = {
            'Image': calciatori_data['data'][i]['img']
          }
        }
      }
      // API con squadre 
      let squadre_url = 'https://appleghe.fantacalcio.it/api/v1/v1_lega/squadre';
      let squadre_cors_url = 'https://vast-forest-31073.herokuapp.com/' + squadre_url;
      let squadre_response = await fetch(squadre_cors_url, { 
        method: 'get', 
        headers: {
          'Content-Type': 'application/json',
          'app_key': 'c3885bc5a83a16e6366083570a0a576d9eda44ef',
          'lega_token': Cookies.get('lega_token'),
          'user_token': Cookies.get('utente_token')
        }
      });
      let squadre_data = await squadre_response.json();
      // API con formazioni
      let formazioni_url = 'https://appleghe.fantacalcio.it/api/v1/V2_LegaFormazioni/Formazioni?id_comp=161999&giornata=' + timer['data']['giornata'];
      let formazioni_cors_url = 'https://vast-forest-31073.herokuapp.com/' + formazioni_url;
      let formazioni_response = await fetch(formazioni_cors_url, { 
        method: 'get', 
        headers: {
          'Content-Type': 'application/json',
          'app_key': 'c3885bc5a83a16e6366083570a0a576d9eda44ef',
          'lega_token': Cookies.get('lega_token'),
          'user_token': Cookies.get('utente_token')
        }
      });
      let formazioni_data = await formazioni_response.json();
      if (formazioni_data['success']) {
        let f = formazioni_data['data']['formazioni'];
        for (var i = 0; i < f.length; i++) {
          let s_id = f[i]['sq'][0]['id'];
          let titolari = f[i]['sq'][0]['pl'].slice(0, 11);
          let exp_points = titolari.reduce((partialSum, x) => partialSum + (x['fv'] == 100 ? 6 : x['fv']), 0);
          this.formazioni[s_id] = {
            'Name': squadre_data['data'].filter(y => y.id == s_id)[0]['n'],
            'Coach': squadre_data['data'].filter(y => y.id == s_id)[0]['nu'],
            'Jersey': squadre_data['data'].filter(y => y.id == s_id)[0]['ms'],
            'Modulo': f[i]['sq'][0]['m'].replace(';', ''),
            'Ultimo_Aggiornamento': Math.floor((Date.parse(Date()) - Date.parse(f[i]['sq'][0]['dt']))/(1000*60*60)),
            'Titolari': titolari,
            'Panchinari': f[i]['sq'][0]['pl'].slice(11, f[i]['sq'][0]['pl'].length),
            'Mostra': 'Titolari',
            'Punti': f[i]['sq'][0]['t'],
            'Punti_Previsti': exp_points
          }
        }
      }
      return;
    },
  methods: {
    switch_tit_panca (event) {
      // Guarda cosa e' stato pigiato
      let clicked_item = event.srcElement.className.split(' ').filter(y => y.includes('bottone'))[0];
      let clicked_option = clicked_item.split('_')[1];
      let other_option = clicked_option == 'Titolari' ? 'Panchinari' : 'Titolari' ;
      let clicked_index = clicked_item.split('_')[2];
      // Cambia CSS
      document.getElementsByClassName(clicked_item)[0].classList.remove('btn-outline-secondary')
      document.getElementsByClassName(clicked_item)[0].classList.add('btn-outline-success');
      document.getElementsByClassName(clicked_item.replace(clicked_option, other_option))[0].classList.remove('btn-outline-success');
      document.getElementsByClassName(clicked_item.replace(clicked_option, other_option))[0].classList.add('btn-outline-secondary');
      
      // Cambia table
      this.formazioni[clicked_index]['Mostra'] = clicked_option;
    }
  }
};
</script>
