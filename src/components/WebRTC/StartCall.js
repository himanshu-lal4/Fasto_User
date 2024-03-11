// import firestore from '@react-native-firebase/firestore';
// import {useEffect} from 'react';
// import {
//   RTCPeerConnection,
//   RTCView,
//   mediaDevices,
//   RTCIceCandidate,
//   RTCSessionDescription,
// } from 'react-native-webrtc';
// import StartWebCam from './StartWebCam';
// export const StartCall = async () => {
//   console.log('startCAll');
//   const [remoteStream, setRemoteStream] = useState(null);
//   const [localStream, setLocalStream] = useState(null);
//   const [webcamStarted, setWebcamStarted] = useState(false);
//   const [channelId, setChannelId] = useState(null);
//   //   StartWebCam(setRemoteStream, setLocalStream);
//   const pc = useRef();
//   console.log(object);
//   const servers = {
//     iceServers: [
//       {
//         urls: [
//           'stun:stun1.l.google.com:19302',
//           'stun:stun2.l.google.com:19302',
//         ],
//       },
//     ],
//     iceCandidatePoolSize: 10,
//   };
//   console.log('useWebCam');
//   pc.current = new RTCPeerConnection(servers);
//   const local = await mediaDevices.getUserMedia({
//     video: true,
//     audio: true,
//   });
//   pc.current.addStream(local);
//   setLocalStream(local);

//   const remote = new MediaStream();
//   setRemoteStream(remote);

//   // Push tracks from local stream to peer connection
//   local.getTracks().forEach(track => {
//     pc.current.getLocalStreams()[0].addTrack(track);
//   });

//   // Pull tracks from peer connection, add to remote video stream
//   pc.current.ontrack = event => {
//     event.streams[0].getTracks().forEach(track => {
//       remote.addTrack(track);
//     });
//   };

//   pc.current.onaddstream = event => {
//     setRemoteStream(event.stream);
//   };
//   const channelDoc = firestore().collection('channels').doc();
//   const offerCandidates = channelDoc.collection('offerCandidates');
//   const answerCandidates = channelDoc.collection('answerCandidates');

//   setChannelId(channelDoc.id);

//   pc.current.onicecandidate = async event => {
//     if (event.candidate) {
//       await offerCandidates.add(event.candidate.toJSON());
//     }
//   };

//   //create offer
//   const offerDescription = await pc.current.createOffer();
//   await pc.current.setLocalDescription(offerDescription);

//   const offer = {
//     sdp: offerDescription.sdp,
//     type: offerDescription.type,
//   };

//   await channelDoc.set({offer});

//   // Listen for remote answer
//   channelDoc.onSnapshot(snapshot => {
//     const data = snapshot.data();
//     if (!pc.current.currentRemoteDescription && data?.answer) {
//       const answerDescription = new RTCSessionDescription(data.answer);
//       pc.current.setRemoteDescription(answerDescription);
//     }
//   });

//   // When answered, add candidate to peer connection
//   answerCandidates.onSnapshot(snapshot => {
//     snapshot.docChanges().forEach(change => {
//       if (change.type === 'added') {
//         const data = change.doc.data();
//         pc.current.addIceCandidate(new RTCIceCandidate(data));
//       }
//     });
//   });
//   return (
//     <KeyboardAvoidingView style={styles.body} behavior="position">
//       <SafeAreaView>
//         {localStream && (
//           <RTCView
//             streamURL={localStream?.toURL()}
//             style={styles.stream}
//             objectFit="cover"
//             mirror
//           />
//         )}

//         {remoteStream && (
//           <RTCView
//             streamURL={remoteStream?.toURL()}
//             style={styles.stream}
//             objectFit="cover"
//             mirror
//           />
//         )}
//         <View style={styles.buttons}>
//           {!webcamStarted && (
//             <Button title="Start webcam" onPress={startWebcam} />
//           )}
//           {webcamStarted && <Button title="Start call" onPress={startCall} />}
//           {webcamStarted && (
//             <View style={{flexDirection: 'row'}}>
//               <Button title="Join call" onPress={joinCall} />
//               <TextInput
//                 value={channelId}
//                 placeholder="callId"
//                 minLength={45}
//                 style={{borderWidth: 1, padding: 5}}
//                 onChangeText={newText => setChannelId(newText)}
//               />
//             </View>
//           )}
//         </View>
//       </SafeAreaView>
//     </KeyboardAvoidingView>
//   );
// };
