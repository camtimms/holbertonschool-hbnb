# HolbertonSchool HBnB v2

A fully-featured RESTful API for a vacation rental platform similar to Airbnb, built with Flask, Flask-RESTX, and SQLAlchemy. This application provides a complete backend system for managing users, places, amenities, and reviews with authentication, database persistence, and role-based access control.

## 🚀 What's New in v2

### Major Improvements
- **Database Persistence**: Migrated from in-memory storage to SQLAlchemy with MySQL support
- **User Authentication**: Secure login system with password hashing using bcrypt
- **Session Management**: Flask-Session for secure user sessions
- **Role-Based Access**: Admin privileges for amenity management
- **Enhanced Security**: Protected endpoints with authentication decorators
- **Relationship Management**: Proper SQLAlchemy relationships between entities
- **Data Integrity**: Database constraints and cascading deletions

## 🏗️ Project Structure

```
holbertonschool-hbnb/
├── v2/                          # Version 2 (Current)
│   ├── app/
│   │   ├── __init__.py          # Flask app factory with SQLAlchemy
│   │   ├── api/
│   │   │   └── v2/
│   │   │       ├── auth.py      # Authentication endpoints
│   │   │       ├── users.py     # User management endpoints
│   │   │       ├── places.py    # Place management endpoints
│   │   │       ├── amenities.py # Amenity management endpoints
│   │   │       └── reviews.py   # Review management endpoints
│   │   ├── models/
│   │   │   ├── __init__.py      # SQLAlchemy BaseModel
│   │   │   ├── users.py         # User model with authentication
│   │   │   ├── places.py        # Place model with relationships
│   │   │   ├── amenity.py       # Amenity model
│   │   │   └── reviews.py       # Review model
│   │   ├── persistence/
│   │   │   └── repository.py    # SQLAlchemy repository pattern
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   └── facade.py        # Enhanced business logic facade
│   │   └── tests/
│   │       ├── test_models.py           # Model unit tests
│   │       ├── test_facade.py           # Facade unit tests
│   │       └── test_relationships.py    # Database relationship tests
│   ├── config.py                # Database and app configuration
│   ├── requirements.txt         # Updated dependencies
│   ├── run.py                  # Application entry point
│   └── README.md               # This file
└── v1/                         # Version 1 (In-memory)
    └── ...                     # Previous implementation
```

## 🚀 Features

### Core Entities
- **Users**: Secure registration and authentication with password hashing
- **Places**: Rental properties with geolocation, pricing, and amenity associations
- **Amenities**: Property features with admin-only management
- **Reviews**: User feedback with ownership validation and duplicate prevention

### Security Features
- **Password Hashing**: Secure bcrypt password storage
- **Session Authentication**: Flask-Session for secure user sessions
- **Role-Based Access**: Admin privileges for amenity management
- **Ownership Validation**: Users can only modify their own content
- **Business Logic Protection**: Prevents self-reviews and duplicate reviews

### Database Features
- **SQLAlchemy ORM**: Full object-relational mapping
- **MySQL Integration**: Production-ready database support
- **Relationship Management**: Proper foreign keys and associations
- **Data Integrity**: Constraints and validation at the database level
- **Migration Support**: Database schema management

## 📋 Requirements

### System Requirements
- Python 3.x
- MySQL Server
- Virtual environment (recommended)

### Python Dependencies
- Flask
- Flask-RESTX
- Flask-SQLAlchemy
- Flask-Bcrypt
- Flask-Session
- SQLAlchemy
- MySQL connector

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/camtimms/holbertonschool-hbnb.git
cd holbertonschool-hbnb/v2
```

### 2. Set Up MySQL Database
```bash
# Create database
mysql -u root -p
CREATE DATABASE hbnb_db;
GRANT ALL PRIVILEGES ON hbnb_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 3. Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Configure Environment Variables (Optional)
```bash
export DATABASE_URL="mysql+mysqldb://root@localhost:3306/hbnb_db"
export SECRET_KEY="your-secret-key-here"
```

### 6. Run the Application
```bash
python run.py
```

The application will start on `http://localhost:5000` with automatic database table creation.

## 📖 API Documentation

Visit `http://localhost:5000/api/v2/` for interactive Swagger documentation.

### Authentication Flow

#### 1. Register a User
```bash
curl -X POST http://localhost:5000/api/v2/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }'
```

#### 2. Login
```bash
curl -X POST http://localhost:5000/api/v2/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securepassword123"
  }'
```

#### 3. Access Protected Endpoints
```bash
# After login, session cookies are automatically handled
curl -X GET http://localhost:5000/api/v2/auth/protected \
  --cookie-jar cookies.txt --cookie cookies.txt
```

### API Endpoints

#### Authentication
- `POST /api/v2/auth/login` - User login
- `GET /api/v2/auth/protected` - Test protected access

#### Users
- `POST /api/v2/users/` - Register a new user
- `GET /api/v2/users/{user_id}` - Get user details (authenticated)
- `PUT /api/v2/users/{user_id}` - Update user information (owner/admin only)
- `DELETE /api/v2/users/{user_id}` - Delete user account (owner/admin only)

#### Places
- `POST /api/v2/places/` - Create a new place (authenticated)
- `GET /api/v2/places/` - Get all places
- `GET /api/v2/places/{place_id}` - Get place details
- `PUT /api/v2/places/{place_id}` - Update place (owner only)

