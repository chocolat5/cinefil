interface State<T> {
  items: T[];
  error: string | null;
  isValid: boolean;
}

type Action<T> =
  | { type: "load"; items: T[] }
  | { type: "add"; item: T }
  | { type: "update"; items: T[] }
  | { type: "delete"; id: number }
  | { type: "error"; error: string | null }
  | { type: "warning"; error: string | null }
  | { type: "reset" };

export const favoriteReducer = <T extends { id: number }>(
  state: State<T>,
  action: Action<T>
) => {
  switch (action.type) {
    case "load": {
      return {
        items: [...action.items],
        error: "",
        isValid: true,
      };
    }
    case "add": {
      return {
        items: [...state.items, action.item],
        error: "",
        isValid: true,
      };
    }
    case "update": {
      return {
        items: [...action.items],
        error: "",
        isValid: true,
      };
    }
    case "delete": {
      return {
        items: state.items.filter((item) => item.id !== action.id),
        error: "",
        isValid: true,
      };
    }
    case "error": {
      return {
        items: [...state.items],
        error: action.error,
        isValid: false,
      };
    }
    case "warning": {
      return {
        items: [...state.items],
        error: action.error,
        isValid: true,
      };
    }
    case "reset": {
      return {
        items: [...state.items],
        error: "",
        isValid: true,
      };
    }
  }
};
