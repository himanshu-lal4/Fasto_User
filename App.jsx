import {View, Text} from 'react-native';
import React from 'react';
import Index from './src/navigation/Index';
import {PaperProvider} from 'react-native-paper';
import {Notifications} from 'react-native-notifications';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
const App = () => {
  PushNotification.configure({
    onNotification: function (notification) {
      console.log('Notification received:', notification);
    },
    requestPermissions: true,
  });
  Notifications.registerRemoteNotifications();
  PushNotification.createChannel(
    {
      channelId: 'fasto_channel_id', // You can choose any unique string for the channel ID
      channelName: 'Fasto Channel',
      channelDescription: 'Fasto Alerts Channel',
    },
    created => console.log(`Notification channel created: ${created}`),
  );

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    if (remoteMessage.notification) {
      const {title, body} = remoteMessage.notification;

      // Display a local notification when the app is in the background
      PushNotification.localNotification({
        channelId: 'fasto_channel_id', // Specify the channel ID
        title,
        message: body,
        playSound: true,
      });

      console.log('Message handled in the background!', remoteMessage);
    } else {
      console.log('Handling data-only payload:', remoteMessage.data);

      // Perform actions based on the data payload
    }
  });
  return (
    <PaperProvider>
      <Index />
    </PaperProvider>
  );
};

export default App;
