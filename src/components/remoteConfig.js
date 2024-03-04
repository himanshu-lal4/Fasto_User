import React, {useEffect, useState} from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import {firebase} from '@react-native-firebase/remote-config';

const featureFlag = () => {
  const [isAppleLoginEnabled, setIsAppleLoginEnabled] = useState(false);
  const fetchRemoteConfig = async () => {
    await remoteConfig().setConfigSettings({
      minimumFetchIntervalMillis: 30000,
    });
    await firebase.remoteConfig().fetchAndActivate();
    const appleLoginConfig = firebase
      .remoteConfig()
      .getValue('appleLogin')
      .asBoolean();
    console.log('appleLoginConfig:', appleLoginConfig);
    setIsAppleLoginEnabled(appleLoginConfig);
  };
  console.log(isAppleLoginEnabled);
  useEffect(() => {
    fetchRemoteConfig();
  }, []);
  return isAppleLoginEnabled;
};
export default featureFlag;
