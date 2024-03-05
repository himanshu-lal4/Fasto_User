import {createSlice} from '@reduxjs/toolkit';

const initialState = {UID: null};
export const userIdSlice = createSlice({
  name: 'userId',
  initialState,
  reducers: {
    SetUID: (state, action) => {
      state.UID = action.payload;
    },
  },
});

export const {SetUID} = userIdSlice.actions;
export default userIdSlice.reducer;
