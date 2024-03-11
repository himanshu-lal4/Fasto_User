import {useNavigation} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';

const LoadingScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Replace 'SecondScreen' with the name of the screen you want to navigate to
      navigation.navigate('SellerScreen');
    }, 1000);

    // Clear the timeout to prevent navigation if the component unmounts before the timeout
    return () => clearTimeout(timeoutId);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;
