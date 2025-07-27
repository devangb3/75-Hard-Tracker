from flask import Flask
from flask_cors import CORS
from config import Config
from routes.progress_routes import progress_bp
import logging
from flask import jsonify
from werkzeug.exceptions import HTTPException

def create_app():
    """Application factory pattern"""
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s %(levelname)s %(name)s: %(message)s',
    )
    logger = logging.getLogger(__name__)
    logger.info('Starting Flask application')
    app = Flask(__name__)
    
    CORS(app, 
         origins=Config.CORS_ORIGINS,
         methods=Config.CORS_METHODS,
         allow_headers=Config.CORS_HEADERS,
         supports_credentials=Config.CORS_SUPPORTS_CREDENTIALS)
    
    app.register_blueprint(progress_bp, url_prefix='/api')

    @app.errorhandler(HTTPException)
    def handle_http_exception(e):
        response = e.get_response()
        response.data = jsonify({
            "error": e.description,
            "type": e.__class__.__name__,
            "code": e.code
        }).data
        response.content_type = "application/json"
        return response, e.code

    @app.errorhandler(Exception)
    def handle_exception(e):
        logger.error(f"Unhandled Exception: {str(e)}", exc_info=True)
        return jsonify({
            "error": "An unexpected error occurred.",
            "type": e.__class__.__name__,
            "details": str(e)
        }), 500

    return app

if __name__ == "__main__":
    app = create_app()
    logging.getLogger(__name__).info('Running Flask app')
    app.run(debug=Config.DEBUG, port=Config.PORT)
