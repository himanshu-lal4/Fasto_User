import {StyleSheet, Text, View, TextInput} from 'react-native';
import React from 'react';
import {COLORS} from '../../assets/theme';

const InputText = ({
  value,
  placeholder,
  onChangeText,
  secure = false,
  inputStyle,
}) => {
  return (
    <View style={{marginTop: 20}}>
      <View style={styles.labelContainer}>
        <Text style={{color: '#050087'}}>{placeholder}</Text>
      </View>
      <TextInput
        style={[styles.textInput, inputStyle]}
        value={value}
        placeholderTextColor={COLORS.blue}
        onChangeText={onChangeText}
        secureTextEntry={secure}
      />
    </View>
  );
};

export default InputText;

const styles = StyleSheet.create({
  labelContainer: {
    backgroundColor: 'white',
    alignSelf: 'flex-start',
    paddingHorizontal: 3,
    marginStart: 10,
    zIndex: 1,
    elevation: 1,
    shadowColor: 'white',
    position: 'absolute',
    top: -10,
    left: 15,
  },
  textInput: {
    borderColor: '#050087',
    borderWidth: 2,
    color: COLORS.black,
    width: '94%',
    fontSize: 18,
    borderRadius: 10,
    marginHorizontal: '3%',
    height: 60,
    paddingHorizontal: 15,
  },
});
