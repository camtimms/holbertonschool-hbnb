# HolbertonSchool HBnB v3

A Flask-based web application with API endpoints and Jinja templating for the HBnB project. The application includes CORS configuration for secure static file serving.

## How to Run the Application

### Prerequisites
- Python 3.x installed
- pip package manager

### Installation Steps

1. **Clone/Navigate to the project directory:**
   ```bash
   cd /path/to/holbertonschool-hbnb/v3
   ```

2. **Install required dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application:**
   ```bash
   python run.py
   ```

The Flask development server will start on `http://localhost:5000` with debug mode enabled.

## Available Web Pages

Once the application is running, you can access the following pages:

### Frontend Pages
- **Home Page:** `http://localhost:5000/` - Main landing page
- **Login Page:** `http://localhost:5000/login` - User login interface
- **Registration Page:** `http://localhost:5000/register` - User registration form
- **Place Details:** `http://localhost:5000/place` or `http://localhost:5000/place/<place_id>` - Individual place details

### API Documentation
- **API Docs:** `http://localhost:5000/api/v3/` - Interactive API documentation (Swagger UI)

### API Endpoints
The application provides RESTful API endpoints at:
- **Users:** `/api/v3/users`
- **Places:** `/api/v3/places`
- **Reviews:** `/api/v3/reviews`
- **Amenities:** `/api/v3/amenities`
- **Authentication:** `/api/v3/auth`

## Project Structure

- `app/` - Main application package
  - `api/v3/` - API endpoints and controllers
  - `models/` - Database models
  - `templates/` - Jinja2 HTML templates
  - `static/` - CSS, JavaScript, and image files
  - `services/` - Business logic layer
  - `persistence/` - Data persistence layer
- `run.py` - Application entry point
- `config.py` - Configuration settings
- `requirements.txt` - Python dependencies

## Features

- **Flask Web Framework** with Jinja2 templating
- **RESTful API** with Flask-RESTX for documentation
- **CORS Support** for secure cross-origin requests
- **SQLAlchemy ORM** for database operations
- **User Authentication** with Flask-Bcrypt
- **Session Management** with Flask-Session
- **Static File Serving** for CSS, JavaScript, and images

