from flask_restx import Namespace, Resource, fields
from app.services import facade
from flask import session
from functools import wraps
api = Namespace('amenities', description='Amenity operations')

# Define the amenity model for input validation and documentation
amenity_model = api.model('Amenity', {
    'name': fields.String(required=True, description='Name of the amenity')
})

def login_required(f): # login wrap
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return {'error': 'Authentication required'}, 401
        return f(*args, **kwargs)
    return decorated

@api.route('/')
class AmenityList(Resource):
    @api.expect(amenity_model)
    @api.response(201, 'Amenity successfully created')
    @api.response(400, 'Invalid input data')
    @api.response(401, 'Authentication required')
    @api.response(403, 'Admin privileges required')
    @login_required
    def post(self):
        """Register a new amenity (admin only)"""
        if not session.get('is_admin'):
            return {'error': 'Admin privileges required'}, 403

        try:
            amenity_data = api.payload
            new_amenity = facade.create_amenity(amenity_data)
            return {'id': new_amenity.id, 'name': new_amenity.name}, 201
        except ValueError as e:
            return {'error': str(e)}, 400


    @api.response(200, 'List of amenities retrieved successfully')
    def get(self):
        """Retrieve a list of all amenities"""
        try:
            amenities = facade.get_all_amenities()
            return [{'id': amenity.id, 'name': amenity.name} for amenity in amenities], 200
        except ValueError as e:
            return {'error': str(e)}, 404



@api.route('/<amenity_id>')
class AmenityResource(Resource):
    @api.response(200, 'Amenity details retrieved successfully')
    @api.response(404, 'Amenity not found')
    def get(self, amenity_id):
        """Get amenity details by ID"""
        try:
            amenity = facade.get_amenity(amenity_id)
            return {'id': amenity.id, 'name': amenity.name}, 200
        except ValueError as e:
            return {'error': str(e)}, 404

    @api.expect(amenity_model)
    @api.expect(amenity_model)
    @api.response(200, 'Amenity updated successfully')
    @api.response(404, 'Amenity not found')
    @api.response(400, 'Invalid input data')
    @api.response(401, 'Authentication required')
    @api.response(403, 'Admin privileges required')
    @login_required
    def put(self, amenity_id):
        """Update an amenity's information (admin only)"""
        if not session.get('is_admin'):
            return {'error': 'Admin privileges required'}, 403

        try:
            amenity_data = api.payload
            updated_amenity = facade.update_amenity(amenity_id, amenity_data)
            if updated_amenity:
                return {'id': updated_amenity.id, 'name': updated_amenity.name}, 200
            return {'error': 'Amenity not found'}, 404
        except ValueError as e:
            return {'error': str(e)}, 400
