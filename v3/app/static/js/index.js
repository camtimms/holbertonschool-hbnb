// card scroll functions
function scrollBack() {
  const row = document.getElementById('cardRow');
  console.log('scrollLeft clicked, scrollLeft =', row.scrollLeft);
  row.scrollBy({ left: -360, behavior: 'smooth' });
}

function scrollRight() {
  const row = document.getElementById('cardRow');
  console.log('scrollRight clicked, scrollLeft =', row.scrollLeft);
  row.scrollBy({ left: 360, behavior: 'smooth' });
}

// Image mapping for places based on their titles
const getPlaceImage = (title) => {
    const imageMap = {
        "Dragon's Rest Tavern": "/static/images/place1.jpeg",
        "Cozy Woodland Cabin": "/static/images/place2.jpeg", 
        "Ethereal Fae Retreat": "/static/images/place3.jpeg",
        "Royal Castle Quarters": "/static/images/place4.jpeg"
    };
    return imageMap[title] || "/static/images/place1.jpeg";
};

// Calculate average rating from reviews
const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
};

let places = [];
const cardRow = document.getElementById('cardRow');

// Cache for amenities to avoid repeated API calls
let amenitiesCache = {};

// Load amenities and cache them
async function loadAmenities() {
    try {
        const response = await fetch('/api/v3/amenities/', {
            credentials: 'include'
        });
        
        if (response.ok) {
            const amenitiesList = await response.json();
            // Create a cache mapping amenity ID to name
            amenitiesList.forEach(amenity => {
                amenitiesCache[amenity.id] = amenity.name;
            });
            console.log('Amenities loaded:', Object.keys(amenitiesCache).length);
        }
    } catch (error) {
        console.error('Error loading amenities:', error);
    }
}

// Get amenity names from IDs
function getAmenityNames(amenityIds) {
    if (!amenityIds || !Array.isArray(amenityIds)) return [];
    return amenityIds.map(id => amenitiesCache[id] || 'Unknown').filter(name => name !== 'Unknown');
}

