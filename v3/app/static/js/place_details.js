let currentUser = null;
let currentPlace = null;
let placeId = null;
let userHasReviewed = false;

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
            console.log('API response not ok, status:', response.status);
            console.log('Using sample data for development');
            
            // Sample data that matches the places from scripts.js
            const samplePlaces = {
                '1': {
                    id: '1',
                    title: 'Dragon\'s Rest Tavern',
                    description: 'A legendary tavern where heroes gather to share tales of their adventures. Features comfortable rooms, hearty meals, and the finest ale in the kingdom. The tavern is renowned for its magical warmth that keeps adventurers cozy even in the coldest nights. Cool spot #1',
                    price: 75,
                    latitude: 42.3601,
                    longitude: -71.0589,
                    owner_id: 'guild-master-1',
                    amenities: ['Hot Meals', 'Finest Ale', 'Magical Warmth', 'Storytelling Corner']
                },
                '2': {
                    id: '2',
                    title: 'Cozy Woodland Cabin',
                    description: 'A charming cabin nestled deep in the enchanted forest. Perfect for those seeking peace and tranquility away from the bustling kingdom. Features rustic furniture, a stone fireplace, and windows overlooking the mystical woods. Awesome place #2',
                    price: 100,
                    latitude: 45.5152,
                    longitude: -122.6784,
                    owner_id: 'forest-keeper-2',
                    amenities: ['Stone Fireplace', 'Forest Views', 'Rustic Charm', 'Wildlife Watching']
                },
                '3': {
                    id: '3',
                    title: 'Ethereal Fae Retreat',
                    description: 'A magical sanctuary where the veil between worlds is thin. This otherworldly retreat offers guests a chance to experience the mystical realm of the fae. Surrounded by glowing flowers and singing crystals. Nice view #3',
                    price: 200,
                    latitude: 51.5074,
                    longitude: -0.1278,
                    owner_id: 'fae-queen-3',
                    amenities: ['Magical Gardens', 'Crystal Formations', 'Otherworldly Experience', 'Glowing Flora']
                },
                '4': {
                    id: '4',
                    title: 'Royal Castle Quarters',
                    description: 'Luxurious accommodations within the walls of an ancient castle. Experience royal treatment with tapestries, four-poster beds, and views of the kingdom. Perfect for those who desire the finest in medieval luxury. Hidden gem #4',
                    price: 300,
                    latitude: 48.8566,
                    longitude: 2.3522,
                    owner_id: 'castle-steward-4',
                    amenities: ['Royal Treatment', 'Four-Poster Beds', 'Castle Views', 'Medieval Luxury', 'Tapestries']
                }
            };
            
            // Use sample data based on place ID, default to first place if ID not found
            currentPlace = samplePlaces[placeId] || samplePlaces['1'];
            displayPlaceDetails(currentPlace);
        }
    } catch (error) {
        console.error('Error loading place:', error);
        console.log('Falling back to sample data due to network error');
        // Even if there's a network error, show sample data instead of error page
        const samplePlaces = {
            '1': {
                id: '1',
                title: 'Dragon\'s Rest Tavern',
                description: 'A legendary tavern where heroes gather to share tales of their adventures. Features comfortable rooms, hearty meals, and the finest ale in the kingdom. Cool spot #1',
                price: 75,
                latitude: 42.3601,
                longitude: -71.0589,
                owner_id: 'guild-master-1',
                amenities: ['Hot Meals', 'Finest Ale', 'Magical Warmth', 'Storytelling Corner']
            }
        };
        currentPlace = samplePlaces[placeId] || samplePlaces['1'];
        displayPlaceDetails(currentPlace);
    }
}

