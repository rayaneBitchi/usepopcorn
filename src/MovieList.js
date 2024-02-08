import Movie from "./Movie";

export default function MovieList({ movies, onSelectMovie, selectedId }) {
  return (
    <ul className='list list-movies'>
      {movies?.map((movie) => (
        <Movie
          key={movie.imdbID}
          movie={movie}
          onSelectMovie={onSelectMovie}
          selectedId={selectedId}
        />
      ))}
    </ul>
  );
}
