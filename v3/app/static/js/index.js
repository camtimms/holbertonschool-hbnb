// Simple scroll functions
function scrollBack() {
    document.getElementById('cardRow').scrollBy({ left: -360, behavior: 'smooth' });
}

function scrollRight() {
    document.getElementById('cardRow').scrollBy({ left: 360, behavior: 'smooth' });
}

// Sample places data
const places = [
    { 
        id: "1", 
        title: "Dragon's Rest Tavern", 
        description: "A legendary tavern where heroes gather", 
        price: 75, 
        rating: 4.5,
        amenities: ["Hot Meals", "Finest Ale", "Magical Warmth"], 
        image: "/static/images/place1.jpeg"
    },
    { 
        id: "2", 
        title: "Cozy Woodland Cabin", 
        description: "A charming cabin in the enchanted forest", 
        price: 100, 
        rating: 4.3,
        amenities: ["Stone Fireplace", "Forest Views"], 
        image: "/static/images/place2.jpeg"
    },
    { 
        id: "3", 
        title: "Ethereal Fae Retreat", 
        description: "A magical sanctuary where worlds meet", 
        price: 200, 
        rating: 4.8,
        amenities: ["Magical Gardens", "Crystal Formations"], 
        image: "/static/images/place3.jpeg"
    },
    { 
        id: "4", 
        title: "Royal Castle Quarters", 
        description: "Luxurious accommodations in an ancient castle", 
        price: 300, 
        rating: 4.7,
        amenities: ["Royal Treatment", "Four-Poster Beds", "Castle Views"], 
        image: "/static/images/place4.jpeg"
    }
];

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
    displayPlaces();
    
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