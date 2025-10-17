'''# FILE: app.py

from flask import Flask, request, jsonify, render_template, session, redirect, url_for
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os

app = Flask(__name__, template_folder="templates")
# A secret key is required to use Flask sessions
app.secret_key = os.urandom(24) 

# --- Google OAuth Config ---
CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID", "888571166359-n1v15q0r52khk46iesbne2f8nc2ssj0j.apps.googleusercontent.com")

# --- Serves the login page by default ---
@app.route("/")
def login_page():
    """Serves the Google Login page."""
    return render_template("login.html")

# --- Protected route that serves the main site ---
@app.route("/home")
def home():
    """Serves the main landing page if a user is in the session."""
    if 'user' in session:
        return render_template("index.html", user=session['user'])
    else:
        return redirect(url_for('login_page'))

# --- Route for handling the Google token ---
@app.route("/tokenlogin", methods=["POST"])
def token_login():
    """Verifies Google ID token, creates a session, and provides a redirect URL."""
    try:
        token = request.json.get("id_token")
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), CLIENT_ID)

        # Store user info in the session
        session['user'] = {
            "name": idinfo["name"],
            "email": idinfo["email"],
            "picture": idinfo.get("picture")
        }

        # Send a success status and the URL to redirect to
        return jsonify({
            "status": "success",
            "redirect_url": url_for('home')
        })
    except ValueError:
        return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        return jsonify({"error": f"An internal server error occurred: {e}"}), 500

# --- Logout route ---
@app.route('/logout')
def logout():
    """Clears the session to log the user out."""
    session.pop('user', None)
    return redirect(url_for('login_page'))

if __name__ == "__main__":
    app.run(port=5000, debug=True)'''

# FILE: app.py

from flask import Flask, request, jsonify, render_template
import os

app = Flask(__name__, template_folder="templates")
# app.secret_key is not needed since we are not using sessions

# --- Serves the main site directly ---
@app.route("/")
def home():
    """Serves the main landing page."""
    return render_template("index.html")

# --- Example API route (optional) ---
@app.route("/api/ping")
def ping():
    return jsonify({"status": "success", "message": "pong"})

if __name__ == "__main__":
    app.run(port=5000, debug=True)
