from flask import Flask
from flask_cors import CORS
from config import Config
from routes.progress_routes import progress_bp

def create_app():
    """Application factory pattern"""
    app = Flask(__name__)
    
    # Configure CORS
    CORS(app, 
         origins=Config.CORS_ORIGINS,
         methods=Config.CORS_METHODS,
         allow_headers=Config.CORS_HEADERS,
         supports_credentials=Config.CORS_SUPPORTS_CREDENTIALS)
    
    # Register blueprints
    app.register_blueprint(progress_bp)
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=Config.DEBUG, port=Config.PORT)
