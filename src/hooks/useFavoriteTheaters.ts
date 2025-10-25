import { useEffect, useReducer } from "react";

import { getFavoriteTheatersApi, updateFavoriteTheaterApi } from "@/utils/api";
import { favoriteTheatersReducer } from "@/utils/favoriteTheatersReducer";

interface UseFavoritesTheatersConfig {
  userId: string | undefined;
  error: string | null;
  isValid: boolean;
  items: string[];
}

export default function useFavoriteTheaters(
  config: UseFavoritesTheatersConfig
) {
  const [state, dispatch] = useReducer(favoriteTheatersReducer, {
    favTheaters: config.items,
    error: "",
    isValid: true,
  });

  useEffect(() => {
    if (config.items !== undefined) {
      dispatch({ type: "load", theaters: config.items });
      return;
    }

    const loadItems = async () => {
      let data: string[] = [];
      try {
        if (config.userId) {
          const res = await getFavoriteTheatersApi(config.userId);
          data = res.theaters;
          dispatch({ type: "load", theaters: data });
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

  const handleError = (error?: string) => {
    dispatch({
      type: "error",
      error: error || config.error,
    });
  };

  const handleResetError = () => {
    dispatch({
      type: "reset",
    });
  };

  const handleEdit = async (theaters: string[]) => {
    const previousTheaters = theaters;
    try {
      dispatch({
        type: "edit",
        theaters,
      });
    } catch (error) {
      dispatch({
        type: "edit",
        theaters: previousTheaters,
      });
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      dispatch({
        type: "error",
        error: `Top 3 theaters edit failed, ${errorMessage}`,
      });
    }
  };

  const handleSave = async (userId: string) => {
    const theaters = state.favTheaters;
    try {
      // fetch API
      await updateFavoriteTheaterApi(userId, theaters);

      dispatch({
        type: "edit",
        theaters,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      dispatch({
        type: "error",
        error: `Top 3 theaters save failed, ${errorMessage}`,
      });
    }
  };

  return {
    state,
    handleError,
    handleResetError,
    handleEdit,
    handleSave,
  };
}
