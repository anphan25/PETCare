import { createSlice } from '@reduxjs/toolkit';

// Load bookings from localStorage
const loadBookings = () => {
  try {
    const data = window.localStorage.getItem('petcare-bookings');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const bookingsSlice = createSlice({
  name: 'bookings',
  initialState: {
    items: loadBookings(),
  },
  reducers: {
    addBooking: (state, action) => {
      const booking = action.payload;
      state.items.push({
        ...booking,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      });
    },
    removeBooking: (state, action) => {
      const bookingId = action.payload;
      state.items = state.items.filter((b) => b.id !== bookingId);
    },
    clearBookings: (state) => {
      state.items = [];
    },
  },
});

export const { addBooking, removeBooking, clearBookings } = bookingsSlice.actions;

// Selectors
export const selectBookings = (state) => state.bookings.items;

export default bookingsSlice.reducer;
