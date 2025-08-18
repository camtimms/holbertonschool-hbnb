# HolbertonSchool HBnB v3 🐉 - D&D Adventure Lodging Platform

A fantasy-themed, full-stack web application for managing magical lodging accommodations in the realm of Dungeons & Dragons. This version combines the robust backend from v2 with an immersive frontend experience, featuring medieval aesthetics and fantasy-themed content.

## 🎲 What's New in v3

### Major Features
- **Complete Frontend Experience**: Fully functional web interface with D&D theming
- **Immersive Design**: Medieval-styled UI with custom fonts and fantasy imagery
- **Interactive User Interface**: Dynamic JavaScript functionality for seamless user experience
- **Fantasy-Themed Content**: D&D-inspired places, descriptions, and imagery
- **Responsive Design**: Mobile-friendly layout with custom CSS styling
- **Enhanced UX**: Intuitive navigation and user-friendly forms

### Frontend Components
- **Landing Page**: Welcoming homepage with fantasy map and adventure theming
- **User Authentication**: Styled login and registration forms
- **Place Management**: Interactive place listings and detailed views
- **Review System**: User-friendly review creation and display
- **Dynamic Content**: JavaScript-powered interactive elements

## 🏗️ Project Structure

```
v3/
├── app/
│   ├── __init__.py              # Flask app with template routing
│   ├── api/v3/                  # RESTful API endpoints
│   │   ├── auth.py             # Authentication endpoints
│   │   ├── users.py            # User management
│   │   ├── places.py           # Place management
│   │   ├── amenities.py        # Amenity management
│   │   └── reviews.py          # Review management
│   ├── models/                  # SQLAlchemy models
│   │   ├── users.py            # User model with authentication
│   │   ├── places.py           # Place model with relationships
│   │   ├── amenity.py          # Amenity model
│   │   └── reviews.py          # Review model
│   ├── services/               # Business logic layer
│   │   └── facade.py           # Service facade
│   ├── persistence/            # Data persistence layer
│   │   └── repository.py       # Repository pattern
│   ├── templates/              # Jinja2 HTML templates
│   │   ├── includes/           # Reusable components
│   │   │   ├── header.html     # Navigation header
│   │   │   └── footer.html     # Page footer
│   │   ├── index/              # Homepage templates
│   │   │   └── index.html      # Main landing page
│   │   ├── login/              # Authentication templates
│   │   │   ├── login.html      # User login form
│   │   │   └── registration.html # User registration form
│   │   └── place_details/      # Place-related templates
│   │       ├── place_details.html # Place information page
│   │       └── add_review.html    # Review creation form
│   └── static/                 # Static assets
│       ├── css/               # Custom stylesheets
│       │   ├── index_styles.css    # Homepage styling
│       │   ├── login_styles.css    # Authentication styling
│       │   ├── place_details_styles.css # Place page styling
│       │   ├── add_review_styles.css    # Review form styling
│       │   ├── nav.css         # Navigation styling
│       │   └── footer.css      # Footer styling
│       ├── js/                # JavaScript functionality
│       │   ├── index.js        # Homepage interactions
│       │   ├── login.js        # Login/registration logic
│       │   ├── place_details.js # Place page interactions
│       │   ├── add_review.js   # Review form handling
│       │   └── registration.js # Registration form logic
│       ├── fonts/             # Custom medieval fonts
│       │   ├── CELTG___.TTF    # Celtic styling
│       │   ├── LongaIberica.ttf # Medieval script
│       │   └── PoltawskiNowy.ttf # Fantasy text
│       └── images/            # Fantasy-themed imagery
│           ├── Dragon's Rest Tavern.jpg
│           ├── Cozy Woodland Cabin.jpg
│           ├── Ethereal Fae Retreat.jpg
│           ├── Royal Castle Quarters.jpg
│           ├── colourful map.jpeg
│           ├── hbnb-logo.png
│           └── questing_book.jpeg
├── config.py                   # Configuration settings
├── requirements.txt            # Python dependencies
├── run.py                     # Application entry point
└── load_sample_data.py        # Sample data loader
```

## 🚀 Features

### Frontend Features
- **Fantasy Theme**: Medieval-styled interface with D&D aesthetics
- **Responsive Design**: Works seamlessly across all devices
- **Interactive Elements**: Dynamic JavaScript functionality
- **Custom Fonts**: Medieval and fantasy-themed typography
- **Immersive Imagery**: Fantasy location photos and themed graphics
- **User-Friendly Navigation**: Intuitive menu system and page flow

### Backend Features (Inherited from v2)
- **SQLAlchemy ORM**: Full database persistence with MySQL support
- **User Authentication**: Secure bcrypt password hashing and session management
- **RESTful API**: Complete API with Flask-RESTX documentation
- **Role-Based Access**: Admin privileges and user ownership validation
- **Data Relationships**: Proper foreign keys and associations
- **Business Logic**: Advanced validation and constraint handling

### Security Features
- **CORS Support**: Secure cross-origin resource sharing
- **Session Management**: Flask-Session for secure user sessions
- **Password Hashing**: bcrypt encryption for user passwords
- **Authentication Required**: Protected endpoints and user validation
- **Data Validation**: Comprehensive input validation and sanitization

## 📋 Requirements

### System Requirements
- Python 3.x
- MySQL Server (or SQLite for development)
- Modern web browser

