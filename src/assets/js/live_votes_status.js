export default function live_votes_status(d, e){
	// Materialize datasets
	let live_stream = d.filter(x => x.url.includes('d2lhpso9w1g8dk.cloudfront.net')).map(x => x.data)[0];
	
	// Status delle partite
	let status = {};
	for (let i = live_stream['data']['inc'].length - 1; i >= 0; i--) {
		let id_a = live_stream['data']['inc'][i]['n_a'].split('').slice(0, 3).join('').toUpperCase();
		let id_b = live_stream['data']['inc'][i]['n_b'].split('').slice(0, 3).join('').toUpperCase();
		status[id_a] = {
			'status': live_stream['data']['inc'][i]['sto']
		};
		status[id_b] = {
			'status': live_stream['data']['inc'][i]['sto']
		};
	}

	// Crea un dizionario di voti live
	let voti = {};
	for (let i = live_stream['data']['pl'].length - 1; i >= 0; i--) {
		let p = live_stream['data']['pl'][i];
		let bonus = 0;
		for (let j = p.bm.length - 1; j >= 0; j--) {
			if (e[p.bm[j]] != undefined) {
				bonus = bonus + e[p.bm[j]].Bonus;
			}
		}
		voti[p['id']] = {
			'vt': p['v'],
			'fv': p['v'] + bonus
		}
	};

	return({
		'played': live_stream['data']['inc'],
		'status': status,
		'voti': voti
	})
}
