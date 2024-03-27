import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  Button,
  View,
  TouchableOpacity,
  Image,
  BackHandler,
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

export default function CallScreen({setScreen, screens, roomId, navigation}) {
  const [startWebCamState, setStartWebCamState] = useState();
  const [speakerOn, setSpeakerOn] = useState(false);
  const [startCallState, setStartCallState] = useState();
  const userUID = useSelector(state => state.userToken.UID);
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
      console.log('inside endCall try');
      await database().ref(`/Sellers/${id}`).update({
        userCallStatus: false,
      });
      console.log('after endCall try');
      console.log('Data updated.', roomId);
    } catch (error) {
      console.error('Error updating data:', error);
    }
    navigation.navigate('SellerScreen');
  }

  const [localStream, setLocalStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [cachedLocalPC, setCachedLocalPC] = useState();
  const [channelId, setChannelId] = useState();
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const backAction = () => {
      // dispatch(addChannelId(null));
      // onBackPress(channelId);
      console.log('Back button pressed');

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Remove the event listener on component unmount

    // The empty dependency array ensures that this effect runs once
    // Similar to componentDidMount in class components
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
    console.log('clickedSellerDeviceToken', id);
    const message = {
      to: roomId,
      notification: {
        title: '📲Fasto user Calling',
        body: '📞📞Call from a fasto user📞📞',
      },
      data: {
        channelId: `${id}`,
        userUID: userUID,
      },
    };

    await fetch('https://fcm.googleapis.com/fcm/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'key=AAAArsiGfCg:APA91bG4MQ_kSTeuCFZDjEkStvHn_zBJ_WmyTLzUg9C7sPmy3THk7s8XnoyhSjrhZ6X_X7VRGPpO_yCFXJ2AYYUEPUWoPV6Lm7jZ28BQ4mQKeoDM8SsrgnE73VdfelwDG9S9ywP5La8F',
      },
      body: JSON.stringify(message),
    });

    try {
      console.log('inside endCall try');
      const roomRef = database().ref(`/Sellers/${id}`);
      roomRef.once('value', async snapshot => {
        if (snapshot.exists()) {
          await roomRef.update({
            userCallStatus: 'truing',
            sellerCallStatus: 'something',
          });
          console.log('Data updated------------>', id);
        } else {
          await roomRef.set({
            userCallStatus: 'setting tr',
            sellerCallStatus: 'settin some',
          });
          console.log('Data set------------>', id);
        }
      });
      console.log('after endCall try');
    } catch (error) {
      console.error('Error updating data:', error);
    }
  }
  const startCall = async id => {
    const localPC = new RTCPeerConnection(configuration);
    localStream.getTracks().forEach(track => {
      localPC.addTrack(track, localStream);
    });
    localPC.onerror = error => {
      console.error('An error occurred:', error);
    };

    const roomRef = await firestore().collection('rooms').doc();
    setChannelId(roomRef.id);
    handleCallNotification(roomRef.id);
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
          console.log('🚀 ~ startCall ~ answerDescription:', answerDescription);
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
      InCallManager.setForceSpeakerphoneOn(true);
      console.log('inside toggleSpeaker if', newMode);
    } else {
      InCallManager.setForceSpeakerphoneOn(false);
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
  return (
    <>
      <View style={{display: 'flex', flex: 1}}>
        <Text style={styles.text}>Session with Joseph Parker</Text>
        <View
          style={{
            flexDirection: 'row',
            position: 'absolute',
            marginTop: '35%',
            marginHorizontal: '7%',
          }}>
          {localStream && (
            <View style={styles.localStream}>
              <RTCView
                style={{
                  width: width * 0.2,
                  height: height * 0.2,
                  objectFit: 'contain',
                }}
                streamURL={localStream && localStream.toURL()}
              />
              <View style={{marginHorizontal: 20, marginVertical: 5}}>
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
          <View
            style={{
              backgroundColor: 'red',
              height: height * 0.05,
              width: width * 0.2,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 30,
            }}>
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
              type={'Entypo'}
              size={30}
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
              name={'cross'}
              type={'Entypo'}
              size={30}
              color={COLORS.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
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
    padding: '4%',
    borderRadius: 50,
    backgroundColor: COLORS.gray,
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
