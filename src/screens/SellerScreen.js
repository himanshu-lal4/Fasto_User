import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import VectorIcon from '../assets/VectorIcon/VectorIcon';
import {DummyData} from '../components/SellerScreen/DummyData';
import {FONTS} from '../assets/theme';
import {useNavigation} from '@react-navigation/native';

const SellerScreen = () => {
  const navigation = useNavigation();

  const renderItem = ({item}) =>
    item.id == 0 ? (
      <TouchableOpacity
        key={item.id}
        style={styles.rootImgContainer}
        onPress={() => {
          navigation.navigate('QRScanner');
        }}>
        <View style={styles.addIconContainer}>
          <VectorIcon name="add" size={60} style={styles.iconOpacity} />
        </View>
        <Text style={styles.text}>{item.data.name}</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity key={item.id} style={styles.rootImgContainer}>
        <View style={styles.imgContainer}>
          <Image style={styles.img} source={{uri: item.data.imageUrl}} />
        </View>
        <Text style={[FONTS.h4, styles.text]}>{item.data.name}</Text>
      </TouchableOpacity>
    );

  return (
    <SafeAreaView style={styles.rootContainer}>
      <View style={styles.textInputContainer}>
        <VectorIcon name="search" size={30} style={styles.iconOpacity} />
        <TextInput style={styles.textInput} placeholder="Search..." />
      </View>

      <FlatList
        contentContainerStyle={{
          marginTop: 20,
        }}
        data={DummyData}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={3}
      />
    </SafeAreaView>
  );
};

export default SellerScreen;

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  textInputContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    width: '100%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 40,
    alignItems: 'center',
  },
  textInput: {
    width: '80%',
    height: 40,
    // backgroundColor: 'gray',
    paddingVertical: 5,
    paddingHorizontal: 10,
    fontSize: 20,
  },
  text: {marginTop: 5},
  img: {width: '100%', height: '100%'},
  iconOpacity: {opacity: 0.7},
  addIconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',
    borderColor: 'gray',
    borderStyle: 'dotted',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rootImgContainer: {
    marginTop: 5,
    paddingHorizontal: '3.6%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  imgContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    overflow: 'hidden',

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5, // This property is for Android
  },
});
