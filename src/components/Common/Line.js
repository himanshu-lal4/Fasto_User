import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {COLORS, FONTS, SIZES, theme} from '../../assets/theme';

const Line = ({line1Width, line2Width, text, customStyle}) => {
  return (
    <View style={[styles.container, customStyle]}>
      <View
        style={{
          ...styles.line1,
          width: line1Width ? line1Width : '45%',
        }}
      />
      <Text style={styles.text}>{text}</Text>
      <View
        style={{
          ...styles.line2,
          width: line2Width ? line2Width : '45%',
        }}
      />
    </View>
  );
};

export default Line;

const styles = StyleSheet.create({
  container: {
    marginTop: '10%',
    marginBottom: '5%',
    flexDirection: 'row',
    marginHorizontal: SIZES.basemarginleft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {marginHorizontal: 10, color: COLORS.darkBlue},
  line1: {
    height: 1,
    backgroundColor: COLORS.darkBlue,
  },
  line2: {
    height: 1,
    backgroundColor: COLORS.darkBlue,
  },
});
