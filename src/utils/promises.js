export default async function evaluate_promises(all_promises){
	return await Promise.all(all_promises).then(function (responses) {
		return Promise.all(responses.map(async function (response) {
			if(response.status != 200){
				return {'url': response.url, 'data': undefined};
			}
			return {'url': response.url, 'data': await response.json()};
		}));
	});
}