from app.persistence.repository import InMemoryRepository

import uuid
from app.models.places import Place
from app.models.users import User
from app.models.reviews import Review
from app.models.amenity import Amenity

class HBnBFacade:
    def __init__(self):
        self.user_repo = InMemoryRepository()
        self.place_repo = InMemoryRepository()
        self.review_repo = InMemoryRepository()
        self.amenity_repo = InMemoryRepository()

    # --- CRU User ---
    def create_user(self, user_data):
        user = User(**user_data)
        self.user_repo.add(user)
        return user

    def get_user(self, user_id):
        return self.user_repo.get(user_id)

    def get_user_by_email(self, email):
        return self.user_repo.get_by_attribute('email', email)

    # --- CRU Place ---
    def create_place(self, place_data):
        # Creates the place by calling the model/class we created
        place = Place(**place_data)
        # Store it in the repository
        self.place_repo.add(place)
        # Return the created place
        return place

    def get_place(self, place_id):
        # Placeholder for logic to retrieve a place by ID, including associated owner and amenities
        place = self.place_repo.get(place_id)
        # Check if place exists and raise error if not
        if place is None:
            raise ValueError(f"Place with ID {place_id} not found")
        return place

    def get_all_places(self):
        # Placeholder for logic to retrieve all places
        pass

    def update_place(self, place_id, place_data):
        # Placeholder for logic to update a place
        pass

    # --- CRU Amenity ---
    def create_amenity(self, amenity_data):
        amenity = Amenity(**amenity__data)
        #check if amenity is already existing
        check_amenity = self.amenity_repo.get(amenity_id)
        #if amenity does not exist, create new
        if check_amenity is None:
            self.amenity_data.add(amenity)
            return amenity
        #else, return an existing amenity
        else:
            return self.amenity_repo.get(amenity_data)
        # is it amenity_data?

    def get_amenity(self, amenity_id):
        #if amenity_id doesn't exist
        check_id = self.amenity_repo.get(amenity_id)
        if check_id is None:
            raise ValueError (f"Amenity with ID {amenity_id} not found")
        return check_id

    def get_all_amenities(self):
        #if there are no amenities
        if self.amenity_repo.get_all() is None:
            raise ValueError ("Amenities not found")
        return self.amenity_repo.get_all()

    def update_amenity(self, amenity_id, amenity_data):
        #if amenity_id doesn't exist
        check_id = self.amenity_repo.get(amenity_id)
        if check_id is None:
            raise ValueError (f"Amenity with ID {amenity_id} not found")
        return self.amenity_data.update(amenity_id, amenity_data)
    
    # --- CRU Review ---
    def create_review(self, review_data):
        #validate required fields
        required_fields = ['user_id', 'place_id', 'rating', 'text']
        for field in required_fields:
            if field not in review_data:
                return ValueError(f"Missing field: {field}")
        
        #validate user and place id
        if not self.user_repo.get(review_data['user_id']):
            raise ValueError("Invalid user_id")
        if not self.place_repo.get(review_data['palce_id']):
            raise ValueError("invalid place_id")
        #valdiate rating
        rating = review_data['rating']
        if not isinstance(rating, (int, float)) or not (1 <= rating <= 5):
            raise ValueError("Rating must be between 1 and 5")
        #create id for review
        review_id = str(uuid.uuid4())
        review_data['id'] = review_id

        self.review_repo.add(review_data)
        return review_data

    def get_review(self, review_id):
        return self.review_repo.get(review_id)

    def get_all_reviews(self):
        return self.review_repo.get_all()

    def get_reviews_by_place(self, place_id):
       return [review for review in self.review_repo.get_all() if review['plade_id'] is place_id]

    def update_review(self, review_id, review_data):
        review = self.review_repo.get(review_id)
        if not review:
            return None

        #only updates change for text and rating
        if 'rating' in review_data:
            new_rating = review_data['rating']
            if not isinstance(new_rating, (int, float)) or not (1 <= new_rating <= 5):
                raise ValueError("Rating must be between 1 and 5")
            review['rating'] = new_rating

        if 'text' in review_data:
            review['text'] = review_data['text']

        return review

    def delete_review(self, review_id):
        return self.review_repo.delete(review_id)
