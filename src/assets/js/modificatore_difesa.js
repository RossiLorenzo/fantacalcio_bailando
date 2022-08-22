export default function mod_difesa(t){
	let difesa = t.filter(x => x.r == 'D').map(x => x.voto_finale).sort().reverse().slice(0, 3).reduce((partialSum, x) => partialSum + x, 0)
	let portiere = t.filter(x => x.r == 'P').map(x => x.voto_finale)[0];
	let media_difesa = difesa + portiere;
	let mod_difesa_punti;
	if (media_difesa >= 28) {
		mod_difesa_punti = 6
	} else {
		if (media_difesa >= 26) {
			mod_difesa_punti = 3
		} else {
			if (media_difesa >= 24) {
				mod_difesa_punti = 1
			} else {
				mod_difesa_punti = 0
			}
		}
	}
	let mod_difesa = t.filter(x => x.r == 'D').length >= 4 ? mod_difesa_punti : 0;
	return(mod_difesa);
}