import { create } from "zustand";

export interface PageStateStore {
  activeStep: number;
  darkMode: boolean;
  setActiveStep: (step: number) => void;
  setDarkMode: (mode: boolean) => void;
}

export const usePageStateStore = create<PageStateStore>((set) => ({
  activeStep: 0,
  darkMode: true,
  setActiveStep: (step) => set({ activeStep: step }),
  setDarkMode: (mode) => set({ darkMode: mode }),
}));
