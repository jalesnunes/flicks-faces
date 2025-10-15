// src/js/favorites.js
// Favorites page JavaScript

const API_KEY = "ef48c38f2fbfebc53668e317a8e3f8ec";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZjQ4YzM4ZjJmYmZlYmM1MzY2OGUzMTdhOGUzZjhlYyIsIm5iZiI6MTc1OTcyMDM1NS4zNywic3ViIjoiNjhlMzMzYTNjZDM2ZmY5Y2FiYzI3M2E3Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.fQ20hVsTNi2ZO8cFhUSuHJfW1pcT-3bY_yqJJGwnkc0";

// Get favorites from localStorage
function getFavorites() {
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
}

// Load favorites details from API
async function loadFavorites() {
  const favorites = getFavorites();

  if (favorites.length === 0) {
    document.getElementById('favoritesCount').textContent = 'You have no favorites yet';
    document.getElementById('empty-state').style.display = 'block';
    return;
  }

  document.getElementById('favoritesCount').textContent = `You have ${favorites.length} favorite${favorites.length !== 1 ? 's' : ''}`;

  // Separate movies and TV shows
  const movies = [];
  const tvShows = [];

  // Fetch details for each favorite
  for (const fav of favorites) {
    try {
      const data = await fetchItemDetails(fav.type, fav.id);
      if (fav.type === 'movie') {
        movies.push(data);
      } else {
        tvShows.push(data);
      }
    } catch (error) {
      console.error('Error loading favorite:', error);
    }
  }

  // Display movies
  if (movies.length > 0) {
    document.getElementById('movies-section').style.display = 'block';
    const movieList = document.getElementById('movies-list');
    movies.forEach(movie => {
      const card = createMovieCard(movie);
      movieList.innerHTML += card;
    });
  }

  // Display TV shows
  if (tvShows.length > 0) {
    document.getElementById('tv-section').style.display = 'block';
    const tvList = document.getElementById('tv-list');
    tvShows.forEach(show => {
      const card = createTVShowCard(show);
      tvList.innerHTML += card;
    });
  }
}

// Fetch item details from API
async function fetchItemDetails(type, id) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + BEARER_TOKEN
    }
  };

  const response = await fetch(BASE_URL + '/' + type + '/' + id + '?language=en-US', options);
  return await response.json();
}

// Function to create a movie card HTML
function createMovieCard(movie) {
  const imagemUrl = IMAGE_URL + movie.poster_path;
  const rate = movie.vote_average.toFixed(1);
  const year = movie.release_date ? movie.release_date.split("-")[0] : "N/A";

  let description = movie.overview;
  if (description.length > 120) {
    description = description.substring(0, 120) + "...";
  }

  return `
    <li class="list-group-item d-flex">
        <div class="card flex-fill h-100 shadow-sm" style="width: 18rem">
            <img src="${imagemUrl}" class="card-img-top" alt="${movie.title}">
            <div class="card-body d-flex flex-column justify-content-between">
                <div>
                    <h5 class="card-title text-truncate">${movie.title}</h5>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-star">⭐ ${rate}</span>
                        <small class="text-muted">${year}</small>
                    </div>
                    <p class="card-text">${description}</p>
                </div>
                <div class="d-flex gap-2">
                    <a href="details.html?type=movie&id=${movie.id}" class="btn btn-outline flex-fill">Show Details</a>
                    <button class="btn btn-danger" onclick="removeFavorite('movie', ${movie.id})">
                        <i class="bi bi-trash"></i> Remove
                    </button>
                </div>
            </div>
        </div>
    </li>
  `;
}

// Function to create a TV show card HTML
function createTVShowCard(show) {
  const imagemUrl = IMAGE_URL + show.poster_path;
  const rate = show.vote_average.toFixed(1);
  const year = show.first_air_date ? show.first_air_date.split("-")[0] : "N/A";

  let description = show.overview;
  if (description.length > 120) {
    description = description.substring(0, 120) + "...";
  }

  return `
    <li class="list-group-item d-flex">
        <div class="card flex-fill h-100 shadow-sm" style="width: 18rem">
            <img src="${imagemUrl}" class="card-img-top" alt="${show.name}">
            <div class="card-body d-flex flex-column justify-content-between">
                <div>
                    <h5 class="card-title text-truncate">${show.name}</h5>
                    <div class="d-flex justify-content-between align-items-center mb-2">
                        <span class="badge bg-star">⭐ ${rate}</span>
                        <small class="text-muted">${year}</small>
                    </div>
                    <p class="card-text">${description}</p>
                </div>
                <div class="d-flex gap-2">
                    <a href="details.html?type=tv&id=${show.id}" class="btn btn-outline flex-fill">Show Details</a>
                    <button class="btn btn-danger" onclick="removeFavorite('tv', ${show.id})">
                        <i class="bi bi-trash"></i> Remove
                    </button>
                </div>
            </div>
        </div>
    </li>
  `;
}

// Remove from favorites
function removeFavorite(type, id) {
  let favorites = getFavorites();
  favorites = favorites.filter(fav => !(fav.type === type && fav.id === id));
  localStorage.setItem('favorites', JSON.stringify(favorites));
  
  // Reload page
  window.location.reload();
}

// When page loads
window.addEventListener('DOMContentLoaded', function() {
  loadFavorites();

  // Add search form functionality
  const searchForm = document.getElementById("searchForm");
  
  searchForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const query = document.getElementById("searchInput").value.trim();
    
    if (query !== "") {
      window.location.href = 'search.html?q=' + encodeURIComponent(query);
    }
  });
});