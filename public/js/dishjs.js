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
    c.querySelector(".menu-name").textContent = menu.name;
    c.querySelector(".menu-image").src = menu.icon;

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
    var cart = await get(ref(database, `users/${auth.currentUser.uid}/cart`));

    console.log(cart);

    set(ref(database, `users/${auth.currentUser.uid}/cart`));
}

// Attach the filterDishesByIngredient function to the ingredient form submit event
document.getElementById('ingredient-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    filterDishesByIngredient(); // Call the filter function
});

// Attach the filterDishesByRestaurant function to the restaurant form submit event
document.getElementById('restaurant-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    filterDishesByRestaurant(); // Call the filter function
});
