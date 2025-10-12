import { api } from "@/utils/apiHelper";
import { create } from "zustand";
import { useAlertStore } from "./alertStore";
import { handleAxiosError } from "@/utils/axiosErrorHelper";
interface User {
  name?: string;
  email: string;
  password?: string;
  address?: string;
  phone_number?: string;
  createdAt?: string;
}

interface UserStoreState {
  user: User;
  setUser: (user: Partial<User>) => void;
  addUser: (user: User) => void;
  fecthUser: () => void;
  clearUser: () => void;
  updateUser: (user: User) => void;
}

export const userStore = create<UserStoreState>()((set) => ({
  user: {
    name: "",
    email: "",
    address: "",
    phone_number: "",
  },
  setUser: (updateUser) =>
    set((state) => ({ user: { ...state.user, ...updateUser } })),
  clearUser: () => set({ user: { name: "", email: "" } }),

  fecthUser: async () => {
    try {
      const result = await api.get("/user/get-user");
      set({ user: result.data });
    } catch (error) {
      console.log(error);
      // handleAxiosError(error);
    }
  },
  addUser: async (user: User) => {
    const { showAlert } = useAlertStore.getState();
    try {
      await api.post("/signup", user);
      showAlert(
        "We’ve sent a verification link to your email. \nPlease check your inbox and click the link to verify your account before logging in",
        "info",
        "Verification Email Sent"
      );
    } catch (error) {
      handleAxiosError(error);
    }
  },
  updateUser: async (user: User) => {
    const { showAlert } = useAlertStore.getState();
    try {
      const result = await api.post("/user/update-user", user);

      set({ user: result.data.user });
      showAlert("Information successfully updated!", "success", "Success");
    } catch (error) {
      handleAxiosError(error);
    }
  },
}));
