import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    profile: null,
    isLoading: true,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.profile = null;
      state.isLoading = false;
    },
  },
});

export const { setUser, setProfile, setLoading, logout } = authSlice.actions;

// Selectors
export const selectUser = (state) => state.auth.user;
export const selectProfile = (state) => state.auth.profile;
export const selectIsLoading = (state) => state.auth.isLoading;

export default authSlice.reducer;
