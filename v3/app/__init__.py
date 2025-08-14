from flask import Flask
from flask_restx import Api
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_session import Session
from datetime import timedelta

bcrypt = Bcrypt()
db = SQLAlchemy()


def create_app(config_class="config.DevelopmentConfig"):
    app = Flask(__name__)
    app.config.from_object(config_class)

    #Session configuration
    app.secret_key = 'secretkey'
    app.config['SESSION_TYPE'] = 'sqlalchemy'
    app.config['SESSION_SQLALCHEMY'] = db
    app.config['SESSION_PERMANENT'] = True
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=30 ) #expiration of session

    # Initialize Flask extensions with app
    bcrypt.init_app(app)
    db.init_app(app)
    Session(app)

    # Create Api instance
    api = Api(app, version='1.0', title='HBnB API', description='HBnB Application API', doc='/api/v3/')

    from app.api.v3.users import api as users_ns
    from app.api.v3.amenities import api as amenities_ns
    from app.api.v3.places import api as places_ns
    from app.api.v3.reviews import api as reviews_ns
    from app.api.v3.auth import auth_api #being added auth file

    api.add_namespace(users_ns, path="/api/v2/users")
    api.add_namespace(amenities_ns, path="/api/v2/amenities")
    api.add_namespace(places_ns, path="/api/v2/places")
    api.add_namespace(reviews_ns, path="/api/v2/reviews")
    api.add_namespace(auth_api, path="/api/v2/auth") #added name space for auth

    # Create database tables within app context
    with app.app_context():
        # Import all models to ensure they're registered
        from app.models.users import User
        from app.models.places import Place
        from app.models.reviews import Review
        from app.models.amenity import Amenity

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

    return app