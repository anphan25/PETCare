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
    // Reset jump after 0.7s
    setTimeout(() => set({ isJumping: false }), 700); 
    // Reset wagging after 2s
    setTimeout(() => set({ isWagging: false }), 2000); 
  }
}));