from flask_restx import Namespace, Resource, fields
from flask import request, session
from app.services import facade
from functools import wraps

api = Namespace('users', description='User operations')

# Define the user model for input validation and documentation
user_model = api.model('User', {
    'first_name': fields.String(required=True, description='First name of the user'),
    'last_name': fields.String(required=True, description='Last name of the user'),
    'email': fields.String(required=True, description='Email of the user'),
    'password': fields.String(required=True, description='User password', min_length=6)
})

def login_required(f): # login wrap
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return {'error': 'Authentication required'}, 401
        return f(*args, **kwargs)
    return decorated

@api.route('/')
class UserList(Resource):
    @api.expect(user_model, validate=True)
    @api.response(201, 'User successfully created')
    @api.response(400, 'Email already registered')
    @api.response(400, 'Invalid input data')
    def post(self):
        """Register a new user"""
        user_data = api.payload

        # Simulate email uniqueness check (to be replaced by real validation with persistence)
        existing_user = facade.get_user_by_email(user_data['email'])
        if existing_user:
            return {'error': 'Email already registered'}, 400

        new_user = facade.create_user(user_data)
        return {'id': new_user.id, 'first_name': new_user.first_name, 'last_name': new_user.last_name, 'email': new_user.email}, 201

@api.route('/<user_id>')
class UserResource(Resource):
    @api.response(200, 'User details retrieved successfully')
    @api.response(401, 'Authentication required')
    @api.response(403, 'Access denied')
    @api.response(404, 'User not found')
    @login_required
    def get(self, user_id):
        """Get user details by ID (user or admin only)"""
        user = facade.get_user(user_id)
        if not user:
            return {'error': 'User not found'}, 404

        cur_user = session['user_id']
        is_admin = session.get('is_admin', False)

        if not is_admin and str(user_id) != str(cur_user):
            return {'error': 'Access denied'}, 403

        return {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email
        }, 200

    @api.response(200, 'User updated successfully')
    @api.response(401, 'This profile does not belong to you')
    @api.response(404, 'User not found')
    @api.response(400, 'Email already registered')
    @api.response(400, 'Invalid input data')
    @login_required
    def put(self, user_id):
        """Update a user's information"""
        user = facade.get_user(user_id)
        if not user:
            return {'error': 'User not found'}, 404

        cur_user = session['user_id']
        is_admin = session.get('is_admin', False)

        if not is_admin and str(user_id) != str(cur_user):
            return {'error': 'Access denied'}, 401

        try:
            user_data = api.payload

            if 'email' in user_data and user_data['email'] != user.email:
                existing_user = facade.get_user_by_email(user_data['email'])
                if existing_user and str(existing_user.id) != str(user_id):
                    return {'error': 'Email already registered'}, 400

            updated_user = facade.update_user(user_id, user_data)
            if updated_user:
                return {
                    'id': updated_user.id,
                    'first_name': updated_user.first_name,
                    'last_name': updated_user.last_name,
                    'email': updated_user.email
                }, 200
            return {'error': 'User not found'}, 404
        except ValueError as e:
            return {'error': str(e)}, 400


    @api.response(200, 'User deleted successfully')
    @api.response(401, 'This profile does not belong to you')
    @api.response(404, 'User not found')
    @login_required
    def delete(self, user_id):
        """Delete a user account"""
        cur_user = session['user_id']
        is_admin = session.get('is_admin', False)

         # Allow delete if admin or self
        if not is_admin and str(user_id) != str(cur_user):
            return {'error': 'This profile does not belong to you'}, 401

        # Check if user exists
        user = facade.get_user(user_id)
        if not user:
            return {'error': 'User not found'}, 404

        try:
            deleted = facade.delete_user(user_id)
            if deleted:
                # Clear the session since the user account is being deleted
                session.pop('user_id', None)
                return {'message': 'User account deleted successfully'}, 200
            return {'error': 'User not found'}, 404
        except ValueError as e:
            return {'error': str(e)}, 400