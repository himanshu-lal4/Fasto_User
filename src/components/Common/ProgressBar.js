import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {COLORS} from '../../assets/theme';

const ProgressBar = ({progress}) => {
  return (
    <View style={styles.progressBarBackground}>
      <View
        style={[
          styles.progressBarFill,
          {width: `${progress}%`, backgroundColor: COLORS.white},
        ]}
      />
    </View>
  );
};

export default ProgressBar;

const styles = StyleSheet.create({
  progressBarBackground: {
    backgroundColor: COLORS.gray,
    height: 5,
    borderRadius: 10,
    marginTop: 5,
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 10,
  },
});
