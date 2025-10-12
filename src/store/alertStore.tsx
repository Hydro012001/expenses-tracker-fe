import { create } from "zustand";

type AlertType = "info" | "success" | "error";

interface AlertState {
  message: string;
  title?: string;
  type: AlertType;
  visible: boolean;
  showAlert: (message: string, type?: AlertType, title?: string) => void;
  hideAlert: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  message: "",
  title: "",
  type: "info",
  visible: false,
  showAlert: (message, type = "info", title = "") =>
    set({ message, type, title, visible: true }),
  hideAlert: () => set({ visible: false }),
}));
