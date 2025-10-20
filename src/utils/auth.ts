import { getErrorMessage } from "./helpers";
import type { ApiError } from "@/types/types";
import { verifyLoginCodeApi } from "@/utils/api";

export const verifyLoginCode = async (loginCode: number) => {
  try {
    const res = await verifyLoginCodeApi(loginCode);
    if (!res) {
      throw new Error("Invalid or expired code");
    }
    if (!res.valid) {
      throw new Error(
        res.error ||
          "Your verification code has expired. Please request a new one."
      );
    }
    return res;
  } catch (error) {
    const apiError = error as ApiError;
    const errorMsg = apiError.message || "Invalid or expired verification code";
    throw new Error(errorMsg);
  }
};

/**
 *
 * for astro file
 *
 */
export const parseToken = (token: string) => {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      userId: payload.userId,
      tokenType: payload.type,
      exp: payload.exp,
    };
  } catch (error) {
    const apiError = error as ApiError;
    return { success: false, error: getErrorMessage(apiError) };
  }
};

export const checkCurrentUser = (sessionToken: string, userId: string) => {
  try {
    const tokenData = parseToken(sessionToken);
    if (tokenData) {
      return tokenData.userId === userId;
    }
    return false;
  } catch (error) {
    const apiError = error as ApiError;
    return { success: false, error: getErrorMessage(apiError) };
  }
};

export const checkAuth = (sessionToken: string) => {
  try {
    if (sessionToken) {
      return parseToken(sessionToken) !== null;
    }
    return false;
  } catch {
    return false;
  }
};
