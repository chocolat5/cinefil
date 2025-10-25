import type { ReactElement } from "react";

import classes from "@/components/favorites/Favorite.module.css";
import FavoriteMoviesView from "@/components/favorites/FavoriteMoviesView";
import Poster from "@/components/favorites/Poster";
import SearchMovie from "@/components/favorites/SearchMovie";
import SectionContainer from "@/components/layout/SectionContainer";
import { Actions } from "@/components/ui/Actions";
import NoResult from "@/components/ui/NoResult";
import { FAVORITES_MAP } from "@/config/constants";
import useFavoriteMovies from "@/hooks/useFavoriteMovies";
import { useAppStore } from "@/stores/useAppStore";
import type { FavoriteMovie } from "@/types/types";
import { handleApiError } from "@/utils/useErrorHandler";

interface FavoriteMoviesEditProps {
  userFavMovies: FavoriteMovie[];
  userId: string;
}

export default function FavoriteMoviesEdit({
  userFavMovies,
  userId,
}: FavoriteMoviesEditProps): ReactElement {
  const { handleEditMode, editMode, showToast } = useAppStore();
  const movieData = useFavoriteMovies({
    items: userFavMovies,
    userId: userId as string,
    error: "You really like this movie! But it’s already selected.",
    isValid: true,
  });

  const onSave = async () => {
    movieData.setIsLoading(true);
    try {
      await movieData.handleSave(userId);
      movieData.handleResetError();
    } catch (error) {
      handleApiError(error, "save movies");
    } finally {
      showToast(`Favorite films updated!`, "success");
      handleEditMode("none");
      movieData.setIsLoading(false);
    }
  };

  const emptyNum = 6 - movieData.state.items.length;
  const key = "movies";

  return (
    <SectionContainer
      currentEditMode={key}
      onClick={() => handleEditMode(key)}
      title={FAVORITES_MAP[key].title}
    >
      {editMode === key ? (
        <>
          {movieData.state.items.length > 1 && (
            <p className={classes.movieDescription}>
              You can change the order with drag and drop
            </p>
          )}
          {movieData.state.items.length > 0 ? (
            <div className={classes.movieContainer}>
              {movieData.state.items.map((item) => (
                <Poster
                  key={item.id}
                  id={item.id}
                  order={item.displayOrder as number}
                  title={item.title}
                  posterPath={item.posterPath}
                  year={item.year}
                  onDelete={movieData.handleDelete}
                  onReorder={movieData.handleReorder}
                  isEdit
                />
              ))}
              {emptyNum > 0 &&
                Array.from({ length: emptyNum }).map((_, i) => (
                  <div key={i} className={classes.movieBlank}></div>
                ))}
            </div>
          ) : (
            <NoResult name="films" />
          )}
          <Actions
            disableAdd={emptyNum === 0}
            disableSave={!movieData.state.isValid}
            onAdd={() => movieData.setIsOpen(true)}
            onCancel={() => handleEditMode("none")}
            onSave={() => onSave()}
          />
          <SearchMovie
            isOpen={movieData.isOpen}
            onClose={() => {
              movieData.handleResetError();
              movieData.setIsOpen(false);
            }}
            onAdd={movieData.handleAdd}
            onResetError={movieData.handleResetError}
            error={movieData.state.error}
          />
        </>
      ) : (
        <FavoriteMoviesView items={movieData.state.items} />
      )}
    </SectionContainer>
  );
}
