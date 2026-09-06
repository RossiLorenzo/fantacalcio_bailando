import Cookies from 'js-cookie';

import fantacalcio_apis from "@/utils/api.js";
import async_cors_request from "@/utils/asyncCors.js";
import { LEGA_ID } from "@/config/season.js";

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
    	let bailando = login_data['data']['leghe'].find(y => y.id === LEGA_ID);
        if (bailando) {
          Cookies.set('utente_token', login_data['data']['utente']['utente_token'], {expires: 31});
          Cookies.set('lega_token', bailando['token'], {expires: 31});
          // The gaming API (apileague) authenticates with the lega JWT as a
          // bearer token instead of the legacy lega_token header.
          Cookies.set('lega_jwt', bailando['jwt'], {expires: 31});
        }
        else { return false; }
    } else { return false; }
    return true;
}
