"""
This is a review class
"""
from . import BaseModel
from app.models.places import Place
from app.models.users import User
from app import db, bcrypt
from sqlalchemy.orm import relationship

class Review(BaseModel):
    __tablename__ = 'reviews'

    id
    _text = db.Column('text', db.String(500), nullable=False)
    _rating = db.Column('rating', db.Integer, nullable=False)
    _place_id = db.Column('place_id', db.Integer, db.ForeignKey('places.id'), nullable=False)
    _user_id = db.Column('user_id', db.Integer, db.ForeignKey('users.id'), nullable=False)

    #relationships
    place = db.relationship('Place', back_populates='reviews', lazy=True)
    user = db.relationship('User', back_populates='reviews', lazy=True) 

    def __init__(self, text, rating, place, user):
        super().__init__()
        self.text = text
        self.rating = rating
        self.place = place
        self.user = user

    # --- Getters and Setters ---
    @property
    def text(self):
        """returns text for review"""
        return self._text

    @text.setter
    def text(self, value):
        """setter for review text"""
        is_valid_review = 0 < len(value.strip()) <= 500
        if is_valid_review:
            self._text = value.strip()
        else:
            raise ValueError("Invalid review length!")

    @property
    def rating(self):
        """returns rating for review"""
        return self._rating

    @rating.setter
    def rating(self, value):
        """setter for review rating"""
        if isinstance(value, (int, float)) and 0 <= value <= 5:
            self._rating = float(value)
        else:
            raise ValueError("Rating must be between 0 and 5.")

