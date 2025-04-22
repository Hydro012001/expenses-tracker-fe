import { api } from "@/utils/apiHelper";
import { create } from "zustand";

interface User {
  name?: string;
  email: string;
  password: string;
}

interface UserStoreState {
  user: User;
  setUser: (user: Partial<User>) => void;
  fecthUser: () => void;
  clearUser: () => void;
}

export const userStore = create<UserStoreState>()((set) => ({
  user: {
    name: "",
    email: "",
    password: "",
  },
  setUser: (updateUser) =>
    set((state) => ({ user: { ...state.user, ...updateUser } })),
  clearUser: () => set({ user: { name: "", email: "", password: "" } }),

  fecthUser: async () => {
    try {
      const result = await api.get("/user/get-user");
      set({ user: result.data });
    } catch (error) {
      console.error("Error:", error);
    }
  },
}));
