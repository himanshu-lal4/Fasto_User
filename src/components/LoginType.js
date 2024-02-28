import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import styles from '../assets/theme/style';
import {Card} from 'react-native-paper';
import MaterialCommunityIcons from '../utils/VectorIcon';
import {COLORS, FONTS} from '../assets/theme';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {LoginManager, AccessToken} from 'react-native-fbsdk-next';
const LoginType = () => {
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '750688566312-2s51gk33qf9ju5e3mfied01npk0ho5eg.apps.googleusercontent.com',
    });
  }, []);
  async function onGoogleButtonPress() {
    await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
    const {user, idToken} = await GoogleSignin.signIn();
    console.log(user);
    console.log(idToken);
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    return auth().signInWithCredential(googleCredential);
  }
  async function onFacebookButtonPress() {
    // Attempt login with permissions
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);

    if (result.isCancelled) {
      console.log('User cancelled the login process');
    }

    // Once signed in, get the users AccessToken
    const data = await AccessToken.getCurrentAccessToken();

    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Create a Firebase credential with the AccessToken
    const facebookCredential = auth.FacebookAuthProvider.credential(
      data.accessToken,
    );

    // Sign-in the user with the credential
    return auth().signInWithCredential(facebookCredential);
  }
  return (
    <View style={styles.authContainertext}>
      <Card style={[styles.Card1, {backgroundColor: COLORS.graybackground}]}>
        <TouchableOpacity
          style={stylesPage.cardBox}
          onPress={() => onFacebookButtonPress()}>
          <MaterialCommunityIcons
            name="facebook"
            size={45}
            color="rgb(23, 169, 253)"
            style={{}}
            type="MaterialCommunityIcons"
          />
          <Text style={[FONTS.body3, {color: COLORS.white1, paddingLeft: 20}]}>
            Continue with Facebook
          </Text>
        </TouchableOpacity>
      </Card>
      <Card style={[styles.Card1, {backgroundColor: COLORS.graybackground}]}>
        <TouchableOpacity
          style={stylesPage.cardBox}
          onPress={() => onGoogleButtonPress()}>
          <MaterialCommunityIcons
            name="google"
            size={45}
            color="white"
            type="MaterialCommunityIcons"
          />
          <Text style={[FONTS.body3, {color: COLORS.white1, paddingLeft: 20}]}>
            Continue with Google
          </Text>
        </TouchableOpacity>
      </Card>
      <Card style={[styles.Card1, {backgroundColor: COLORS.graybackground}]}>
        <TouchableOpacity
          style={stylesPage.cardBox}
          onPress={() => console.log('apple icon')}>
          <MaterialCommunityIcons
            name="apple"
            size={45}
            color="white"
            type="MaterialCommunityIcons"
          />
          <Text style={[FONTS.body3, {color: COLORS.white1, paddingLeft: 20}]}>
            Continue with Apple
          </Text>
        </TouchableOpacity>
      </Card>
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
