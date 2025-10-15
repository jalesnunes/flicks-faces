// src/js/details.js
// Details page JavaScript

// API Configuration
const API_KEY = "ef48c38f2fbfebc53668e317a8e3f8ec";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const BACKDROP_URL = "https://image.tmdb.org/t/p/w1280";

const BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZjQ4YzM4ZjJmYmZlYmM1MzY2OGUzMTdhOGUzZjhlYyIsIm5iZiI6MTc1OTcyMDM1NS4zNywic3ViIjoiNjhlMzMzYTNjZDM2ZmY5Y2FiYzI3M2E3Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.fQ20hVsTNi2ZO8cFhUSuHJfW1pcT-3bY_yqJJGwnkc0";

// Get parameters from URL
// Example: details.html?type=movie&id=12345
function getUrlParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    type: urlParams.get('type'), // 'movie' or 'tv'
    id: urlParams.get('id')
  };
}

// Function to fetch details from API
function fetchDetails() {
  const params = getUrlParameters();
  
  // Check if we have the necessary parameters
  if (!params.type || !params.id) {
    alert('Error: Missing information. Returning to home page.');
    window.location.href = 'index.html';
    return;
  }

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer ' + BEARER_TOKEN
    }
  };

  // Build API URL based on type (movie or tv)
  const apiUrl = BASE_URL + '/' + params.type + '/' + params.id + '?language=en-US';

  // Make API request
  fetch(apiUrl, options)
    .then(response => response.json())
    .then(data => {
      console.log('Details received:', data);
      displayDetails(data, params.type);
    })
    .catch(error => {
      console.error('Error fetching details:', error);
      alert('Error loading details. Please try again.');
      window.location.href = 'index.html';
    });
}

// Function to display details on the page
function displayDetails(data, type) {
  // Hide loading, show content
  document.getElementById('loading').style.display = 'none';
  document.getElementById('details-content').style.display = 'block';

  // Common fields for movies and TV shows
  const title = type === 'movie' ? data.title : data.name;
  const releaseDate = type === 'movie' ? data.release_date : data.first_air_date;
  const rating = data.vote_average.toFixed(1);

  // Set backdrop image
  if (data.backdrop_path) {
    document.getElementById('backdrop').src = BACKDROP_URL + data.backdrop_path;
    document.getElementById('backdrop').alt = title;
  }

  // Set poster image
  if (data.poster_path) {
    document.getElementById('poster').src = IMAGE_URL + data.poster_path;
    document.getElementById('poster').alt = title;
  }

  // Set title and basic info
  document.getElementById('title').textContent = title;
  document.getElementById('rating').textContent = '⭐ ' + rating;
  document.getElementById('release-date').textContent = formatDate(releaseDate);
  document.getElementById('overview').textContent = data.overview || 'No overview available.';

  // Set genres
  if (data.genres && data.genres.length > 0) {
    const genresText = data.genres.map(g => g.name).join(', ');
    document.getElementById('genres').textContent = genresText;
  }

  // Set language
  document.getElementById('language').textContent = data.original_language.toUpperCase();

  // Set status
  document.getElementById('status').textContent = data.status;

  // Movie specific fields
  if (type === 'movie') {
    // Runtime
    if (data.runtime) {
      const hours = Math.floor(data.runtime / 60);
      const minutes = data.runtime % 60;
      document.getElementById('runtime').textContent = hours + 'h ' + minutes + 'min';
    }

    // Budget
    if (data.budget) {
      document.getElementById('budget').textContent = '$' + formatNumber(data.budget);
    } else {
      document.getElementById('budget').textContent = 'N/A';
    }

    // Revenue
    if (data.revenue) {
      document.getElementById('revenue').textContent = '$' + formatNumber(data.revenue);
    } else {
      document.getElementById('revenue').textContent = 'N/A';
    }
  }

  // TV Show specific fields
  if (type === 'tv') {
    document.getElementById('tv-info').style.display = 'block';
    document.getElementById('seasons').textContent = data.number_of_seasons || 'N/A';
    document.getElementById('episodes').textContent = data.number_of_episodes || 'N/A';
    document.getElementById('first-air').textContent = formatDate(data.first_air_date);

    // Hide budget/revenue for TV shows
    document.getElementById('budget').textContent = 'N/A';
    document.getElementById('revenue').textContent = 'N/A';
    
    // Show episode runtime instead
    if (data.episode_run_time && data.episode_run_time.length > 0) {
      document.getElementById('runtime').textContent = data.episode_run_time[0] + ' min/episode';
    }
  }
}

// Helper function to format dates
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Helper function to format numbers with commas
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// When page loads, fetch details
window.addEventListener('DOMContentLoaded', function() {
  console.log('Details page loaded');
  fetchDetails();
  updateFavoriteButton();
});

// ==================== FAVORITES FUNCTIONALITY ====================

// Get favorites from localStorage
function getFavorites() {
  const favorites = localStorage.getItem('favorites');
  return favorites ? JSON.parse(favorites) : [];
}

// Save favorites to localStorage
function saveFavorites(favorites) {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Check if item is in favorites
function isFavorite(type, id) {
  const favorites = getFavorites();
  return favorites.some(fav => fav.type === type && fav.id === id);
}

// Add to favorites
function addToFavorites(type, id) {
  const favorites = getFavorites();
  
  // Check if already exists
  if (!isFavorite(type, id)) {
    favorites.push({ type, id });
    saveFavorites(favorites);
    alert('Added to favorites!');
    updateFavoriteButton();
  }
}

// Remove from favorites
function removeFromFavorites(type, id) {
  let favorites = getFavorites();
  favorites = favorites.filter(fav => !(fav.type === type && fav.id === id));
  saveFavorites(favorites);
  alert('Removed from favorites!');
  updateFavoriteButton();
}

// Toggle favorite
function toggleFavorite() {
  const params = getUrlParameters();
  
  if (isFavorite(params.type, params.id)) {
    removeFromFavorites(params.type, params.id);
  } else {
    addToFavorites(params.type, params.id);
  }
}

// Update favorite button appearance
function updateFavoriteButton() {
  const params = getUrlParameters();
  const button = document.querySelector('.btn-favorite');
  
  if (button && params.type && params.id) {
    if (isFavorite(params.type, params.id)) {
      button.innerHTML = '❤️ Remove from Favorites';
      button.classList.remove('btn-outline');
      button.classList.add('btn-danger');
    } else {
      button.innerHTML = '🤍 Add to Favorites';
      button.classList.remove('btn-danger');
      button.classList.add('btn-outline');
    }
  }
}