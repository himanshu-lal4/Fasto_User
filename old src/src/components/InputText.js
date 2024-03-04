import {StyleSheet, Text, View, TextInput} from 'react-native';
import React from 'react';

const InputText = ({
  value,
  placeholder,
  onChangeText,
  secure = false,
  inputStyle,
}) => {
  return (
    <TextInput
      style={[styles.textInput, inputStyle]}
      value={value}
      placeholder={placeholder}
      placeholderTextColor={'grey'}
      onChangeText={onChangeText}
      secureTextEntry={secure}
    />
  );
};

export default InputText;

const styles = StyleSheet.create({
  textInput: {
    borderColor: 'grey',
    borderWidth: 1,
    color: 'grey',
    width: '94%',
    marginHorizontal: 'auto',
    fontSize: 18,
    borderRadius: 10,
    marginHorizontal: '3%',
    height: 50,
    paddingHorizontal: 15,
    marginTop: 25,
  },
});
