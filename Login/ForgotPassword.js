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
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {KeyboardAvoidingView} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {connectFirebase, getData} from '../Backend/utility';
import HTMLView from 'react-native-htmlview';
import validator from 'validator';
import auth from '@react-native-firebase/auth';
import * as Animatable from 'react-native-animatable';

export default class ForgotPassword extends Component {
  state = {
    email: '',
    password: '',
    visible: false,
    visible1: false,
    showPass: true,
    showAlert: false,
    showAlert2: false,
    emailError: false,
    correctEmail: false,
    ErrorMessege: '',
    loader: false,
    email: '',
    borderColor2: '#362636',
    PrivacyPolicy: '',
    Terms: '',
  };
  componentDidMount = async () => {
    let email = this.props.route.params.email;
    console.log('ye i email', email);
    await connectFirebase();
    let TermsandCondation = [];
    let Privacy = await getData('Policy', '123');
    let Terms = await getData('Terms', '1');
    this.setState({
      PrivacyPolicy: Privacy.privacyPolicy,
      Terms: Terms.termsOfService,
    });
    setTimeout(() => {
      this.setState({isLoading: false});
    }, 2000);
  };

  emailFocusHandler = () => {
    this.setState({errorEmail: ''});
    this.setState({
      borderColor2: '#589BE9',
    });
  };

  onFocus1() {
    this.setState({
      borderColor2: '#589BE9',
    });
  }

