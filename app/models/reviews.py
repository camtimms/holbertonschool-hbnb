"""
This is a review class
"""
from . import BaseModel
from app.models.places import Place
from app.models.users import User

class Review(BaseModel):
    def __init__(self, text, rating, place, user):
        super().__init__()
        self.text = text
        self.rating = rating
        self.place = place
        self.user = user
        self.replies = []

    # --- Method ---
    def add_reply(self, reply):
        """Add a reply to review"""
        if not isinstance(reply, str) or not reply.strip():
            raise ValueError("Reply must be a non-empty string.")
        self.replies.append(reply.strip())

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

    @property
    def place(self):
        """returns place of review"""
        return self._place

    @place.setter
    def place(self, value):
        """sets place of review"""

        if not isinstance(value, Place):
            raise ValueError("Place must be a Place object.")

        self._place = value

    @property
    def user(self):
        """returns user of review"""
        return self._user

    @user.setter
    def user(self, value):

        """sets user of review"""
        if not isinstance(value, User):
            raise ValueError("User must be a User object.")

        self._user = value
