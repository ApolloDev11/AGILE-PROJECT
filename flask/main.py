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
	if "__session" in request.cookies:
		# User has session cookie (i.e. is already signed in) redirect
		return render_template("message.html", message="You are already logged in", redirect="/")
	
	return render_template("login.html")


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
	current_user["uid"] = user.verify(request)
	current_user["name"] = user.get_name(current_user["uid"])

	current_user["email"] = user.get_email(current_user["uid"])

	return render_template("account.html", user=current_user)


@app.get("/logout")
def logout():
	# Redirect back to login page
	response = redirect("/login")
	if "__session" in request.cookies:
		# Clear session cookie
		response.delete_cookie("__session")
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
	restaurants = restaurant_ref.get() or {}

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

	return render_template("restaurant/page.html", user=current_user, restaurant_id=restaurant_id, restaurant=restaurant)



@app.get("/restaurant/admin")
def restaurant_new():
	# Verify user and get details
	current_user = {}
	current_user["uid"] = user.verify(request)
	current_user["name"] = user.get_name(current_user["uid"])
	
	# Get restaurant managed by user
	managed_restaurant_id = db.reference(f"/users/{current_user['uid']}/managed_restaurant")
	managed_restaurant_id = managed_restaurant_id.get()
	if not managed_restaurant_id:
		# User is not managing any restaurant, show setup page
		return render_template("restaurant/admin/setup.html", user=current_user)
	
	return render_template("restaurant/admin/main.html", user=current_user)


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



# Custom functions #
@app.template_filter("firebase_storage_url")
def firebase_storage_url(file):
	""" Generates a full URL to the specified file on Firebase storage """
	file = file.replace("/", "%2F");
	return f"https://firebasestorage.googleapis.com/v0/b/mtu-group-project-agile.appspot.com/o/{file}?alt=media"




# Firebase stuff: #
initialize_app()
@https_fn.on_request(timeout_sec=5)
def server(req: https_fn.Request) -> https_fn.Response:
	global request
	with app.request_context(req.environ):
		request = req
		return app.full_dispatch_request()
