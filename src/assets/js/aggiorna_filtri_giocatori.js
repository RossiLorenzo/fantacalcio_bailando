export default function aggiorna_filtri_giocatori(g, f){
	// Filtrato
	let g_f = g;
	console.log(f)
	
	// Nome Giocatore
	g_f = g_f.filter(x => x.Giocatore.Nome.includes(f.Nome));
	
	// Ruolo
	if (f.Ruolo != null) {
		if (f.Ruolo.length != 0) {
			g_f = g_f.filter(x => f.Ruolo == x.Giocatore.Ruolo_Corto);
		}
	}

	// Squadra Reale
	if (f.Squadra_Reale != null) {
		if (f.Squadra_Reale.length != 0) {
			g_f = g_f.filter(x => f.Squadra_Reale.Code == x.Squadra_Reale.Nome_Corto);
		}
	}

	// Squadra Fantacalcio
	if (f.Squadra_Fantacalcio != null) {
		if (f.Squadra_Fantacalcio.length != 0) {
			g_f = g_f.filter(x => f.Squadra_Fantacalcio.n == x.Squadra_Fantacalcio.Squadra);
		}
	}

	// Numerici
	g_f = g_f.filter(x => x.Giocatore.Caps >= f.Presenze[0] && x.Giocatore.Caps <= f.Presenze[1]);

	return g_f;
}