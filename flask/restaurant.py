from firebase_admin import auth, db

def list():
	""" Returns a dictionary of all restaurants and their details """

	restaurants_ref = db.reference("restaurants")
	return restaurants_ref.get() or {}


def get(restaurant_id):
	""" Retrieves a restaurant from the database """

	restaurant_ref = db.reference(f"restaurants/{restaurant_id}")
	return restaurant_ref.get() or {}