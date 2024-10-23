# Firebase and internal server imports
from flask import Flask, render_template, redirect
from firebase_admin import initialize_app, db
from firebase_functions import https_fn

# Python library imports
import exception, user, json

# Initialise app
app = Flask(__name__)


# Routes #

@app.get("/")
def index():
	# Attempt to verify user
	try:
		current_user = {}
		current_user["uid"] = user.verify(request)
	# Log out the user if failed verification
	except exception.Unauthorized as e:
		return redirect("/logout")


	current_user["name"] = user.get_name(current_user["uid"])
	return render_template("home.html", user=current_user)


@app.get("/login")
def login():
	if "auth" in request.cookies:
		# User has auth cookie (i.e. is already signed in) redirect
		return redirect("/")
	
	return render_template("login.html")


@app.get("/register")
def register():
	if "auth" in request.cookies:
		# User has auth cookie (i.e. is already signed in) redirect
		return redirect("/")
	
	return render_template("register.html")


@app.get("/account")
def account():
	# Verify user and get details
	current_user = {}
	current_user["uid"] = user.verify(request)
	current_user["name"] = user.get_name(current_user["uid"])

	current_user["email"] = user.get_email(current_user["uid"])

	return render_template("account.html", user=current_user)


@app.get("/logout")
def logout():
	# Redirect back to login page
	response = redirect("/login")
	if "auth" in request.cookies:
		# Clear auth cookie
		response.delete_cookie("auth")
	return response
	

@app.get("/restaurant/menu")
def menu():
	return render_template("restaurant/admin/menu.html")


@app.get("/restaurants")
def restaurants():
	# Verify user and get details
	current_user = {}
	current_user["uid"] = user.verify(request)
	current_user["name"] = user.get_name(current_user["uid"])

	# Get restaurants from DB
	restaurant_ref = db.reference("restaurants")
	restaurants = restaurant_ref.get()

	return render_template("restaurants.html", user=current_user, restaurants=restaurants)



@app.get("/restaurant/<restaurant_id>")
def restaurant(restaurant_id):
	# Verify user and get details
	current_user = {}
	current_user["uid"] = user.verify(request)
	current_user["name"] = user.get_name(current_user["uid"])

	# Get restaurant from DB
	restaurant_ref = db.reference(f"restaurants/{restaurant_id}")
	restaurant = restaurant_ref.get()

	# 404 error if restaurant does not exist
	if not restaurant:
		raise exception.NotFound

	return render_template("restaurant/page.html", user=current_user, restaurant=restaurant)



@app.get("/restaurant/create")
def restaurant_new():
	# Verify user and get details
	current_user = {}
	current_user["uid"] = user.verify(request)
	current_user["name"] = user.get_name(current_user["uid"])
	
	# TO DO: Check if user already is managing a restaurant
	
	return render_template("restaurant/admin/setup.html", user=current_user)


@app.get("/restaurant/<restaurant_id>/admin/menu")
def menus_admin(restaurant_id):
	# Verify user and get details
	current_user = {}
	current_user["uid"] = user.verify(request)
	current_user["name"] = user.get_name(current_user["uid"])

	# Get restaurant from DB
	restaurant_ref = db.reference(f"restaurants/{restaurant_id}")
	restaurant = restaurant_ref.get()

	# 404 error if restaurant does not exist
	if not restaurant:
		raise exception.NotFound
	
	# TO DO: Check if user is allowed to manage this restaurant
	
	return render_template("restaurant/admin/menu.html", user=current_user)



@app.get("/dishes")
def menus():
	current_user = {}
	current_user["uid"] = user.verify(request)
	current_user["name"] = user.get_name(current_user["uid"])

	return render_template("dishes.html", user=current_user)


# API for checking if the server can verify the user
@app.get("/api/verify")
def api_verify():
	api_response = {"verified": False}

	try:
		user.verify(request)
		api_response["verified"] = True
	except exception.Unauthorized as e:
		api_response["verified"] = False
		api_response["error"] = str(e)
		
	return api_response


# Firebase stuff: #
initialize_app()
@https_fn.on_request(timeout_sec=5)
def server(req: https_fn.Request) -> https_fn.Response:
	global request
	with app.request_context(req.environ):
		request = req
		return app.full_dispatch_request()
