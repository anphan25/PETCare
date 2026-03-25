import { create } from "zustand";

interface MascotState {
  isWagging: boolean;
  isJumping: boolean;
  setWagging: (wagging: boolean) => void;
  triggerJump: () => void;
}

export const useMascotStore = create<MascotState>((set) => ({
  isWagging: false,
  isJumping: false,
  setWagging: (wagging) => set({ isWagging: wagging }),
  triggerJump: () => {
    set({ isJumping: true, isWagging: true });
    setTimeout(() => set({ isJumping: false }), 700); // Nhảy trong 0.7s
    setTimeout(() => set({ isWagging: false }), 2000); // 2s cúp đuôi
  }
}));