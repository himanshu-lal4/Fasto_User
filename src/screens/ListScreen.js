import {FlatList, TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import {DummyData} from '../components/Common/DummyData';
import React, {useState} from 'react';
import {COLORS, FONTS} from '../assets/theme';
import {Dimensions} from 'react-native';
import VectorIcon from '../assets/VectorIcon/VectorIcon';
import {ScrollView} from 'react-native-virtualized-view';
import {StatusBar} from 'react-native';

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
  );
  return (
    <>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#2e59f2'} />
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
    backgroundColor: '#2e59f2',
    height: height,
    width: width,
    padding: '5%',
  },
  renderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: '4%',
    padding: '4%',
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
  detailsContainer: {
    marginHorizontal: '3%',
  },
  productName: {
    fontSize: 14,
    color: '#9cb1f8',
  },
  productDescription: {
    fontSize: 16,
    color: COLORS.white,
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
    backgroundColor: COLORS.white,
    marginLeft: '2%',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.black,
  },
});
