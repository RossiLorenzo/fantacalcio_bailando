export default function cors_request(url, options){
	let cors_url = 'https://cors-anywhere-lorenzo.herokuapp.com/' + url;
	let response = fetch(cors_url, options);	
	return response;
}