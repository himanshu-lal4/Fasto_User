import {createSlice} from '@reduxjs/toolkit';

const initialState = {UserId: null};
export const userIdSlice = createSlice({
  name: 'userId',
  initialState,
  reducers: {
    SetUID: (state, action) => {
      state.UserId = action.payload;
    },
  },
});

export const {SetUID} = userIdSlice.actions;
export default userIdSlice.reducer;
