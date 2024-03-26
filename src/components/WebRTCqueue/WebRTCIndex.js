import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  SafeAreaView,
  RecyclerViewBackedScrollView,
} from 'react-native';
import RoomScreen from './RoomScreen';
import CallScreen from './CallScreen';
import JoinScreen from './JoinScreen';
import {COLORS} from '../../assets/theme';

export default function WebRTCIndex({route, navigation}) {
  const {clickedSellerDeviceToken} = route.params;
  const screens = {
    ROOM: 'JOIN_ROOM',
    CALL: 'CALL',
    JOIN: 'JOIN',
  };

  const [screen, setScreen] = useState(screens.CALL);
  const [roomId, setRoomId] = useState('');

  let content;

  switch (screen) {
    case screens.ROOM:
      content = (
        <RoomScreen
          roomId={clickedSellerDeviceToken}
          //   setRoomId={setRoomId}
          screens={screens}
          setScreen={setScreen}
        />
      );
      break;

    case screens.CALL:
      content = (
        <CallScreen
          roomId={clickedSellerDeviceToken}
          screens={screens}
          setScreen={setScreen}
          navigation={navigation}
        />
      );
      break;

    case screens.JOIN:
      content = (
        <JoinScreen
          roomId={clickedSellerDeviceToken}
          screens={screens}
          setScreen={setScreen}
          navigation={navigation}
        />
      );
      break;

    default:
      content = <Text>Wrong Screen</Text>;
  }

  return <SafeAreaView style={styles.container}>{content}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: COLORS.white,
  },
});
