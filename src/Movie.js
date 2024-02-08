export default function Movie({ movie, onSelectMovie, selectedId }) {
  return (
    <li
      key={movie.imdbID}
      onClick={() => onSelectMovie(movie.imdbID)}
      className={selectedId === movie.imdbID ? "movie-active" : ""}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
