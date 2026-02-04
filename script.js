//   Configuration API TMDB

const API_KEY = "9ca46824082a6640e7782e9a5ccb0a8f";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_BASE = "https://image.tmdb.org/t/p/w500";


const isIndexPage = document.querySelector(".genre-section");
const isDetailPage = document.getElementById("movie-title");

const filmsByGenre = {};
const search = document.querySelector("#search"); 
const filter = document.querySelector("#filter");

if (isIndexPage) {
    const filtreValue = filter.value;
};




// Catalogue

if (isIndexPage) {
    loadFilmsByGenre("action", 28);
    loadFilmsByGenre("horreur", 27);
    loadFilmsByGenre("sci-fi", 878);
    loadFilmsByGenre("adventure", 12);
    loadFilmsByGenre("animation", 16);
    loadFilmsByGenre("comedy",35);
    loadFilmsByGenre("drama", 18);
    loadFilmsByGenre("family", 10751);
    loadFilmsByGenre("history", 36);
    loadFilmsByGenre("war", 10752);
    loadFilmsByGenre("thriller", 53);
    loadFilmsByGenre("mystery", 9648);
    loadFilmsByGenre("romance", 10749);
    loadFilmsByGenre("tvmovie", 10770);
    loadFilmsByGenre("fantasy", 14);
    loadFilmsByGenre("western", 37);
}


// Charge les films d’un genre et les affiche
/*
async function loadFilmsByGenre(genreSlug, genreId) {
    try {
        const response = await fetch(
            `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=fr-FR`,
        );
        const data = await response.json();

        const section = document.querySelector(
            `.genre-section[data-genre="${genreSlug}"] .film-row`,
        );

        section.innerHTML = "";

        data.results.slice(0, 12).forEach((movie) => {
            const card = createFilmCard(movie);
            section.appendChild(card);
        });
    } catch (error) {
        console.error("Erreur chargement films :", error);
    }
}
*/
async function loadFilmsByGenre(genreSlug, genreId) {
    try {
        const response = await fetch(
            `${BASE_URL}/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&language=fr-FR`
        );
        const data = await response.json();

        filmsByGenre[genreSlug] = data.results;

        renderFilms(genreSlug);
    } catch (error) {
        console.error("Erreur chargement films :", error);
    }
}


function renderFilms(genreSlug) {
    if (!filmsByGenre[genreSlug]) return;

    const section = document.querySelector(
        `.genre-section[data-genre="${genreSlug}"] .film-row`
    );

    let films = [...filmsByGenre[genreSlug]];

    // Recherche
    const query = search.value.toLowerCase();
    if (query) {
        films = films.filter(movie =>
            movie.title.toLowerCase().includes(query)
        );
    }

    // Tri
    const filtreValue = filter.value;

    if (filtreValue === "Année (croissante)") {
        films.sort((a, b) =>
            (a.release_date || "").localeCompare(b.release_date || "")
        );
    }

    if (filtreValue === "Année (décroissante)") {
        films.sort((a, b) =>
            (b.release_date || "").localeCompare(a.release_date || "")
        );
    }

    if (filtreValue === "Note (croissante)") {
        films.sort((a, b) => a.vote_average - b.vote_average);
    }

    if (filtreValue === "Note (décroissante)") {
        films.sort((a, b) => b.vote_average - a.vote_average);
    }

    section.innerHTML = "";

    films.slice(0, 12).forEach(movie => {
        section.appendChild(createFilmCard(movie));
    });
}




//  Crée une carte film

function createFilmCard(movie) {
    const card = document.createElement("div");
    card.classList.add("film-card");

    card.innerHTML = `
        <div class="film-poster"
            style="background-image:url('${IMG_BASE + movie.poster_path}')"></div>
        <div class="film-title">${movie.title}</div>
        <div class="film-annee">${movie.release_date?.slice(0, 4) || "?"}</div>
        <div class="note">${movie.vote_average.toFixed(1)} ⭐</div>
    `;

    card.addEventListener("click", () => {
        window.location.href = `detail.html?id=${movie.id}`;
    });

    return card;
}

