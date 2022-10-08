export default function scontri_diretti(coppe, giornata){

	// Calcolo scontri diretti
	let scontri_diretti = {};
	let coppe_filtered = coppe.filter(x => x.data['gi'] <= (giornata));
	for (let i = coppe_filtered.length - 1; i >= 0; i--) {
		let coppa_name = coppe_filtered[i]['data']['n'];
		let coppa_schedule = coppe_filtered[i]['data']['cale']['cinc'].filter(x => x['ga'] == (giornata));
		if (coppa_schedule.length > 0) {
			scontri_diretti[coppa_name] = coppa_schedule[0]['inc'];	
		}
		
	}
	
	return(scontri_diretti)
}