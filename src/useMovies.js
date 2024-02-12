import { useEffect, useState } from "react";
const omdbKey = process.env.REACT_APP_OMDB_API_KEY;

export function useMovies(query, callback) {
  const [isLoading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState([]);

  const [error, setError] = useState("");

  useEffect(() => {
    callback?.();
    const controller = new AbortController();
    const featchMovies = async () => {
      try {
        setIsLoading(true);
        setError("");
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${omdbKey}&s=${query}`,
          { signal: controller.signal }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            "Something went wrong during the movie fetch request"
          );
        }

        if (data.Response === "False") {
          throw new Error("Movie not found");
        }

        setMovies(data.Search);
        setError("");
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    featchMovies();

    return () => {
      controller.abort();
    };
    // eslint-disable-next-line
  }, [query, omdbKey]);

  return { movies, isLoading, error };
}
