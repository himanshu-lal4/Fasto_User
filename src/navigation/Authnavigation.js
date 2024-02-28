import {StatusBar} from 'react-native';
import React from 'react';
import Login from '../screens/Login';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {COLORS} from '../assets/theme';
import LoginWithEmail_Password from '../screens/LoginWithEmail_Password';

const Stack = createStackNavigator();

const Authnavigation = () => {
  return (
    <>
      <StatusBar backgroundColor={COLORS.primaryBackgroundColor} />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen
          name="LoginWithEmail_Password"
          component={LoginWithEmail_Password}
        />
      </Stack.Navigator>
    </>
  );
};

export default Authnavigation;
