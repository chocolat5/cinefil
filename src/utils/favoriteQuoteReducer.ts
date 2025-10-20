import type { FavoriteQuote } from "@/types/types";
import type { ValidateError } from "@/utils/validate";

interface State {
  favQuote: FavoriteQuote;
  error: ValidateError | null;
  isValid: boolean;
}

type Action =
  | { type: "load"; quote: FavoriteQuote }
  | { type: "edit"; quote: FavoriteQuote }
  | { type: "error"; error: ValidateError | null }
  | { type: "clear"; field: string }
  | { type: "reset" };

export const favoriteQuoteReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "load": {
      return {
        favQuote: { ...action.quote },
        error: {},
        isValid: true,
      };
    }
    case "edit": {
      return {
        favQuote: { ...action.quote },
        error: {},
        isValid: true,
      };
    }
    case "error": {
      const newErrors = { ...state.error, ...action.error };
      const hasErrors = Object.values(newErrors).some((error) => error !== "");

      return {
        favQuote: { ...state.favQuote },
        error: newErrors,
        isValid: !hasErrors,
      };
    }
    case "clear": {
      const newErrors = { ...state.error, [action.field]: "" };
      const hasErrors = Object.values(newErrors).some((error) => error !== "");

      return {
        favQuote: { ...state.favQuote },
        error: newErrors,
        isValid: !hasErrors,
      };
    }
    case "reset": {
      return {
        favQuote: { ...state.favQuote },
        error: {},
        isValid: true,
      };
    }
  }
};
