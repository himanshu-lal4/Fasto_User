import {configureStore} from '@reduxjs/toolkit';
// import { sharedSlice } from './slice';
import userTokenReducer from './userTokenSlice';
import userIdReducer from './userIdSlice';
const store = configureStore({
  reducer: {
    userToken: userTokenReducer,
    userId: userIdReducer,
  },
});

export default store;
