
"""
This is a amenity class
"""
from app import db
from sqlalchemy.orm import relationship
from sqlalchemy import Table, Column, Integer, ForeignKey
from . import BaseModel

# Association table for many-to-many relationship
place_amenity_asc = db.Table('place_amenity_asc',
    Column('amenity_id', Integer, ForeignKey('amenities.id'), primary_key=True),
    Column('place_id', Integer, ForeignKey('places.id'), primary_key=True)
)


class Amenity(BaseModel):
    __tablename__ = 'amenities'

    _name = db.Column("name", db.String(50), nullable=False)

    places = relationship('Place', secondary=place_amenity_asc, lazy='subquery',
                           back_populates='amenities')

    def __init__(self, name):
        super().__init__()
        self.name = name

    # --- Getters and Setters ---
    @property
    def name(self):
        """ Returns value of the amenity name"""
        return self._name

    @name.setter
    def name(self, value):
        """Setter for prop name"""
        # ensure that the value is up to 100 alphabets only after removing excess white-space
        is_valid_name = 0 < len(value.strip()) <= 50
        if is_valid_name:
            self._name = value.strip()
        else:
            raise ValueError("Invalid name length!")