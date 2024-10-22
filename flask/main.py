# Firebase and internal server imports
from flask import Flask, render_template, redirect
from firebase_admin import initialize_app, db
from firebase_functions import https_fn

# Python library imports
import exception, user, json

app = Flask(__name__)


@app.get("/")
def index():
	try:
		# Attempt to verify user
		uid = user.verify(request)
	except(exception.Unauthorized):
		# Redirect to login page
		response = redirect("/login")
		# Clear auth cookie
		response.delete_cookie("auth")
		return response

	name = user.get_name(uid)
	
	return render_template("home.html", name=name)


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


@app.get("/restaurants")
def restaurants():
	uid = user.verify(request)

	return render_template("restaurants.html")


@app.get("/dishes")
def menus():
	uid = user.verify(request)

	return render_template("dishes.html")


@app.get("/restaurant/menu")
def menus_admin():
	uid = user.verify(request)
	
	return render_template("restaurant/menu.html")


# Firebase stuff: #
initialize_app()
@https_fn.on_request(timeout_sec=5)
def server(req: https_fn.Request) -> https_fn.Response:
	global request
	with app.request_context(req.environ):
		request = req
		return app.full_dispatch_request()
