import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  FlatList,
} from 'react-native';
import Modal, {
  ModalContent,
  ModalTitle,
  ModalButton,
} from 'react-native-modals';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {Icon} from 'react-native-elements';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {KeyboardAvoidingView} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Button, Switch} from 'react-native-paper';
import {RNCamera, FaceDetector} from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
export default class ScanBarcode extends Component {
  state = {
    torchOn: false,
    barcodes: [],
    userProfilePic:''

  };
  componentDidMount() {
    // console.log(this.props.navigation)
    this.get();
  }
  get() {
    setTimeout(() => {
      //   this.props.navigation.navigate('ScanFlowChooseCollection');
    }, 5000);
  }
  handleTourch() {
    this.setState({torchOn: !this.state.torchOn});
  }
  barcodeRecognized = (e) => {
    console.log('Barcode value is', e);
    this.props.navigation.navigate('ScanFlowChooseCollection');
    // setTimeout(() => {
    //     this.scanner.reactivate()
    //     //   this.props.navigation.navigate('ScanFlowChooseCollection');
    //   }, 500);
  };
  _topContent() {
    return <View style={{height: 0}}></View>;
  }
  _bottomContent() {
    return <View style={{height: 0}}></View>;
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent></StatusBar>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => this.props.navigation.goBack()}
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
            {!this.state.isLoading ? (
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('ProfileStack')}
            style={{
              alignSelf: 'center',
              position: 'absolute',
              left: responsiveWidth(88),
              zIndex: 1,
            }}>
            <Image
               source={
                this.state.userProfilePic && this.state.userProfilePic != ''
                  ? {uri: this.state.userProfilePic} 
                  : this.state.UserInfo.profileImage !== undefined ? 
                  {uri: this.state.UserInfo.profileImage} :
                  require('../../Assets/sneakerlog_profile.png')
              }
              style={{
                height: responsiveHeight(4),
                width: responsiveHeight(4),
                borderRadius: responsiveWidth(6),
                marginTop: responsiveWidth(7),
              }}
            />
          </TouchableOpacity>
            ):(<View></View>)}
        </View>
        <Image
          source={require('../../Assets/scan.png')}
          style={styles.headerimage1}
        />

        <QRCodeScanner
          ref={(node) => {
            this.scanner = node;
          }}
          onRead={this.barcodeRecognized}
          flashMode={
            this.state.torchOn
              ? RNCamera.Constants.FlashMode.torch
              : RNCamera.Constants.FlashMode.off
          }

          // bottomContent={
          //   // <TouchableOpacity style={styles.buttonTouchable}>
          //   //   <Text style={styles.buttonText}>OK. Got it!</Text>
          //   // </TouchableOpacity>
          // }
        //   bottomContent={
        //     <Icon name="close" size={5} color={"white"} onPress={() => { this.scanner.reactivate();}} />
        //   }
          //  showMarker={true}
          //  markerStyle={{ borderRadius: 5, borderColor: Colors.appte }}
          //fadeIn={true}
          cameraStyle={{height: responsiveHeight(100)}}
          topViewStyle={styles.zeroContainer}
          bottomViewStyle={styles.zeroContainer}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  },
  header: {
    width: responsiveWidth(100),
    position: 'absolute',
    zIndex: 1,
    backgroundColor: 'transparent',
    height: responsiveHeight(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerimage: {
    height: responsiveHeight(4),
    width: responsiveWidth(40),
    resizeMode: 'contain',
    // alignSelf: 'center',
    marginLeft: responsiveWidth(20),
    marginTop: responsiveWidth(7),
  },
  headerimage1: {
    height: responsiveHeight(30),
    width: responsiveHeight(30),
    resizeMode: 'contain',
    // alignSelf: 'center',
    alignSelf: 'center',
    position: 'absolute',
    top: responsiveHeight(35),
    zIndex: 1,
  },
  profileimage: {
    height: responsiveHeight(4),
    width: responsiveHeight(4),
    borderRadius: responsiveWidth(6),
    marginLeft: responsiveWidth(20),
    marginTop: responsiveWidth(7),
    alignSelf: 'center',
  },
  zeroContainer: {
    height: 0,
    flex: 0,
  },

  cameraContainer: {},
});
