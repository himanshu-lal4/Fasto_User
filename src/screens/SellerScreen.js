import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Animated,
  Easing,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import VectorIcon from '../assets/VectorIcon/VectorIcon';
import {DummyData} from '../components/SellerScreen/DummyData';
import {COLORS, FONTS} from '../assets/theme';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {firebase} from '@react-native-firebase/auth';
import CommonHeader from '../components/Common/CommonHeader';
import {PermissionsAndroid} from 'react-native';
import StartWebCam from '../components/WebRTC/StartWebCam';
import {StartCall, startCall} from '../components/WebRTC/StartCall';
// import database from '@react-native-firebase/database';
import {Dimensions} from 'react-native';
import {ScrollView} from 'react-native-virtualized-view';
import {Shadow} from 'react-native-shadow-2';
import LinearGradient from 'react-native-linear-gradient';

const {width, height} = Dimensions.get('window');

const SellerScreen = () => {
  console.log('<-------------SellerScreen Rendered--------------->');
  const userUID = useSelector(state => state.userToken.UID);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [clickedSellerID, setClickedSellerID] = useState(null);
  const [clickedSeller, setClickedSeller] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const spinValue = useRef(new Animated.Value(0)).current;
  const shakeValue = new Animated.Value(0);
  const [clickedImageId, setClickedImageId] = useState(null);
  const [clickedSellerDeviceToken, setClickedSellerDeviceToken] =
    useState(null);
  const [clickedSellerData, setClickedSellerData] = useState(null);
  const [sellerId, setSellerId] = useState(null);
  const position = useRef(new Animated.Value(50)).current;
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to scan QR codes.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted');
        navigation.navigate('QRScanner');
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  console.log('clickedSeller', clickedSeller);
  const handlePress = () => {
    requestCameraPermission();
  };
  const [sellerData, setSellerData] = useState([]);
  const userToken = useSelector(state => state.userId.UID);
  const currUserToken = useSelector(state => state.userToken.UID);
  console.log('🚀 ~ SellerScreen ~ currUserToken:', currUserToken);

  const addNewSeller = async () => {
    console.log('reached');
    try {
      console.log(userToken);
      const doc = await firestore().collection('Sellers').doc(userToken).get();

      if (doc.exists) {
        const userData = doc.data();
        const obj = {
          id: userToken,
          data: {
            name: userData.name,
            imageUrl: userData.photoUrl,
            email: userData.email,
            OS: userData.OS,
          },
        };
        await firestore()
          .collection('Users')
          .doc(currUserToken)
          .update({
            seller: firestore.FieldValue.arrayUnion(obj),
          });
        // setIsLoading(false);
        console.log('New seller added to Firestore!');
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error updating Firestore document:', error);
    }
  };

  const fetchUserData = async () => {
    try {
      const user = await firestore()
        .collection('Users')
        .doc(currUserToken)
        .get();

      if (user.exists) {
        const sellerData = user.data().seller;
        const sortedSellerData = sellerData ? sellerData : [];
        // setIsLoading(false);
        setSellerData(sortedSellerData);
      } else {
        console.log('User document not found');
      }
    } catch (error) {
      console.error('Error getting user document:', error);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        await addNewSeller();
        await fetchUserData();
      } catch (error) {
        console.error('Error in useEffect:', error);
      }
    };

    fetchData();
  }, [userToken]);

  useEffect(() => {
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 1000,
      // easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    // else {
    //   Animated.sequence([
    //     Animated.timing(shakeValue, { toValue: 10, duration: 100, useNativeDriver: true }),
    //     Animated.timing(shakeValue, { toValue: -10, duration: 100, useNativeDriver: true }),
    //     Animated.timing(shakeValue, { toValue: 0, duration: 100, useNativeDriver: true }),
    //   ]).start();
    // }
  }, []);

  const slideModal = () => {
    Animated.timing(position, {
      toValue: 0, // Update toValue directly
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (modalVisible) {
      slideModal(0); // Slide up when modal is visible
    }
  }, [modalVisible]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const shake = shakeValue.interpolate({
    inputRange: [-10, 10],
    outputRange: ['-10deg', '10deg'],
  });

  async function setDeviceToken(itemId) {
    await firestore()
      .collection('Sellers')
      .doc(itemId)
      .get()
      .then(doc => {
        if (doc.exists) {
          // Document data is available in doc.data()
          const sellerData = doc.data();
          // console.log('Seller Data:', sellerData.deviceToken);
          // sellerFcmToken = sellerData.deviceToken;

          setClickedSellerDeviceToken(sellerData.deviceToken);
          // setClickedSeller(true);
        } else {
          console.log('No such document 147!');
        }
      })
      .catch(error => {
        console.error('Error getting seller document:', error);
      });
  }

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const renderItem = ({item}) => {
    return item.id == 0 ? (
      <TouchableOpacity
        key={item.id}
        style={styles.rootImgContainer}
        onPress={handlePress}>
        <View style={styles.addIconContainer}>
          <VectorIcon
            name="add"
            color={COLORS.darkBlue}
            size={55}
            style={styles.iconOpacity}
          />
        </View>
        <Text style={[FONTS.body3, styles.text]}>{item.data.name}</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        key={item.id}
        style={styles.rootImgContainer}
        onPress={() => {
          // setClickedSeller(item.id);
          console.log('itemId---------->', item.id);
          setClickedImageId(item.id);
          setDeviceToken(item.id);
          setSellerId(item.id);
          console.log('seller is ------------------------->', item);
          setClickedSellerData(item);
          console.log('itemId---------->', item.id);
          setModalVisible(true);
        }}>
        <Animated.View
          style={[
            styles.imgContainer,
            clickedImageId === item.id && styles.highlightedImage,
            {transform: [{rotate: shake}]},
          ]}>
          {isLoading && (
            <Animated.View
              style={[styles.loader, {transform: [{rotate: spin}]}]}>
              <View style={styles.loaderInner} />
            </Animated.View>
          )}
          <Image
            style={styles.img}
            source={{uri: item.data.imageUrl}}
            onLoad={handleImageLoad}
          />
        </Animated.View>
        <Text style={[FONTS.body3, styles.text]}>{item.data.name}</Text>
      </TouchableOpacity>
    );
  };

  async function handleCallNotification() {}

  console.log('MODAAAAAAAAAAAAAAL', modalVisible);

  const ModalSlideDown = () => {
    Animated.timing(position, {
      toValue: 50,
      duration: 200,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      setModalVisible(false);
    }, 200);
  };

  // Called the function to send the notification
  return (
    <SafeAreaView style={styles.rootContainer}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <View style={styles.headerContainer}>
          <Text style={styles.mainHeaderText}>Workshop details</Text>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity>
              <VectorIcon
                name={'bell'}
                type={'Fontisto'}
                size={15}
                color={COLORS.black}
                style={styles.icon1}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <VectorIcon
                name={'cross'}
                type={'Entypo'}
                size={20}
                color={COLORS.black}
                style={styles.icon2}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <View style={styles.textContainer}>
            <Text style={styles.headerText}>Workshop Description</Text>
            <Text style={[FONTS.h1, {color: COLORS.black, paddingTop: 2}]}>
              Session with Joseph Parker
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={styles.date}>11:30am</Text>
            <Text style={styles.date}>March 24, 2022</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'right'}}>
            <Text style={styles.filter}>Relationship</Text>
            <Text style={styles.filter}>Personal Growth</Text>
          </View>
          <View style={styles.organizer}>
            <Text style={styles.organizerText}>Broadcast Organizer</Text>
            <View style={{flexDirection: 'row', alignItem: 'center'}}>
              <VectorIcon
                name={'user'}
                type={'Feather'}
                size={20}
                color={COLORS.black}
                style={styles.userIcon}
              />
              <View style={{justifyContent: 'center'}}>
                <Text style={styles.organizerMiniText1}>Salma Hellman</Text>
                <Text style={styles.organizerMiniText}>
                  Broadcast Organizer
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.mainContainer}>
          <Text style={styles.invited}>Invited Members</Text>
          <FlatList
            data={sellerData}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            numColumns={3}
          />
        </View>
      </ScrollView>
      <View
        style={[
          styles.modalContainer,
          {transform: [{translateY: modalVisible ? -65 : 0}]},
          {display: modalVisible ? 'flex' : 'none'},
        ]}>
        <Animated.View
          style={[
            styles.modalContainer,
            {transform: [{translateY: position}]},
          ]}>
          <LinearGradient
            colors={['transparent', COLORS.white, COLORS.white]}
            style={styles.gradient}>
            <Shadow
              distance={4}
              stretch={false}
              // offset={[0, 0]}
              style={styles.actions}
              startColor={'#f1f1f1'}
              endColor={COLORS.white}>
              <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                  console.log('Calling action');
                  handleCallNotification();
                  navigation.navigate('WebRTCIndex', {
                    clickedSellerDeviceToken,
                    sellerId,
                    clickedSellerData,
                  });
                  ModalSlideDown();
                  setClickedImageId(null);
                }}>
                <VectorIcon
                  name={'video'}
                  type={'Feather'}
                  size={25}
                  color={COLORS.gray}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                  setClickedImageId(null);
                  ModalSlideDown();
                  navigation.navigate('MessagingScreen', {
                    clickedSellerData: clickedSellerData,
                  });
                }}>
                <VectorIcon
                  name={'android-messages'}
                  type={'MaterialCommunityIcons'}
                  size={25}
                  color={COLORS.gray}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                  console.log('Calling action');
                  handleCallNotification();
                  navigation.navigate('WebRTCIndex', {
                    clickedSellerDeviceToken,
                    sellerId,
                    clickedSellerData,
                  });
                  ModalSlideDown();
                }}>
                <VectorIcon
                  name={'call'}
                  type={'Ionicons'}
                  size={25}
                  color={COLORS.gray}
                />
              </TouchableOpacity>
            </Shadow>
            <Shadow
              distance={4}
              stretch={false}
              style={styles.shadowCross}
              startColor={'#f1f1f1'}
              endColor={COLORS.white}>
              <TouchableOpacity
                style={{
                  alignSelf: 'center',
                  paddingVertical: '8%',
                  backgroundColor: COLORS.white,
                }}
                onPress={() => {
                  setClickedImageId(null);
                  ModalSlideDown();
                }}>
                <VectorIcon
                  name={'cross'}
                  type={'Entypo'}
                  size={30}
                  color={'red'}
                />
              </TouchableOpacity>
            </Shadow>
          </LinearGradient>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
};

