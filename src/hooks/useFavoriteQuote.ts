import { useEffect, useReducer } from "react";

import type { FavoriteQuote } from "@/types/types";
import { getFavoriteQuoteApi, updateFavoriteQuoteApi } from "@/utils/api";
import { favoriteQuoteReducer } from "@/utils/favoriteQuoteReducer";

interface UseFavoritesQuoteConfig {
  userId: string | undefined;
  isValid: boolean;
  item: FavoriteQuote;
}

export default function useFavoriteQuote(config: UseFavoritesQuoteConfig) {
  const [state, dispatch] = useReducer(favoriteQuoteReducer, {
    favQuote: config.item,
    error: {},
    isValid: true,
  });

  useEffect(() => {
    if (config.item !== undefined) {
      dispatch({ type: "load", quote: config.item });
      return;
    }

    const loadItems = async () => {
      let data: FavoriteQuote = { text: "" };
      try {
        if (config.userId) {
          const res = await getFavoriteQuoteApi(config.userId);
          data = res.quote;
          dispatch({ type: "load", quote: data });
        }
      } catch (error) {
        console.error(error);
        dispatch({
          type: "error",
          error: { fetch: "Favorite quote load failed" },
        });
      }
    };
    loadItems();
  }, [config.item, config.userId]);

  const handleError = (error: { [key: string]: string }) => {
    dispatch({
      type: "error",
      error,
    });
  };

  const handleClearError = (field: string) => {
    dispatch({
      type: "clear",
      field,
    });
  };

  const handleResetError = () => {
    dispatch({
      type: "reset",
    });
  };

  const handleEdit = async (quote: FavoriteQuote) => {
    const previousQuote = quote;
    try {
      dispatch({
        type: "edit",
        quote,
      });
    } catch (error) {
      dispatch({
        type: "edit",
        quote: previousQuote,
      });
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      dispatch({
        type: "error",
        error: { fetch: `Favorite quote edit failed, ${errorMessage}` },
      });
    }
  };

  const handleSave = async (userId: string) => {
    const quote = state.favQuote;
    try {
      // fetch API
      await updateFavoriteQuoteApi(userId, quote);

      dispatch({
        type: "edit",
        quote,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      dispatch({
        type: "error",
        error: { fetch: `Favorite quote save failed, ${errorMessage}` },
      });
      throw error;
    }
  };

  const handleReset = () => {
    dispatch({
      type: "load",
      quote: config.item,
    });
  };

  return {
    state,
    handleError,
    handleClearError,
    handleResetError,
    handleEdit,
    handleSave,
    handleReset,
  };
}
