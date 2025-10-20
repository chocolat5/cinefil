import { useAppStore } from "@/stores/useAppStore";
import type { ApiError } from "@/types/types";
import { getErrorMessage } from "@/utils/helpers";

export const handleApiError = (error: unknown, context?: string) => {
  const { showToast } = useAppStore.getState();

  const apiError = error as ApiError;
  const message = getErrorMessage(apiError);
  showToast(message, "error");

  if (import.meta.env.DEV && context) {
    console.error(`{${context}}`, error);
  }
};
