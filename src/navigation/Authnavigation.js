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
import {useDispatch, useSelector} from 'react-redux';
import {addUID} from '../redux/userTokenSlice';
import {StartCall} from '../components/WebRTC/StartCall';
import WebRTC from '../components/WebRTC/WebRTC';
import RTCIndex from '../components/WebRTC/RTCIndex';
import LoadingScreen from '../components/Common/LodingScreen';
import WebRTCIndex from '../components/WebRTCqueue/WebRTCIndex';
import {addUserData} from '../redux/userDataSlice';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import WaitingQueue from '../screens/WaitingQueue';
import MessagingScreen from '../screens/MessagingScreen';
import ListScreen from '../screens/ListScreen';

const Stack = createStackNavigator();

const Authnavigation = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userToken.UID);
  const [authStateChecked, setAuthStateChecked] = useState(false);

  useEffect(() => {
    const unregister = auth().onAuthStateChanged(async userExist => {
      const token = await messaging().getToken();
      if (userExist) {
        try {
          console.log(userExist.uid);
          const doc = await firestore()
            .collection('Users')
            .doc(userExist.uid)
            .get();

          if (doc.exists) {
            const userData = doc.data();
            dispatch(
              addUserData({
                userUid: userExist.uid,
                name: userData.name,
                email: userData.email,
                photoUrl: userData.photoUrl,
                deviceToken: userData.deviceToken,
                OS: Platform.OS,
              }),
            );

            console.log('New seller added to added to redux!');
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.error('Error updating Firestore document:', error);
        }
        console.log('userExist.uid firebaseonAuth----->', userExist.uid);
        dispatch(addUID(userExist.uid));
      }

      setAuthStateChecked(true);
    });

    return () => {
      unregister();
    };
  }, [dispatch]);

  if (!authStateChecked) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        // initialRouteName="ListScreen"
      >
        {user ? (
          <>
            <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
            <Stack.Screen name="SellerScreen" component={SellerScreen} />
            <Stack.Screen name="QRScanner" component={QRScanner} />
            <Stack.Screen name="QR_codeScreen" component={Qr_codeScreen} />
            <Stack.Screen name="WaitingQueue" component={WaitingQueue} />
            <Stack.Screen name="WebRTCIndex" component={WebRTCIndex} />
            <Stack.Screen name="RTCIndex" component={RTCIndex} />
            <Stack.Screen name="MessagingScreen" component={MessagingScreen} />
            <Stack.Screen name="ListScreen" component={ListScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="StartUpScreen" component={StartUpScreen} />
            <Stack.Screen name="Login" component={Login} />
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
