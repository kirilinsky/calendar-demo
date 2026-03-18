import { create } from "zustand";

export interface PageStateStore {
  activeStep: number;
  lightMode: boolean;
  setActiveStep: (step: number) => void;
  setLightMode: (mode: boolean) => void;
}

export const usePageStateStore = create<PageStateStore>((set) => ({
  activeStep: 0,
  lightMode: true,
  setActiveStep: (step) => set({ activeStep: step }),
  setLightMode: (mode) => set({ lightMode: mode }),
}));