// Display place details
function displayPlaceDetails(place) {
    document.getElementById('placeTitle').textContent = place.title;
    document.getElementById('placeDescription').textContent = place.description;
    document.getElementById('placePrice').textContent = `${place.price} gold`;
    document.getElementById('placeLocation').textContent = `${place.latitude}, ${place.longitude}`;
    document.getElementById('placeImage').src = `/static/images/${currentPlace.image}`;
    document.getElementById('placeImage').alt = currentPlace.title;

    // Set host name based on place ID
    const hostMapping = {
        '1': 'Guild Master Thorin',      // Dragon's Rest Tavern
        '2': 'Forest Keeper Elaria',    // Cozy Woodland Cabin
        '3': 'Fae Queen Titania',       // Ethereal Fae Retreat
        '4': 'Castle Steward Magnus'    // Royal Castle Quarters
    };
    
    const hostName = hostMapping[place.id] || 'Guild Master';
    document.getElementById('hostName').textContent = hostName;

    const imgEl = document.getElementById('placeImage');
    const defaultImg = '/static/images/default-placeholder.jpeg'; // ensure this exists
    if (place.image && typeof place.image === 'string' && place.image.length > 0) {
        imgEl.src = place.image; // <-- use backend-provided URL directly
    } else {
        imgEl.src = defaultImg;
    }
    imgEl.alt = place.title || 'Place image';

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
            console.log('Using sample reviews for development');
            
            // Sample reviews that match each place
            const sampleReviewsByPlace = {
                '1': [ // Dragon's Rest Tavern
                    {
                        id: '1',
                        text: 'Amazing place! The atmosphere was perfect for our adventuring party. The ale was indeed the finest in the kingdom and the storytelling corner made for great entertainment.',
                        rating: 5,
                        user: { first_name: 'Aragorn', last_name: 'Ranger' }
                    },
                    {
                        id: '2',
                        text: 'The magical warmth was incredible - kept us cozy all night. Great hot meals and the staff really knows how to treat adventurers.',
                        rating: 4,
                        user: { first_name: 'Legolas', last_name: 'Greenleaf' }
                    }
                ],
                '2': [ // Cozy Woodland Cabin
                    {
                        id: '3',
                        text: 'Perfect retreat from city life! The stone fireplace was so cozy and we saw amazing wildlife right from our windows.',
                        rating: 5,
                        user: { first_name: 'Hermione', last_name: 'Granger' }
                    },
                    {
                        id: '4',
                        text: 'Rustic charm at its finest. The forest views were breathtaking and so peaceful. Highly recommend for nature lovers.',
                        rating: 4,
                        user: { first_name: 'Druid', last_name: 'Wildwood' }
                    }
                ],
                '3': [ // Ethereal Fae Retreat
                    {
                        id: '5',
                        text: 'Truly otherworldly experience! The glowing flowers were magical and the crystal formations sang beautiful melodies.',
                        rating: 5,
                        user: { first_name: 'Luna', last_name: 'Lovegood' }
                    },
                    {
                        id: '6',
                        text: 'The magical gardens exceeded all expectations. Felt like stepping into another realm entirely. Absolutely enchanting!',
                        rating: 5,
                        user: { first_name: 'Gandalf', last_name: 'Grey' }
                    }
                ],
                '4': [ // Royal Castle Quarters
                    {
                        id: '7',
                        text: 'Royal treatment indeed! The four-poster bed was incredibly comfortable and the castle views were spectacular.',
                        rating: 5,
                        user: { first_name: 'Princess', last_name: 'Zelda' }
                    },
                    {
                        id: '8',
                        text: 'Medieval luxury at its peak. The tapestries were beautiful and we felt like true royalty during our stay.',
                        rating: 4,
                        user: { first_name: 'Sir', last_name: 'Galahad' }
                    }
                ]
            };
            
            const sampleReviews = sampleReviewsByPlace[placeId] || sampleReviewsByPlace['1'];
            displayReviews(sampleReviews);
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
        console.log('Network error loading reviews, showing sample data');
        // Show sample reviews even on network error
        const sampleReviewsByPlace = {
            '1': [
                {
                    id: '1',
                    text: 'Amazing tavern with great atmosphere! (Sample review - network error)',
                    rating: 5,
                    user: { first_name: 'Test', last_name: 'User' }
                }
            ]
        };
        const sampleReviews = sampleReviewsByPlace[placeId] || sampleReviewsByPlace['1'];
        displayReviews(sampleReviews);
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
document.addEventListener('DOMContentLoaded', () => {
    placeId = getPlaceId();

    if (!placeId) {
        console.error('No place ID found in URL');
        showError();
        return;
    }

    console.log('Loading place details for ID:', placeId);
    
    // Load components with error handling
    checkAuth().catch(err => console.log('Auth check failed:', err));
    loadPlaceDetails().catch(err => console.error('Failed to load place details:', err));
    loadReviews().catch(err => console.error('Failed to load reviews:', err));
});


