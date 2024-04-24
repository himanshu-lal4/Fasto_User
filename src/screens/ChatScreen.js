import {
  StatusBar,
  StyleSheet,
  Text,
  Image,
  View,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import VectorIcon from '../assets/VectorIcon/VectorIcon';
import {Dimensions} from 'react-native';
import CustomLine from '../components/Common/customLine';

const {width, height} = Dimensions.get('window');

const ChatScreen = ({navigation, route}) => {
  const {items} = route.params;
  const {clickedSellerData} = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [deliveryStatus, setDeliveryStatus] = useState({});
  const [yesterday, setYesterday] = useState();

  useEffect(() => {
    sendOrderDetailsAsMessage();
    if (messages.length != 0) {
      setYesterday(true);
    }
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
    // Assuming here that you're sending messages to the clicked seller
    setDeliveryStatus(prevStatus => ({
      ...prevStatus,
      [clickedSellerData.data._id]: 'sent',
    }));
  };
  console.log(messages.length);

  const renderDay = props => {
    const today = new Date();
    const isToday =
      props.currentMessage.createdAt.getDate() === today.getDate() &&
      props.currentMessage.createdAt.getMonth() === today.getMonth() &&
      props.currentMessage.createdAt.getFullYear() === today.getFullYear();

    if (isToday != yesterday) {
      console.log('runnnnnnnnnnn');
      return (
        <View style={styles.dayContainer}>
          <CustomLine
            text={`Today, ${props.currentMessage.createdAt.getDate()} ${props.currentMessage.createdAt.toLocaleString(
              'default',
              {
                month: 'short',
              },
            )}`}
            line1Width={'35%'}
            line2Width={'35%'}
            customStyle={styles.line}
          />
        </View>
      );
    }
    // else {
    //   return (
    //     <View style={styles.dayContainer}>
    //       <Text style={styles.dayText}>
    //         {props.currentMessage.createdAt.toLocaleString('default', {
    //           weekday: 'short',
    //         })}{' '}
    //         {props.currentMessage.createdAt.getDate()}{' '}
    //         {props.currentMessage.createdAt.toLocaleString('default', {
    //           month: 'short',
    //         })}
    //       </Text>
    //     </View>
    //   );
    // }
  };

  const renderBubble = props => {
    return (
      <View
        style={{
          flexDirection: 'column',
          alignItems: props.position === 'right' ? 'flex-end' : 'flex-start',
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <VectorIcon
            name={'dots-three-vertical'}
            type={'Entypo'}
            size={17}
            color={'grey'}
          />
          <View style={styles.bubbleMsg}>
            <Text style={{color: 'white'}}>{props.currentMessage.text}</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: '4%',
            alignSelf: props.position === 'right' ? 'flex-end' : 'flex-start',
          }}>
          <Text
            style={{
              color: 'grey',
              fontSize: 10,
              margin: '5%',
            }}>
            {props.currentMessage.createdAt.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          {!props.currentMessage.sent &&
            props.currentMessage.user._id === 1 && (
              <VectorIcon
                name={'checkmark-done-outline'}
                type={'Ionicons'}
                size={14}
                color={'grey'}
              />
            )}
        </View>
      </View>
    );
  };

  // const renderBubble = () => null;

  const renderInputToolbar = () => null;

  return (
    <View>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />

      <View style={styles.header}>
        <VectorIcon
          name={'left'}
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
          <Text style={{color: 'black', fontWeight: '600', fontSize: 17}}>
            {clickedSellerData.data.name}
          </Text>
          <Text style={{color: 'grey'}}>online</Text>
        </View>
      </View>
      <KeyboardAvoidingView
        // behavior={Platform.OS === 'ios' ? 'padding' : (height = '80%')}
        style={styles.chatContainer}>
        <GiftedChat
          messages={messages}
          onSend={onSend}
          user={{
            _id: 1,
          }}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar}
          // renderDay={renderDay}
        />
        <View style={styles.inputToolbar}>
          <View style={styles.inputContainer}>
            <VectorIcon
              name={'microphone'}
              type={'FontAwesome'}
              size={25}
              color={'#a9abad'}
              style={styles.mic}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Type Here..."
              placeholderTextColor={'#aaacae'}
              value={inputText}
              onChangeText={setInputText}
            />
            <VectorIcon
              name={'send'}
              type={'FontAwesome'}
              size={25}
              color={'#a9abad'}
              style={styles.send}
              onPress={() => {
                if (inputText.trim().length > 0) {
                  onSend([
                    {
                      _id: Math.round(Math.random() * 1000000).toString(),
                      text: inputText.trim(),
                      createdAt: new Date(),
                      user: {
                        _id: 1,
                        name: 'User',
                      },
                    },
                  ]);
                  setInputText('');
                }
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    padding: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  img: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: '8%',
  },
  headerText: {
    marginLeft: '4%',
  },
  bubbleMsg: {
    maxWidth: '100%',
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: '#187afa',
    padding: 10,
  },
  inputToolbar: {
    height: 100,
    width: '100%',
    backgroundColor: 'white',
    // borderWidth: 2,
    // borderColor: 'red',
    padding: '5%',
    // marginBottom: '2%',
  },
  textInput: {
    backgroundColor: '#f6f6f6',
    // borderRadius: 30,
    paddingLeft: '7%',
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: 'black',
  },
  chatContainer: {
    height: '100%',
    backgroundColor: '#f9f9f9',
    // borderWidth: 2,
    // borderColor: 'blue',
  },
  inputContainer: {
    height: '100%',
    width: '100%',
    padding: '2%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#f6f6f6',
  },
  mic: {
    marginLeft: '7%',
  },
  send: {
    marginRight: '4%',
  },
  dayContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  dayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'grey',
  },
  line: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
