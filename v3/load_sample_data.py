#!/usr/bin/env python3
"""
Sample Data Loader for HBnB Application

This script loads sample data that matches the existing data in index.js and place_details.js
to ensure consistency between frontend mock data and actual database data.

Usage:
    python load_sample_data.py [--reset] [--verbose]

Arguments:
    --reset: Clear existing data before loading
    --verbose: Show detailed output
"""

import sys
import os
import argparse

# Add the app directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'app'))

from app import create_app, db
from app.services.facade import HBnBFacade

def clear_database():
    """Clear all existing data from the database"""
    print("🗑️  Clearing existing data...")

    # Clear tables in correct order to handle foreign key constraints
    db.session.execute(db.text('SET FOREIGN_KEY_CHECKS = 0;'))

    # Clear association table first
    db.session.execute(db.text('DELETE FROM place_amenity_asc;'))

    # Clear main tables
    db.session.execute(db.text('DELETE FROM reviews;'))
    db.session.execute(db.text('DELETE FROM places;'))
    db.session.execute(db.text('DELETE FROM amenities;'))
    db.session.execute(db.text('DELETE FROM users;'))

    db.session.execute(db.text('SET FOREIGN_KEY_CHECKS = 1;'))
    db.session.commit()

    print("✅ Database cleared successfully")

def load_users(facade, verbose=False):
    """Load sample users including place owners"""
    print("👥 Loading users...")

    users_data = [
        {
            'first_name': 'Guild Master',
            'last_name': 'Thorin',
            'email': 'guildmaster@dragonsrest.com',
            'password': 'tavern123',
            'is_admin': False
        },
        {
            'first_name': 'Forest Keeper',
            'last_name': 'Elaria',
            'email': 'elaria@woodland.com',
            'password': 'forest123',
            'is_admin': False
        },
        {
            'first_name': 'Fae Queen',
            'last_name': 'Titania',
            'email': 'titania@faerealm.com',
            'password': 'magic123',
            'is_admin': False
        },
        {
            'first_name': 'Castle Steward',
            'last_name': 'Magnus',
            'email': 'magnus@royalcastle.com',
            'password': 'castle123',
            'is_admin': False
        },
        {
            'first_name': 'Test',
            'last_name': 'User',
            'email': 'test@example.com',
            'password': 'password123',
            'is_admin': False
        }
    ]

    created_users = {}
    for user_data in users_data:
        try:
            db.session.rollback()  # Clear any pending transactions
            user = facade.create_user(user_data)
            created_users[f"{user_data['first_name']}_{user_data['last_name']}"] = user
            if verbose:
                print(f"  ✅ Created user: {user.first_name} {user.last_name}")
        except Exception as e:
            db.session.rollback()
            print(f"  ❌ Failed to create user {user_data['first_name']}: {e}")

    print(f"✅ Created {len(created_users)} users")
    return created_users

def load_amenities(facade, verbose=False):
    """Load sample amenities matching the JS data"""
    print("🏠 Loading amenities...")

    amenities_data = [
        {'name': 'Hot Meals'},
        {'name': 'Finest Ale'},
        {'name': 'Magical Warmth'},
        {'name': 'Storytelling Corner'},
        {'name': 'Stone Fireplace'},
        {'name': 'Forest Views'},
        {'name': 'Rustic Charm'},
        {'name': 'Wildlife Watching'},
        {'name': 'Magical Gardens'},
        {'name': 'Crystal Formations'},
        {'name': 'Otherworldly Experience'},
        {'name': 'Glowing Flora'},
        {'name': 'Royal Treatment'},
        {'name': 'Four-Poster Beds'},
        {'name': 'Castle Views'},
        {'name': 'Medieval Luxury'},
        {'name': 'Tapestries'}
    ]

    created_amenities = {}
    for amenity_data in amenities_data:
        try:
            db.session.rollback()  # Clear any pending transactions
            amenity = facade.create_amenity(amenity_data)
            created_amenities[amenity_data['name']] = amenity
            if verbose:
                print(f"  ✅ Created amenity: {amenity.name}")
        except Exception as e:
            db.session.rollback()
            print(f"  ❌ Failed to create amenity {amenity_data['name']}: {e}")

    print(f"✅ Created {len(created_amenities)} amenities")
    return created_amenities

