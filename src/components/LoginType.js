import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from '../assets/theme/style';
import {Card} from 'react-native-paper';
import VectorIcon from '../assets/VectorIcon/VectorIcon';
import {COLORS, FONTS} from '../assets/theme';
import auth from '@react-native-firebase/auth';
import {useNavigation} from '@react-navigation/native';
import featureFlag from './remoteConfig';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
import {useDispatch} from 'react-redux';
import {addUID} from '../redux/userTokenSlice';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import {addSeller} from '../redux/userDataSlice';
const LoginType = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const isAppleLoginEnabled = featureFlag();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '750688566312-2s51gk33qf9ju5e3mfied01npk0ho5eg.apps.googleusercontent.com',
    });
  }, []);

  //google Sign In
  const googleSignInHandle = async () => {
    await messaging().registerDeviceForRemoteMessages();

    // Get the token
    const token = await messaging().getToken();

    try {
      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const {user} = await auth().signInWithCredential(googleCredential);

      const userDocRef = firestore().collection('Users').doc(user.uid);

      // Check if the user document already exists
      const docSnapshot = await userDocRef.get();

      if (docSnapshot.exists) {
        // User already exists, you can handle this case accordingly
        dispatch(addUID(user.uid));
        console.log('googleUID------->', user.uid);
        navigation.navigate('SellerScreen');
        console.log('User already exists!');
      } else {
        await firestore()
          .collection('Users')
          .doc(user.uid)
          .set({
            name: user.displayName,
            email: user.email,
            photoUrl: user.photoURL,
            deviceToken: token,
            OS: Platform.OS,
            seller: [
              {
                id: '0',
                data: {
                  email: 'deafult@gmail.com',
                  imageUrl: 'https://picsum.photos/id/1/5000/3333',
                  name: 'Add',
                },
              },
            ],
          });

        dispatch(addUID(user.uid));
        console.log('googleUID------->', user.uid);
        setTimeout(() => {
          navigation.navigate('SellerScreen');
        }, 10000);
        // navigation.navigate('SellerScreen');
        console.log('User added!');
      }

      return;

      // return auth().signInWithCredential(googleCredential);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('user cancelled the login flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('google sign-in is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('play services not available or outdated');
      } else {
        console.error(error);
      }
    }
  };

  //Facebook Sign In
  const facebookSignInHandle = async () => {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      console.log('User cancelled the login process');
    }

    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );
    const {user} = await auth().signInWithCredential(facebookCredential);
    if (user.uid) {
      dispatch(addUID(user.uid));
    }
    return;
  };

  return (
    <View style={styles.cardContainer}>
      <Card
        style={[styles.Card1, {backgroundColor: COLORS.secondaryButtonColor}]}>
        <TouchableOpacity
          style={stylesPage.cardBox}
          onPress={() => {
            facebookSignInHandle();
          }}>
          <VectorIcon
            name="facebook"
            size={50}
            color="#3b5998"
            style={{}}
            type="MaterialCommunityIcons"
          />
        </TouchableOpacity>
      </Card>
      <Card
        style={[styles.Card1, {backgroundColor: COLORS.secondaryButtonColor}]}>
        <TouchableOpacity
          style={stylesPage.cardBox}
          onPress={() => {
            googleSignInHandle();
          }}>
          <Image
            style={{height: 50, width: 53}}
            source={require('../assets/icons/Google.webp')}
          />
        </TouchableOpacity>
      </Card>

      {isAppleLoginEnabled ? (
        <>
          <Card
            style={[
              styles.Card1,
              {backgroundColor: COLORS.secondaryButtonColor},
            ]}>
            <TouchableOpacity
              style={stylesPage.cardBox}
              onPress={() => console.log('Apple icon')}>
              <VectorIcon
                name="apple"
                size={50}
                color="gray"
                type="MaterialCommunityIcons"
              />
            </TouchableOpacity>
          </Card>
        </>
      ) : null}
    </View>
  );
};

export default LoginType;

const stylesPage = StyleSheet.create({
  cardBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
