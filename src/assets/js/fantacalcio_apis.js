import Cookies from 'js-cookie';

export default async function fantacalcio_apis(resource, params = new Map()){
	// Mapping of all the available API endpoints
	let mapping = {
		'timer': 'https://appleghe.fantacalcio.it/api/v1/v1_lega/timer',
		'formazioni': 'https://appleghe.fantacalcio.it/api/v1/V2_LegaFormazioni/Formazioni?id_comp=161999&giornata=' + params.get('giornata'),
		'squadre': 'https://appleghe.fantacalcio.it/api/v1/v1_lega/squadre',
		'giornata_live': 'https://d2lhpso9w1g8dk.cloudfront.net/web/risorse/dati/live/17/live_' + params.get('giornata') + '.json',
		'voti_live': 'https://api.fantacalcio.it/v1/mt/17/matches/votes/' + params.get('giornata') + '.json?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9hcGkuZmFudGFjYWxjaW8uaXQvdjEvbXQvKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTY2MTc2OTk3Mn19fV19&Signature=Ze4qi~EXAhTOQQ-8k3teuwlGiJjDDwKjBJ53JlEqjDJu3Bz8hDwwEP~mKv7fjJ9h9ycKI2~HNmVCsuoAvglDjB~0cOi8A3CrVML0iWFf1q-F5ytfNHM8G4bLS47acUn-WomzFDyz-BZ7-uTIHIZV8ymAnvZBuxzr51flW2FByvyrmLjrrhSpL6Olgpa41j9L~TTbyfIfKf~mSySj8XTuKKS4OumtJ~uCFZRHmPY9Lb9vq9xcmPCGq1Vqp-n4G6mN0J7a3xpYyDzpPdSk9tE82LIhPtTGiBUGv4LZsFhMXWgHKNl4TkHbb01YCFLjWuIDY270c95tQ8H9mGuNDwDIjA__&Key-Pair-Id=KFXFJHYKWQRF1',
		'competizioni': 'https://appleghe.fantacalcio.it/api/v1/V2_LegaCompetizioni/completa?id=' + params.get('competizione'),
		'stats_calciatori': 'https://api.fantacalcio.it/v1/mt/17/players/playersStat.json?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9hcGkuZmFudGFjYWxjaW8uaXQvdjEvbXQvKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTY2MTc2OTk3Mn19fV19&Signature=Ze4qi~EXAhTOQQ-8k3teuwlGiJjDDwKjBJ53JlEqjDJu3Bz8hDwwEP~mKv7fjJ9h9ycKI2~HNmVCsuoAvglDjB~0cOi8A3CrVML0iWFf1q-F5ytfNHM8G4bLS47acUn-WomzFDyz-BZ7-uTIHIZV8ymAnvZBuxzr51flW2FByvyrmLjrrhSpL6Olgpa41j9L~TTbyfIfKf~mSySj8XTuKKS4OumtJ~uCFZRHmPY9Lb9vq9xcmPCGq1Vqp-n4G6mN0J7a3xpYyDzpPdSk9tE82LIhPtTGiBUGv4LZsFhMXWgHKNl4TkHbb01YCFLjWuIDY270c95tQ8H9mGuNDwDIjA__&Key-Pair-Id=KFXFJHYKWQRF1'
	}
	// Headers used in the requests
	let overall_headers = {
		'Content-Type': 'application/json',
		'app_key': 'c3885bc5a83a16e6366083570a0a576d9eda44ef',
		'lega_token': Cookies.get('lega_token'),
		'user_token': Cookies.get('utente_token')
    };
    // Create the requests
    let request = params.get('function')(
    	mapping[resource], {
    		method: params.get('method'),
    		headers: overall_headers
        }
    )
	return request;
}