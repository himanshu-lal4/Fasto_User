import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import database from '@react-native-firebase/database';
import {Dimensions} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {ScrollView} from 'react-native-virtualized-view';
import {isArrayLiteralExpression} from 'typescript';

const {width, height} = Dimensions.get('window');

const SellerScreen = () => {
  console.log('<-------------SellerScreen Rendered--------------->');
  const userUID = useSelector(state => state.userToken.UID);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [clickedSeller, setClickedSeller] = useState(null);
  // const [loading, setLoading] = useState(true); // State to manage loading animation
  // const [pop, setPop] = useState(false);
  const [clickedSellerDeviceToken, setClickedSellerDeviceToken] =
    useState(null);
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
        // setLoading(false);
        // setPop(true);
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

        setSellerData(sortedSellerData);
        // setLoading(false);
        // setPop(true);
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

  // useEffect(() => {
  //   if (!loading) {
  //     setPop(true); // Trigger pop animation when loading is complete
  //     setTimeout(() => {
  //       setPop(false); // Reset pop animation after a short delay
  //     }, 1000); // Adjust the delay as needed
  //   }
  // }, [loading]);

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
        } else {
          console.log('No such document 147!');
        }
      })
      .catch(error => {
        console.error('Error getting seller document:', error);
      });
  }

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
          setDeviceToken(item.id);
          setModalVisible(true);
        }}>
        <View style={styles.imgContainer}>
          <Image style={styles.img} source={{uri: item.data.imageUrl}} />
        </View>
        <Text style={[FONTS.body3, styles.text]}>{item.data.name}</Text>
      </TouchableOpacity>
    );
  };

  async function handleCallNotification() {
    // const message = {
    //   to: clickedSellerDeviceToken,
    //   notification: {
    //     title: '📲Fasto user Calling',
    //     body: '📞📞Call from a fasto user📞📞',
    //   },
    //   data: {
    //     // You can include additional data if needed
    //     // ...
    //     channelId: channelId,
    //   },
    // };
    // console.log('clickedSellerDeviceToken', clickedSellerDeviceToken);
    // const message = {
    //   to: clickedSellerDeviceToken,
    //   notification: {
    //     title: '📲Fasto user Calling',
    //     body: '📞📞Call from a fasto user📞📞',
    //   },
    //   data: {
    //     channelId: `${clickedSellerDeviceToken}`,
    //     userUID: userUID,
    //     // Add more key-value pairs as needed
    //   },
    // };
    // await fetch('https://fcm.googleapis.com/fcm/send', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization:
    //       'key=AAAArsiGfCg:APA91bG4MQ_kSTeuCFZDjEkStvHn_zBJ_WmyTLzUg9C7sPmy3THk7s8XnoyhSjrhZ6X_X7VRGPpO_yCFXJ2AYYUEPUWoPV6Lm7jZ28BQ4mQKeoDM8SsrgnE73VdfelwDG9S9ywP5La8F', // Replace with your server key
    //   },
    //   body: JSON.stringify(message),
    // });
    // try {
    //   console.log('inside endCall try');
    //   const roomRef = database().ref(`/Sellers/${clickedSellerDeviceToken}`);
    //   // Check if the room already exists
    //   roomRef.once('value', async snapshot => {
    //     if (snapshot.exists()) {
    //       // If room exists, update its data
    //       await roomRef.update({
    //         userCallStatus: 'truing',
    //         sellerCallStatus: 'something',
    //       });
    //       console.log('Data updated------------>', clickedSellerDeviceToken);
    //     } else {
    //       // If room doesn't exist, set its data
    //       await roomRef.set({
    //         userCallStatus: 'setting tr',
    //         sellerCallStatus: 'settin some',
    //       });
    //       console.log('Data set------------>', clickedSellerDeviceToken);
    //     }
    //   });
    //   console.log('after endCall try');
    // } catch (error) {
    //   console.error('Error updating data:', error);
    // }
  }

  // Called the function to send the notification
  return (
    <SafeAreaView style={styles.rootContainer}>
      <ScrollView>
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
            <Text
              style={[
                FONTS.h1,
                {color: COLORS.black, paddingTop: 2, textAlign: 'justify'},
              ]}>
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
      <Modal
        // animationType="slide"
        transparent={true}
        style={styles.Modal}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.button}
                onPress={async () => {
                  console.log('Calling action');
                  // handleCallNotification();
                  // navigation.navigate('RTCIndex', {clickedSellerDeviceToken});
                  handleCallNotification();
                  navigation.navigate('WebRTCIndex', {
                    clickedSellerDeviceToken,
                  });
                  // navigation.navigate('WebRTCIndex');
                  setModalVisible(false);
                }}>
                <VectorIcon
                  name={'call'}
                  type={'Ionicons'}
                  size={25}
                  color={COLORS.gray}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  console.log('Messaging action');
                  setModalVisible(false);
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
                  // handleCallNotification();
                  // navigation.navigate('RTCIndex', {clickedSellerDeviceToken});
                  handleCallNotification();
                  navigation.navigate('WebRTCIndex', {
                    clickedSellerDeviceToken,
                  });
                  // navigation.navigate('WebRTCIndex');
                  setModalVisible(false);
                }}>
                <VectorIcon
                  name={'call'}
                  type={'Ionicons'}
                  size={25}
                  color={COLORS.gray}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  console.log('Messaging action');
                  setModalVisible(false);
                }}>
                <VectorIcon
                  name={'android-messages'}
                  type={'MaterialCommunityIcons'}
                  size={25}
                  color={COLORS.gray}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.cross}>
              <TouchableOpacity
                style={{alignSelf: 'center'}}
                onPress={() => setModalVisible(false)}>
                <VectorIcon
                  name={'cross'}
                  type={'Entypo'}
                  size={25}
                  color={COLORS.darkBlue}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SellerScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    // paddingVertical: 20,
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
  img: {width: '100%', height: '100%'},
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
    // elevation: 5, // This property is for Android
  },
  modalContainer: {
    width: width * 0.8,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 15,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actions: {
    width: '70%',
    backgroundColor: COLORS.white,
    elevation: 20,
    // padding: '3%',
    borderWidth: 0.3,
    borderColor: COLORS.gray,
    borderRadius: 30,
    marginHorizontal: '2%',
    paddingHorizontal: '8%',
    paddingVertical: '6%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // button: {
  //   borderColor: COLORS.white,
  //   paddingVertical: 10,
  //   paddingHorizontal: '6%',
  // },
  // buttonText: {
  //   color: COLORS.white,
  //   fontSize: 16,
  // },
  cross: {
    width: '20%',
    backgroundColor: COLORS.white,
    elevation: 20,
    borderWidth: 0.3,
    borderColor: COLORS.gray,
    // padding: '3%',
    borderRadius: 30,
    marginHorizontal: '5%',
    // paddingHorizontal : '8%',
    paddingVertical: '6%',
    alignSelf: 'center',
  },
});

