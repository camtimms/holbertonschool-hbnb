from flask import Flask
from flask_restx import Api
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask import send_from_directory

bcrypt = Bcrypt()
db = SQLAlchemy()


def create_app(config_class="config.DevelopmentConfig"):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize Flask extensions with app
    bcrypt.init_app(app)
    db.init_app(app)

    # Crate Api instance
    api = Api(app, version='1.0', title='HBnB API', description='HBnB Application API', doc='/api/v1/')

    from app.api.v3.users import api as users_ns
    from app.api.v3.amenities import api as amenities_ns
    from app.api.v3.places import api as places_ns
    from app.api.v3.reviews import api as reviews_ns

    api.add_namespace(users_ns, path="/api/v1/users")
    api.add_namespace(amenities_ns, path="/api/v1/amenities")
    api.add_namespace(places_ns, path="/api/v1/places")
    api.add_namespace(reviews_ns, path="/api/v1/reviews")

    # Create database tables within app context
    with app.app_context():
        # Import all models to ensure they're registered
        from app.models.users import User
        # Uncomment when you implement other models:
        from app.models.places import Place
        # from app.models.reviews import Review
        # from app.models.amenity import Amenity

        # Create tables if they don't exist
        db.create_all()

    # Add error handlers for database operations
    @app.teardown_appcontext
    def close_db_session(error):
        """Ensure database sessions are closed after each request"""
        db.session.remove()

    @app.errorhandler(500)
    def internal_error(error):
        """Handle database errors gracefully"""
        db.session.rollback()
        return {'error': 'Internal server error'}, 500

    # Enable CORS for frontend
    CORS(app, supports_credentials=True)

    # Serve static files
    @app.route('/')
    @app.route('/<path:filename>')
    def serve_static(filename='index.html'):
        return send_from_directory('front_end', filename)

    return app