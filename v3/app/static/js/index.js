// Simple scroll functions
function scrollBack() {
    document.getElementById('cardRow').scrollBy({ left: -360, behavior: 'smooth' });
}

function scrollRight() {
    document.getElementById('cardRow').scrollBy({ left: 360, behavior: 'smooth' });
}

// Dynamic places data loaded from API
let places = [];

// Dynamic image mapping for places
function getPlaceImage(place) {
    const titleImageMap = {
        'Dragon\'s Rest Tavern': 'place1.jpeg',
        'Cozy Woodland Cabin': 'place2.jpeg', 
        'Ethereal Fae Retreat': 'place3.jpeg',
        'Royal Castle Quarters': 'place4.jpeg'
    };
    
    return titleImageMap[place.title] || 'default_place.jpg';
}

// Load places from API
async function loadPlaces() {
    try {
        const response = await fetch('/api/v3/places/', {
            credentials: 'include'
        });
        
        if (response.ok) {
            const placesData = await response.json();
            places = placesData.map(place => ({
                ...place,
                rating: 4.5, // Default rating since API doesn't provide it
                image: `/static/images/${getPlaceImage(place)}`
            }));
            displayPlaces();
        } else {
            console.error('Failed to load places from API');
            // Keep empty places array so page doesn't break
        }
    } catch (error) {
        console.error('Error loading places:', error);
        // Keep empty places array so page doesn't break
    }
}

// Create and display place cards
function displayPlaces() {
    const cardRow = document.getElementById('cardRow');
    cardRow.innerHTML = '';

    places.forEach(place => {
        const card = document.createElement('div');
        card.className = 'place-card';
        card.setAttribute('data-price', place.price);
        card.setAttribute('data-rating', place.rating);

        card.innerHTML = `
            <img src="${place.image}" alt="${place.title}" class="card-img">
            <div class="card-content">
                <h3>${place.title}</h3>
            </div>
            <p class="card-desc">${place.description}</p>
            <div class="card-bottom-bar">
                <span>${place.price} Gold/Night</span>
                <span class="amenities-count">🔮 ${place.amenities.length} amenities</span>
                <span>⭐ ${place.rating}</span>
            </div>
        `;

        card.addEventListener('click', () => {
            window.location.href = `/place/${place.id}`;
        });

        cardRow.appendChild(card);
    });
}

// Search functionality
function handleSearch(event) {
    event.preventDefault();
    const query = document.getElementById('search-input').value.toLowerCase();
    const cards = document.querySelectorAll('.place-card');

    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const desc = card.querySelector('.card-desc').textContent.toLowerCase();
        
        card.style.display = (title.includes(query) || desc.includes(query)) ? '' : 'none';
    });
}

// Price filtering
document.getElementById('filter').addEventListener('change', function() {
    const maxPrice = Number(this.value);
    const cards = document.querySelectorAll('.place-card');

    cards.forEach(card => {
        const price = Number(card.getAttribute('data-price'));
        card.style.display = (maxPrice === 0 || price <= maxPrice) ? '' : 'none';
    });
});

// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
    // Load places from API first
    loadPlaces();
    
    // Auth check
    fetch("/api/v3/auth/protected", {
        method: "GET",
        credentials: "include"
    })
    .then(res => res.status === 200 ? res.json() : Promise.reject())
    .then(user => {
        document.getElementById("loginBtn").style.display = "none";
        document.getElementById("userInfo").style.display = "block";
        document.getElementById("welcomeMsg").textContent = `Welcome, ${user.first_name}!`;
    })
    .catch(() => {
        document.getElementById("loginBtn").style.display = "block";
        document.getElementById("userInfo").style.display = "none";
    });
});

// Logout function
async function logout() {
    try {
        await fetch('/api/v3/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        
        // Redirect to home page to refresh authentication state
        window.location.href = '/';
    } catch (error) {
        console.error('Logout failed:', error);
    }
}