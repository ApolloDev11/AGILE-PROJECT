// Sample data with multiple menus and dishes
const restaurantData = {
    "restaurant": [
        {
            "name": "Restaurant A",
            "menus": [
                {
                    "name": "Menu A",
                    "dishes": [
                        { "name": "Dish A", "icon": "https://firebaseurl.com/dishA.png" },
                        { "name": "Dish B", "icon": "https://firebaseurl.com/dishB.png" }
                    ],
                    "ingredients": [
                        { "name": "chicken" },
                        { "name": "carrot" }
                    ]
                }
            ]
        },
        {
            "name": "Restaurant B",
            "menus": [
                {
                    "name": "Menu B",
                    "dishes": [
                        { "name": "Dish C", "icon": "https://firebaseurl.com/dishC.png" },
                        { "name": "Dish D", "icon": "https://firebaseurl.com/dishD.png" }
                    ],
                    "ingredients": [
                        { "name": "tomato" },
                        { "name": "potato" }
                    ]
                }
            ]
        }
    ]
};

// Function to filter dishes based on the ingredient
function filterDishesByIngredient() {
    const ingredientInput = document.getElementById('dish-ingredient').value.toLowerCase();
    const dishList = document.getElementById('dish-list');

    // Clear previous results
    dishList.innerHTML = '';

    // Loop through restaurant data and filter by ingredient
    restaurantData.restaurant.forEach(restaurant => {
        restaurant.menus.forEach(menu => {
            const hasIngredient = menu.ingredients.some(ingredient => 
                ingredient.name.toLowerCase() === ingredientInput
            );

            if (hasIngredient) {
                // Display all dishes in the matching menu
                menu.dishes.forEach(dish => {
                    const dishItem = document.createElement('li');
                    dishItem.innerHTML = `
                        <img src="${dish.icon}" alt="${dish.name}" style="width: 50px;">
                        <span>${dish.name}</span>
                    `;
                    dishList.appendChild(dishItem);
                });
            }
        });
    });
}

// Function to filter dishes based on the selected restaurant
function filterDishesByRestaurant() {
    const selectedRestaurant = document.getElementById('restaurant-select').value.toLowerCase();
    const dishList = document.getElementById('dish-list');

    // Clear previous results
    dishList.innerHTML = '';

    // Loop through restaurant data and filter by restaurant
    restaurantData.restaurant.forEach(restaurant => {
        if (restaurant.name.toLowerCase() === selectedRestaurant) {
            // Display all dishes in the selected restaurant's menus
            restaurant.menus.forEach(menu => {
                menu.dishes.forEach(dish => {
                    const dishItem = document.createElement('li');
                    dishItem.innerHTML = `
                        <img src="${dish.icon}" alt="${dish.name}" style="width: 50px;">
                        <span>${dish.name}</span>
                    `;
                    dishList.appendChild(dishItem);
                });
            });
        }
    });
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
