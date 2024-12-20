

async function addDish() {
	document.getElementById("add-dish-button").disabled = true;
	
	// Use uid as restaurant ID
	const restaurantID = auth.currentUser.uid;
	// Get menu ID
	const menuID = document.getElementById("menu-id").value

	try {
		// Get title of new dish
		const title = document.getElementById("dish-title-input").value;
		if(!title) throw "Dish name is empty!";

		// Get price of dish
		const price = Number(document.getElementById("dish-price-input").value);
		if(isNaN(price) || price < 0) throw "No dish price provided";

		// Get image for new dish
		if(document.getElementById("dish-image-input").files == 0) throw "No image selected!";
		const file = document.getElementById("dish-image-input").files[0];
		// Ensure image is less than 2MB in size
		if(Number(file.size.toString()) > 2 * 1024 * 1024) throw "Image must be less than 2MB in size";

		// Ensure image is 250×250 or larger
		await validateImage(file);

		// Save dish data to Firebase
		let dishesRef = ref(database, `/restaurants/${restaurantID}/menus/${menuID}/dishes`)
		let newDishRef = push(dishesRef);

		let dishID = newDishRef.key;

		// Upload image to Firebase
		let imageRef = storageRef(storage, `/restaurants/${restaurantID}/menus/${menuID}/${dishID}/image`);
		await uploadBytes(imageRef, file);
		
		await set(newDishRef, {name: title, price});

		// Reload page
		document.location.reload()
	} catch(error) {
		document.getElementById("add-dish-button").disabled = false;
		alert(error.message || error)
		console.error(error)
	}
}

async function deleteDish(menuIndex, dishIndex) {
	// Use uid as restaurant ID
	const restaurantID = auth.currentUser.uid;
	
	// Get dish at index
	let dishRef = ref(database, `/restaurants/${restaurantID}/menus/${menuIndex}/dishes/${dishIndex}`);
	let dish = await get(dishRef);
	dish = dish.val();

	// Show confirmation message
	if(!confirm(`Are you sure you want to delete dish "${dish.name}"?`)) return;

	// Remove dish
	try {
		await remove(dishRef);
	} catch(error) {
		alert(error.message || error)
		console.error(error)
	}

	// Refresh page
	location.reload();
};