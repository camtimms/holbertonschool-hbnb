// card scroll functions
function scrollBack() {
  const row = document.getElementById("cardRow");
  row.scrollBy({ left: -360, behavior: "smooth" });
}

function scrollRight() {
  const row = document.getElementById("cardRow");
  row.scrollBy({ left: 360, behavior: "smooth" });
}

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
