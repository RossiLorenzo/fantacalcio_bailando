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
          </div>
          <div class="pb-0 pt-2 card-body">
            <div class="mb-1 row align-items-center">

              <div class="table-responsive">
                <vue-good-table class="table align-items-center" id="giocatori" 
                  compactMode
                  :columns="columns" 
                  :rows="rows"
                  :sort-options="{
                    enabled: true,
                    initialSortBy: {field: 'Giocatore', type: 'asc'}
                  }"
                >
                  <template v-slot:table-row="props">                    
                    <span v-if="props.column.field == 'Giocatore'">
                      <LorenzoImageText 
                        :image="props.row.Giocatore.Immagine" 
                        :text="props.row.Giocatore.Nome" 
                      />
                    </span>
                    <span v-else-if="props.column.field == 'Squadra_Reale'">
                      <LorenzoImageText 
                        :image="'https://components2.gazzettaobjects.it/rcs_gaz_gazzetta-layout/v2/assets/img/ext/loghi-squadre/' + props.row.Squadra_Reale.Logo" 
                        :text="props.row.Squadra_Reale.Nome_Corto" 
                      />
                    </span>
                    <span v-else-if="props.column.field == 'Squadra_Fantacalcio'">
                      <LorenzoImageText 
                        :image="'https://d2lhpso9w1g8dk.cloudfront.net/web/risorse/maglietta_2022/' + props.row.Squadra_Fantacalcio.Jersey" 
                        :text="props.row.Squadra_Fantacalcio.Squadra" 
                        :secondary_text="props.row.Squadra_Fantacalcio.Coach" 
                      />
                    </span>
                    <span v-else-if="props.column.label == 'Media Voto'">
                      <LorenzoColorPagella :voto="props.row.Giocatore.Average_V"/>
                    </span>
                    <span v-else-if="props.column.label == 'Media FantaVoto'">
                      <LorenzoColorPagella :voto="props.row.Giocatore.Average_FV"/>
                    </span>
                    <span v-else>
                      {{props.formattedRow[props.column.field]}}
                    </span>
                  </template>
                </vue-good-table>
              </div>
            </div>

          </div>
        </div>
      </div>
  </div>
</div>


</template>



<script>

//import DataTable from 'datatables.net-vue3';
import 'vue-good-table-next/dist/vue-good-table-next.css'
import { VueGoodTable } from 'vue-good-table-next';

import fantacalcio_apis from "@/assets/js/fantacalcio_apis.js";
import cors_request from "@/assets/js/cors_request.js";
import evaluate_promises from "@/assets/js/evaluate_promises.js";
// import async_cors_request from "@/assets/js/async_cors_request.js";

import LorenzoImageText from "@/views/components/LorenzoImageText.vue";
import LorenzoColorPagella from "@/views/components/LorenzoColorPagella.vue";
import DefaultInfoCard from "@/examples/Cards/DefaultInfoCard.vue";

export default {
  name: "Giocatori",
  components: {
    //DataTable,
    VueGoodTable,
    LorenzoImageText,
    LorenzoColorPagella,
    DefaultInfoCard
  },
  data() {
    return {
      to_load: 'CALCOLO Giocatori',
      squadre_serie_a: {},
      calciatori: {},
      columns: {},
      rows: {}
    };
  },
  async beforeCreate() {
    // API Calls
    let all_promises = [];
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
      squadre_serie_a.push(c.teamCode);
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

    // Uniques
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    // Crea tavola
    this.to_load = 'CARICAMENTO Listone'
    this.rows = calciatori_con_fanta;
    this.columns = [
        {
          label: 'Giocatore',
          field: 'Giocatore',
          sortFn: this.sortGiocatore,
          filterOptions: {
              enabled: true, 
              placeholder: ' ',
              filterFn: this.filterGiocatore, 
          },
        },
        {
          label: 'Ruolo',
          field: 'Giocatore.Ruolo_Corto',
          firstSortType: 'desc',
          filterOptions: {
              enabled: true, 
              placeholder: ' ',
              filterDropdownItems: ['POR', 'DIF', 'CEN', 'ATT']
          },
        },
        {
          label: 'Squadra',
          field: 'Squadra_Reale',
          sortFn: this.sortSquadra_R,
          filterOptions: {
              enabled: true, 
              placeholder: ' ',
              filterDropdownItems: squadre_serie_a.filter(onlyUnique).sort(),
              filterFn: this.filterSquadra_R, 
          },
        },
        {
          label: 'Presidente',
          field: 'Squadra_Fantacalcio',
          sortFn: this.sortSquadra_F,
          filterOptions: {
              enabled: true, 
              filterDropdownItems: squadre.data.map(x => x.n).sort().concat(['Svincolato']),
              placeholder: ' ',
              filterFn: this.filterSquadra_F, 
          },
        },
        {
          label: 'Costo Asta',
          field: 'Squadra_Fantacalcio.Costo',
          type: 'number',
          firstSortType: 'desc'
        },
        {
          label: 'Presenze',
          field: 'Giocatore.Caps',
          type: 'number',
          firstSortType: 'desc'
        },
        {
          label: 'Media Voto',
          field: 'Giocatore.Average_V',
          type: 'number',
          firstSortType: 'desc'
        },
        {
          label: 'Media FantaVoto',
          field: 'Giocatore.Average_FV',
          type: 'number',
          firstSortType: 'desc'
        },
        {
          label: 'Goal Segnati',
          field: 'Giocatore.GoalsScored',
          type: 'number',
          firstSortType: 'desc'
        },
        {
          label: 'Assists',
          field: 'Giocatore.Assists',
          type: 'number',
          firstSortType: 'desc'
        },
        {
          label: 'Gialli',
          field: 'Giocatore.Gialli',
          type: 'number',
          firstSortType: 'desc'
        },
        {
          label: 'Rossi',
          field: 'Giocatore.Rossi',
          type: 'number',
          firstSortType: 'desc'
        },
    ];

    this.to_load = 'Completato';
  },
  methods: {
    sortGiocatore(x, y) {
      return (x.Nome < y.Nome ? -1 : (x.Nome > y.Nome ? 1 : 0));
    },
    filterGiocatore(data, filterString) {
      return data.Nome.toLowerCase().includes(filterString.toLowerCase());
    },
    sortSquadra_R(x, y) {
      return (x.Nome_Corto < y.Nome_Corto ? -1 : (x.Nome_Corto > y.Nome_Corto ? 1 : 0));
    },
    filterSquadra_R(data, filterString) {
      return data.Nome_Corto == filterString;
    },
    sortSquadra_F(x, y) {
      return (x.Squadra < y.Squadra ? -1 : (x.Squadra > y.Squadra ? 1 : 0));
    },
    filterSquadra_F(data, filterString) {
      return data.Squadra == filterString;
    },
  }
};
</script>
