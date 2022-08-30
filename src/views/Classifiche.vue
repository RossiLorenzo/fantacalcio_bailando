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

    <!-- Premio Montero -->
    <div class="col-lg-4 col-md-4 col-sm-6 mb-4">
      <LorenzoSpecialPrize 
        :dataset="montero"
        Title="Premio Montero"
        Subtitle="Squadra piu' indisciplinata"
        Image="https://staticg.sportskeeda.com/wp-content/uploads/2015/05/montero-red-card-1431423173.jpg"
        :Col1="{Name: 'Gialli', Icon: 'fa-square', Icon_Color: '#ffd500'}"
        :Col2="{Name: 'Rossi', Icon: 'fa-square', Icon_Color: '#cc0021'}"
        :Col3="{Name: 'TOTALE'}"
      />
    </div>

    <!-- Premio Totti -->
    <div class="col-lg-4 col-md-4 col-sm-6 mb-4">
      <LorenzoSpecialPrize 
        :dataset="totti"
        Title="Premio Totti"
        Subtitle="Squadra con piu' rigori"
        Image="https://asroma2-cloudinary.corebine.com/asroma2-production/image/upload/c_fill,dpr_3.0,f_webp,g_center,q_auto,w_730/v1/asroma-uat/t88yhacnls3lrbcrensd"
        :Col1="{Name: 'Segnati', Icon: 'fa-check', Icon_Color: 'green'}"
        :Col2="{Name: 'Sbagliati', Icon: 'fa-ban', Icon_Color: '#cc0021'}"
        :Col3="{Name: 'TOTALE'}"
      />
    </div>

    <!-- Premio Muriel -->
    <div class="col-lg-4 col-md-4 col-sm-6 mb-4">
      <LorenzoSpecialPrize 
        :dataset="muriel"
        Title="Premio Muriel"
        Subtitle="Squadra con piu' goal lasciati in panchina"
        Image="https://static.sky.it/images/skysport/it/calcio/serie-a/2020/06/02/atalanta-gol-panchina-muriel/muriel_getty.jpg"
        :Col1="{Name: 'Titolari', Icon: 'fa-futbol', Icon_Color: 'green'}"
        :Col2="{Name: 'Panca', Icon: 'fa-couch', Icon_Color: '#cc0021'}"
        :Col3="{Name: 'ERRORI'}"
      />
    </div>

  </div>
</div>
</template>

