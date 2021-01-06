"use strict";
//Api keys and url
const API_KEY = "04c598de81eb8f3adc3466cb57775dbd";
const IMG_URL = "https://image.tmdb.org/t/p/w500/";
const url =
  "https://api.themoviedb.org/3/search/movie?api_key=04c598de81eb8f3adc3466cb57775dbd";

//changing from poster
const poster = document.querySelector(".poster");

poster.addEventListener("mouseenter", (e) => {
  e.preventDefault();

  const quote = document.querySelector(".quotes");
  const val = Math.trunc(Math.random() * 9) + 1;
  console.log(val);
  quote.src = "quote-" + val + ".jpg";
});

//selecting elements
const searchBtn = document.querySelector("#btn");
const searchMovie = document.querySelector(".movieSearch");
const movieSearchable = document.querySelector("#movie-searchable");
const movieContainer = document.querySelector("#movieContainer");

//get url
function generateUrl(path) {
  const Url = `https://api.themoviedb.org/3${path}?api_key=04c598de81eb8f3adc3466cb57775dbd`;
  return Url;
}

//adding poster to web
function createPoster(data) {
  movieSearchable.innerHTML = "";
  const movies = data.results;
  const movieBlock = createMovieContainer(movies);

  movieSearchable.appendChild(movieBlock);

  console.log("Data", data);
}

//movies section
function moviesSection(movies) {
  return movies.map((movie) => {
    if (movie.poster_path)
      return `<img src=${IMG_URL + movie.poster_path} data-movie-id=${
        movie.id
      } class="poster-image"/>`;
  });
}

//create movie contaner
function createMovieContainer(movies, title = "") {
  const movieElement = document.createElement("div");
  movieElement.setAttribute("class", "movie");

  const movieTemplate = `
  <h2 id="title">${title}</h2>
  <section class="section">
      ${moviesSection(movies)}  ;  
  </section>
  <div class="content">
  <button class="close-btn">X</button>
  </div>`;

  movieElement.innerHTML = movieTemplate;
  console.log(movieElement);
  return movieElement;
}

//event handler
searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  console.log(searchMovie.value);
  const val = searchMovie.value;
  const path = "/search/movie";

  const newUrl = generateUrl(path) + "&query=" + val;
  //fetch
  fetch(newUrl)
    .then((res) => res.json())
    .then((data) => {
      createPoster(data);
      console.log(searchMovie.value);
    })
    .catch((error) => {
      console.log("Error", error);
    });
});

//adding videos video
//create video
function createIfram(video) {
  const ifram = document.createElement("iframe");
  ifram.src = `https://www.youtube.com/embed/${video.key}`;
  ifram.width = 380;
  ifram.height = 315;
  ifram.allowFullscreen = true;
  return ifram;
}
//creat video template
function videoTemplate(data, content) {
  content.innerHTML = `<button class="close-btn">X</button>`; //overwrite everthing each time we click a video
  console.log("videos", data);
  const videos = data.results;
  const length = videos.length > 4 ? 4 : videos.length;
  const iframContainer = document.createElement("div");

  for (let i = 0; i < length; i++) {
    const video = videos[i];
    const iframe = createIfram(video);
    iframContainer.appendChild(iframe);
    content.appendChild(iframContainer);
  }
}

document.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.matches(".poster-image")) {
    const section = e.target.parentElement; //parentElement give parent element of target
    const content = section.nextElementSibling; //nextElementSibling give next sibling Element of target
    console.log("Events", e);
    //take movie id from dom
    const movieId = e.target.dataset.movieId;
    console.log(movieId);
    const path = `/movie/${movieId}/videos`;
    const newUrl = generateUrl(path);

    //fetching video
    fetch(newUrl)
      .then((res) => res.json())
      .then((data) => {
        videoTemplate(data, content);
      })
      .catch((error) => {
        console.log("Error", error);
      });

    content.classList.add("display");
  }
  if (e.target.matches(".close-btn")) {
    //There are more than one element with class=content so we have to wrork on it array collection
    const contentClasses = document.querySelectorAll(".content");
    console.log(contentClasses);
    for (let i = 0; i < contentClasses.length; i++) {
      contentClasses[i].classList.remove("display");
    }
  }
});

//TODO
//Add different movie sections upcoming popular rated suggestions
//movie container for category movies

//create Poster for Movies other than search one
function getPoster(data, title = "") {
  const movies = data.results;
  // console.log(movies);
  const movieBlock = createMovieContainer(movies, title);

  movieContainer.appendChild(movieBlock);
}

function getMovies(path, title) {
  const newUrl = generateUrl(path);

  //fetch
  fetch(newUrl)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      getPoster(data, title);
    })
    .catch((error) => {
      console.log("Error", error);
    });
}
getMovies(`/movie/upcoming`, "Upcoming Movies");

getMovies(`/movie/popular`, "Popular Movies");

getMovies(`/movie/top_rated`, "Top Rated  Movies");
getMovies(`/movie/now_playing`, "Now playing in Theater");

//Reviews of movies
