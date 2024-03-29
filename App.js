import React, {useEffect} from 'react';
import Index from './src/navigation/Index';
import {registerNotifee} from './src/components/SendNotification';
import store from './src/redux/store';
import {Provider} from 'react-redux';

const App = () => {
  //setup notification
  useEffect(() => {
    <registerNotifee />;
  }, []);

  return (
    <Provider store={store}>
      <Index />
    </Provider>
  );
};

export default App;
