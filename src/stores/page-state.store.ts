import { create } from "zustand";

export interface PageStateStore {
  activeStep: number;
  setActiveStep: (step: number) => void;
}

export const pageStateStore = create<PageStateStore>((set) => ({
  activeStep: 0,
  setActiveStep: (step) => set({ activeStep: step }),
}));
