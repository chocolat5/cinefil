import { PUBLIC_API_BASE_URL } from "@/config/constants";
import type { ApiError } from "@/types/types";

export const reorderArray = <T>(
  array: T[],
  oldIndex: number,
  newIndex: number
): T[] => {
  const newList = [...array];
  const movedItem = newList.splice(oldIndex, 1)[0];
  newList.splice(newIndex, 0, movedItem);
  return newList;
};

export const getErrorMessage = (error: ApiError | unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && error !== null && "type" in error) {
    const apiError = error as ApiError;
    switch (apiError.type) {
      case "network":
        return "Please check your internet connection";
      case "auth":
        return "Authentication required. Please log in again";
      case "validation":
        return apiError.message || "Please check your input";
      case "parse":
        return "Invalid response format. Please try again";
      default:
        return "An error occurred. Please try again later";
    }
  }

  return "An unknown error occurred";
};

export const getQrCodeImage = (userId: string): string => {
  return `${PUBLIC_API_BASE_URL}/api/users/${userId}/qr-code`;
};
