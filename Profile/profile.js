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
  BottomModal,
} from 'react-native-modals';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";
import * as Animatable from 'react-native-animatable';

import {connectFirebase, getData, saveData} from '../Backend/utility';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import FA5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { ActivityIndicator } from 'react-native-paper';
import { FirebaseStorageTypes } from '@react-native-firebase/storage';
export default class profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisibleStar2: false,
      isLogout: false,
      facebook: true,
      twitter: true,
      isLoading:true,
      UserInfo: {
        name: '',
        SneakerSize: '',
        name2:"AA"
        // email: '',
        // phone: '',
        // username: '',
      },
      userProfilePic:''

    };
  }

  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener(
      'focus',
      async () => {
        // await AsyncStorage.getItem("updateProfile", async (error,data)=>{
        //   if(data){
        //     console.log("updated call")
        //     this.setState({showAlert: true})
        //     AsyncStorage.removeItem("updateProfile");
        //   }
        // })
        let id = await AsyncStorage.getItem('Token');

        await firestore().collection("Users").doc(id).onSnapshot(async () => {
          let UserData = await getData('Users', id);
          console.log("User get>>>>>>",UserData)
          if(UserData.profileImage){
            if(!UserData.profileImage.includes('firebasestorage') && !UserData.profileImage.includes('twitter')){
              let asid = UserData.profileImage?.split('asid=').pop().split('&')[0]
              fetch(`http://graph.facebook.com/${asid}/picture?type=large&height=200&width=200`)
                .then((response) =>{
                  this.setState({
                    userProfilePic : response.url
                  })
                  
                })
                .catch((error) => console.error(error))
            }
          }
        var user = auth().currentUser;
        console.log("User>>>>>>",JSON.stringify(UserData,null,2))
        user._user.providerData.forEach(element => {
          if(element.providerId ==="facebook.com"){
            this.setState({facebook:false})
          }
          if(element.providerId ==="twitter.com"){
            this.setState({twitter:false})
          }
          
        });
          // if (user._user.providerData[0].providerId ==="facebook.com") {
            
          // }
        // for (UserInfo user: FirebaseAuth.getInstance().getCurrentUser().getProviderData()) {
        //   if (user.getProviderId().equals("facebook.com")) {
        //     System.out.println("User is signed in with Facebook");
        //   }
        // }
        await AsyncStorage.setItem('User', JSON.stringify(UserData));
        // UserData.profileImage="";
        {UserData?.name&&UserData?.name!=null?
        UserData.name2= UserData?.name[0].toUpperCase()+UserData?.name[1].toUpperCase():null}
        await this.setState({UserInfo: UserData,isLoading:false});
      
        }) 
      },
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent></StatusBar>
        {/* <View style={styles.header}>
        <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Home')}
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
        </View> */}
        {/* <View style={{flexDirection: 'row'}}> */}
        <View style={styles.header2}>
          <Text style={styles.change}> </Text>
          <Text style={styles.profile}>PROFILE</Text>
          <Text
            onPress={() => {
              if(!this.state.isLoading){
                this.props.navigation.navigate('Editprofile1')
              }
              }}
            style={styles.edit}>
            Edit
          </Text>
        </View>

        {/* </View> */}
        {this.state.showAlert ?
         <Animatable.View animation={'fadeInDownBig'} style={{ top: responsiveHeight(12.5), elevation: 2, zIndex: 1, position: 'absolute', flexDirection: 'row', width: '95%', borderRadius: 8, borderLeftWidth: 5, borderLeftColor: '#55dd91', height: responsiveHeight(12), backgroundColor: 'white', alignSelf: 'center', justifyContent: 'space-evenly', alignItems: 'center' }}>
            <Image
              style={{
                marginLeft: responsiveWidth(0),
                height: responsiveWidth(13),
                width: responsiveWidth(13),
                marginBottom: 2,
              }}
              source={
                require('../../Assets/CheckSuccessOutline.png')
              }
            />              
            <View style={{ width: responsiveWidth(62) }}>
              <Text style={{ color: 'gray', fontSize: 12, fontFamily: 'Lato-Black' }} ellipsizeMode={'tail'} numberOfLines={1}>
                PROFILE SUCCESSFULLY UPDATED
                </Text>
              
            </View>
            <TouchableOpacity onPress={() => this.setState({ showAlert: false })}>
              <AntDesign name={'close'} color={'gray'} size={20} />
            </TouchableOpacity>
          </Animatable.View>
          :
          null}
          {
            this.state.isLoading?
            <View style={{alignItems: 'center', width: '100%', marginTop: '40%'}}>
            <ActivityIndicator color={'black'} size={'large'} />
          </View>
            :
<ScrollView
          style={{marginHorizontal: responsiveWidth(5)}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.imageView}>
            <View style={styles.imageContainer}>
              {/* {this.state.UserInfo.profileImage !== undefined && this.state.UserInfo.profileImage !== ""? 
              ( */}
                <Image
                   source={
                    this.state.userProfilePic && this.state.userProfilePic != ''
                      ? {uri: this.state.userProfilePic} 
                      : this.state.UserInfo.profileImage !== undefined ? 
                      {uri: this.state.UserInfo.profileImage} :
                      require('../../Assets/sneakerlog_profile.png')
                  }
                  style={{
                    height: responsiveHeight(16),
                    width: responsiveHeight(16),
                    borderRadius: responsiveHeight(16),
                   
                  }}
                />
              {/* )  */}
              {/* : (
               
                <Image
                  source={require('../../Assets/sneakerlog_profile.png')}
                  style={{
                    height: responsiveHeight(16),
                    width: responsiveHeight(16),
                    borderRadius: responsiveHeight(16),
                   
                  }}
                />
              )} */}
            </View>
          </View>

         

          <View style={styles.margin}>
            <Text style={styles.field}>NAME</Text>
            <Text style={styles.textValue}>{this.state.UserInfo.name}</Text>
          </View>
          <View style={styles.margin}>
            <Text style={styles.field}>USERNAME</Text>
            <Text style={styles.textValue}>{this.state.UserInfo.username}</Text>
          </View>
          <View style={styles.margin}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.field}>EMAIL</Text>
              <View
                style={{
                  marginLeft: responsiveWidth(2.5),
                  paddingStart: responsiveWidth(1.5),
                  paddingEnd: responsiveWidth(1.5),
                  paddingVertical: responsiveWidth(0.6),
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#362636',
                  borderRadius: responsiveHeight(0.5),
                }}>
                <Text
                  style={{
                    fontSize: responsiveFontSize(1.6),
                    fontFamily: 'Lato-thin',
                    fontWeight: 'normal',
                    color: '#FFF',
                  }}>
                  Private
                </Text>
              </View>
            </View>
            <Text style={styles.textValue}>{this.state.UserInfo.email}</Text>
          </View>
          <View style={styles.margin}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.field}>PHONE</Text>
              <View
                style={{
                  marginLeft: responsiveWidth(2.5),
                  // height: responsiveHeight(2.5),
                  // width: responsiveWidth(17),
                  paddingStart: responsiveWidth(1.5),
                  paddingEnd: responsiveWidth(1.5),
                  paddingVertical: responsiveWidth(0.6),
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#362636',
                  borderRadius: responsiveHeight(0.5),
                }}>
                <Text
                  style={{
                    fontSize: responsiveFontSize(1.6),
                    fontFamily: 'Lato-thin',
                    fontWeight: 'normal',
                    color: '#FFF',
                  }}>
                  Private
                </Text>
              </View>
            </View>

            <Text style={styles.textValue}>{this.state.UserInfo.phone}</Text>
          </View>
          <View style={{marginVertical: responsiveHeight(3)}}>
            <Text style={styles.fieldname}>GENDER</Text>
            <View
              style={[
                styles.textinputcontainer,
                {justifyContent: 'space-between'},
              ]}>
              <TouchableOpacity
                // onPress={() => this.setState({gender: 'Male'})}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  height: '100%',
                  backgroundColor:
                    this.state.UserInfo.gender == 'Male' ? '#D9173B' : null,
                }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Regular',
                    fontWeight: 'normal',
                    fontSize: responsiveFontSize(2.2),
                    color:
                      this.state.UserInfo.gender == 'Male' ? '#FFF' : '#121212',
                  }}>
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                // onPress={() => this.setState({gender: 'Female'})}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,

                  height: '100%',
                  backgroundColor:
                    this.state.UserInfo.gender == 'Female' ? '#D9173B' : null,
                }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Regular',
                    fontWeight: 'normal',
                    fontSize: responsiveFontSize(2.2),
                    color:
                      this.state.UserInfo.gender == 'Female'
                        ? '#FFF'
                        : '#121212',
                  }}>
                  Female
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                // onPress={() => this.setState({gender: 'Other'})}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  height: '100%',
                  backgroundColor:
                    this.state.UserInfo.gender !== 'Male' &&
                    this.state.UserInfo.gender !== 'Female'
                      ? '#D9173B'
                      : null,
                }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Regular',
                    fontWeight: 'normal',
                    fontSize: responsiveFontSize(2.2),
                    color:
                      this.state.UserInfo.gender !== 'Male' &&
                      this.state.UserInfo.gender !== 'Female'
                        ? '#FFF'
                        : '#121212',
                  }}>
                  Other
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.margin}>
            <Text style={styles.field}>FAVORITE SNEAKER BRANDS</Text>
            {this.state.UserInfo.BrandsList !== undefined ? (
              <FlatList
                data={this.state.UserInfo.BrandsList}
                horizontal={true}
                keyExtractor={(Item) => Item.image}
                renderItem={(item, index) => {
                  console.log(item.index);
                  return (
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          height: responsiveHeight(6),
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderBottomWidth: 1,
                          borderLeftWidth: 1,
                          borderRightWidth: 1,
                          borderTopWidth: 1,
                          borderRadius: 3,
                          borderColor: '#B6BBC8',
                          marginLeft: item.index == 0 ? 0 : responsiveWidth(5),
                          marginTop: responsiveHeight(1),
                          backgroundColor: '#FFF',
                          width: responsiveWidth(12),
                        }}>
                       
                          <Image
                            style={{
                              height: responsiveHeight(5),
                              width: responsiveWidth(7),
                              resizeMode: 'contain',
                            }}
                            source={{uri: item.item.image}}
                          />
                        
                      </View>
                    </View>
                  );
                }}
              />
            ) : (
              <Text style={styles.textValue}>No Brands Selected</Text>
            )}
          </View>
          <View style={styles.margin}>
            <Text style={styles.field}>SNEAKER SIZE</Text>
            <Text style={styles.textValue}>
              {this.state.UserInfo.Size !== undefined
                ? this.state.UserInfo.Size
                : 'No Size Selected'}
            </Text>
          </View>
          <View style={{marginVertical: responsiveHeight(5)}}>
            <TouchableOpacity
              onPress={() => {
                this.setState({isLogout: true});
              }}
              style={styles.loginContainer}>
              <Text style={styles.login}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

            

          }
        
        <Modal
          visible={this.state.modalVisibleStar2}
          transparent={true}
          overlayBackgroundColor="black"
          style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
          onTouchOutside={() => {
            this.setState({modalVisibleStar2: false});
          }}>
          <View>
            {this.state.facebook ? (
              <ModalContent style={styles.modalview1}>
                <Text
                  style={[
                    styles.favtext,
                    {
                      fontSize: responsiveFontSize(2.2),
                      alignSelf: 'center',
                      marginTop: responsiveWidth(0.5),
                      textAlign: 'center',
                    },
                  ]}>
                  SNEAKERLOG WANTS TO USE FACEBOOK.COM TO SIGN IN
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: responsiveHeight(2),
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={{
                      marginTop: 8,
                      marginBottom: 5,
                      fontSize: responsiveFontSize(2.2),
                      textAlign: 'center',
                      fontFamily: 'Lato-Regular',
                    }}>
                    This allows the app to share the information about you
                  </Text>
                </View>

                <View
                  style={{
                    borderBottomWidth: responsiveWidth(0.2),
                    borderColor: '#B6BBC8',
                    width: responsiveWidth(100),
                    marginLeft: responsiveWidth(-5),
                    marginTop: responsiveHeight(1),
                  }}></View>
                <View
                  style={{flexDirection: 'row', height: responsiveHeight(8)}}>
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
                    <Text style={styles.buttontext}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonview}
                    onPress={() => {
                      this.setState({
                        facebook: false,
                        modalVisibleStar2: false,
                      });
                    }}>
                    <Text style={styles.buttontext}>Connect</Text>
                  </TouchableOpacity>
                </View>
              </ModalContent>
            ) : (
              <ModalContent style={styles.modalview2}>
                <Text
                  style={[
                    styles.favtext,
                    {
                      fontSize: responsiveFontSize(2.2),
                      alignSelf: 'center',
                      marginTop: responsiveWidth(0.5),
                      textAlign: 'center',
                    },
                  ]}>
                  DISCONNECT ACCOUNT
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: responsiveHeight(2),
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={{
                      marginTop: 8,
                      marginBottom: 5,
                      fontSize: responsiveFontSize(2.2),
                      textAlign: 'center',
                      fontFamily: 'Lato-Regular',
                    }}>
                    Are you sure you want to disconnect your account?
                  </Text>
                </View>

                <View
                  style={{
                    borderBottomWidth: responsiveWidth(0.2),
                    borderColor: '#B6BBC8',
                    width: responsiveWidth(100),
                    marginLeft: responsiveWidth(-5),
                    marginTop: responsiveHeight(1),
                  }}></View>
                <View
                  style={{flexDirection: 'row', height: responsiveHeight(8)}}>
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
                    <Text style={styles.buttontext}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonview}
                    onPress={() => {
                      this.setState({facebook: true, modalVisibleStar2: false});
                    }}>
                    <Text style={styles.buttontext}>Disconnect</Text>
                  </TouchableOpacity>
                </View>
              </ModalContent>
            )}
          </View>
        </Modal>

        <Modal
          visible={this.state.modalVisibleStart}
          transparent={true}
          overlayBackgroundColor="black"
          style={{backgroundColor: 'rgba(0,0,0,0.5)'}}
          onTouchOutside={() => {
            this.setState({modalVisibleStart: false});
          }}>
          <View>
            {this.state.twitter ? (
              <ModalContent style={styles.modalview1}>
                <Text
                  style={[
                    styles.favtext,
                    {
                      fontSize: responsiveFontSize(2.2),
                      alignSelf: 'center',
                      marginTop: responsiveWidth(0.5),
                      textAlign: 'center',
                    },
                  ]}>
                  SNEAKERLOG WANTS TO USE TWITTER.COM TO SIGN IN
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: responsiveHeight(2),
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={{
                      marginTop: 8,
                      marginBottom: 5,
                      fontSize: responsiveFontSize(2.2),
                      textAlign: 'center',
                      fontFamily: 'Lato-Regular',
                    }}>
                    This allows the app to share the information about you
                  </Text>
                </View>

                <View
                  style={{
                    borderBottomWidth: responsiveWidth(0.2),
                    borderColor: '#B6BBC8',
                    width: responsiveWidth(100),
                    marginLeft: responsiveWidth(-5),
                    marginTop: responsiveHeight(1),
                  }}></View>
                <View
                  style={{flexDirection: 'row', height: responsiveHeight(8)}}>
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
                      this.setState({modalVisibleStart: false});
                    }}>
                    <Text style={styles.buttontext}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonview}
                    onPress={() => {
                      this.setState({twitter: false, modalVisibleStart: false});
                    }}>
                    <Text style={styles.buttontext}>Connect</Text>
                  </TouchableOpacity>
                </View>
              </ModalContent>
            ) : (
              <ModalContent style={styles.modalview2}>
                <Text
                  style={[
                    styles.favtext,
                    {
                      fontSize: responsiveFontSize(2.2),
                      alignSelf: 'center',
                      marginTop: responsiveWidth(0.5),
                      textAlign: 'center',
                    },
                  ]}>
                  DISCONNECT ACCOUNT
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: responsiveHeight(2),
                    alignSelf: 'center',
                  }}>
                  <Text
                    style={{
                      marginTop: 8,
                      marginBottom: 5,
                      fontSize: responsiveFontSize(2.2),
                      textAlign: 'center',
                      fontFamily: 'Lato-Regular',
                    }}>
                    Are you sure you want to disconnect your account?
                  </Text>
                </View>

                <View
                  style={{
                    borderBottomWidth: responsiveWidth(0.2),
                    borderColor: '#B6BBC8',
                    width: responsiveWidth(100),
                    marginLeft: responsiveWidth(-5),
                    marginTop: responsiveHeight(1),
                  }}></View>
                <View
                  style={{flexDirection: 'row', height: responsiveHeight(8)}}>
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
                      this.setState({modalVisibleStart: false});
                    }}>
                    <Text style={styles.buttontext}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buttonview}
                    onPress={() => {
                      this.setState({twitter: true, modalVisibleStart: false});
                    }}>
                    <Text style={styles.buttontext}>Disconnect</Text>
                  </TouchableOpacity>
                </View>
              </ModalContent>
            )}
          </View>
        </Modal>

        <Modal
          visible={this.state.isLogout}
          transparent={true}
          overlayBackgroundColor="rgba(0,0,0,1)"
          style={{backgroundColor: 'rgba(0,0,0,0.7)'}}
          onTouchOutside={() => {
            this.setState({isLogout: false});
          }}>
          <View>
            <ModalContent style={styles.modalview}>
              <View
                style={{
                  height: responsiveHeight(10),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Bold',
                    fontWeight: 'normal',
                    fontSize: responsiveFontSize(2),
                    alignSelf: 'center',
                  }}>
                  ARE YOU SURE YOU WANT
                </Text>
                <Text
                  style={{
                    fontFamily: 'Lato-Bold',
                    fontWeight: 'normal',
                    fontSize: responsiveFontSize(2),
                    alignSelf: 'center',
                  }}>
                  TO LOG OUT?
                </Text>
              </View>
              <View
                style={{
                  marginTop: responsiveHeight(1),
                  borderBottomWidth: responsiveWidth(0.2),
                  borderColor: '#B6BBC8',
                  width: responsiveWidth(100),
                  marginLeft: responsiveWidth(-5),
                }}></View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}>
                <TouchableOpacity
                  style={[
                    styles.buttonview,
                    ,
                    {
                      borderRightWidth: responsiveWidth(0.3),
                      borderColor: '#B6BBC8',
                      alignItems: 'center',
                    },
                  ]}
                  onPress={() => {
                    this.setState({isLogout: false});
                  }}>
                  <Text style={styles.buttontext2}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.buttonview,
                    {
                      alignItems: 'center',
                    },
                  ]}
                  onPress={async () => {
                    this.setState({isLogout: false});
                    let Token = await AsyncStorage.getItem('Token');
                    await saveData('Users', Token, {isLogin: false});
                    await AsyncStorage.removeItem('Token');
                    this.props.navigation.navigate('Login');
                  }}>
                  <Text style={styles.buttontext2}>Yes</Text>
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
  text: {
    fontFamily: 'Lato-Bold',
    fontWeight: 'normal',
    fontSize: responsiveFontSize(6.1),
    color: '#121212',
  },
  modalview: {
    width: responsiveWidth(78),
    height: responsiveHeight(22),
  },
  modalview1: {
    width: responsiveWidth(78),
    height: responsiveHeight(28),
  },
  modalview2: {
    width: responsiveWidth(78),
    height: responsiveHeight(25.6),
  },
  favtext: {
    fontFamily: 'Lato-Bold',
    fontSize: responsiveFontSize(1.8),
  },
  image: {
    height: responsiveHeight(16),
    width: responsiveHeight(16),
    borderRadius: responsiveHeight(16),
    resizeMode: 'contain',
    zIndex: 1,
  },
  imageContainer: {
    height: responsiveHeight(16),
    width: responsiveHeight(16),
    borderRadius: responsiveHeight(16),
    backgroundColor: '#E6E6E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageView: {
    height: responsiveHeight(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  profile: {
    fontFamily: 'Lato-Bold',
    fontWeight: 'bold',
    fontWeight: 'normal',
    fontSize: responsiveFontSize(2.1),
    color: '#121212',
    left:10
    
  },
  change: {
    fontFamily: 'Lato-Regular',
    // fontWeight: 'normal',
    fontSize: responsiveFontSize(2),
    color: '#F6F7FB',
  },
  edit: {
    fontFamily: 'Lato-Bold',
    fontWeight: 'normal',
    fontSize: responsiveFontSize(2.1),
    color: '#D9173B',
    left: 15,
  },
  header2: {
    height: responsiveHeight(8),
    // marginHorizontal:responsiveWidth(5),
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
  },
  private: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Lato-thin',
    fontWeight: 'normal',
    color: '#FFF',
  },
  textinputcontainer: {
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
  loginContainer: {
    height: responsiveHeight(6),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderRadius: 3,
    borderColor: '#B6BBC8',
    backgroundColor: '#FFF',
  },
  login: {
    fontFamily: 'Lato-Bold',
    fontWeight: 'normal',
    fontSize: responsiveFontSize(2.2),
    color: '#589BE9',
  },
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  privateContainer: {
    marginLeft: responsiveWidth(2.5),
    height: responsiveHeight(2.5),
    width: responsiveWidth(17),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#362636',
    borderRadius: responsiveHeight(0.5),
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
  buttontext2: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Lato-Regular',
    color: '#589BE9',
    bottom:8
  },
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
    // alignSelf: 'center',
    marginTop: responsiveWidth(7),
  },
  textValue: {
    fontFamily: 'Lato-Medium',
    fontWeight: 'normal',
    fontSize: responsiveFontSize(2.2),
    color: '#121212',
  },
  field: {
    fontFamily: 'Lato-Heavy',
    fontWeight: 'normal',
    fontSize: responsiveFontSize(1.5),
    color: '#6c6c6c',
    textTransform: 'uppercase',
  },
  margin: {marginVertical: responsiveHeight(3)},
});
