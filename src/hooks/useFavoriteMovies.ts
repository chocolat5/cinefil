import { useEffect, useReducer, useState } from "react";

import type { FavoriteMovie } from "@/types/types";
import { getFavoriteMoviesApi, updateFavoriteMoviesApi } from "@/utils/api";
import { favoriteReducer } from "@/utils/favoriteReducer";
import { reorderArray } from "@/utils/helpers";

type MovieHandler = (
  id: number,
  title: string,
  posterPath: string,
  year: string
) => void;

interface UseFavoriteMoviesConfig {
  userId: string;
  error: string | null;
  isValid: boolean;
  items: FavoriteMovie[];
}

export default function useFavoriteMovies(config: UseFavoriteMoviesConfig) {
  const [state, dispatch] = useReducer(favoriteReducer, {
    items: config.items,
    error: "",
    isValid: true,
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (config.items !== undefined) {
      dispatch({ type: "load", items: config.items });
      setIsLoading(false);
      return;
    }

    const loadItems = async () => {
      let data: FavoriteMovie[] = [];
      try {
        if (config.userId) {
          const res = await getFavoriteMoviesApi(config.userId);
          data = res.movies as FavoriteMovie[];
        }
      } catch (error) {
        console.error(error);
        dispatch({
          type: "error",
          error: "Load failed",
        });
      } finally {
        setIsLoading(false);
        dispatch({ type: "load", items: data });
      }
    };
    loadItems();
  }, [config.items, config.userId]);

  const handleDelete = async (id: number) => {
    const prevItems = state.items;
    const newItems = state.items.filter((item) => item.id !== id);
    const sortedItems = newItems.map((item, index) => ({
      ...item,
      displayOrder: index + 1,
    }));

    try {
      dispatch({
        type: "update",
        items: sortedItems,
      });
    } catch (error) {
      dispatch({
        type: "update",
        items: prevItems,
      });
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      dispatch({
        type: "error",
        error: `Deleting failed, ${errorMessage}`,
      });
    }
  };

  const handleAdd: MovieHandler = async (
    id: number,
    title: string,
    posterPath: string,
    year: string
  ) => {
    const prevItems = state.items;
    const newItem = { id, title, posterPath, year };
    const displayOrder = state.items.length + 1;
    const isExist = state.items.some((item) => item.id === id);

    try {
      if (isExist) {
        dispatch({
          type: "error",
          error: config.error,
        });
      } else {
        dispatch({
          type: "add",
          item: {
            ...newItem,
            displayOrder,
          },
        });
        setIsOpen(false);
      }
    } catch (error) {
      dispatch({
        type: "update",
        items: prevItems,
      });
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      dispatch({
        type: "error",
        error: `Adding failed, ${errorMessage}`,
      });
    }
  };

  const handleResetError = () => {
    dispatch({
      type: "reset",
    });
  };

  const handleReorder = async (oldIndex: number, newIndex: number) => {
    const prevItems = state.items;
    const newItems = reorderArray(state.items, oldIndex, newIndex);
    const sortedItems = newItems.map((item, index) => ({
      ...item,
      displayOrder: index + 1,
    }));

    try {
      dispatch({
        type: "update",
        items: sortedItems,
      });
    } catch (error) {
      dispatch({
        type: "update",
        items: prevItems,
      });
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      dispatch({
        type: "error",
        error: `Reorder failed, ${errorMessage}`,
      });
    }
  };

  const handleSave = async (userId: string) => {
    const movies = state.items;
    try {
      await updateFavoriteMoviesApi(userId, movies);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      dispatch({
        type: "error",
        error: `Save movies failed, ${errorMessage}`,
      });
    }
  };

  return {
    state,
    isOpen,
    setIsOpen,
    isLoading,
    setIsLoading,
    handleDelete,
    handleResetError,
    handleSave,
    handleAdd,
    handleReorder,
  };
}
