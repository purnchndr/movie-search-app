import React, { useState, useEffect } from "react";
import "../index.css";

const API_KEY = "c86b1f7";
const API_URL = "https://www.omdbapi.com/";

const SearchBar = ({ searchTerm, setSearchTerm, searchMovies }) => (
  <div className="search-bar">
    <input
      type="text"
      placeholder="Search for a movie..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <button onClick={searchMovies}>Search</button>
  </div>
);

const MovieCard = ({ movie, fetchMovieDetails }) => (
  <div className="movie-card" onClick={() => fetchMovieDetails(movie.imdbID)}>
    <img src={movie.Poster} alt={movie.Title} className="movie-poster" />
    <h3 className="movie-title">
      {movie.Title} ({movie.Year})
    </h3>
  </div>
);

const MovieDetails = ({ selectedMovie, setSelectedMovie }) => (
  <div className="movie-details">
    <img
      src={selectedMovie.Poster}
      alt={selectedMovie.Title}
      className="movie-details-poster-full"
    />
    <h2>{selectedMovie.Title}</h2>
    <p>
      <strong>Year:</strong> {selectedMovie.Year}
    </p>
    <p>
      <strong>Plot:</strong> {selectedMovie.Plot}
    </p>
    <p>
      <strong>Actors:</strong> {selectedMovie.Actors}
    </p>
    <button onClick={() => setSelectedMovie(null)}>Back</button>
  </div>
);

export default function MovieSearchApp() {
  const [searchTerm, setSearchTerm] = useState("");
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchTopMovies();
  }, []);

  const fetchTopMovies = async () => {
    const response = await fetch(
      `${API_URL}?s=popular&apikey=${API_KEY}&page=1`
    );
    const data = await response.json();
    setMovies(data.Search || []);
  };

  const searchMovies = async () => {
    if (!searchTerm) return;
    const response = await fetch(
      `${API_URL}?s=${searchTerm}&apikey=${API_KEY}`
    );
    const data = await response.json();
    setMovies(data.Search || []);
  };

  const fetchMovieDetails = async (imdbID) => {
    const response = await fetch(`${API_URL}?i=${imdbID}&apikey=${API_KEY}`);
    const data = await response.json();
    setSelectedMovie(data);
  };

  return (
    <div className={`container full-screen ${darkMode ? "dark" : "light"}`}>
      <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchMovies={searchMovies}
      />
      {selectedMovie ? (
        <MovieDetails
          selectedMovie={selectedMovie}
          setSelectedMovie={setSelectedMovie}
        />
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <MovieCard
              key={movie.imdbID}
              movie={movie}
              fetchMovieDetails={fetchMovieDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
}
