let currentUser = null;
let currentPlace = null;
let placeId = null;
let userHasReviewed = false;
let amenitiesData = {}; // Cache for amenity ID to name mapping


// Dynamic host name mapping based on place data
function getHostName(place) {
    // Map by title only - works regardless of database IDs
    const titleHostMap = {
        'Dragon\'s Rest Tavern': 'Guild Master Thorin',
        'Cozy Woodland Cabin': 'Forest Keeper Elaria',
        'Ethereal Fae Retreat': 'Fae Queen Titania',
        'Royal Castle Quarters': 'Castle Steward Magnus'
    };
    
    // Use title mapping or fallback to API loading
    return titleHostMap[place.title] || null;
}

// Load amenities data for ID to name mapping
async function loadAmenitiesData() {
    try {
        const response = await fetch('/api/v3/amenities/', {
            credentials: 'include'
        });
        
        if (response.ok) {
            const amenities = await response.json();
            // Create ID to name mapping
            amenities.forEach(amenity => {
                amenitiesData[amenity.id] = amenity.name;
            });
        }
    } catch (error) {
        console.error('Error loading amenities data:', error);
    }
}

// Get place ID from URL parameters or URL path
function getPlaceId() {
    // First try URL parameters (?id=)
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id');
    
    // If not found, try to extract from URL path (/place/123)
    if (!id) {
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length >= 3 && pathParts[1] === 'place') {
            id = pathParts[2];
        }
    }
    
    return id;
}

// Check authentication status
async function checkAuth() {
    try {
        const response = await fetch('/api/v3/auth/protected', {
            credentials: 'include'
        });

        if (response.ok) {
            currentUser = await response.json();
            document.getElementById('loginBtn').style.display = 'none';
            document.getElementById('userInfo').style.display = 'block';
            document.getElementById('welcomeMsg').textContent = `Welcome, ${currentUser.first_name}!`;

            // Show add review section if user is logged in and hasn't reviewed
            if (!userHasReviewed && currentPlace && currentPlace.owner_id !== currentUser.id) {
                document.getElementById('addReviewSection').style.display = 'block';
            }
        }
    } catch (error) {
        console.log('User not logged in');
    }
}

