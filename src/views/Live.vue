
<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-0 col-md-0 col-sm-0">
      </div>
      <div class="col-lg-12 col-md-12 col-sm-12">
        <div class="row">
          <!-- <div v-if=""></div> -->
          <div class="col-lg-3 col-md-6 col-sm-6 col-xs-6 mb-4" v-for="(formazione, index) in formazioni" :key="index">
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
                <!-- 
                <div class="d-flex flex-column justify-content-center">
                  <p class="text-secondary text-xs font-weight-bolder opacity-7">Modulo: <b>{{ formazione.Modulo }}</b> - Aggiornata: <b>{{ formazione.Ultimo_Aggiornamento }}H</b></p>
                </div>
              -->
              </div>
              <div class="table-responsive">
                <table class="table align-items-center mb-0">
                <thead>
                  <th></th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 p-0">Punti</th>
                  <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 p-0">Goal</th>
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
                <table class="table align-items-center mb-0">
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
                        <!-- Per i titolari mostra le sostituzioni -->
                        <div v-if="formazione.Mostra == 'Titolari'" class="d-flex flex-column justify-content-center">
                          <div v-if="giocatore.fv == 100 && giocatore.status == 4">
                            <h6 class="mb-0 text-xs" style="padding: 0rem 0.5rem !important;">  
                              <s >{{ giocatore.n }}</s> {{ giocatore.sostituto.n }}
                            </h6>
                          </div>
                          <div v-else>
                            <h6 class="mb-0 text-xs" style="padding: 0rem 0.5rem !important;">  
                              {{ giocatore.n }}
                            </h6>
                          </div>
                          <p class="text-xxs text-secondary mb-0" style="padding: 0rem 0.5rem !important;">{{ mapping_roles[giocatore.r] }}</p>
                        </div>
                        <!-- Per i panchinari no -->
                        <div v-else class="d-flex flex-column justify-content-center">
                            <h6 class="mb-0 text-xs" style="padding: 0rem 0.5rem !important;">  
                              {{ giocatore.n }}
                            </h6>
                          <p class="text-xxs text-secondary mb-0" style="padding: 0rem 0.5rem !important;">{{ mapping_roles[giocatore.r] }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="align-middle text-left">
                      <div v-if="giocatore.in_calcolo">
                        <ArgonBadge size="sm" variant="gradient" color="secondary"> {{ giocatore.voto_finale }}* </ArgonBadge>
                      </div>
                      <div v-else-if="giocatore.voto_finale == 100 && formazione.Mostra == 'Panchinari' && giocatore.status==4">
                        <ArgonBadge size="sm" variant="gradient" color="danger"> S.V. </ArgonBadge>
                      </div>
                      <div v-else-if="giocatore.voto_finale == 100"></div>
                      <ArgonBadge v-else-if="giocatore.voto_finale >= 8" size="sm" variant="gradient" color="info"> {{ giocatore.voto_finale }} </ArgonBadge>
                      <ArgonBadge v-else-if="giocatore.voto_finale >= 6" size="sm" variant="gradient" color="success"> {{ giocatore.voto_finale }} </ArgonBadge>
                      <ArgonBadge v-else-if="giocatore.voto_finale >= 5" size="sm" variant="gradient" color="warning"> {{ giocatore.voto_finale }} </ArgonBadge>
                      <ArgonBadge v-else size="sm" variant="gradient" color="danger"> {{ giocatore.voto_finale }} </ArgonBadge>
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
                    <argon-button :class="'bottone_Titolari_' + index" color="success" size="xs" variant="outline" v-on:click="switch_tit_panca">Titolari</argon-button>
                  </div>
                  <div class="col-lg-6">
                    <argon-button :class="'bottone_Panchinari_' + index" color="secondary" size="xs" variant="outline" v-on:click="switch_tit_panca">Panca</argon-button>
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
import mod_difesa from "@/assets/js/modificatore_difesa.js";
import cors_request from "@/assets/js/cors_request.js";


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
      }
    };
  },
  async created() {
      // Headers
      let overall_headers = {
          'Content-Type': 'application/json',
          'app_key': 'c3885bc5a83a16e6366083570a0a576d9eda44ef',
          'lega_token': Cookies.get('lega_token'),
          'user_token': Cookies.get('utente_token')
      };
      // Tutte le chiamata alle APIs
      let timer = await cors_request(
        'https://appleghe.fantacalcio.it/api/v1/v1_lega/timer',
        { method: 'get', headers: overall_headers }
      );
      let giornata = timer['data']['giornata'];
      let squadre = await cors_request(
        'https://appleghe.fantacalcio.it/api/v1/v1_lega/squadre',
        { method: 'get', headers: overall_headers }
      );
      let formazioni = await cors_request(
        'https://appleghe.fantacalcio.it/api/v1/V2_LegaFormazioni/Formazioni?id_comp=161999&giornata=' + giornata,
        { method: 'get', headers: overall_headers }
      );
      let live_stream = await cors_request(
        'https://d2lhpso9w1g8dk.cloudfront.net/web/risorse/dati/live/17/live_' + giornata + '.json',
        { method: 'get', headers: overall_headers }
      );
      // Controlla se squadre hanno giocato
      let status = {};
      for (let i = live_stream['data']['inc'].length - 1; i >= 0; i--) {
        status[live_stream['data']['inc'][i]['n_a'].split('').slice(0,3).join('').toUpperCase()] = live_stream['data']['inc'][i]['sto'];
        status[live_stream['data']['inc'][i]['n_b'].split('').slice(0,3).join('').toUpperCase()] = live_stream['data']['inc'][i]['sto'];
      }
      // Crea un dizionario di voti live
      let voti = {};
      for (let i = live_stream['data']['pl'].length - 1; i >= 0; i--) {
        voti[live_stream['data']['pl'][i]['id']] = live_stream['data']['pl'][i]['v']
      }

      // Popola APP
      if (formazioni['success']) {
        let f = formazioni['data']['formazioni'];
        for (let i = 0; i < f.length; i++) {
          let s_id = f[i]['sq'][0]['id'];
          
          // Dividi titolari e panchinari
          let giocatori = f[i]['sq'][0]['pl'];
          for (let j = giocatori.length - 1; j >= 0; j--) {
            giocatori[j]['status'] = status[giocatori[j]['t']];
          }
          let titolari = giocatori.slice(0, 11);
          let panchinari = giocatori.slice(11, giocatori.length);
          let panchinari_disponibili = panchinari;

          // Sostituzioni e voti aggiornati
          let sostituzioni_fatte = 0;
          for (let j = 0; j < 11; j++) {
            // Crea categoria voto finale
            titolari[j]['voto_finale'] = titolari[j]['fv'];
            titolari[j]['in_calcolo'] = false;
            panchinari[j]['voto_finale'] = panchinari[j]['fv'];
            panchinari[j]['in_calcolo'] = false;

            // Aggiorna voti con live
            if (titolari[j].status == 4 && titolari[j].fv == 100) {
              if(voti[titolari[j]['id']] != undefined && voti[titolari[j]['id']] <= 10){
                titolari[j]['voto_finale'] = voti[titolari[j]['id']];
                titolari[j]['fv'] = voti[titolari[j]['id']];
                titolari[j]['in_calcolo'] = true;
              }
            }
            if (panchinari[j].status == 4 && panchinari[j].fv == 100) {
              if(voti[panchinari[j]['id']] != undefined && voti[panchinari[j]['id']] <= 10){
                panchinari[j]['voto_finale'] = voti[panchinari[j]['id']];
                panchinari[j]['fv'] = voti[panchinari[j]['id']];
                panchinari[j]['in_calcolo'] = true;
              }
            }
            
            // Effettua sostituzioni
            if (titolari[j].status == 4 && titolari[j].fv == 100) {
                let possibili_sostituti = panchinari_disponibili.filter(x => x.r == titolari[j]['r'] && (x.fv != 100 || x.status != 4));
                if (sostituzioni_fatte < 5) {
                  if (possibili_sostituti.length > 0) {
                    panchinari_disponibili = panchinari.filter(x => x.id != possibili_sostituti[0].id)
                    titolari[j]['sostituto'] = possibili_sostituti[0];
                    titolari[j]['voto_finale'] = titolari[j]['sostituto']['fv'];
                    sostituzioni_fatte++;
                  }
                  else{
                    titolari[j]['sostituto'] = {'n': 'Ufficio', 'fv': 4};
                    titolari[j]['voto_finale'] = titolari[j]['sostituto']['fv'];
                    sostituzioni_fatte++;
                  }
                }
                else{
                  titolari[j]['sostituto'] = {'n': 'Sostituzioni Finite', 'fv': 0};
                  titolari[j]['voto_finale'] = titolari[j]['sostituto']['fv'];
                }

            }
          }
          
          // Calculate expected points
          let exp_points = titolari.reduce((partialSum, x) => partialSum + (x['voto_finale'] == 100 ? 6 : x['voto_finale']), 0);
          
          // Popola dati puliti
          this.formazioni[s_id] = {
            'Name': squadre['data'].filter(y => y.id == s_id)[0]['n'],
            'Coach': squadre['data'].filter(y => y.id == s_id)[0]['nu'],
            'Jersey': squadre['data'].filter(y => y.id == s_id)[0]['ms'],
            'Modulo': f[i]['sq'][0]['m'].split(';')[0],
            'Ultimo_Aggiornamento': Math.floor((Date.parse(Date()) - Date.parse(f[i]['sq'][0]['dt']))/(1000*60*60)),
            'Titolari': titolari,
            'Panchinari': panchinari,
            'Mostra': 'Titolari',
            'Punti': f[i]['sq'][0]['t'],
            'Punti_Previsti': exp_points + mod_difesa(titolari)
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
