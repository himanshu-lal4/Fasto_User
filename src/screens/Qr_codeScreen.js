import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';
import React, {useEffect, useRef, useState} from 'react';
// import VectorIcon from '../../utils/VectorIcon';
import VectorIcon from '../assets/VectorIcon/VectorIcon';
import {useSelector} from 'react-redux';

const Qr_codeScreen = () => {
  const userToken = useSelector(state => state.userToken.UID);
  console.log('🚀 ~ userToken:', userToken);

  const [text, setText] = useState('');
  const [QRImage, setQRImage] = useState('');
  const ref = useRef();
  useEffect(() => {
    setText(userToken);
  }, [userToken]);
  const saveQR = () => {
    try {
      ref.current.toDataURL(async data => {
        const path =
          RNFetchBlob.fs.dirs.DownloadDir + `/${text.slice(0, 30)}.png`;
        console.log(path);
        await RNFetchBlob.fs.writeFile(path, data, 'base64');
        alert('download successfully');
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleShare = async () => {
    const options = {
      title: 'Share is your QRcode',
      url: QRImage,
    };
    try {
      await Share.open(options);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View style={{marginTop: 20}}>
      <View style={styles.section}>
        <TouchableOpacity onPress={() => saveQR()}>
          <VectorIcon name="download" type="feather" color="black" size={50} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleShare()}>
          <VectorIcon name="share" type="feather" color="black" size={50} />
        </TouchableOpacity>
      </View>

      <View style={{alignSelf: 'center', marginTop: '40%'}}>
        <QRCode value={text ? text : 'NA'} size={300} getRef={ref} />
      </View>
    </View>
  );
};

export default Qr_codeScreen;

const styles = StyleSheet.create({
  btn: {
    width: '45%',
    paddingLeft: 60,
    paddingVertical: 15,
    borderRadius: 30,
    borderWidth: 1,
    alignSelf: 'center',
    backgroundColor: 'purple',
    color: 'white',
    marginBottom: 20,
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
});
