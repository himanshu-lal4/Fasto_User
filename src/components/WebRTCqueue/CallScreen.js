import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  Button,
  View,
  TouchableOpacity,
  Image,
  BackHandler,
  ActivityIndicator,
} from 'react-native';

import {
  RTCPeerConnection,
  RTCView,
  mediaDevices,
  RTCIceCandidate,
  RTCSessionDescription,
} from 'react-native-webrtc';
// import {db} from '../utilities/firebase';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import {useSelector} from 'react-redux';
import muteMicrophoneImage from '../../assets/images/mute-microphone.png';
import microphoneImage from '../../assets/images/microphone.png';
import speakerOnImg from '../../assets/images/speaker.png';
import speakerOfImg from '../../assets/images/speaker-filled-audio-tool.png';
import InCallManager from 'react-native-incall-manager';

import uuid from 'react-native-uuid';
import WaitingQueue from '../../screens/WaitingQueue';
import VectorIcon from '../../assets/VectorIcon/VectorIcon';
import {COLORS, FONTS} from '../../assets/theme';
import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

const configuration = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ],
  iceCandidatePoolSize: 10,
};

export default function CallScreen({
  setScreen,
  screens,
  clickedSellerDeviceToken,
  navigation,
  sellerId,
  clickedSellerData,
}) {
  const [startWebCamState, setStartWebCamState] = useState();
  const [speakerOn, setSpeakerOn] = useState(false);
  const [startCallState, setStartCallState] = useState();
  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [cachedLocalPC, setCachedLocalPC] = useState();
  const [channelId, setChannelId] = useState();
  const [isMuted, setIsMuted] = useState(false);
  const [queueIdx, setQueueIdx] = useState(-2);
  const [currentTime, setCurrentTime] = useState(new Date());
  const userUID = useSelector(state => state.userToken.UID);
  const userData = useSelector(state => state.userData.user);
  async function onBackPress(id) {
    if (cachedLocalPC) {
      localStream.getTracks().forEach(track => {
        track.stop();
      });
      cachedLocalPC.close();
    }
    setLocalStream();
    setRemoteStream();
    setCachedLocalPC();
    try {
      await database().ref(`/Sellers/${id}`).update({
        userCallStatus: false,
      });
      console.log('Data updated.', clickedSellerDeviceToken);
    } catch (error) {
      console.error('Error updating data:', error);
    }
    InCallManager.stop();

    navigation.navigate('SellerScreen');

    if (remoteStream) {
      firestore()
        .collection('videoRoom')
        .doc(sellerId)
        .collection('rooms')
        .doc(channelId)
        .collection('callerCandidates') // First collection within 'channelId' document
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.delete();
          });
        })
        .then(() => {
          // Step 2: Delete all documents within the second collection
          return firestore()
            .collection('videoRoom')
            .doc(sellerId)
            .collection('rooms')
            .doc(channelId)
            .collection('currCallData') // Second collection within 'channelId' document
            .get();
        })
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.delete();
          });
        })
        .then(() => {
          // Step 2: Delete all documents within the second collection
          return firestore()
            .collection('videoRoom')
            .doc(sellerId)
            .collection('rooms')
            .doc(channelId)
            .collection('calleeCandidates') // Second collection within 'channelId' document
            .get();
        })
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.delete();
          });
        })
        .then(() => {
          // Step 3: Delete the 'channelId' document
          return firestore()
            .collection('videoRoom')
            .doc(sellerId)
            .collection('rooms')
            .doc(channelId)
            .delete();
        })
        .then(() => {
          console.log('Document and its collections deleted successfully.');
        })
        .catch(error => {
          console.error('Error deleting document and collections:', error);
        });
    } else {
      firestore()
        .collection('videoRoom')
        .doc(sellerId)
        .collection('rooms')
        .doc(channelId)
        .collection('callerCandidates') // First collection within 'channelId' document
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.delete();
          });
        })
        .then(() => {
          // Step 2: Delete all documents within the second collection
          return firestore()
            .collection('videoRoom')
            .doc(sellerId)
            .collection('rooms')
            .doc(channelId)
            .collection('currCallData') // Second collection within 'channelId' document
            .get();
        })
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.delete();
          });
        })
        .then(() => {
          // Step 3: Delete the 'channelId' document
          return firestore()
            .collection('videoRoom')
            .doc(sellerId)
            .collection('rooms')
            .doc(channelId)
            .delete();
        })
        .then(() => {
          console.log('Document and its collections deleted successfully.');
        })
        .catch(error => {
          console.error('Error deleting document and collections:', error);
        });
    }
  }

  useEffect(() => {
    const backAction = async () => {
      console.log(
        'Back button pressed ------------------ >>>>>>>>>>>>>>>>>>>>>>>',
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Remove the event listener on component unmount
  }, []);

  const startLocalStream = async () => {
    const isFront = true;
    const devices = await mediaDevices.enumerateDevices();

    const facing = isFront ? 'front' : 'environment';
    const videoSourceId = devices.find(
      device => device.kind === 'videoinput' && device.facing === facing,
    );
    const facingMode = isFront ? 'user' : 'environment';
    const constraints = {
      audio: true,
      video: {
        mandatory: {
          minWidth: 500, // Provide your own width, height and frame rate here
          minHeight: 300,
          minFrameRate: 30,
        },
        facingMode,
        optional: videoSourceId ? [{sourceId: videoSourceId}] : [],
      },
    };
    const newStream = await mediaDevices.getUserMedia(constraints);
    setLocalStream(newStream);
    setStartWebCamState(true);
  };
  async function handleCallNotification(id) {
    const sellerRef = database().ref(`/SellersOnCallStatus/${sellerId}`);
    sellerRef.once('value', async snapshot => {
      const sellerData = snapshot.val();
      console.log('sellerData------------->', sellerData);
      console.log(
        'sellerData.isSellerOnCall------------->',
        sellerData.isSellerOnCall,
      );
      if (sellerData && sellerData.isSellerOnCall === true) {
        // Seller exists and is already on another call, send notification A
        console.log(
          '########################################################################################',
        );
        sendNotificationTypeA(id);
      } else {
        // Seller doesn't exist or is available, send notification B
        console.log(
          '***************************************************************************************************************',
        );
        sendNotificationTypeB(id);
      }
    });

    async function sendNotification(message) {
      await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'key=AAAArsiGfCg:APA91bG4MQ_kSTeuCFZDjEkStvHn_zBJ_WmyTLzUg9C7sPmy3THk7s8XnoyhSjrhZ6X_X7VRGPpO_yCFXJ2AYYUEPUWoPV6Lm7jZ28BQ4mQKeoDM8SsrgnE73VdfelwDG9S9ywP5La8F', // Replace with your server key
        },
        body: JSON.stringify(message),
      });
      // await firestore()
      //   .collection('Notifications')
      //   .add({
      //     message: message,
      //     userName: userData.name,
      //     sellerName: clickedSellerData.data.name,
      //   })
      //   .then(() => {
      //     console.log('Notification data added!');
      //   });
    }
    async function sendNotificationTypeA(id) {
      const message = {
        to: clickedSellerDeviceToken,
        notification: {
          title: `${userData.name} Calling`,
          body: `${userData.name} is waiting in the queue`,
        },
        data: {
          channelId: `${id}`,
          userUID: userUID,
          notificationType: 'typeA',
        },
      };

      await sendNotification(message);
    }

    // Function to send notification type B
    async function sendNotificationTypeB(id) {
      const message = {
        to: clickedSellerDeviceToken,
        notification: {
          title: '📲Fasto user Calling',
          body: '📞📞Call from a fasto user📞📞',
        },
        data: {
          channelId: `${id}`,
          userUID: userUID,
          notificationType: 'typeB',
        },
      };

      await sendNotification(message);
    }
    // const message = {
    //   to: roomId,
    //   notification: {
    //     title: '📲Fasto user Calling',
    //     body: '📞📞Call from a fasto user📞📞',
    //   },
    //   data: {
    //     channelId: `${id}`,
    //     userUID: userUID,
    //   },
    // };

    // await fetch('https://fcm.googleapis.com/fcm/send', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization:
    //       'key=AAAArsiGfCg:APA91bG4MQ_kSTeuCFZDjEkStvHn_zBJ_WmyTLzUg9C7sPmy3THk7s8XnoyhSjrhZ6X_X7VRGPpO_yCFXJ2AYYUEPUWoPV6Lm7jZ28BQ4mQKeoDM8SsrgnE73VdfelwDG9S9ywP5La8F',
    //   },
    //   body: JSON.stringify(message),
    // });

    try {
      const roomRef = database().ref(`/Sellers/${id}`);
      roomRef.once('value', async snapshot => {
        if (snapshot.exists()) {
          await roomRef.update({
            userCallStatus: true,
            sellerCallStatus: true,
          });
        } else {
          await roomRef.set({
            userCallStatus: true,
            sellerCallStatus: true,
          });
        }
      });
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }
  // async function handleCallNotification(id) {
  //   const message = {
  //     to: roomId,
  //     notification: {
  //       title: '📲Fasto user Calling',
  //       body: '📞📞Call from a fasto user📞📞',
  //     },
  //     data: {
  //       channelId: `${id}`,
  //       userUID: userUID,
  //     },
  //   };

  //   await fetch('https://fcm.googleapis.com/fcm/send', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       Authorization:
  //         'key=AAAArsiGfCg:APA91bG4MQ_kSTeuCFZDjEkStvHn_zBJ_WmyTLzUg9C7sPmy3THk7s8XnoyhSjrhZ6X_X7VRGPpO_yCFXJ2AYYUEPUWoPV6Lm7jZ28BQ4mQKeoDM8SsrgnE73VdfelwDG9S9ywP5La8F',
  //     },
  //     body: JSON.stringify(message),
  //   });

  //   try {
  //     const roomRef = database().ref(`/Sellers/${id}`);
  //     roomRef.once('value', async snapshot => {
  //       if (snapshot.exists()) {
  //         await roomRef.update({
  //           userCallStatus: true,
  //           sellerCallStatus: true,
  //         });
  //         console.log('Data updated------------>', id);
  //       } else {
  //         await roomRef.set({
  //           userCallStatus: true,
  //           sellerCallStatus: true,
  //         });
  //         console.log('Data set------------>', id);
  //       }
  //     });
  //   } catch (error) {
  //     console.error('Error updating data:', error);
  //   }
  // }
  const startCall = async id => {
    const localPC = new RTCPeerConnection(configuration);
    localStream.getTracks().forEach(track => {
      localPC.addTrack(track, localStream);
    });
    localPC.onerror = error => {
      console.error('An error occurred:', error);
    };
    const uniqueChannelId = uuid.v4();
    const timestamp = Date.now().toString();
    const docId = `${timestamp}_${uniqueChannelId}`;
    const roomRef = firestore()
      .collection('videoRoom')
      .doc(sellerId)
      .collection('rooms')
      .doc(docId);

    const currCallDataRef = roomRef.collection('currCallData').doc(sellerId);

    // Set the data for the specific document within the currCallData collection
    await currCallDataRef.set(
      {
        // Add new field or update existing fields
        active_call: null,
        created_at: firestore.FieldValue.serverTimestamp(),
        userData: userData,
      },
      {merge: true},
    );
    setChannelId(roomRef.id);
    // if (queueIdx == 0) {
    //   handleCallNotification(roomRef.id);
    // }
    const unsubscribe = database()
      .ref(`/Sellers/${roomRef.id}`)
      .on('value', snapshot => {
        const data = snapshot?.val();
        if (data?.sellerCallStatus === false) {
          onBackPress(roomRef.id);
        }
        console.log('Data updated:', data);
      });
    const callerCandidatesCollection = roomRef.collection('callerCandidates');
    localPC.onicecandidate = e => {
      if (!e.candidate) {
        console.log('Got final candidate!');
        return;
      }
      callerCandidatesCollection.add(e.candidate.toJSON());
    };

    localPC.ontrack = event => {
      event.streams.forEach(stream => {
        setRemoteStream(stream);
      });
    };

    const offer = await localPC.createOffer();
    await localPC.setLocalDescription(offer);

    const roomWithOffer = {offer};
    await roomRef.set(roomWithOffer);

    roomRef.onSnapshot(async snapshot => {
      const data = snapshot.data();
      if (data) {
        if (!localPC.currentRemoteDescription && data.answer) {
          const answerDescription = new RTCSessionDescription(data.answer);

          await localPC.setRemoteDescription(answerDescription);
        }
      }
    });

    roomRef.collection('calleeCandidates').onSnapshot(snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          let data = change.doc.data();
          await localPC.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });

    setCachedLocalPC(localPC);
  };

  const switchCamera = () => {
    localStream.getVideoTracks().forEach(track => track._switchCamera());
  };
  InCallManager.start();
  const toggleSpeaker = () => {
    const newMode = !speakerOn;
    setSpeakerOn(newMode);

    // Set the speaker mode
    if (newMode) {
      // InCallManager.setForceSpeakerphoneOn(true);
      InCallManager.setSpeakerphoneOn(true);
      console.log('inside toggleSpeaker if', newMode);
    } else {
      // InCallManager.setForceSpeakerphoneOn(false);
      InCallManager.setSpeakerphoneOn(false);
      console.log('inside toggleSpeaker else', newMode);
    }
  };
  const toggleMute = () => {
    if (!remoteStream) {
      return;
    }
    localStream.getAudioTracks().forEach(track => {
      track.enabled = !track.enabled;
      setIsMuted(!track.enabled);
    });
  };
  useEffect(() => {
    // Call function 1
    startLocalStream();
  }, []); // Empty dependency array ensures this runs only once after mount

  useEffect(() => {
    // Check if state1 is updated, then call function 2
    if (startWebCamState === true) {
      startCall();
    }
  }, [startWebCamState]);
  useEffect(() => {
    // This effect will run whenever 'yourState' changes
    if (channelId) {
      handleCallNotification(channelId);
    }
  }, [channelId]);
  let allRooms = [];
  useEffect(() => {
    const fetchAllRoomsInRealTime = async () => {
      await firestore()
        .collection('videoRoom')
        .doc(clickedSellerData.id)
        .collection('rooms')
        .onSnapshot(
          querySnapshot => {
            // Clear the array before updating it with new values
            let allRooms = [];

            // Loop through each document in the query snapshot
            querySnapshot.forEach(doc => {
              // Get the channelId from each document and push it to the array
              allRooms.push(doc.id);
            });

            // Update the index of the target ID
            const targetIdIndex = allRooms.indexOf(channelId); // Replace yourId with your actual ID
            setQueueIdx(targetIdIndex);

            // Now, allRooms array contains all channelId values

            const newTime = new Date();
            newTime.setMinutes(newTime.getMinutes() + targetIdIndex * 5);
            setCurrentTime(newTime);
          },
          error => {
            console.error('Error fetching channel IDs:', error);
          },
        );
    };

    // Call fetchAllRooms when component mounts
    if (channelId) {
      fetchAllRoomsInRealTime();
    }

    // Clean up function
    return () => {
      // Clean up any event listeners or subscriptions if necessary
    };
  }, [channelId]);
  return (
    <>
      {queueIdx === -2 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : queueIdx <= 0 ? (
        <>
          <View style={{display: 'flex', flex: 1}}>
            <Text style={styles.text}>Session with Joseph Parker</Text>
            <View style={styles.localStreamContainer}>
              {localStream && (
                <View style={styles.localStream}>
                  <RTCView
                    style={styles.localStreamView}
                    streamURL={localStream && localStream.toURL()}
                  />
                  <View style={styles.localStreamTextContainer}>
                    <Text
                      style={{
                        color: COLORS.white,
                      }}>
                      Salma Hellman
                    </Text>
                    <Text
                      style={{
                        color: COLORS.white,
                      }}>
                      Broadcast Organizer
                    </Text>
                  </View>
                </View>
              )}
              <View style={styles.liveContainer}>
                <Text style={{color: COLORS.white}}>&#x2022; Live</Text>
              </View>
            </View>
            {/* {remoteStream && ( */}
            <View style={styles.remoteStream}>
              <RTCView
                style={styles.rtc}
                streamURL={remoteStream && remoteStream.toURL()}
              />
            </View>
            {/* )} */}
          </View>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.toggleButtons}>
              <TouchableOpacity style={styles.buttons}>
                <VectorIcon
                  name={'message'}
                  type={'FontAwesome6'}
                  size={20}
                  color={COLORS.white}
                />
              </TouchableOpacity>

              <TouchableOpacity style={styles.buttons} onPress={toggleSpeaker}>
                {speakerOn ? (
                  <VectorIcon
                    name={'volume-mute'}
                    type={'Ionicons'}
                    size={30}
                    color={COLORS.white}
                    style={styles.clickedButtons}
                  />
                ) : (
                  <VectorIcon
                    name={'volume-up'}
                    type={'FontAwesome'}
                    size={30}
                    color={COLORS.white}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttons} onPress={switchCamera}>
                <VectorIcon
                  name={'camera-reverse'}
                  type={'Ionicons'}
                  size={30}
                  color={COLORS.white}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttons} onPress={toggleMute}>
                {isMuted ? (
                  <VectorIcon
                    name={'microphone-off'}
                    type={'MaterialCommunityIcons'}
                    size={30}
                    style={styles.clickedButtons}
                  />
                ) : (
                  <VectorIcon
                    name={'microphone'}
                    type={'MaterialCommunityIcons'}
                    size={30}
                    color={COLORS.white}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.buttons, {backgroundColor: 'red'}]}
                onPress={() => onBackPress(channelId)}>
                <VectorIcon
                  name={'close'}
                  type={'AntDesign'}
                  size={30}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <WaitingQueue
          clickedSellerData={clickedSellerData}
          channelId={channelId}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  localStreamContainer: {
    flexDirection: 'row',
    position: 'absolute',
    marginTop: '35%',
    marginHorizontal: '7%',
  },
  localStreamView: {
    flexDirection: 'row',
    position: 'absolute',
    marginTop: '35%',
    marginHorizontal: '7%',
  },
  localStreamTextContainer: {
    flexDirection: 'row',
    position: 'absolute',
    marginTop: '35%',
    marginHorizontal: '7%',
  },
  liveContainer: {
    backgroundColor: 'red',
    height: height * 0.05,
    width: width * 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  heading: {
    alignSelf: 'center',
    fontSize: 30,
  },
  rtc: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  text: {
    ...FONTS.h1,
    color: COLORS.white,
    position: 'absolute',
    top: 30,
    marginHorizontal: 25,
    marginVertical: 30,
    paddingVertical: '2%',
  },
  remoteStream: {
    position: 'absolute',
    height: height * 0.88,
    width: '100%',
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    overflow: 'hidden',
    zIndex: -1,
    flexDirection: 'row',
  },
  localStream: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
  },
  clickedButtons: {
    // padding: '4%',
    alignItems: 'center',
    backgroundColor: COLORS.gray,
    borderRadius: 50,
  },
  buttons: {
    padding: '5%',
    borderRadius: 50,
    backgroundColor: '#12131e',
    alignSelf: 'center',
  },
  toggleButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 110,
  },
  callButtons: {
    padding: 10,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  buttonContainer: {
    margin: 5,
  },
});