if (isDetailPage) {
    const params = new URLSearchParams(window.location.search);
    const movieId = params.get("id");

    if (movieId) {
        console.log(movieId)
        loadMovieDetail(movieId);
    }
}

// Charge le détail d’un film
async function loadMovieDetail(id) {
    try {
        const response = await fetch(
            `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=fr-FR`,
        );
        const movie = await response.json();

        fillMovieDetail(movie);
    } catch (error) {
        console.error("Erreur chargement détail :", error);
    }
}

function fillMovieDetail(movie) {
    console.log(movie)

    document.getElementById("movie-title").textContent = movie.title;

    document.querySelector(".banner").style.backgroundImage =
        `url('${IMG_BASE + movie.backdrop_path}')`;

    document.querySelector(".poster").style.backgroundImage =
        `url('${IMG_BASE + movie.poster_path}')`;

    document.querySelector(".overview p").textContent = movie.overview;

    document.getElementById("movie-gender").innerHTML =
        `<span>Genre :</span> ${movie.genres.map((g) => g.name).join(", ")}`;

    document.getElementById("duree").innerHTML =
        `<span>Durée :</span> ${movie.runtime} min`;
        

    document.getElementById("date").innerHTML =
        `<span>Date de sortie :</span> ${formatDateFR(movie.release_date)}`;

    document.getElementById("note").innerHTML =
        `<span>Note :</span> ${movie.vote_average.toFixed(1)} ⭐`;

    document.getElementById("vote").innerHTML =
        `<span>Votes :</span> ${movie.vote_count}`;

    if (movie.budget === 0) {
        document.getElementById("budget").innerHTML =
            `<span>Budget :</span> - $`;
    } else {
        document.getElementById("budget").innerHTML =
            `<span>Budget :</span> ${movie.budget} $`;
    }

    switch (movie.original_language) {
        case "en":
            document.getElementById("langue").innerHTML =
                `<span>Langue d'origine :</span> Anglais`;
                break;

        case "fr":
            document.getElementById("langue").innerHTML =
                `<span>Langue d'origine :</span> Français`;
                break;

        case "ja":
            document.getElementById("langue").innerHTML =
                `<span>Langue d'origine :</span> Japonais`;
                break;

        case "it":
            document.getElementById("langue").innerHTML =
                `<span>Langue d'origine :</span> Italien`;
                break;

        case "ko":
            document.getElementById("langue").innerHTML =
                `<span>Langue d'origine :</span> Coréen`;
                break;

        case "es":
            document.getElementById("langue").innerHTML =
                `<span>Langue d'origine :</span> Espagnole`;
                break;
        
        case "ru":
            document.getElementById("langue").innerHTML =
                `<span>Langue d'origine :</span> Russe`;
                break;

        default: 
            document.getElementById("langue").innerHTML =
                `<span>Langue d'origine :</span> ${movie.original_language}`;
    }
    

    console.log(movie.status)
    switch (movie.status) {
        case "Released":
            document.getElementById("status").innerHTML =
                `<span>Status :</span> Sortie`;
                break;
        default: 
            document.getElementById("status").innerHTML =
                `<span>Status :</span> ${movie.status}`;
    }
    
}

//Barre de recherche et filtre



if (isIndexPage) {
    search.addEventListener("input", () => {
        Object.keys(filmsByGenre).forEach(renderFilms);
    });

    filter.addEventListener("change", () => {
        Object.keys(filmsByGenre).forEach(renderFilms);
    });

}


if (isDetailPage) {
    const retour = document.querySelector("#home")

    retour.addEventListener("click", () => {
        window.location.href = "./index.html";
    });
}



function formatDateFR(apiDate) {
    if (!apiDate) return "Date inconnue";

    const date = new Date(apiDate);
    const formatted = date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}
