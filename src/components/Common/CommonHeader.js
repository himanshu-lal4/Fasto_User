import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {COLORS, FONTS} from '../../assets/theme';
import styles from '../../assets/theme/style';
import VectorIcon from '../../utils/VectorIcon';
import {firebase} from '@react-native-firebase/auth';

const CommonHeader = ({title}) => {
  const navigation = useNavigation();

  const handleLogoutPress = () => {
    firebase.auth().signOut();
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.white,
      }}>
      <View>
        <Text
          style={[
            FONTS.h1,
            {margin: 8, fontWeight: '600', color: COLORS.darkBlue},
          ]}>
          {title}
        </Text>
      </View>
      <View style={{paddingBottom: 10}}>
        <TouchableOpacity onPress={handleLogoutPress}>
          <VectorIcon
            name={'logout'}
            type={'MaterialCommunityIcons'}
            size={30}
            color={COLORS.darkBlue}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommonHeader;
