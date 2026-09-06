import router from "@/router/index.js"
import Cookies from 'js-cookie';
import login from "@/utils/login.js";

// Same job as async_cors_request, for the gaming API. That one unwraps the
// legacy `{success, data, error_msgs}` envelope; gaming returns bare JSON and
// signals failure with an HTTP status plus a `{code, message}` body, so the two
// can't share a response handler.
export default async function async_gaming_request(url, options){
	let cors_url = 'https://cors-anywhere-lorenzo.herokuapp.com/' + url;
	let response = await fetch(cors_url, options);

	if(response.status == 401 || response.status == 403){
		// Expired session — retry once with fresh tokens, as the legacy path does.
		if(Cookies.get('fanta_username') != undefined && Cookies.get('fanta_password') != undefined){
			let successful_login = await login(Cookies.get('fanta_username'), Cookies.get('fanta_password'));
			if(successful_login){
				let updated_options = options;
				updated_options.headers['Access-Token'] = Cookies.get('utente_token');
				updated_options.headers['authorization'] = 'Bearer ' + Cookies.get('lega_jwt');
				return await async_gaming_request(url, updated_options);
			}
		}
		alert("Login Scaduto - Rieffettua il login");
		router.push('/signin');
		return undefined;
	}

	if(response.status != 200){ return undefined }

	let data = await response.json();
	// A team that hasn't submitted a lineup yet answers 200 with an error body
	// (e.g. LUP039 "team lineup is not completed") rather than a lineup.
	if(data && data.code && data.message){ return undefined }
	return data;
}
