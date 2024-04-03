import React, {useState} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import {COLORS, FONTS} from '../assets/theme';
import {Dimensions} from 'react-native';
import VectorIcon from '../assets/VectorIcon/VectorIcon';
import InputText from '../../src/components/Common/InputText';
import {Line} from 'react-native-svg';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const {width, height} = Dimensions.get('window');

const AddressScreen = ({navigation}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

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
                    inputStyle={styles.input}
                  />
                  <InputText
                    placeholder={`Receiver's contact`}
                    inputStyle={styles.input}
                  />
                  <View style={styles.line}></View>
                  <InputText
                    placeholder={`Flat/ House no./ Building*`}
                    inputStyle={styles.input}
                  />
                  <InputText
                    placeholder={`Area / sector / Locality*`}
                    inputStyle={styles.input}
                  />
                  <InputText
                    placeholder={`Landmark (optional)`}
                    inputStyle={styles.input}
                  />
                </View>
              </ScrollView>
              <View style={styles.footer}>
                <TouchableOpacity style={styles.buttonContainer}>
                  <Text style={styles.buttonText}>Save Address</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
    borderColor: COLORS.gray,
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
});
