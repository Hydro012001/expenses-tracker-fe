import { User } from "@/interface/userAuthInterface";
import { api } from "@/utils/apiHelper";
import { create } from "zustand";
import { useAlertStore } from "./alertStore";
import axios from "axios";
import { handleAxiosError } from "@/utils/axiosErrorHelper";
import { removeToken } from "@/utils/authUtils";

interface AuthState {
  login: (user: User, onSuccess: () => void) => void;
  logout: () => void;
  verify: (token: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>(() => ({
  login: async (payload: User, onSuccess) => {
    try {
      const result = await api.post("/login", payload);
      document.cookie = `expenses_token=${result.data.token}; path=/; max-age=86400`;
      onSuccess();
    } catch (error: unknown) {
      const { showAlert } = useAlertStore.getState();
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;

        switch (status) {
          case 401:
            showAlert("User credentials not found!", "error", "Failed");
            break;
          case 404:
            showAlert("Email not found!", "error", "Failed");
            break;
          case 403:
            showAlert("Account not verified!", "error", "Failed");
            break;
          default:
            showAlert("Something went wrong!", "error", "Error");
            break;
        }
      } else {
        console.error("Unexpected error:", error);
        showAlert("Unexpected error occurred!", "error", "Error");
      }
    }
  },
  logout: () => {
    console.log("Logout");
    removeToken("expenses_token");
    window.location.href = "/#/login";
  },
  verify: async (token) => {
    try {
      const result = await api.get(`/verify?token=${token}`);

      if (result.data.verified) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      handleAxiosError(error);
      return false;
    }
  },
}));
