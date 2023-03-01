import React, { useEffect, useState } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  AsyncStorage,
  ScrollView,
  Image,
  StatusBar,
  FlatList,
  Alert
} from 'react-native'

import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import * as RootNavigation from '../../Navigation/RootNavigation';

export default function CustomHeader(props) {
  const User = props.header
  const check = props.backIcon
  const RightIcon = props.RightIcon
  return (
    <View style={styles.header}>
      {check ?
        <TouchableOpacity
          onPress={() => RootNavigation.goBack()}
          style={{
            alignSelf: 'center',
            position: 'absolute',
            left: responsiveWidth(5),
            zIndex: 1,
          }}>
          <Image
            source={require('../../Assets/arrowback.png')}
            style={{
              height: responsiveWidth(5),
              width: responsiveWidth(6),
              marginTop: responsiveWidth(7),
            }}
          />
        </TouchableOpacity>
        : <View></View>
      }
      <Image
        source={require('../../Assets/Logo.png')}
        style={{
          height: responsiveHeight(4),
          width: responsiveWidth(40),
          resizeMode: 'contain',
          alignSelf: 'center',
          marginTop: responsiveWidth(7),
        }}
      />
       {RightIcon ?
      <TouchableOpacity
        onPress={() => RootNavigation.navigate("ProfileStack")}
        style={{
          alignSelf: 'center',
          position: 'absolute',
          left: responsiveWidth(88),
          zIndex: 1,
        }}>
        {console.log(User)}
        <Image
          source={User ? { uri: User } : require('../../Assets/sneakerlog_profile.png')}
          style={{
            height: responsiveHeight(4),
            width: responsiveHeight(4),
            borderRadius: responsiveWidth(6),
            marginTop: responsiveWidth(7),
          }}
        />
      </TouchableOpacity>
         : <View></View>
        }
    </View >

  )
}

const styles = StyleSheet.create({
  header: {
    width: responsiveWidth(100),
    height: responsiveHeight(12),
    backgroundColor: '#362636',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerimage: {
    height: responsiveHeight(4),
    width: responsiveWidth(40),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: responsiveWidth(7),
  },
})