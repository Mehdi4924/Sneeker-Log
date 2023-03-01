import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
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
import validator from 'validator';
import {signUp} from '../Backend/auth';
import {connectFirebase, getData, getAllOfCollection} from '../Backend/utility';
import HTMLView from 'react-native-htmlview';
import TextInputMask from 'react-native-text-input-mask';
import GlobalConst from '../Login/GlobalConst';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
export default class Login extends Component {
  state = {
    visible: false,
    visible1: false,
    showPass: true,
    name: '',
    number: '',
    email: '',
    password: '',
    username: '',
    phone: '',
    emailError: false,
    correctEmail: false,
    passwordError: false,
    correctpassword: false,
    usernameError: false,
    correctUsername: false,
    numberError: false,
    correctNumber: false,
    correctname: false,
    nameError: false,
    errorPassword:
      'At least 8 characters,1 uppercase letter,1 number, 1 symbol',
    errorEmail: 'Email Should be correctly formated',
    borderColor1: '#362636',
    borderColor2: '#362636',
    borderColor3: '#362636',
    borderColor4: '#362636',
    borderColor5: '#362636',
    PrivacyPolicy: '',
    Terms: '',
    isChecked: false,
  };
  componentDidMount = async () => {
    await connectFirebase();
    let Privacy = await getData('Policy', '123');
    let Terms = await getData('Terms', '1');
    let isFBData = GlobalConst.SignData;
    if (isFBData !== null) {
      this.setState({
        email: isFBData.email,
        password: isFBData.password,
        name: isFBData.fname + ' ' + isFBData.lname,
        PrivacyPolicy: Privacy.privacyPolicy,
        Terms: Terms.termsOfService,
      });
      GlobalConst.SignData = null;
    } else {
      this.setState({
        PrivacyPolicy: Privacy.privacyPolicy,
        Terms: Terms.termsOfService,
      });
    }
  };
  componentWillUnmount() {
    this.setState({email: ''});
  }
  emailCheck = () => {
    //EmailCheck
    let reg3 = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg3.test(this.state.email) === false) {
      console.log('Email is Not Correct');
      this.state.email !== undefined && this.state.email !== ''
        ? this.setState({
            ErrorMessege: 'Please enter a valid Email',
            emailError: true,
            correctEmail: false,
          })
        : this.setState({
            ErrorMessege: 'Email cannot be empty',
            emailError: true,
            correctEmail: false,
          });
      // this.setState({ email: text })
    } else {
      this.setState({
        correctEmail: true,
      });
    }
  };

  usernameCheck = (username) => {
    let reg2 = /^[\w\d@#-_  ]{3,30}$/;
    console.log('username >>>>', username);
    if (reg2.test(this.state.username) === false) {
      console.log('UserName is Not Correct');
      this.state.username === ''
        ? this.setState({
            ErrorMessege: 'UserName cannot be empty',
            usernameError: true,
            correctUsername: false,
          })
        : this.state.username.length > 2
        ? this.setState({
            ErrorMessege: 'Please enter a valid UserName',
            usernameError: true,
            correctUsername: false,
          })
        : this.setState({
            ErrorMessege: 'UserName should be atleast 3 characters!',
            usernameError: true,
            correctUsername: false,
          });
      // this.setState({ email: text })
    } else if (reg2.test(this.state.username) === true) {
      if (username !== '') {
        this.setState({
          correctUsername: true,
        });
        // console.log('valid fn called2');
        console.log('username1', username); //'e@e.com √'
        const ref = firestore().collection('Users');
        // console.log('valid fn called3');
        ref
          .where('username', '==', username)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              console.log(doc.id, '=>>>>', doc.data());
              if (doc.id != '') {
                console.log('true');
                this.setState({
                  ErrorMessege: 'UserName already exist!',
                  usernameError: true,
                  correctUsername: false,
                });
                // Alert.alert('Username already exist');
              } else {
                console.log('false');
                this.setState({
                  correctUsername: true,
                });
              }
            });
          });
      }
    } else {
      this.setState({
        correctUsername: true,
      });
    }
  };

  phoneNumCheck = () => {
    let reg5 = /^[\d]{6,13}$/;
    if (reg5.test(this.state.number) === false) {
      console.log('UserName is Not Correct');
      this.state.number === ''
        ? this.setState({
            ErrorMessege: 'phone Number cannot be empty',
            numberError: true,
          })
        : this.state.number.length > 10
        ? this.setState({
            ErrorMessege: 'Please enter a valid phone number',
            numberError: true,
          })
        : this.setState({
            ErrorMessege: 'phone number should be atleast 11 digit!',
            numberError: true,
          });
      // this.setState({ email: text })
    }
  };
  passwordCheck = () => {
    let reg6 = /^[\w\d@$!%*#?&]{6,30}$/;
    if (reg6.test(this.state.password) === false) {
      console.log('UserName is Not Correct');
      this.state.password === ''
        ? this.setState({
            ErrorMessege: 'Password cannot be empty',
            passwordError: true,
          })
        : this.state.password.length > 5
        ? this.setState({
            ErrorMessege: 'Please enter a valid Password',
            passwordError: true,
          })
        : this.setState({
            ErrorMessege: 'Password should be atleast 6 characters!',
            passwordError: true,
          });
      // this.setState({ email: text })
    }
  };
  passwordFocusHandler = () => {
    this.setState({errorPassword: ''});
    this.setState({
      borderColor3: '#589BE9',
    });
  };
  emailFocusHandler = () => {
    this.setState({
      borderColor2: '#589BE9',
    });
  };
  // async UservalidFn() {

  //   const matachData = await getAllOfCollection('Users');

  //   console.log("mmmmmatch data",JSON.stringify(matachData[0].username,null,2));

  // }
  // await auth()
  // .signInWithCredential(credential)
  // .then(async (user) => {
  //   let DataFound = await firestore()
  //     .collection('Users')
  //     .where('email', '==', user.user.email)
  //     .get();
  UservalidFn = async (username) => {
    console.log('valid fn called');

    // console.log("valid fn called1");
    if (username !== '') {
      // console.log('valid fn called2');
      console.log('username1', username); //'e@e.com √'
      const ref = firestore().collection('Users');
      // console.log('valid fn called3');
      ref
        .where('username', '==', username)
        .get()
        .then((querySnapshot) => {
          // console.log('valid fn called4');
          querySnapshot.forEach((doc) => {
            // console.log(doc.id, '=>>>>', doc.data());
            // console.log('valid fn called5');
            if (doc.id != '') {
              console.log('true');
              Alert.alert('Username already exist');
            } else {
              console.log('false');
            }
          });
        });
    }
  };

  nameCheck = (username) => {
    let reg1 = /^[\w  ]{3,30}$/;
    console.log('username12', username);
    if (reg1.test(this.state.name) === false) {
      console.log('UserName is Not Correct');
      this.state.name === ''
        ? this.setState({ErrorMessege: 'Name cannot be empty', nameError: true})
        : this.state.name.length > 2
        ? this.setState({
            ErrorMessege: 'Please enter proper First',
            nameError: true,
          })
        : this.setState({
            ErrorMessege: 'Name should be atleast 3 characters!',
            nameError: true,
          });
      // this.setState({ email: text })
    }
  };
  onFocus1() {
    this.setState({
      borderColor1: '#589BE9',
    });
  }

  onBlur1() {
    this.setState({
      borderColor1: '#362636',
    });
  }

  onBlur2() {
    this.setState({
      borderColor2: '#362636',
    });
  }

  onBlur3() {
    this.setState({
      borderColor3: '#362636',
    });
  }

  onBlur4() {
    this.setState({
      borderColor4: '#362636',
    });
  }
  onFocus4() {
    this.setState({
      borderColor4: '#589BE9',
    });
  }
  onBlur5() {
    this.setState({
      borderColor5: '#362636',
    });
  }
  onFocus5() {
    this.setState({
      borderColor5: '#589BE9',
    });
  }
  async SaveDataFn() {
    let callback = await signUp(
      this.state.email,
      this.state.password,
      this.state.name,
      this.state.username,
      this.state.number,
      this.props.navigation,
    );
    if (!callback) {
      this.setState({loader: false});
    }
  }

  async ValidationFn() {
    this.setState({loader: true});
    let TempCheck = await this.CheckValidateFn();
    switch (TempCheck) {
      case 0:
        const a = this.SaveDataFn();
        break;
      case 1:
        this.setState({loader: false});
        break;
      default:
        break;
    }
  }

  async CheckValidateFn() {
    let reg1 = /^[\w  ]{3,30}$/;
    if (reg1.test(this.state.name) === false) {
      console.log('UserName is Not Correct');
      this.state.name === ''
        ? this.setState({ErrorMessege: 'Name cannot be empty', nameError: true})
        : this.state.name.length > 2
        ? this.setState({
            ErrorMessege: 'Please enter proper First',
            nameError: true,
          })
        : this.setState({
            ErrorMessege: 'Name should be atleast 3 characters!',
            nameError: true,
          });
      // this.setState({ email: text })
      return 1;
    }

    //EmailCheck
    let reg3 = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg3.test(this.state.email) === false) {
      console.log('Email is Not Correct');
      this.state.email !== undefined && this.state.email !== ''
        ? this.setState({
            ErrorMessege: 'Please enter a valid Email',
            emailError: true,
            correctEmail: false,
          })
        : this.setState({
            ErrorMessege: 'Email cannot be empty',
            emailError: true,
            correctEmail: false,
          });
      // this.setState({ email: text })
      return 1;
    } else {
      this.setState({
        correctEmail: true,
      });
    }

    let reg5 = /^[\d]{6,13}$/;
    if (reg5.test(this.state.number) === false) {
      console.log('UserName is Not Correct');
      this.state.number === ''
        ? this.setState({
            ErrorMessege: 'phone Number cannot be empty',
            numberError: true,
          })
        : this.state.number.length > 10
        ? this.setState({
            ErrorMessege: 'Please enter a valid phone number',
            numberError: true,
          })
        : this.setState({
            ErrorMessege: 'phone number should be atleast 11 digit!',
            numberError: true,
          });
      // this.setState({ email: text })
      return 1;
    } else {
      this.setState({
        correctUsername: true,
      });
    }
    let reg2 = /^[\w\d@#-_  ]{3,30}$/;
    if (reg2.test(this.state.username) === false) {
      console.log('UserName is Not Correct');
      this.state.username === ''
        ? this.setState({
            ErrorMessege: 'UserName cannot be empty',
            usernameError: true,
            correctUsername: false,
          })
        : this.state.username.length > 2
        ? this.setState({
            ErrorMessege: 'Please enter a valid UserName',
            usernameError: true,
            correctUsername: false,
            v,
          })
        : this.setState({
            ErrorMessege: 'UserName should be atleast 5 characters!',
            usernameError: true,
            correctUsername: false,
          });
      // this.setState({ email: text })
      return 1;
    } else {
    }
    let reg6 = /^[\w\d@$!%*#?&]{6,30}$/;
    if (reg6.test(this.state.password) === false) {
      console.log('UserName is Not Correct');
      this.state.password === ''
        ? this.setState({
            ErrorMessege: 'Password cannot be empty',
            passwordError: true,
          })
        : this.state.password.length > 5
        ? this.setState({
            ErrorMessege: 'Please enter a valid Password',
            passwordError: true,
          })
        : this.setState({
            ErrorMessege: 'Password should be atleast 6 characters!',
            passwordError: true,
          });
      // this.setState({ email: text })
      return 1;
    }

    return 0;
  }

  async CreatePhoneString(phone) {
    console.log(phone);
    if (phone.length < 10) {
      this.setState({number: phone, correctNumber: false, numberError: true});

      let NewPhone = '';
      if (phone.length < 3) {
        NewPhone = '+1 (' + phone + ')';
      } else if (phone.length < 6) {
        NewPhone =
          '+1 (' + phone.substring(0, 2) + ') ' + phone.substring(3, 5);
      }

      this.setState({NewPhone: NewPhone});
    } else {
      this.setState({correctNumber: true, numberError: false});
    }
  }
  render() {
    const {pass, uname} = this.state;
    const {email, password, username, number, name} = this.state;
    return (
      <View style={styles.container}>
        <ScrollView>
          <View
            style={{
              top: responsiveHeight(3),
              height: responsiveHeight(10),
              flexDirection: 'row',
              marginLeft: responsiveWidth(4),
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({email: ''}),
                  this.props.navigation.navigate('Login');
              }}
              style={{top: responsiveHeight(3), left: 0, position: 'absolute'}}>
              <Image
                source={require('../../Assets/arrowback.png')}
                style={{height: responsiveWidth(5), width: responsiveWidth(6)}}
              />
            </TouchableOpacity>
            <View style={{width: '100%', left: -5}}>
              <Image
                source={require('../../Assets/Logo.png')}
                style={{
                  width: '50%',
                  height: '60%',
                  top: 10,
                  resizeMode: 'contain',
                  alignSelf: 'center',
                }}
              />
            </View>
          </View>
          <View style={{alignSelf: 'center', marginTop: responsiveHeight(3)}}>
            <Text style={{color: '#fff', fontSize: responsiveFontSize(2)}}>
              Name
            </Text>
            <View
              style={{
                overflow: 'hidden',

                flexDirection: 'row',
                height: responsiveHeight(6.7),
                width: responsiveWidth(80),
                borderColor: this.state.nameError
                  ? '#D9173B'
                  : this.state.borderColor1,
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
                onSubmitEditing={() => this.nameCheck()}
                onBlur={() => this.onBlur1()}
                onFocus={() => this.onFocus1()}
                value={name}
                onChangeText={(name) => {
                  this.setState({name, nameError: false});
                }}
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
                {this.state.nameError ? (
                  <Entypo
                    name={'circle-with-cross'}
                    size={responsiveWidth(4.5)}
                    color={'#D9173B'}
                  />
                ) : null}
                {this.state.correctname ? (
                  <AntDesign
                    name={'checkcircle'}
                    size={responsiveWidth(4.5)}
                    color={'#7AD693'}
                  />
                ) : null}
              </View>
            </View>
            {this.state.nameError ? (
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

          <View style={{alignSelf: 'center', marginTop: responsiveHeight(1)}}>
            <Text style={[{color: '#fff', fontSize: responsiveFontSize(2)}]}>
              Email
            </Text>
            <View
              style={{
                overflow: 'hidden',
                flexDirection: 'row',
                height: responsiveHeight(6.7),
                width: responsiveWidth(80),
                borderColor: this.state.emailError
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
                onSubmitEditing={() => this.emailCheck()}
                onBlur={() => this.onBlur2()}
                value={email}
                onChangeText={(email) => {
                  this.setState({email, emailError: false});
                }}
                keyboardType="email-address"
                onFocus={this.emailFocusHandler}
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
                {/* {console.log('hhhhhhh',this.state.correctEmail)} */}
                {this.state.correctEmail ? (
                  <AntDesign
                    name={'checkcircle'}
                    size={responsiveWidth(4.5)}
                    color={'#7AD693'}
                  />
                ) : null}
              </View>
            </View>
            {this.state.emailError ? (
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
          <View style={{alignSelf: 'center', marginTop: responsiveHeight(1)}}>
            <Text style={{color: '#fff', fontSize: responsiveFontSize(2)}}>
              Phone Number
            </Text>
            <View
              style={{
                overflow: 'hidden',
                flexDirection: 'row',
                height: responsiveHeight(6.7),
                width: responsiveWidth(80),
                borderColor: this.state.numberError
                  ? '#D9173B'
                  : this.state.borderColor3,
                borderWidth: 3,
                marginTop: responsiveHeight(1),
                borderRadius: 10,
                color: '#757575',
              }}>
              <TextInputMask
                paddingLeft={12}
                style={{
                  height: responsiveHeight(6),
                  width: responsiveWidth(68.6),
                  backgroundColor: '#fff',
                  borderTopLeftRadius: 7,
                  borderBottomLeftRadius: 7,
                  color: '#757575',
                }}
                keyboardType={'numeric'}
                placeholder=" +1 (000) 000-0000"
                onSubmitEditing={() => this.phoneNumCheck()}
                onBlur={() => this.onBlur3()}
                onFocus={this.passwordFocusHandler}
                refInput={(ref) => {
                  this.input = ref;
                }}
                onChangeText={(formatted, extracted) => {
                  this.setState({number: extracted, numberError: false});
                }}
                mask={'+1 ([000]) [000]-[0000]'}
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
                {this.state.numberError ? (
                  <Entypo
                    name={'circle-with-cross'}
                    size={responsiveWidth(4.5)}
                    color={'#D9173B'}
                  />
                ) : null}
                {this.state.correctNumber ? (
                  <AntDesign
                    name={'checkcircle'}
                    size={responsiveWidth(4.5)}
                    color={'#7AD693'}
                  />
                ) : null}
              </View>
            </View>
            {this.state.numberError ? (
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

          <View style={{alignSelf: 'center', marginTop: responsiveHeight(1)}}>
            <Text style={{color: '#fff', fontSize: responsiveFontSize(2)}}>
              Username
            </Text>
            <View
              style={{
                overflow: 'hidden',
                flexDirection: 'row',
                height: responsiveHeight(6.7),
                width: responsiveWidth(80),
                borderColor: this.state.usernameError
                  ? '#D9173B'
                  : this.state.borderColor4,
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
                onSubmitEditing={
                  () => this.usernameCheck(username)
                  // this.UservalidFn(username);
                }
                onBlur={() => this.onBlur4()}
                onFocus={() => this.onFocus4()}
                value={username}
                onChangeText={(username) => {
                  this.setState({username, usernameError: false});
                }}
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
                {this.state.usernameError ? (
                  <Entypo
                    name={'circle-with-cross'}
                    size={responsiveWidth(4.5)}
                    color={'#D9173B'}
                  />
                ) : null}
                {this.state.correctUsername ? (
                  <AntDesign
                    name={'checkcircle'}
                    size={responsiveWidth(4.5)}
                    color={'#7AD693'}
                  />
                ) : null}
              </View>
            </View>
            {this.state.usernameError ? (
              <Text
                style={{
                  fontSize: responsiveFontSize(1.4),
                  fontFamily: 'Lato-Bold',
                  color: '#D9173B',
                }}>
                {this.state.ErrorMessege}
              </Text>
            ) : null}
            <Text
              style={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: responsiveFontSize(1.5),
                marginBottom: responsiveHeight(1),
              }}>
              Usernames must be between 3 and 25 characters.
            </Text>
          </View>

          <View style={{alignSelf: 'center', marginTop: responsiveHeight(1)}}>
            <Text style={{color: '#fff', fontSize: responsiveFontSize(2)}}>
              Password
            </Text>
            <View
              style={{
                overflow: 'hidden',
                flexDirection: 'row',
                height: responsiveHeight(6.7),
                width: responsiveWidth(80),
                borderColor: this.state.passwordError
                  ? '#D9173B'
                  : this.state.borderColor5,
                borderWidth: 3,
                marginTop: responsiveHeight(1),
                borderRadius: 12,
                color: '#757575',
              }}>
              <TextInput
                paddingLeft={12}
                value={password}
                onSubmitEditing={() => this.passwordCheck()}
                onBlur={() => this.onBlur5()}
                onFocus={() => this.onFocus5()}
                onChangeText={(password) => {
                  this.setState({password, passwordError: false});
                }}
                style={{
                  right: 0.5,
                  height: responsiveHeight(6),
                  width: responsiveWidth(70),
                  backgroundColor: '#fff',
                  borderBottomLeftRadius: 10,
                  borderTopLeftRadius: 10,
                  color: '#757575',
                }}
                secureTextEntry={this.state.showPass}
              />
              <TouchableOpacity
                activeOpacity={0.9}
                style={{
                  right: 0.5,
                  backgroundColor: '#fff',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: responsiveWidth(8.7),
                  borderBottomRightRadius: 10,
                  borderTopRightRadius: 10,
                  height: responsiveHeight(6),
                }}
                onPress={() => this.setState({showPass: !this.state.showPass})}>
                {this.state.showPass ? (
                  <Entypo
                    name={'eye'}
                    size={responsiveWidth(4.5)}
                    color={'#000'}
                  />
                ) : (
                  <Entypo
                    name={'eye-with-line'}
                    size={responsiveWidth(4.5)}
                    color={'#000'}
                  />
                )}
              </TouchableOpacity>
            </View>
            {this.state.passwordError ? (
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
          <View style={styles.privacymainView}>
            <TouchableOpacity
              disabled={
                this.state.email == '' ||
                this.state.password == '' ||
                this.state.name == '' ||
                this.state.number == '' ||
                this.state.username == ''
                  ? true
                  : false
              }
              onPress={() => this.setState({isChecked: !this.state.isChecked})}
              style={{
                backgroundColor: '#fff',
                marginRight: responsiveWidth(5),
                borderRadius: 5,
              }}>
              {/* {console.log('ye cc', this.state.isChecked)} */}
              {this.state.isChecked == true ? (
                <FontAwesome
                  name={'check'}
                  size={responsiveWidth(6)}
                  color={'#000'}
                />
              ) : (
                <FontAwesome
                  name={'check'}
                  size={responsiveWidth(6)}
                  color={'#fff'}
                />
              )}
            </TouchableOpacity>
            <View>
              <Text style={styles.andTextStyle}>
                By Logging in, you agree to the
              </Text>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => this.setState({visible: true})}>
                  <Text style={styles.privacypolicyTextSyle}>
                    Terms of Service
                  </Text>
                </TouchableOpacity>
                <Text style={styles.andTextStyle}> and </Text>
                <TouchableOpacity
                  onPress={() => this.setState({visible1: true})}>
                  <Text style={styles.privacypolicyTextSyle}>
                    Privacy Policy
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={styles.bottonouterView}>
            <TouchableOpacity
              disabled={
                this.state.email == '' ||
                this.state.password == '' ||
                this.state.name == '' ||
                this.state.number == '' ||
                this.state.username == '' ||
                this.state.isChecked == false
                  ? true
                  : false
              }
              style={{
                backgroundColor: !this.state.isChecked
                  ? 'rgba(217, 23, 59,0.4)'
                  : '#D9173B',
                alignItems: 'center',
                justifyContent: 'center',
                width: responsiveWidth(75),
                borderRadius: 25,
                height: responsiveHeight(6.5),
              }}
              onPress={() => this.ValidationFn()}>
              {this.state.loader ? (
                <ActivityIndicator
                  size="large"
                  color="white"
                  style={{backgroundColor: 'rgba(0,0,0,0)'}}
                />
              ) : (
                <Text style={styles.btnTextStyle}>Create Account</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
        <Modal
          visible={this.state.visible}
          onTouchOutside={() => {
            this.setState({visible: false});
          }}>
          <ModalContent
            style={{height: responsiveHeight(90), width: responsiveWidth(88)}}>
            <View style={{width: '100%'}}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({visible: false});
                }}
                style={{alignSelf: 'flex-end'}}>
                <Text style={{color: '#D9173B', fontWeight: 'bold'}}>
                  Close
                </Text>
              </TouchableOpacity>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#D9173B',
                    fontSize: responsiveFontSize(2.2),
                    fontWeight: 'bold',
                  }}>
                  Terms of Services
                </Text>
                <HTMLView
                  value={this.state.Terms}
                  stylesheet={{
                    fontSize: responsiveFontSize(2),
                    // marginHorizontal: responsiveWidth(1),
                  }}
                />
              </ScrollView>
            </View>
          </ModalContent>
        </Modal>
        <Modal
          visible={this.state.visible1}
          onTouchOutside={() => {
            this.setState({visible1: false});
          }}>
          <ModalContent
            style={{height: responsiveHeight(90), width: responsiveWidth(88)}}>
            <View style={{width: '100%'}}>
              <TouchableOpacity
                onPress={() => {
                  this.setState({visible1: false});
                }}
                style={{alignSelf: 'flex-end'}}>
                <Text style={{color: '#D9173B', fontWeight: 'bold'}}>
                  Close
                </Text>
              </TouchableOpacity>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#D9173B',
                    fontSize: responsiveFontSize(2.2),
                    fontWeight: 'bold',
                  }}>
                  Privacy and Cookie Policy
                </Text>
                <HTMLView
                  value={this.state.PrivacyPolicy}
                  stylesheet={{
                    fontSize: responsiveFontSize(2),
                  }}
                />
              </ScrollView>
            </View>
          </ModalContent>
        </Modal>
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
  errorTextStyle: {
    fontSize: responsiveFontSize(2),
    backgroundColor: 'red',
    color: '#FFF',
    marginLeft: responsiveWidth(5),
  },
  privacymainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
    marginTop: responsiveHeight(5),
  },
  andTextStyle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: responsiveFontSize(2),
  },
  privacypolicyTextSyle: {
    color: '#D9173B',
    fontSize: responsiveFontSize(2),
  },
  bottonouterView: {
    marginTop: responsiveHeight(7),
    alignSelf: 'center',
  },

  btnTextStyle: {
    textAlign: 'center',
    alignSelf: 'center',
    fontFamily: 'Lato-Regular',
    fontSize: responsiveFontSize(2.2),
    color: '#fff',
    marginVertical: responsiveWidth(4),
  },
});
