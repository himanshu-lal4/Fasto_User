import {StatusBar} from 'react-native';
import React, {useEffect, useState} from 'react';
import Login from '../screens/Login';
import OnBoardScreen from '../screens/OnBoardScreen';
import {createStackNavigator} from '@react-navigation/stack';
import {COLORS} from '../assets/theme';
import SubcategoryScreen from '../components/onBoarding/subCategory';
import LoginWithEmail_Password from '../screens/LoginWithEmail_Password';
import ChooseImgScreen from '../screens/ChooseImgScreen';
import SelectImage from '../components/SelectImg';
import Qr_codeScreen from '../screens/Qr_codeScreen';
import QRScanner from '../screens/QRScanner';
import SellerScreen from '../screens/SellerScreen';
import auth from '@react-native-firebase/auth';
import StartUpScreen from '../screens/StartUpScreen';
import {useDispatch} from 'react-redux';
import {addUID} from '../redux/userTokenSlice';

const Stack = createStackNavigator();

const Authnavigation = () => {
  const [user, setUser] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {
    const unregister = auth().onAuthStateChanged(userExist => {
      if (userExist) {
        // console.log('user exist', userExist.uid);
        dispatch(addUID(userExist.uid));
        setUser(userExist);
      } else {
        setUser('');
      }
    });
    return () => {
      unregister();
    };
  }, []);

  return (
    <>
      <StatusBar barStyle={'light-content'} backgroundColor={COLORS.darkBlue} />
      <Stack.Navigator
        // initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}>
        {user ? (
          <>
            <Stack.Screen name="SellerScreen" component={SellerScreen} />
            <Stack.Screen name="QRScanner" component={QRScanner} />
            <Stack.Screen name="QR_codeScreen" component={Qr_codeScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="StartUpScreen" component={StartUpScreen} />
            <Stack.Screen
              name="LoginWithEmail_Password"
              component={LoginWithEmail_Password}
            />
          </>
        )}
      </Stack.Navigator>
    </>
  );
};

export default Authnavigation;
