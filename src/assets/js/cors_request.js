export default function cors_request(url, options){
	let cors_url = 'https://vast-forest-31073.herokuapp.com/' + url;
	let response = fetch(cors_url, options);	
	return response;
}