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
      <div class="col-12">
        <div class="mt-4 mb-3 card mt-lg-0">
          <div class="p-3 pb-0 card-header">
            POCO TEMPO!! WORK IN PROGRESS!
          </div>
          <div class="pb-0 pt-2 card-body">
            <div class="mb-1 row align-items-center">
              <div class="table-responsive" style="min-height:800px">
                <thead>
                  <!-- Filtri -->
                  <tr >
                    <th style="padding-right: 8px; padding-bottom: 4px; padding-top: 30px"><input v-model="all_filters.Nome" /></th>
                    <th style="padding-right: 8px; padding-bottom: 4px; padding-top: 30px">
                      <v-select v-model="all_filters.Ruolo" 
                        :options="['POR', 'DIF', 'CEN', 'ATT']">
                      </v-select>
                    </th>
                    <th style="padding-right: 8px; padding-bottom: 4px; padding-top: 30px">
                      <v-select :options="squadre_serie_a" label="Code" v-model="all_filters.Squadra_Reale">
                        <template v-slot:option="option">
                          <LorenzoImageText 
                            :image="'https://components2.gazzettaobjects.it/rcs_gaz_gazzetta-layout/v2/assets/img/ext/loghi-squadre/' + option.Logo" 
                            :text="option.Code" 
                          />
                        </template>
                        <template v-slot:selection="option">
                          <!-- HTML that describe how select should render selected items -->
                          {{ option.n.split('').slice(0,3).join('').toUpperCase() }}
                        </template>
                      </v-select>
                    </th>
                    <th style="padding-right: 8px; padding-bottom: 4px; padding-top: 30px">
                      <v-select :options="squadre_fantacalcio" label="n" v-model="all_filters.Squadra_Fantacalcio">
                        <template v-slot:option="option">
                          <LorenzoImageText 
                            :image="'https://d2lhpso9w1g8dk.cloudfront.net/web/risorse/maglietta_2023/' + option.ms" 
                            :text="option.n" 
                            :secondary_text="option.nu" 
                          />
                        </template>
                      </v-select>
                    </th>
                    <th style="padding-right: 8px; padding-bottom: 4px; padding-top: 30px"><Slider v-model="all_filters.Presenze" :max="giornata"></Slider></th>
                    <th style="padding-right: 8px; padding-bottom: 4px; padding-top: 30px"><Slider v-model="all_filters.Voto"></Slider></th>
                    <th style="padding-right: 8px; padding-bottom: 4px; padding-top: 30px"><Slider v-model="all_filters.FantaVoto"></Slider></th>
                  </tr>
                  <tr>
                    <th class="pb-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Giocatore</th>
                    <th class="pb-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Ruolo</th>
                    <th class="pb-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Squadra</th>
                    <th class="pb-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Presidente</th>
                    <th class="pb-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Presenze</th>
                    <th class="pb-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">Voto</th>
                    <th class="pb-2 text-uppercase text-secondary text-xxs font-weight-bolder opacity-7">FantaVoto</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(giocatore, index) in calciatori_con_filtro" :key="index">
                    <td> 
                      <LorenzoImageText 
                        :image="giocatore.Giocatore.Immagine" 
                        :text="giocatore.Giocatore.Nome" 
                      />
                    </td>
                    <td> 
                      <h6 class="mb-0 text-xs">{{giocatore.Giocatore.Ruolo_Corto}}</h6>                      
                    </td>
                    <td> 
                      <LorenzoImageText 
                        :image="'https://components2.gazzettaobjects.it/rcs_gaz_gazzetta-layout/v2/assets/img/ext/loghi-squadre/' + giocatore.Squadra_Reale.Logo" 
                        :text="giocatore.Squadra_Reale.Nome_Corto" 
                      />
                    </td>
                    <td> 
                      <LorenzoImageText 
                        :image="'https://d2lhpso9w1g8dk.cloudfront.net/web/risorse/maglietta_2023/' + giocatore.Squadra_Fantacalcio.Jersey" 
                        :text="giocatore.Squadra_Fantacalcio.Squadra" 
                        :secondary_text="giocatore.Squadra_Fantacalcio.Coach" 
                      />
                    </td>
                    <td> {{ giocatore.Giocatore.Caps }} </td>
                    <td>
                      <LorenzoColorPagella :voto="giocatore.Giocatore.Average_V"/>
                    </td>
                    <td>
                      <LorenzoColorPagella :voto="giocatore.Giocatore.Average_FV"/>
                    </td>
                  </tr>
                </tbody>
              </div>
            </div>

          </div>
        </div>
      </div>
  </div>
</div>


</template>



<script>

import Slider from '@vueform/slider'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';

import fantacalcio_apis from "@/assets/js/fantacalcio_apis.js";
import cors_request from "@/assets/js/cors_request.js";
import evaluate_promises from "@/assets/js/evaluate_promises.js";
import aggiorna_filtri_giocatori from "@/assets/js/aggiorna_filtri_giocatori.js";
// import async_cors_request from "@/assets/js/async_cors_request.js";

