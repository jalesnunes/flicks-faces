// My TMDb API key
const API_KEY = "ef48c38f2fbfebc53668e317a8e3f8ec";
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

// Auth Token
const BEARER_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJlZjQ4YzM4ZjJmYmZlYmM1MzY2OGUzMTdhOGUzZjhlYyIsIm5iZiI6MTc1OTcyMDM1NS4zNywic3ViIjoiNjhlMzMzYTNjZDM2ZmY5Y2FiYzI3M2E3Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.fQ20hVsTNi2ZO8cFhUSuHJfW1pcT-3bY_yqJJGwnkc0";

// Global variables to control pagination on movies 
let actualMovies = [];
let pageIndex = 0;
let moviesPerPage = 4; 

// Global variables to control pagination on TV shows
let actualTVShows = [];
let tvPageIndex = 0;
let tvShowsPerPage = 4;

// Function to search movies through API
function searchMovies() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + BEARER_TOKEN,
    },
  };

  // Do API request
  fetch(BASE_URL + "/movie/now_playing?language=en-US&page=1", options)
    .then((response) => response.json())
    .then((data) => {
      actualMovies = data.results; // Save movies to global variable
      showMovies(); // call function to show movies
    })
    .catch((error) => {
      console.error("Error to fetch movies:", error);
      alert("Movies could not be loaded. Please try again later.");
    });
}

// Function to search TV shows through API
function searchTVShows() {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + BEARER_TOKEN,
    },
  };

  // Do API request
  fetch(BASE_URL + "/tv/popular?language=en-US&page=1", options)
    .then((response) => response.json())
    .then((data) => {
      actualTVShows = data.results; // Save TV shows to global variable
      showTVShows(); // call function to show TV shows
    })
    .catch((error) => {
      console.error("Error to fetch TV shows:", error);
      alert("TV Shows could not be loaded. Please try again later.");
    });
}

// Function to show movies on the page
function showMovies() {
  const movieList = document.getElementById("movies-list");

  // clear current movies
  movieList.innerHTML = "";

  // Verify screen size to adjust movies per page
  if (window.innerWidth <= 768) {
    moviesPerPage = 1; // Mobile: show 1 movie
  } else {
    moviesPerPage = 4; // Desktop: show 4 movies
  }

  // calculate start and end index
  const start = pageIndex;
  const end = pageIndex + moviesPerPage;
  const moviesToShow = actualMovies.slice(start, end);

  // For each movie, create a card and add to the list
  moviesToShow.forEach((movie) => {
    const card = createMovieCard(movie);
    movieList.innerHTML += card;
  });

  // Update navigation buttons
  updateBtn();
}

// Function to show TV shows on the page
function showTVShows() {
  const tvList = document.getElementById("tv-list");

  // clear current TV shows
  tvList.innerHTML = "";

  // Verify screen size to adjust TV shows per page
  if (window.innerWidth <= 768) {
    tvShowsPerPage = 1; // Mobile: show 1 TV show
  } else {
    tvShowsPerPage = 4; // Desktop: show 4 TV shows
  }

  // calculate start and end index
  const start = tvPageIndex;
  const end = tvPageIndex + tvShowsPerPage;
  const tvShowsToShow = actualTVShows.slice(start, end);

  // For each TV show, create a card and add to the list
  tvShowsToShow.forEach((show) => {
    const card = createTVShowCard(show);
    tvList.innerHTML += card;
  });

  // Update navigation buttons
  updateTVBtn();
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
                <a href="#" class="btn btn-outline mt-auto w-100">Show Details</a>
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
                <a href="#" class="btn btn-outline mt-auto w-100">Show Details</a>
            </div>
        </div>
    </li>
  `;
}

// Function to go to previous page
function previousPage() {
  if (pageIndex > 0) {
    pageIndex -= moviesPerPage;
    showMovies();
    window.scrollTo(0, 0); // Come back to top of the page
  }
}

// Function to go to next page
function nextPage() {
  const maxIndice = actualMovies.length - moviesPerPage;

  if (pageIndex < maxIndice) {
    pageIndex += moviesPerPage;
    showMovies();
    window.scrollTo(0, 0); // come back to top of the page
  }
}

// Function to go to previous TV page
function previousTVPage() {
  if (tvPageIndex > 0) {
    tvPageIndex -= tvShowsPerPage;
    showTVShows();
    window.scrollTo(0, 0); // Come back to top of the page
  }
}

// Function to go to next TV page
function nextTVPage() {
  const maxIndice = actualTVShows.length - tvShowsPerPage;

  if (tvPageIndex < maxIndice) {
    tvPageIndex += tvShowsPerPage;
    showTVShows();
    window.scrollTo(0, 0); // come back to top of the page
  }
}

// Function to update navigation buttons and page info
function updateBtn() {
  const btnPrevious = document.getElementById("prevMovies");
  const btnNext = document.getElementById("nextMovies");
  const pageInfo = document.getElementById("pageInfo");

  // Disable previous button if on the first page
  if (pageIndex === 0) {
    btnPrevious.disabled = true;
  } else {
    btnPrevious.disabled = false;
  }

  // Disable next button if on the last page
  const maxIndice = actualMovies.length - moviesPerPage;
  if (pageIndex >= maxIndice) {
    btnNext.disabled = true;
  } else {
    btnNext.disabled = false;
  }

  // Update page info
  const actualPage = Math.floor(pageIndex / moviesPerPage) + 1;
  const totalPages = Math.ceil(actualMovies.length / moviesPerPage);
  pageInfo.textContent = actualPage + " / " + totalPages;
}

// Function to update TV navigation buttons and page info
function updateTVBtn() {
  const btnPrevious = document.getElementById("prevTV");
  const btnNext = document.getElementById("nextTV");
  const pageInfo = document.getElementById("tvPageInfo");

  // Disable previous button if on the first page
  if (tvPageIndex === 0) {
    btnPrevious.disabled = true;
  } else {
    btnPrevious.disabled = false;
  }

  // Disable next button if on the last page
  const maxIndice = actualTVShows.length - tvShowsPerPage;
  if (tvPageIndex >= maxIndice) {
    btnNext.disabled = true;
  } else {
    btnNext.disabled = false;
  }

  // Update page info
  const actualPage = Math.floor(tvPageIndex / tvShowsPerPage) + 1;
  const totalPages = Math.ceil(actualTVShows.length / tvShowsPerPage);
  pageInfo.textContent = actualPage + " / " + totalPages;
}

// when the page is loaded, search and show movies and TV shows
window.addEventListener("DOMContentLoaded", function () {
  searchMovies();
  searchTVShows();

  // add event listeners to movie buttons
  document.getElementById("prevMovies").addEventListener("click", previousPage);
  document.getElementById("nextMovies").addEventListener("click", nextPage);

  // add event listeners to TV show buttons
  document.getElementById("prevTV").addEventListener("click", previousTVPage);
  document.getElementById("nextTV").addEventListener("click", nextTVPage);

  // when the window is resized, adjust items per page and refresh display
  window.addEventListener("resize", function () {
    showMovies();
    showTVShows();
  });
});