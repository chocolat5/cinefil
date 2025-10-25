import type { ReactElement } from "react";

import classes from "@/components/favorites/Favorite.module.css";
import FavoriteGenresView from "@/components/favorites/FavoriteGenresView";
import SectionContainer from "@/components/layout/SectionContainer";
import { Actions } from "@/components/ui/Actions";
import Chip from "@/components/ui/Chip";
import ErrorText from "@/components/ui/ErrorText";
import { FAVORITES_MAP } from "@/config/constants";
import { MOVIE_GENRES } from "@/config/genres";
import useFavoriteGenres from "@/hooks/useFavoriteGenres";
import { useAppStore } from "@/stores/useAppStore";
import type { FavoriteGenre } from "@/types/types";
import { getGenreName } from "@/utils/genres";
import { handleApiError } from "@/utils/useErrorHandler";

interface FavoriteGenresEditProps {
  userId: string | undefined;
  userFavGenres: FavoriteGenre[];
}

export default function FavoriteGenresEdit({
  userId,
  userFavGenres,
}: FavoriteGenresEditProps): ReactElement {
  const { handleEditMode, editMode, showToast } = useAppStore();
  const genreData = useFavoriteGenres({
    items: userFavGenres,
    userId: userId as string,
    error: `Oops! You can choose 3 genres.`,
    isValid: true,
  });

  const allGenres = MOVIE_GENRES;

  const onSave = async () => {
    try {
      await genreData.handleSave(userId as string);
      genreData.handleResetError();
    } catch (error) {
      handleApiError(error, `save genres`);
    } finally {
      showToast(`Top 3 Genres updated!`, "success");
      handleEditMode("none");
    }
  };

  const key = "genres";

  return (
    <SectionContainer
      currentEditMode={key}
      onClick={() => handleEditMode(key)}
      title={FAVORITES_MAP[key].title}
    >
      {editMode === key ? (
        <>
          <div className={classes.container}>
            <div className={classes.chipWrap}>
              {allGenres.map((genre) => {
                const isSelected = genreData.state.items.some(
                  (s) => s.id === genre.id
                );
                return (
                  <Chip
                    key={genre.id}
                    label={getGenreName(genre.id)}
                    variant={isSelected ? "contained" : "solid"}
                    onClick={
                      isSelected
                        ? () => genreData.handleDelete(genre.id)
                        : () => genreData.handleAdd(genre.id)
                    }
                  />
                );
              })}
            </div>
            {genreData.state.error && (
              <ErrorText>{genreData.state.error}</ErrorText>
            )}
            <Actions
              onCancel={() => handleEditMode("none")}
              onSave={() => onSave()}
              disableSave={!genreData.state.isValid}
            />
          </div>
        </>
      ) : (
        <FavoriteGenresView items={genreData.state.items} />
      )}
    </SectionContainer>
  );
}
