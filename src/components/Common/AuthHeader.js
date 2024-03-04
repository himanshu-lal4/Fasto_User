import {View, Text} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {COLORS} from '../../assets/theme';
import styles from '../../assets/theme/style';
import VectorIcon from '../../utils/VectorIcon';

const AuthHeader = ({tittle, onPress}) => {
  const navigation = useNavigation();
  return (
    <View style={styles.containerAuth}>
      <VectorIcon
        name="arrow-back"
        type="Ionicons"
        size={24}
        color={COLORS.black}
        onPress={onPress}
      />
      <Text style={styles.authContainertext}>{tittle}</Text>
    </View>
  );
};

export default AuthHeader;
