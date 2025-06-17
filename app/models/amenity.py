"""
This is a amenity class
"""
from . import BaseModel

class Amenity(BaseModel):
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
        """Setter for prop title"""
        # ensure that the value is up to 100 alphabets only after removing excess white-space
        is_valid_name = 0 < len(value.strip()) <= 50
        if is_valid_name:
            self._name = value.strip()
        else:
            raise ValueError("Invalid title length!")