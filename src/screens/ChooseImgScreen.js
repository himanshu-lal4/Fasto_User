import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import AuthHeader from '../components/Common/AuthHeader';
import Button from '../components/Common/Button';
import {COLORS, FONTS} from '../assets/theme';
import SelectImage from '../components/SelectImg';

const ChooseImgScreen = ({navigation}) => {
  const [selectOption, setSelectOption] = useState(false);
  const handleSelectOption = value => {
    setSelectOption(value);
  };
  const handlePic = () => {
    setSelectOption(true);
  };
  return (
    <View>
      <AuthHeader
        tittle={`Let's set up the store.`}
        onPress={() => navigation.goBack()}
      />
      <Text style={[FONTS.body3, {margin: 10, color: COLORS.black}]}>
        Choose a few pictures of your store!
      </Text>
      <View style={{alignItems: 'center'}}>
        <Button tittle={'select pic'} onPress={handlePic} />
      </View>

      {selectOption ? (
        <SelectImage handleSelectOption={handleSelectOption} />
      ) : null}
    </View>
  );
};

export default ChooseImgScreen;

const styles = StyleSheet.create({});
