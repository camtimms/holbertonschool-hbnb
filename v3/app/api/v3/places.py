from flask_restx import Namespace, Resource, fields
from flask import request, session, url_for
from app.services import facade
from functools import wraps
import urllib.parse

api = Namespace('places', description='Place operations')

# Define the models for related entities
amenity_model = api.model('PlaceAmenity', {
    'id': fields.String(description='Amenity ID'),
    'name': fields.String(description='Name of the amenity')
})

user_model = api.model('PlaceUser', {
    'id': fields.String(description='User ID'),
    'first_name': fields.String(description='First name of the owner'),
    'last_name': fields.String(description='Last name of the owner'),
    'email': fields.String(description='Email of the owner')
})

# Define the place model for input validation and documentation
place_model = api.model('Place', {
    'title': fields.String(required=True, description='Title of the place'),
    'description': fields.String(description='Description of the place'),
    'price': fields.Float(required=True, description='Price per night'),
    'latitude': fields.Float(required=True, description='Latitude of the place'),
    'longitude': fields.Float(required=True, description='Longitude of the place'),
    'owner_id': fields.String(required=True, description='ID of the owner'),
    'amenities': fields.List(fields.String, required=True, description="List of amenities ID's")
})

def serialize_place(place):
    """Helper function to serialize place object consistently"""

    filename = urllib.parse.quote(place.title) + ".jpg"
    image_url = url_for('static', filename=f'images/{filename}', _external=True)

    amenities_list = []
    if hasattr(place, 'amenities') and place.amenities:
        for amenity in place.amenities:
            if hasattr(amenity, 'id'):
                amenities_list.append(amenity.id)
            else:
                amenities_list.append(str(amenity))  # Assume it's already an ID

    return {
        'id': place.id,
        'title': place.title,
        'description': place.description,
        'price': float(place.price),
        'latitude': place.latitude,
        'longitude': place.longitude,
        'owner_id': place.owner.id if place.owner else None,
        'amenities': amenities_list,
        'image': image_url
    }

def login_required(f): # login wrap
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return {'error': 'Authentication required'}, 401
        return f(*args, **kwargs)
    return decorated

@api.route('/')
class PlaceList(Resource):
    @api.expect(place_model, validate=True)
    @api.response(201, 'Place successfully created')
    @api.response(400, 'Invalid input data')
    @login_required
    def post(self):
        """Register a new place"""
        user_id = session['user_id']
        try:
            place_data = api.payload
            # Force the owner_id to be the authenticated user
            place_data['owner_id'] = user_id
            new_place = facade.create_place(place_data)
            return serialize_place(new_place), 201
        except ValueError as e:
            return {'error': str(e)}, 400

    @api.response(200, 'List of places retrieved successfully')
    def get(self):
        """Retrieve a list of all places"""
        try:
            places = facade.get_all_places()
            return [serialize_place(place) for place in places], 200
        except ValueError as e:
            return {'error': str(e)}, 400

@api.route('/<place_id>')
class PlaceResource(Resource):
    @api.response(200, 'Place details retrieved successfully')
    @api.response(404, 'Place not found')
    def get(self, place_id):
        """Get place details by ID"""
        try:
            place = facade.get_place(place_id)
            return serialize_place(place), 200
        except ValueError as e:
            return {'error': str(e)}, 404

    @api.expect(place_model, validate=True)
    @api.response(200, 'Place updated successfully')
    @api.response(404, 'Place not found')
    @api.response(400, 'Invalid input data')
    @api.response(403, 'You cannot update a palce you don\'t own')
    @login_required
    def put(self, place_id):
        """Update a place's information"""
        user_id = session['user_id']

        # Prevent review of own place
        place = facade.get_place(place_id)
        if not place:
            return {'error': 'Place not found'}, 404
        if place.owner.id != user_id:
            return {'error': 'You cannot update a palce you don\'t own'}, 403

        try:
            place_data = api.payload
            updated_place = facade.update_place(place_id, place_data)
            if updated_place:
                return serialize_place(updated_place), 200
            return {'error': 'Place not found'}, 404
        except ValueError as e:
            return {'error': str(e)}, 400


