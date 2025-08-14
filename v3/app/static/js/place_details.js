let currentUser = null;
let currentPlace = null;
let placeId = null;
let userHasReviewed = false;

// Get place ID from URL parameters
function getPlaceId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
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
        const response = await fetch(`/api/v3/places/${placeId}`, {
            credentials: 'include'
        });

        if (response.ok) {
            currentPlace = await response.json();
            displayPlaceDetails(currentPlace);
        } else {
            // Sample data for development
            currentPlace = {
                id: placeId,
                title: 'Dragon\'s Rest Tavern',
                description: 'A legendary tavern where heroes gather to share tales of their adventures. Features comfortable rooms, hearty meals, and the finest ale in the kingdom. The tavern is renowned for its magical warmth that keeps adventurers cozy even in the coldest nights.',
                price: 75,
                latitude: 42.3601,
                longitude: -71.0589,
                owner_id: 'sample-owner-id',
                amenities: ['Wi-Fi', 'Hot Meals', 'Stables', 'Magical Protection']
            };
            displayPlaceDetails(currentPlace);
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
    document.getElementById('hostName').textContent = 'Guild Master'; // Will be replaced with actual owner name

    // Set random image
    const imageNum = Math.floor(Math.random() * 4) + 1;
    document.getElementById('placeImage').src = `/static/images/place${imageNum}.jpeg`;
    document.getElementById('placeImage').alt = place.title;

    // Display amenities if they exist
    if (place.amenities && place.amenities.length > 0) {
        const amenitiesSection = document.getElementById('amenitiesSection');
        const amenitiesList = document.getElementById('amenitiesList');

        amenitiesList.innerHTML = place.amenities.map(amenity =>
            `<span class="amenity-tag">${amenity}</span>`
        ).join('');

        amenitiesSection.style.display = 'block';
    }

    // Show place content
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('placeContent').style.display = 'block';
}

// Load reviews for the place
async function loadReviews() {
    try {
        const response = await fetch(`/api/v3/reviews/places/${placeId}/reviews`, {
            credentials: 'include'
        });

        if (response.ok) {
            const reviews = await response.json();
            displayReviews(reviews);
        } else {
            // Sample reviews for development
            const sampleReviews = [
                {
                    id: '1',
                    text: 'Amazing place! The atmosphere was perfect for our adventuring party. The beds were comfortable and the food was outstanding.',
                    rating: 5,
                    user: { first_name: 'Aragorn', last_name: 'Ranger' }
                },
                {
                    id: '2',
                    text: 'Good location and decent amenities. The magical protection made us feel safe during our stay.',
                    rating: 4,
                    user: { first_name: 'Gandalf', last_name: 'Grey' }
                }
            ];
            displayReviews(sampleReviews);
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
        document.getElementById('reviewsList').innerHTML = '<div class="error">Failed to load reviews.</div>';
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
    window.history.back();
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    placeId = getPlaceId();

    if (!placeId) {
        showError();
        return;
    }

    checkAuth();
    loadPlaceDetails();
    loadReviews();
});