import React, {useEffect, useRef} from 'react';

import {
  Button,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import {
  RTCPeerConnection,
  RTCIceCandidate,
  RTCSessionDescription,
  RTCView,
  MediaStream,
  mediaDevices,
} from 'react-native-webrtc';
import {useState} from 'react';

import firestore from '@react-native-firebase/firestore';

const RTCIndex = ({navigation}) => {
  const [remoteStream, setRemoteStream] = useState(null);

  const [webcamStarted, setWebcamStarted] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [channelId, setChannelId] = useState(null);
  const pc = useRef();
  const servers = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

  const startWebcam = async () => {
    try {
      const localStream = await mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      console.log('Local Stream:', localStream);

      setLocalStream(localStream);

      pc.current = new RTCPeerConnection(servers); // Ensure pc.current is properly initialized

      pc.current.ontrack = event => {
        console.log('Received remote tracks:', event.track);
        event.streams.forEach(stream => {
          console.log('Received remote stream:', stream);
          setRemoteStream(stream);
        });
      };

      localStream.getTracks().forEach(track => {
        pc.current.addTrack(track, localStream);
      });

      setWebcamStarted(true);
    } catch (error) {
      console.error('Error starting webcam:', error);
    }
  };
  useEffect(() => {
    startWebcam();
  }, []);
  const startCall = async () => {
    const channelDoc = firestore().collection('channels').doc();
    const offerCandidates = channelDoc.collection('offerCandidates');
    const answerCandidates = channelDoc.collection('answerCandidates');

    setChannelId(channelDoc.id);

    pc.current.onicecandidate = async event => {
      if (event.candidate) {
        await offerCandidates.add(event.candidate.toJSON());
      }
    };

    const offer = await pc.current.createOffer();
    await pc.current.setLocalDescription(offer);

    await channelDoc.set({offer: offer});

    channelDoc.onSnapshot(snapshot => {
      const data = snapshot.data();
      if (!pc.current.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.current.setRemoteDescription(answerDescription);
      }
    });

    answerCandidates.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          pc.current.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  };

  const joinCall = async () => {
    const channelDoc = firestore().collection('channels').doc(channelId);
    const offerCandidates = channelDoc.collection('offerCandidates');
    const answerCandidates = channelDoc.collection('answerCandidates');

    pc.current.onicecandidate = async event => {
      if (event.candidate) {
        await answerCandidates.add(event.candidate.toJSON());
      }
    };

    const channelDocument = await channelDoc.get();
    const channelData = channelDocument.data();

    const offerDescription = channelData.offer;

    await pc.current.setRemoteDescription(
      new RTCSessionDescription(offerDescription),
    );

    const answer = await pc.current.createAnswer();
    await pc.current.setLocalDescription(answer);

    await channelDoc.update({answer: answer});

    offerCandidates.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          pc.current.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  };
  console.log(remoteStream?.toURL());
  console.log('🚀 ~ RTCIndex ~ remoteStream:', remoteStream);
  console.log(localStream?.toURL());
  console.log('🚀 ~ RTCIndex ~ localStream:', localStream);
  const endCall = () => {
    // Close the peer connection and reset states
    if (pc.current) {
      pc.current.close();
    }
    setLocalStream(null);
    setRemoteStream(null);
    setChannelId(null);
    setWebcamStarted(false);
    navigation.goBack();
  };
  return (
    <KeyboardAvoidingView style={styles.body} behavior="position">
      <SafeAreaView>
        {localStream && (
          <RTCView
            streamURL={localStream?.toURL()}
            style={styles.stream}
            objectFit="cover"
            mirror
          />
        )}

        {remoteStream && (
          <RTCView
            streamURL={remoteStream?.toURL()}
            style={styles.RemoteStream}
            objectFit="cover"
            mirror
          />
        )}
        <View style={styles.buttons}>
          {/* {!webcamStarted && (
            <Button title="Start webcam" onPress={startWebcam} />
          )} */}
          {webcamStarted && <Button title="Start call" onPress={startCall} />}
          {webcamStarted && (
            <View style={{flexDirection: 'row'}}>
              <Button title="Join call" onPress={joinCall} />
              <TextInput
                value={channelId}
                placeholder="callId"
                minLength={45}
                style={{borderWidth: 1, padding: 5}}
                onChangeText={newText => setChannelId(newText)}
              />
              <Button title="End Call" onPress={endCall} />
            </View>
          )}
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#fff',

    justifyContent: 'center',
    alignItems: 'center',
    ...StyleSheet.absoluteFill,
  },
  stream: {
    flex: 2,
    width: 100,
    height: 100,
    margin: 10,
  },
  RemoteStream: {
    flex: 2,
    width: 200,
    height: 200,
    margin: 10,
  },
  buttons: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
});

export default RTCIndex;
