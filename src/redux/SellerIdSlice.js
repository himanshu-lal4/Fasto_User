import {createSlice} from '@reduxjs/toolkit';

const initialState = {UID: null};
export const sellerIdSlice = createSlice({
  name: 'sellerId',
  initialState,
  reducers: {
    setSellerId: (state, action) => {
      state.UID = action.payload;
    },
  },
});

export const {setSellerId} = sellerIdSlice.actions;
export default sellerIdSlice.reducer;
