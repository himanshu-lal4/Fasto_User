import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  useCameraPermission,
  useCameraDevice,
  useCodeScanner,
  Camera,
} from 'react-native-vision-camera';
import {useDispatch} from 'react-redux';
import {SetUID} from '../redux/userIdSlice';

const QRScanner = ({navigation}) => {
  const dispatch = useDispatch();
  const {hasPermission, requestPermission} = useCameraPermission();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    requestPermission();
  }, []);

  const device = useCameraDevice('back');

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      setScanned(true);
      const codeValue = codes[0].value;
      dispatch(SetUID(codeValue));
      navigation.navigate('Dashboard');
    },
  });

  if (device == null) return <Text>Camera Failed</Text>;

  return (
    <>
      {hasPermission ? (
        <>
          {scanned ? null : (
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={true}
              codeScanner={codeScanner}
            />
          )}
        </>
      ) : (
        <ActivityIndicator size={'large'} />
      )}
    </>
  );
};

export default QRScanner;