  email = () => {
    //EmailCheck
    let reg3 = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg3.test(this.state.email) === false) {
      console.log('Email is Not Correct');
      this.state.email !== undefined && this.state.email !== ''
        ? this.setState({
            ErrorMessege: 'Please enter a valid Email',
            emailError: true,
          })
        : this.setState({
            ErrorMessege: 'Email cannot be empty',
            emailError: true,
          });
      // this.setState({ email: text }){
    } else {
      this.setState({correctEmail: true});
    }
  };

  forgotPassword = () => {
    console.log('prresed');
    auth()
      .sendPasswordResetEmail(this.state.email)
      .then((user) => {
        this.setState({showAlert: true});
        setTimeout(() => {
          this.setState({showAlert: false});
          this.props.navigation.navigate('Login');
        }, 6000);
        console.log('success');
        // auth().signInWithEmailLink(email)
        // alert('Please check your email...')
      })
      .catch((e) => {
        this.setState({showAlert2: true});
        setTimeout(() => {
          this.setState({showAlert2: false});
        }, 6000);
        console.log('error', e);
      });
  };
  // forgotPassword = () => {
  //   console.log('prresed');
  //   auth().confirmPasswordReset("Ahmad1234@")
  //     .then((user) => {
  //       this.setState({ showAlert: true })
  //       console.log('success')
  //       // auth().signInWithEmailLink(email)
  //       // alert('Please check your email...')
  //     }).catch(e => {
  //       this.setState({ showAlert2: true })
  //       console.log('error', e)
  //     })
  // }
  render() {
    const {email} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent></StatusBar>
        <ScrollView>
          <View style={styles.main}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Login')}
              style={styles.back}>
              <Ionicons
                name={'md-arrow-back'}
                size={responsiveWidth(8)}
                color={'#fff'}
              />
            </TouchableOpacity>
            <View style={styles.logo1}>
              <Image
                source={require('../../Assets/Logo.png')}
                style={styles.logoMain}
              />
            </View>
          </View>
          {/* Custom Alert */}
          {this.state.showAlert2 ? (
            <Animatable.View
              animation={'fadeInDownBig'}
              style={{
                top: responsiveHeight(5.5),
                elevation: 2,
                zIndex: 1,
                position: 'absolute',
                flexDirection: 'row',
                width: '95%',
                borderRadius: 8,
                borderLeftWidth: 5,
                borderLeftColor: '#D9173B',
                height: responsiveHeight(12),
                backgroundColor: 'white',
                alignSelf: 'center',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <Ionicons
                name={'ios-close-circle'}
                size={responsiveWidth(15)}
                color={'#D9173B'}
              />
              <View style={{width: responsiveWidth(62)}}>
                <Text
                  style={{
                    color: 'gray',
                    fontSize: 12,
                    fontFamily: 'Lato-Black',
                  }}
                  ellipsizeMode={'tail'}
                  numberOfLines={1}>
                  EMAIL DOES NOT EXIST.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => this.setState({showAlert2: false})}>
                <AntDesign name={'close'} color={'gray'} size={20} />
              </TouchableOpacity>
            </Animatable.View>
          ) : null}
          {/* Custom Alert */}
          {this.state.showAlert ? (
            <Animatable.View
              animation={'fadeInDownBig'}
              style={{
                top: responsiveHeight(5.5),
                elevation: 2,
                zIndex: 1,
                position: 'absolute',
                flexDirection: 'row',
                width: '95%',
                borderRadius: 8,
                borderLeftWidth: 5,
                borderLeftColor: '#55dd91',
                height: responsiveHeight(12),
                backgroundColor: 'white',
                alignSelf: 'center',
                justifyContent: 'space-evenly',
                alignItems: 'center',
              }}>
              <Image
                style={{
                  marginLeft: responsiveWidth(0),
                  height: responsiveWidth(13),
                  width: responsiveWidth(13),
                  marginBottom: 2,
                }}
                source={require('../../Assets/CheckSuccessOutline.png')}
              />
              <View style={{width: responsiveWidth(62)}}>
                <Text
                  style={{
                    color: 'gray',
                    fontSize: 12,
                    fontFamily: 'Lato-Black',
                  }}
                  ellipsizeMode={'tail'}
                  numberOfLines={1}>
                  PLEASE CHECK YOUR EMAIL. RESET PASSWORD REQUEST SENT.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Login');
                  this.setState({showAlert: false});
                }}>
                <AntDesign name={'close'} color={'gray'} size={20} />
              </TouchableOpacity>
            </Animatable.View>
          ) : null}

          <View style={styles.emailT}>
            <Text style={[styles.emailT2, {left: 3}]}>
              Enter the Email address used to{'\n'}create account
            </Text>
          </View>
          <View style={{alignSelf: 'center', marginTop: responsiveHeight(3)}}>
            <Text
              style={[
                {left: 2, color: '#fff', fontSize: responsiveFontSize(2)},
              ]}>
              Email
            </Text>
            <View
              style={{
                overflow: 'hidden',
                flexDirection: 'row',
                height: responsiveHeight(6.7),
                width: responsiveWidth(80),
                borderColor: this.state.ErrorMessege
                  ? '#D9173B'
                  : this.state.borderColor2,
                borderWidth: 3,
                marginTop: responsiveHeight(1),
                borderRadius: 10,
                color: '#757575',
              }}>
              <TextInput
                paddingLeft={12}
                style={{
                  height: responsiveHeight(6),
                  width: responsiveWidth(68.6),
                  backgroundColor: '#fff',
                  borderTopLeftRadius: 7,
                  borderBottomLeftRadius: 7,
                  color: '#757575',
                }}
                type="email"
                // onBlur={() => this.onBlur2()}
                value={email}
                onSubmitEditing={() => this.email()}
                onChangeText={(email) => {
                  this.setState({email, ErrorMessege: ''});
                }}
                keyboardType="email-address"
                onFocus={() => this.onFocus1()}
              />
              <View
                style={{
                  backgroundColor: '#fff',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: responsiveWidth(10),
                  borderBottomRightRadius: 7,
                  borderTopRightRadius: 7,
                  height: responsiveHeight(6),
                }}>
                {this.state.emailError ? (
                  <Entypo
                    name={'circle-with-cross'}
                    size={responsiveWidth(4.5)}
                    color={'#D9173B'}
                  />
                ) : null}
                {this.state.correctEmail ? (
                  <AntDesign
                    name={'checkcircle'}
                    size={responsiveWidth(4.5)}
                    color={'#7AD693'}
                  />
                ) : null}
              </View>
            </View>
            {this.state.ErrorMessege ? (
              <Text
                style={{
                  fontSize: responsiveFontSize(1.4),
                  fontFamily: 'Lato-Bold',
                  color: '#D9173B',
                }}>
                {this.state.ErrorMessege}
              </Text>
            ) : null}
          </View>
          <View style={styles.btn1}>
            <TouchableOpacity
              style={[
                styles.btn2,
                {
                  backgroundColor:
                    this.state.correctEmail == true && this.state.email != ''
                      ? '#D9173B'
                      : 'rgba(217, 23, 59,0.4)',
                },
              ]}
              disabled={
                this.state.correctEmail == true && this.state.email != ''
                  ? false
                  : true
              }
              onPress={() => {
                this.forgotPassword();
              }}>
              <Text style={styles.btntxt}>Update Password</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#362636',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  main: {
    top: responsiveHeight(5),
    height: responsiveHeight(10),
    flexDirection: 'row',
    marginLeft: responsiveWidth(4),
  },
  back: {top: 13, position: 'absolute'},
  logo1: {width: '100%', left: -5},
  logoMain: {
    width: '60%',
    height: '80%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  emailT: {
    width: responsiveWidth(80),
    alignSelf: 'center',
    marginTop: responsiveHeight(13),
  },
  emailT2: {
    color: '#fff',
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Lato-Regular',
  },
  emailLbl: {alignSelf: 'center', marginTop: responsiveHeight(3.5)},
  emailLbl2: {
    color: '#fff',
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Lato-Regular',
  },
  Txtinp: {
    height: responsiveHeight(6.5),
    width: responsiveWidth(77),
    marginTop: responsiveHeight(1.3),
    backgroundColor: '#fff',
    borderRadius: 10,
    color: '#757575',
  },
  pass1: {alignSelf: 'center', marginTop: responsiveHeight(5)},
  passlbl: {
    color: '#fff',
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Lato-Regular',
  },
  View2: {
    flexDirection: 'row',
    height: responsiveHeight(6.5),
    width: responsiveWidth(77),
    marginTop: responsiveHeight(1),
    borderRadius: 10,
    color: '#757575',
  },
  passinp: {
    right: 0.5,
    paddingLeft: 15,
    height: responsiveHeight(6),
    width: responsiveWidth(68.5),
    backgroundColor: '#fff',
    borderBottomLeftRadius: 10,
    borderTopLeftRadius: 10,
    color: '#757575',
  },
  eyebtn: {
    right: 0.5,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    width: responsiveWidth(8.2),
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    height: responsiveHeight(6),
  },
  btn1: {marginTop: responsiveHeight(14), alignSelf: 'center'},
  btn2: {
    height: responsiveHeight(7),
    alignItems: 'center',
    justifyContent: 'center',

    width: responsiveWidth(78),
    borderRadius: 25,
  },
  btntxt: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Lato-Regular',
    color: '#fff',
  },
  Terms: {
    alignItems: 'center',
    marginBottom: responsiveWidth(5),
    justifyContent: 'center',
  },
  ttxt: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Lato-Regular',
  },
  Tos: {
    color: '#D9173B',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Lato-Regular',
  },
  andt: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Lato-Regular',
  },
  PrvPoli: {
    color: '#D9173B',
    fontSize: responsiveFontSize(2),
    fontFamily: 'Lato-Regular',
  },
});