// Load reviews for a specific place
async function loadReviewsForPlace(placeId) {
    try {
        const response = await fetch(`/api/v3/reviews/places/${placeId}/reviews`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error(`Error loading reviews for place ${placeId}:`, error);
    }
    return [];
}

// Load places from API
async function loadPlaces() {
    // Show loading state
    showLoadingState();
    
    try {
        console.log('Fetching places from API...');
        
        // Load amenities first
        await loadAmenities();
        
        const response = await fetch('/api/v3/places/', {
            credentials: 'include'
        });

        if (response.ok) {
            const placesData = await response.json();
            console.log('Places loaded from API:', placesData);
            
            // Process each place to add amenity names and reviews
            places = await Promise.all(placesData.map(async (place) => {
                // Convert amenity IDs to names
                place.amenities = getAmenityNames(place.amenities);
                
                // Load reviews for this place
                place.reviews = await loadReviewsForPlace(place.id);
                
                return place;
            }));
            
            console.log('Places processed with amenities and reviews:', places);
            
            // Log summary for debugging
            console.log(`✅ Loaded ${places.length} places from database:`);
            places.forEach(place => {
                const reviewCount = place.reviews ? place.reviews.length : 0;
                const amenityCount = place.amenities ? place.amenities.length : 0;
                console.log(`  - ${place.title}: ${amenityCount} amenities, ${reviewCount} reviews`);
            });
            
            displayPlaces(places);
        } else {
            console.log('API not available, using fallback data');
            // Fallback to hardcoded data if API fails
            places = [
                { id: "1", title: "Dragon's Rest Tavern", description: "Cool spot #1", price: 75, amenities: ["Hot Meals", "Finest Ale", "Magical Warmth", "Storytelling Corner"], reviews: [] },
                { id: "2", title: "Cozy Woodland Cabin", description: "Awesome place #2", price: 100, amenities: ["Stone Fireplace", "Forest Views", "Rustic Charm", "Wildlife Watching"], reviews: [] },
                { id: "3", title: "Ethereal Fae Retreat", description: "Nice view #3", price: 200, amenities: ["Magical Gardens", "Crystal Formations", "Otherworldly Experience", "Glowing Flora"], reviews: [] },
                { id: "4", title: "Royal Castle Quarters", description: "Hidden gem #4", price: 300, amenities: ["Royal Treatment", "Four-Poster Beds", "Castle Views", "Medieval Luxury", "Tapestries"], reviews: [] }
            ];
            displayPlaces(places);
        }
    } catch (error) {
        console.error('Error loading places:', error);
        // Fallback data on error
        places = [
            { id: "1", title: "Dragon's Rest Tavern", description: "Cool spot #1", price: 75, amenities: ["Hot Meals", "Finest Ale", "Magical Warmth", "Storytelling Corner"], reviews: [] },
            { id: "2", title: "Cozy Woodland Cabin", description: "Awesome place #2", price: 100, amenities: ["Stone Fireplace", "Forest Views", "Rustic Charm", "Wildlife Watching"], reviews: [] },
            { id: "3", title: "Ethereal Fae Retreat", description: "Nice view #3", price: 200, amenities: ["Magical Gardens", "Crystal Formations", "Otherworldly Experience", "Glowing Flora"], reviews: [] },
            { id: "4", title: "Royal Castle Quarters", description: "Hidden gem #4", price: 300, amenities: ["Royal Treatment", "Four-Poster Beds", "Castle Views", "Medieval Luxury", "Tapestries"], reviews: [] }
        ];
        displayPlaces(places);
    }
}

// Show loading state
function showLoadingState() {
    cardRow.innerHTML = `
        <div class="loading-message" style="
            text-align: center; 
            padding: 2rem; 
            font-size: 1.1rem; 
            color: #5B692C; 
            background: rgba(91, 105, 44, 0.1); 
            border-radius: 8px; 
            margin: 2rem 0;
        ">
            🏰 Loading your adventure destinations...
        </div>
    `;
}

// Display places as cards
function displayPlaces(placesToShow) {
    cardRow.innerHTML = ''; // Clear existing cards
    
    if (placesToShow.length === 0) {
        cardRow.innerHTML = '<div class="no-places-message">No places found. Try adjusting your search or filters.</div>';
        return;
    }
    
    placesToShow.forEach(place => {

        const card = document.createElement('div');
        card.className = 'place-card';
        card.setAttribute('data-price', place.price);
        
        // Calculate average rating from reviews if available
        const avgRating = place.reviews ? calculateAverageRating(place.reviews) : 0;
        card.setAttribute('data-rating', avgRating);

        const img = document.createElement('img');
        img.src = getPlaceImage(place.title);
        img.alt = place.title;
        img.className = 'card-img';

        const amenitiesCount = place.amenities ? place.amenities.length : 0;
        const amenitiesCountSpan = document.createElement('span');
        amenitiesCountSpan.className = 'amenities-count';
        amenitiesCountSpan.textContent = `🔮 ${amenitiesCount} amenit${amenitiesCount === 1 ? 'y' : 'ies'}`;

        // Wrap title inside a content container
        const content = document.createElement('div');
        content.className = 'card-content';

        const title = document.createElement('h3');
        title.textContent = place.title;
        content.appendChild(title); // append title into content container

        const desc = document.createElement('p');
        desc.className = 'card-desc';
        desc.textContent = place.description;

        const bottomBar = document.createElement('div');
        bottomBar.className = 'card-bottom-bar';

        const price = document.createElement('span');
        price.textContent = `$${place.price}`;

        const rating = document.createElement('span');
        if (avgRating > 0) {
            rating.textContent = `⭐ ${avgRating}`;
        } else {
            rating.textContent = '⭐ New';
            rating.style.opacity = '0.7';
        }

        bottomBar.appendChild(price);
        bottomBar.appendChild(amenitiesCountSpan);
        bottomBar.appendChild(rating);

        // Assemble card
        card.appendChild(img);
        card.appendChild(content);     // title container
        card.appendChild(desc);        // description
        card.appendChild(bottomBar);   // price & rating

        card.addEventListener('click', () => {
            window.location.href = `place-detail.html?id=${place.id}`;
        });

        cardRow.appendChild(card);
    });
}

// search functionality
function handleSearch(event) {
    event.preventDefault(); // Prevent form from submitting and reloading

    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.toLowerCase();
    
    // Filter places based on search query
    const filteredPlaces = places.filter(place => {
        return place.title.toLowerCase().includes(query) || 
               place.description.toLowerCase().includes(query);
    });
    
    displayPlaces(filteredPlaces);
}



// dynamic filtering
document.getElementById('filter').addEventListener('change', function() {
    const maxPrice = Number(this.value);
    
    // Filter places based on price
    const filteredPlaces = places.filter(place => {
        return maxPrice === 0 || place.price <= maxPrice;
    });
    
    displayPlaces(filteredPlaces);
});

// login required
fetch('/api/v3/auth/protected', {
    method: 'GET',
    credentials: 'include' // send session cookie
})
.then(response => {
    if (response.status === 401) {
        console.log('Not logged in');
        // Redirect to login page or show login form
    } else {
        return response.json();
    }
})
.then(data => {
    if (data) {
        console.log('User is logged in:', data);
        // Update UI with user info
    }
})
.catch(err => console.error('Error checking login:', err));

// post request for login
fetch('/api/v3/auth/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    credentials: 'include', // Important for sessions
    body: JSON.stringify({
        email: 'user@example.com',
        password: 'mypassword'
    })
})
.then(res => res.json())
.then(data => {
    console.log(data);
    if (data.error) {
        alert('Login failed');
    } else {
        alert('Login successful');
    }
});
// Initialize page when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Load places from API
    loadPlaces();
    
    // Check authentication status
    fetch("/api/v3/auth/protected", {
        method: "GET",
        credentials: "include" // for session cookies
    })
    .then(res => {
        if (res.status === 200) {
            return res.json();
        } else {
            throw new Error("Not logged in");
        }
    })
    .then(user => {
        console.log("Logged in as:", user.first_name);
        document.getElementById("loginBtn").style.display = "none"; // hide login button
        document.getElementById("welcomeMsg").textContent = `Welcome, ${user.first_name}!`;
    })
    .catch(() => {
        console.log("User not logged in");
        document.getElementById("loginBtn").style.display = "block"; // show login button
    });
});

