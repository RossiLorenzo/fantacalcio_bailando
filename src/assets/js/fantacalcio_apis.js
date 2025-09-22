import Cookies from 'js-cookie';

export default async function fantacalcio_apis(resource, params = new Map()){
	// Mapping of all the available API endpoints
	let mapping = {
		'timer': 'https://appleghe.fantacalcio.it/api/v1/v1_lega/timer',
		'formazioni': 'https://appleghe.fantacalcio.it/api/v1/V2_LegaFormazioni/Formazioni?id_comp=661957&giornata=' + params.get('giornata'),
		'squadre': 'https://appleghe.fantacalcio.it/api/v1/v1_lega/squadre',
		'giornata_live': 'https://d2lhpso9w1g8dk.cloudfront.net/web/risorse/dati/live/' + params.get('year') + '/live_' + params.get('giornata') + '.json',
		'competizioni': 'https://appleghe.fantacalcio.it/api/v1/V2_LegaCompetizioni/completa?id=' + params.get('competizione'),
		'lista_calciatori': 'https://appleghe.fantacalcio.it/api/v1/v1_calciatori/lista',
		'live_gazzetta': 'https://api2-mtc.gazzetta.it/api/v1/sports/calendar?day=' + params.get('giornata') + '&sportId=1&competitionId=21',
		'login': 'https://appleghe.fantacalcio.it/api/v1/v1_utente/login'
		
	}
	// Headers used in the requests
	let overall_headers = {
		'Content-Type': 'application/json',
		'app_key': '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0',
		'lega_token': Cookies.get('lega_token'),
		'user_token': Cookies.get('utente_token')
    };
    // Create the requests - GET
    let request
    if (params.get('method') == 'get') {
	    request = params.get('function')(
	    	mapping[resource], {
	    		method: 'get',
	    		headers: overall_headers
	        }
	    )
    } else {
	    request = params.get('function')(
	    	mapping[resource], {
	    		method: 'post',
	    		headers: overall_headers,
	    		body: JSON.stringify(params.get('body'))
	        }
	    )
    }

    // Create the requests - POST
	return request;
}
