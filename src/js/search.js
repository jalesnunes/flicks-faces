// src/js/search.js
// Search results page JavaScript

// API Configuration
const API_KEY = "ef48c38f2fbfebc53668e317a8e3f8ec";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZjQ4YzM4ZjJmYmZlYmM1MzY2OGUzMTdhOGUzZjhlYyIsIm5iZiI6MTc1OTcyMDM1NS4zNywic3ViIjoiNjhlMzMzYTNjZDM2ZmY5Y2FiYzI3M2E3Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.fQ20hVsTNi2ZO8cFhUSuHJfW1pcT-3bY_yqJJGwnkc0";

// Get search query from URL
function getSearchQuery() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('q');
}

// Function to search for movies and TV shows
function searchContent(query) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + BEARER_TOKEN,
    },
  };

  // Display search query
  document.getElementById('searchQuery').textContent = query;
  document.getElementById('searchInput').value = query;

  // Search using multi endpoint (searches movies AND tv shows)
  fetch(BASE_URL + "/search/multi?query=" + encodeURIComponent(query) + "&language=en-US&page=1", options)
    .then((response) => response.json())
    .then((data) => {
      console.log("Search results:", data);
      displaySearchResults(data.results);
    })
    .catch((error) => {
      console.error("Error searching:", error);
      document.getElementById('loading').innerHTML = '<p class="text-danger">Error searching. Please try again.</p>';
    });
}

// Function to display search results
function displaySearchResults(results) {
  // Hide loading, show content
  document.getElementById('loading').style.display = 'none';
  document.getElementById('results-content').style.display = 'block';

  // Separate results by type
  const movies = results.filter(item => item.media_type === 'movie');
  const tvShows = results.filter(item => item.media_type === 'tv');

  // Update results count
  const totalResults = results.length;
  document.getElementById('resultsCount').textContent = 
    `Found ${totalResults} result${totalResults !== 1 ? 's' : ''} (${movies.length} movies, ${tvShows.length} TV shows)`;

  // If no results found
  if (results.length === 0) {
    document.getElementById('no-results').style.display = 'block';
    return;
  }

  // Show movies
  if (movies.length > 0) {
    document.getElementById('movies-section').style.display = 'block';
    const movieList = document.getElementById('movies-list');
    movies.forEach(movie => {
      const card = createMovieCard(movie);
      movieList.innerHTML += card;
    });
  }

  // Show TV shows
  if (tvShows.length > 0) {
    document.getElementById('tv-section').style.display = 'block';
    const tvList = document.getElementById('tv-list');
    tvShows.forEach(show => {
      const card = createTVShowCard(show);
      tvList.innerHTML += card;
    });
  }
}

// Function to create a movie card HTML
function createMovieCard(movie) {
  // URL of the poster image
  const imagemUrl = IMAGE_URL + movie.poster_path;

  // Movie rating (1 decimal place)
  const rate = movie.vote_average.toFixed(1);

  // Year of release
  const year = movie.release_date ? movie.release_date.split("-")[0] : "N/A";

  // description (limit to 120 characters)
  let description = movie.overview;
  if (description.length > 120) {
    description = description.substring(0, 120) + "...";
  }

  // return the HTML for the card
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
                <a href="details.html?type=movie&id=${movie.id}" class="btn btn-outline mt-auto w-100">Show Details</a>
            </div>
        </div>
    </li>
  `;
}

// Function to create a TV show card HTML
function createTVShowCard(show) {
  // URL of the poster image
  const imagemUrl = IMAGE_URL + show.poster_path;

  // TV show rating (1 decimal place)
  const rate = show.vote_average.toFixed(1);

  // Year of first air date
  const year = show.first_air_date ? show.first_air_date.split("-")[0] : "N/A";

  // description (limit to 120 characters)
  let description = show.overview;
  if (description.length > 120) {
    description = description.substring(0, 120) + "...";
  }

  // return the HTML for the card
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
                <a href="details.html?type=tv&id=${show.id}" class="btn btn-outline mt-auto w-100">Show Details</a>
            </div>
        </div>
    </li>
  `;
}

// When page loads, perform search
window.addEventListener('DOMContentLoaded', function() {
  const query = getSearchQuery();
  
  // If no query, redirect to home
  if (!query) {
    window.location.href = '../../index.html';
    return;
  }

  // Perform search
  searchContent(query);

  // Add search form functionality
  const searchForm = document.getElementById("searchForm");
  
  searchForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const newQuery = document.getElementById("searchInput").value.trim();
    
    if (newQuery !== "") {
      // Reload page with new search query
      window.location.href = 'search.html?q=' + encodeURIComponent(newQuery);
    }
  });
});