import {configureStore} from '@reduxjs/toolkit';
// import { sharedSlice } from './slice';
import userTokenReducer from './userTokenSlice';
import userIdReducer from './userIdSlice';
import sellerIdReducer from './SellerIdSlice';
import userDataReducer from './userDataSlice';
const store = configureStore({
  reducer: {
    userToken: userTokenReducer,
    userId: userIdReducer,
    sellerId: sellerIdReducer,
    userData: userDataReducer,
  },
});

export default store;
