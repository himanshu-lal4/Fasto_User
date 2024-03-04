import {StyleSheet} from 'react-native';
import {COLORS, theme, SIZES, FONTS} from '../theme/theme';
import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    padding: 10,
  },
  customBorder: {borderColor: '#f00', borderWidth: 1},
  containerAuth: {
    // flex: 1, //creating bugs
    // backgroundColor: COLORS.primaryBackgroundColor,
    marginTop: 30,
    marginLeft: SIZES.basemarginleft,
  },
  authContainertext: {
    marginTop: 14,
    ...FONTS.h1,
    color: COLORS.black,
    // marginTop: 30,
    width: '80%',
  },
  btn: {
    elevation: 5,
    height: 45,
    backgroundColor: COLORS.darkBlue,
    borderRadius: 30,
    paddingHorizontal: '10%',
    marginBottom: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
  },
  cardContainer: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  Card1: {
    // borderWidth: 1, // not looking good so i commented it out
    elevation: 10,
    padding: 15,
    marginTop: 20,
    justifyContent: 'center',
    borderRadius: 20,
  },
});
export default styles;
