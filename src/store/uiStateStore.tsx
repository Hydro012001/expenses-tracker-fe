import { create } from "zustand";

type ButtonState = {
  disabled: boolean;
  setDisabled: (state: boolean) => void;
};

export const useButtonStateStore = create<ButtonState>((set) => ({
  disabled: false,
  setDisabled: (state) => set({ disabled: state }),
}));
