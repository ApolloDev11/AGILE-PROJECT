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
		user = {}
		user["uid"] = user.verify(request)
	# Log out the user if failed verification
	except(exception.Unauthorized):
		return redirect("/logout")


	user["name"] = user.get_name(user["uid"])
	return render_template("home.html", user=user)


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


@app.get("/logout")
def logout():
	response = redirect("/login")
	if "auth" in request.cookies:
		# Clear auth cookie
		response.delete_cookie("auth")
	return response
	


@app.get("/restaurants")
def restaurants():
	user = {}
	user["uid"] = user.verify(request)
	user["name"] = user.get_name(user["uid"])

	restaurant_ref = db.reference("restaurants")
	restaurants = restaurant_ref.get()

	return render_template("restaurants.html", user=user, restaurants=restaurants)



@app.get("/restaurant/<restaurant_id>")
def restaurant(restaurant_id):
	user = {}
	user["uid"] = user.verify(request)
	user["name"] = user.get_name(user["uid"])

	restaurant_ref = db.reference("restaurants/{restaurant_id}")
	restaurant = restaurant_ref.get()

	return render_template("restaurant/page.html", user=user, restaurant=restaurant)



@app.get("/restaurant/<restaurant_id>/admin/menu")
def menus_admin(restaurant_id):
	user = {}
	user["uid"] = user.verify(request)
	user["name"] = user.get_name(user["uid"])
	
	return render_template("restaurant/admin/menu.html", user=user)



@app.get("/dishes")
def menus():
	uid = user.verify(request)
	name = user.get_name(uid)

	user = {"name": name}
	return render_template("dishes.html", user=user)


# API for checking if the server can verify the user
@app.get("/api/verify")
def api_verify():
	verified = False
	try:
		user.verify(request)
		verified = True
	except(exception.Unauthorized):
		verified = False
		
	return {"verified": verified}


# Firebase stuff: #
initialize_app()
@https_fn.on_request(timeout_sec=5)
def server(req: https_fn.Request) -> https_fn.Response:
	global request
	with app.request_context(req.environ):
		request = req
		return app.full_dispatch_request()