{
  /* <View style={styles.textInputContainer}>
        <VectorIcon
          name="search"
          color={COLORS.darkBlue}
          size={25}
          style={styles.iconOpacity}
        />
        <TextInput style={styles.textInput} placeholder="Search..." />
      </View> */
}

// const sellerFcmToken =
//   'emeV5Te3QWeotU0S4Vx_WR:APA91bEQdEaRk6oUpzE35aa9Zw_PmMwUp6QdPvKLgxMproXA3XcZy8BLLusL0FCHX8XjINivdt7-gaa5NActmUMmEltB4IH9qSDROdxgcU6ITf1_iDBrZV2XOzsU75lTFCdgWv2ylqfw'; // Replace with the actual seller's FCM token

// const message = {
//   to: sellerFcmToken,
//   notification: {
//     title: 'User App Notification',
//     body: 'This is a notification from the user app to the seller app.',
//   },
//   data: {
//     // You can include additional data if needed
//     // ...
//   },
// };

// async function handleCallNotification() {
//   console.log('<==========handleCallNotification==========>');
//   console.log('clickedSellerDeviceToken--->', clickedSellerDeviceToken);

//   const message = {
//     to: clickedSellerDeviceToken,
//     notification: {
//       title: '📲Fasto user Calling',
//       body: '📞📞Call from a fasto user📞📞',
//     },
//     data: {
//       // You can include additional data if needed
//       // ...
//     },
//   };
//   console.log(
//     'handleCallNotificationClickedSellerDeviceToken----------->',
//     clickedSellerDeviceToken,
//   );
//   await fetch('https://fcm.googleapis.com/fcm/send', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization:
//         'key=AAAArsiGfCg:APA91bG4MQ_kSTeuCFZDjEkStvHn_zBJ_WmyTLzUg9C7sPmy3THk7s8XnoyhSjrhZ6X_X7VRGPpO_yCFXJ2AYYUEPUWoPV6Lm7jZ28BQ4mQKeoDM8SsrgnE73VdfelwDG9S9ywP5La8F', // Replace with your server key
//     },
//     body: JSON.stringify(message),
//   });
// }

// const message = {
//   to: clickedSellerDeviceToken,
//   notification: {
//     title: '📲Fasto user Calling',
//     body: '📞📞Call from a fasto user📞📞',
//   },
//   data: {
//     // You can include additional data if needed
//     // ...
//     channelId: channelId,
//   },
// };
// console.log('clickedSellerDeviceToken', clickedSellerDeviceToken);
// const message = {
//   to: clickedSellerDeviceToken,
//   notification: {
//     title: '📲Fasto user Calling',
//     body: '📞📞Call from a fasto user📞📞',
//   },
//   data: {
//     channelId: `${clickedSellerDeviceToken}`,
//     userUID: userUID,
//     // Add more key-value pairs as needed
//   },
// };
// await fetch('https://fcm.googleapis.com/fcm/send', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     Authorization:
//       'key=AAAArsiGfCg:APA91bG4MQ_kSTeuCFZDjEkStvHn_zBJ_WmyTLzUg9C7sPmy3THk7s8XnoyhSjrhZ6X_X7VRGPpO_yCFXJ2AYYUEPUWoPV6Lm7jZ28BQ4mQKeoDM8SsrgnE73VdfelwDG9S9ywP5La8F', // Replace with your server key
//   },
//   body: JSON.stringify(message),
// });
// try {
//   console.log('inside endCall try');
//   const roomRef = database().ref(`/Sellers/${clickedSellerDeviceToken}`);
//   // Check if the room already exists
//   roomRef.once('value', async snapshot => {
//     if (snapshot.exists()) {
//       // If room exists, update its data
//       await roomRef.update({
//         userCallStatus: 'truing',
//         sellerCallStatus: 'something',
//       });
//       console.log('Data updated------------>', clickedSellerDeviceToken);
//     } else {
//       // If room doesn't exist, set its data
//       await roomRef.set({
//         userCallStatus: 'setting tr',
//         sellerCallStatus: 'settin some',
//       });
//       console.log('Data set------------>', clickedSellerDeviceToken);
//     }
//   });
//   console.log('after endCall try');
// } catch (error) {
//   console.error('Error updating data:', error);
// }
