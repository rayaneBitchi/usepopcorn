import { useState, useEffect, useRef } from "react";
import StarRating from "./StarRating";
import Loader from "./Loader";
import { useKey } from "./useKey";
const omdbKey = process.env.REACT_APP_OMDB_API_KEY;

export default function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");

  const countRef = useRef(0);

  useEffect(() => {
    if (userRating) countRef.current++;
  }, [userRating]);

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  useEffect(() => {
    const fetchMovie = async () => {
      setIsLoading(true);
      const res = await fetch(
        `https://www.omdbapi.com/?apikey=${omdbKey}&i=${selectedId}`
      );
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    };
    fetchMovie();
  }, [selectedId]);

  const movieInWatched = watched.find((movie) => movie.imdbID === selectedId);

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: runtime !== "N/A" ? Number(runtime.split(" ")[0]) : 0,
      userRating: userRating ? Number(userRating) : 0,
      countRatingDecisions: countRef.current,
    };
    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useEffect(() => {
    document.title = title ? `Movie | ${title}` : "Movie";

    return () => {
      document.title = "usePopcorn";
    };
  }, [title]);

  useKey("Escape", onCloseMovie);

  return (
    <div className='details'>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className='btn-back' onClick={onCloseMovie}>
              <svg
                width='16px'
                height='16px'
                viewBox='0 0 24 24'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'>
                <path
                  d='M5 12H19M5 12L11 6M5 12L11 18'
                  stroke='#000000'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </button>
            <img src={poster} alt={`${title} poster`} />
            <div className='details-overview'>
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className='rating'>
              {!movieInWatched ? (
                <>
                  {" "}
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />{" "}
                  {userRating > 0 ? (
                    <button className='btn-add' onClick={handleAdd}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          gap: ".5rem",
                        }}>
                        <img
                          className='addToListIcon'
                          src='../add-to-list.svg'
                          alt='Add to list icon'
                        />
                        Add to list
                      </div>
                    </button>
                  ) : null}{" "}
                </>
              ) : (
                <p>
                  You rated this movie {movieInWatched.userRating}{" "}
                  <span>⭐</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starting {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
