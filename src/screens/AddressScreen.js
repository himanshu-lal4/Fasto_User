import React, {useState, useEffect} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';
import {Formik} from 'formik';
import {COLORS, FONTS} from '../assets/theme';
import {Dimensions} from 'react-native';
import VectorIcon from '../assets/VectorIcon/VectorIcon';
import InputText from '../../src/components/Common/InputText';
import CustomLine from '../components/Common/customLine';
import {firebase} from '@react-native-firebase/firestore';
import {Swipeable} from 'react-native-gesture-handler';

const {width, height} = Dimensions.get('window');

const AddressScreen = ({navigation, route}) => {
  const {selectedItems} = route.params;
  const {clickedSellerData} = route.params;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const currentUser = firebase.auth().currentUser;

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('addresses')
      .where('userId', '==', currentUser.uid)
      .onSnapshot(snapshot => {
        const addressesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAddresses(addressesData);
      });

    return () => unsubscribe();
  }, []);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  const saveAddressToFirebase = async values => {
    try {
      const db = firebase.firestore();
      const currentUser = firebase.auth().currentUser;
      if (currentUser) {
        await db.collection('addresses').add({
          ...values,
          userId: currentUser.uid,
        });
      } else {
        console.error('No user logged in');
      }
    } catch (error) {
      console.error('Error saving address to Firebase:', error);
    }
  };

  const deleteAddress = async id => {
    try {
      const db = firebase.firestore();
      await db.collection('addresses').doc(id).delete();
    } catch (error) {
      console.error('Error deleting address from Firebase:', error);
    }
  };

  const renderRight = id => {
    return [
      <TouchableOpacity
        style={styles.renderRight}
        onPress={() => deleteAddress(id)}
        key={id}>
        <VectorIcon
          name={'delete'}
          type={'AntDesign'}
          size={22}
          color={COLORS.white}
          onPress={() => navigation.goBack()}
        />
      </TouchableOpacity>,
    ];
  };

  const handleAddressPress = addressId => {
    if (selectedAddress === addressId) {
      setSelectedAddress(null);
    } else {
      setSelectedAddress(addressId);
    }
  };

  const continueButton = (
    <TouchableOpacity
      style={styles.continueButton}
      onPress={() =>
        navigation.navigate('ChatScreen', {
          items: selectedItems,
          clickedSellerData: clickedSellerData,
        })
      }>
      <Text style={styles.continueButtonText}>Continue</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#f5f6fb'} />
      <View style={styles.header}>
        <VectorIcon
          name={'down'}
          type={'AntDesign'}
          size={22}
          color={COLORS.black}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.headerText}>Select a location</Text>
      </View>
      <TouchableOpacity style={styles.addContainer} onPress={toggleModal}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <VectorIcon
            name={'plus'}
            type={'AntDesign'}
            size={20}
            color={COLORS.blue}
          />
          <Text style={styles.addText}>Add address</Text>
        </View>
        <VectorIcon
          name={'right'}
          type={'AntDesign'}
          size={15}
          color={COLORS.blue}
        />
      </TouchableOpacity>
      <CustomLine
        text={'SAVED ADDRESSES'}
        line1Width={'30%'}
        line2Width={'30%'}
      />
      <FlatList
        data={addresses}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Swipeable renderRightActions={() => renderRight(item.id)}>
            <TouchableOpacity
              style={[
                styles.addressItem,
                selectedAddress === item.id && styles.selectedAddressItem,
              ]}
              onPress={() => handleAddressPress(item.id)}>
              <View>
                <Text style={styles.deliverText}>DELIVERS TO</Text>
              </View>
              <View style={styles.addressIcon}>
                <VectorIcon
                  name={'home'}
                  type={'Octicons'}
                  size={24}
                  color={COLORS.black}
                  style={styles.homeIcon}
                />
                <View style={styles.address}>
                  <Text style={styles.homeText}>Home</Text>
                  <Text style={styles.address2}>{item.flatHouseBuilding},</Text>
                  <Text style={styles.address2}>
                    {item.areaSectorLocality},
                  </Text>
                  <Text style={styles.address2}>{item.landmark}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </Swipeable>
        )}
      />
      {selectedAddress && continueButton}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(false);
        }}>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={'rgba(0, 0, 0, 0.5)'}
        />
        <KeyboardAvoidingView style={{flex: 1}}>
          <Formik
            initialValues={{
              flatHouseBuilding: '',
              areaSectorLocality: '',
              landmark: '',
            }}
            onSubmit={(values, {resetForm}) => {
              saveAddressToFirebase(values);
              resetForm();
              toggleModal();
            }}>
            {({handleChange, handleBlur, handleSubmit, values}) => (
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalText}>Enter address details</Text>
                    <VectorIcon
                      name={'close'}
                      type={'AntDesign'}
                      size={20}
                      color={COLORS.gray}
                      onPress={toggleModal}
                    />
                  </View>
                  <ScrollView>
                    <View style={styles.inputContainer}>
                      <InputText
                        placeholder={`Receiver's name`}
                        color={'grey'}
                        inputStyle={styles.input}
                      />
                      <InputText
                        placeholder={`Receiver's contact`}
                        color={'grey'}
                        inputStyle={styles.input}
                      />
                      <View style={styles.line}></View>
                      <InputText
                        placeholder={`Flat/ House no./ Building*`}
                        color={'grey'}
                        inputStyle={styles.input}
                        onChangeText={handleChange('flatHouseBuilding')}
                        onBlur={handleBlur('flatHouseBuilding')}
                        value={values.flatHouseBuilding}
                      />
                      <InputText
                        placeholder={`Area / sector / Locality*`}
                        color={'grey'}
                        inputStyle={styles.input}
                        onChangeText={handleChange('areaSectorLocality')}
                        onBlur={handleBlur('areaSectorLocality')}
                        value={values.areaSectorLocality}
                      />
                      <InputText
                        placeholder={`Landmark (optional)`}
                        color={'grey'}
                        inputStyle={styles.input}
                        onChangeText={handleChange('landmark')}
                        onBlur={handleBlur('landmark')}
                        value={values.landmark}
                      />
                    </View>
                  </ScrollView>
                  <View style={styles.footer}>
                    <TouchableOpacity
                      style={styles.buttonContainer}
                      onPress={handleSubmit}>
                      <Text style={styles.buttonText}>Save Address</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </Formik>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default AddressScreen;

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
    backgroundColor: '#f5f6fb',
    padding: '5%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    ...FONTS.h2,
    color: COLORS.black,
    marginLeft: '5%',
  },
  addressesLine: {
    borderColor: COLORS.gray,
  },
  addContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    marginVertical: '5%',
    paddingVertical: '2%',
    paddingHorizontal: '5%',
    borderRadius: 5,
  },
  addText: {
    ...FONTS.h4,
    color: COLORS.blue,
    marginLeft: '10%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#f5f6fb',
    height: '80%',
    width: width,
    padding: '5%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '5%',
  },
  modalText: {
    fontSize: 22,
    color: COLORS.black,
    fontWeight: '700',
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    marginTop: '5%',
    paddingBottom: '5%',
    borderRadius: 10,
  },
  input: {
    borderColor: '#d9d8dc',
  },
  line: {
    borderTopWidth: 2,
    borderStyle: 'dotted',
    borderColor: COLORS.lightGray,
    marginTop: '5%',
    marginHorizontal: '5%',
  },
  footer: {
    height: '12%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    width: '95%',
    height: '80%',
    backgroundColor: COLORS.blue,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 20,
  },
  addressItem: {
    backgroundColor: COLORS.white,
    padding: '3%',
    borderRadius: 18,
    marginBottom: '5%',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  selectedAddressItem: {
    borderColor: 'blue',
  },
  deliverText: {
    color: '#316bbb',
  },
  addressIcon: {
    flexDirection: 'row',
    marginHorizontal: '5%',
    marginVertical: '3%',
  },
  homeIcon: {
    paddingTop: '2%',
  },
  homeText: {
    color: COLORS.black,
    fontSize: 18,
    fontWeight: '700',
  },
  address: {
    marginLeft: '10%',
    justifyContent: 'flex-start',
  },
  address2: {
    fontSize: 16,
    color: COLORS.gray,
  },
  renderRight: {
    backgroundColor: '#f04f5f',
    height: '90%',
    width: '20%',
    marginLeft: '2%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  continueButton: {
    backgroundColor: COLORS.blue,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  continueButtonText: {
    color: COLORS.white,
    fontSize: 18,
  },
});