#### Amenities
- `POST /api/v2/amenities/` - Create amenity (admin only)
- `GET /api/v2/amenities/` - Get all amenities
- `GET /api/v2/amenities/{amenity_id}` - Get amenity details
- `PUT /api/v2/amenities/{amenity_id}` - Update amenity (admin only)

#### Reviews
- `POST /api/v2/reviews/` - Create review (authenticated, no self-reviews)
- `GET /api/v2/reviews/` - Get all reviews
- `GET /api/v2/reviews/{review_id}` - Get review details
- `PUT /api/v2/reviews/{review_id}` - Update review (owner only)
- `DELETE /api/v2/reviews/{review_id}` - Delete review (owner only)
- `GET /api/v2/reviews/places/{place_id}/reviews` - Get reviews for a place

## 🧪 Testing

### Run Unit Tests
```bash
# Test models
python3 -m app.tests.test_models

# Test facade layer
python3 -m app.tests.test_facade

# Test database relationships
python3 -m app.tests.test_relationships
```

### Test Authentication Flow
```bash
# Start the application first, then run relationship tests
python3 -m app.tests.test_relationships
```

## 🏛️ Architecture

### Design Patterns
1. **Repository Pattern**: Database abstraction with SQLAlchemyRepository
2. **Facade Pattern**: Centralized business logic coordination
3. **Factory Pattern**: Flask application factory with configuration
4. **Decorator Pattern**: Authentication and authorization decorators

### Key Components
- **Models**: SQLAlchemy ORM models with relationships and validation
- **Repository Layer**: Database operations abstraction
- **Facade Layer**: Business logic and validation coordination
- **API Layer**: RESTful endpoints with authentication
- **Authentication**: Session-based auth with bcrypt password hashing

### Database Relationships
- **User ↔ Place**: One-to-many (owner relationship)
- **User ↔ Review**: One-to-many (reviewer relationship)
- **Place ↔ Review**: One-to-many (place reviews)
- **Place ↔ Amenity**: Many-to-many (place features)

## 🔧 Configuration

### Database Configuration
The application supports MySQL with configurable connection strings:

```python
# Default configuration in config.py
SQLALCHEMY_DATABASE_URI = 'mysql+mysqldb://root@localhost:3306/hbnb_db'
```

### Environment Variables
- `DATABASE_URL`: Custom database connection string
- `SECRET_KEY`: Flask secret key for sessions

## 🔐 Security Features

### Authentication
- **Password Hashing**: bcrypt with salt rounds
- **Session Management**: Server-side session storage
- **Login Required**: Decorator-based endpoint protection

### Authorization
- **Ownership Validation**: Users can only modify their own content
- **Role-Based Access**: Admin-only features for amenity management
- **Business Rules**: No self-reviews, no duplicate reviews per user/place

### Data Protection
- **Input Validation**: Comprehensive model-level validation
- **SQL Injection Prevention**: SQLAlchemy ORM parameterized queries
- **Error Handling**: Graceful error responses without data leakage

## 🚧 Current Limitations & Future Enhancements

### Current Limitations
- **File Upload**: No image upload support for places
- **Search & Filtering**: No advanced search functionality
- **Email Verification**: No email confirmation on registration
- **Password Reset**: No password recovery mechanism
- **Rate Limiting**: No API rate limiting implemented

### Planned Enhancements
- **JWT Authentication**: Token-based authentication option
- **Advanced Search**: Full-text search and filtering
- **File Management**: Image upload and storage
- **Email Integration**: Verification and notifications
- **Caching Layer**: Redis integration for performance
- **API Versioning**: Multiple API versions support

## 📊 Comparison with v1

| Feature | v1 (In-Memory) | v2 (Database) |
|---------|----------------|---------------|
| Data Storage | In-memory (temporary) | MySQL (persistent) |
| Authentication | None | bcrypt + sessions |
| User Management | Basic CRUD | Full auth + permissions |
| Data Relationships | Object references | SQLAlchemy relationships |
| Security | None | Role-based access control |
| Business Logic | Basic validation | Advanced rules + constraints |
| Testing | Unit tests only | Unit + integration tests |

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Check MySQL is running
   sudo systemctl status mysql

   # Verify database exists
   mysql -u root -p -e "SHOW DATABASES;"
   ```

2. **Import Errors**
   ```bash
   # Ensure running from project root
   python3 -m app.tests.test_models
   ```

3. **Authentication Issues**
   ```bash
   # Clear browser cookies/session data
   # Check session configuration in __init__.py
   ```

4. **Port Conflicts**
   ```bash
   # Change port in run.py if 5000 is in use
   app.run(debug=True, port=5001)
   ```

### Development Tips
- Use the relationship test script to verify database setup
- Check Swagger UI for interactive API testing
- Monitor Flask debug output for detailed error information
- Use MySQL Workbench or similar tools for database inspection

## 📝 License

This project is part of the Holberton School curriculum.

## 👨‍💻 Development Team

**Architecture & Implementation:**
- Repository Pattern implementation
- SQLAlchemy model design
- Authentication system
- API endpoint security
- Database relationship management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests to ensure compatibility
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📞 Support

For development questions or issues:
1. Check the troubleshooting section above
2. Review the test files for usage examples
3. Examine the Swagger documentation at `/api/v2/`
4. Run the relationship test script for database issues

---

**Built with ❤️ for learning modern web development patterns and secure API design.**