from flask import Flask, send_file

app = Flask(__name__)

VIEWS_DIR = "views/"

# Routes
@app.route("/")
def hello_world():
    return ""

# (ro = Restaurant Owner)
# Restaurant owner administration page
@app.route("/administration/menu")
def ro_menu_view():
    return send_file(VIEWS_DIR + "menulist.html")

# When adding a menu by restaurant owner
@app.route("/menu", methods=["POST"])
def ro_menu_add():
    return ""

# When deleting a menu by restaurant owner
@app.route("/menu", methods=["DELETE"])
def ro_menu_delete():
    return ""

# Entry
if __name__ == "__main__":
    app.run()
