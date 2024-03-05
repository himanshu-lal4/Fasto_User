import {
  StyleSheet,
  Text,
} from 'react-native';
import React, { useState} from 'react';
import {
  useCameraDevice,
  useCodeScanner,
  Camera,
} from 'react-native-vision-camera';
import {useDispatch} from 'react-redux';
import {SetUID} from '../redux/userIdSlice';

const QRScanner = ({navigation}) => {
  const dispatch = useDispatch();
  const [scanned, setScanned] = useState(false);

  const device = useCameraDevice('back');

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      setScanned(true);
      const codeValue = codes[0].value;
      dispatch(SetUID(codeValue));
      navigation.navigate('SellerScreen');
    },
  });

  if (device == null) return <Text>Camera Failed</Text>;

  return (
    <>
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
    </>
  );
};

export default QRScanner;
