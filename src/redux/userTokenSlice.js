import {createSlice} from '@reduxjs/toolkit';
const initialState = {UID: null};
export const sharedSlice = createSlice({
  name: 'userToken',
  initialState,
  reducers: {
    addUID: (state, action) => {
      state.UID = action.payload;
    },
  },
});

export const {addUID} = sharedSlice.actions;
export default sharedSlice.reducer;
