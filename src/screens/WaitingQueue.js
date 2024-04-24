import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import database from '@react-native-firebase/database';
const WaitingQueue = ({clickedSellerData, channelId}) => {
  const userData = useSelector(state => state.userData.user);
  const [queueIdx, setQueueIdx] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [offsetMinutes, setOffsetMinutes] = useState(0);
  console.log('🚀 ~ WaitingQueue ~ userData:', userData.userUid);
  console.log('🚀 ~ WaitingQueue ~ userData:', userData.name);
  //   const {clickedSellerData} = route.params;
  console.log('🚀 ~ WaitingQueue ~ clickedSellerData:', clickedSellerData);
  let allRooms = [];
  let targetIdIndex = 0; // Initialize with -1 indicating not found initially
  console.log('🚀 ~ WaitingQueue ~ targetIdIndex:', targetIdIndex);
  const navigation = useNavigation();
  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       const newTime = new Date();
  //       newTime.setMinutes(newTime.getMinutes() + offsetMinutes);
  //       setCurrentTime(newTime);
  //     }, 1000);

  //     // Clear interval on component unmount
  //     return () => clearInterval(interval);
  //   }, [offsetMinutes]);
  const formatTime = time => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  //      async function fetchAllRooms() {
  //     console.log('in fetch allRom');
  //     await firestore()
  //       .collection('videoRoom')
  //       .doc(clickedSellerData.id)
  //       .collection('rooms')
  //       .get()
  //       .then(querySnapshot => {
  //         // Loop through each document in the query snapshot
  //         querySnapshot.forEach(doc => {
  //           // Get the channelId from each document and push it to the array
  //           allRooms.push(doc.id);
  //         });

  //         // Now, channelIds array contains all channelId values
  //         console.log(clickedSellerData.id);
  //         console.log('Channel IDs:', allRooms);
  //       })
  //       .catch(error => {
  //         console.error('Error getting channel IDs:', error);
  //       });
  //   }

  //   async function fetchAllRooms() {
  //     console.log('in fetch allRom');
  //     await firestore()
  //       .collection('videoRoom')
  //       .doc(clickedSellerData.id)
  //       .collection('rooms')
  //       .onSnapshot(
  //         querySnapshot => {
  //           // Clear the array before updating it with new values
  //           allRooms = [];

  //           // Loop through each document in the query snapshot
  //           querySnapshot.forEach(doc => {
  //             // Get the channelId from each document and push it to the array
  //             allRooms.push(doc.id);
  //           });

  //           // Now, allRooms array contains all channelId values
  //           console.log('Channel IDs:', allRooms);
  //         },
  //         error => {
  //           console.error('Error fetching channel IDs:', error);
  //         },
  //       );
  //   }
  async function leaveCall() {
    //   if (remoteStream) {
    //     firestore()
    //       .collection('videoRoom')
    //       .doc(sellerId)
    //       .collection('rooms')
    //       .doc(roomId)
    //       .collection('callerCandidates') // First collection within 'channelId' document
    //       .get()
    //       .then(querySnapshot => {
    //         querySnapshot.forEach(doc => {
    //           doc.ref.delete();
    //         });
    //       })
    //       .then(() => {
    //         // Step 2: Delete all documents within the second collection
    //         return firestore()
    //           .collection('videoRoom')
    //           .doc(sellerId)
    //           .collection('rooms')
    //           .doc(roomId)
    //           .collection('currCallData') // Second collection within 'channelId' document
    //           .get();
    //       })
    //       .then(querySnapshot => {
    //         querySnapshot.forEach(doc => {
    //           doc.ref.delete();
    //         });
    //       })
    //       .then(() => {
    //         // Step 2: Delete all documents within the second collection
    //         return firestore()
    //           .collection('videoRoom')
    //           .doc(sellerId)
    //           .collection('rooms')
    //           .doc(roomId)
    //           .collection('calleeCandidates') // Second collection within 'channelId' document
    //           .get();
    //       })
    //       .then(querySnapshot => {
    //         querySnapshot.forEach(doc => {
    //           doc.ref.delete();
    //         });
    //       })
    //       .then(() => {
    //         // Step 3: Delete the 'channelId' document
    //         return firestore()
    //           .collection('videoRoom')
    //           .doc(sellerId)
    //           .collection('rooms')
    //           .doc(roomId)
    //           .delete();
    //       })
    //       .then(() => {
    //         console.log('Document and its collections deleted successfully.');
    //       })
    //       .catch(error => {
    //         console.error('Error deleting document and collections:', error);
    //       });
    //   } else {
    // try {
    //   await database().ref(`/Sellers/${channelId}`).update({
    //     userCallStatus: false,
    //   });
    //   console.log('insidewating ququq cut call');
    // } catch (error) {
    //   console.error('Error updating data:', error);
    // }

    await firestore()
      .collection('videoRoom')
      .doc(clickedSellerData.id)
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
          .doc(clickedSellerData.id)
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
          .doc(clickedSellerData.id)
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
    navigation.navigate('SellerScreen');
    //   }
  }
  useEffect(() => {
    const fetchAllRooms = async () => {
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
            console.log('Channel IDs:', allRooms);
            console.log('Index of target ID:', targetIdIndex);
            console.log('🚀 ~ WaitingQueue ~ userData:', userData.userUid);
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
    fetchAllRooms();

    // Clean up function
    return () => {
      // Clean up any event listeners or subscriptions if necessary
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.heading}>You're checked in</Text>
        <Text style={{marginTop: 5}}>
          <Text style={styles.boldBlack}>{userData.name}</Text>, you're now
          waiting for{' '}
          <Text style={styles.boldBlack}>{clickedSellerData.data.name}</Text>
        </Text>
        <Text style={{marginTop: 10}}>
          <Text style={{fontWeight: 'normal', color: 'black'}}>At </Text>
          <Text style={{fontWeight: 'bold', color: 'black'}}>
            {formatTime(currentTime)}
          </Text>
        </Text>

        <View style={styles.circleContainer}>
          <View style={styles.circle}>
            <Text style={{fontSize: 20, fontWeight: '400', marginTop: 30}}>
              Place in queue
            </Text>
            <Text
              style={{
                fontSize: 50,
                fontWeight: '900',
                color: 'black',
                marginTop: 5,
              }}>
              {queueIdx === -1 ? 'NA' : queueIdx}
            </Text>
            <Text style={{fontSize: 20, fontWeight: '400', marginTop: 5}}>
              Around {queueIdx === -1 ? 'NA' : queueIdx * 5} min.
            </Text>
          </View>
          <TouchableOpacity
            style={{marginTop: 20}}
            onPress={async () => {
              await leaveCall();
            }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: '500',
                color: 'blue',
                textDecorationLine: 'underline',
              }}>
              Leave the queue
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
        <Text
          style={{
            fontWeight: '500',
            color: 'black',
            marginBottom: 10,
            fontSize: 20,
          }}>
          Information:
        </Text>
        <Text>
          {'\u2022'} You can explore {clickedSellerData.data.name}'s inventory{' '}
          <Text
            style={{
              color: 'blue',
              textDecorationLine: 'underline',
            }}>
            here
          </Text>
        </Text>
        <Text>
          {'\u2022'} Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Proin ac ipsum eget velit venenatis convallis ut eget elit. Nulla ut
          egestas ex, in ultricies dolor. Mauris ut sagittis nulla. Cras dapibus
          nunc dictum nisi porttitor dictum. Aliquam a ante ut elit fermentum
          porta sed ut justo. Cras eu libero vestibulum lectus mollis varius.
          Proin felis odio, congue vitae porta id, tincidunt et lacus. Quisque
          eget dignissim nulla, suscipit elementum neque. Sed gravida egestas
          ante et suscipit.
        </Text>
      </View>
    </View>
  );
};

export default WaitingQueue;

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 35,
    fontWeight: '600',
    color: 'black',
  },
  boldBlack: {
    fontWeight: 'bold',
    color: 'black',
  },
  footer: {
    marginTop: 30,
  },
  circleContainer: {
    // flex: 1,
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'lightblue',
    alignItems: 'center',
    // justifyContent: 'center',
    borderWidth: 2,
  },
  text: {
    textAlign: 'center',
  },
});
