import {View, Text} from 'react-native';
import React from 'react';
import Index from './src/navigation/Index';
import {PaperProvider} from 'react-native-paper';

const App = () => {
  return (
    <PaperProvider>
      <Index />
    </PaperProvider>
  );
};

export default App;
