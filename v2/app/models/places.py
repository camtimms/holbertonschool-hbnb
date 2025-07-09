"""
This is a place class
"""
from . import BaseModel
from app.models.users import User
from app import db
from sqlalchemy import ForeignKey
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship


class Place(BaseModel):
    __tablename__ = 'places'

    title = db.Column(db.String(50), nullable = False)
    description = db.Column(db.String(500), nullable = False)
    price = db.Column(db.Numeric(10,2), nullable = False)
    latitude = db.Column(db.Float(), nullable = False)
    longitude = db.Column(db.Float(), nullable=False)
    owner_id = db.Column(db.String(50), ForeignKey('users.id'), nullable=False)

    # Implement one to many relationship
    reviews = relationship('Review', back_populates='places', lazy=True)
    amenities = relationship('Amenity', back_populates='places', lazy=True)

    def __init__(self, title, description, price, latitude, longitude, owner):
        if title is None or description is None or price is None or latitude is None or longitude is None or owner is None:
            raise ValueError("Required attributes not specified!")

        super().__init__()
        self.title = title
        self.description = description
        self.price = price
        self.latitude = latitude
        self.longitude = longitude
        self.owner = owner
        self.reviews = []  # List to store related reviews
        self.amenities = []  # List to store related amenities

    # --- Getters and Setters ---
    @property
    def title(self):
        """ Returns value of property title """
        return self._title

    @title.setter
    def title(self, value):
        """Setter for prop title"""
        # ensure that the value is up to 100 alphabets only after removing excess white-space
        is_valid_title = 0 < len(value.strip()) <= 100
        if is_valid_title:
            self._title = value.strip()
        else:
            raise ValueError("Invalid title length!")

    @property
    def description(self):
        """ Returns value of property description """
        return self._description

    @description.setter
    def description(self, value):
        """Setter for prop description"""
        # Can't think of any special checks to perform here tbh
        self._description = value

    @property
    def price(self):
        """ Returns value of property price """
        return self._price

    @price.setter
    def price(self, value):
        """Setter for prop price"""
        if isinstance(value, (int, float)) and value > 0.0:
            self._price = float(value)
        else:
            raise ValueError("Invalid value specified for price")

    @property
    def latitude(self):
        """ Returns value of property latitude """
        return self._latitude

    @latitude.setter
    def latitude(self, value):
        """Setter for prop latitude"""
        if isinstance(value, float) and -90.0 <= value <= 90.0:
            self._latitude = value
        else:
            raise ValueError("Invalid value specified for Latitude")

    @property
    def longitude(self):
        """ Returns value of property longitude """
        return self._longitude

    @longitude.setter
    def longitude(self, value):
        """Setter for prop longitude"""
        if isinstance(value, float) and -180.0 <= value <= 180.0:
            self._longitude = value
        else:
            raise ValueError("Invalid value specified for Longitude")

    @property
    def owner(self):
        """ Returns value of property owner """
        return self._owner

    @owner.setter
    def owner(self, value):
        """Setter for prop owner"""
        if isinstance(value, User):
            self._owner = value
        else:
            raise ValueError("Invalid object type passed in for owner!")

    # --- Methods ---
    def add_review(self, review):
        """Add a review to the place."""
        self.reviews.append(review)

    def add_amenity(self, amenity):
        """Add an amenity to the place."""
        self.amenities.append(amenity)