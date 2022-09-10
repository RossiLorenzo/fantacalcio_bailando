export default function cors_request(url, options){
	let cors_url = 'https://sheltered-tor-74618.herokuapp.com/' + url;
	let response = fetch(cors_url, options);	
	return response;
}