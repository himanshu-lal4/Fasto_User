import {createSlice} from '@reduxjs/toolkit';

const obj = 
    {
      id: '0',
      data: {
        email: 'deafult@gmail.com',
        imageUrl: 'https://picsum.photos/id/1/5000/3333',
        name: 'Add',
      },
    },
const initialState = {[obj]};
export const userIdSlice = createSlice({
  name: 'sellerData',
  initialState,
  reducers: {
    addSeller: (state, action) => {
    [action.payload, ...state]
    },
  },
});

export const {SetUID} = userIdSlice.actions;
export default userIdSlice.reducer;