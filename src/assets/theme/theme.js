import {Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

export const COLORS = {
  // base colors

  primaryBackgroundColor: 'white', // Blue
  secondaryBackground: '#e6dff1', // gray
  buttoncolor: 'white', //#0a57fd
  secondaryButtonColor: '#e6dff1',
  // colors
  black: '#1E1F20',
  white: '#FFFFFF',
  white1: '#e6e6e6',
  lightGray: '#eff2f5',
  gray: '#888',
  blue: '#0a57fd',
  darkBlue: '#050087',
  red: '#ee1c24',
};

export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,

  // font sizes
  largeTitle: 50,
  h1: 34,
  h2: 22,
  h3: 16,
  h4: 14,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,

  // app dimensions
  width,
  height,

  basemarginleft: 10,
  basemarginRight: 14,
};
export const FONTS = {
  largeTitle: {
    fontFamily: 'Nunito-Black',
    fontWeight: 'bold',
    fontSize: SIZES.largeTitle,
    lineHeight: 55,
  },
  h1: {fontFamily: 'Nunito-Bold', fontSize: SIZES.h1, lineHeight: 36},
  h2: {fontFamily: 'Nunito-Bold', fontSize: SIZES.h2, lineHeight: 30},
  h3: {fontFamily: 'Nunito-Bold', fontSize: SIZES.h3, lineHeight: 22},
  h4: {fontFamily: 'Nunito-Bold', fontSize: SIZES.h4, lineHeight: 22},

  body1: {
    fontFamily: 'Nunito-Regular',
    fontSize: SIZES.body1,
    lineHeight: 36,
  },
  body2: {fontFamily: 'Nunito-Regular', fontSize: SIZES.body2, lineHeight: 30},
  body3: {fontFamily: 'Nunito-Regular', fontSize: SIZES.body3, lineHeight: 22},
  body4: {fontFamily: 'Nunito-Regular', fontSize: SIZES.body4, lineHeight: 22},
};

const appTheme = {COLORS, SIZES, FONTS};

export default appTheme;
