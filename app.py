# FILE: app.py

from flask import Flask, request, jsonify, render_template, session, redirect, url_for
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os

app = Flask(__name__) # No need for template_folder, "templates" is the default

# A secret key is required to use Flask sessions
# Use a real, random string in production
app.secret_key = os.urandom(24) 

# --- Google OAuth Config ---
# Your Client ID is already here
CLIENT_ID = "888571166359-n1v15q0r52khk46iesbne2f8nc2ssj0j.apps.googleusercontent.com"

# --- 1. Login Page Route ---
@app.route("/")
def login_page():
    """
    Serves the login page.
    If the user is already logged in (in the session), redirect them to the app.
    """
    if 'user' in session:
        return redirect(url_for('app_page'))
    
    return render_template("login.html")

# --- 2. Main App Page Route (Protected) ---
@app.route("/app")
def app_page():
    """
    Serves the main "Apna CA" page.
    If the user is NOT logged in, redirect them back to the login page.
    """
    if 'user' not in session:
        return redirect(url_for('login_page'))
    
    # Pass the user's info from the session to the template
    return render_template("index.html", user=session['user'])

# --- 3. Google Token Verification Route ---
@app.route("/tokenlogin", methods=["POST"])
def token_login():
    """
    Verifies the Google ID token sent from the frontend.
    If valid, it creates a user session.
    """
    try:
        token = request.json.get("id_token")
        # Verify the token with Google
        idinfo = id_token.verify_oauth2_token(token, google_requests.Request(), CLIENT_ID)

        # Token is valid. Store user info in the session.
        session['user'] = {
            "name": idinfo["name"],
            "email": idinfo["email"],
            "picture": idinfo.get("picture")
        }

        # Send a success status. The client will handle the redirect.
        return jsonify({"status": "success"})
    
    except ValueError:
        # Invalid token
        return jsonify({"error": "Invalid token"}), 401
    except Exception as e:
        return jsonify({"error": f"An internal server error occurred: {e}"}), 500

# --- 4. Logout Route ---
@app.route('/logout')
def logout():
    """Clears the session to log the user out."""
    session.pop('user', None)
    return redirect(url_for('login_page'))

if __name__ == "__main__":
    # IMPORTANT: Stop using Live Server. Run this file.
    # Access your app at: http://localhost:5000
    app.run(port=5000, debug=True)
