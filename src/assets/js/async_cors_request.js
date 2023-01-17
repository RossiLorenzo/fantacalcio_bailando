import router from "@/router/index.js"
import Cookies from 'js-cookie';
import login from "@/assets/js/login.js";

export default async function async_cors_request(url, options){
	let cors_url = 'https://cors-anywhere-lorenzo.herokuapp.com/' + url;
	let response = await fetch(cors_url, options);
	if(response.status != 200){ return undefined }
	let data = await response.json();
	// Check if the data failed
	if(!data['success']){
		// Check if the fail was caused by an expired login
		if(data['error_msgs'][0]['id'] == 'S004'){
			// Try an automated re-login
			if(Cookies.get('fanta_username') != undefined & Cookies.get('fanta_password') != undefined){
				// Send request 
			    let successful_login = await login(Cookies.get('fanta_username'), Cookies.get('fanta_password'));
			    if(successful_login){ 
			    	let updated_options = options
			    	updated_options.headers.lega_token = Cookies.get('lega_token');
			    	updated_options.headers.user_token = Cookies.get('utente_token');
			    	data = await async_cors_request(url, updated_options);
			    	return data;
			    } else {
					alert("Login Scaduto - Rieffettua il login");
					router.push('/signin');
			   	}
			} else { 
				alert("Login Scaduto - Rieffettua il login");
				router.push('/signin'); 
        	}
      	} else { return undefined }
    } else { return data }
}