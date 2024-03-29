import {StyleSheet, TouchableOpacity, FlatList, View} from 'react-native';
import React, {useState} from 'react';
import VectorIcon from '../assets/VectorIcon/VectorIcon';
import {COLORS} from '../assets/theme';
import {DummyData} from '../components/Common/DummyData';
import {Checkbox, Text} from 'react-native-paper';

const MessagingScreen = () => {
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
    <View style={styles.renderContainer}>
      <Checkbox
        color={'white'}
        status={
          checkedItems.includes(item['Product Name']) ? 'checked' : 'unchecked'
        }
        onPress={() => handleToggle(item['Product Name'])}
      />
      <View>
        <Text>{item['Product Name']}</Text>
        <Text>{item['Description']}</Text>
      </View>
    </View>
  );

  const slicedData = DummyData.slice(0, 3);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text>Your orders</Text>
        <VectorIcon
          name={'cross'}
          type={'Entypo'}
          size={30}
          color={COLORS.white}
        />
      </View>
      {/* <View>Progress bar</View> */}
      <View>
        <Text>What would you like to order?</Text>
        <Text>Please choose one of the below:</Text>
      </View>
      <View>
        <FlatList
          data={slicedData}
          renderItem={renderItem}
          keyExtractor={item => item['Product Name']}
        />
      </View>
    </View>
  );
};

export default MessagingScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2e59f2',
    flex: 1,
  },
  renderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  headerContainer: {},
});
