// card scroll functions
function scrollBack() {
  const row = document.getElementById('cardRow');
  console.log('scrollLeft clicked, scrollLeft =', row.scrollLeft);
  row.scrollBy({ left: -365, behavior: 'smooth' });
}

function scrollRight() {
  const row = document.getElementById('cardRow');
  console.log('scrollRight clicked, scrollLeft =', row.scrollLeft);
  row.scrollBy({ left: 365, behavior: 'smooth' });
}

const places = [
    { name: "Tavern", description: "Cool spot #1", price: 75, rating: 4.5, image: "images/place1.jpeg"},
    { name: "Cozy cabin", description: "Awesome place #2", price: 100, rating: 4.3, image: "images/place2.jpeg"},
    { name: "Fae retreat", description: "Nice view #3", price: 200, rating: 4.5, image: "images/place3.jpeg"},
    { name: "Castle quarters", description: "Hidden gem #4", price: 300, rating: 4.5, image: "images/place4.jpeg"},
];

const cardRow = document.getElementById('cardRow');
// dynamic creation of cards
places.forEach(place => {
  const card = document.createElement('div');
  card.className = 'place-card';
  card.setAttribute('data-price', place.price);
  card.setAttribute('data-rating', place.rating);

  const img = document.createElement('img');
  img.src = place.image;
  img.alt = place.name;
  img.className = 'card-img';

  // Wrap title inside a content container
  const content = document.createElement('div');
  content.className = 'card-content';

  const title = document.createElement('h3');
  title.textContent = place.name;
  content.appendChild(title); // append title into content container

  const desc = document.createElement('p');
  desc.className = 'card-desc';
  desc.textContent = place.description;

  const bottomBar = document.createElement('div');
  bottomBar.className = 'card-bottom-bar';

  const price = document.createElement('span');
  price.textContent = `$${place.price}`;

  const rating = document.createElement('span');
  rating.textContent = `⭐ ${place.rating}`;

  bottomBar.appendChild(price);
  bottomBar.appendChild(rating);

  // Assemble card
  card.appendChild(img);
  card.appendChild(content);     // title container
  card.appendChild(desc);        // description
  card.appendChild(bottomBar);   // price & rating

  cardRow.appendChild(card);
});

// dynamic filtering
document.getElementById('filter').addEventListener('change', function() {
  const maxPrice = Number(this.value);
  const cards = document.querySelectorAll('.place-card');

  cards.forEach(card => {
    const price = Number(card.getAttribute('data-price'));
    if (maxPrice === 0 || price <= maxPrice) {
      card.style.display = '';  // show card
    } else {
      card.style.display = 'none'; // hide card
    }
  });
});

// login required
fetch('/auth/protected', {
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
fetch('/auth/login', {
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
// remove login button if logged in
document.addEventListener("DOMContentLoaded", () => {
  fetch("/auth/protected", {
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