def load_places(facade, users, amenities, verbose=False):
    """Load sample places matching index.js and place_details.js"""
    print("🏰 Loading places...")

    places_data = [
        {
            'title': 'Dragon\'s Rest Tavern',
            'description': 'A legendary tavern where heroes gather to share tales of their adventures. Features comfortable rooms, hearty meals, and the finest ale in the kingdom. The tavern is renowned for its magical warmth that keeps adventurers cozy even in the coldest nights.',
            'price': 75.0,
            'latitude': 42.3601,
            'longitude': -71.0589,
            'owner_key': 'Guild Master_Thorin',
            'amenity_names': ['Hot Meals', 'Finest Ale', 'Magical Warmth', 'Storytelling Corner']
        },
        {
            'title': 'Cozy Woodland Cabin',
            'description': 'A charming cabin nestled deep in the enchanted forest. Perfect for those seeking peace and tranquility away from the bustling kingdom. Features rustic furniture, a stone fireplace, and windows overlooking the mystical woods.',
            'price': 100.0,
            'latitude': 45.5152,
            'longitude': -122.6784,
            'owner_key': 'Forest Keeper_Elaria',
            'amenity_names': ['Stone Fireplace', 'Forest Views', 'Rustic Charm', 'Wildlife Watching']
        },
        {
            'title': 'Ethereal Fae Retreat',
            'description': 'A magical sanctuary where the veil between worlds is thin. This otherworldly retreat offers guests a chance to experience the mystical realm of the fae. Surrounded by glowing flowers and singing crystals.',
            'price': 200.0,
            'latitude': 51.5074,
            'longitude': -0.1278,
            'owner_key': 'Fae Queen_Titania',
            'amenity_names': ['Magical Gardens', 'Crystal Formations', 'Otherworldly Experience', 'Glowing Flora']
        },
        {
            'title': 'Royal Castle Quarters',
            'description': 'Luxurious accommodations within the walls of an ancient castle. Experience royal treatment with tapestries, four-poster beds, and views of the kingdom. Perfect for those who desire the finest in medieval luxury.',
            'price': 300.0,
            'latitude': 48.8566,
            'longitude': 2.3522,
            'owner_key': 'Castle Steward_Magnus',
            'amenity_names': ['Royal Treatment', 'Four-Poster Beds', 'Castle Views', 'Medieval Luxury', 'Tapestries']
        }
    ]

    created_places = {}
    for place_data in places_data:
        try:
            # Get owner by key
            owner = users.get(place_data['owner_key'])
            if not owner:
                print(f"  ❌ Owner not found for {place_data['title']}")
                continue

            # Get amenity IDs
            amenity_ids = []
            for amenity_name in place_data['amenity_names']:
                amenity = amenities.get(amenity_name)
                if amenity:
                    amenity_ids.append(amenity.id)
                elif verbose:
                    print(f"  ⚠️  Amenity '{amenity_name}' not found")

            # Create place data for facade
            create_data = {
                'title': place_data['title'],
                'description': place_data['description'],
                'price': place_data['price'],
                'latitude': place_data['latitude'],
                'longitude': place_data['longitude'],
                'owner_id': owner.id,
                'amenities': amenity_ids
            }

            place = facade.create_place(create_data)
            created_places[place_data['title']] = place
            if verbose:
                print(f"  ✅ Created place: {place.title} (${place.price})")
        except Exception as e:
            db.session.rollback()
            print(f"  ❌ Failed to create place {place_data['title']}: {e}")

    print(f"✅ Created {len(created_places)} places")
    return created_places

