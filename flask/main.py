# Firebase and internal server imports
from flask import Flask, render_template, redirect
from firebase_admin import initialize_app, db
from firebase_functions import https_fn

# Python library imports
import status as Status
import user as User
import restaurant as Restaurant
import json

# Initialise app
app = Flask(__name__)


# Routes #

@app.get("/")
def index():
	# Attempt to verify user
	try:
		current_user = {}
		current_user["uid"] = User.verify(request)
	# Log out the user if failed verification
	except Status.Unauthorized as e:
		return redirect("/logout")

	# Check if user is owner of a restaurant
	managed_restaurant = Restaurant.get(current_user["uid"])

	current_user["name"] = User.get_name(current_user["uid"])
	return render_template("home.html", user=current_user, managed_restaurant=managed_restaurant)


@app.get("/login")
def login():
	if "__session" in request.cookies:
		# User has session cookie (i.e. is already signed in) redirect
		return render_template("message.html", message="You are already logged in", redirect="/")
	
	return render_template("login.html")


@app.get("/cart")
def cart():
	current_user = {}
	current_user["uid"] = User.verify(request)
	current_user["name"] = User.get_name(current_user["uid"])

	cart = User.get_cart(current_user["uid"])

	return render_template("cart.html", user=current_user, cart=cart)


@app.get("/order")
def order():
	current_user = {}
	current_user["uid"] = User.verify(request)
	current_user["name"] = User.get_name(current_user["uid"])

	return render_template("order.html", user=current_user)


@app.get("/register")
def register():
	if "__session" in request.cookies:
		# User has session cookie (i.e. is already signed in) redirect
		return render_template("message.html", message="You are already logged in", redirect="/")
	
	return render_template("register.html")


@app.get("/account")
def account():
	# Verify user and get details
	current_user = {}
	current_user["uid"] = User.verify(request)
	current_user["name"] = User.get_name(current_user["uid"])

	current_user["email"] = User.get_email(current_user["uid"])
	current_user["manages_restaurant"] = Restaurant.get(current_user["uid"]) != {}
	# below gives error 500 idk why
	 # current_user["gender"] = User.get_email(current_user["uid"]).get("gender")


	return render_template("account.html", user=current_user)


@app.get("/logout")
def logout():
	# Redirect back to login page
	response = redirect("/login")
	if "__session" in request.cookies:
		# Clear session cookie
		response.delete_cookie("__session")
	return response


@app.get("/restaurants")
def restaurant_list():
	# Verify user and get details
	current_user = {}
	current_user["uid"] = User.verify(request)
	current_user["name"] = User.get_name(current_user["uid"])

	# Get restaurants from DB
	restaurant_list = Restaurant.list()

	return render_template("restaurants.html", user=current_user, restaurants=restaurant_list)



@app.get("/restaurant/<restaurant_id>")
def restaurant_page(restaurant_id):
	# Verify user and get details
	current_user = {}
	current_user["uid"] = User.verify(request)
	current_user["name"] = User.get_name(current_user["uid"])

	# Get restaurant from DB
	current_restaurant = Restaurant.get(restaurant_id)

	# 404 error if restaurant does not exist
	if not current_restaurant:
		raise Status.NotFound

	return render_template("restaurant/page.html", user=current_user, restaurant_id=restaurant_id, restaurant=current_restaurant)


@app.get("/restaurant/<restaurant_id>/menus/<menu_id>")
def restaurant_menu_page(restaurant_id, menu_id):
	# Verify user and get details
	current_user = {}
	current_user["uid"] = User.verify(request)
	current_user["name"] = User.get_name(current_user["uid"])

	# Get restaurant from DB
	current_restaurant = Restaurant.get(restaurant_id)

	# 404 error if restaurant does not exist
	if not current_restaurant:
		raise Status.NotFound
	
	# 404 error if restaurant does not exist
	if menu_id not in current_restaurant["menus"]:
		raise Status.NotFound

	menu = current_restaurant["menus"][menu_id]

	return render_template("restaurant/menu.html", user=current_user, restaurant_id=restaurant_id, restaurant=current_restaurant, menu_id=menu_id, menu=menu)



@app.get("/restaurant/admin")
def restaurant_admin():
	# Verify user and get details
	current_user = {}
	current_user["uid"] = User.verify(request)
	current_user["name"] = User.get_name(current_user["uid"])

	# Get user's restaurant from DB
	managed_restaurant = Restaurant.get(current_user["uid"])

	if not managed_restaurant:
		# User's restaurant does not exist, show setup page
		return render_template("restaurant/admin/details.html", user=current_user, restaurant=None, opening_hours={})
	
	# Show main restaurant admin page
	return render_template("restaurant/admin/main.html", user=current_user, restaurant=managed_restaurant)