// Logout function
async function logout() {
    try {
        await fetch('/api/v3/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        currentUser = null;
        document.getElementById('loginBtn').style.display = 'block';
        document.getElementById('userInfo').style.display = 'none';
        document.getElementById('addReviewSection').style.display = 'none';
        window.location.reload();
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// Load place details
async function loadPlaceDetails() {
    try {
        console.log('Fetching place details from:', `/api/v3/places/${placeId}`);
        const response = await fetch(`/api/v3/places/${placeId}`, {
            credentials: 'include'
        });

        if (response.ok) {
            currentPlace = await response.json();
            console.log('Place details loaded:', currentPlace);
            displayPlaceDetails(currentPlace);
        } else {
            console.error('Failed to load place details, status:', response.status);
            showError();
        }
    } catch (error) {
        console.error('Error loading place:', error);
        showError();
    }
}

// Display place details
function displayPlaceDetails(place) {
    document.getElementById('placeTitle').textContent = place.title;
    document.getElementById('placeDescription').textContent = place.description;
    document.getElementById('placePrice').textContent = `${place.price} gold`;
    document.getElementById('placeLocation').textContent = `${place.latitude}, ${place.longitude}`;

    // Set host name based on place ID
    const hostMapping = {
        '1': 'Guild Master Thorin',      // Dragon's Rest Tavern
        '2': 'Forest Keeper Elaria',    // Cozy Woodland Cabin
        '3': 'Fae Queen Titania',       // Ethereal Fae Retreat
        '4': 'Castle Steward Magnus'    // Royal Castle Quarters
    };
    
    const hostName = hostMapping[place.id] || 'Guild Master';
    document.getElementById('hostName').textContent = hostName;

    // Set image using API-provided URL
    const imgEl = document.getElementById('placeImage');
    if (place.image && typeof place.image === 'string' && place.image.length > 0) {
        imgEl.src = place.image;
    } else {
        imgEl.src = '/static/images/hbnb-logo.png';
    }
    imgEl.alt = place.title || 'Place image';

    // Display amenities if they exist
    if (place.amenities && place.amenities.length > 0) {
        const amenitiesSection = document.getElementById('amenitiesSection');
        const amenitiesList = document.getElementById('amenitiesList');

        amenitiesList.innerHTML = place.amenities.map(amenityId => {
            // Get amenity name from cached data, fallback to ID if not found
            const amenityName = amenitiesData[amenityId] || amenityId;
            return `<span class="amenity-tag">${amenityName}</span>`;
        }).join('');

        amenitiesSection.style.display = 'block';
    }

    // Show place content
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('placeContent').style.display = 'block';
}

// Load host information from API
async function loadHostInfo(ownerId) {
    try {
        const response = await fetch(`/api/v3/users/${ownerId}`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const user = await response.json();
            document.getElementById('hostName').textContent = `${user.first_name} ${user.last_name}`;
        } else {
            document.getElementById('hostName').textContent = 'Unknown Host';
        }
    } catch (error) {
        console.error('Error loading host info:', error);
        document.getElementById('hostName').textContent = 'Unknown Host';
    }
}

// Load reviews for the place
async function loadReviews() {
    try {
        console.log('Fetching reviews from:', `/api/v3/reviews/places/${placeId}/reviews`);
        const response = await fetch(`/api/v3/reviews/places/${placeId}/reviews`, {
            credentials: 'include'
        });

        if (response.ok) {
            const reviews = await response.json();
            console.log('Reviews loaded:', reviews);
            displayReviews(reviews);
        } else {
            console.log('Reviews API response not ok, status:', response.status);
            // Show empty reviews if API fails
            displayReviews([]);
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
        // Show empty reviews on network error
        displayReviews([]);
    }
}

// Display reviews
function displayReviews(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    const reviewsCount = document.getElementById('reviewsCount');

    reviewsCount.textContent = `${reviews.length} review${reviews.length !== 1 ? 's' : ''}`;

    // Check if current user has already reviewed
    if (currentUser) {
        userHasReviewed = reviews.some(review => review.user_id === currentUser.id);

        // Show/hide add review section based on conditions
        const canReview = currentUser &&
                         !userHasReviewed &&
                         currentPlace &&
                         currentPlace.owner_id !== currentUser.id;

        if (canReview) {
            document.getElementById('addReviewSection').style.display = 'block';
        } else if (userHasReviewed) {
            document.getElementById('addReviewSection').innerHTML =
                '<div class="review-notice">You have already reviewed this place.</div>';
            document.getElementById('addReviewSection').style.display = 'block';
        }
    }

    if (reviews.length === 0) {
        reviewsList.innerHTML = '<div class="no-reviews">No reviews yet. Be the first to share your experience!</div>';
        return;
    }

    reviewsList.innerHTML = reviews.map(review => `
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-info">
                    <strong>${review.user.first_name} ${review.user.last_name}</strong>
                    <div class="review-rating">
                        ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
                    </div>
                </div>
            </div>
            <div class="review-text">
                ${review.text}
            </div>
        </div>
    `).join('');
}

// Submit review
async function submitReview(event) {
    event.preventDefault();

    if (!currentUser) {
        alert('Please log in to submit a review.');
        return;
    }

    const rating = parseInt(document.getElementById('reviewRating').value);
    const text = document.getElementById('reviewText').value;

    try {
        const response = await fetch('/api/v3/reviews/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                text: text,
                rating: rating,
                user_id: currentUser.id,
                place_id: placeId
            })
        });

        const result = await response.json();

        if (response.ok) {
            showReviewMessage('Review submitted successfully!', 'success');
            document.getElementById('reviewForm').reset();
            // Reload reviews
            setTimeout(() => {
                loadReviews();
            }, 1000);
        } else {
            showReviewMessage(result.error || 'Failed to submit review', 'error');
        }
    } catch (error) {
        showReviewMessage('Network error. Please try again.', 'error');
    }
}

// Show review message
function showReviewMessage(message, type) {
    const messageDiv = document.getElementById('reviewMessage');
    messageDiv.textContent = message;
    messageDiv.className = `review-message ${type}`;
    messageDiv.style.display = 'block';

    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// Show error state
function showError() {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('errorState').style.display = 'block';
}

// Go back to places list
function goBack() {
    window.location.href = '/'
}

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    placeId = getPlaceId();

    if (!placeId) {
        console.error('No place ID found in URL');
        showError();
        return;
    }

    console.log('Loading place details for ID:', placeId);
    
    try {
        // Load amenities data first, then place details that depend on it
        await loadAmenitiesData();
        
        // Load other components in parallel
        await Promise.all([
            checkAuth().catch(err => console.log('Auth check failed:', err)),
            loadPlaceDetails().catch(err => console.error('Failed to load place details:', err)),
            loadReviews().catch(err => console.error('Failed to load reviews:', err))
        ]);
    } catch (err) {
        console.error('Failed to initialize page:', err);
    }
});


