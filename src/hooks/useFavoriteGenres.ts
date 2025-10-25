import { useEffect, useReducer } from "react";

import type { FavoriteGenre } from "@/types/types";
import { getFavoriteGenresApi, updateFavoriteGenresApi } from "@/utils/api";
import { favoriteReducer } from "@/utils/favoriteReducer";

interface UseFavoritesGenresConfig {
  userId: string | undefined;
  error: string | null;
  isValid: boolean;
  items: FavoriteGenre[];
}

export default function useFavoriteGenres(config: UseFavoritesGenresConfig) {
  const [state, dispatch] = useReducer(favoriteReducer, {
    items: config.items,
    error: "",
    isValid: true,
  });

  useEffect(() => {
    if (config.items !== undefined) {
      dispatch({ type: "load", items: config.items });
      return;
    }

    const loadItems = async () => {
      let data: FavoriteGenre[] = [];
      try {
        if (config.userId) {
          const res = await getFavoriteGenresApi(config.userId);
          data = res.genres as FavoriteGenre[];
          dispatch({ type: "load", items: data });
        }
      } catch (error) {
        console.error(error);
        dispatch({
          type: "error",
          error: "Load failed",
        });
      }
    };
    loadItems();
  }, [config.items, config.userId]);

  const handleError = () => {
    dispatch({
      type: "error",
      error: config.error,
    });
  };

  const handleResetError = () => {
    dispatch({
      type: "reset",
    });
  };

  const handleAdd = async (id: number) => {
    const newItem = { id };
    try {
      if (state.items.length === 3) {
        dispatch({
          type: "warning",
          error: config.error,
        });
        // don't proceed with API call
        return;
      } else {
        // fetch API
        // await addFavoriteGenreApi(userId, newItem);
        dispatch({
          type: "add",
          item: newItem,
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      dispatch({
        type: "error",
        error: `Adding genre failed, ${errorMessage}`,
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      // fetch API
      // await deleteFavoriteGenreApi(userId, id);
      dispatch({
        type: "delete",
        id,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      dispatch({
        type: "error",
        error: `Deleting genre failed, ${errorMessage}`,
      });
    }
  };

  const handleSave = async (userId: string) => {
    const genres = state.items;
    try {
      await updateFavoriteGenresApi(userId, genres);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      dispatch({
        type: "error",
        error: `Save Top 3 Genres failed, ${errorMessage}`,
      });
    }
  };

  return {
    state,
    handleError,
    handleResetError,
    handleSave,
    handleAdd,
    handleDelete,
  };
}
