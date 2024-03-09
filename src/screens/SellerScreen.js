import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
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

const SellerScreen = () => {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [clickedSeller, setClickedSeller] = useState(null);
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

  const addNewSeller = async () => {
    try {
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
        const sortedSellerData = sellerData ? sellerData.reverse() : [];

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
          console.log('No such document!');
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
        <Text style={styles.text}>{item.data.name}</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity
        key={item.id}
        style={styles.rootImgContainer}
        onPress={() => {
          // setClickedSeller(item.id);
          console.log('itemId---------->', item.id);
          setDeviceToken(item.id);
          console.log('itemId---------->', item.id);
          setModalVisible(true);
        }}>
        <View style={styles.imgContainer}>
          <Image style={styles.img} source={{uri: item.data.imageUrl}} />
        </View>
        <Text style={[FONTS.h4, styles.text]}>{item.data.name}</Text>
      </TouchableOpacity>
    );
  };

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

  async function handleCallNotification() {
    console.log('<==========handleCallNotification==========>');
    console.log('clickedSellerDeviceToken--->', clickedSellerDeviceToken);

    const message = {
      to: clickedSellerDeviceToken,
      notification: {
        title: '📲Fasto user Calling',
        body: '📞📞Call from a fasto user📞📞',
      },
      data: {
        // You can include additional data if needed
        // ...
      },
    };
    console.log(
      'handleCallNotificationClickedSellerDeviceToken----------->',
      clickedSellerDeviceToken,
    );
    await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'key=AAAArsiGfCg:APA91bG4MQ_kSTeuCFZDjEkStvHn_zBJ_WmyTLzUg9C7sPmy3THk7s8XnoyhSjrhZ6X_X7VRGPpO_yCFXJ2AYYUEPUWoPV6Lm7jZ28BQ4mQKeoDM8SsrgnE73VdfelwDG9S9ywP5La8F', // Replace with your server key
      },
      body: JSON.stringify(message),
    });
  }

  // Call the function to send the notification
  return (
    <SafeAreaView style={styles.rootContainer}>
      <CommonHeader title={'dashboard'} />
      <View style={styles.textInputContainer}>
        <VectorIcon
          name="search"
          color={COLORS.darkBlue}
          size={25}
          style={styles.iconOpacity}
        />
        <TextInput style={styles.textInput} placeholder="Search..." />
      </View>
      <FlatList
        contentContainerStyle={{
          marginTop: 20,
          alignItems: 'center',
        }}
        data={sellerData}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={3}
      />
      <Modal
        animationType="slide"
        transparent={true}
        style={styles.Modal}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                console.log('Calling action');
                handleCallNotification();
                navigation.navigate('RTCIndex');
                setModalVisible(false);
              }}>
              <VectorIcon
                name={'call'}
                type={'Ionicons'}
                size={25}
                color={COLORS.darkBlue}
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
                color={COLORS.darkBlue}
              />
            </TouchableOpacity>
          </View>
          <VectorIcon
            name={'cross'}
            type={'Entypo'}
            size={30}
            style={styles.closeButton}
            color={COLORS.darkBlue}
            onPress={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SellerScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: COLORS.white,
  },
  textInputContainer: {
    marginTop: 20,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    width: '95%',
    borderWidth: 1,
    borderColor: COLORS.darkBlue,
    borderRadius: 40,
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    height: 40,
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 18,
  },
  text: {marginTop: 5, color: COLORS.darkBlue, fontSize: 16},
  img: {width: '100%', height: '100%'},
  iconOpacity: {opacity: 0.7},
  addIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    borderColor: COLORS.darkBlue,
    borderStyle: 'dotted',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rootImgContainer: {
    marginTop: 5,
    paddingHorizontal: '3.6%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  imgContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    elevation: 5, // This property is for Android
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingVertical: 80,
    paddingHorizontal: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.darkBlue,
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 30,
    elevation: 3.5,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
  },
  closeButton: {
    position: 'absolute',
    bottom: 170,
    right: 5,
  },
});
