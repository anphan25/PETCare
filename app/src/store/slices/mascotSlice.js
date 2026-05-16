import { createSlice } from '@reduxjs/toolkit';

const mascotSlice = createSlice({
  name: 'mascot',
  initialState: {
    isWagging: false,
    isJumping: false,
  },
  reducers: {
    setWagging: (state, action) => {
      state.isWagging = action.payload;
    },
    setJumping: (state, action) => {
      state.isJumping = action.payload;
    },
  },
});

export const { setWagging, setJumping } = mascotSlice.actions;

// Thunk to replicate the Zustand triggerJump behavior with timeouts
export const triggerJump = () => (dispatch) => {
  dispatch(setJumping(true));
  dispatch(setWagging(true));
  // Reset jump after 0.7s
  setTimeout(() => dispatch(setJumping(false)), 700);
  // Reset wagging after 2s
  setTimeout(() => dispatch(setWagging(false)), 2000);
};

// Selectors
export const selectIsWagging = (state) => state.mascot.isWagging;
export const selectIsJumping = (state) => state.mascot.isJumping;

export default mascotSlice.reducer;