@app.get("/restaurant/admin/details")
def restaurant_admin_details():
	# Verify user and get details
	current_user = {}
	current_user["uid"] = User.verify(request)
	current_user["name"] = User.get_name(current_user["uid"])

	# Get user's restaurant from DB
	managed_restaurant = Restaurant.get(current_user["uid"])

	if not managed_restaurant:
		# User's restaurant does not exist, redirect to setup page
		return redirect("/restaurant/admin")
	
	# Show detail editing page
	return render_template("restaurant/admin/details.html", user=current_user, restaurant=managed_restaurant, opening_hours=managed_restaurant["hours"])


@app.get("/restaurant/admin/menu/<menu_id>")
def restaurant_admin_menu(menu_id):
	# Verify user and get details
	current_user = {}
	current_user["uid"] = User.verify(request)
	current_user["name"] = User.get_name(current_user["uid"])

	# Get user's restaurant from DB
	managed_restaurant = Restaurant.get(current_user["uid"])

	# 404 error if restaurant does not exist
	if menu_id not in managed_restaurant["menus"]:
		raise Status.NotFound
		
	menu = managed_restaurant["menus"][menu_id]
	
	return render_template("restaurant/admin/menu.html", user=current_user, restaurant=managed_restaurant, menu_id=menu_id, menu=menu)


@app.get("/dishes")
def dishes():
	current_user = {}
	current_user["uid"] = User.verify(request)
	current_user["name"] = User.get_name(current_user["uid"])

	return render_template("dishes.html", user=current_user, )

@app.get("/payment")
def payment():
	current_user = {}
	current_user["uid"] = User.verify(request)
	current_user["name"] = User.get_name(current_user["uid"])

	return render_template("payment.html", user=current_user)


@app.get("/checkout")
def checkout():
	current_user = {}
	current_user["uid"] = User.verify(request)
	current_user["name"] = User.get_name(current_user["uid"])

	return render_template("checkout.html", user=current_user)


@app.get("/pastOrders")
def past_orders():
	current_user = {}
	current_user["uid"] = User.verify(request)
	current_user["name"] = User.get_name(current_user["uid"])

	return render_template("pastOrders.html", user=current_user, orders=User.get_all_orders(current_user["uid"]))


@app.get("/purchase")
def purchase():
	current_user = {}
	current_user["uid"] = User.verify(request)
	current_user["name"] = User.get_name(current_user["uid"])

	return render_template("purchase.html", user=current_user)


# API for checking if the server can verify the user
@app.get("/api/verify")
def api_verify():
	api_response = {"verified": False}

	try:
		User.verify(request)
		api_response["verified"] = True
	except Status.Unauthorized as e:
		api_response["verified"] = False
		api_response["error"] = str(e)
		
	return api_response

@app.get("/delivery")
def delivery():
	current_user = {}
	current_user["uid"] = User.verify(request)
	current_user["name"] = User.get_name(current_user["uid"])

	ref = db.reference("/drivers")
	drivers = ref.get()

	orders = User.get_orders(current_user["uid"])

	return render_template("delivery.html", user=current_user, drivers=drivers, orders=orders)
	
@app.post("/assign_driver")
def assign_driver():
    driver_index = request.form.get("driver_index")
    current_user_uid = User.verify(request)
    
    # Fetch the driver details using the index
    driver_ref = db.reference(f"/drivers/{driver_index}")
    driver_data = driver_ref.get()
    
    if not driver_data:
        return "Driver not found!"
    
    # Fetch the most recent order for the current user
    order_ref = db.reference(f"/users/{current_user_uid}/orders")
    snapshot = order_ref.limit_to_last(1).get() 
    last_order_key = list(snapshot.keys())[0]  
    
    # Assign the driver to the order
    order_driver_ref = db.reference(f"/users/{current_user_uid}/orders/{last_order_key}")
    order_driver_ref.update({
        "delivery-driver": driver_data['name'],
        "driver-phone": driver_data['phone']
    })
    

@app.get("/api/complete_order")
def api_complete_order():
	current_user = {}
	current_user["uid"] = User.verify(request)
	current_user["name"] = User.get_name(current_user["uid"])

	User.make_order_from_cart(current_user["uid"])
	User.reset_cart(current_user["uid"])

	return redirect("/pastOrders")


# Custom functions #
@app.template_filter("firebase_storage_url")
def firebase_storage_url(file):
	""" Generates a full URL to the specified file on Firebase storage """
	file = file.replace("/", "%2F");
	return f"https://firebasestorage.googleapis.com/v0/b/mtu-group-project-agile.appspot.com/o/{file}?alt=media"

@app.template_filter("plural")
def firebase_storage_url(noun, value):
	""" Parses provided noun as plural """
	if(type(value) == list or type(value) == dict):
		value = len(value)

	if value == 1:
		return noun
	elif noun.endswith("s") or noun.endswith("sh"):
		return noun + "es"
	else:
		return noun + "s"



# Firebase stuff: #
initialize_app()
@https_fn.on_request(timeout_sec=5)
def server(req: https_fn.Request) -> https_fn.Response:
	global request
	with app.request_context(req.environ):
		request = req
		return app.full_dispatch_request()
