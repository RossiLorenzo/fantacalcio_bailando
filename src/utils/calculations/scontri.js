export default function scontri_diretti(coppe, giornata, formazioni){

	// Calcolo scontri diretti
	let scontri_diretti = {};
	let coppe_filtered = coppe.filter(x => x.data['gi'] <= (giornata));
	for (let i = coppe_filtered.length - 1; i >= 0; i--) {
		let coppa_name = coppe_filtered[i]['data']['n'];
		let coppa_schedule = coppe_filtered[i]['data']['cale']['cinc'].filter(x => x['ga'] == (giornata));
		if (coppa_schedule.length > 0) {
			// With an odd number of entrants one team is drawn against the "New
			// Riposo" placeholder, which has no formazione. Keep the fixture but
			// flag it, and put the real team on the `ida` side so the caller can
			// always render that one; the UI shows "Riposo" opposite it.
			let incontri = coppa_schedule[0]['inc'].map(x => {
				let a = formazioni[x['ida']] != undefined;
				let b = formazioni[x['idb']] != undefined;
				if (a && b) { return Object.assign({}, x, {bye: false}); }
				if (a) { return Object.assign({}, x, {bye: true}); }
				if (b) { return Object.assign({}, x, {ida: x['idb'], idb: x['ida'], bye: true}); }
				return null;
			}).filter(x => x != null);
			if (incontri.length > 0) {
				scontri_diretti[coppa_name] = incontri;
			}
		}
	}

	return(scontri_diretti)
}
