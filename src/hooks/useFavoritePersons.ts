import { useEffect, useReducer, useState } from "react";

import type { FavoritePerson } from "@/types/types";
import {
  updateFavoriteActorsApi,
  updateFavoriteDirecrosApi,
} from "@/utils/api";
import { favoriteReducer } from "@/utils/favoriteReducer";
import { reorderArray } from "@/utils/helpers";
import { getActors, getDirectors } from "@/utils/persons";

type PersonHandler = (id: number, name: string, profilePath: string) => void;

interface UseFavoritesConfig {
  userId: string;
  itemsKey: "favDirectors" | "favActors";
  error: string | null;
  isValid: boolean;
  items: FavoritePerson[];
}

export default function useFavoritePersons(config: UseFavoritesConfig) {
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
      let data: FavoritePerson[] = [];
      try {
        if (config.userId) {
          data =
            config.itemsKey === "favDirectors"
              ? await getDirectors(config.userId as string)
              : await getActors(config.userId as string);
          dispatch({ type: "load", items: data });
        }
      } catch (error) {
        console.error(error);
        dispatch({
          type: "error",
          error: "Load failed",
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadItems();
  }, [config.items, config.itemsKey, config.userId]);

  const handleDelete = async (id: number) => {
    try {
      dispatch({
        type: "delete",
        id,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      dispatch({
        type: "error",
        error: `Deleting failed, ${errorMessage}`,
      });
    }
  };

  const handleAdd: PersonHandler = async (
    id: number,
    name: string,
    profilePath: string
  ) => {
    const newItem = { id, name, profilePath };
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
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      dispatch({
        type: "error",
        error: `Reorder failed, ${errorMessage}`,
      });
    }
  };

  const handleSave = async (userId: string) => {
    try {
      switch (config.itemsKey) {
        case "favDirectors": {
          await updateFavoriteDirecrosApi(userId, state.items);
          break;
        }
        case "favActors": {
          await updateFavoriteActorsApi(config.userId, state.items);
          break;
        }
        default:
          console.error("Invalid itemsKey");
      }
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
