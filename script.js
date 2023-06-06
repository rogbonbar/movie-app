const global = {
  currentPage: window.location.pathname
};

const IMG_PATH = 'https://image.tmdb.org/t/p/w500';
const SEARCH_API = 'https://api.themoviedb.org/3/search/movie?api_key=4ed8b57e77a9cf0ee672bc122b09d912&query=';

const main = document.getElementById('main');
const movieDetails = document.getElementById('movie-details')
const form = document.getElementById('form');
const search = document.getElementById('search');
const homeEl = document.getElementById('nav__link');

homeEl.addEventListener('click', () => {
  window.location.reload();
});

async function getMovies(url) {
  const data = await fetchAPIData(url);
  const { results } = data;

  main.innerHTML = '';

  results.forEach(movie => {
    const div = document.createElement('div');
    div.classList.add('movie');
    div.innerHTML = `
      <img src="${IMG_PATH + movie.poster_path}" alt="${movie.title}">
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <span class="${getClassByRate(movie.vote_average)}">${movie.vote_average.toFixed(1)}</span>
      </div>
      <div class="overview">
        <h3>Overview</h3>
        <a class="overview__link" href="movie_details.html?=${movie.id}">${movie.overview}</a>
      </div>
    `;
    main.appendChild(div);
  });
}

//  Display Movie Details
async function displayMovieDetails() {
  const movieId = window.location.search.split('=')[1]
  const API_URL = `https://api.themoviedb.org/3/movie/${movieId}?api_key=4ed8b57e77a9cf0ee672bc122b09d912&language=es-US}`
  const movie = await fetchAPIData(API_URL)
  
  const div = document.createElement('div')
  div.innerHTML = `
  <div class="details-top">
  <div>
  ${
    movie.poster_path 
    ? `
    <img
    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
    class="card-img-top"
    alt="${movie.title}"
  />` : 
  `
    <img
    src="images/no-image.jpg"
    class="card-img-top"
    alt="${movie.title}"
  />
    `
  }
  </div>
  <div>
    <h2>${movie.title}</h2>
    <p class="rating">
      <i class="fas fa-star text-primary"></i>
      ${movie.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date:${movie.release_date}</p>
    <p class="movie-overview">
    ${movie.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${movie.genres.map((genre) =>`<li>${genre.name}</li>`).join('')}
    </ul>
    <a href="${movie.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
  `
  movieDetails.appendChild(div)
}

async function fetchAPIData(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

function getClassByRate(vote) {
  if (vote >= 8) {
    return 'green';
  } else if (vote >= 5) {
    return 'orange';
  } else {
    return 'red';
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const searchTerm = search.value;

  if (searchTerm && searchTerm !== '') {
    await getMovies(SEARCH_API + searchTerm);
    search.value = '';
  } else {
    window.location.reload();
  }
});

function init() {
  switch (global.currentPage) {
    case '/':
    case '/index.html':
      getMovies('https://api.themoviedb.org/3/movie/popular?api_key=4ed8b57e77a9cf0ee672bc122b09d912&language=es-US');
      break;
    case '/movie_details.html':
      displayMovieDetails()
      break;
  }
}

document.addEventListener('DOMContentLoaded', init);
