import router from "@/router/index.js"
import Cookies from 'js-cookie';

export default async function async_cors_request(url, options){
	let cors_url = 'https://cors-anywhere-lorenzo.herokuapp.com/' + url;
	let response = await fetch(cors_url, options);
	if(response.status != 200){
		return undefined
	}
	let data = await response.json();
	console.log(data)
	if(!data['success']){
		if(data['error_msgs'][0]['id'] == 'S004'){
			console.log('Scaduto')

			if(Cookies.get('fanta_username') != undefined & Cookies.get('fanta_password') != undefined){
				let auth_url = 'https://appleghe.fantacalcio.it/api/v1/v1_utente/login';
      			let auth_cors_url = 'https://cors-anywhere-lorenzo.herokuapp.com/' + auth_url;
      			let auth_data = {
        			username: Cookies.get('fanta_username'),
        			password: Cookies.get('fanta_password')
      			};
      			let auth_response = await fetch(auth_cors_url, { 
        			method: 'post', 
        			headers: {
          				'Content-Type': 'application/json',
          				'app_key': 'c3885bc5a83a16e6366083570a0a576d9eda44ef'
        			},
        			body: JSON.stringify(auth_data) 
      			});
      			let auth_response_data = await auth_response.json();
      			// Save cookie
      			if (auth_response_data['success']) {
        			this.is_bailando_league = auth_response_data['data']['leghe'].map(y => y.id).includes(1113631);
        			// Login rieffettuato con successo.
        			if (this.is_bailando_league) {
          				Cookies.set('utente_token', auth_response_data['data']['utente']['utente_token'], {expires: 31});
          				Cookies.set('lega_token', auth_response_data['data']['leghe'][0]['token'], {expires: 31});

          				response = await fetch(cors_url, options);
          				data = await response.json();

          				if(!data['success']){
	          				alert("Login Scaduto - Rieffettua il login");
							router.push('/signin'); 
          				}
        			}
        			else { 
          				alert("Login Scaduto - Rieffettua il login");
						router.push('/signin'); 
        			}
      			} else {
      				alert("Login Scaduto - Rieffettua il login");
					router.push('/signin');
      			}
			} else {
				alert("Login Scaduto - Rieffettua il login");
				router.push('/signin');
			}
		}
	}
	return data;
}