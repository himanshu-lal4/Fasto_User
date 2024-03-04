import {
  View,
  StyleSheet,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  Animated,
} from 'react-native';
import React, {useRef, useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import AuthHeader from '../components/Common/AuthHeader';
import LoginType from '../components/LoginType';
import {COLORS, FONTS, SIZES, theme} from '../assets/theme';
import Button from '../components/Common/Button';
import Line from '../components/Common/Line';
import {useDispatch} from 'react-redux';
const Login = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const slideUpAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(slideUpAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        style={{flex: 1}}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between',
          }}>
          <AuthHeader
            tittle="Let's you in"
            onPress={() => navigation.goBack()}
          />
          <Image
            source={require('../assets/images/signin.png')}
            style={{height: 250, width: 250, alignSelf: 'center'}}
          />
          <Animated.View
            style={[
              styles.section,
              {
                transform: [
                  {
                    translateY: slideUpAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [100, 0],
                    }),
                  },
                ],
              },
            ]}>
            <LoginType />
            <Line text="Or" />
            <Button
              tittle="sign in with password"
              onPress={() => {
                navigation.navigate('LoginWithEmail_Password');
              }}
            />
            <View style={styles.bottomView}>
              <Text style={[FONTS.h3, {color: COLORS.darkBlue}]}>
                Don't have an account?
              </Text>
              <Text
                style={[FONTS.h3, {color: 'black', marginLeft: 5}]}
                onPress={() => {}}>
                Sign up
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondaryBackground, //#0a57fd
  },
  ortext: {
    marginLeft: 190,
    color: 'black',
    marginTop: 30,
  },
  line1: {
    height: 1,
    backgroundColor: 'gray',
    marginVertical: -9,
    width: 150,
    marginLeft: SIZES.basemarginleft,
  },
  line2: {
    height: 1,
    backgroundColor: 'gray',
    marginVertical: 8,
    width: 150,
    marginLeft: 240,
  },
  bottomView: {
    flexDirection: 'row',
    marginTop: 30,
    marginBottom: 10,
    justifyContent: 'center',
  },
  icon1: {
    height: 100,
    width: 100,
  },
  section: {
    elevation: 30,
    paddingTop: 40,
    borderWidth: 0.5,
    borderColor: COLORS.lightGray,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    backgroundColor: COLORS.white,
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
});

export default Login;
