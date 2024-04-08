import {StatusBar, StyleSheet, Text, Image, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import VectorIcon from '../assets/VectorIcon/VectorIcon';

const ChatScreen = ({navigation, route}) => {
  const {items} = route.params;
  const {clickedSellerData} = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    sendOrderDetailsAsMessage();
  }, []);

  const sendOrderDetailsAsMessage = () => {
    const orderDetailsMessage = {
      _id: Math.round(Math.random() * 1000000).toString(),
      text:
        'Here are the order details:\n\n' +
        items
          .map(
            item =>
              `${item.Product}\nQuantity: ${item.Quantity}\nPrice: ${item.Price}`,
          )
          .join('\n\n'),
      createdAt: new Date(),
      user: {
        _id: 1,
        name: 'User',
      },
    };
    setMessages([orderDetailsMessage]);
  };

  const onSend = newMessages => {
    setMessages(prevMessages => GiftedChat.append(prevMessages, newMessages));
  };

  return (
    <>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <View style={styles.header}>
        <VectorIcon
          name={'arrowleft'}
          type={'AntDesign'}
          size={25}
          color={'black'}
          onPress={() => navigation.goBack()}
        />
        <Image
          style={styles.img}
          source={{uri: clickedSellerData?.data?.imageUrl}}
        />
        <View style={styles.headerText}>
          <Text style={{color: 'grey'}}>{clickedSellerData.data.name}</Text>
          <Text style={{color: 'grey'}}>{clickedSellerData.data.email}</Text>
        </View>
      </View>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: 1,
        }}
        // Custom styles for GiftedChat
        renderBubble={props => {
          return (
            <View
              style={{
                maxWidth: '80%',
                borderRadius: 15,
                backgroundColor: '#ddf7ff',
                padding: 10,
                marginBottom: 5,
                alignSelf:
                  props.position === 'right' ? 'flex-end' : 'flex-start',
              }}>
              <Text style={{color: 'black'}}>{props.currentMessage.text}</Text>
            </View>
          );
        }}
      />
    </>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10,
  },
  headerText: {
    marginLeft: 10,
  },
});
