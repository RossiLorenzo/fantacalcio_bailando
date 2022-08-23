import router from "@/router/index.js"

export default async function async_cors_request(url, options){
	let cors_url = 'https://vast-forest-31073.herokuapp.com/' + url;
	let response = await fetch(cors_url, options);
	let data = await response.json();
	if(!data['success']){
		if(data['error_msgs'][0]['id'] == 'S004'){
			alert("Login Scaduto - Rieffettua il login");
			router.push('/signin');
		}
	}
	return data;
}