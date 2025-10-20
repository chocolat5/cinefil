import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactElement } from "react";

import classes from "@/components/favorites/Favorite.module.css";
import ErrorText from "@/components/ui/ErrorText";
import Loading from "@/components/ui/Loading";
import Modal from "@/components/ui/Modal";
import TextInput from "@/components/ui/TextInput";
import type { FavoriteMovie } from "@/types/types";
import { debounce } from "@/utils/debounce";
import { searchMovies } from "@/utils/tmdb";

interface SearchMovieProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (id: number, title: string, posterPath: string, year: string) => void;
  onResetError: () => void;
  error: string | null;
}

export default function SearchMovie({
  isOpen,
  onClose,
  onAdd,
  onResetError,
  error,
}: SearchMovieProps): ReactElement | null {
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{
    data: FavoriteMovie[];
    error: string;
  } | null>(null);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    let ignore = false;
    async function fetching() {
      // start searching
      setResult(null);
      setIsLoading(true);

      const { data, error } = await searchMovies(query);
      if (!ignore) {
        setResult({ data, error });
        setIsLoading(false);
      }
    }
    fetching();
    return () => {
      ignore = true;
      setIsLoading(false);
    };
  }, [query]);

  useEffect(() => {
    if (isOpen === false) {
      setQuery("");
      setInputValue("");
    }
  }, [isOpen]);

  const handleOnChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const debounceHandleOnChange = useMemo(() => {
    return debounce(handleOnChange, 300);
  }, [handleOnChange]);

  // clean up debounce
  useEffect(() => {
    return () => {
      debounceHandleOnChange.cancel();
    };
  }, [debounceHandleOnChange]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Search Movies">
      <>
        <TextInput
          name="movie"
          type="text"
          placeholder="Type for a movie ..."
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            onResetError();
            debounceHandleOnChange(e.target.value);
          }}
          autoFocus
        />
        {error && <ErrorText>{error}</ErrorText>}
        <div className={classes.searchResultContainer}>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              {result?.error && <ErrorText>{result.error}</ErrorText>}
              {result !== null && result.data.length > 0 ? (
                <>
                  {result.data.map((movie) => (
                    <button
                      key={movie.id}
                      className={classes.searchButton}
                      onClick={() =>
                        onAdd(
                          movie.id,
                          movie.title,
                          movie.posterPath,
                          movie.year
                        )
                      }
                    >
                      {movie.title}
                    </button>
                  ))}
                </>
              ) : (
                <>{query !== "" && <p>No Result for {query} ...</p>}</>
              )}
            </>
          )}
        </div>
      </>
    </Modal>
  );
}
