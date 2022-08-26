
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
    <!-- Classifica Campionato-->
    <div class="col-lg-5 col-md-7 col-sm-6 col-12">
      <div class="mt-4 mb-3 card mt-lg-0">
        <div class="p-3 pb-0 card-header">
          <div class="mb-1 row align-items-center">
            <h6 class="mb-0 text-sm">Classifica Campionato</h6>
          </div>
        </div>
        <div class="pb-0 pt-2 card-body">
          <div class="mb-1 row align-items-center">
            
              <div class="table-responsive">
                <table class="table align-items-center">
                  <thead>
                    <tr>
                      <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 p-0">Rank</th>
                      <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 p-0">Squadra</th>
                      <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 p-0">Fatti</th>
                      <th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 p-0">Previsti</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="(squadra, index3) in classifica" :key="index3">
                      <td style="padding: 0rem 0.0rem !important">
                        <LorenzoRankingArrows 
                        :final_rank="squadra.new_rank"
                        :initial_rank="squadra.old_rank"
                        /> 
                      </td>
                      <td style="padding: 0rem 0.0rem !important">
                        <LorenzoImageText 
                        :image="'https://d2lhpso9w1g8dk.cloudfront.net/web/risorse/maglietta_2022/' + squadra.Jersey" 
                        :text="squadra.Name" 
                        :secondary_text="squadra.Coach"/>
                      </td>
                      <td style="padding: 0rem 0.0rem !important">
                        <p class="text-xs text-secondary mb-0 " style="padding: 0rem 0.5rem !important;">{{ squadra.Punti }} </p>
                      </td>
                      <td style="padding: 0rem 0.0rem !important">
                        <p class="text-xs text-secondary mb-0 font-weight-bolder" style="padding: 0rem 0.5rem !important;">{{ squadra.Punti_Previsti }}  </p>

                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          
        </div>
      </div>
    </div>
    <div class="col-lg-3 d-none d-lg-block">

      <div class="mt-4 mb-3 card mt-lg-0">
        <div class="p-3 pb-0 card-header">
          <div class="mb-1 row align-items-center">
            <h6 class="mb-0 text-sm">Partite Giocate</h6>
          </div>
        </div>
        <div class="pb-0 pt-2 card-body">
          <div class="mb-1 row align-items-center">

            <div class="table-responsive">
              <table class="table align-items-center">

                <tbody>
                  <tr v-for="(inc, index4) in played" :key="index4">
                    <td style="padding: 0rem 0rem !important">
                      <LorenzoImageText v-if="inc['n_a'] == 'Juventus'"
                      :image="'https://components2.gazzettaobjects.it/rcs_gaz_gazzetta-layout/v2/assets/img/ext/loghi-squadre/juventus_black.png'"
                      :text="inc['g_a'].toString()" 
                      />
                      <LorenzoImageText v-else
                      :image="'https://components2.gazzettaobjects.it/rcs_gaz_gazzetta-layout/v2/assets/img/ext/loghi-squadre/' + inc['n_a'].toLowerCase() + '.png'"
                      :text="inc['g_a'].toString()" 
                      />
                    </td>
                    <td style="padding: 0rem 0rem !important">
                      <LorenzoImageText v-if="inc['n_b'] == 'Juventus'"
                      :image="'https://components2.gazzettaobjects.it/rcs_gaz_gazzetta-layout/v2/assets/img/ext/loghi-squadre/juventus_black.png'"
                      :text="inc['g_b'].toString()" 
                      />
                      <LorenzoImageText v-else
                      :image="'https://components2.gazzettaobjects.it/rcs_gaz_gazzetta-layout/v2/assets/img/ext/loghi-squadre/' + inc['n_b'].toLowerCase() + '.png'"
                      :text="inc['g_b'].toString()" 
                      />
                    </td>
                    <td style="padding: 0rem 0rem !important">
                      <div class="d-flex flex-column justify-content-center">
                        <h6 class="mb-0 text-xs">{{ mapping_match_status[inc['sto']] }} </h6>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="col-lg-4 col-md-5 col-sm-6">

      <div class="mt-4 mb-3 card mt-lg-0">
        <div class="p-3 pb-0 card-header">
          <div class="mb-1 row align-items-center">
            <h6 class="mb-0 text-sm">Scontri Diretti</h6>
          </div>
        </div>
        <div class="pb-0 pt-2 card-body">
          <div class="mb-1 row align-items-center">
            <div v-for="(incontri, comp_name) in scontri_diretti" :key="incontri.id"  class="col-6">

              <div class="table-responsive">
                <h6 class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 p-0">{{ comp_name }}</h6>
                <table class="table align-items-center">
                  <tbody>
                    <tr v-for="(inc, index5) in incontri" :key="index5">

                      <td style="padding: 0rem 0.0rem !important">
                        <LorenzoImageText 
                        :image="'https://d2lhpso9w1g8dk.cloudfront.net/web/risorse/maglietta_2022/' + formazioni[inc.ida].Jersey"
                        :text="Math.max(Math.floor((formazioni[inc.ida].Punti_Previsti - 66)/4)+1, 0).toString()" 
                        />
                      </td>

                      <td style="padding: 0rem 0.0rem !important">
                        <LorenzoImageText 
                        :image="'https://d2lhpso9w1g8dk.cloudfront.net/web/risorse/maglietta_2022/' + formazioni[inc.idb].Jersey"
                        :text="Math.max(Math.floor((formazioni[inc.idb].Punti_Previsti - 66)/4)+1, 0).toString()" 
                        />
                      </td>

                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="row">
    <div class="col-lg-12">
      <div class="row">
        <!-- <div v-if=""></div> -->
        <div class="col-lg-3 col-md-4 col-sm-6 col-xs-6 mb-4" v-for="(formazione, index) in formazioni" :key="index">
          <div class="card">
            <div class="p-3 pb-0 card-header">
              <LorenzoImageText 
              :image="'https://d2lhpso9w1g8dk.cloudfront.net/web/risorse/maglietta_2022/' + formazione.Jersey"
              :text="formazione.Name" 
              :secondary_text="formazione.Coach"/>
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
                              <i class="fas fa-sort-down" style="color: red"></i> {{ giocatore.n }} <i class="fas fa-sort-up" style="color: green"> </i> {{ giocatore.sostituto.n }} 
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
import Cookies from 'js-cookie';

