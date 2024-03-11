import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Button from '../components/Common/Button';
import {FONTS} from '../assets/theme';
import {useSelector} from 'react-redux';

const Dashboard = ({navigation}) => {
  const uid = useSelector(state => state.userId.UserId);
  return (
    <View>
      <Button
        tittle={'scan QR'}
        onPress={() => navigation.navigate('QRScanner')}
      />
      {uid ? <Text style={FONTS.h2}>{uid}</Text> : null}
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({});
