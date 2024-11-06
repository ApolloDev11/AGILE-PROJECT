const ingredientName = document.getElementById("ingredient-title-input");

async function addIngredient() {
    // Use uid as restaurant ID
	const restaurantID = auth.currentUser.uid;

    let ingredient = {name: ingredientName.value};
    let ingredientRef = ref(database, `/restaurants/${restaurantID}/ingredients`);

    try{
        let ingredientsSnap = await get(ingredientRef);
        let ingredientsArray = ingredientsSnap.exists() ? ingredientsSnap.val() :[];

        // Add the new ingredient to the array
        ingredientsArray.push(ingredient); 

        // Get image for new ingredient
		if(document.getElementById("ingredient-image-input").files == 0) throw "No image selected!";
		const file = document.getElementById("ingredient-image-input").files[0];
		// Ensure image is less than 2MB in size
		if(Number(file.size.toString()) > 2 * 1024 * 1024) throw "Image must be less than 2MB in size";

		// Ensure image is 250×250 or larger
		await validateImage(file);

		// Upload image to Firebase
		let imageRef = storageRef(storage, `/restaurants/${restaurantID}/ingredients/${ingredientsArray.length - 1}/image`);
		await uploadBytes(imageRef, file);

        await set(ingredientRef, ingredientsArray);
        console.log("Ingredient added:", ingredient);
        document.location.reload();

    }catch (error) {
        alert(error.message || error)
		console.error(error)
    }
}

async function deleteIngredient(deleteIndex) {

    const restaurantID = auth.currentUser.uid;
    
    let ingredientRef = ref(database, `/restaurants/${restaurantID}/ingredients/${deleteIndex}`);
    

    try {
		await remove(ingredientRef);
	} catch(error) {
		alert(error.message || error)
		console.error(error)
	}
    document.location.reload();
}
