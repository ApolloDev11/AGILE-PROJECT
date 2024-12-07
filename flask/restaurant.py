from firebase_admin import auth, db

def list():
	""" Returns a dictionary of all restaurants and their details """

	restaurants_ref = db.reference("restaurants")
	return restaurants_ref.get() or {}


def get(restaurant_id):
	""" Retrieves a restaurant from the database """

	restaurant_ref = db.reference(f"restaurants/{restaurant_id}")
	restaurant = restaurant_ref.get()
	if not restaurant:
		return {}
	if "menus" not in restaurant:
		restaurant["menus"] = {}

	for menu in restaurant["menus"]:
		if "dishes" not in restaurant["menus"][menu]:
			restaurant["menus"][menu]["dishes"] = {}

	if "hours" not in restaurant:
		restaurant["hours"] = {}
		
	return restaurant or None