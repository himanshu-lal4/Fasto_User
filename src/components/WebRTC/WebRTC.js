// Import necessary libraries
import React, {useState, useEffect} from 'react';
import {View, Text, Button} from 'react-native';
// import firebase from 'firebase';
import firestore from '@react-native-firebase/firestore';
import {RTCPeerConnection, RTCView, mediaDevices} from 'react-native-webrtc';

// Initialize Firebase
// const firebaseConfig = {
//   apiKey: 'AIzaSyDNSKDAz8yrxTip0TG7oZC8SC09K1V5JwE',
//   authDomain: 'YOUR_AUTH_DOMAIN',
//   projectId: 'fasto-5de52',
//   storageBucket: 'YOUR_STORAGE_BUCKET',
//   messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
//   appId: '1:750688566312:android:efa20085c6355361b0891d',
//   measurementId: 'YOUR_MEASUREMENT_ID', // This is optional if you are using Firebase Analytics
// };

// firebase.initializeApp(firebaseConfig);

// Initialize WebRTC peer connection
const configuration = {iceServers: [{urls: 'stun:stun.l.google.com:19302'}]};
const peerConnection = new RTCPeerConnection(configuration);

// Component
const WebRTC = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  useEffect(() => {
    const startLocalStream = async () => {
      const stream = await mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      peerConnection.addStream(stream);
    };

    startLocalStream();

    // Cleanup function
    return () => {
      localStream && localStream.release();
      peerConnection.close();
    };
  }, []);

  // Function to handle call initiation
  const initiateCall = async () => {
    const callDocRef = firestore().collection('calls').doc();
    const offerCandidates = callDocRef.collection('offerCandidates');
    const answerCandidates = callDocRef.collection('answerCandidates');

    callDocRef.set({initiator: true});
    console.log('initiateCall');

    // Listen for remote answer
    peerConnection.ontrack = event => {
      setRemoteStream(event.streams[0]);
    };

    // Create offer
    const offerDescription = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offerDescription);

    // Send offer to Firebase
    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };
    await callDocRef.set({offer});

    // Listen for answer
    callDocRef.onSnapshot(async snapshot => {
      const data = snapshot.data();
      if (!peerConnection.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        await peerConnection.setRemoteDescription(answerDescription);
      }
    });
    // Listen for remote ICE candidates
    answerCandidates.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(async change => {
        if (change.type === 'added') {
          const candidate = new RTCIceCandidate(change.doc.data());
          await peerConnection.addIceCandidate(candidate);
        }
      });
    });
  };

  useEffect(() => {
    initiateCall();
  }, []);

  // UI
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{flexDirection: 'row'}}>
        <RTCView
          streamURL={localStream?.toURL()}
          style={{width: 200, height: 200}}
        />
        <RTCView
          streamURL={remoteStream?.toURL()}
          style={{width: 200, height: 200}}
        />
      </View>
      {/* <Button title="Initiate Call" onPress={initiateCall} />/ */}
    </View>
  );
};

export default WebRTC;
