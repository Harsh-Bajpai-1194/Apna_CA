import serverless_wsgi
from app import app  # This imports the 'app' object from your app.py

def handler(event, context):
  """
  This is the new entry point for Netlify.
  It uses serverless_wsgi to wrap your Flask app
  and handle the request.
  """
  return serverless_wsgi.handle_request(app, event, context)