import LorenzoImageText from "@/views/components/LorenzoImageText.vue";
import LorenzoColorPagella from "@/views/components/LorenzoColorPagella.vue";
//import DefaultInfoCard from "@/examples/Cards/DefaultInfoCard.vue";

export default {
  name: "Giocatori",
  components: {
    Slider,
    vSelect,
    //DataTable,
    //VueGoodTable,
    LorenzoImageText,
    LorenzoColorPagella,
    //DefaultInfoCard
  },
  data() {
    return {
      to_load: 'CALCOLO Giocatori',
      squadre_serie_a: {},
      squadre_fantacalcio: {},
      calciatori: {},
      all_filters: {
        'Nome': '',
        'Ruolo': [],
        'Presenze': [0, 38],
        'Voto': [0, 10],
        'FantaVoto': [0, 10]
      },
      giornata: 0
    };
  },
  async beforeCreate() {
    // API Calls
    let all_promises = [];
    all_promises.push(
      fantacalcio_apis(
        'timer', 
        new Map([['function', cors_request], ['method', 'get']])
      )
    );
    all_promises.push(
      fantacalcio_apis(
        'stats_calciatori', 
        new Map([['function', cors_request], ['method', 'get']])
      )
    );
    all_promises.push(
      fantacalcio_apis(
        'squadre', 
        new Map([['function', cors_request], ['method', 'get']])
      )
    );
    let all_datasets = await evaluate_promises(all_promises);
    let calciatori = all_datasets.filter(x => x.url.includes('players/playersStat')).map(x => x.data)[0];
    let squadre = all_datasets.filter(x => x.url.includes('v1_lega/squadre')).map(x => x.data)[0];
    this.giornata = all_datasets.filter(x => x.url.includes('timer')).map(x => x.data)[0].data.giornata;

    // Dizionario di fantasquadre
    let fantacalciatori = {};
    for (let i = squadre.data.length - 1; i >= 0; i--) {
      let s = squadre.data[i];
      let c = s.cal.split(';');
      let p = s.cs.split(';');
      for (let j = c.length - 1; j >= 0; j--){
        fantacalciatori[c[j]] = {
          'Squadra': s.n,
          'Coach': s.nu,
          'Jersey': s.ms,
          'Costo': parseInt(p[j])
        }
      }
    }

    // Ruoli Mappati
    let mapping_roles = {
        'P': {'Lungo': 'Portiere', 'Corto': 'POR'},
        'D': {'Lungo': 'Difensore', 'Corto': 'DIF'},
        'C': {'Lungo': 'Centrocampista', 'Corto': 'CEN'},
        'A': {'Lungo': 'Attaccante', 'Corto': 'ATT'},
    };
    
    // Aggiungi le informazioni fanta
    let calciatori_con_fanta = [];
    let squadre_serie_a = [];
    for (var i = calciatori.length - 1; i >= 0; i--) {
      let c = calciatori[i];
      let f = fantacalciatori[c.id];
      if(f == undefined){
        f = {
          'Squadra': 'Svincolato',
          'Coach': '',
          'Jersey': 's_9275258_01787792.png',
          'Costo': 0
        }
      }
      squadre_serie_a.push({
        'Logo': c.teamName == 'Juventus' ? 'juventus_black.png' : c.teamName.toLowerCase() + '.png',
        'Code': c.teamCode
      });
      calciatori_con_fanta.push({
        'Giocatore': {
          'Nome': c.name,
          'Immagine': c.img,
          'Ruolo_Corto': mapping_roles[c.position].Corto,
          'Ruolo': mapping_roles[c.position].Lungo,
          'Valore_Mercato_Iniziale': parseInt(c.initialValue),
          'Valore_Mercato_Ora': parseInt(c.currentValue),
          'Caps': parseInt(c.italia.played),
          'Average_V': parseInt(c.italia.averageRating),
          'Average_FV': parseInt(c.italia.averageFantaRating),
          'GoalsScored': parseInt(c.goalsScored),
          'Assists': parseInt(c.assists),
          'Gialli': parseInt(c.yellowCards),
          'Rossi': parseInt(c.redCards)
        },
        'Squadra_Reale': {
          'Nome_Completo': c.teamName,
          'Nome_Corto': c.teamCode,
          'Logo': c.teamName == 'Juventus' ? 'juventus_black.png' : c.teamName.toLowerCase() + '.png'
        },
        'Squadra_Fantacalcio': f
      })
    }

    this.calciatori = calciatori_con_fanta;
    this.calciatori_con_filtro = calciatori_con_fanta;
    this.squadre_serie_a = [...new Map(squadre_serie_a.map((item) => [item["Code"], item])).values()].sort((a,b) => (a.Code > b.Code) ? 1 : ((b.Code > a.Code) ? -1 : 0));
    this.squadre_fantacalcio = squadre.data;

    this.to_load = 'Completato';
  },
  watch: {
    all_filters: {
      handler(newValue) {
        this.calciatori_con_filtro = aggiorna_filtri_giocatori(this.calciatori, newValue);
      },
      deep: true
    }
  }
};
</script>

<style src="@vueform/slider/themes/default.css"></style>
