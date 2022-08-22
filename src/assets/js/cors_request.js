export default async function cors_request(url, options){
	let cors_url = 'https://vast-forest-31073.herokuapp.com/' + url;
	let response = await fetch(cors_url, options);
	let data = await response.json();
	return data;
}