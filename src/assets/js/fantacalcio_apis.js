import Cookies from 'js-cookie';

export default async function fantacalcio_apis(resource, params = new Map()){
	// Mapping of all the available API endpoints
	let mapping = {
		'timer': 'https://appleghe.fantacalcio.it/api/v1/v1_lega/timer',
		'formazioni': 'https://appleghe.fantacalcio.it/api/v1/V2_LegaFormazioni/Formazioni?id_comp=161999&giornata=' + params.get('giornata'),
		'squadre': 'https://appleghe.fantacalcio.it/api/v1/v1_lega/squadre',
		'giornata_live': 'https://d2lhpso9w1g8dk.cloudfront.net/web/risorse/dati/live/17/live_' + params.get('giornata') + '.json',
		'voti_live': 'https://api.fantacalcio.it/v1/mt/17/matches/votes/' + params.get('giornata') + '.json?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9hcGkuZmFudGFjYWxjaW8uaXQvdjEvbXQvKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTY2MjA1MTEyOX19fV19&Signature=0gHf~sGANWTtWMAnXlGRtkgitJ7m3HV7~avL5T79Ubz7ExiMHZO2AJ1GWdvaJwF2pLY5-DseYQiu66IZrpNArIVDItLTdywlI1nvNJbejkCYylUl-RYGT5sUhl-de19CraBQsBW4h-W82zHp3q5N5KaXMlPOOhRymUSjLDISyZVDhKJVukoRB6iKi6ZO7qbSaxTCAnJ8drJhi78xn0P12CjmPzd0saTiG0Lw832BFb53ftulywKUwzOojS6Wh0yY1pHEovxjvvwRh6J~KFgTwuieAzcNrChg6~JoZGMLQG6Ghf4QREf5s3z1KTIdoQCWuyf~5QYACptKQJg~1fY-mw__&Key-Pair-Id=KFXFJHYKWQRF1',
		'competizioni': 'https://appleghe.fantacalcio.it/api/v1/V2_LegaCompetizioni/completa?id=' + params.get('competizione'),
		'stats_calciatori': 'https://api.fantacalcio.it/v1/mt/17/players/playersStat.json?Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9hcGkuZmFudGFjYWxjaW8uaXQvdjEvbXQvKiIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTY2MjA1MTEyOX19fV19&Signature=0gHf~sGANWTtWMAnXlGRtkgitJ7m3HV7~avL5T79Ubz7ExiMHZO2AJ1GWdvaJwF2pLY5-DseYQiu66IZrpNArIVDItLTdywlI1nvNJbejkCYylUl-RYGT5sUhl-de19CraBQsBW4h-W82zHp3q5N5KaXMlPOOhRymUSjLDISyZVDhKJVukoRB6iKi6ZO7qbSaxTCAnJ8drJhi78xn0P12CjmPzd0saTiG0Lw832BFb53ftulywKUwzOojS6Wh0yY1pHEovxjvvwRh6J~KFgTwuieAzcNrChg6~JoZGMLQG6Ghf4QREf5s3z1KTIdoQCWuyf~5QYACptKQJg~1fY-mw__&Key-Pair-Id=KFXFJHYKWQRF1'
		
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