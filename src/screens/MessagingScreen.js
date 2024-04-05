import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  View,
  StatusBar,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import VectorIcon from '../assets/VectorIcon/VectorIcon';
import {COLORS, FONTS} from '../assets/theme';
import {DummyData} from '../components/Common/DummyData';
import {Checkbox, Text} from 'react-native-paper';
import ProgressBar from '../components/Common/ProgressBar';
import {Dimensions} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import {ScrollView} from 'react-native-virtualized-view';
import {useDispatch, useSelector} from 'react-redux';
import {deleteItem} from '../redux/ItemSlice';
const {width, height} = Dimensions.get('window');

const MessagingScreen = ({navigation, route}) => {
  const {clickedSellerData} = route.params;
  const [checkedItems, setCheckedItems] = useState([]);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const selectedData = useSelector(state => state.items.selectedItems);
  const [data, setData] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    const initialCheckedItems = selectedData.map(item => {
      return item.Product;
    });
    setCheckedItems(initialCheckedItems);
    calculateEstimatedPrice(selectedData);
  }, [selectedData]);

  const calculateEstimatedPrice = items => {
    let total = 0;
    items.forEach(item => {
      total += item.Price * item.Quantity;
    });
    setEstimatedPrice(total);
  };

  const handleToggle = item => {
    const currentIndex = checkedItems.indexOf(item.Product);
    const newChecked = [...checkedItems];

    if (currentIndex === -1) {
      newChecked.push(item.Product);
      const addPrice = item.Price;
      setEstimatedPrice(estimatedPrice + addPrice);
    } else {
      newChecked.splice(currentIndex, 1);
      const addPrice = item.Price;
      setEstimatedPrice(estimatedPrice - addPrice);
    }
    setCheckedItems(newChecked);
  };

  const handleRemove = item => {
    dispatch(deleteItem(item));
  };

  const renderLeft = item => {
    return (
      <TouchableOpacity
        style={styles.renderLeft}
        onPress={() => handleRemove(item)}>
        <Text style={styles.renderLeftText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  const renderItem = ({item}) => (
    <Swipeable renderRightActions={() => renderLeft(item)}>
      <TouchableOpacity
        style={[
          styles.renderContainer,
          checkedItems.includes(item.Product)
            ? {backgroundColor: '#5699f0'}
            : {backgroundColor: '#2048d5'},
        ]}
        onPress={() => handleToggle(item)}>
        <Image source={item.img} style={styles.img} />
        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{item.Product}</Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.productDescription}>
            {item.Description}
          </Text>
        </View>
        <View
          style={[
            styles.checkbox,
            {
              backgroundColor: checkedItems.includes(item.Product)
                ? COLORS.white
                : 'transparent',
              borderColor: COLORS.white,
            },
          ]}>
          {checkedItems.includes(item.Product) && (
            <View style={styles.checkedIndicator} />
          )}
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <>
      <StatusBar barStyle={'light-content'} backgroundColor={'#4269f3'} />
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Your Orders</Text>
            <VectorIcon
              name={'close'}
              type={'AntDesign'}
              size={25}
              color={COLORS.white}
              style={styles.headerIcon}
              onPress={() => navigation.goBack()}
            />
          </View>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressText}>
              <Text style={[styles.productName, {marginBottom: '4%'}]}>
                Progress
              </Text>
              <Text style={{color: COLORS.white}}>1 of 2</Text>
            </View>
            <ProgressBar progress="50" />
          </View>
          <View>
            <Text style={styles.title}>What would you like to order?</Text>
            <Text style={styles.title2}>Please choose one of the below:</Text>
          </View>
          <View style={styles.listContainer}>
            <FlatList
              data={selectedData}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>
          <TouchableOpacity
            style={styles.footerIcon}
            onPress={() => navigation.navigate('ListScreen')}>
            <VectorIcon
              name={'plus'}
              type={'AntDesign'}
              size={25}
              color={COLORS.white}
            />
          </TouchableOpacity>
          <View>
            <TouchableOpacity
              style={styles.footerButton}
              onPress={() =>
                navigation.navigate('addressScreen', {
                  selectedItems: selectedData,
                  clickedSellerData: clickedSellerData,
                })
              }>
              <Text style={styles.footerButtonText}>
                continue - &#x20B9;{estimatedPrice}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default MessagingScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4269f3',
    height: height,
    width: width,
    paddingHorizontal: '5%',
  },
  renderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: '4%',
    padding: '4%',
  },
  listContainer: {
    marginTop: '13%',
    marginBottom: '5%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '5%',
  },
  headerText: {
    fontSize: 26,
    color: COLORS.white,
  },
  headerIcon: {
    padding: '2%',
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#2850de',
  },
  title: {
    fontSize: 48,
    color: COLORS.white,
    marginTop: '8%',
  },
  title2: {
    fontSize: 16,
    color: COLORS.white,
    marginTop: '2%',
  },
  productName: {
    fontSize: 14,
    color: '#9cb1f8',
  },
  productDescription: {
    fontSize: 16,
    color: COLORS.white,
  },
  detailsContainer: {
    marginHorizontal: '3%',
  },
  checkbox: {
    width: 0,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '3%',
    position: 'absolute',
    right: 15,
  },
  checkedIndicator: {
    width: 12,
    height: 12,
    backgroundColor: COLORS.white,
    borderRadius: 2,
  },
  progressBarContainer: {
    marginTop: '8%',
  },
  progressBar: {
    borderRadius: 20,
    padding: 3,
  },
  progressText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  renderLeft: {
    backgroundColor: 'red',
    height: '80%',
    width: '20%',
    marginLeft: '2%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  renderLeftText: {
    color: COLORS.white,
    fontSize: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: '5%',
  },
  button: {
    paddingVertical: '4%',
    paddingHorizontal: '6%',
    backgroundColor: '#5699f0',
    borderRadius: 30,
  },
  img: {
    width: '20%',
    height: '130%',
    borderRadius: 5,
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: '5%',
  },
  footerIcon: {
    padding: '5%',
    borderRadius: 30,
    backgroundColor: '#2850de',
  },
  footerButton: {
    paddingHorizontal: '24%',
    paddingVertical: '7%',
    backgroundColor: COLORS.white,
    marginLeft: '2%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});
