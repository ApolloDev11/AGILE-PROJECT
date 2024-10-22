export function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

export async function api(url, body) {
	let options = {}
	if(body) {
		options.method = "POST";
		options.body = JSON.encode(body);
		options.headers["Content-Type"] = "application/json";
	}

	let response = await fetch(`/api/${url}`, options);
	let responseBody = await response.body();
	let parsedBody;
	
	try {
		parsedBody = JSON.parse(responseBody);

	} catch {
		parsedBody = responseBody
		
	}

	return parsedBody
}