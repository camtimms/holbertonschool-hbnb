"""
This is the user class
"""
from app import db, bcrypt
import re
from . import BaseModel
from sqlalchemy.orm import relationship


class User(BaseModel):
    __tablename__ = 'users'

    _first_name = db.Column("first_name", db.String(50), nullable=False)
    _last_name = db.Column("last_name", db.String(50), nullable=False)
    _email = db.Column("email", db.String(120), nullable=False, unique=True)
    _password = db.Column("password", db.String(128), nullable=False)
    _is_admin = db.Column("is_admin", db.Boolean, default=False)
    
    # Relationships
    reviews = relationship('Review', back_populates='user', lazy=True)

    def __init__(self, first_name, last_name, email, password, is_admin = False):
        super().__init__()
        self.first_name = first_name
        self.last_name = last_name
        self.email = email
        if password:
            self.hash_password(password)
        self.is_admin = is_admin

    def hash_password(self, password):
        """Hash the password before storing it."""
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def verify_password(self, password):
        """Verify the hashed password."""
        return bcrypt.check_password_hash(self.password, password)

    # --- Getters and Setters ---
    @property
    def first_name(self):
        return self._first_name

    @first_name.setter
    def first_name(self, value):
        is_valid_name = 0 < len(value.strip()) <= 50
        if is_valid_name:
            self._first_name = value.strip()
        else:
            raise ValueError("Invalid name length")

    @property
    def last_name(self):
        return self._last_name

    @last_name.setter
    def last_name(self, value):
        is_valid_name = 0 < len(value.strip()) <= 50
        if is_valid_name:
            self._last_name = value.strip()
        else:
            raise ValueError("Invalid name length")

    @property
    def email(self):
        return self._email

    @email.setter
    def email(self, value):
        regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b'
        if (re.fullmatch(regex, value.strip())):
            self._email = value.strip()
        else:
            raise ValueError("Email not valid")

    @property
    def password(self):
        return self._password

    @password.setter
    def password(self, value):
        """Setter for password - stores the hashed value"""
        self._password = value

    @property
    def is_admin(self):
        return self._is_admin

    @is_admin.setter
    def is_admin(self, value):
        if isinstance(value, bool):
            self._is_admin = value
        else:
            raise ValueError("is_admin must be a boolean")