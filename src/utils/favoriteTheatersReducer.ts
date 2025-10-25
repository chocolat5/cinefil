interface State {
  favTheaters: string[];
  error: string | null;
  isValid: boolean;
}

type Action =
  | { type: "load"; theaters: string[] }
  | { type: "edit"; theaters: string[] }
  | { type: "error"; error: string | null }
  | { type: "reset" };

export const favoriteTheatersReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "load": {
      return {
        favTheaters: [...action.theaters],
        error: "",
        isValid: true,
      };
    }
    case "edit": {
      return {
        favTheaters: [...action.theaters],
        error: "",
        isValid: true,
      };
    }
    case "error": {
      return {
        favTheaters: [...state.favTheaters],
        error: action.error,
        isValid: false,
      };
    }
    case "reset": {
      return {
        favTheaters: [...state.favTheaters],
        error: "",
        isValid: true,
      };
    }
  }
};
