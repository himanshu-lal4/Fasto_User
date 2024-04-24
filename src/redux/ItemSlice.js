import {createSlice} from '@reduxjs/toolkit';
const initialState = {
  selectedItems: [
    {
      Product: 'Milk',
      Category: 'Dairy',
      Quantity: 1,
      Price: 22,
      Description: "Fresh cow's milk.",
      img: require('../assets/images/milk.jpeg'),
    },
    {
      Product: 'Cheese',
      Category: 'Dairy',
      Quantity: 1,
      Price: 20,
      Description: 'Aged cheddar cheese.',
      img: require('../assets/images/cheese.jpeg'),
    },
    {
      Product: 'Eggs',
      Category: 'Dairy',
      Quantity: 1,
      Price: 120,
      Description: 'Farm-fresh large eggs.',
      img: require('../assets/images/eggs.jpeg'),
    },
  ],
};

const itemReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      console.log('ADD PAYLOAD', action.payload);
      return {
        ...state,
        selectedItems: [...state.selectedItems, action.payload],
      };
    case 'DELETE_ITEM':
      console.log('PAYLOAD', action.payload);
      console.log('Current State:', state);
      return {
        ...state,
        selectedItems: state.selectedItems.filter(
          item => item !== action.payload,
        ),
      };
    default:
      return state;
  }
};

export default itemReducer;

export const addItem = (item, quantity) => ({
  type: 'ADD_ITEM',
  payload: item,
});

export const deleteItem = item => ({
  type: 'DELETE_ITEM',
  payload: item,
});
