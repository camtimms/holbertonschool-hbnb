#!/usr/bin/python3
"""
Run from project root with module flag:
python3 -m app.models.test_models
"""
from app.models.places import Place
from app.models.users import User
from app.models.reviews import Review
from app.models.amenity import Amenity


""" Testing User Class """
def test_user_creation():
    user = User(first_name="John", last_name="Doe", email="john.doe@example.com")
    assert user.first_name == "John"
    assert user.last_name == "Doe"
    assert user.email == "john.doe@example.com"
    assert user.is_admin is False  # Default value
    print("User creation test passed!")


""" Testing Place and Review Class with Relationships """
def test_place_creation():
    owner = User(first_name="Alice", last_name="Smith", email="alice.smith@example.com")
    place = Place(title="Cozy Apartment", description="A nice place to stay", price=100, latitude=37.7749, longitude=-122.4194, owner=owner)

    # Adding a review
    review = Review(text="Great stay!", rating=5, place=place, user=owner)
    review.add_reply("Thankyou for your stay")
    place.add_review(review)

    assert place.title == "Cozy Apartment"
    assert place.price == 100
    assert len(place.reviews) == 1
    assert place.reviews[0].text == "Great stay!"
    print("Place creation and relationship test passed!")


""" Testing the Amenities Class """
def test_amenity_creation():
    amenity = Amenity(name="Wi-Fi")
    assert amenity.name == "Wi-Fi"
    print("Amenity creation test passed!")

""" Run function """
if __name__ == "__main__":
    test_user_creation()
    test_place_creation()
    test_amenity_creation()
