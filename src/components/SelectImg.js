import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Animated,
  TouchableWithoutFeedback,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {BlurView} from '@react-native-community/blur';
import SelectImgBtn from './SelectImgBtn';
import {COLORS, FONTS} from '../assets/theme';
import {useNavigation} from '@react-navigation/native';
const height = Dimensions.get('window').height;

const SelectImage = ({handleSelectOption}) => {
  const navigation = useNavigation();
  const [modalAnimation] = useState(new Animated.Value(height));

  useEffect(() => {
    Animated.timing(modalAnimation, {
      toValue: height * 0.6,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  //capture Image from Camera
  const captureImage = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        launchCamera({mediaType: 'photo'}, response => {
          if (response.didCancel) {
            console.log('User canceled the action');
          } else if (response.errorCode) {
            console.log(`Error while opening the Camera ${response.errorCode}`);
          } else if (response.errorMessage) {
            console.log(`Error message is ${response.errorMessage}`);
          } else {
            console.log(response.assets[0].uri);
            Alert.alert('Success!', 'Image Uploaded');
            navigation.navigate('QR_codeScreen');
          }
        });
      } else {
        console.log('Camera permission denied');
        Alert.alert(
          'Permission Denied',
          'You need to grant camera permission to use this feature.',
        );
      }
    } catch (err) {
      console.warn(err);
    }
  };

  //select Image from gallery
  const chooseFile = () => {
    launchImageLibrary({mediaType: 'photo', selectionLimit: 10}, response => {
      if (response.didCancel) {
        console.log('user cancel the action');
      } else if (response.errorCode) {
        console.log(`Error while opening the gallery ${response.errorCode}`);
      } else if (response.errorMessage) {
        console.log(`error message is ${response.errorMessage}`);
      } else {
        console.log(response);
        Alert.alert('Success!', 'Images Uploaded');
        navigation.navigate('QR_codeScreen');
      }
    });
  };
  return (
    <>
      <TouchableWithoutFeedback onPress={() => handleSelectOption(false)}>
        <BlurView
          style={styles.blurView}
          blurType="dark"
          blurAmount={1}
          blurRadius={4}
          reducedTransparencyFallbackColor="white"
        />
      </TouchableWithoutFeedback>

      <Animated.View
        style={[styles.modal, {transform: [{translateY: modalAnimation}]}]}>
        <Text style={[FONTS.h3, {color: COLORS.black, marginTop: 20}]}>
          Select a Option
        </Text>
        <View style={styles.twobtns}>
          <SelectImgBtn
            text={'Camera'}
            type={'black'}
            onPress={() => captureImage('photo')}
          />
          <SelectImgBtn
            text={'Gallery'}
            type={'black'}
            onPress={() => chooseFile('photo')}
          />
        </View>
      </Animated.View>
    </>
  );
};
export default SelectImage;
const styles = StyleSheet.create({
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  modal: {
    backgroundColor: 'white',
    height: height * 0.8,
    flexDirection: 'column',
    alignItems: 'center',
    borderTopLeftRadius: 33,
    borderTopRightRadius: 33,
    paddingTop: height / 35,
    marginTop: height - 1050,
  },
  text1: {
    fontSize: height / 35,
    color: COLORS.black,
    textAlign: 'center',
  },
  text2: {
    color: '#919191',
    fontSize: height / 45,
    textAlign: 'center',
  },
  twobtns: {
    marginTop: 28,
    flexDirection: 'row',
  },
  image: {height: 100, width: 100, borderRadius: 50},
});
