"""
This is a review class
"""
from . import BaseModel

class Review(BaseModel):
    def __init__(self, text, rating, place, user, replies):
        super().__init__()
        self.text = text
        self.rating = rating
        self.place = place
        self.user = user
        self.replies = []

    def add_reply(self, reply):
        """Add a reply to review"""
        self.reviews.append(reply)
