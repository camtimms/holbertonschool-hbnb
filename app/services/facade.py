from app.persistence.repository import InMemoryRepository
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

    # --- CRU Place
    def create_place(self, title, description, price, latitude, longitude, owner):
        # Creates the place by calling the model/class we created
        place = Place(title=title, description=description, price=price,
                      latitude=latitude, longitude=longitude, owner=owner)
        # Store it in the repository
        self.place_repo.add(place)
        # Return the created place
        return place

    def get_place(self, place_id):
        # Placeholder for logic to retrieve a place by ID, including associated owner and amenities
        place = self.place_repo.get(place_id)
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
    # Placeholder for logic to create a review, including validation for user_id, place_id, and rating
        pass

    def get_review(self, review_id):
        # Placeholder for logic to retrieve a review by ID
        pass

    def get_all_reviews(self):
        # Placeholder for logic to retrieve all reviews
        pass

    def get_reviews_by_place(self, place_id):
        # Placeholder for logic to retrieve all reviews for a specific place
        pass

    def update_review(self, review_id, review_data):
        # Placeholder for logic to update a review
        pass

    def delete_review(self, review_id):
        # Placeholder for logic to delete a review
        pass