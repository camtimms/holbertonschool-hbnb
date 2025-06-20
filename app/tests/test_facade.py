#!/usr/bin/python3
"""
Simple Unit tests for the HBnB Facade layer
Run from project root with:
python3 -m app.tests.test_facade
"""
import unittest
from app.services.facade import HBnBFacade


class TestHBnBFacade(unittest.TestCase):

    def setUp(self):
        """Set up fresh facade instance for each test"""
        self.facade = HBnBFacade()

    # ==================== USER TESTS ====================

    def test_create_user(self):
        """Test creating a user"""
        user_data = {
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john@example.com'
        }
        user = self.facade.create_user(user_data)

        self.assertEqual(user.first_name, 'John')
        self.assertEqual(user.email, 'john@example.com')
        self.assertIsNotNone(user.id)

    def test_get_user(self):
        """Test getting a user by ID"""
        user = self.facade.create_user({
            'first_name': 'Jane',
            'last_name': 'Smith',
            'email': 'jane@example.com'
        })

        retrieved_user = self.facade.get_user(user.id)
        if retrieved_user:
            self.assertEqual(retrieved_user.email, 'jane@example.com')
        else:
            self.fail("User should have been found")

    def test_get_user_by_email(self):
        """Test getting a user by email"""
        user = self.facade.create_user({
            'first_name': 'Bob',
            'last_name': 'Wilson',
            'email': 'bob@example.com'
        })

        retrieved_user = self.facade.get_user_by_email('bob@example.com')
        if retrieved_user:
            self.assertEqual(retrieved_user.id, user.id)
        else:
            self.fail("User should have been found by email")

    # ==================== AMENITY TESTS ====================

    def test_create_amenity(self):
        """Test creating an amenity"""
        amenity_data = {'name': 'Wi-Fi'}
        amenity = self.facade.create_amenity(amenity_data)
        if amenity:
            self.assertEqual(amenity.name, 'Wi-Fi')
            self.assertIsNotNone(amenity.id)
        else:
            self.fail("Amenity should have been created")



    def test_get_amenity(self):
        """Test getting an amenity by ID"""
        amenity = self.facade.create_amenity({'name': 'Pool'})
        if amenity:
            self.assertEqual(amenity.name, 'Pool')
            self.assertIsNotNone(amenity.id)
        else:
            self.fail("Amenity should have been created")

        retrieved_amenity = self.facade.get_amenity(amenity.id)
        if retrieved_amenity:
            self.assertEqual(retrieved_amenity.name, 'Pool')
        else:
            self.fail("Amenity should have been found")

    def test_get_all_amenities(self):
        """Test getting all amenities"""
        self.facade.create_amenity({'name': 'Wi-Fi'})
        self.facade.create_amenity({'name': 'Pool'})

        amenities = self.facade.get_all_amenities()
        self.assertEqual(len(amenities), 2)

    def test_update_amenity(self):
        """Test updating an amenity"""
        amenity = self.facade.create_amenity({'name': 'Gym'})
        if amenity:
            self.assertEqual(amenity.name, 'Gym')
            self.assertIsNotNone(amenity.id)
        else:
            self.fail("Amenity should have been created")

        self.facade.update_amenity(amenity.id, {'name': 'Fitness Center'})
        updated_amenity = self.facade.get_amenity(amenity.id)


        if updated_amenity:
            self.assertEqual(updated_amenity.name, 'Fitness Center')
        else:
            self.fail("Updated amenity should have been found")

    # ==================== PLACE TESTS ====================

    def test_create_place(self):
        """Test creating a place"""
        owner = self.facade.create_user({
            'first_name': 'Alice',
            'last_name': 'Smith',
            'email': 'alice@example.com'
        })

        place_data = {
            'title': 'Cozy Apartment',
            'description': 'A nice place',
            'price': 100.0,
            'latitude': 37.7749,
            'longitude': -122.4194,
            'owner': owner.id
        }
        place = self.facade.create_place(place_data)

        self.assertEqual(place.title, 'Cozy Apartment')
        self.assertEqual(place.price, 100.0)
        self.assertEqual(place.owner.id, owner.id)

    def test_get_place(self):
        """Test getting a place by ID"""
        owner = self.facade.create_user({
            'first_name': 'Alice',
            'last_name': 'Smith',
            'email': 'alice@example.com'
        })

        place = self.facade.create_place({
            'title': 'Test Place',
            'description': 'A test place',
            'price': 150.0,
            'latitude': 40.7128,
            'longitude': -74.0060,
            'owner': owner.id
        })

        retrieved_place = self.facade.get_place(place.id)
        if retrieved_place:
            self.assertEqual(retrieved_place.title, 'Test Place')
        else:
            self.fail("Place should have been found")

    def test_get_all_places(self):
        """Test getting all places"""
        owner = self.facade.create_user({
            'first_name': 'Owner',
            'last_name': 'User',
            'email': 'owner@example.com'
        })

        self.facade.create_place({
            'title': 'Place 1',
            'description': 'First place',
            'price': 100.0,
            'latitude': 37.7749,
            'longitude': -122.4194,
            'owner': owner.id
        })

        self.facade.create_place({
            'title': 'Place 2',
            'description': 'Second place',
            'price': 200.0,
            'latitude': 40.7128,
            'longitude': -74.0060,
            'owner': owner.id
        })

        places = self.facade.get_all_places()
        self.assertEqual(len(places), 2)

    def test_update_place(self):
        """Test updating a place"""
        owner = self.facade.create_user({
            'first_name': 'Owner',
            'last_name': 'User',
            'email': 'owner@example.com'
        })

        place = self.facade.create_place({
            'title': 'Original Place',
            'description': 'Original description',
            'price': 100.0,
            'latitude': 37.7749,
            'longitude': -122.4194,
            'owner': owner.id
        })

        self.facade.update_place(place.id, {'title': 'Updated Place'})
        updated_place = self.facade.get_place(place.id)

        if updated_place:
            self.assertEqual(updated_place.title, 'Updated Place')
        else:
            self.fail("Updated place should have been found")

    # ==================== REVIEW TESTS ====================

    def test_create_review(self):
        """Test creating a review"""
        user = self.facade.create_user({
            'first_name': 'Reviewer',
            'last_name': 'User',
            'email': 'reviewer@example.com'
        })

        owner = self.facade.create_user({
            'first_name': 'Owner',
            'last_name': 'User',
            'email': 'owner@example.com'
        })

        place = self.facade.create_place({
            'title': 'Great Place',
            'description': 'Amazing stay',
            'price': 150.0,
            'latitude': 37.7749,
            'longitude': -122.4194,
            'owner': owner.id
        })

        review_data = {
            'user_id': user.id,
            'place_id': place.id,
            'rating': 5,
            'text': 'Excellent place!'
        }

        review = self.facade.create_review(review_data)
        if review:
            self.assertEqual(review.rating, 5)
            self.assertEqual(review.text, 'Excellent place!')
        else:
            self.fail("Review should have been created")

    def test_get_review(self):
        """Test getting a review by ID"""
        user = self.facade.create_user({
            'first_name': 'Reviewer',
            'last_name': 'User',
            'email': 'reviewer@example.com'
        })

        owner = self.facade.create_user({
            'first_name': 'Owner',
            'last_name': 'User',
            'email': 'owner@example.com'
        })

        place = self.facade.create_place({
            'title': 'Test Place',
            'description': 'A test place',
            'price': 100.0,
            'latitude': 37.7749,
            'longitude': -122.4194,
            'owner': owner.id
        })

        review = self.facade.create_review({
            'user_id': user.id,
            'place_id': place.id,
            'rating': 4,
            'text': 'Good place!'
        })

        if review:
            retrieved_review = self.facade.get_review(review.id)
            if retrieved_review:
                # Review exists - this is what we expect
                pass  # Could add more specific checks here if needed
            else:
                self.fail("Review should have been found")
        else:
            self.fail("Review should have been created")

    def test_get_all_reviews(self):
        """Test getting all reviews"""
        user = self.facade.create_user({
            'first_name': 'Reviewer',
            'last_name': 'User',
            'email': 'reviewer@example.com'
        })

        owner = self.facade.create_user({
            'first_name': 'Owner',
            'last_name': 'User',
            'email': 'owner@example.com'
        })

        place = self.facade.create_place({
            'title': 'Test Place',
            'description': 'A test place',
            'price': 100.0,
            'latitude': 37.7749,
            'longitude': -122.4194,
            'owner': owner.id
        })

        # Create two reviews
        self.facade.create_review({
            'user_id': user.id,
            'place_id': place.id,
            'rating': 5,
            'text': 'Excellent!'
        })

        self.facade.create_review({
            'user_id': user.id,
            'place_id': place.id,
            'rating': 4,
            'text': 'Very good!'
        })

        reviews = self.facade.get_all_reviews()
        self.assertEqual(len(reviews), 2)

    def test_get_reviews_by_place(self):
        """Test getting reviews for a specific place"""
        user = self.facade.create_user({
            'first_name': 'Reviewer',
            'last_name': 'User',
            'email': 'reviewer@example.com'
        })

        owner = self.facade.create_user({
            'first_name': 'Owner',
            'last_name': 'User',
            'email': 'owner@example.com'
        })

        place = self.facade.create_place({
            'title': 'Test Place',
            'description': 'A test place',
            'price': 100.0,
            'latitude': 37.7749,
            'longitude': -122.4194,
            'owner': owner.id
        })

        # Create reviews for this place
        self.facade.create_review({
            'user_id': user.id,
            'place_id': place.id,
            'rating': 5,
            'text': 'Excellent!'
        })

        self.facade.create_review({
            'user_id': user.id,
            'place_id': place.id,
            'rating': 4,
            'text': 'Very good!'
        })

        reviews = self.facade.get_reviews_by_place(place.id)
        self.assertEqual(len(reviews), 2)

    def test_update_review(self):
        """Test updating a review"""
        user = self.facade.create_user({
            'first_name': 'Reviewer',
            'last_name': 'User',
            'email': 'reviewer@example.com'
        })

        owner = self.facade.create_user({
            'first_name': 'Owner',
            'last_name': 'User',
            'email': 'owner@example.com'
        })

        place = self.facade.create_place({
            'title': 'Place',
            'description': 'A place',
            'price': 100.0,
            'latitude': 37.7749,
            'longitude': -122.4194,
            'owner': owner.id
        })

        review = self.facade.create_review({
            'user_id': user.id,
            'place_id': place.id,
            'rating': 3,
            'text': 'It was okay'
        })

        if review:
            updated_review = self.facade.update_review(review.id, {
                'rating': 5,
                'text': 'Actually, it was amazing!'
            })

            if updated_review:
                # Review was successfully updated
                pass  # Could add more specific checks here if needed
            else:
                self.fail("Review should have been updated and returned")
        else:
            self.fail("Review should have been created")

    def test_delete_review(self):
        """Test deleting a review"""
        user = self.facade.create_user({
            'first_name': 'Reviewer',
            'last_name': 'User',
            'email': 'reviewer@example.com'
        })

        owner = self.facade.create_user({
            'first_name': 'Owner',
            'last_name': 'User',
            'email': 'owner@example.com'
        })

        place = self.facade.create_place({
            'title': 'Place',
            'description': 'A place',
            'price': 100.0,
            'latitude': 37.7749,
            'longitude': -122.4194,
            'owner': owner.id
        })

        review = self.facade.create_review({
            'user_id': user.id,
            'place_id': place.id,
            'rating': 3,
            'text': 'Average stay'
        })

        if review:
            self.facade.delete_review(review.id)

            # Verify deletion
            retrieved_review = self.facade.get_review(review.id)
            if retrieved_review is None:
                # Review was successfully deleted - this is what we expect
                pass
            else:
                self.fail("Review should have been deleted and not found")
        else:
            self.fail("Review should have been created")


if __name__ == "__main__":
    unittest.main(verbosity=2)