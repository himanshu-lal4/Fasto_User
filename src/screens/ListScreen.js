import {
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {DummyData} from '../components/Common/DummyData';
import React, {useState} from 'react';
import {COLORS, FONTS} from '../assets/theme';
import {Dimensions} from 'react-native';
import VectorIcon from '../assets/VectorIcon/VectorIcon';
import {ScrollView} from 'react-native-virtualized-view';
import {StatusBar} from 'react-native';
import Line from '../components/Common/Line';

const {width, height} = Dimensions.get('window');

const ListScreen = ({navigation}) => {
  const [checkedItems, setCheckedItems] = useState([]);
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

  const renderItem = ({item}) => (
    <>
      <TouchableOpacity
        style={[styles.renderContainer]}
        onPress={() => handleToggle(item.Product)}>
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
                  ? COLORS.white
                  : 'transparent',
                borderColor: COLORS.white,
              },
            ]}>
            {/* {checkedItems.includes(item.Product) && (
            // <View style={styles.checkedIndicator}>Get</View>
          )} */}
            Get
          </Text>
        </View>
      </TouchableOpacity>
      <Line line1Width={'70%'} line2Width={'0'} customStyle={styles.line} />
    </>
  );
  return (
    <>
      <StatusBar barStyle={'light-content'} backgroundColor={'#2e59f2'} />
      <View style={styles.container}>
        <FlatList
          data={DummyData}
          renderItem={renderItem}
          keyExtractor={item => item.Product}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          <View style={styles.footerContainer}>
            <VectorIcon
              name={'arrowleft'}
              type={'AntDesign'}
              size={25}
              color={COLORS.white}
              style={styles.footerIcon}
              onPress={() => navigation.goBack()}
            />
            <View>
              <TouchableOpacity
                style={styles.footerButton}
                onPress={() => navigation.goBack()}>
                <Text style={styles.footerButtonText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default ListScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    height: height,
    width: width,
    padding: '5%',
  },
  renderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: '4%',
    paddingHorizontal: '3%',
    paddingTop: '2%',
  },
  line: {
    margin: 0,
    padding: 0,
    height: 0,
    justifyContent: 'flex-end',
  },
  checkbox: {
    // height: '100%',
    // width: '15%',
    backgroundColor: COLORS.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: '3%',
    // paddingHorizontal: '4%',
    // paddingVertical: '10%',
    borderRadius: 20,
    position: 'absolute',
    right: 0,
  },
  checkedIndicator: {
    backgroundColor: COLORS.white,
    color: COLORS.darkBlue,
    // width: '100%',
    // height: '100%',
    textAlign: 'center',
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
    paddingHorizontal: '30%',
    paddingVertical: '7%',
    backgroundColor: '#2850de',
    marginLeft: '2%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
});
