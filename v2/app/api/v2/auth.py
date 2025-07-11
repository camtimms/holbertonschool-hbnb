from flask_restx import Namespace, Resource, fields
from flask import session
from functools import wraps
from app.services import facade

auth_api = Namespace('auth', description='Authentication operations')

login_model = auth_api.model('Login', {
    'email': fields.String(required=True, description='User email'),
    'password': fields.String(required=True, description='User password'),
})

def login_required(f): # checks against user id for valid session
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'user_id' not in session:
            return {'error': 'Authentication required'}, 401
        return f(*args, **kwargs)
    return decorated

@auth_api.route('/login') # login method
class Login(Resource):
    @auth_api.expect(login_model, validate=True)
    def post(self):
        data = auth_api.payload
        user = facade.get_user_by_email(data['email']) # get user by email obj
        if not user or not user.verify_password(data['password']): # call verify method on user
            return {'error': 'Invalid email or password'}, 401

        session['user_id'] = user.id
        session['is_admin'] = (user.role == 'admin') # added admin 

        return {'message': 'Logged in successfully'}, 200

@auth_api.route('/protected') # protected endpoint that can only be called by user
class ProtectedResource(Resource):
    @login_required
    def get(self):
        user_id = session['user_id']
        user = facade.get_user(user_id)
        return {
            'id': user.id,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email
        }, 200
