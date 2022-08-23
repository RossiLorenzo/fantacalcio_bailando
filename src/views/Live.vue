
<template>
  <div v-if="to_load!='Completato'">
    <div class="row">
      <div class="col-2 mt-3">
      </div>
      <div class="col-8 mt-3">
       <default-info-card
          :title="to_load"
          icon_bg='bg-gradient-success'
          classIcon='fas fa-rocket'
        />
      </div>
      <div class="col-2 mt-3">
      </div>
      </div>
    </div>
  <div v-else class="py-4 container-fluid">
    <div class="row">
      <div class="col-lg-3 col-md-6 col-sm-0">
        <div class="mt-4 mb-3 card mt-lg-0">
          <div class="pb-0 card-body">
            <div class="mb-1 row align-items-center">
              <h5 class="mb-1 text-uppercase text-lg">{{giornata}} Giornata</h5>
              <h6 class="mb-2 text-sm">Classifica Campionato</h6>
            </div>
            <div class="mb-1 row align-items-center">
              <div class="col-12">
                
                <div class="table-responsive">
                  <table class="table align-items-center">
                  <thead>
                    <tr>
                      <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 p-0"></th>
                      <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 p-0">Fatti</th>
                      <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 p-0">Previsti</th>
                    </tr>
                  </thead>
                    
                    <tbody>
                      <tr v-for="(squadra, index3) in classifica" :key="index3">
                        <td style="padding: 0rem 0.5rem !important">
                          <div class="d-flex px-2 py-1">
                            <div>
                              <img
                                :src="'https://d2lhpso9w1g8dk.cloudfront.net/web/risorse/maglietta_2022/' + squadra.Jersey"
                                class="avatar avatar-xs me-1"
                                alt="user1"
                              />
                            </div>
                            <div class="d-flex flex-column justify-content-center">
                              <h6 class="mb-0 text-xs">{{ squadra.Name }}</h6>
                              <p class="text-xs text-secondary mb-0">{{ squadra.Coach }}</p>
                            </div>
                          </div>
                        </td>
                        <td style="padding: 0rem 0.5rem !important">
                          <p class="text-xs text-secondary mb-0 " style="padding: 0rem 0.5rem !important;">{{ squadra.Punti }} </p>
                        
                        </td>
                        <td style="padding: 0rem 0.5rem !important">
                          <p class="text-xs text-secondary mb-0 font-weight-bolder" style="padding: 0rem 0.5rem !important;">{{ squadra.Punti_Previsti }}  </p>
                         
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="mb-1 row align-items-center">
              <h6 class="mb-1 text-sm">Partite Giocate</h6>
            </div>
            <div class="mb-1 row align-items-center">
              <div class="col-12">
                
                <div class="table-responsive">
                  <table class="table align-items-center">
                    
                    <tbody>
                      <tr v-for="(inc, index4) in live_stream['data']['inc']" :key="index4">
                        
                        <td style="padding: 0rem 0.5rem !important">
                          <div class="d-flex px-2 py-1">
                            <div>
                              <img v-if="inc['n_a'] == 'Juventus'"
                                :src="'https://components2.gazzettaobjects.it/rcs_gaz_gazzetta-layout/v2/assets/img/ext/loghi-squadre/juventus_black.png'"
                                class="avatar avatar-xs me-1"
                                alt="user1"
                              />
                              <img v-else
                                :src="'https://components2.gazzettaobjects.it/rcs_gaz_gazzetta-layout/v2/assets/img/ext/loghi-squadre/' + inc['n_a'].toLowerCase() + '.png'"
                                class="avatar avatar-xs me-1"
                                alt="user1"
                              />

                            </div>
                            <div class="d-flex flex-column justify-content-center">
                              <h6 class="mb-0 text-xs">{{ inc['g_a'] }} </h6>
                            </div>
                          </div>
                        </td>
                        <td style="padding: 0rem 0.5rem !important">
                          <div class="d-flex px-2 py-1">
                            <div>
                              <img v-if="inc['n_b'] == 'Juventus'"
                                :src="'https://components2.gazzettaobjects.it/rcs_gaz_gazzetta-layout/v2/assets/img/ext/loghi-squadre/juventus_black.png'"
                                class="avatar avatar-xs me-1"
                                alt="user1"
                              />
                              <img v-else
                                :src="'https://components2.gazzettaobjects.it/rcs_gaz_gazzetta-layout/v2/assets/img/ext/loghi-squadre/' + inc['n_b'].toLowerCase() + '.png'"
                                class="avatar avatar-xs me-1"
                                alt="user1"
                              />
                            </div>
                            <div class="d-flex flex-column justify-content-center">
                              <h6 class="mb-0 text-xs">{{ inc['g_b'] }} </h6>
                            </div>
                          </div>
                        </td>

                        <td>
                          
                            <div class="d-flex flex-column justify-content-center">
                              <h6 class="mb-0 text-xs">{{ mapping_match_status[inc['sto']] }} </h6>
                            </div>
                        </td>


                        <!--
                        <td style="padding: 0rem 0.5rem !important">
                          <p class="text-xs text-secondary mb-0 " style="padding: 0rem 0.5rem !important;">{{ squadra.Punti }} </p>
                        
                        </td>
                        <td style="padding: 0rem 0.5rem !important">
                          <p class="text-xs text-secondary mb-0 font-weight-bolder" style="padding: 0rem 0.5rem !important;">{{ squadra.Punti_Previsti }}  </p>
                         
                        </td>-->
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-9 col-md-6 col-sm-12">
        <div class="row">
          <!-- <div v-if=""></div> -->
          <div class="col-lg-4 col-md-6 col-sm-6 col-xs-6 mb-4" v-for="(formazione, index) in formazioni" :key="index">
            <div class="card">
              <div class="p-3 pb-0 card-header">
                <div class="d-flex px-2 py-1">
                          <div>
                            <img
                              :src="'https://d2lhpso9w1g8dk.cloudfront.net/web/risorse/maglietta_2022/' + formazione.Jersey"
                              class="avatar avatar-sm me-1"
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
import DefaultInfoCard from "@/examples/Cards/DefaultInfoCard.vue";


