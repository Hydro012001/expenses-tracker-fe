import { User } from "@/interface/userInterface";
import { api } from "@/utils/apiHelper";
import { create } from "zustand";

interface AuthState {
  //   user: { role: string } | null;
  login: (user: User, onSuccess: () => void) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(() => ({
  login: async (payload: User, onSuccess) => {
    try {
      const result = await api.post("/login", payload);
      document.cookie = `token=${result.data.token}; path=/; max-age=86400`;
      onSuccess();
    } catch (error) {
      console.error("Error:", error);
    }
  },
  logout: () => {
    console.log("Logout");
  },
}));
