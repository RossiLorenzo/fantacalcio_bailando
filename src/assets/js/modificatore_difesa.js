export default function mod_difesa(t){

	function remove_nulls(v){
		if (v == 100) { return 6 }
		if (v == 56) { return 4 }
		if (v == 55) { return 4 }
		return v;
	}
	//console.log(t);
	let difesa_all = t.filter(x => x.r == 'D');
	if (difesa_all.length < 4) {
		return 0;
	}
	let difesa = t.filter(x => x.r == 'D').map(x => remove_nulls(x.voto_finale)).sort().reverse().slice(0, 3);
	//console.log(difesa);

	
	let portiere = t.filter(x => x.r == 'P').map(x => remove_nulls(x.voto_finale))[0];
	//console.log(portiere);
	let media_difesa = difesa.reduce((partialSum, x) => partialSum + x, 0) + portiere;
	//console.log(media_difesa)
	let mod_difesa_punti;
	if (media_difesa >= 28) {
		mod_difesa_punti = 5
	} else {
		if (media_difesa >= 26) {
			mod_difesa_punti = 3
		} else {
			mod_difesa_punti = 1
		}
	}
	return(mod_difesa_punti);
}