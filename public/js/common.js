// Waits for specified amount of time (must be used with await)
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

// Generates a random ID of the specified length
function generateID(length=16) {
	let id = [...Array(length)];
	id = id.map(() => Math.floor(Math.random() * 16).toString(16));
	return id.join("");
}

// Calls specified JSON API on the Flask server
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

// Ensures an image file is a valid image file, 250×250 or larger
function validateImage(file) {
	const img = new Image();
	
	return new Promise((resolve, reject) => {
		const objectURL = URL.createObjectURL(file);
		img.src = objectURL;

		img.onload = () => {
			const width = img.naturalWidth;
			const height = img.naturalHeight;

			if (width >= 250 && height >= 250)
				resolve(true);
			else
				reject("Image must be at least 250px×250px");

			URL.revokeObjectURL(objectURL);
		};
	});
}