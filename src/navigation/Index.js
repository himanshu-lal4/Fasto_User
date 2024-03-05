import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import StartUpScreen from '../screens/StartUpScreen';
import Authnavigation from './Authnavigation';
import {COLORS} from '../assets/theme';

const Stack = createStackNavigator();

const Index = () => {
  return (
    <NavigationContainer>
      <StatusBar barStyle={'light-content'} backgroundColor={COLORS.blue} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Auth" component={Authnavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Index;
