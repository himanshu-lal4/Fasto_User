// import {StyleSheet, Text, View} from 'react-native';
// import React from 'react';
// import {
//   RTCPeerConnection,
//   RTCView,
//   mediaDevices,
//   RTCIceCandidate,
//   RTCSessionDescription,
// } from 'react-native-webrtc';
// // const StartWebCam = () => {
// const StartWebCam = async () => {
//   const pc = useRef();
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
// };
// //   return (
// //     <View>
// //       <Text>StartWebCam</Text>
// //     </View>
// //   )
// // }

// export default StartWebCam;

// const styles = StyleSheet.create({});
