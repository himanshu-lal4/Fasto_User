import React, {useState, useEffect, useRef} from 'react';
import {
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Modal,
  Animated,
} from 'react-native';
import {DummyData} from '../components/Common/DummyData';
import {COLORS, FONTS} from '../assets/theme';
import {Dimensions} from 'react-native';
import VectorIcon from '../assets/VectorIcon/VectorIcon';
import {ScrollView} from 'react-native-virtualized-view';
import {StatusBar} from 'react-native';
import Line from '../components/Common/Line';
import {connect} from 'react-redux';
import {addItem} from '../redux/ItemSlice';

const {width, height} = Dimensions.get('window');

const ListScreen = ({navigation, addItem}) => {
  const [checkedItems, setCheckedItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const position = useRef(new Animated.Value(50)).current;
  const [quantity, setQuantity] = useState(1);
  const [listContainerHeight, setListContainerHeight] = useState('100%');

  useEffect(() => {
    setListContainerHeight(modalVisible ? height * 0.85 : '100%');
  }, [modalVisible]);

  const slideModal = toValue => {
    Animated.timing(position, {
      toValue: toValue,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    if (modalVisible) {
      slideModal(0); // Slide up when modal is visible
    } else {
      slideModal(height); // Slide down when modal is hidden
    }
  }, [modalVisible]);

  const increaseQuantity = item => {
    setQuantity(quantity + 1);
    selectedItem.Quantity += 1;
    const addPrice = item.Price;
    setEstimatedPrice(estimatedPrice + addPrice);
  };

  const decreaseQuantity = item => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      const addPrice = item.Price;
      setEstimatedPrice(estimatedPrice - addPrice);
    }
  };

  const addItemToChat = () => {
    // Dispatch the action to add item to Redux state
    console.log(selectedItem);
    addItem(selectedItem, quantity);
    setModalVisible(false);
    Animated.timing(position, {
      toValue: height,
      duration: 200,
      useNativeDriver: true,
    }).start();
    console.log('STARTED');
  };

  const renderItem = ({item}) => (
    <>
      <TouchableOpacity
        style={styles.renderContainer}
        onPress={() => {
          setSelectedItem(item);
          setQuantity(1);
          setModalVisible(true);
          setEstimatedPrice(item.Price);
        }}>
        <Image source={item.img} style={styles.img} />
        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{item.Product}</Text>
          <View style={{width: width * 0.48}}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.productDescription}>
              {item.Description}
            </Text>
          </View>
        </View>
        <View style={styles.checkbox}>
          <Text
            style={[
              styles.checkedIndicator,
              {
                backgroundColor: checkedItems.includes(item.Product)
                  ? COLORS.darkBlue
                  : 'transparent',
                borderColor: COLORS.white,
              },
            ]}>
            &#x20B9; {`${item.Price}`}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.line}></View>
    </>
  );

  return (
    <>
      <StatusBar barStyle={'dark-content'} backgroundColor={COLORS.white} />
      <View style={styles.container}>
        <View style={[{height: listContainerHeight}]}>
          <FlatList
            data={DummyData}
            renderItem={renderItem}
            keyExtractor={item => item.Product}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <Animated.View
          style={[
            styles.modalContainer,
            {transform: [{translateY: position}]},
          ]}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <View>
                <Text style={styles.Product}>{selectedItem.Product}</Text>
                <View style={styles.contentContainer}>
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      onPress={() => decreaseQuantity(selectedItem)}>
                      <VectorIcon
                        name={'minus'}
                        type={'AntDesign'}
                        size={20}
                        color={COLORS.blue}
                      />
                    </TouchableOpacity>
                    <Text style={styles.quantity}>{quantity}</Text>
                    <TouchableOpacity
                      onPress={() => increaseQuantity(selectedItem)}>
                      <VectorIcon
                        name={'plus'}
                        type={'AntDesign'}
                        size={20}
                        color={COLORS.blue}
                      />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.addItem}
                    onPress={addItemToChat}>
                    <Text style={styles.modalText}>Add Item - </Text>
                    <Text style={styles.modalText}>
                      &#x20B9;{estimatedPrice}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </Animated.View>
      </View>
    </>
  );
};

const mapDispatchToProps = dispatch => ({
  addItem: (item, quantity) => dispatch(addItem(item, quantity)),
});

export default connect(null, mapDispatchToProps)(ListScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingHorizontal: '3%',
    height: height,
    width: width,
  },
  renderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '4%',
    paddingTop: '3%',
  },
  line: {
    borderTopWidth: 1,
    margin: '2%',
    width: '73%',
    alignSelf: 'flex-end',
    borderColor: '#eeeeee',
  },
  checkbox: {
    backgroundColor: '#eeeeee',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '3%',
    borderRadius: 20,
    position: 'absolute',
    right: 0,
  },
  checkedIndicator: {
    color: COLORS.darkBlue,
    textAlign: 'center',
    padding: '2%',
  },
  img: {
    width: '20%',
    height: '130%',
    borderRadius: 10,
  },
  detailsContainer: {
    marginHorizontal: '3%',
  },
  productName: {
    fontSize: 14,
    color: COLORS.black,
  },
  productDescription: {
    fontSize: 16,
    color: COLORS.black,
  },
  listContainer: {
    height: height * 0.85,
  },
  addItem: {
    flexDirection: 'row',
  },
  modalContainer: {
    width: '100%',
    // marginTop: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    padding: 20,
    flexDirection: 'row',
    width: width,
    height: height * 0.165,
  },
  contentContainer: {
    // backgroundColor: 'pink',
    flexDirection: 'row',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalText: {
    color: COLORS.white,
    fontSize: 18,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.blue,
    borderRadius: 5,
    height: '50%',
    paddingHorizontal: '5%',
  },
  quantityButtonText: {
    fontSize: 30,
    color: COLORS.black,
  },
  quantity: {
    fontSize: 20,
    color: COLORS.black,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  Product: {
    position: 'absolute',
  },
  addItem: {
    height: '50%',
    paddingHorizontal: '15%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.blue,
    borderRadius: 5,
  },
  closeButton: {
    alignSelf: 'center',
    backgroundColor: COLORS.gray,
    borderRadius: 30,
    position: 'absolute',
    right: -15,
    top: -15,
  },
});
