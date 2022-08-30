export default function aggiorna_filtri_giocatori(g, f){
	// Filtrato
	let g_f = g;
	
	// Nome Giocatore
	g_f = g_f.filter(x => x.Giocatore.Nome.includes(f.Nome));

	// 
	// Numerici
	g_f = g_f.filter(x => x.Giocatore.Caps >= f.Presenze[0] && x.Giocatore.Caps <= f.Presenze[1]);

	return g_f;
}