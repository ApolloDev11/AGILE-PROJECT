async function closeRestaurant() {
	if(!confirm("Permanently delete your restaurant?")) return;
	
	// Use uid as restaurant ID
	const restaurantID = auth.currentUser.uid;
	
	try {
		// Set restaurant to empty object in database
		const restaurantRef = ref(database, `restaurants/${restaurantID}`);
		await set(restaurantRef, {})

	} catch(error) {
		return alert(error || error.message)
	}

	// Redirect to home page
	document.location.href = "/";
}

function editRestaurantDetails() {
	document.location.href = "/restaurant/admin/details";
}

function delivery() {
	document.location.href = "/delivery";
}

function openRestaurantPage() {
	// Use uid as restaurant ID
	const restaurantID = auth.currentUser.uid;

	document.location.href = `/restaurant/${restaurantID}`;
}

async function addMenu() {
	document.getElementById("add-menu-button").disabled = true;
	
	// Use uid as restaurant ID
	const restaurantID = auth.currentUser.uid;

	try {
		// Get title of new menu
		const title = document.getElementById("menu-title-input").value;
		if(!title) throw "Menu Title is empty!";

		// Get image for new menu
		if(document.getElementById("menu-image-input").files == 0) throw "No image selected!";
		const file = document.getElementById("menu-image-input").files[0];
		// Ensure image is less than 2MB in size
		if(Number(file.size.toString()) > 2 * 1024 * 1024) throw "Image must be less than 2MB in size";

		// Ensure image is 250×250 or larger
		await validateImage(file);
		// Save menu data to Firebase
		let menusRef = ref(database, `/restaurants/${restaurantID}/menus`);
		let newMenuRef = push(menusRef);
		await set(newMenuRef, {name: title});

		// Upload image to Firebase
		let imageRef = storageRef(storage, `/restaurants/${restaurantID}/menus/${newMenuRef.key}/image`);
		await uploadBytes(imageRef, file);

		// Open new menu
		document.location.href = `/restaurant/admin/menu/${newMenuRef.key}`
	} catch(error) {
		document.getElementById("add-menu-button").disabled = false;
		alert(error.message || error)
		console.error(error)
	}
}

async function deleteMenu(menuID) {
	// Use uid as restaurant ID
	const restaurantID = auth.currentUser.uid;
	
	// Get menu at index
	let menuRef = ref(database, `/restaurants/${restaurantID}/menus/${menuID}`);
	let menu = await get(menuRef);
	menu = menu.val();

	// Show confirmation message
	if(!confirm(`Are you sure you want to delete menu "${menu.name}" and all of its dishes?`)) return;

	// Remove menu
	try {
		await remove(menuRef);
	} catch(error) {
		alert(error.message || error)
		console.error(error)
	}

	// Refresh page
	location.reload();
};

function editMenu(menuID) {
	// Open menu page
	document.location.href = `/restaurant/admin/menu/${menuID}`
}