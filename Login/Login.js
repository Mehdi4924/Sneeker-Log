import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
  NativeModules,
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
import { KeyboardAvoidingView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AuthLoading from './AuthLoading';
import { signIn } from '../Backend/auth';
import {
  connectFirebase,
  getData,
  saveData,
  getAllOfCollection,
} from '../Backend/utility';
import HTMLView from 'react-native-htmlview';
import {
  LoginButton,
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,

} from 'react-native-fbsdk-next';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useFocusEffect } from '@react-navigation/native';
import GlobalConst from './GlobalConst';
import messaging from '@react-native-firebase/messaging';
// import RNTwitterSignIn  from "react-native-login-twitter";
const { RNTwitterSignIn } = NativeModules;
const Constants = {
  //Dev Parse keys
  TWITTER_CONSUMER_KEY: 'rdnCITCM0SFSbSg02p5bCsBqC',
  TWITTER_CONSUMER_SECRET: 'gJwXO1N59JeYqqu13iib3WvS7v4TeQ1S42OlPX1ebitMISibK9',
};
export default class Login extends Component {
  state = {
    visible: false,
    visible1: false,
    showPass: true,
    isLoading: false,
    emailerror: false,
    passworderror: false,
    email: '',
    loader: false,
    password: '',
    // password: "",
    borderColor1: '#362636',
    borderColor2: '#362636',
    PrivacyPolicy: '',
    Terms: '',
  };

