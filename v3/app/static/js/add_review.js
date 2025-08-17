// Add Review Page JavaScript

let currentPlaceId = null;
let currentUser = null;
let amenitiesData = {}; // Cache for amenity ID to name mapping

// Get place ID from URL
function getPlaceIdFromUrl() {
    const pathParts = window.location.pathname.split('/');
    const addIndex = pathParts.indexOf('add-review');
    if (addIndex > 0) {
        return pathParts[addIndex - 1];
    }
    return null;
}

// Navigation functions
function goBackToPlace() {
    if (currentPlaceId) {
        window.location.href = `/place/${currentPlaceId}`;
    } else {
        window.history.back();
    }
}

// Load place details (same as place_details.js but for add review page)
async function loadPlaceDetails() {
    currentPlaceId = getPlaceIdFromUrl();
    
    if (!currentPlaceId) {
        showError('Invalid place ID');
        return;
    }

    try {
        const response = await fetch(`/api/v3/places/${currentPlaceId}`, {
            credentials: 'include'
        });
        
        if (response.ok) {
            const place = await response.json();
            displayPlaceDetails(place);
        } else {
            showError('Failed to load place details');
        }
    } catch (error) {
        console.error('Error loading place:', error);
        showError('Error loading place details');
    }
}

// Display place details
function displayPlaceDetails(place) {
    // Hide loading and show content
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('placeDetailsSection').style.display = 'block';
    
    // Update place information
    document.getElementById('placeTitle').textContent = place.title;
    document.getElementById('placeImage').src = place.image;
    document.getElementById('placeImage').alt = place.title;
    // Load host information from API using owner_id
    if (place.owner_id) {
        loadHostInfo(place.owner_id);
    } else {
        document.getElementById('hostName').textContent = 'Unknown Host';
    }
    document.getElementById('placePrice').textContent = `${place.price} Gold`;
    document.getElementById('placeDescription').textContent = place.description;
    document.getElementById('placeLocation').textContent = `${place.latitude}, ${place.longitude}`;
    
    // Load amenities
    loadAmenities(place.amenities);
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

// Load amenities
function loadAmenities(amenities) {
    const amenitiesSection = document.getElementById('amenitiesSection');
    const amenitiesList = document.getElementById('amenitiesList');
    
    if (amenities && amenities.length > 0) {
        amenitiesSection.style.display = 'block';
        amenitiesList.innerHTML = '';
        
        amenities.forEach(amenityId => {
            const amenityTag = document.createElement('span');
            amenityTag.className = 'amenity-tag';
            // Get amenity name from cached data, fallback to ID if not found
            const amenityName = amenitiesData[amenityId] || amenityId;
            amenityTag.textContent = amenityName;
            amenitiesList.appendChild(amenityTag);
        });
    }
}

// Show error state
function showError(message) {
    document.getElementById('loadingState').style.display = 'none';
    document.getElementById('placeDetailsSection').style.display = 'none';
    document.getElementById('errorState').style.display = 'block';
    document.querySelector('#errorState p').textContent = message;
}

// Character counter for textarea
function setupCharacterCounter() {
    const textarea = document.getElementById('reviewText');
    const charCount = document.querySelector('.char-count');
    
    textarea.addEventListener('input', function() {
        const length = this.value.length;
        charCount.textContent = `${length}/1000 characters`;
        
        // Change color based on character count
        charCount.classList.remove('warning', 'danger');
        if (length > 900) {
            charCount.classList.add('danger');
        } else if (length > 800) {
            charCount.classList.add('warning');
        }
    });
}

// Form validation
function validateForm() {
    const rating = document.getElementById('reviewRating').value;
    const text = document.getElementById('reviewText').value.trim();
    
    let isValid = true;
    
    // Reset form groups
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error', 'success');
    });
    
    // Validate rating
    const ratingGroup = document.getElementById('reviewRating').closest('.form-group');
    if (!rating) {
        ratingGroup.classList.add('error');
        isValid = false;
    } else {
        ratingGroup.classList.add('success');
    }
    
    // Validate text
    const textGroup = document.getElementById('reviewText').closest('.form-group');
    if (!text || text.length < 10) {
        textGroup.classList.add('error');
        isValid = false;
    } else if (text.length > 1000) {
        textGroup.classList.add('error');
        isValid = false;
    } else {
        textGroup.classList.add('success');
    }
    
    return isValid;
}

// Show message
function showMessage(message, type = 'info') {
    const messageDiv = document.getElementById('reviewMessage');
    messageDiv.textContent = message;
    messageDiv.className = `review-message ${type}`;
    messageDiv.style.display = 'block';
    
    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 3000);
    }
}

// Submit review
async function submitReview(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        showMessage('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    if (!currentUser) {
        showMessage('You must be logged in to submit a review.', 'error');
        return;
    }
    
    const submitBtn = document.querySelector('.submit-review-btn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline-flex';
    
    const formData = {
        place_id: currentPlaceId,
        user_id: currentUser.id,
        rating: parseInt(document.getElementById('reviewRating').value),
        text: document.getElementById('reviewText').value.trim()
    };
    
    try {
        const response = await fetch('/api/v3/reviews/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            await response.json();
            showMessage('Review submitted successfully! Redirecting...', 'success');
            
            // Redirect back to place details after 2 seconds
            setTimeout(() => {
                window.location.href = `/place/${currentPlaceId}`;
            }, 2000);
        } else {
            const errorData = await response.json();
            showMessage(errorData.message || 'Failed to submit review. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        showMessage('An error occurred while submitting your review. Please try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
    }
}

// Load host information from API
async function loadHostInfo(ownerId) {
    try {
        const response = await fetch(`/api/v3/users/${ownerId}/public`, {
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

// Check authentication
async function checkAuthentication() {
    try {
        const response = await fetch('/api/v3/auth/protected', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (response.ok) {
            currentUser = await response.json();
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Auth check failed:', error);
        return false;
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', async function() {
    // Check if user is authenticated
    const isAuthenticated = await checkAuthentication();
    
    if (!isAuthenticated) {
        showMessage('You must be logged in to write a review. Redirecting to login...', 'error');
        setTimeout(() => {
            window.location.href = '/login';
        }, 3000);
        return;
    }
    
    // Load amenities data first, then place details that depend on it
    await loadAmenitiesData();
    
    // Load place details
    await loadPlaceDetails();
    
    // Setup form
    setupCharacterCounter();
    document.getElementById('addReviewForm').addEventListener('submit', submitReview);
    
    // Setup real-time validation
    document.getElementById('reviewRating').addEventListener('change', validateForm);
    document.getElementById('reviewText').addEventListener('input', validateForm);
});