# HolbertonSchool HBnB

A RESTful API for a vacation rental platform similar to Airbnb, built with Flask and Flask-RESTX. This application provides a complete backend system for managing users, places, amenities, and reviews.

## 🏗️ Project Structure

```
holbertonschool-hbnb/
├── app/
│   ├── __init__.py              # Flask app factory
│   ├── api/
│   │   └── v1/
│   │       ├── users.py         # User endpoints
│   │       ├── places.py        # Place endpoints
│   │       ├── amenities.py     # Amenity endpoints
│   │       └── reviews.py       # Review endpoints
│   ├── models/
│   │   ├── __init__.py          # BaseModel with UUID and timestamps
│   │   ├── users.py             # User model
│   │   ├── places.py            # Place model
│   │   ├── amenities.py         # Amenity model
│   │   └── reviews.py           # Review model
│   ├── persistence/
│   │   └── repository.py        # In-memory repository pattern
│   ├── services/
│   │   ├── __init__.py
│   │   └── facade.py            # Business logic facade
│   └── tests/
│       ├── test_models.py       # Model unit tests
│       └── test_facade.py       # Facade unit tests
├── config.py                    # Configuration settings
├── requirements.txt             # Python dependencies
├── run.py                      # Application entry point
└── README.md
```

## 🚀 Features

### Core Entities
- **Users**: Registration and management with email validation
- **Places**: Rental properties with geolocation and pricing
- **Amenities**: Property features (Wi-Fi, Pool, etc.)
- **Reviews**: User feedback with ratings (1-5 stars)

### API Capabilities
- Full CRUD operations for all entities
- Input validation and error handling
- Relationship management between entities
- RESTful endpoints with proper HTTP status codes
- Interactive API documentation via Swagger UI

## 📋 Requirements

- Python 3.x
- Flask
- Flask-RESTX

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/camtimms/holbertonschool-hbnb.git
   cd holbertonschool-hbnb
   ```

2. **Create a virtual environment**
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python run.py
   ```

The application will start on `http://localhost:5000` with debug mode enabled.

## 📖 API Documentation

Once the application is running, visit `http://localhost:5000/api/v1/` to access the interactive Swagger documentation.

### API Endpoints

#### Users
- `POST /api/v1/users/` - Create a new user
- `GET /api/v1/users/{user_id}` - Get user details

#### Places
- `POST /api/v1/places/` - Create a new place
- `GET /api/v1/places/` - Get all places
- `GET /api/v1/places/{place_id}` - Get place details
- `PUT /api/v1/places/{place_id}` - Update place information

#### Amenities
- `POST /api/v1/amenities/` - Create a new amenity
- `GET /api/v1/amenities/` - Get all amenities
- `GET /api/v1/amenities/{amenity_id}` - Get amenity details
- `PUT /api/v1/amenities/{amenity_id}` - Update amenity information

#### Reviews
- `POST /api/v1/reviews/` - Create a new review
- `GET /api/v1/reviews/` - Get all reviews
- `GET /api/v1/reviews/{review_id}` - Get review details
- `PUT /api/v1/reviews/{review_id}` - Update review information
- `DELETE /api/v1/reviews/{review_id}` - Delete a review
- `GET /api/v1/reviews/places/{place_id}/reviews` - Get reviews for a specific place

### Example API Usage

#### Create a User
```bash
curl -X POST http://localhost:5000/api/v1/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com"
  }'
```

#### Create a Review
```bash
curl -X POST http://localhost:5000/api/v1/reviews/ \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Amazing place to stay!",
    "rating": 5,
    "user_id": "user-uuid-here",
    "place_id": "place-uuid-here"
  }'
```

## 🧪 Testing

Run the unit tests to ensure everything is working correctly:

```bash
# Test models
python3 -m app.tests.test_models

# Test facade layer
python3 -m app.tests.test_facade
```

## 🏛️ Architecture

### Design Patterns Used

1. **Repository Pattern**: Abstracts data access with `InMemoryRepository`
2. **Facade Pattern**: `HBnBFacade` provides a simplified interface to the business logic
3. **Factory Pattern**: Flask app creation using the factory pattern
4. **Model-View-Controller (MVC)**: Clear separation of concerns

### Key Components

- **Models**: Data entities with validation and business rules
- **Repository**: Data persistence abstraction (currently in-memory)
- **Facade**: Business logic coordination and validation
- **API Layer**: RESTful endpoints with documentation

## 🔧 Configuration

The application uses configuration classes in `config.py`:

- **DevelopmentConfig**: Debug mode enabled
- Environment variables supported for sensitive data

## 🚧 Current Limitations

- **In-Memory Storage**: Data is not persisted between application restarts
- **Authentication**: No user authentication system implemented yet
- **File Upload**: No support for image uploads for places
- **Search**: No search functionality for places or amenities

## 📝 License

This project is part of the Holberton School curriculum.

## 👨‍💻 Development Notes

- All models inherit from `BaseModel` which provides UUID generation and timestamps
- Input validation is implemented at both the model and API levels
- The facade pattern centralizes business logic and makes the codebase more maintainable
- Comprehensive unit tests ensure code reliability

## 🐛 Troubleshooting

### Common Issues

1. **Import Errors**: Ensure you're running from the project root with the module flag
2. **Port Conflicts**: Change the port in `run.py` if 5000 is already in use
3. **Missing Dependencies**: Run `pip install -r requirements.txt` to install all requirements

### Getting Help

If you encounter issues, check the test files for usage examples or refer to the interactive API documentation at `/api/v1/` when the application is running.
