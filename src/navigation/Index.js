import React, {useEffect} from 'react';
import Login from '../screens/Login';
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
      <StatusBar backgroundColor={COLORS.primaryBackgroundColor} />
      <Stack.Navigator
        initialRouteName="StartUpScreen"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="StartUpScreen" component={StartUpScreen} />
        <Stack.Screen name="Auth" component={Authnavigation} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Index;
