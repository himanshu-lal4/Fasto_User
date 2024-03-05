import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import InputText from '../components/Common/InputText';
import Button from '../components/Common/Button';
import * as Yup from 'yup';
import {Formik} from 'formik';
import {COLORS, FONTS} from '../assets/theme';
import AuthHeader from '../components/Common/AuthHeader';
import {Checkbox} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import Line from '../components/Common/Line';
import {useDispatch} from 'react-redux';
import {addUID} from '../redux/userTokenSlice';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is Required'),
  password: Yup.string()
    .required('Password is Required')
    .min(6, 'Password must be at least 6 characters'),
});

const createUserWithEmailPassword = (email, password) => {
  const dispatch = useDispatch();
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(() => {
      console.log('User account created & signed in!');
    })
    .catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        console.log('That email address is already in use!');
        Alert.alert('This email is already in use');
      }

      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }
    });
};

const LoginWithEmail_Password = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [checked, setChecked] = useState(false);

  const signInUser = (email, password) => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        // console.log('User loggesd in Successfully', userCredential);
        const userToken = userCredential.user.uid;

        if (userToken) {
          dispatch(addUID(userToken));
          navigation.navigate('SellerScreen');
        }
      })
      .catch(error => {
        console.log('error while login ' + error);
      });
  };

  const handleSubmit = (values, actions) => {
    if (values) {
      // console.log(values);
      // createUserWithEmailPassword(values.email, values.password);
      signInUser(values.email, values.password);
      actions.resetForm();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        style={styles.container}>
        <ScrollView>
          <AuthHeader
            tittle="Sign In with Password"
            onPress={() => {
              navigation.goBack();
            }}
          />
          <View style={{marginTop: 30}}>
            <Formik
              initialValues={{email: '', password: ''}}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}>
              {({handleChange, handleSubmit, values, errors, touched}) => (
                <View>
                  <View>
                    <InputText
                      value={values.email}
                      placeholder="Email"
                      onChangeText={handleChange('email')}
                    />
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                  </View>
                  <View>
                    <InputText
                      value={values.password}
                      placeholder="Password"
                      onChangeText={handleChange('password')}
                      style={{height: 50}}
                      secure={true}
                    />
                    {touched.password && errors.password && (
                      <Text style={styles.errorText}>{errors.password}</Text>
                    )}
                  </View>

                  <View style={styles.checkboxContainer}>
                    <View
                      style={{flexDirection: 'row', justifyContent: 'center'}}>
                      <Checkbox
                        color="#0a57fd"
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={() => {
                          setChecked(!checked);
                        }}
                      />
                      <Text style={styles.label}>Remember me</Text>
                    </View>

                    <TouchableOpacity>
                      <Text style={styles.reset}>Reset Password</Text>
                    </TouchableOpacity>
                  </View>

                  <Button tittle="sign in" onPress={() => handleSubmit()} />
                </View>
              )}
            </Formik>
          </View>
          <View style={styles.bottomView}>
            <Text style={[FONTS.body4, {color: COLORS.black}]}>
              Don't have an account?
            </Text>
            <Text
              style={[FONTS.body4, {color: COLORS.blue, marginLeft: 5}]}
              onPress={() => {}}>
              Sign up
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default LoginWithEmail_Password;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  checkboxContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 30,
  },
  line: {marginTop: '20%', marginBottom: '2%'},
  label: {
    color: COLORS.black,
    marginTop: 6,
  },
  reset: {color: COLORS.darkBlue, marginLeft: '30%', marginTop: 7},
  google: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    backgroundColor: COLORS.graybackground,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 10,
  },
  bottomView: {
    flexDirection: 'row',
    marginTop: 60,
    marginBottom: 10,
    justifyContent: 'center',
  },
  icons: {
    display: 'flex',
    flexDirection: 'row',
    gap: 30,
    marginTop: 50,
    marginHorizontal: '15%',
  },
  googleIcon: {
    height: 40,
    width: 40,
  },
  icon: {
    paddingHorizontal: 22,
    paddingVertical: 7,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: COLORS.graybackground,
  },
  errorText: {
    color: COLORS.red,
    marginLeft: '5%',
  },
  below: {
    color: COLORS.white,
  },
});
