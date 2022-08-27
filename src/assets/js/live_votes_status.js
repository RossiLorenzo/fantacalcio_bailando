export default function live_votes_status(d){
	// Materialize datasets
	let live_stream = d.filter(x => x.url.includes('d2lhpso9w1g8dk.cloudfront.net')).map(x => x.data)[0];
	let live_votes = d.filter(x => x.url.includes('matches/votes')).map(x => x.data)[0];
	
	// Status delle partite
	let status = {};
	for (let i = live_stream['data']['inc'].length - 1; i >= 0; i--) {
		status[live_stream['data']['inc'][i]['n_a'].split('').slice(0, 3).join('').toUpperCase()] = live_stream['data']['inc'][i]['sto'];
		status[live_stream['data']['inc'][i]['n_b'].split('').slice(0, 3).join('').toUpperCase()] = live_stream['data']['inc'][i]['sto'];
	}

	// Crea un dizionario di voti live
	let voti = {};
	for (let i = live_stream['data']['pl'].length - 1; i >= 0; i--) {
		voti[live_stream['data']['pl'][i]['id']] = {
			'vt': live_stream['data']['pl'][i]['v'],
			'fv': live_stream['data']['pl'][i]['v']
		}
	};
	if (live_votes != undefined) {
		for (let i = live_votes.length - 1; i >= 0; i--) {
			let t = live_votes[i].players;
			for (let j = t.length - 1; j >= 0; j--) {
				let p = t[j];
				voti[p.id].fv = voti[p.id].fv + (p.sourceFantacalcio.fantaVote-p.sourceFantacalcio.vote)
			}
		};
	}

	return({
		'played': live_stream['data']['inc'],
		'status': status,
		'voti': voti
	})
}
