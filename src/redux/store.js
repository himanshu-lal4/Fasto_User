import {configureStore} from '@reduxjs/toolkit';
// import { sharedSlice } from './slice';
import userTokenReducer from './userTokenSlice';
const store = configureStore({
  reducer: {
    userToken: userTokenReducer,
  },
});

export default store;
