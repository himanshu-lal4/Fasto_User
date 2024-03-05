import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import {servicesProvided} from './ServicesData';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '../../assets/theme';
import {ScrollView} from 'react-native-virtualized-view';
import Button from '../Common/Button';
import VectorIcon from '../../assets/VectorIcon/VectorIcon';

const CategoryScreen = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelection = category => {
    setSelectedCategory(category);
    console.log('category', selectedCategory);
  };

  const handleContinue = () => {
    if (selectedCategory) {
      navigation.navigate('SubcategoryScreen', {
        subCategories: selectedCategory.subcategories,
      });
    } else {
      Alert.alert('Attention', 'Please select a category!');
    }
  };

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <FlatList
            data={servicesProvided}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => handleCategorySelection(item)}>
                <View
                  style={[
                    styles.section,
                    selectedCategory?.category === item.category &&
                      styles.selectedItem,
                  ]}>
                  {/* <RadioButton
                    value={item.category}
                    color={COLORS.blue}
                    status={
                      selectedCategory?.category === item.category
                        ? 'checked'
                        : 'unchecked'
                    }
                    onPress={() => handleCategorySelection(item)}
                  /> */}
                  <VectorIcon
                    type={item.icon?.type}
                    name={item.icon?.name}
                    size={24}
                    color={'#050087'}
                  />
                  <Text
                    style={{
                      color: COLORS.black,
                      fontSize: 18,
                      marginHorizontal: 10,
                    }}>
                    {item.category}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
      </ScrollView>
      <Button tittle={'continue'} onPress={handleContinue} />
    </>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  section: {
    backgroundColor: COLORS.secondaryButtonColor,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    padding: 10,
    borderWidth: 0.5,
    borderRadius: 8,
  },
  selectedItem: {
    borderColor: '#050087',
    borderWidth: 3,
  },
});
