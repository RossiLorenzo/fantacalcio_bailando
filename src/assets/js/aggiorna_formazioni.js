import mod_difesa from "@/assets/js/modificatore_difesa.js";
import sostituzioni from "@/assets/js/sostituzioni.js";

export default function aggiorna_formazioni(formazioni, l_and_s, completed, squadre, p_stats, prev_f){
	// Calcola formazioni aggiornate
	let f = formazioni['data']['formazioni'];
	
	// IDs delle squadre
	let ids = squadre.data.map(x => x.id)

	let f_u = {};
	for (let i = 0; i < ids.length; i++) {

		// Setta squadre
		let s_id = ids[i];
		let s_f = f.filter(x => x['sq'][0]['id'] == s_id);

		// Metti dummy per squadre senza formazione
		let giocatori
		if (s_f.length == 0) {
			let non_schierata = [];
			for (let k = 0; k < 22; k++) {
				non_schierata.push({
					id: 219,
					fv: 0,
					vt: 0,
					r: 'NA', 
					n: 'Non Schierato',
					t: null,
					status: 4
				})
			}
			giocatori = non_schierata;
		} else {
			giocatori = s_f[0]['sq'][0]['pl'];
			if(giocatori == null){
				let non_schierata = [];
				for (let k = 0; k < 22; k++) {
					non_schierata.push({
						id: 219,
						fv: 0,
						vt: 0,
						r: 'NA', 
						n: 'Non Schierato',
						t: null,
						status: 4
					})
				}
				giocatori = non_schierata;
			} else {
				for (let j = giocatori.length - 1; j >= 0; j--) {
					giocatori[j].status = l_and_s.status[giocatori[j].t.toUpperCase()].status;
				}				
			} 
		}

		// Trova giocatori
		let titolari = giocatori.slice(0, 11);
		let panchinari = giocatori.slice(11, 22);

		// Attiva lo switch
		let switch_out = s_f[0]['sq'][0]['sa'];
		let switch_in = s_f[0]['sq'][0]['sb'];
		// Controlla che ci sia uno switch
		if(switch_out != 0){
			// Controlla che lo switch non sia gia stato implementato
			if(titolari.filter(x => x.id == switch_out)[0] != undefined){
				// Controlla che la partita sia iniziata
				let squadra_switch_out = giocatori.filter(x => x.id == switch_out)[0].t;
				if(l_and_s.status[squadra_switch_out].status != 0){
					// Controlla che il giocatore NON sia titolare
					if(l_and_s.voti[switch_out] == undefined){
						let to_switch_out_data = titolari.filter(x => x.id == switch_out)[0]
						let to_switch_out_index = titolari.findIndex(x => x.id == switch_out)
						let to_switch_in_index = panchinari.findIndex(x => x.id == switch_in)
						titolari[to_switch_out_index] = panchinari[to_switch_in_index]
						panchinari[to_switch_in_index] = to_switch_out_data
					} else {
						if(!l_and_s.voti[switch_out].titolare){
							let to_switch_out_data = titolari.filter(x => x.id == switch_out)[0]
							let to_switch_out_index = titolari.findIndex(x => x.id == switch_out)
							let to_switch_in_index = panchinari.findIndex(x => x.id == switch_in)
							titolari[to_switch_out_index] = panchinari[to_switch_in_index]
							panchinari[to_switch_in_index] = to_switch_out_data
						} 
					}
				}
			}
		}

			
		// Aggiorna voti
		for (let j = 0; j < 11; j++) {
			
			// Crea categoria voto finale
			titolari[j]['voto_finale'] = titolari[j]['fv'];
			titolari[j]['voto_iniziale'] = titolari[j]['vt'];
			titolari[j]['in_calcolo'] = false;
			panchinari[j]['voto_finale'] = panchinari[j]['fv'];
			panchinari[j]['voto_iniziale'] = panchinari[j]['vt'];
			panchinari[j]['in_calcolo'] = false;

			// Aggiungi immagine
			titolari[j]['immagine'] = p_stats.data.filter(x => x.id == titolari[j].id)[0].img;
			panchinari[j]['immagine'] = p_stats.data.filter(x => x.id == panchinari[j].id)[0].img;
					
			// Aggiorna voti con live
			if (titolari[j].status > 0 && titolari[j].fv == 100) {
				if (l_and_s.voti[titolari[j]['id']] != undefined && l_and_s.voti[titolari[j]['id']].vt <= 10) {
					titolari[j]['voto_finale'] = l_and_s.voti[titolari[j]['id']].fv;
					titolari[j]['voto_iniziale'] = l_and_s.voti[titolari[j]['id']].vt;
					titolari[j]['fv'] = l_and_s.voti[titolari[j]['id']].fv;
					titolari[j]['in_calcolo'] = true;
				}
			}
				
			if (panchinari[j].status > 0 && panchinari[j].fv == 100) {
				if (l_and_s.voti[panchinari[j]['id']] != undefined && l_and_s.voti[panchinari[j]['id']].vt <= 10) {
					panchinari[j]['voto_finale'] = l_and_s.voti[panchinari[j]['id']].fv;
					panchinari[j]['voto_iniziale'] = l_and_s.voti[panchinari[j]['id']].vt;
					panchinari[j]['fv'] = l_and_s.voti[panchinari[j]['id']].fv;
					panchinari[j]['in_calcolo'] = true;
				}
			}
		}

		// Effettua sostituzioni
		titolari = sostituzioni(titolari, panchinari, completed);

		// Calculate expected points
		let exp_points = titolari.reduce((partialSum, x) => partialSum + (x['voto_finale'] == 100 ? 6 : x['voto_finale']), 0);
		// Popola dati puliti
		f_u[s_id] = {
			'Name': squadre['data'].filter(y => y.id == s_id)[0]['n'],
			'Coach': squadre['data'].filter(y => y.id == s_id)[0]['nu'],
			'Jersey': squadre['data'].filter(y => y.id == s_id)[0]['ms'],
			// 'Modulo': f[i]['sq'][0]['m'].split(';')[0],
			// 'Ultimo_Aggiornamento': Math.floor((Date.parse(Date()) - Date.parse(f[i]['sq'][0]['dt'])) / (1000 * 60 * 60)),
			'Titolari': titolari,
			'Panchinari': panchinari,
			// 'Punti': f[i]['sq'][0]['t'],
			'Punti_Previsti': exp_points + mod_difesa(titolari),
			'Mostra': prev_f == undefined ? 'Titolari' : prev_f[s_id]['Mostra'] 
		}
	}
	return(f_u);
}
