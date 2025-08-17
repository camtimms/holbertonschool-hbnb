// card scroll functions
function scrollBack() {
  const row = document.getElementById("cardRow");
  row.scrollBy({ left: -360, behavior: "smooth" });
}

function scrollRight() {
  const row = document.getElementById("cardRow");
  row.scrollBy({ left: 360, behavior: "smooth" });
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
      
const cardRow = document.getElementById("cardRow");

// --- Load places from backend ---
document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:5000/api/v3/places/", {
    method: "GET",
    credentials: "include" // if auth is required
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to load places");
      return res.json();
    })
    .then(places => {
      cardRow.innerHTML = ""; // Clear any placeholders

      places.forEach(place => {
        const card = document.createElement("div");
        card.className = "place-card";
        card.setAttribute("data-price", place.price);
        card.setAttribute("data-rating", place.rating);

        const img = document.createElement("img");
        img.src = place.image;
        img.alt = place.name;
        img.className = "card-img";

        const amenitiesCount = place.amenities ? place.amenities.length : 0;
        const amenitiesCountSpan = document.createElement("span");
        amenitiesCountSpan.className = "amenities-count";
        amenitiesCountSpan.textContent = `🔮 ${amenitiesCount} amenit${
          amenitiesCount === 1 ? "y" : "ies"
        }`;


// Initialize when page loads
document.addEventListener("DOMContentLoaded", () => {
    // Load places from API first
    loadPlaces();
    
    // Auth check
    fetch("/api/v3/auth/protected", {
        method: "GET",
        credentials: "include"

        // Wrap title inside a content container
        const content = document.createElement("div");
        content.className = "card-content";

        const title = document.createElement("h3");
        title.textContent = place.title;
        content.appendChild(title);

        const desc = document.createElement("p");
        desc.className = "card-desc";
        desc.textContent = place.description;

        const bottomBar = document.createElement("div");
        bottomBar.className = "card-bottom-bar";

        const price = document.createElement("span");
        price.textContent = `$${place.price}`;

        const rating = document.createElement("span");
        rating.textContent = `⭐ 5`;

        bottomBar.appendChild(price);
        bottomBar.appendChild(amenitiesCountSpan);
        bottomBar.appendChild(rating);

        // Assemble card
        card.appendChild(img);
        card.appendChild(content);
        card.appendChild(desc);
        card.appendChild(bottomBar);
        // transfer place
        card.addEventListener("click", () => {
            window.location.href = `/place/${place.id}`;
        });


        cardRow.appendChild(card);
      });
    })
    .catch(err => console.error("Error loading places:", err));

  // --- Check login state on page load ---
  fetch("http://localhost:5000/auth/protected", {
    method: "GET",
    credentials: "include"
  })
    .then(res => {
      if (res.status === 200) return res.json();
      throw new Error("Not logged in");

    })
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

      console.log("Logged in as:", user.first_name);
      document.getElementById("loginBtn").style.display = "none";
      document.getElementById("welcomeMsg").textContent = `Welcome, ${user.first_name}!`;
    })
    .catch(() => {
      console.log("User not logged in");
      document.getElementById("loginBtn").style.display = "block";
    });
});

// --- Search functionality ---
function handleSearch(event) {
  event.preventDefault();

  const searchInput = document.getElementById("search-input");
  const query = searchInput.value.toLowerCase();
  const cards = document.querySelectorAll(".place-card");

  cards.forEach(card => {
    const title = card.querySelector("h3").textContent.toLowerCase();
    const desc = card.querySelector(".card-desc").textContent.toLowerCase();

    card.style.display =
      title.includes(query) || desc.includes(query) ? "" : "none";
  });
}

// --- Dynamic filtering ---
document.getElementById("filter").addEventListener("change", function () {
  const maxPrice = Number(this.value);
  const cards = document.querySelectorAll(".place-card");

  cards.forEach(card => {
    const price = Number(card.getAttribute("data-price"));
    card.style.display = maxPrice === 0 || price <= maxPrice ? "" : "none";
  });
});

