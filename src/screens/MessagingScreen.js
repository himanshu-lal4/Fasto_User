import {
  StyleSheet,
  TouchableOpacity,
  FlatList,
  View,
  StatusBar,
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
const {width, height} = Dimensions.get('window');

const MessagingScreen = ({navigation}) => {
  const [checkedItems, setCheckedItems] = useState([]);
  const [data, setData] = useState();

  useEffect(() => {
    const slicedData = DummyData.slice(0, 3);
    setData(slicedData);
  }, []);

  const handleToggle = itemName => {
    const currentIndex = checkedItems.indexOf(itemName);
    const newChecked = [...checkedItems];

    if (currentIndex === -1) {
      newChecked.push(itemName);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedItems(newChecked);
  };

  const handleRemove = item => {
    const filteredData = data.filter(id => {
      return id.Product !== item;
    });
    setData(filteredData);
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
    <Swipeable renderRightActions={() => renderLeft(item.Product)}>
      <TouchableOpacity
        style={[
          styles.renderContainer,
          checkedItems.includes(item.Product)
            ? {backgroundColor: '#5699f0'}
            : {backgroundColor: '#2048d5'},
        ]}
        onPress={() => handleToggle(item.Product)}>
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
        <View style={styles.detailsContainer}>
          <Text style={styles.productName}>{item.Product}</Text>
          <Text style={styles.productDescription}>{item.Description}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );

  return (
    <>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#2e59f2'} />
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
              data={data}
              renderItem={renderItem}
              keyExtractor={item => item.Product}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('ListScreen')}>
              <Text style={styles.productDescription}>+ Add More</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.footerIcon}>
              <VectorIcon
                name={'arrowleft'}
                type={'AntDesign'}
                size={25}
                color={COLORS.white}
                onPress={() => navigation.goBack()}
              />
            </TouchableOpacity>
            <View>
              <TouchableOpacity style={styles.footerButton}>
                <Text style={styles.footerButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default MessagingScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2e59f2',
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
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '3%',
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
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: '15%',
    marginTop: '5%',
  },
  footerIcon: {
    padding: '5%',
    borderRadius: 30,
    backgroundColor: '#2850de',
  },
  footerButton: {
    paddingHorizontal: '30%',
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
