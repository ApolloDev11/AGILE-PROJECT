function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

// Function for calling JSON APIs on the Flask server
async function api(url, body) {
	let options = {
		credentials: "same-origin"
	}

	if(body) {
		options.method = "POST";
		options.body = JSON.encode(body);
		options.headers["Content-Type"] = "application/json";
	}

	let response = await fetch(`/api/${url}`, options);
	if(!response.ok) throw `${response.status} received from API`;
	
	let responseBody = await response.text();
	let parsedBody;
	
	try {
		parsedBody = JSON.parse(responseBody);

	} catch {
		parsedBody = responseBody
		
	}

	return parsedBody
}