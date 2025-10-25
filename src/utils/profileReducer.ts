import type { Profile } from "@/types/types";
import type { ValidateError } from "@/utils/validate";

interface State {
  profile: Profile;
  error: ValidateError | null;
  isValid: boolean;
}

type Action =
  | { type: "edit"; profile: Profile }
  | { type: "error"; error: ValidateError }
  | { type: "clear"; field: string }
  | { type: "reset" };

export const profileReducer = (state: State, action: Action) => {
  switch (action.type) {
    case "edit": {
      return {
        profile: { ...action.profile },
        error: { ...state.error },
        isValid: state.isValid,
      };
    }
    case "error": {
      const newErrors = { ...state.error, ...action.error };
      const hasErrors = Object.values(newErrors).some((error) => error !== "");

      return {
        profile: { ...state.profile },
        error: newErrors,
        isValid: !hasErrors,
      };
    }
    case "clear": {
      const newErrors = { ...state.error, [action.field]: "" };
      const hasErrors = Object.values(newErrors).some((error) => error !== "");

      return {
        profile: { ...state.profile },
        error: newErrors,
        isValid: !hasErrors,
      };
    }
    case "reset": {
      return {
        ...state,
        error: {},
        isValid: true,
      };
    }
  }
};
