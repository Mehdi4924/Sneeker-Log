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
  AsyncStorage,
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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Button, Switch} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore"
import { saveData } from '../Backend/utility';
import * as Animatable from 'react-native-animatable';
import { FirebaseStorageTypes } from '@react-native-firebase/storage';
export default class ManageAccount extends Component {
  state = {
    modalVisibleStar2: false,
    showAlert2:false,
    showAlert3:false,
    // UserInfo: this.props.navigation.getParam('UserInfo'),
    UserInfo: this.props.route.params.UserInfo,
  };
  onSuccess = (e) => {
    Linking.openURL(e.data).catch((err) =>
      console.error('An error occured', err),
    );
  };
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent
        />
        {this.state.showAlert2 ? (
         <Animatable.View animation={'fadeInDownBig'}
            style={{
              top: responsiveHeight(12.5),
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
                style={{color: 'gray', fontSize: 12, fontFamily: 'Lato-Black'}}
                ellipsizeMode={'tail'}
                numberOfLines={1}>
                ACCOUNT {this.state.UserInfo.isDeActive? "DISABLED": "ENABLED"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                // this.props.navigation.goBack();
                this.setState({showAlert2: false})}}>
              <AntDesign name={'close'} color={'gray'} size={20} />
            </TouchableOpacity>
          </Animatable.View>
        ) : null}
        {this.state.showAlert3 ? (
         <Animatable.View animation={'fadeInDownBig'}
            style={{
              top: responsiveHeight(12.5),
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
                style={{color: 'gray', fontSize: 12, fontFamily: 'Lato-Black'}}
                ellipsizeMode={'tail'}
                numberOfLines={1}>
                ACCOUNT DELETED
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                // this.props.navigation.goBack();
                this.setState({showAlert3: false})}}>
              <AntDesign name={'close'} color={'gray'} size={20} />
            </TouchableOpacity>
          </Animatable.View>
        ) : null}
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
          <TouchableOpacity
            style={{
              alignSelf: 'center',
              position: 'absolute',
              left: responsiveWidth(88),
              zIndex: 1,
            }}></TouchableOpacity>
        </View>
        <ScrollView>
          <View
            style={{
              height: responsiveHeight(8),
              // marginHorizontal:responsiveWidth(5),
              justifyContent: 'space-around',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Lato-Bold',
                fontWeight: 'normal',
                fontSize: responsiveFontSize(2.4),
                color: '#121212',
              }}>
              MANAGE ACCOUNT
            </Text>
          </View>
          <View
            style={{
              marginTop: responsiveHeight(3),
              marginLeft: responsiveWidth(5),
            }}>
            <Text style={styles.fieldname}>DISABLE/ENABLE MY ACCOUNT</Text>
          </View>
          <View
            style={{
              marginTop: responsiveHeight(1),
              marginLeft: responsiveWidth(5),
            }}>
            <Text style={styles.text2}>
            You can disable your account instead of deleting it. This means your account will be hidden until you reactivate it by logging back in and entering the email address used to create the account.
            </Text>
          </View>
          <View
            style={{
              marginTop: responsiveHeight(5),
              marginLeft: responsiveWidth(5),
            }}>
            <Text style={styles.fieldname}>
            To Continue, ENTER EMAIL TO {
                    this.state.UserInfo.isDeActive!== undefined && this.state.UserInfo.isDeActive ?  "ENABLE":"DISABLE"
                  } ACCOUNT{' '}
            </Text>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderTopWidth: 1,
              borderRadius: 5,
              borderColor: '#B6BBC8',
              backgroundColor: '#FFF',
              marginHorizontal: responsiveWidth(5),
              marginTop: responsiveHeight(1),
              height: responsiveHeight(6),
              justifyContent: 'center',
            }}>
            <TextInput
              paddingLeft={12}
              // secureTextEntry={true}
              style={styles.textinputfield}
              value={this.state.email}
              onChangeText={(text) => {
                this.setState({email: text});
              }}
            />
          </View>
          <View
            style={{
              marginTop: responsiveHeight(3),
              marginLeft: responsiveWidth(5),
            }}>
            <Text style={styles.fieldname}>DISABLE/ENABLE MY ACCOUNT </Text>
          </View>
          <View
            style={{
              marginTop: responsiveHeight(1),
              marginLeft: responsiveWidth(5),
            }}>
            <Text style={styles.text2}>
            Disabling your account will hide your Collections and Profile until you reactivate your account.Enabling your account will make your Collections and Profile visible.{' '}
            </Text>
          </View>
          <View
            style={{
              marginBottom: responsiveHeight(3),
              marginTop: responsiveHeight(4),
            }}>
            <TouchableOpacity
            onPress={async()=>{
              if(this.state.UserInfo.email === this.state.email){
                let Obj = {
                  isDeActive: this.state.UserInfo.isDeActive!== undefined ?!this.state.UserInfo.isDeActive: true ,
                };
                let oldUser= this.state.UserInfo;
                oldUser.isDeActive= Obj.isDeActive;
                this.setState({UserInfo: oldUser,showAlert2: true})
                let id = await AsyncStorage.getItem('Token');
                await saveData('Users', id, Obj);
                if(Obj.isDeActive){
                  setTimeout(async()=>{
                    await AsyncStorage.removeItem('Token');
                    this.props.navigation.navigate('Auth');
                  },2000);
                  
                }else{
                  setTimeout(()=>{
                    this.props.navigation.navigate("Home");
                  },2000);
                  
                }
                // alert(Obj.isDeActive?"Account Disabled!":"Account Enabled!");
                // this.props.navigation.goBack();
              }else{

              }
              
            }}
              style={{
                marginHorizontal: responsiveWidth(5),
                height: responsiveHeight(6),
                justifyContent: 'center',
                alignItems: 'center',
               
                borderRadius: 5,
                borderColor: '#D9173B',
                backgroundColor: this.state.UserInfo.email === this.state.email ?'#D9173B' :'rgba(217, 23, 59,0.4)',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  fontWeight: 'normal',
                  fontSize: responsiveFontSize(2.2),
                  color: this.state.UserInfo.email === this.state.email ? '#FFF':'#fff',
                }}>
                  {
                    this.state.UserInfo.isDeActive!== undefined && this.state.UserInfo.isDeActive ?  "Enable Account":"Disable Account"
                  }
                
              </Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              marginTop: responsiveHeight(3),
              marginLeft: responsiveWidth(5),
            }}>
            <Text style={styles.fieldname}>DELETE ACCOUNT</Text>
          </View>
          <View
            style={{
              marginBottom: responsiveHeight(3),
              marginTop: responsiveHeight(1),
            }}>
            <TouchableOpacity
              onPress={() => {
                this.setState({modalVisibleStar2: true});
              }}
              style={{
                marginHorizontal: responsiveWidth(5),
                height: responsiveHeight(6),
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderTopWidth: 1,
                borderRadius: 5,
                borderColor: '#B6BBC8',
                backgroundColor: '#fff',
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  fontWeight: 'normal',
                  fontSize: responsiveFontSize(2.2),
                  color: '#589BE9',
                }}>
                Yes
              </Text>
            </TouchableOpacity>
          </View>
        
        </ScrollView>
        <Modal
          visible={this.state.modalVisibleStar2}
          transparent={true}
          overlayBackgroundColor="black"
          style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
          onTouchOutside={() => {
            this.setState({modalVisibleStar2: false});
          }}>
          <View>
            <ModalContent style={styles.modalview2}>
              <Text
                style={[
                  styles.favtext,
                  {
                    marginBottom: responsiveHeight(2),
                    fontSize: responsiveFontSize(2),
                    alignSelf: 'center',
                    marginTop: responsiveWidth(0.5),
                    textAlign: 'center',
                  },
                ]}>
                ARE YOU SURE YOU WANT TO DELETE ACCOUNT?
              </Text>

              <View
                style={{
                  borderBottomWidth: responsiveWidth(0.2),
                  borderColor: '#B6BBC8',
                  width: responsiveWidth(100),
                  marginLeft: responsiveWidth(-5),
                  marginTop: responsiveHeight(1),
                }}></View>
              <View style={{flexDirection: 'row', height: responsiveHeight(8)}}>
                <TouchableOpacity
                  style={[
                    styles.buttonview,
                    ,
                    {
                      borderRightWidth: responsiveWidth(0.3),
                      borderColor: '#B6BBC8',
                    },
                  ]}
                  onPress={() => {
                    this.setState({modalVisibleStar2: false});
                  }}>
                  <Text style={styles.buttontext}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonview}
                  onPress={async () => {
                    var user = await auth().currentUser;
                    let id = await AsyncStorage.getItem('Token');
                    
                    user
                      .delete()
                      .then(async () => {
                        this.setState({showAlert3: true})
                        await firestore().collection('Users').doc(id).delete();
                        setTimeout(async()=>{
                          
                          await AsyncStorage.removeItem('Token');
                          this.props.navigation.navigate('Auth');
                        },2000);
                        // alert('Account deleted!');
                      })
                      .catch(function (error) {
                        // An error happened.
                      });
                    this.setState({modalVisibleStar2: false});
                  }}>
                  <Text style={styles.buttontext}>Yes</Text>
                </TouchableOpacity>
              </View>
            </ModalContent>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  header: {
    backgroundColor: '#362636',

    // backgroundColor:'red',
    width: responsiveWidth(100),
    height: responsiveHeight(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonview: {
    width: responsiveWidth(35),
    alignItems: 'center',
    justifyContent: 'center',
    //  backgroundColor:'red',
    height: '100%',
    //marginTop:responsiveWidth(3)
  },
  buttontext: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Lato-Regular',
    color: '#589BE9',
  },
  modalview1: {
    width: responsiveWidth(78),
    height: responsiveHeight(25),
  },
  modalview2: {
    width: responsiveWidth(78),
    height: responsiveHeight(22.6),
  },
  favtext: {
    marginHorizontal: responsiveWidth(10),
    fontFamily: 'Lato-Bold',
    fontSize: responsiveFontSize(1.8),
  },
  headerimage: {
    height: responsiveHeight(4),
    width: responsiveWidth(40),
    resizeMode: 'contain',
    // alignSelf: 'center',
    marginLeft: responsiveWidth(20),
    marginTop: responsiveWidth(7),
  },
  fieldname: {
    fontFamily: 'Lato-Heavy',
    fontWeight: 'normal',
    fontSize: responsiveFontSize(1.6),
    color: '#6c6c6c',
  },
  text2: {
    fontFamily: 'Lato-Regular',
    fontWeight: 'normal',
    fontSize: responsiveFontSize(2.1),
    color: 'black',
  },
  profileimage: {
    height: responsiveHeight(4),
    width: responsiveHeight(4),
    borderRadius: responsiveWidth(6),
    marginLeft: responsiveWidth(19),
    marginTop: responsiveWidth(7),
    alignSelf: 'center',
  },
  buttoncontainer: {
    width: responsiveWidth(85),
    alignSelf: 'center',
    height: responsiveHeight(7),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: responsiveWidth(1.9),
    backgroundColor: '#D9173B',
    marginTop: responsiveWidth(55),
  },
  text: {
    color: '#fff',
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Lato-Bold',
  },
  text1: {
    color: '#fff',
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Lato-Bold',
    alignSelf: 'center',
    marginTop: responsiveWidth(5),
  },
  textinputfield: {
    marginHorizontal: responsiveWidth(3),
    fontFamily: 'Lato-Medium',
    fontWeight: 'normal',
    fontSize: responsiveFontSize(2.2),
    color: 'black',
  },
  textinputcontainer: {
    marginHorizontal: responsiveWidth(5),
    marginTop: responsiveHeight(1),
    height: responsiveHeight(6),
    alignItems: 'center',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderRadius: 5,
    borderColor: '#B6BBC8',
    backgroundColor: '#FFF',
    flexDirection: 'row',
  },
});
