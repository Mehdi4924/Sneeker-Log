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
import axios from 'axios';
import * as RootNavigation from '../../Navigation/RootNavigation';

const data = {
    to: 'dWtbW85NRf6RZXnT6TPJOc:APA91bF52wOooZMUdQfH-PHz-LrL7Kme2bAp0mcVGr4wzp9ZfHPV7BmWqzaicuIw-ScBgHlwpy7LFI0Oo54lE_xvXGSkIcE712yRXV-HlDsRtqp5mQsXG6BkKeptRaaHC57pTeJPASId',
    collapse_key: 'type_a',
    notification: {
      android: {
        imageUrl:
          'https://images.unsplash.com/photo-1603787081207-362bcef7c144?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c25lYWtlcnxlbnwwfHwwfHw%3D&w=1000&q=80',
      },
      body: 'Ahmad ',
      title: 'Recive The Notificaiton',
    },
  };
  
  let config = {
    headers: {
      'Content-Type': 'application/json',
      Authorization:
        'key=AAAAmTLFeks:APA91bEG7niQAoO9Z8RNu1usJNBxyNBbd_naqZWMaGQ34qWsZP8MiK76tj6st17JXcxT29thIzrFQMyRCshpBoOMhzacSfCNH_mVgWeqpHbnPjxPR6jIcVtujYj0WgtJj4axJb57VwkI',
    },
  };
  export const Api = {
    sendNotification: d =>
      axios.post('https://fcm.googleapis.com/fcm/send', data, config),
  };
