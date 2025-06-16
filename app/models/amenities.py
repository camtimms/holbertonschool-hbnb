"""
This is a ammenities class
"""
from . import BaseModel

class Place(BaseModel):
    def __init__(self, name):
        super().__init__()
        self.name = name
