export default function calcolo_classifica_lega(squadre, campionato, giornata, formazioni){

	// Crea dizionario con squadre e array dei punti
	let squadre_con_classifica = {};
	for (let i = squadre.data.length - 1; i >= 0; i--) {
		let s = squadre.data[i];
		squadre_con_classifica[s.id] = {
			'Id': s.id,
			'Name': s.n,
			'Coach': s.nu,
			'Jersey': s.ms,
			'Punti': []
		}
	}

	// Somma i punti di ogni giornata precedente
	for (let i = 0; i < (giornata-1); i++) {
		let dati_giornata = campionato['data']['cale']['cinc'][i]['inc'];
		for (let j = dati_giornata.length - 1; j >= 0; j--) {
			squadre_con_classifica[dati_giornata[j]['ida']].Punti.push(dati_giornata[j]['pa'])
		}
	}

	// Crea un array sortable con punti sommati
	let classifica = [];
	for (let i = squadre.data.length - 1; i >= 0; i--) {
		let s = squadre.data[i];
		classifica[i] = {
			'Name': squadre_con_classifica[s.id].Name,
			'Coach': squadre_con_classifica[s.id].Coach,
			'Jersey': squadre_con_classifica[s.id].Jersey,
			'Punti': squadre_con_classifica[s.id].Punti.reduce((partialSum, x) => partialSum + x, 0),
			'Punti_Previsti': squadre_con_classifica[s.id].Punti.reduce((partialSum, x) => partialSum + x, 0) + formazioni[squadre_con_classifica[s.id].Id].Punti_Previsti
		};
	}

	// Aggiungi rank precedente e attuale
	classifica.sort((a, b) => { return b.Punti - a.Punti });
	for (let i = 0; i < classifica.length; i++) {
		classifica[i]['old_rank'] = i + 1;
	}
	classifica.sort((a, b) => { return b.Punti_Previsti - a.Punti_Previsti });
	for (let i = 0; i < classifica.length; i++) {
		classifica[i]['new_rank'] = i + 1;
	}
	
	return(classifica);
}