#!/usr/bin/env python3
"""
Relationship Testing Script for HBnB
Run this after starting your Flask app to test SQLAlchemy relationships

Usage: python3 -m v2.app.tests.test_relationships
"""

import requests
import json

BASE_URL = "http://localhost:5000/api/v2"

def test_relationships():
    print("Testing HBnB Database Relationships")
    print("=" * 50)

    # Step 1: Create a user
    print("\nStep 1: Creating test user...")
    user_data = {
        "first_name": "Test",
        "last_name": "Owner",
        "email": "test.owner@example.com",
        "password": "testpass123"
    }

    user_response = requests.post(f"{BASE_URL}/users/", json=user_data)
    if user_response.status_code != 201:
        print(f"FAILED to create user: {user_response.text}")
        return

    user = user_response.json()
    user_id = user['id']
    print(f"SUCCESS: Created user: {user['first_name']} {user['last_name']} (ID: {user_id})")

    # Step 2: Create amenities
    print("\nStep 2: Creating test amenities...")
    amenity_data = {"name": "Test Wi-Fi"}
    amenity_response = requests.post(f"{BASE_URL}/amenities/", json=amenity_data)

    if amenity_response.status_code != 201:
        print(f"FAILED to create amenity: {amenity_response.text}")
        return

    amenity = amenity_response.json()
    amenity_id = amenity['id']
    print(f"SUCCESS: Created amenity: {amenity['name']} (ID: {amenity_id})")

    # Step 3: Create a place (tests User-Place relationship)
    print("\nStep 3: Creating test place...")
    place_data = {
        "title": "Test Relationship Place",
        "description": "Testing SQLAlchemy relationships",
        "price": 100.0,
        "latitude": 37.7749,
        "longitude": -122.4194,
        "owner_id": user_id,
        "amenities": [amenity_id]
    }

    place_response = requests.post(f"{BASE_URL}/places/", json=place_data)
    if place_response.status_code != 201:
        print(f"FAILED to create place: {place_response.text}")
        print("WARNING: This likely indicates Issue #1: Missing owner relationship")
        return

    place = place_response.json()
    place_id = place['id']
    print(f"SUCCESS: Created place: {place['title']} (ID: {place_id})")
    print(f"RELATIONSHIP TEST: Place owner_id = {place['owner_id']}")

    # Step 4: Create a review (tests User-Review and Place-Review relationships)
    print("\nStep 4: Creating test review...")
    review_data = {
        "text": "Testing the relationship functionality",
        "rating": 5,
        "user_id": user_id,
        "place_id": place_id
    }

    review_response = requests.post(f"{BASE_URL}/reviews/", json=review_data)
    if review_response.status_code != 201:
        print(f"FAILED to create review: {review_response.text}")
        print("WARNING: This likely indicates Issue #2: Mismatched back_populates")
        return

    review = review_response.json()
    review_id = review['id']
    print(f"SUCCESS: Created review: Rating {review['rating']}/5 (ID: {review_id})")
    print(f"RELATIONSHIP TEST: Review user_id = {review['user_id']}")
    print(f"RELATIONSHIP TEST: Review place_id = {review['place_id']}")

    # Step 5: Test getting reviews for a place (tests relationship queries)
    print("\nStep 5: Testing place-reviews relationship...")
    place_reviews_response = requests.get(f"{BASE_URL}/reviews/places/{place_id}/reviews")

    if place_reviews_response.status_code != 200:
        print(f"FAILED to get place reviews: {place_reviews_response.text}")
        return

    place_reviews = place_reviews_response.json()
    print(f"SUCCESS: Found {len(place_reviews)} reviews for place")

    if len(place_reviews) > 0:
        print(f"RELATIONSHIP TEST: Review-Place relationship working: {place_reviews[0]['text']}")

    # Step 6: Verify all relationships are properly serialized
    print("\nStep 6: Testing relationship data integrity...")

    # Get the place details
    place_detail_response = requests.get(f"{BASE_URL}/places/{place_id}")
    if place_detail_response.status_code == 200:
        place_detail = place_detail_response.json()
        print(f"SUCCESS: Place details retrieved successfully")
        print(f"RELATIONSHIP TEST: Amenities relationship: {len(place_detail.get('amenities', []))} amenities")
        print(f"RELATIONSHIP TEST: Owner relationship: owner_id = {place_detail.get('owner_id')}")
    else:
        print(f"FAILED to get place details: {place_detail_response.text}")

    print("\nRelationship testing completed!")
    print("\nIf all tests passed, your relationships are working correctly.")
    print("If any failed, check the issues mentioned in the error messages.")

def cleanup_test_data():
    """Optional: Add cleanup if you implement DELETE endpoints"""
    print("\nNote: Add cleanup functionality when DELETE endpoints are available")

if __name__ == "__main__":
    try:
        test_relationships()
    except requests.exceptions.ConnectionError:
        print("FAILED: Cannot connect to Flask app. Make sure it's running on http://localhost:5000")
    except Exception as e:
        print(f"FAILED: Test failed with error: {e}")