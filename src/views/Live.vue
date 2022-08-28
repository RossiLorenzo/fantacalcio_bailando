
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
												<div v-if="formazione.Mostra == 'Titolari'" class="d-flex flex-row">
													<div v-if="giocatore.fv == 100 && giocatore.status == 4">
														<div class="d-flex flex-row justify-content-left">
														<LorenzoImageText 
														:image="giocatore.immagine"
														:text="giocatore.n"
														:sub="true"
														:secondary_text="mapping_roles[giocatore.r]"/>
														<div v-if="giocatore.sostituto.immagine == undefined">
															<LorenzoImageText 
																:image="ban"
																:text="giocatore.sostituto.n"
															/>
														</div>
														<div v-else>
															<LorenzoImageText 
																:image="giocatore.sostituto.immagine"
																:text="giocatore.sostituto.n"
																:secondary_text="mapping_roles[giocatore.r]"
															/>
														</div>

														</div>
													</div>

													<div v-else>
														<LorenzoImageText 
														:image="giocatore.immagine"
														:text="giocatore.n" 
														:secondary_text="mapping_roles[giocatore.r]"/>
													</div>
												</div>
												<!-- Per i panchinari no -->
												<div v-else class="d-flex flex-column justify-content-center">
														<LorenzoImageText 
														:image="giocatore.immagine"
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
	import DefaultInfoCard from "@/examples/Cards/DefaultInfoCard.vue";

	import fantacalcio_apis from "@/assets/js/fantacalcio_apis.js";
	import cors_request from "@/assets/js/cors_request.js";
	import async_cors_request from "@/assets/js/async_cors_request.js";
	import evaluate_promises from "@/assets/js/evaluate_promises.js";

	import live_votes_status from "@/assets/js/live_votes_status.js";
	import aggiorna_formazioni from "@/assets/js/aggiorna_formazioni.js";
	import calcolo_classifica_lega from "@/assets/js/calcolo_classifica_lega.js";
	import scontri_diretti from "@/assets/js/scontri_diretti.js";

	import LorenzoImageText from "@/views/components/LorenzoImageText.vue";
	import LorenzoRankingArrows from "@/views/components/LorenzoRankingArrows.vue";

	import ban from "@/assets/img/ban-xxl.png";

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
				mapping_match_events: {
					'1': {'Event_Name': 'Giallo', 'Bonus': -0.5},
					'2': {'Event_Name': 'Rosso', 'Bonus': -1},
					'3': {'Event_Name': 'Goal', 'Bonus': 3},
					'4': {'Event_Name': 'Goal Subito', 'Bonus': -1},
					'7': {'Event_Name': 'Rigore Parato', 'Bonus': 3},
					'8': {'Event_Name': 'Rigore Sbagliato', 'Bonus': -3},
					'9': {'Event_Name': 'Rigore Segnato', 'Bonus': 0},
					'10': {'Event_Name': 'Autogoal', 'Bonus': -2},
					'21': {'Event Name': 'Assist', 'Bonus': 1},
					'22': {'Event Name': 'Assist', 'Bonus': 1},
					'23': {'Event Name': 'Assist', 'Bonus': 1}	
				},
				classifica: {},
				to_load: 'CARICAMENTO Giornata Attiva',
				played: {},
				scontri_diretti: {},
				ban
			};
		},
		async beforeCreate() {
			let completed = false;

				// Prima le chiamate che vanno aspettate per forza cosi da sapere la giornata da mostrare
				this.to_load = "CARICAMENTO Opzioni Lega";
				let timer = await fantacalcio_apis(
					'timer', 
					new Map([['function', async_cors_request], ['method', 'get']])
					);
				let giornata = timer['data']['giornata'];
				if (new Date(timer.data.data_inizio_turno) > new Date()) {
					giornata = giornata - 1;
				}
				this.to_load = "CARICAMENTO Formazioni"
				let formazioni = await fantacalcio_apis(
					'formazioni', 
					new Map([['function', async_cors_request], ['method', 'get'], ['giornata', giornata]])
				);
				

				// Poi le chiamate per i dati statici
				this.to_load = "CARICAMENTO Classifiche & Scontri Diretti"
				let all_promises = [];
				let competizioni = [161999, 162028, 162166, 162125, 162183];
				for (let i = competizioni.length - 1; i >= 0; i--) {
					all_promises.push(
						fantacalcio_apis(
							'competizioni', 
							new Map([['function', cors_request], ['method', 'get'], ['competizione', competizioni[i]]])
							)
						)
				}
				all_promises.push(
					fantacalcio_apis(
						'squadre', 
						new Map([['function', cors_request], ['method', 'get']])
						)
					);
				all_promises.push(
					fantacalcio_apis(
						'stats_calciatori', 
						new Map([['function', cors_request], ['method', 'get']])
						)
					);

				// E le chiamate per il Live. Queste verranno poi aggiornate di continuo
				all_promises.push(
					fantacalcio_apis(
						'giornata_live', 
						new Map([['function', cors_request], ['method', 'get'], ['giornata', giornata]])
						)
					);
				let all_datasets = await evaluate_promises(all_promises);
				let all_players = all_datasets.filter(x => x.url.includes('players/playersStat')).map(x => x.data)[0];
				let squadre = all_datasets.filter(x => x.url.includes('v1_lega/squadre')).map(x => x.data)[0];
				let campionato = all_datasets.filter(x => x.url.includes('161999')).map(x => x.data)[0];
				let coppe = all_datasets.filter(x => x.url.includes('V2_LegaCompetizioni') && !x.url.includes('161999')).map(x => x.data);

				// Usando i dati live calcoliamo voti aggiornati e status delle partite
				this.to_load = "CALCOLO Risultati Live"
				let l_and_s = live_votes_status(all_datasets, this.mapping_match_events);
				this.played = l_and_s.played

				// Con i voti aggiornati calcoliamo le formazioni aggiornate
				this.formazioni = aggiorna_formazioni(formazioni, l_and_s, completed, squadre, all_players);
				// Aggiorna la classifica di campionato
				this.classifica = calcolo_classifica_lega(squadre, campionato, giornata, this.formazioni)
				
				// Infine aggiorna gli scontri diretti della giornata
				this.scontri_diretti = scontri_diretti(coppe, giornata)

				// Reload the data every minute
				setInterval(async () => {
					all_promises = [];
					// Chiama nuovamente le API per il Live
					all_promises.push(
						fantacalcio_apis(
							'giornata_live', 
							new Map([['function', cors_request], ['method', 'get'], ['giornata', giornata]])
							)
						);
					all_datasets = await evaluate_promises(all_promises);
					// E chiama anche le formazioni
					formazioni = await fantacalcio_apis(
						'formazioni', 
						new Map([['function', async_cors_request], ['method', 'get'], ['giornata', giornata]])
					);
					// Aggiorna tutto
					l_and_s = live_votes_status(all_datasets, this.mapping_match_events);
					this.played = l_and_s.played
					this.formazioni = aggiorna_formazioni(formazioni, l_and_s, completed, squadre, all_players)
					this.classifica = calcolo_classifica_lega(squadre, campionato, giornata, this.formazioni)
					this.scontri_diretti = scontri_diretti(coppe, giornata)
				}, completed ? 120000 : 30000)

				this.to_load = "Completato";

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
