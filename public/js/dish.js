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

function displayDish(menu, dish) {
    const dishList = document.getElementById('dish-list');
    const template = document.querySelector("#dish-template");

    const c = document.importNode(template.content, true);
                            
    c.querySelector(".dish-name").textContent = dish.name;
    c.querySelector(".dish-image").src = dish.icon;

    if (menu != null) {
        c.querySelector(".menu-name").textContent = menu.name;
        c.querySelector(".menu-image").src = menu.icon;
    }

    if (dish.amount != null) {
        c.querySelector(".dish-amount").textContent = dish.amount;
    }

    dishList.appendChild(c);
}

function loopThroughDishes(restaurant, callback) {
    for (const [id, data] of Object.entries(restaurant)) {
        data.menus.forEach(menu => {
            menu.dishes.forEach(dish => {
                callback(menu, dish);
            });
        });
    }
}

function showAllDishes() {
    loopThroughDishes(restaurantData, (menu, dish) => {
        displayDish(menu, dish);
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

    loopThroughDishes(restaurantData, (menu, dish) => {
        const hasIngredient = dish.ingredients.some(ingredient => 
            ingredient.toLowerCase() === ingredientInput
        );

        if (hasIngredient)
            displayDish(menu, dish);
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
    for (const [id, restaurant] of Object.entries(restaurantData)) {
        if (restaurant.name.toLowerCase() === selectedRestaurant) {
            // Display all dishes in the selected restaurant's menus
            restaurant.menus.forEach(menu => {
                menu.dishes.forEach(dish => {
                    displayDish(menu, dish);
                });
            });
        }
    };

    if (dishList.innerHTML == '') {
        alert("No dishes found...");
    }
}

async function addToCart(dish) {
    var cart = (await get(ref(database, `users/${auth.currentUser.uid}/cart`))).val();

    if (cart == null) {
        cart = [];
    }

    if (cart.length == 10) {
        alert("You cannot add more than 10 items to your cart!");
        return;
    }

    var name = dish.parentElement.querySelector(".dish-name").textContent;


	let existingItem = cart.find(e => e.name == name);
	if(existingItem) existingItem.amount++;
	else {
		cart.push({
			type: "dish",
			name,
			cost,
			icon,
			amount: 1
		});
	}
    set(ref(database, `users/${auth.currentUser.uid}/cart`), cart);

	if(existingItem) alert(`You now have ${amount} ${name}s in your cart!`);
	else alert(`Added ${name} to your cart!`);
    
    const addToCartButton = dish.parentElement.querySelector("button");
    addToCartButton.textContent = "Added";
    renderCart(cart);
}
function renderCart(cart) {
    const cartList = document.getElementById('cart-list'); // Ensure this element exists in your HTML
    cartList.innerHTML = ""; // Clear existing items

    if (cart.length === 0) {
        cartList.innerHTML = "<p>No dishes in your cart.</p>";
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.icon}" alt="${item.name}" class="cart-item-image">
            <p>${item.name}</p>
            <button onclick="removeFromCart('${item.name}')">Remove</button>
        `;
        cartList.appendChild(cartItem); // Append to cart list
    });
}
async function removeFromCart(name) {
    let cart = (await get(ref(database, `users/${auth.currentUser.uid}/cart`))).val();

    if (cart) {
        const index = cart.findIndex(item => item.name === name);
        if (index > -1) {
            cart.splice(index, 1); 
            
            await set(ref(database, `users/${auth.currentUser.uid}/cart`), cart); // Update the database
            
            renderCart(cart); // Re-render the cart
            alert(`${name} removed from your cart.`);
        }
    }
}

document.getElementById('ingredient-form').addEventListener('submit', function(event) {
    event.preventDefault(); 
});


document.getElementById('restaurant-form').addEventListener('submit', function(event) {
    event.preventDefault(); 
    filterDishesByRestaurant(); 
});
