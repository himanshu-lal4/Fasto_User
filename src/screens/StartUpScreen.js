import React, {useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {COLORS, FONTS} from '../assets/theme';
import Swiper from 'react-native-swiper';
import Button from '../components/Common/Button';
import {white} from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

const StartUpScreen = ({navigation}) => {
  return (
    <Swiper style={styles.wrapper} showsButtons={false} loop={false}>
      <View style={styles.slide}>
        <Image
          source={require('../assets/images/1st.png')}
          style={styles.image}
        />
        <Text style={[FONTS.h2, {color: '#0d6efd'}]}>Welcome to our app!</Text>
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adip. Cum sociis nato,
          consectet.
        </Text>
      </View>
      <View style={styles.slide}>
        <Image
          source={require('../assets/images/2nd.png')}
          style={styles.image}
        />
        <Text style={[FONTS.h2, {color: '#0d6efd'}]}>
          Discover amazing features.
        </Text>
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adip. Cum sociis nato,
          consectet.
        </Text>
      </View>
      <View style={styles.slide}>
        <Image
          source={require('../assets/images/3rd.png')}
          style={styles.image}
        />
        <Text style={[FONTS.h2, {color: '#0d6efd'}]}>Get started now!</Text>
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adip. Cum sociis nato,
          consectet.
        </Text>
        {/* <Button
          tittle={'Ready ?'}
          onPress={() => navigation.navigate('Auth')}
        /> */}
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate('Auth')}>
          <Text style={[FONTS.h3, {color: 'white'}]}>ready!</Text>
        </TouchableOpacity>
      </View>
    </Swiper>
  );
};

const styles = StyleSheet.create({
  window: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wrapper: {
    backgroundColor: 'white',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  text: {
    textAlign: 'center',
    marginHorizontal: 20,
    color: 'black',
    fontFamily: 'Nunito-Bold',
    fontSize: 15,
  },
  btn: {
    elevation: 5,
    position: 'absolute',
    bottom: 60,
    backgroundColor: '#0d6efd',
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
});

export default StartUpScreen;
