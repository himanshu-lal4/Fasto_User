import {StatusBar, StyleSheet, Text, Image, View, FlatList} from 'react-native';
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

  const onSend = (newMessages = []) => {
    setMessages(prevMessages => GiftedChat.append(prevMessages, newMessages));
  };

  return (
    <>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#f5f6fb'} />
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
          <Text>{clickedSellerData.data.name}</Text>
          <Text>{clickedSellerData.data.email}</Text>
        </View>
      </View>
      {/* <FlatList
        data={items}
        ListHeaderComponent={
          <View style={styles.orderDetailsContainer}>
            <Text style={styles.title}>Order Details</Text>
          </View>
        }
        renderItem={({item}) => (
          <View style={styles.itemContainer}>
            <Text>{item.Product}</Text>
            <Text>Quantity: {item.Quantity}</Text>
            <Text>Price: {item.Price}</Text>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      /> */}
      <GiftedChat
        messages={messages}
        onSend={newMessages => onSend(newMessages)}
        user={{
          _id: 1,
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
    backgroundColor: '#f5f6fb',
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
  orderDetailsContainer: {
    backgroundColor: '#def6ff',
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 10,
    alignItems: 'center',
  },
});
