import mod_difesa from "@/utils/calculations/difesa.js";
import sostituzioni from "@/utils/calculations/sostituzioni.js";

// Sentinel the API uses for "no fantavoto yet" (and 56 / 55 for senza voto).
const NO_VOTE = 100;

function non_schierata(){
	let giocatori = [];
	for (let k = 0; k < 22; k++) {
		giocatori.push({
			id: 219,
			fv: 0,
			vt: 0,
			r: 'NA',
			n: 'Non Schierato',
			t: null,
			status: 4,
			immagine: null,
			voto_finale: 0,
			voto_iniziale: 0,
			in_calcolo: false
		});
	}
	return giocatori;
}

// The gaming API returns lineups as bare player ids plus the scores it has
// already calculated (`scr` = voto, `cscr` = fantavoto, both 100 until the
// player's Serie A match has been played). Everything else about the player —
// name, role, image, which Serie A side he plays for — comes from the listone.
function costruisci_giocatore(p, p_index, l_and_s){
	let anagrafica = p_index[p.pid];
	let id_s = anagrafica ? anagrafica.id_s : null;
	let status = (id_s != null && l_and_s.status[id_s] != undefined) ? l_and_s.status[id_s].status : 4;

	let giocatore = {
		id: p.pid,
		id_s: id_s,
		n: anagrafica ? anagrafica.n : 'Sconosciuto',
		r: anagrafica ? anagrafica.r_f : 'NA',
		immagine: anagrafica ? anagrafica.img : null,
		vt: p.scr,
		fv: p.cscr,
		bonus: p.b,
		status: status,
		voto_iniziale: p.scr,
		voto_finale: p.cscr,
		in_calcolo: false
	};

	// The gaming API only publishes a fantavoto once the match is over: while
	// one is running every cscr is still 100. So for a player whose match has
	// kicked off but has no server score yet, fall back to the Gazzetta live
	// feed, which updates in real time. `in_calcolo` marks it as provisional
	// and the UI renders it with an asterisk.
	if (status > 0 && p.cscr == NO_VOTE) {
		let live = l_and_s.voti[p.pid];
		// vt above 10 is a sentinel (56/55 = senza voto), not a real vote.
		if (live != undefined && live.vt <= 10) {
			giocatore.voto_finale = live.fv;
			giocatore.voto_iniziale = live.vt;
			giocatore.fv = live.fv;
			giocatore.vt = live.vt;
			giocatore.in_calcolo = true;
		}
	}

	return giocatore;
}

// `lineups` is { [team id]: gaming/v1 teamLineup live response }.
export default function aggiorna_formazioni(lineups, l_and_s, completed, squadre, p_stats, prev_f){

	// Index the listone once instead of scanning it per player.
	let p_index = {};
	for (let i = 0; i < p_stats.data.length; i++) {
		p_index[p_stats.data[i].id] = p_stats.data[i];
	}

	let ids = squadre.data.map(x => x.id);

	let f_u = {};
	for (let i = 0; i < ids.length; i++) {
		let s_id = ids[i];
		let lineup = lineups[s_id];

		let titolari, panchinari, punti_server;
		if (lineup == undefined || lineup.act != 1 || !lineup.starts || lineup.starts.length == 0) {
			let giocatori = non_schierata();
			titolari = giocatori.slice(0, 11);
			panchinari = giocatori.slice(11, 22);
			punti_server = 0;
		} else {
			titolari = lineup.starts.map(p => costruisci_giocatore(p, p_index, l_and_s));
			panchinari = lineup.bench.map(p => costruisci_giocatore(p, p_index, l_and_s));
			punti_server = lineup.tot;
		}

		// The manual switch the old API exposed as sa/sb is already reflected in
		// the order the gaming API returns, so there is nothing to swap here.

		// Effettua sostituzioni
		titolari = sostituzioni(titolari, panchinari, completed);

		// Calculate expected points: a player still without a fantavoto is
		// projected at 6, same as before.
		let exp_points = titolari.reduce((partialSum, x) => partialSum + (x['voto_finale'] == NO_VOTE ? 6 : x['voto_finale']), 0);

		let squadra = squadre['data'].filter(y => y.id == s_id)[0];
		f_u[s_id] = {
			'Name': squadra['n'],
			'Coach': squadra['nu'],
			'Jersey': squadra['ms'],
			'Modulo': lineup != undefined ? lineup.mdl : null,
			'Titolari': titolari,
			'Panchinari': panchinari,
			// What the official app shows as the live total: the server's own
			// sum over starters who already have a fantavoto, no projection.
			'Punti_Server': punti_server,
			'Punti_Previsti': exp_points + mod_difesa(titolari),
			'Mostra': prev_f == undefined ? 'Titolari' : prev_f[s_id]['Mostra']
		}
	}
	return(f_u);
}
