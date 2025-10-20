import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactElement } from "react";

import classes from "@/components/favorites/Favorite.module.css";
import ErrorText from "@/components/ui/ErrorText";
import Loading from "@/components/ui/Loading";
import Modal from "@/components/ui/Modal";
import TextInput from "@/components/ui/TextInput";
import type { FavoritePerson } from "@/types/types";
import { debounce } from "@/utils/debounce";
import { searchPeople } from "@/utils/tmdb";

interface SearchPersonProps {
  department: "Directing" | "Acting";
  isOpen: boolean;
  onClose: () => void;
  onAdd: (id: number, name: string, profilePath: string) => void;
  onResetError: () => void;
  error: string | null;
}

export default function SearchPerson({
  department,
  isOpen,
  onClose,
  onAdd,
  onResetError,
  error,
}: SearchPersonProps): ReactElement | null {
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<{
    data: FavoritePerson[];
    error: string;
  } | null>(null);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    let ignore = false;
    async function fetching() {
      // start searching
      setResult(null);
      setIsLoading(true);

      const { data, error } = await searchPeople(department, query);
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
  }, [department, query]);

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Search ${department === "Directing" ? "Director" : "Actor"}`}
    >
      <>
        <TextInput
          type="text"
          name="parson"
          placeholder="Type for a person name ..."
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
                  {result.data.map((person) => (
                    <button
                      key={person.id}
                      className={classes.searchButton}
                      onClick={() =>
                        onAdd(person.id, person.name, person.profilePath)
                      }
                    >
                      {person.name}
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
