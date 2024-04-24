import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  // Define your initial state here
  user: {},
};

export const userDataSlice = createSlice({
  name: 'userData',
  initialState,
  reducers: {
    addUserData: (state, action) => {
      // Use the correct syntax to update the state
      // const {userUid, name, email, photoUrl, deviceToken, OS} = action.payload;
      // state.sellers[userUid] = {name, email, photoUrl, deviceToken, OS};
      state.user = action.payload;
    },
  },
});

export const {addUserData} = userDataSlice.actions;
export default userDataSlice.reducer;
