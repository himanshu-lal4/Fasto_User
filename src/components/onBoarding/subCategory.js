import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {COLORS} from '../../assets/theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ScrollView} from 'react-native-virtualized-view';
import {useNavigation} from '@react-navigation/native';
import Button from '../Common/Button';
import AuthHeader from '../Common/AuthHeader';

const SubcategoryScreen = ({route}) => {
  const {subCategories} = route.params;
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const navigation = useNavigation();

  // Function to handle subcategory selection
  const toggleSubcategory = subcategory => {
    if (selectedSubcategories.includes(subcategory)) {
      setSelectedSubcategories(
        selectedSubcategories.filter(item => item !== subcategory),
      );
    } else {
      setSelectedSubcategories([...selectedSubcategories, subcategory]);
    }
  };

  // Function to save the selected subcategories
  const saveSelection = () => {
    if (selectedSubcategories.length === 0) {
      Alert.alert('Attention', 'Please select at least one subcategory.');
    } else {
      navigation.navigate('ChooseImgScreen');
      console.log('Selected Subcategories:', selectedSubcategories);
      // Do whatever you need with the selected subcategories here
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AuthHeader
        tittle={'SELECT A CATEGORY'}
        onPress={() => navigation.goBack()}
      />
      <View style={styles.subcategoriesContainer}>
        <ScrollView>
          <View style={styles.subcategoryItems}>
            <FlatList
              data={subCategories}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => toggleSubcategory(item)}>
                  <View
                    style={[
                      styles.section,
                      selectedSubcategories.includes(item) &&
                        styles.selectedItem,
                    ]}>
                    <Text
                      style={{
                        color: COLORS.darkBlue,
                        fontSize: 14,
                        textAlign: 'center',
                        paddingHorizontal: 8,
                        fontWeight: 'bold',
                      }}>
                      {item}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={(item, index) => index.toString()}
              numColumns={2}
            />
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          alignItems: 'center',
        }}>
        <Button tittle={'continue'} onPress={saveSelection} />
      </View>
    </SafeAreaView>
  );
};

export default SubcategoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
    padding: 10,
    backgroundColor: COLORS.secondaryButtonColor,
    borderRadius: 50,
  },
  subcategoryItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    margin: 10,
  },
  subcategoriesContainer: {
    marginTop: 25,
    flexDirection: 'column',
  },
  selectedItem: {
    borderColor: COLORS.darkBlue,
    borderWidth: 2,
  },
});