def load_reviews(facade, users, places, verbose=False):
    """Load sample reviews matching place_details.js"""
    print("⭐ Loading reviews...")

    # Create additional review users
    review_users_data = [
        {'first_name': 'Aragorn', 'last_name': 'Ranger', 'email': 'aragorn@ranger.com', 'password': 'ranger123'},
        {'first_name': 'Legolas', 'last_name': 'Greenleaf', 'email': 'legolas@elven.com', 'password': 'elven123'},
        {'first_name': 'Hermione', 'last_name': 'Granger', 'email': 'hermione@magic.com', 'password': 'magic123'},
        {'first_name': 'Druid', 'last_name': 'Wildwood', 'email': 'druid@nature.com', 'password': 'nature123'},
        {'first_name': 'Luna', 'last_name': 'Lovegood', 'email': 'luna@dreams.com', 'password': 'dreams123'},
        {'first_name': 'Gandalf', 'last_name': 'Grey', 'email': 'gandalf@wizard.com', 'password': 'wizard123'},
        {'first_name': 'Princess', 'last_name': 'Zelda', 'email': 'zelda@hyrule.com', 'password': 'triforce123'},
        {'first_name': 'Sir', 'last_name': 'Galahad', 'email': 'galahad@knight.com', 'password': 'knight123'}
    ]

    # Create review users
    review_users = {}
    for user_data in review_users_data:
        try:
            user = facade.create_user(user_data)
            review_users[f"{user_data['first_name']}_{user_data['last_name']}"] = user
            if verbose:
                print(f"  ✅ Created review user: {user.first_name} {user.last_name}")
        except Exception as e:
            if verbose:
                print(f"  ⚠️  Review user might already exist: {user_data['first_name']}")

    # Define reviews matching place_details.js sample data
    reviews_data = [
        # Dragon's Rest Tavern reviews
        {
            'place_title': 'Dragon\'s Rest Tavern',
            'user_key': 'Aragorn_Ranger',
            'text': 'Amazing place! The atmosphere was perfect for our adventuring party. The ale was indeed the finest in the kingdom and the storytelling corner made for great entertainment.',
            'rating': 5
        },
        {
            'place_title': 'Dragon\'s Rest Tavern',
            'user_key': 'Legolas_Greenleaf',
            'text': 'The magical warmth was incredible - kept us cozy all night. Great hot meals and the staff really knows how to treat adventurers.',
            'rating': 4
        },
        # Cozy Woodland Cabin reviews
        {
            'place_title': 'Cozy Woodland Cabin',
            'user_key': 'Hermione_Granger',
            'text': 'Perfect retreat from city life! The stone fireplace was so cozy and we saw amazing wildlife right from our windows.',
            'rating': 5
        },
        {
            'place_title': 'Cozy Woodland Cabin',
            'user_key': 'Druid_Wildwood',
            'text': 'Rustic charm at its finest. The forest views were breathtaking and so peaceful. Highly recommend for nature lovers.',
            'rating': 4
        },
        # Ethereal Fae Retreat reviews
        {
            'place_title': 'Ethereal Fae Retreat',
            'user_key': 'Luna_Lovegood',
            'text': 'Truly otherworldly experience! The glowing flowers were magical and the crystal formations sang beautiful melodies.',
            'rating': 5
        },
        {
            'place_title': 'Ethereal Fae Retreat',
            'user_key': 'Gandalf_Grey',
            'text': 'The magical gardens exceeded all expectations. Felt like stepping into another realm entirely. Absolutely enchanting!',
            'rating': 5
        },
        # Royal Castle Quarters reviews
        {
            'place_title': 'Royal Castle Quarters',
            'user_key': 'Princess_Zelda',
            'text': 'Royal treatment indeed! The four-poster bed was incredibly comfortable and the castle views were spectacular.',
            'rating': 5
        },
        {
            'place_title': 'Royal Castle Quarters',
            'user_key': 'Sir_Galahad',
            'text': 'Medieval luxury at its peak. The tapestries were beautiful and we felt like true royalty during our stay.',
            'rating': 4
        }
    ]

    created_reviews = []
    for review_data in reviews_data:
        try:
            # Get place
            place = places.get(review_data['place_title'])
            if not place:
                print(f"  ❌ Place not found: {review_data['place_title']}")
                continue

            # Get user
            user = review_users.get(review_data['user_key'])
            if not user:
                print(f"  ❌ User not found: {review_data['user_key']}")
                continue

            # Create review data for facade
            create_data = {
                'place_id': place.id,
                'user_id': user.id,
                'text': review_data['text'],
                'rating': review_data['rating']
            }

            review = facade.create_review(create_data)
            created_reviews.append(review)
            if verbose:
                print(f"  ✅ Created review: {user.first_name} -> {place.title} ({review.rating}⭐)")
        except Exception as e:
            print(f"  ❌ Failed to create review: {e}")

    print(f"✅ Created {len(created_reviews)} reviews")
    return created_reviews

def main():
    parser = argparse.ArgumentParser(description='Load sample data for HBnB application')
    parser.add_argument('--reset', action='store_true', help='Clear existing data before loading')
    parser.add_argument('--verbose', action='store_true', help='Show detailed output')
    args = parser.parse_args()

    # Create Flask app
    app = create_app()

    with app.app_context():
        print("🚀 HBnB Sample Data Loader")
        print("=" * 40)

        # Initialize facade
        facade = HBnBFacade()

        try:
            # Clear database if requested
            if args.reset:
                clear_database()

            # Load data in order
            users = load_users(facade, args.verbose)
            amenities = load_amenities(facade, args.verbose)
            places = load_places(facade, users, amenities, args.verbose)
            reviews = load_reviews(facade, users, places, args.verbose)

            print("=" * 40)
            print("🎉 Sample data loaded successfully!")
            print(f"📊 Summary:")
            print(f"   - {len(users)} users")
            print(f"   - {len(amenities)} amenities")
            print(f"   - {len(places)} places")
            print(f"   - {len(reviews)} reviews")
            print("\n💡 The data matches your frontend JavaScript files:")
            print("   - Places match index.js (Tavern, Cozy cabin, etc.)")
            print("   - Reviews match place_details.js sample data")
            print("   - All relationships properly established")

        except Exception as e:
            print(f"❌ Error loading sample data: {e}")
            return 1

    return 0

if __name__ == '__main__':
    exit(main())