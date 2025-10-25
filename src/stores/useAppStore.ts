import { create } from "zustand";

import type { EditMode, StoreInterface, ToastTypeProps } from "@/types/types";
import { logoutApi } from "@/utils/api";

export const useAppStore = create<StoreInterface>()((set) => ({
  editMode: "none",

  handleEditMode: (newEditMode: EditMode) => {
    set({ editMode: newEditMode });
  },

  logout: async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.error("Logout error:", error);
    }
  },

  // toast
  toast: {
    message: "",
    type: "success",
    isVisible: false,
  },
  showToast: (message: string, type: ToastTypeProps) => {
    set({ toast: { message, type, isVisible: true } });
    setTimeout(() => {
      set({
        toast: {
          message: "",
          type: "success",
          isVisible: false,
        },
      });
    }, 3000);
  },
  closeToast: () => {
    set({
      toast: {
        message: "",
        type: "success",
        isVisible: false,
      },
    });
  },
}));