### Python Dependencies
- Flask (Web framework)
- Flask-RESTX (API documentation)
- Flask-SQLAlchemy (ORM)
- Flask-Bcrypt (Password hashing)
- Flask-Session (Session management)
- Flask-CORS (Cross-origin support)
- SQLAlchemy (Database toolkit)

## 🛠️ Installation

### 1. Navigate to Project Directory
```bash
cd /path/to/holbertonschool-hbnb/v3
```

### 2. Set Up Virtual Environment (Recommended)
```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Database Setup (Optional)
For production with MySQL:
```bash
# Create database
mysql -u root -p
CREATE DATABASE hbnb_v3_db;
GRANT ALL PRIVILEGES ON hbnb_v3_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 5. Load Sample Data (Optional)
```bash
python load_sample_data.py
```

### 6. Run the Application
```bash
python run.py
```

The application will start on `http://localhost:5000` with debug mode enabled.

## 🌐 Available Pages

### Frontend Interface
- **Homepage:** `http://localhost:5000/` - Fantasy-themed landing page with adventure map
- **User Login:** `http://localhost:5000/login` - Styled authentication interface
- **Registration:** `http://localhost:5000/register` - New user signup form
- **Place Details:** `http://localhost:5000/place/<place_id>` - Individual location information
- **Add Review:** `http://localhost:5000/place/<place_id>/add-review` - Review creation form

### API Documentation
- **API Docs:** `http://localhost:5000/api/v3/` - Interactive Swagger documentation

### API Endpoints
- **Authentication:** `/api/v3/auth/` - User login and session management
- **Users:** `/api/v3/users/` - User registration and profile management
- **Places:** `/api/v3/places/` - Accommodation listings and details
- **Reviews:** `/api/v3/reviews/` - User reviews and ratings
- **Amenities:** `/api/v3/amenities/` - Location features and services

## 🎯 Usage Examples

### Frontend Usage
1. **Browse Locations**: Visit the homepage to see available fantasy lodging
2. **Create Account**: Use the registration form to create a new user account
3. **Login**: Access your account through the styled login interface
4. **Explore Places**: Click on locations to view detailed information
5. **Leave Reviews**: Share your adventure experiences with other users

### API Usage
```bash
# Register a new adventurer
curl -X POST http://localhost:5000/api/v3/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Aragorn",
    "last_name": "Ranger",
    "email": "strider@middleearth.com",
    "password": "longMayHeReign123"
  }'

# Login
curl -X POST http://localhost:5000/api/v3/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "strider@middleearth.com",
    "password": "longMayHeReign123"
  }'

# Create a magical place
curl -X POST http://localhost:5000/api/v3/places/ \
  -H "Content-Type: application/json" \
  --cookie-jar cookies.txt --cookie cookies.txt \
  -d '{
    "title": "Dragon Slayer Inn",
    "description": "A cozy tavern for weary adventurers, complete with enchanted fireplaces and dragon-proof walls.",
    "price": 25.0,
    "latitude": 42.3601,
    "longitude": -71.0589
  }'
```

## 🧪 Testing

### Run Tests
```bash
# Test all components
python3 -m app.tests.test_models
python3 -m app.tests.test_facade

# Test in browser
# Navigate to http://localhost:5000 and test the frontend interface
```

## 🎨 Design Elements

### Visual Theme
- **Color Palette**: Earth tones, medieval browns, and fantasy accent colors
- **Typography**: Custom medieval fonts for headers and fantasy script for accents
- **Imagery**: Fantasy location photography and D&D-themed illustrations
- **Layout**: Scroll-like backgrounds and medieval border elements

### User Experience
- **Intuitive Navigation**: Clear menu structure and breadcrumb navigation
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Interactive Elements**: Hover effects, smooth transitions, and dynamic content
- **Accessibility**: Proper contrast ratios and semantic HTML structure

## 🔧 Configuration

### Environment Variables
```bash
export DATABASE_URL="mysql+mysqldb://root@localhost:3306/hbnb_v3_db"
export SECRET_KEY="your-secret-key-here"
export FLASK_ENV="development"
```

### Customization Options
- Modify CSS files in `app/static/css/` for styling changes
- Update JavaScript files in `app/static/js/` for functionality enhancements
- Replace images in `app/static/images/` for different fantasy themes
- Edit templates in `app/templates/` for layout modifications

## 📊 Version Comparison

| Feature | v1 | v2 | v3 |
|---------|----|----|----|
| **Data Storage** | In-memory | MySQL | MySQL |
| **Authentication** | None | API only | API + Frontend |
| **User Interface** | None | None | Full Frontend |
| **Theme** | Generic | Generic | D&D Fantasy |
| **Static Assets** | None | None | CSS/JS/Images |
| **Templates** | None | None | Jinja2 Templates |
| **User Experience** | API only | API only | Full Web App |
| **Styling** | None | None | Custom CSS |
| **JavaScript** | None | None | Interactive JS |

## 🚧 Future Enhancements

- **Map Integration**: Interactive fantasy world map
- **Quest System**: Adventure booking and quest management
- **Guild Features**: Group bookings for adventuring parties


## 📝 License

This project is part of the Holberton School curriculum.

---

**🐉 Embark on your next great adventure with HBnB v3! ⚔️**