  componentDidMount = async () => {
    const unsubscribe = this.props.navigation.addListener('focus', () => {
      console.log('Datsdfjklka');
      this.setState({
        email: '',
        password: '',
      })
    })

    await connectFirebase();
    let TermsandCondation = [];
    let Privacy = await getData('Policy', '123');
    let Terms = await getData('Terms', '1');
    this.setState({
      PrivacyPolicy: Privacy.privacyPolicy,
      Terms: Terms.termsOfService,
    });
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 2000);
  };

  FacebookLogin = async () => {
    this.setState({ isLoading: true })
    try {
      if (Platform.OS === "android") {
        LoginManager.setLoginBehavior("web_only")
      }
      await LoginManager.logInWithPermissions(['public_profile', 'email']).then(
        async (result) => {
          if (result.isCancelled) {
            console.log('Login cancelled');
          } else {
            console.log(
              'Login success with permissions: ' +
              result.grantedPermissions.toString(),
            );
            const data = await AccessToken.getCurrentAccessToken();
            console.log('Data', data);
            if (!data) {
              // handle this however suites the flow of your app
              throw new Error(
                'Something went wrong obtaining the users access token',
              );
            }
            let imageURL = '';
            // create a new firebase credential with the token
            const credential = await auth.FacebookAuthProvider.credential(
              data.accessToken,
            );
            console.log('credential', credential);
            // login with credential
            const graphRequest = new GraphRequest(
              '/me',
              {
                accessToken: data.accessToken,
                parameters: {
                  fields: {
                    string: 'picture.type(large)',
                  },
                },
              },
              (error, result) => {
                if (error) {
                  console.error(error);
                } else {
                  console.log('profile picture = ', result.picture.data.url);
                  imageURL = result.picture.data.url;
                }
              },
            );

            // new GraphRequestManager().addRequest(graphRequest).start();
            await auth()
              .signInWithCredential(credential)
              .then(async (user) => {
                let DataFound = await firestore()
                  .collection('Users')
                  .where('email', '==', user.user.email)
                  .get();
                console.log(DataFound.docs);
                if (DataFound.docs.length === 0) {
                  // console.log(user.metadata)
                  await saveData('Users', user.user.uid, {
                    Id: user.user.uid,
                    name:
                      user.additionalUserInfo.profile.first_name +
                      ' ' +
                      user.additionalUserInfo.profile.last_name,
                    username:
                      user.additionalUserInfo.profile.first_name +
                      user.additionalUserInfo.profile.last_name,
                    // phone: phone,
                    profileImage: imageURL,
                    email: user.user.email,
                    isLogin: true,
                    receivedata: [],
                    sentdata: [],
                    followersdata: [],
                    followingdata: [],
                  }).then(async () => {
                    await AsyncStorage.setItem('Token', user.user.uid);
                    this.props.navigation.navigate('App');
                  }).catch(err => {
                    console.log('===>>>', err);
                  })
                } else {
                  await AsyncStorage.setItem('Token', user.user.uid);
                  await saveData('Users', user.user.uid, { isLogin: true });
                  this.props.navigation.navigate('App');
                }
              })
              .catch(function (error) {
                alert(error.code + ': ' + error.message);
              });
          }
        },
        function (error) {
          console.log('Login fail with error: ' + error);
        },
      );
    } catch (e) {
      isLoading = false;
      this.setState({ isLoading });
      console.error(e);
    }
  };


  TwitterSignIn = async () => {
    await RNTwitterSignIn.init(
      Constants.TWITTER_CONSUMER_KEY,
      Constants.TWITTER_CONSUMER_SECRET,
    );
    await RNTwitterSignIn.logIn()
      .then(async (loginData) => {
        console.log('loginData: ', loginData);
        let credential = await auth.TwitterAuthProvider.credential(
          loginData.authToken,
        );
        // console.log("credential: ",credential)
        credential.secret = loginData.authTokenSecret;
        // let token=await credential.token.split("-");
        // credential.token= token[1];
        // login with credential
        console.log('credential', credential);
        await auth()
          .signInWithCredential(credential)
          .then(async (user) => {
            let DataFound = await firestore()
              .collection('Users')
              .where('email', '==', loginData.email)
              .get();
            console.log(DataFound.docs);
            if (DataFound.docs.length === 0) {
              console.log('meta data : ', user.metadata);
              await saveData('Users', user.user.uid, {
                Id: user.user.uid,
                name: loginData.userName,
                username: loginData.userName,
                email: loginData.email,
                receivedata: [],
                isLogin: true,
                sentdata: [],
                followersdata: [],
                followingdata: [],
                profileImage:
                  'https://res.cloudinary.com/demo/image/twitter/' +
                  loginData.userID +
                  '.jpg',
                // Email:
                // firstName: user.additionalUserInfo.profile.first_name,
                // LastName: user.additionalUserInfo.profile.last_name,
                // ImageURL: user.user.photoURL,
                // Id: user.user.uid
              }).then(async () => {
                console.log('New');
                await AsyncStorage.setItem('Token', user.user.uid);
                this.props.navigation.navigate('App');
              });
            } else {
              console.log('Old');
              await AsyncStorage.setItem('Token', user.user.uid);
              await saveData('Users', user.user.uid, { isLogin: true });
              this.props.navigation.navigate('App');
            }
          })
          .catch(function (error) {
            // success = false;
            console.log(error);
            alert(error.code + ': ' + error.message);
            // this.setState({ isLoading:false  });
          });
        // const { authToken, authTokenSecret } = loginData
        // if (authToken && authTokenSecret) {
        //   this.setState({
        //     isLoggedIn: true
        //   })
        // }
      })
      .catch((error) => {
        console.log(error);
      });
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
  onFocus2() {
    this.setState({
      borderColor2: '#589BE9',
    });
  }

  onBlur2() {
    this.setState({
      borderColor2: '#362636',
    });
  }

  async SaveDataFn() {
    let callback = await signIn(
      this.state.email,
      this.state.password,
      this.state.checked,
    );
    if (callback.isLogin) {
      let Token = await AsyncStorage.getItem('Token');
      console.log("ye aya Token", Token);
      await saveData('Users', Token, { isLogin: true });
      let Usertoken;
      await messaging().getToken().then(res => {
        console.log('troken fcm', res);
        Usertoken = res
      })
      const obj = {
        id: Token, token: Usertoken
      }
      console.log('obj', obj);

      await firestore()
        .collection('FCMTokens')
        .doc(Token)
        .set(obj).then(res => {
          console.log('token set', res);
        })
      const navigate = this.props.navigation.navigate;
      this.setState({
        email: '',
        password: '',
      })
      navigate('App');
    } else {
      console.log(callback.errorType);
      let Token = callback.errorType.split('/');
      if (Token[1] === 'user-not-found') {
        // alert("Email")
        this.setState({ emailerror: true });
      } else if (Token[1] === 'wrong-password') {
        this.setState({ passworderror: true });
      } else {
        alert(Token[1]);
      }
    }
    this.setState({ loader: false });
  }

  async ValidationFn() {
    this.setState({ loader: true });
    let TempCheck = await this.CheckValidateFn();

    switch (TempCheck) {
      case 0:
        this.SaveDataFn();
        break;
      case 1:
        this.setState({ loader: false });
        alert(this.state.ErrorMessege);
        break;
      default:
        break;
    }
  }
  async CheckValidateFn() {
    //EmailCheck
    let reg2 = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg2.test(this.state.email) === false) {
      console.log('Email is Not Correct');
      this.state.email !== undefined && this.state.email !== ''
        ? this.setState({ ErrorMessege: 'Please enter proper Email Id' })
        : this.setState({ ErrorMessege: 'Email cannot be empty' });
      // this.setState({ email: text })
      return 1;
    }

    let reg1 = /^[\w\d@$!%*#?&]{6,30}$/;
    if (reg1.test(this.state.password) === false) {
      console.log('UserName is Not Correct');
      this.state.password === ''
        ? this.setState({ ErrorMessege: 'Password cannot Not be empty' })
        : this.state.password.length > 5
          ? this.setState({ ErrorMessege: 'Please enter proper Password' })
          : this.setState({
            ErrorMessege: 'Password should be atleast 6 characters!',
          });
      // this.setState({ email: text })
      return 1;
    }
    return 0;
  }

  render() {
    const { isLoading, password } = this.state;

    // if (isLoading) {
    //   return <AuthLoading />;
    // }
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#362636" barStyle="light-content" />

        <ScrollView>
          <View
            style={{
              marginTop: responsiveHeight(9),
              width: '100%',
              height: responsiveHeight(12),
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              source={require('../../Assets/Logo.png')}
              style={{
                width: '80%',
                height: '45%',
                resizeMode: 'contain',
                alignSelf: 'center',
              }}
            />
          </View>
          <View>
            <Text
              style={{
                fontSize: responsiveFontSize(2.2),
                textAlign: 'center',
                color: '#e3e1dc',
              }}>
              Please Log In to your account
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '75%',
              alignSelf: 'center',
              marginTop: responsiveHeight(3),
            }}>
            <TouchableOpacity
              onPress={() => {
                this.TwitterSignIn();
              }}
              style={{
                paddingHorizontal: 42,
                paddingVertical: 6,
                backgroundColor: '#1DA1F2',
                borderRadius: 20,
              }}>
              <AntDesign name={'twitter'} color={'white'} size={25} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.FacebookLogin();
              }}
              style={{
                paddingHorizontal: 42,
                paddingVertical: 6,
                backgroundColor: '#4267B2',
                borderRadius: 20,
              }}>
              <AntDesign name={'facebook-square'} color={'white'} size={25} />
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: responsiveHeight(1.5) }}>
            <Text
              style={{
                fontSize: responsiveFontSize(2.5),
                textAlign: 'center',
                color: '#e3e1dc',
              }}>
              - OR -
            </Text>
          </View>

          <View
            style={{
              alignSelf: 'center',
              justifyContent: 'center',
              marginTop: responsiveHeight(2),
            }}>
            <Text
              style={{ color: '#fff', fontSize: responsiveFontSize(2), left: 5 }}>
              Email
            </Text>
            <TextInput
              keyboardType={'email-address'}
              onChangeText={(value) => {
                this.setState({ emailerror: false, passworderror: false });
                this.setState({ email: value });
              }}
              // placeholder={}
              value={this.state.email}
              style={{
                height: responsiveHeight(7),
                width: responsiveWidth(78),
                borderColor: this.state.borderColor1,
                borderWidth: 3,
                marginTop: responsiveHeight(1.3),
                paddingLeft: 15,
                backgroundColor: '#fff',
                borderRadius: 10,
                color: '#757575',
              }}
              // onChangeText={text => onChangeText(text)}
              onBlur={() => this.onBlur1()}
              onFocus={() => this.onFocus1()}
            />
          </View>
          {this.state.emailerror ? (
            <View
              style={{
                marginTop: responsiveHeight(1),
                width: responsiveWidth(90),
                marginLeft: responsiveWidth(15),
              }}>
              <Text
                style={{ color: '#D9173B', fontSize: responsiveFontSize(1.8) }}>
                Invalid Email
              </Text>
            </View>
          ) : null}
          <View style={{ alignSelf: 'center', marginTop: responsiveHeight(3) }}>
            <Text
              style={{ color: '#fff', fontSize: responsiveFontSize(2), left: 5 }}>
              Password
            </Text>
            <View
              style={{
                overflow: 'hidden',
                flexDirection: 'row',
                height: responsiveHeight(6.7),
                width: responsiveWidth(78),
                borderColor: this.state.borderColor2,
                borderWidth: 3,
                marginTop: responsiveHeight(1),
                borderRadius: 12,
                color: '#757575',
              }}>
              <TextInput
                // value={password}
                onChangeText={(value) => {
                  this.setState({ emailerror: false, passworderror: false });
                  this.setState({ password: value });
                }}
                value={this.state.password}
                onBlur={() => this.onBlur2()}
                onFocus={() => this.onFocus2()}
                style={{
                  right: 0.5,
                  paddingLeft: 15,
                  height: responsiveHeight(6),
                  width: responsiveWidth(68.5),
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
                  width: responsiveWidth(8.2),
                  borderBottomRightRadius: 10,
                  borderTopRightRadius: 10,
                  height: responsiveHeight(6),
                }}
                onPress={() => this.setState({ showPass: !this.state.showPass })}>
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

            {this.state.passworderror ? (
              <View
                style={{
                  marginTop: responsiveHeight(1),
                  width: responsiveWidth(30),
                  marginLeft: responsiveWidth(0),
                }}>
                <Text
                  style={{ color: '#D9173B', fontSize: responsiveFontSize(1.8) }}>
                  Wrong Password
                </Text>
              </View>
            ) : null}
            <TouchableOpacity
              style={{ marginTop: responsiveHeight(1), left: 3 }}
              onPress={() => this.props.navigation.navigate('ForgotPassword', { email: this.state.email })}>
              <Text
                style={{
                  color: '#D9173B',
                  fontSize: responsiveFontSize(1.8),
                  fontFamily: 'Lato-Regular',
                }}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ marginTop: responsiveHeight(5), alignSelf: 'center' }}>
            <TouchableOpacity
              style={{
                backgroundColor: '#D9173B',
                width: responsiveWidth(75),
                borderRadius: 25,
                height: responsiveHeight(6.5),
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => this.ValidationFn()}>
              {this.state.loader ? (
                <ActivityIndicator
                  size="large"
                  color="white"
                  style={{ backgroundColor: 'rgba(0,0,0,0)' }}
                />
              ) : (
                <Text
                  style={{
                    textAlign: 'center',
                    alignSelf: 'center',
                    fontWeight: '900',
                    fontSize: responsiveFontSize(2.2),
                    color: '#fff',
                    marginVertical: responsiveWidth(4),
                    fontFamily: 'Lato-Regular',
                  }}>
                  Log In
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={{ marginTop: responsiveWidth(1) }}
              onPress={() => {
                this.props.navigation.navigate('Signup')
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontSize: responsiveFontSize(2.2),
                  color: 'rgba(255, 255, 255, 0.7)',
                  marginVertical: responsiveWidth(4),
                  fontFamily: 'Lato-Regular',
                }}>
                Sign Up
              </Text>
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
});
