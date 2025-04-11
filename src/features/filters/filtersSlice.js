import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: 'all', // 'all' | 'active' | 'completed'
  colors: [], // ['green', 'blue', 'orange', 'purple', 'red']
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    statusFilterChanged(state, action) {
      state.status = action.payload;
    },
    colorFilterChanged(state, action) {
      const { color, changeType } = action.payload;
      switch (changeType) {
        case 'added': {
          if (!state.colors.includes(color)) {
            state.colors.push(color);
          }
          break;
        }
        case 'removed': {
          state.colors = state.colors.filter(
            (existingColor) => existingColor !== color
          );
          break;
        }
        default:
          return;
      }
    },
  },
});

export const { statusFilterChanged, colorFilterChanged } = filtersSlice.actions;

export const selectStatus = (state) => state.filters.status;
export const selectColors = (state) => state.filters.colors;

export default filtersSlice.reducer; 