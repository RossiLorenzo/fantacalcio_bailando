<template>
	<div v-if="to_load!='Completato'">
		<div class="row">
			<div class="col-2 mt-3">
			</div>
			<div class="col-8 mt-3">
				<info-card
				:title="to_load"
				icon_bg='bg-gradient-success'
				classIcon='fas fa-rocket'
				/>
				<div v-if="loadTime" class="text-center mt-2">
					<small class="text-muted">Loading time: {{ loadTime }}ms</small>
				</div>
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
											<th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 p-0">Live</th>
											<th class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 p-0">Previsti</th>
										</tr>
									</thead>

									<tbody>
										<tr v-for="(squadra, index3) in classifica" :key="index3">
											<td style="padding: 0rem 0.0rem !important">
												<RankingArrows
												:final_rank="squadra.new_rank"
												:initial_rank="squadra.old_rank"
												/>
											</td>
											<td style="padding: 0rem 0.0rem !important">
												<ImageText
												:image="jerseyBase + squadra.Jersey"
												:secondary_text="squadra.Coach"/>
											</td>
											<td style="padding: 0rem 0.0rem !important">
												<p class="text-xs text-secondary mb-0 " style="padding: 0rem 0.5rem !important;">{{ squadra.Punti }} </p>
											</td>

											<td style="padding: 0rem 0.0rem !important">
												<ArgonBadge size="sm" variant="gradient" color="secondary"> {{ squadra.Punti_Live }} </ArgonBadge>
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
												<ImageText v-if="inc['n_a'] == 'Juventus'"
												:image="'https://components2.gazzettaobjects.it/rcs_gaz_gazzetta-layout/v2/assets/img/ext/loghi-squadre/juventus_black.png'"
												:text="inc['g_a'].toString()"
												/>
												<ImageText v-else
												:image="'https://components2.gazzettaobjects.it/rcs_gaz_gazzetta-layout/v2/assets/img/ext/loghi-squadre/' + inc['n_a'].toLowerCase() + '.png'"
												:text="inc['g_a'].toString()"
												/>
											</td>
											<td style="padding: 0rem 0rem !important">
												<ImageText v-if="inc['n_b'] == 'Juventus'"
												:image="'https://components2.gazzettaobjects.it/rcs_gaz_gazzetta-layout/v2/assets/img/ext/loghi-squadre/juventus_black.png'"
												:text="inc['g_b'].toString()"
												/>
												<ImageText v-else
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
			<div class="col-lg-4 col-md-5 col-sm-6" :class="{ 'd-none d-md-block': !hasScontriDiretti }">

				<div class="mb-3 card mt-lg-0 mt-md-4 mt-0">
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
													<ImageText
													:image="jerseyBase + formazioni[inc.ida].Jersey"
													:text="Math.max(Math.floor((formazioni[inc.ida].Punti_Previsti - 66)/4)+1, 0).toString()"
													/>
												</td>

												<td style="padding: 0rem 0.0rem !important">
													<ImageText v-if="!inc.bye"
													:image="jerseyBase + formazioni[inc.idb].Jersey"
													:text="Math.max(Math.floor((formazioni[inc.idb].Punti_Previsti - 66)/4)+1, 0).toString()"
													/>
													<!-- text-dark: the light gradient would swallow the badge's default white -->
													<ArgonBadge v-else size="sm" variant="gradient" color="light" class="text-dark ms-2"> Riposo </ArgonBadge>
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
					<div class="col-lg-3 col-md-4 col-sm-6 col-xs-6 mb-4" v-for="(formazione, index) in formazioni" :key="index">
						<div class="card">
							<div class="p-3 pb-0 card-header">
								<ImageText
								:image="jerseyBase + formazione.Jersey"
								:text="formazione.Name"
								:secondary_text="formazione.Coach"/>
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
												<div v-if="formazione.Mostra == 'Titolari'" class="d-flex flex-row">
													<div v-if="giocatore.fv == 100 && giocatore.status == 4">
														<div class="d-flex flex-row justify-content-left">
														<ImageText
														:image="campioncinoBase + giocatore.immagine + '.png'"
														:text="giocatore.n"
														:sub="true"
														:secondary_text="mapping_roles[giocatore.r]"/>
														<div v-if="giocatore.sostituto.immagine == undefined">
															<ImageText
																:image="ban"
																:text="giocatore.sostituto.n"
															/>
														</div>
														<div v-else>
															<ImageText
																:image="campioncinoBase + giocatore.sostituto.immagine + '.png'"
																:text="giocatore.sostituto.n"
																:secondary_text="mapping_roles[giocatore.r]"
															/>
														</div>

														</div>
													</div>

													<div v-else>
														<ImageText
														:image="campioncinoBase + giocatore.immagine + '.png'"
														:text="giocatore.n"
														:secondary_text="mapping_roles[giocatore.r]"/>
													</div>

												</div>
												<!-- Per i panchinari no -->
												<div v-else class="d-flex flex-column justify-content-center">
														<ImageText
														:image="campioncinoBase + giocatore.immagine + '.png'"
														:text="giocatore.n"
														:secondary_text="mapping_roles[giocatore.r]"/>
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
											<ColorPagella v-else :voto="giocatore.voto_finale"/>
										</td>
										</tr>
									</tbody>
								</table>
							</div>

							<div class="container-fluid pb-2">
								<div class="row">
									<div class="col-lg-6">
										<argon-button
											:color="activeView[index] === 'Titolari' ? 'success' : 'secondary'"
											size="xs"
											variant="outline"
											@click="switchView(index, 'Titolari')">
											Titolari
										</argon-button>
									</div>
									<div class="col-lg-6">
										<argon-button
											:color="activeView[index] === 'Panchinari' ? 'success' : 'secondary'"
											size="xs"
											variant="outline"
											@click="switchView(index, 'Panchinari')">
											Panca
										</argon-button>
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
	import ArgonButton from "@/components/ui/ArgonButton.vue";
	import ArgonBadge from "@/components/ui/ArgonBadge.vue";
	import InfoCard from "@/components/cards/InfoCard.vue";

	import fantacalcio_apis from "@/utils/api.js";
	import async_cors_request from "@/utils/asyncCors.js";
	import async_gaming_request from "@/utils/asyncGaming.js";

	import live_votes_status from "@/utils/calculations/voti.js";
	import aggiorna_formazioni from "@/utils/calculations/formazioni.js";
	import calcolo_classifica_lega from "@/utils/calculations/classifiche.js";
	import scontri_diretti from "@/utils/calculations/scontri.js";
	import dataCache from "@/utils/cache.js";
	import { competizioni_attive, jerseyYear } from "@/config/season.js";

	import ImageText from "@/components/fantacalcio/ImageText.vue";
	import RankingArrows from "@/components/fantacalcio/RankingArrows.vue";
	import ColorPagella from "@/components/fantacalcio/ColorPagella.vue";

	import ban from "@/assets/img/ban-xxl.png";

	export default {
		name: "Live",
		components: {
			ArgonButton,
			ArgonBadge,
			InfoCard,
			ImageText,
			RankingArrows,
			ColorPagella
		},
		data() {
			return {
				formazioni: {},
				mapping_roles: {
					'P': 'Portiere',
					'D': 'Difensore',
					'C': 'Centrocampista',
					'A': 'Attaccante',
					'NA': 'NA'
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
				mapping_match_events: {
					'1': {'Event_Name': 'Giallo', 'Bonus': -0.5},
					'2': {'Event_Name': 'Rosso', 'Bonus': -1},
					'3': {'Event_Name': 'Goal', 'Bonus': 3},
					'4': {'Event_Name': 'Goal Subito', 'Bonus': -1},
					'7': {'Event_Name': 'Rigore Parato', 'Bonus': 3},
					'8': {'Event_Name': 'Rigore Sbagliato', 'Bonus': -3},
					'9': {'Event_Name': 'Rigore Segnato', 'Bonus': 3},
					'10': {'Event_Name': 'Autogoal', 'Bonus': -2},
					'21': {'Event Name': 'Assist', 'Bonus': 1},
					'22': {'Event Name': 'Assist', 'Bonus': 1},
					'23': {'Event Name': 'Assist', 'Bonus': 1}
				},
				classifica: {},
				to_load: 'CARICAMENTO Giornata Attiva',
				played: {},
				scontri_diretti: {},
				ban,
				delay: null,
				campionatoId: null,
				year: null,
				squadre: null,
				campionato: null,
				coppe: null,
				all_players: null,
				refreshInterval: null,
				loadTime: null,
				activeView: {}
			};
		},
computed: {
			storeGiornata() {
				return this.$store.state.giornata;
			},
			campioncinoBase() {
				// Player mugshots are filed under the season id, not the year.
				return 'https://content.fantacalcio.it/web/campioncini/' + this.year + '/small/';
			},
			jerseyBase() {
				// `year` is the timer's id_stagione (20 = 2025/26, 21 = 2026/27);
				// the CDN folder is keyed by the calendar year the season starts in.
				return 'https://d2lhpso9w1g8dk.cloudfront.net/web/risorse/maglietta_'
					+ jerseyYear(this.year) + '/';
			},
			hasScontriDiretti() {
				if (!this.scontri_diretti || typeof this.scontri_diretti !== 'object') {
					return false;
				}
				return Object.keys(this.scontri_diretti).length > 0;
			}
		},
		watch: {
			storeGiornata(newGiornata, oldGiornata) {
				if (newGiornata !== null && oldGiornata !== null && newGiornata !== oldGiornata) {
					this.loadGiornataData(newGiornata);
				}
			}
		},
		async beforeCreate() {
			const startTime = performance.now();
			let completed = false;

			try {
				this.to_load = "CARICAMENTO Dati...";

				// Check cache for static data
				const cachedSquadre = dataCache.get('squadre');
				const cachedPlayers = dataCache.get('all_players');
				const cachedCoppe = dataCache.get('coppe');
				const cachedCampionato = dataCache.get('campionato');
				const cachedProfilo = dataCache.get('lega_profilo');

				// Which competitions this season uses is read off the lega profilo,
				// so a new season needs no code change. Everything else depends on
				// those ids, so this round trip has to come first.
				const [timer, profilo] = await Promise.all([
					fantacalcio_apis('timer', new Map([['function', async_cors_request], ['method', 'get']])),
					cachedProfilo ? Promise.resolve(cachedProfilo) :
						fantacalcio_apis('lega_profilo', new Map([['function', async_cors_request], ['method', 'get']]))
				]);
				if (!cachedProfilo) dataCache.set('lega_profilo', profilo);

				const { campionato: campionatoId, coppe: coppeIds, delay, squadre: squadreAttive } = competizioni_attive(profilo);
				this.campionatoId = campionatoId;

				// Use cached data or fetch
				const squadrePromise = cachedSquadre ? Promise.resolve(cachedSquadre) :
					fantacalcio_apis('squadre', new Map([['function', async_cors_request], ['method', 'get']]));

				const playersPromise = cachedPlayers ? Promise.resolve(cachedPlayers) :
					fantacalcio_apis('lista_calciatori', new Map([['function', async_cors_request], ['method', 'get']]));

				const campionatoPromise = cachedCampionato ? Promise.resolve(cachedCampionato) :
					fantacalcio_apis('competizioni', new Map([['function', async_cors_request], ['method', 'get'], ['competizione', campionatoId]]));

				const coppePromises = cachedCoppe ? Promise.resolve(cachedCoppe) :
					Promise.all(coppeIds.map(comp =>
						fantacalcio_apis('competizioni', new Map([['function', async_cors_request], ['method', 'get'], ['competizione', comp]]))
					));

				// Execute all in parallel
				const [squadreData, playersData, campionatoData, coppeData] = await Promise.all([
					squadrePromise,
					playersPromise,
					campionatoPromise,
					coppePromises
				]);

				let giornata = timer['data']['giornata'] - delay;
				if (new Date(timer.data.data_inizio_turno + '+0200') >= new Date()) {
					giornata = giornata - 1;
				}
				if (giornata == 99) {
					giornata = 37;
				}
				// Before the lega's first giornata is played there is nothing to show;
				// clamp so the calendar lookups stay in range.
				giornata = Math.max(giornata, 1);
				let year = timer['data']['id_stagione'];

				this.$store.commit('setGiornata', giornata);
				this.$store.commit('setGiornataAttuale', giornata);
				this.$store.commit('setStagione', year);
				this.$store.commit('setDelay', delay);

				this.delay = delay;
				this.year = year;

				let squadre, all_players, campionato, coppe;

				// Process and cache data
				if (cachedSquadre) {
					squadre = squadreData;
				} else {
					squadre = squadreData;
					// Keep only the teams entered in this season's campionato: that
					// drops both retired teams and the "New Riposo" bye placeholder.
					squadre.data = squadre.data.filter(x => squadreAttive.includes(x.id));
					dataCache.set('squadre', squadre);
				}

				if (cachedPlayers) {
					all_players = playersData;
				} else {
					all_players = playersData;
					dataCache.set('all_players', all_players);
				}

				if (cachedCampionato) {
					campionato = campionatoData;
				} else {
					campionato = campionatoData;
					dataCache.set('campionato', campionato);
				}

				if (cachedCoppe) {
					coppe = coppeData;
				} else {
					coppe = coppeData;
					dataCache.set('coppe', coppe);
				}

				this.squadre = squadre;
				this.campionato = campionato;
				this.coppe = coppe;
				this.all_players = all_players;

				// Initialize activeView for all teams
				const squadreIds = squadre.data.map(x => x.id);
				const activeViewInit = {};
				squadreIds.forEach(id => {
					activeViewInit[id] = 'Titolari';
				});
				this.activeView = activeViewInit;

				// Fetch formazioni and live data in parallel
				const [formazioni, giornataLive] = await Promise.all([
					this.fetchLineups(giornata),
					fantacalcio_apis(
						'giornata_live',
						new Map([['function', async_cors_request], ['method', 'get'], ['giornata', giornata + delay], ['year', year]])
					)
				]);

				const liveData = [{url: 'https://d2lhpso9w1g8dk.cloudfront.net', data: giornataLive}];
				const l_and_s = live_votes_status(liveData, this.mapping_match_events);
				this.played = l_and_s.played;

				this.formazioni = aggiorna_formazioni(formazioni, l_and_s, completed, squadre, all_players, undefined);
				this.classifica = calcolo_classifica_lega(squadre, campionato, giornata, this.formazioni);
				this.scontri_diretti = scontri_diretti(coppe, giornata + delay, this.formazioni);

				// Set up refresh interval with parallel fetching
				this.refreshInterval = setInterval(async () => {
					const currentGiornata = this.$store.state.giornata;

					const [newFormazioni, newGiornataLive] = await Promise.all([
						this.fetchLineups(currentGiornata),
						fantacalcio_apis(
							'giornata_live',
							new Map([['function', async_cors_request], ['method', 'get'], ['giornata', currentGiornata + this.delay], ['year', this.year]])
						)
					]);

					const newLiveData = [{url: 'https://d2lhpso9w1g8dk.cloudfront.net', data: newGiornataLive}];
					const new_l_and_s = live_votes_status(newLiveData, this.mapping_match_events);
					this.played = new_l_and_s.played;

					let prev_formazioni = this.formazioni;
					this.formazioni = aggiorna_formazioni(newFormazioni, new_l_and_s, completed, this.squadre, this.all_players, prev_formazioni);
					this.classifica = calcolo_classifica_lega(this.squadre, this.campionato, currentGiornata, this.formazioni);
					this.scontri_diretti = scontri_diretti(this.coppe, currentGiornata + this.delay, this.formazioni);
				}, completed ? 120000 : 30000);

				const endTime = performance.now();
				this.loadTime = Math.round(endTime - startTime);
				console.log(`⚡ Page loaded in ${this.loadTime}ms`);

				this.to_load = "Completato";
			} catch (error) {
				console.error('Error loading data:', error);
				this.to_load = "Errore nel caricamento";
			}
		},
		methods: {
			// The gaming API serves one lineup per request, so a giornata is one
			// call per team. `avversario` 0 asks for the one-vs-all view, which is
			// what the campionato is; the cups' head-to-head pairings come from
			// scontri_diretti, which reads the competition calendar instead.
			async fetchLineups(giornata) {
				const ids = this.squadre.data.map(x => x.id);
				const lineups = await Promise.all(ids.map(id =>
					fantacalcio_apis('lineup_live', new Map([
						['function', async_gaming_request],
						['method', 'get'],
						['competizione', this.campionatoId],
						['giornata', giornata],
						['giornata_serie_a', giornata + this.delay],
						['squadra', id],
						['avversario', 0]
					]))
				));
				const by_team = {};
				ids.forEach((id, i) => {
					// The endpoint echoes the requested team back as `home`.
					by_team[id] = lineups[i] ? lineups[i].home : undefined;
				});
				return by_team;
			},
			async loadGiornataData(giornata) {
				const startTime = performance.now();
				this.to_load = "CARICAMENTO Giornata " + (giornata + this.delay);

				const [formazioni, giornataLive] = await Promise.all([
					this.fetchLineups(giornata),
					fantacalcio_apis(
						'giornata_live',
						new Map([['function', async_cors_request], ['method', 'get'], ['giornata', giornata + this.delay], ['year', this.year]])
					)
				]);

				const liveData = [{url: 'https://d2lhpso9w1g8dk.cloudfront.net', data: giornataLive}];
				const l_and_s = live_votes_status(liveData, this.mapping_match_events);
				this.played = l_and_s.played;

				this.formazioni = aggiorna_formazioni(formazioni, l_and_s, false, this.squadre, this.all_players, undefined);
				this.classifica = calcolo_classifica_lega(this.squadre, this.campionato, giornata, this.formazioni);
				this.scontri_diretti = scontri_diretti(this.coppe, giornata + this.delay, this.formazioni);

				const endTime = performance.now();
				this.loadTime = Math.round(endTime - startTime);

				this.to_load = "Completato";
			},
			switchView(index, view) {
				this.activeView[index] = view;
				this.formazioni[index]['Mostra'] = view;
			}
		},
		beforeUnmount() {
			if (this.refreshInterval) {
				clearInterval(this.refreshInterval);
			}
		}
	};
</script>
