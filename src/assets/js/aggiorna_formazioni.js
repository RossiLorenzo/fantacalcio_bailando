import mod_difesa from "@/assets/js/modificatore_difesa.js";
import sostituzioni from "@/assets/js/sostituzioni.js";

export default function aggiorna_formazioni(formazioni, l_and_s, completed, all_datasets){
	// Calcola formazioni aggiornate
	let f = formazioni['data']['formazioni'];
	let squadre = all_datasets.filter(x => x.url.includes('v1_lega/squadre')).map(x => x.data)[0];
	let p_stats = all_datasets.filter(x => x.url.includes('players/playersStat')).map(x => x.data)[0];
	
	let f_u = {};
	for (let i = 0; i < f.length; i++) {

		let s_id = f[i]['sq'][0]['id'];
		// Dividi titolari e panchinari
		let giocatori = f[i]['sq'][0]['pl'];
		for (let j = giocatori.length - 1; j >= 0; j--) {
			giocatori[j].status = l_and_s.status[giocatori[j].t.toUpperCase()];
		}
		let titolari = giocatori.slice(0, 11);
		let panchinari = giocatori.slice(11, 22);
			
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
			titolari[j]['immagine'] = p_stats.filter(x => x.id == titolari[j].id)[0].img;
			panchinari[j]['immagine'] = p_stats.filter(x => x.id == panchinari[j].id)[0].img;
					
			// Aggiorna voti con live
			if (titolari[j].status > 0 && titolari[j].fv == 100) {
				if (l_and_s.voti[titolari[j]['id']] != undefined && l_and_s.voti[titolari[j]['id']].vt <= 10) {
					titolari[j]['voto_finale'] = l_and_s.voti[titolari[j]['id']].fv;
					titolari[j]['voto_iniziale'] = l_and_s.voti[titolari[j]['id']].vt;
					titolari[j]['fv'] = l_and_s.voti[titolari[j]['id']];
					titolari[j]['in_calcolo'] = true;
				}
			}
				
			if (panchinari[j].status > 0 && panchinari[j].fv == 100) {
				if (l_and_s.voti[panchinari[j]['id']] != undefined && l_and_s.voti[panchinari[j]['id']].vt <= 10) {
					panchinari[j]['voto_finale'] = l_and_s.voti[panchinari[j]['id']].fv;
					panchinari[j]['voto_iniziale'] = l_and_s.voti[panchinari[j]['id']].vt;
					panchinari[j]['fv'] = l_and_s.voti[panchinari[j]['id']];
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
			'Modulo': f[i]['sq'][0]['m'].split(';')[0],
			'Ultimo_Aggiornamento': Math.floor((Date.parse(Date()) - Date.parse(f[i]['sq'][0]['dt'])) / (1000 * 60 * 60)),
			'Titolari': titolari,
			'Panchinari': panchinari,
			'Mostra': 'Titolari',
			'Punti': f[i]['sq'][0]['t'],
			'Punti_Previsti': exp_points + mod_difesa(titolari)
		}
	}
	return(f_u);
}
