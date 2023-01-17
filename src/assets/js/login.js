import Cookies from 'js-cookie';

import fantacalcio_apis from "@/assets/js/fantacalcio_apis.js";
import async_cors_request from "@/assets/js/async_cors_request.js";

export default async function login(username, password){
	// Send request 
	let login_data = await fantacalcio_apis(
		'login', 
		new Map([['function', async_cors_request], ['method', 'post'], ['body', {
			username: username,
			password: password
      	}]])
    );
    // Save cookie
    if (login_data['success']) {
    	let is_bailando_league = login_data['data']['leghe'].map(y => y.id).includes(1113631);
        if (is_bailando_league) {
          Cookies.set('utente_token', login_data['data']['utente']['utente_token'], {expires: 31});
          Cookies.set('lega_token', login_data['data']['leghe'][0]['token'], {expires: 31});
        }
        else { return false; }
    } else { return false; }
    return true;
}