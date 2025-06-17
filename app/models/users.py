"""
This is the user class
"""
from . import BaseModel

class User(BaseModel):
    def __init__(self, first_name, last_name, email, is_admin = False):
        super().__init__()
        self.first_name = first_name
        self.last_name = last_name  
        self.email = email
        self.is_admin = is_admin #If user has admin privilages
    
    #getter and setter for first_name
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
    
    #getter and setter for last_name
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

    #getter and setter for email
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
    
    #getter and setter for is_admin (boolean) FIX THIS ONE 
    @property
    def is_admin(self):
        return self._is_admin
    
    def is_admin(self):
        if self.is_admin == True:
            return is_admin is True