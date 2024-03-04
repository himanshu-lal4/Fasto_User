
import {StyleSheet} from 'react-native';
import { COLORS, theme, SIZES, FONTS } from '../theme/theme';

const styles = StyleSheet.create({
 
    input: {
        height: 40,
        margin: 12,
        padding: 10,
      },
    customBorder:{borderColor:'#f00',borderWidth:1}, 
    containerAuth:{flex:1,backgroundColor:COLORS.primaryBackgroundColor ,marginTop:30,marginLeft:SIZES.basemarginleft},
    authContainertext:{marginTop:14,...FONTS.body1 ,color:COLORS.white1 ,fontWeight:'700',marginTop:30,width:'80%'},
    Card1: {  borderWidth: 1, height: 75, width: '119%',borderRadius: 5,borderColor: "rgb(31,48,62)", marginLeft: SIZES.basemarginleft, marginTop: 20,justifyContent:'center',paddingLeft:15},
    btn: {
      height: 45,
      backgroundColor: COLORS.buttoncolor,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
      width: '90%'
  }

    
});
export default styles; 