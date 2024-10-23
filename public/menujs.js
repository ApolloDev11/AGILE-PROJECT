// Sample data with multiple menus, each having different ingredients
const restaurantData = {
    "restaurant": [
        {
            
            "name": "Restaurant A",
            "icon": "https://firebaseurl.com/someimage.png",
            "menus": [
                {
                    "name": "Menu B",
                    "icon": "https://firebaseurl.com/menuB.png",
                    "uploadedat": 1234214,
                    "updatedat": 123415,
                    "dishes": [
                        {
                            "name": "Dish C",
                            "icon": "https://firebaseurl.com/dishC.png",
                            "uploadedat": 345234
                        }
                    ],
                    "ingredients": [
                        {
                            "name": "carrot",
                            "price": 0.80,
                            "icon": "https://firebaseurl.com/carrot.png"
                        },
                        {
                            "name": "chicken",
                            "price": 2.50,
                            "icon": "https://firebaseurl.com/chicken.png"
                        }
                    ]
                },
                {
                    "name": "Menu C",
                    "icon": "https://firebaseurl.com/menuC.png",
                    "uploadedat": 1234215,
                    "updatedat": 123416,
                    "dishes": [
                        {
                            "name": "Dish D",
                            "icon": "https://firebaseurl.com/dishD.png",
                            "uploadedat": 345235
                        },
                        {
                            "name": "Dish E",
                            "icon": "https://firebaseurl.com/dishE.png",
                            "uploadedat": 345236
                        }
                    ],
                    "ingredients": [
                        {
                            "name": "broccoli",
                            "price": 1.00,
                            "icon": "https://firebaseurl.com/broccoli.png"
                        },
                        {
                            "name": "tomato",
                            "price": 0.50,
                            "icon": "https://firebaseurl.com/tomato.png"
                        },
                        {
                            "name": "garlic",
                            "price": 0.20,
                            "icon": "https://firebaseurl.com/garlic.png"
                        }
                    ]
                },
                {
                    "name": "Menu D",
                    "icon": "https://firebaseurl.com/menuD.png",
                    "uploadedat": 1234216,
                    "updatedat": 123417,
                    "dishes": [
                        {
                            "name": "Dish F",
                            "icon": "https://firebaseurl.com/dishF.png",
                            "uploadedat": 345237
                        }
                    ],
                    "ingredients": [
                        {
                            "name": "potato",
                            "price": 0.30,
                            "icon": "https://firebaseurl.com/potato.png"
                        },
                        {
                            "name": "onion",
                            "price": 0.40,
                            "icon": "https://firebaseurl.com/onion.png"
                        },
                        {
                            "name": "spinach",
                            "price": 1.20,
                            "icon": "https://firebaseurl.com/spinach.png"
                        }
                    ]
                },
                {
                    "name": "Menu E",
                    "icon": "https://firebaseurl.com/menuE.png",
                    "uploadedat": 1234217,
                    "updatedat": 123418,
                    "dishes": [
                        {
                            "name": "Dish G",
                            "icon": "https://firebaseurl.com/dishG.png",
                            "uploadedat": 345238
                        },
                        {
                            "name": "Dish H",
                            "icon": "https://firebaseurl.com/dishH.png",
                            "uploadedat": 345239
                        }
                    ],
                    "ingredients": [
                        {
                            "name": "beef",
                            "price": 3.00,
                            "icon": "https://firebaseurl.com/beef.png"
                        },
                        {
                            "name": "pepper",
                            "price": 0.60,
                            "icon": "https://firebaseurl.com/pepper.png"
                        }
                    ]
                }
            ]
        }
    ]
};


// Function to filter menus based on the ingredient
// Function to filter menus based on the ingredient
function filterMenus() {
    const ingredientInput = document.getElementById('ingredient').value.toLowerCase();
    const menuList = document.getElementById('menu-list');
    
    // Clear previous results
    menuList.innerHTML = '';

    // Get the restaurant data
    const restaurants = restaurantData.restaurant;

    restaurants.forEach(restaurant => {
        restaurant.menus.forEach(menu => {
            // Check if the menu contains the specified ingredient
            const hasIngredient = menu.ingredients.some(ingredient => ingredient.name.toLowerCase() === ingredientInput);

            if (hasIngredient) {
                // Create a list item for the menu
                const menuItem = document.createElement('li');
                menuItem.innerHTML = `
                    <img src="${menu.icon}" alt="${menu.name}" style="width: 50px;">
                    <span>${menu.name}</span>
                `;
                menuList.appendChild(menuItem);
            }
        });
    });
}
// Function to search menus based on the menu name
function searchMenus() {
    const searchQuery = document.getElementById('search').value.toLowerCase();
    const menuList = document.getElementById('menu-list');
    
    // Clear previous results
    menuList.innerHTML = '';

    // Get the restaurant data
    const restaurants = restaurantData.restaurant;

    restaurants.forEach(restaurant => {
        restaurant.menus.forEach(menu => {
            // Check if the menu name contains the search query
            if (menu.name.toLowerCase().includes(searchQuery)) {
                // Create a list item for the menu
                const menuItem = document.createElement('li');
                menuItem.innerHTML = `
                    <img src="${menu.icon}" alt="${menu.name}" style="width: 50px;">
                    <span>${menu.name}</span>
                `;
                menuList.appendChild(menuItem);
            }
        });
    });
}




// Attach the filterMenus function to the form submit event
document.querySelector('.filter-section form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    filterMenus(); // Call the filter function
});
// Attach the searchMenus function to the search button click event
document.getElementById('search-button').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent form submission
    searchMenus(); // Call the search function
});