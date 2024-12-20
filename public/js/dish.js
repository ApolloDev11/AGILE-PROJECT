restaurantData = {};

firebaseReady.then(async () => {
	app = initializeApp(FIREBASE_CONFIG);
	auth = getAuth(app);
	database = getDatabase(app);
	storage = getStorage(app);

	restaurantData = (await get(ref(database, "restaurants/"))).val();

	for (const [id, restaurant] of Object.entries(restaurantData)) {
		document.querySelector("#restaurant-select").innerHTML +=
		`<option value="${restaurant.name}">${restaurant.name}</option>`;
	}    

	showAllDishes();
});

function displayDish(restaurantId, menu, menuId, dish, dishId) {
	const dishList = document.getElementById('dish-list');
	const template = document.querySelector("#dish-template");

	const c = document.importNode(template.content, true);
							
	var imageurl = `restaurants/${restaurantId}/menus/${menuId}/${dishId}/image`
	imageurl = encodeURIComponent(imageurl);

	c.querySelector(".dish-name").textContent = dish.name;
	c.querySelector(".dish-image").src = `https://firebasestorage.googleapis.com/v0/b/mtu-group-project-agile.appspot.com/o/${imageurl}?alt=media`;

	imageurl = `restaurants/${restaurantId}/menus/${menuId}/image`
	imageurl = encodeURIComponent(imageurl);
	
	c.querySelector(".menu-image").src = `https://firebasestorage.googleapis.com/v0/b/mtu-group-project-agile.appspot.com/o/${imageurl}?alt=media`;


	c.querySelector(".dish").setAttribute("data-restaurant", restaurantId)
	c.querySelector(".dish").setAttribute("data-dish", dishId)
	c.querySelector(".dish").setAttribute("data-menu", menuId)


	c.querySelector(".menu-link").href = `/restaurant/${restaurantId}/menus/${menuId}`;

	if (menu != null) {
		c.querySelector(".menu-name").textContent = menu.name;
		// c.querySelector(".menu-image").src = menu.icon;
	}

	if (dish.amount != null) {
		c.querySelector(".dish-amount").textContent = dish.amount;
	}

	if (dish.price != null) {
		c.querySelector(".dish-price").textContent = dish.price;
	}

	dishList.appendChild(c);
}

function loopThroughDishes(restaurant, callback) {
    for (const [restId, data] of Object.entries(restaurant)) {
        if ("menus" in data)
            for (const [id2, menu] of Object.entries(data.menus)) {
                if ("dishes" in menu)
                    for (const [id3, dish] of Object.entries(menu.dishes)) {
                        callback(restId, data, menu, id2, dish, id3);
                    }
            }
    }
}

function showAllDishes() {
	loopThroughDishes(restaurantData, (restId, rest, menu, menuId, dish, dishId) => {
		displayDish(restId, menu, menuId, dish, dishId);
	});
}

function resetFilters() {
	showAllDishes();
}

// Function to filter dishes based on the ingredient
function filterDishesByIngredient() {
	const ingredientInput = document.getElementById('dish-ingredient').value.toLowerCase();
	const dishList = document.getElementById('dish-list');

	// Clear previous results
	dishList.innerHTML = '';

	// Loop through restaurant data and filter by ingredient

	loopThroughDishes(restaurantData, (restId, rest, menu, menuId, dish, dishId) => {
		console.log(rest);
		const hasIngredient = Object.values(rest.ingredients).some(ingredient => 
			ingredient.name.toLowerCase().includes(ingredientInput)
		);

		if (hasIngredient)
			displayDish(restId, menu, menuId, dish, dishId);
	});

	if (dishList.innerHTML == '') {
		alert("No dishes found...");
	}
}

// Function to filter dishes based on the selected restaurant
function filterDishesByRestaurant() {
	const selectedRestaurant = document.getElementById('restaurant-select').value.toLowerCase();
	const dishList = document.getElementById('dish-list');

	// Clear previous results
	dishList.innerHTML = '';

	// Loop through restaurant data and filter by restaurant
	for (const [id, data] of Object.entries(restaurantData)) {
        if (data.name.toLowerCase() === selectedRestaurant && "menus" in data)
            for (const [id2, menu] of Object.entries(data.menus)) {
                if ("dishes" in menu)
                    for (const [id3, dish] of Object.entries(menu.dishes)) {
						displayDish(id, menu, id2, dish, id3);
                    }
            }
    }

	if (dishList.innerHTML == '') {
		alert("No dishes found...");
	}
}

// async function addToCart(dish) {
// 	var cart = (await get(ref(database, `users/${auth.currentUser.uid}/cart`))).val();

// 	if (cart == null) {
// 		cart = [];
// 	}

// 	if (cart.length == 10) {
// 		alert("You cannot add more than 10 items to your cart!");
// 		return;
// 	}

// 	var name = dish.parentElement.querySelector(".dish-name").textContent;
// 	var price = dish.parentElement.querySelector(".dish-price").textContent;
// 	var image = dish.parentElement.querySelector(".dish-image").src;


// 	let existingItem = cart.find(e => e.name == name);
// 	if(existingItem) existingItem.amount++;
// 	else {
// 		cart.push({
// 			type: "dish",
// 			name,
// 			price,
// 			image,
// 			amount: 1
// 		});
// 	}
// 	set(ref(database, `users/${auth.currentUser.uid}/cart`), cart);

// 	if(existingItem) alert(`You now have ${existingItem.amount} ${name}s in your cart!`);
// 	else alert(`Added ${name} to your cart!`);
	
// 	const addToCartButton = dish.parentElement.querySelector("button");
// 	addToCartButton.textContent = "Added";
// 	location.reload();
// }

document.getElementById('ingredient-form')?.addEventListener('submit', function(event) {
	event.preventDefault(); 
	filterDishesByIngredient();
});


document.getElementById('restaurant-form')?.addEventListener('submit', function(event) {
	event.preventDefault(); 
	filterDishesByRestaurant(); 
});
