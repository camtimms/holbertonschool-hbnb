from app.persistence.repository import SQLAlchemyRepository
from app.models.places import Place
from app.models.users import User
from app.models.reviews import Review
from app.models.amenity import Amenity
from app.persistence.repository import UserRepository
from app import db

class HBnBFacade:
    def __init__(self):
        self.user_repo = UserRepository()
        self.place_repo = SQLAlchemyRepository(Place)
        self.review_repo = SQLAlchemyRepository(Review)
        self.amenity_repo = SQLAlchemyRepository(Amenity)

    # --- CRU User ---
    def create_user(self, user_data):
        user = User(**user_data)
        self.user_repo.add(user)
        return user

    def get_user(self, user_id):
        return self.user_repo.get(user_id)

    def get_user_by_email(self, email):
        return self.user_repo.get_user_by_email(email)

    def update_user(self, user_id, user_data):
        """Update user information"""
        user = self.user_repo.get(user_id)
        if not user:
            return None

        # Handle password hashing if password is being updated
        if 'password' in user_data:
            user.hash_password(user_data['password'])
            # Remove password from user_data to avoid setting it directly
            user_data_copy = user_data.copy()
            user_data_copy.pop('password')
            user_data = user_data_copy

        # Update other fields
        for key, value in user_data.items():
            if hasattr(user, key):
                setattr(user, key, value)

        # Save changes to database
        from app import db
        db.session.commit()

        return user

    def delete_user(self, user_id):
        """Delete a user and handle cascading deletions"""
        user = self.user_repo.get(user_id)
        if not user:
            return False

        try:
            # Handle cascade deletions manually if needed
            # Delete user's reviews first
            user_reviews = [review for review in self.review_repo.get_all() if review.user.id == user_id]
            for review in user_reviews:
                db.session.delete(review)

            # Delete user's places (this will also handle place-related reviews)
            user_places = [place for place in self.place_repo.get_all() if place.owner.id == user_id]
            for place in user_places:
                # Delete reviews for this place
                place_reviews = [review for review in self.review_repo.get_all() if review.place.id == place.id]
                for review in place_reviews:
                    db.session.delete(review)
                # Delete the place
                db.session.delete(place)

            # Finally delete the user
            db.session.delete(user)
            db.session.commit()

            return True
        except Exception as e:
            db.session.rollback()
            raise ValueError(f"Error deleting user: {str(e)}")

    # --- CRU Place ---
    def create_place(self, place_data):
        """Create a new place with owner and amenity resolution"""

        # 1. Find the owner by owner_id
        owner_id = place_data.get('owner_id')
        if not owner_id:
            raise ValueError("owner_id is required")

        owner = self.user_repo.get(owner_id)
        if not owner:
            raise ValueError(f"User with ID {owner_id} not found")

        # 2. Validate that all amenities exist
        amenity_ids = place_data.get('amenities', [])
        amenity_objects = []

        for amenity_id in amenity_ids:
            amenity = self.amenity_repo.get(amenity_id)
            if not amenity:
                raise ValueError(f"Amenity with ID {amenity_id} not found")
            amenity_objects.append(amenity)

        # 3. Create the place with actual objects (not IDs)
        place = Place(
            title=place_data['title'],
            description=place_data.get('description', ''),  # Optional field
            price=place_data['price'],
            latitude=place_data['latitude'],
            longitude=place_data['longitude'],
            owner=owner  # Pass the actual User object
        )

        # 4. Add amenities to the place
        for amenity in amenity_objects:
            place.add_amenity(amenity)

        # 5. Store the place in repository
        self.place_repo.add(place)

        return place

    def get_place(self, place_id):
        # Placeholder for logic to retrieve a place by ID, including associated owner and amenities
        place = self.place_repo.get(place_id)
        # Check if place exists and raise error if not
        if place is None:
            raise ValueError(f"Place with ID {place_id} not found")
        return place

    def get_all_places(self):
        if self.place_repo.get_all() is None:
            raise ValueError ("Places not found")
        return self.place_repo.get_all()

    def update_place(self, place_id, place_data):
        """Update place information, handling relationships properly"""
        # Check if place exists
        place = self.place_repo.get(place_id)
        if not place:
            raise ValueError(f"Place with ID {place_id} not found")

        # Handle amenities separately if they're in the update data
        if 'amenities' in place_data:
            amenity_ids = place_data.pop('amenities')  # Remove from place_data

            # Convert amenity IDs to actual amenity objects
            amenities = []
            for amenity_id in amenity_ids:
                amenity = self.amenity_repo.get(amenity_id)
                if not amenity:
                    raise ValueError(f"Amenity with ID {amenity_id} not found")
                amenities.append(amenity)

            # Update the amenities relationship
            place.amenities = amenities

        # Update other fields using the repository
        if place_data:  # Only call update if there are other fields to update
            self.place_repo.update(place_id, place_data)

        # If we only updated amenities, we still need to commit the changes
        if 'amenities' in locals():
            from app import db
            db.session.commit()

        return self.place_repo.get(place_id)


    # --- CRU Amenity ---
    def create_amenity(self, amenity_data):
        amenity = Amenity(**amenity_data)
        # Check if amenity is already existing
        check_amenity = self.amenity_repo.get(amenity.id)
        # If amenity does not exist, create new
        if check_amenity is None:
            self.amenity_repo.add(amenity)
            return amenity
        # Else, return an existing amenity
        else:
            return self.amenity_repo.get(amenity.id)

    def get_amenity(self, amenity_id):
        # If amenity_id doesn't exist
        check_id = self.amenity_repo.get(amenity_id)
        if check_id is None:
            raise ValueError (f"Amenity with ID {amenity_id} not found")
        return check_id

    def get_all_amenities(self):
        # If there are no amenities
        if self.amenity_repo.get_all() is None:
            raise ValueError ("Amenities not found")
        return self.amenity_repo.get_all()

    def update_amenity(self, amenity_id, amenity_data):
        # If amenity_id doesn't exist
        check_id = self.amenity_repo.get(amenity_id)
        if check_id is None:
            raise ValueError (f"Amenity with ID {amenity_id} not found")
        self.amenity_repo.update(amenity_id, amenity_data)
        return self.amenity_repo.get(amenity_id)

    # --- CRU Review ---
    def create_review(self, review_data):
        # Validate required fields
        required_fields = ['user_id', 'place_id', 'rating', 'text']
        for field in required_fields:
            if field not in review_data:
                raise ValueError(f"Missing field: {field}")

        # Validate user and place id
        user = self.user_repo.get(review_data['user_id'])
        if not user:
            raise ValueError("Invalid user_id")
        place = self.place_repo.get(review_data['place_id'])
        if not place:
            raise ValueError("Invalid place_id")

        # Validate rating
        rating = review_data['rating']
        if not isinstance(rating, (int, float)) or not (1 <= rating <= 5):
            raise ValueError("Rating must be between 1 and 5")

        # Create Review object with actual User and Place objects
        review = Review(
            text=review_data['text'],
            rating=rating,
            place=place,
            user=user
        )

        self.review_repo.add(review)
        return review

    def get_review(self, review_id):
        return self.review_repo.get(review_id)

    def get_all_reviews(self):
        return self.review_repo.get_all()

    def get_reviews_by_place(self, place_id):
        return [review for review in self.review_repo.get_all() if review.place.id == place_id]

    def update_review(self, review_id, review_data):
        review = self.review_repo.get(review_id)
        if not review:
            return None

        # Only updates change for text and rating
        if 'rating' in review_data:
            new_rating = review_data['rating']
            if not isinstance(new_rating, (int, float)) or not (1 <= new_rating <= 5):
                raise ValueError("Rating must be between 1 and 5")
            review.rating = new_rating

        if 'text' in review_data:
            review.text = review_data['text']

        return review

    def delete_review(self, review_id):
        review = self.review_repo.get(review_id)
        if review:
            self.review_repo.delete(review_id)
            return True
        return False