export default {
  name: "Live",
  components: {
    ArgonButton,
    ArgonBadge,
    DefaultInfoCard
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
      mapping_match_status: {
        '0': 'Non Iniziata',
        '1': 'Primo Tempo',
        '2': 'Intervallo',
        '3': 'Secondo Tempo',
        '4': 'Finita',
        '5': 'Sospesa',
        '6': 'Rinviata'
      },
      classifica: {},
      to_load: 'CARICAMENTO Giornata Attiva',
      giornata: 0,
      live_stream: {}
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
      let completed = false;
      // Tutte le chiamata alle APIs
      let timer = await cors_request(
        'https://appleghe.fantacalcio.it/api/v1/v1_lega/timer',
        { method: 'get', headers: overall_headers }
      );
      let giornata = timer['data']['giornata'];
      this.to_load = "CARICAMENTO Partecipanti"
      let squadre = await cors_request(
        'https://appleghe.fantacalcio.it/api/v1/v1_lega/squadre',
        { method: 'get', headers: overall_headers }
      );
      this.to_load = "CARICAMENTO Formazioni"
      let formazioni = await cors_request(
        'https://appleghe.fantacalcio.it/api/v1/V2_LegaFormazioni/Formazioni?id_comp=161999&giornata=' + giornata,
        { method: 'get', headers: overall_headers }
      );
      if (formazioni['data']['formazioni'][0]['sq'].length < 22) {
        completed = true;
        giornata = giornata - 1;
        formazioni = await cors_request(
          'https://appleghe.fantacalcio.it/api/v1/V2_LegaFormazioni/Formazioni?id_comp=161999&giornata=' + giornata,
          { method: 'get', headers: overall_headers }
        );
      }
      this.giornata = giornata;
      this.to_load = "CARICAMENTO Partite Live"
      let live_stream = await cors_request(
        'https://d2lhpso9w1g8dk.cloudfront.net/web/risorse/dati/live/17/live_' + giornata + '.json',
        { method: 'get', headers: overall_headers }
      );
      this.live_stream = live_stream;
      this.to_load = "CARICAMENTO Campionato"
      let campionato = await cors_request(
        'https://appleghe.fantacalcio.it/api/v1/V2_LegaCompetizioni/completa?id=161999',
        { method: 'get', headers: overall_headers }
      );
      this.to_load = "CALCOLO risultati live"
      // Controlla se squadre hanno giocato
      let status = {};
      for (let i = live_stream['data']['inc'].length - 1; i >= 0; i--) {
        status[live_stream['data']['inc'][i]['n_a'].split('').slice(0,3).join('').toUpperCase()] = live_stream['data']['inc'][i]['sto'];
        status[live_stream['data']['inc'][i]['n_b'].split('').slice(0,3).join('').toUpperCase()] = live_stream['data']['inc'][i]['sto'];
      }
      console.log(status)
      // Crea un dizionario di voti live
      let voti = {};
      for (let i = live_stream['data']['pl'].length - 1; i >= 0; i--) {
        voti[live_stream['data']['pl'][i]['id']] = live_stream['data']['pl'][i]['v']
      }

      // Calcola formazioni aggiornate
      let f = formazioni['data']['formazioni'];
      for (let i = 0; i < f.length; i++) {
          let s_id = f[i]['sq'][0]['id'];
          
          // Dividi titolari e panchinari
          let giocatori = f[i]['sq'][0]['pl'];
          for (let j = giocatori.length - 1; j >= 0; j--) {
            giocatori[j]['status'] = status[giocatori[j]['t'].toUpperCase()];
          }
          console.log(giocatori);
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
              let possibili_sostituti
              if (completed) {
                possibili_sostituti = panchinari_disponibili.filter(x => x.r == titolari[j]['r'] && x.fv != 100);
              } else {
                possibili_sostituti = panchinari_disponibili.filter(x => x.r == titolari[j]['r'] && (x.fv != 100 || x.status != 4));
              }
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

      // Calcola classifica aggiornata
      let classifica_data = campionato['data']['cale']['cinc'][giornata-2]['inc'];
      let classifica = [];
      for (var i = classifica_data.length - 1; i >= 0; i--) {
        classifica[i] = {
          'Name': squadre['data'].filter(y => y.id == classifica_data[i]['ida'])[0]['n'],
          'Coach': squadre['data'].filter(y => y.id == classifica_data[i]['ida'])[0]['nu'],
          'Jersey': squadre['data'].filter(y => y.id == classifica_data[i]['ida'])[0]['ms'],
          'Punti': classifica_data[i]['pa'],
          'Punti_Previsti': classifica_data[i]['pa'] + this.formazioni[classifica_data[i]['ida']].Punti_Previsti
        };
      }
      classifica.sort((a, b) => { return b.Punti_Previsti - a.Punti_Previsti });
      this.classifica = classifica;
      this.to_load = "Completato";
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
