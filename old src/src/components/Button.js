import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,

} from 'react-native';
import { COLORS, FONTS } from '../assets/theme';
import styles from '../assets/theme/style';
const Button = ({ onPress,  tittle }) => {
    return (
        <View style={{
            marginTop: 35,
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <TouchableOpacity
                style={styles.btn}
                onPress={() => { onPress() }}>
                <Text style={[FONTS.body4, { color: COLORS.black,fontWeight:'600' }]}>
                    {tittle}
                </Text>

            </TouchableOpacity>


        </View>
    )
}


export default Button