export default SellerScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    height: height,
    width: width * 1,
  },
  headerContainer: {
    backgroundColor: COLORS.white,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  icon1: {
    borderWidth: 0.5,
    margin: 5,
    paddingHorizontal: 11,
    paddingVertical: 10,
    borderRadius: 40,
    borderColor: 'grey',
  },
  icon2: {
    borderWidth: 0.5,
    margin: 5,
    padding: 8,
    borderRadius: 40,
    borderColor: 'grey',
  },
  textContainer: {
    marginTop: 15,
  },
  headerText: {
    ...FONTS.body5,
    color: COLORS.gray,
    paddingVertical: 10,
  },
  date: {
    ...FONTS.body6,
    color: COLORS.black,
    paddingVertical: 13,
    fontWeight: '600',
  },
  filter: {
    backgroundColor: 'pink',
    color: 'brown',
    textAlign: 'center',
    ...FONTS.body6,
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
    borderRadius: 40,
    marginRight: 10,
  },
  organizer: {
    marginVertical: '10%',
  },
  organizerText: {
    ...FONTS.body5,
    color: COLORS.gray,
    paddingVertical: 10,
  },
  organizerMiniText1: {
    ...FONTS.body6,
    color: COLORS.black,
    fontWeight: '500',
    paddingHorizontal: 5,
    paddingTop: 5,
  },
  organizerMiniText: {
    ...FONTS.body6,
    color: COLORS.gray,
    paddingHorizontal: 5,
    paddingTop: 5,
  },
  userIcon: {
    borderWidth: 0.5,
    padding: 9,
    borderRadius: 40,
    borderColor: 'grey',
  },
  invited: {
    ...FONTS.body5,
    color: COLORS.gray,
    paddingTop: 5,
  },
  mainHeaderText: {
    ...FONTS.h2,
    color: COLORS.black,
  },
  mainContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 10,
    overflow: 'hidden',
  },
  text: {
    ...FONTS.body6,
    marginTop: 5,
    paddingTop: 5,
    width: width * 0.3,
    textAlign: 'center',
    alignItems: 'center',
    color: COLORS.black,
  },
  img: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
  },
  highlightedImage: {
    borderWidth: 2.5,
    borderColor: COLORS.black,
  },
  iconOpacity: {opacity: 0.5},
  addIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 45,
    overflow: 'hidden',
    borderColor: COLORS.gray,
    borderStyle: 'dashed',
    borderWidth: 2,
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rootImgContainer: {
    marginTop: 5,
    paddingVertical: 10,
    alignItems: 'center',
  },
  imgContainer: {
    width: 80,
    height: 80,
    borderRadius: 45,
    overflow: 'hidden',
  },
  modalContainer: {
    position: 'absolute',
    bottom: '0.5%',
    // zIndex: 2,
    width: '100%',
    height: '11%',
  },
  gradient: {
    flexDirection: 'row',
    // backgroundColor: 'red',
    width: width,
    height: height * 0.1,
    paddingVertical: '2%',
    paddingHorizontal: '12%',
    justifyContent: 'space-around',
  },
  button: {
    paddingHorizontal: '8%',
  },
  actions: {
    borderRadius: 50,
    // paddingVertical: '6%',
    flexDirection: 'row',
    width: 210,
    height: 62,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  loader: {
    height: 80,
    width: 80,
    borderRadius: 50,
    borderWidth: 5,
    borderBottomColor: COLORS.white,
    borderTopColor: COLORS.blue,
    borderLeftColor: COLORS.white,
    borderRightColor: COLORS.white,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderInner: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.white,
  },
  shadowCross: {
    justifyContent: 'center',
    borderRadius: 50,
    width: 62,
    height: 62,
    backgroundColor: COLORS.white,
  },
});
