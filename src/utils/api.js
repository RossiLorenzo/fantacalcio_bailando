import Cookies from 'js-cookie';

import { APP_KEY, LEGA_ID } from '@/config/season.js';

// Two backends, two auth schemes.
//
// `appleghe.fantacalcio.it/api/v1` is the legacy API: app_key + lega_token +
// user_token headers, `{success, data, error_msgs}` envelope.
//
// `apileague.fantacalcio.it/gaming/v1` is what the Leghe FC app moved to for
// lineups in v13 — app_key + Access-Token + `authorization: Bearer <lega jwt>`,
// and raw JSON with no envelope. The legacy V2_LegaFormazioni route it replaced
// now fails server-side (`Table 'leghe_db.leghe_formazioni' doesn't exist`), so
// lineups have to come from here.
const APPLEGHE = 'https://appleghe.fantacalcio.it/api/v1/';
const APILEAGUE = 'https://apileague.fantacalcio.it/';

export const GAMING_RESOURCES = ['lineup_live', 'lineup_squadra', 'lineup_list'];

export default async function fantacalcio_apis(resource, params = new Map()){
	// Mapping of all the available API endpoints
	let mapping = {
		'timer': APPLEGHE + 'v1_lega/timer',
		'squadre': APPLEGHE + 'v1_lega/squadre',
		'lega_profilo': APPLEGHE + 'v1_lega/profilo',
		'giornata_live': 'https://d2lhpso9w1g8dk.cloudfront.net/web/risorse/dati/live/' + params.get('year') + '/live_' + params.get('giornata') + '.json',
		'competizioni': APPLEGHE + 'V2_LegaCompetizioni/completa?id=' + params.get('competizione'),
		'lista_calciatori': APPLEGHE + 'v1_calciatori/lista',
		'live_gazzetta': 'https://api2-mtc.gazzetta.it/api/v1/sports/calendar?day=' + params.get('giornata') + '&sportId=1&competitionId=21',
		'login': APPLEGHE + 'v1_utente/login',

		// Gaming API. `giornata` is the lega giornata, `giornata_serie_a` the
		// Serie A one; both are part of the path. `avversario` is 0 for the
		// campionato, which is one-vs-all rather than head to head.
		'lineup_live': APILEAGUE + 'gaming/v1/teamLineup/' + params.get('competizione')
			+ '/' + params.get('giornata') + '/' + params.get('giornata_serie_a')
			+ '/' + params.get('squadra') + '/' + (params.get('avversario') ?? 0) + '/live',
		'lineup_squadra': APILEAGUE + 'gaming/v1/teamLineup/visualizza/' + LEGA_ID
			+ '/' + params.get('competizione') + '/' + params.get('squadra')
			+ '/' + params.get('giornata'),
		'lineup_list': APILEAGUE + 'gaming/v1/lineup/list/' + params.get('competizione')
			+ '/' + params.get('giornata')
	}
	// Headers used in the requests
	let overall_headers = GAMING_RESOURCES.includes(resource) ? {
		'Content-Type': 'application/json',
		'app_key': APP_KEY,
		'Access-Token': Cookies.get('utente_token'),
		'authorization': 'Bearer ' + Cookies.get('lega_jwt'),
		'Platform': 'android'
	} : {
		'Content-Type': 'application/json',
		'app_key': APP_KEY,
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