<script>
  import Cookies from 'js-cookie';
  
  import DefaultInfoCard from "@/examples/Cards/DefaultInfoCard.vue";

  import fantacalcio_apis from "@/assets/js/fantacalcio_apis.js";
  import cors_request from "@/assets/js/cors_request.js";
  import evaluate_promises from "@/assets/js/evaluate_promises.js";
  // import async_cors_request from "@/assets/js/async_cors_request.js";

  import LorenzoSpecialPrize from "@/views/components/LorenzoSpecialPrize.vue";


  export default {
    name: "tables",
    components: {
      DefaultInfoCard,
      LorenzoSpecialPrize
    },
    data() {
      return {
        to_load: 'CARICAMENTO Statistiche',
        montero: {},
        totti: {},
        muriel: {}
      };
    },
    async beforeCreate (){
      // Headers
      let overall_headers = {
        'Content-Type': 'application/json',
        'app_key': 'c3885bc5a83a16e6366083570a0a576d9eda44ef',
        'lega_token': Cookies.get('lega_token'),
        'user_token': Cookies.get('utente_token')
      };
      // Get stats for the players, teams and giornata
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
      let squadre = all_datasets.filter(x => x.url.includes('v1_lega/squadre')).map(x => x.data)[0];
      let giornata = all_datasets.filter(x => x.url.includes('timer')).map(x => x.data)[0].data.giornata;
      let season_stats = all_datasets.filter(x => x.url.includes('playersStat')).map(x => x.data)[0];
      // Ora che sappiamo la giornata carichiamo tutte le formazioni schierate in ogni giornata
      this.to_load = 'CARICAMENTO Tutte formazioni schierate';
      all_promises = []
      for (let i = 1; i <= giornata; i++) {
        all_promises.push(
          cors_request(
            'https://appleghe.fantacalcio.it/api/v1/V2_LegaFormazioni/Formazioni?id_comp=161999&giornata=' + i, {
              method: 'get',
              headers: overall_headers
            }
            )
          ); 
      }
      let tutte_giornate = await evaluate_promises(all_promises);
      this.to_load = 'CALCOLO classifiche';

      // Combina squadre con statistiche
      let squadre_con_statistica = [];
      for (let i = squadre.data.length - 1; i >= 0; i--) {
        let s = squadre.data[i];
        let c = s.cal.split(';');
        let stats = [];
        for (let j = 0; j < c.length; j++) {
          stats.push(season_stats.filter(x => x.id == c[j])[0]);
        }
        squadre_con_statistica.push({
          'Id': s.id,
          'Name': s.n,
          'Coach': s.nu,
          'Jersey': s.ms,
          'Calciatori': stats,
          'Titolari': [],
          'Panca': []
        })
      }

      // Calcola classifiche aggregate
      let metrics = ['goalsScored', 'currentValue', 'initialValue', 'ownGoals', 'penaltiesSaved', 'penaltiesScored', 'penaltiesNotScored', 'redCards', 'yellowCards'];
      for (let i = metrics.length - 1; i >= 0; i--) {
        let m = metrics[i];
        for (let j = squadre_con_statistica.length - 1; j >= 0; j--) {
          squadre_con_statistica[j][m] = squadre_con_statistica[j].Calciatori.reduce((partialSum, x) => partialSum + x[m], 0);
        }
      }

      // Calcola classifiche basate su formazioni
      for (let i = tutte_giornate.length - 1; i >= 0; i--) {
        // Formazioni
        let sq = tutte_giornate[i].data.data.formazioni.map(x => x.sq);
        for (let j = sq.length - 1; j >= 0; j--) {
          // Formazioni
          let giocatori = sq[j][0].pl;
          //let titolari = giocatori.slice(0, 11);
          //let panchinari = giocatori.slice(11, 22);

          // Sostituzioni
          //titolari = sostituzioni(titolari, panchinari, completed);


          let played = sq[j][0].pl == null ? 0 : giocatori.slice(0, 11).reduce((partialSum, x) => partialSum + x.b[2] + x.b[6], 0);
          squadre_con_statistica.filter(x => x.Id == sq[j][0].id)[0].Titolari.push(played);
          let benched = sq[j][0].pl == null ? 0 : giocatori.slice(11, 22).reduce((partialSum, x) => partialSum + x.b[2] + x.b[6], 0);
          squadre_con_statistica.filter(x => x.Id == sq[j][0].id)[0].Panca.push(benched);
        }
      }

      // Crea datasets cosi da semplificare HTML
      let montero = [];
      for (let i = squadre_con_statistica.length - 1; i >= 0; i--) {
        let s = squadre_con_statistica[i];
        montero.push({
          'Id': s.Id,
          'Name': s.Name,
          'Coach': s.Coach,
          'Jersey': s.Jersey,
          'Col1': s.yellowCards,
          'Col2': s.redCards,
          'Col3': 2 * s.redCards + s.yellowCards
        })
      }
      montero.sort((a, b) => { return b.Col3 - a.Col3 });
      this.montero = montero;

      let totti = [];
      for (let i = squadre_con_statistica.length - 1; i >= 0; i--) {
        let s = squadre_con_statistica[i];
        totti.push({
          'Id': s.Id,
          'Name': s.Name,
          'Coach': s.Coach,
          'Jersey': s.Jersey,
          'Col1': s.penaltiesScored,
          'Col2': s.penaltiesNotScored,
          'Col3': s.penaltiesScored - s.penaltiesNotScored
        })
      }
      totti.sort((a, b) => { return b.Col3 - a.Col3 });
      this.totti = totti;

      let muriel = [];
      for (let i = squadre_con_statistica.length - 1; i >= 0; i--) {
        let s = squadre_con_statistica[i];
        muriel.push({
          'Id': s.Id,
          'Name': s.Name,
          'Coach': s.Coach,
          'Jersey': s.Jersey,
          'Col1': s.Titolari.reduce((partialSum, x) => partialSum + x, 0),
          'Col2': s.Panca.reduce((partialSum, x) => partialSum + x, 0),
          'Col3': (s.Titolari.reduce((partialSum, x) => partialSum + x, 0) + s.Panca.reduce((partialSum, x) => partialSum + x, 0)) == 0 ? 0 : Math.round(100 * (s.Panca.reduce((partialSum, x) => partialSum + x, 0) / (s.Titolari.reduce((partialSum, x) => partialSum + x, 0) + s.Panca.reduce((partialSum, x) => partialSum + x, 0))), 1)
        })
      }
      muriel.sort((a, b) => { return b.Col3 - a.Col3 });
      for (var i = 0; i < muriel.length; i++) {
        muriel[i].Col3 = muriel[i].Col3 + '%'
      }
      this.muriel = muriel;

      this.to_load = 'Completato';
    }
  };
</script>