import ArgonButton from "@/components/ArgonButton.vue";
import ArgonBadge from "@/components/ArgonBadge.vue";
import DefaultInfoCard from "@/examples/Cards/DefaultInfoCard.vue";

import mod_difesa from "@/assets/js/modificatore_difesa.js";
import sostituzioni from "@/assets/js/sostituzioni.js";
import cors_request from "@/assets/js/cors_request.js";
import async_cors_request from "@/assets/js/async_cors_request.js";
import evaluate_promises from "@/assets/js/evaluate_promises.js";

import LorenzoImageText from "@/views/components/LorenzoImageText.vue";
import LorenzoRankingArrows from "@/views/components/LorenzoRankingArrows.vue";


export default {
    name: "Live",
    components: {
        ArgonButton,
        ArgonBadge,
        DefaultInfoCard,
        LorenzoImageText,
        LorenzoRankingArrows
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
            played: {},
            scontri_diretti: {}
        };
    },
    async beforeCreate() {
        // Headers
        let overall_headers = {
            'Content-Type': 'application/json',
            'app_key': 'c3885bc5a83a16e6366083570a0a576d9eda44ef',
            'lega_token': Cookies.get('lega_token'),
            'user_token': Cookies.get('utente_token')
        };
        let completed = false;
        // Prima le chiamate che vanno aspettate per forza cosi da sapere la giornata da mostrare
        this.to_load = "CARICAMENTO Opzioni Lega"
        let timer = await async_cors_request(
            'https://appleghe.fantacalcio.it/api/v1/v1_lega/timer', {
                method: 'get',
                headers: overall_headers
            }
        );
        let giornata = timer['data']['giornata'];
        this.to_load = "CARICAMENTO Formazioni"
        let formazioni = await async_cors_request(
            'https://appleghe.fantacalcio.it/api/v1/V2_LegaFormazioni/Formazioni?id_comp=161999&giornata=' + giornata, {
                method: 'get',
                headers: overall_headers
            }
        );
        if (formazioni['data']['formazioni'][0]['sq'][0]['pl'].length < 22) {
            completed = true;
            giornata = giornata - 1;
            formazioni = await async_cors_request(
                'https://appleghe.fantacalcio.it/api/v1/V2_LegaFormazioni/Formazioni?id_comp=161999&giornata=' + giornata, {
                    method: 'get',
                    headers: overall_headers
                }
            );
        }
        this.giornata = giornata;
        // Le altre chiamate possono essere fatte in parallelo
        this.to_load = "CARICAMENTO Classifiche & Scontri Diretti"
        let all_promises = [];
        all_promises.push(
            cors_request(
                'https://appleghe.fantacalcio.it/api/v1/v1_lega/squadre', {
                    method: 'get',
                    headers: overall_headers
                }
            )
        );
        all_promises.push(
            cors_request(
                'https://d2lhpso9w1g8dk.cloudfront.net/web/risorse/dati/live/17/live_' + giornata + '.json', {
                    method: 'get',
                    headers: overall_headers
                }
            )
        );
        all_promises.push(
            cors_request(
                'https://api.fantacalcio.it/v1/mt/17/matches/votes/' + giornata + '.json?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9hcGkuZmFudGFjYWxjaW8uaXQvdjEvbXQvKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTY2MTc2OTk3Mn19fV19&Signature=Ze4qi~EXAhTOQQ-8k3teuwlGiJjDDwKjBJ53JlEqjDJu3Bz8hDwwEP~mKv7fjJ9h9ycKI2~HNmVCsuoAvglDjB~0cOi8A3CrVML0iWFf1q-F5ytfNHM8G4bLS47acUn-WomzFDyz-BZ7-uTIHIZV8ymAnvZBuxzr51flW2FByvyrmLjrrhSpL6Olgpa41j9L~TTbyfIfKf~mSySj8XTuKKS4OumtJ~uCFZRHmPY9Lb9vq9xcmPCGq1Vqp-n4G6mN0J7a3xpYyDzpPdSk9tE82LIhPtTGiBUGv4LZsFhMXWgHKNl4TkHbb01YCFLjWuIDY270c95tQ8H9mGuNDwDIjA__&Key-Pair-Id=KFXFJHYKWQRF1', { 
                    method: 'get',
                    headers: overall_headers
                }
            )

        )
        let competizioni = [161999, 162028, 162166, 162125, 162183];
        for (let i = competizioni.length - 1; i >= 0; i--) {
            all_promises.push(
                cors_request(
                    'https://appleghe.fantacalcio.it/api/v1/V2_LegaCompetizioni/completa?id=' + competizioni[i], {
                        method: 'get',
                        headers: overall_headers
                    }
                )
            )
        }
        let all_datasets = await evaluate_promises(all_promises);
        let live_stream = all_datasets.filter(x => x.url.includes('d2lhpso9w1g8dk.cloudfront.net')).map(x => x.data)[0];
        let live_votes = all_datasets.filter(x => x.url.includes('matches/votes')).map(x => x.data)[0];
        let squadre = all_datasets.filter(x => x.url.includes('v1_lega/squadre')).map(x => x.data)[0];
        let campionato = all_datasets.filter(x => x.url.includes('161999')).map(x => x.data)[0];
        let coppe = all_datasets.filter(x => x.url.includes('V2_LegaCompetizioni') && !x.url.includes('161999')).map(x => x.data);
        console.log(live_votes)
        this.to_load = "CALCOLO Risultati Live"

        // Controlla se squadre hanno giocato
        let status = {};
        for (let i = live_stream['data']['inc'].length - 1; i >= 0; i--) {
            status[live_stream['data']['inc'][i]['n_a'].split('').slice(0, 3).join('').toUpperCase()] = live_stream['data']['inc'][i]['sto'];
            status[live_stream['data']['inc'][i]['n_b'].split('').slice(0, 3).join('').toUpperCase()] = live_stream['data']['inc'][i]['sto'];
        }
        this.played = live_stream['data']['inc'];
        // Crea un dizionario di voti live
        let voti = {};
        for (let i = live_stream['data']['pl'].length - 1; i >= 0; i--) {
          voti[live_stream['data']['pl'][i]['id']] = live_stream['data']['pl'][i]['v']
        };
        if (live_votes != undefined) {
          for (let i = live_votes.length - 1; i >= 0; i--) {
            let t = live_votes[i].players;
            for (let j = t.length - 1; j >= 0; j--) {
              let p = t[j];
              voti[p.id] = voti[p.id] + (p.sourceFantacalcio.fantaVote-p.sourceFantacalcio.vote)
            }
            
          };
        }
        console.log(live_votes);

        // Calcola formazioni aggiornate
        let f = formazioni['data']['formazioni'];
        for (let i = 0; i < f.length; i++) {
            let s_id = f[i]['sq'][0]['id'];

            // Dividi titolari e panchinari
            let giocatori = f[i]['sq'][0]['pl'];
            for (let j = giocatori.length - 1; j >= 0; j--) {
                giocatori[j]['status'] = status[giocatori[j]['t'].toUpperCase()];
            }
            let titolari = giocatori.slice(0, 11);
            let panchinari = giocatori.slice(11, 22);

            // Aggiorna voti
            for (let j = 0; j < 11; j++) {

                // Crea categoria voto finale
                titolari[j]['voto_finale'] = titolari[j]['fv'];
                titolari[j]['in_calcolo'] = false;
                panchinari[j]['voto_finale'] = panchinari[j]['fv'];
                panchinari[j]['in_calcolo'] = false;

                // Aggiorna voti con live
                if (titolari[j].status > 0 && titolari[j].fv == 100) {
                    if (voti[titolari[j]['id']] != undefined && voti[titolari[j]['id']] <= 10) {
                        titolari[j]['voto_finale'] = voti[titolari[j]['id']];
                        titolari[j]['fv'] = voti[titolari[j]['id']];
                        titolari[j]['in_calcolo'] = true;
                    }
                }
                if (panchinari[j].status > 0 && panchinari[j].fv == 100) {
                    if (voti[panchinari[j]['id']] != undefined && voti[panchinari[j]['id']] <= 10) {
                        panchinari[j]['voto_finale'] = voti[panchinari[j]['id']];
                        panchinari[j]['fv'] = voti[panchinari[j]['id']];
                        panchinari[j]['in_calcolo'] = true;
                    }
                }
            }

            // Effettua sostituzioni
            titolari = sostituzioni(titolari, panchinari, completed);

            // Calculate expected points
            let exp_points = titolari.reduce((partialSum, x) => partialSum + (x['voto_finale'] == 100 ? 6 : x['voto_finale']), 0);

            // Popola dati puliti
            this.formazioni[s_id] = {
                'Name': squadre['data'].filter(y => y.id == s_id)[0]['n'],
                'Coach': squadre['data'].filter(y => y.id == s_id)[0]['nu'],
                'Jersey': squadre['data'].filter(y => y.id == s_id)[0]['ms'],
                'Modulo': f[i]['sq'][0]['m'].split(';')[0],
                'Ultimo_Aggiornamento': Math.floor((Date.parse(Date()) - Date.parse(f[i]['sq'][0]['dt'])) / (1000 * 60 * 60)),
                'Titolari': titolari,
                'Panchinari': panchinari,
                'Mostra': 'Titolari',
                'Punti': f[i]['sq'][0]['t'],
                'Punti_Previsti': exp_points + mod_difesa(titolari)
            }
        }

        // Calcola classifica aggiornata
        let squadre_con_classifica = {};
        for (let i = squadre.data.length - 1; i >= 0; i--) {
          let s = squadre.data[i];
          squadre_con_classifica[s.id] = {
            'Id': s.id,
            'Name': s.n,
            'Coach': s.nu,
            'Jersey': s.ms,
            'Punti': []
          }
        }
        for (let i = 0; i < (giornata-1); i++) {
          let dati_giornata = campionato['data']['cale']['cinc'][i]['inc'];
          for (let j = dati_giornata.length - 1; j >= 0; j--) {
            squadre_con_classifica[dati_giornata[j]['ida']].Punti.push(dati_giornata[j]['pa'])
          }
        }
        let classifica = [];
        for (let i = squadre.data.length - 1; i >= 0; i--) {
          let s = squadre.data[i];
            classifica[i] = {
                'Name': squadre_con_classifica[s.id].Name,
                'Coach': squadre_con_classifica[s.id].Coach,
                'Jersey': squadre_con_classifica[s.id].Jersey,
                'Punti': squadre_con_classifica[s.id].Punti.reduce((partialSum, x) => partialSum + x, 0),
                'Punti_Previsti': squadre_con_classifica[s.id].Punti.reduce((partialSum, x) => partialSum + x, 0) + this.formazioni[squadre_con_classifica[s.id].Id].Punti_Previsti
            };
        }
        classifica.sort((a, b) => {
            return b.Punti - a.Punti
        });
        for (let i = 0; i < classifica.length; i++) {
            classifica[i]['old_rank'] = i + 1;
        }
        classifica.sort((a, b) => {
            return b.Punti_Previsti - a.Punti_Previsti
        });
        for (let i = 0; i < classifica.length; i++) {
            classifica[i]['new_rank'] = i + 1;
        }
        this.classifica = classifica;

        // Calcolo scontri diretti
        let scontri_diretti = {};
        let coppe_filtered = coppe.filter(x => x.data['gi'] <= (this.giornata));
        for (let i = coppe_filtered.length - 1; i >= 0; i--) {
            let coppa_name = coppe_filtered[i]['data']['n'];
            let incontri = coppe_filtered[i]['data']['cale']['cinc'].filter(x => x['ga'] <= (this.giornata))[0]['inc'];
            scontri_diretti[coppa_name] = incontri;
        }
        this.scontri_diretti = scontri_diretti


        this.to_load = "Completato";
        return all_datasets;
    },
    methods: {
        switch_tit_panca(event) {
            // Guarda cosa e' stato pigiato
            let clicked_item = event.srcElement.className.split(' ').filter(y => y.includes('bottone'))[0];
            let clicked_option = clicked_item.split('_')[1];
            let other_option = clicked_option == 'Titolari' ? 'Panchinari' : 'Titolari';
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
