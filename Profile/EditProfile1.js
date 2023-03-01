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
  Dimensions,
  FlatList,
  AsyncStorage,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-simple-toast';
import validator from 'validator';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal, {
  ModalContent,
  ModalTitle,
  ModalButton,
  BottomModal,
} from 'react-native-modals';
import ImagePicker from 'react-native-image-picker';
import Feather from 'react-native-vector-icons/Feather';
import {saveData, getData} from '../Backend/utility';
// import firebase from 'react-native-firebase';
import firebase from '@react-native-firebase/app';
// import RNFetchBlob from 'react-native-fetch-blob';
import storage from '@react-native-firebase/storage';
import ImageResizer from 'react-native-image-resizer';

import RNFetchBlob from 'react-native-fetch-blob';
import {ActivityIndicator} from 'react-native-paper';
export default class Editprofile1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phone: '',
      username: '',
      gender: 'Female',
      modalVisible: false,
      size: 0,

      data: [
        {value: 1},
        {value: 1.5},
        {value: 2},
        {value: 2.5},
        {value: 3},
        {value: 3.5},
        {value: 4},
        {value: 4.5},
        {value: 5},
        {value: 5.5},
        {value: 6},
        {value: 7},
        {value: 7.5},
        {value: 8},
        {value: 8.5},
        {value: 9},
        {value: 9.5},
        {value: 10},
        {value: 10.5},
        {value: 11},
        {value: 11.5},
        {value: 12},
        {value: 12.5},
        {value: 13},
        {value: 13.5},
        {value: 16},
        {value: 16.5},
        {value: 17.5},
        {value: 18},
        {value: 18.5},
        {value: 19},
        {value: 19.5},
        {value: 20},
        {value: 'other'},
      ],
      sourcedata: [
      ],
      Selected: '',
      image: '',
      modalVisibleStart: false,
      UserInfo: {},
      BrandsList: [],
      name: '',
      username: '',
      email: '',
      phone: '',
      gender: '',
      showAlert: false,
      showAlert2: false,
      showAlert3: false,
      isLoading:true,
    };
  }

  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener(
      'focus',
      async () => {
        // await AsyncStorage.getItem('User', async (error, data) => {
        //   if (data) {
          this.setState({isLoading:true});
        let id = await AsyncStorage.getItem('Token');
        let UserInfo = await getData('Users', id);
        // let UserInfo = JSON.parse(data);
        UserInfo.name2 =
          UserInfo.name[0].toUpperCase() + UserInfo.name[1].toUpperCase();
        this.setState({
          UserInfo: UserInfo,
          name: UserInfo.name !== undefined ? UserInfo.name : '',
          username: UserInfo.username !== undefined ? UserInfo.username : '',
          email: UserInfo.email !== undefined ? UserInfo.email : '',
          phone: UserInfo.phone !== undefined ? UserInfo.phone : '',
          size: UserInfo.Size !== undefined ? UserInfo.Size : '0',
          BrandsList:
            UserInfo.BrandsList !== undefined ? UserInfo.BrandsList : [],
          gender: UserInfo.gender !== undefined ? UserInfo.gender : 'Other',
          image:
            UserInfo.profileImage !== undefined ? UserInfo.profileImage : null,
        });
        // }
        // });
        await AsyncStorage.getItem('updateBarand', async (error, data) => {
          if (data) {
            this.setState({showAlert: true});
            AsyncStorage.removeItem('updateBarand');
            setTimeout(() => {
              this.setState({ showAlert: false })
            }, 6000);
          }
        });
        this.setState({isLoading:false});
      },
    );
  }

  async SaveFn() {
    let Obj = {
      name: this.state.name,
      username: this.state.username,
      email: this.state.email,
      phone: this.state.phone,
      Size: this.state.size,
      gender: this.state.gender,
    };
    let id = await AsyncStorage.getItem('Token');
    await saveData('Users', id, Obj).then(async () => {
      // await AsyncStorage.setItem('updateProfile', 'updateProfile');
      // alert('Profile Updated')
      this.setState({showAlert2:true})
      setTimeout(() => {
        this.setState({ showAlert2: false })
        this.props.navigation.goBack();
      }, 6000);
      // this.props.navigation.goBack();
    });
  }

  handleChoosePhoto = () => {
    var options = {
      title: 'CHANGE PROFILE PHOTO',
      customButtons: [{name: 'fb', title: 'Remove Current Photo'}],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        this.setState({image: response.uri});
        this.ImageUpload(response);
        // this.onChange2(response, 'image');
      }
    });
  };

  async ImageUpload(response) {

    await this.setState({indicator: true});
    console.log('FileName : ', response.fileName);

    let NewName = Math.floor(100000 + Math.random() * 900000).toString();
    // console.log(NewName)
    if (response.fileName === null) {
      response.fileName = NewName;
      console.log(NewName);
    } else {
    }
    let newPath= Platform.OS === 'ios' ? response.uri : response.path;
    let contain='contain';
    let onlyScaleDown=true;
    await ImageResizer.createResizedImage(
      newPath,
      Dimensions.get('window').width / 1,
        Dimensions.get('window').height / 1,
      'JPEG',
      100,
      0,
      undefined, false, { contain, onlyScaleDown }
    ).then(async(response)=>{
      console.log('FileName : ', response.name);
      let reference = storage().ref(
        '/ProfileImages/' + response.name,
      );
      let pathToFile = response.path;
      await reference.putFile(pathToFile).then(async () => {
        console.log('Image uploaded to the bucket!');
        let url = await reference.getDownloadURL();
        console.log('File at :', url);
        let userToken = await AsyncStorage.getItem('Token');
        await saveData('Users', userToken, {profileImage: url}).then((obj) => {
          console.log(obj);
        });
        this.setState({indicator: false, showAlert3: true});
        setTimeout(() => {
          this.setState({ showAlert3: false })
        }, 6000);
        // this.setState({image: url, isloading: false});
      });
    })
    .catch((err)=>{
      console.log("error in image resizer: ",err)
    })
    
  }

  //*********************** Image Picker **********************//
  //***********************************************************//
  async onChange2(text, identifier) {
    if (identifier == 'image') {
      this.setState({
        imageB64String2: text.data,
        imageName2: text.fileName,
        imageUrl2: Platform.OS === 'ios' ? text.uri : text.path,
        imageType2: text.type,
      });
      let resizedImage = await ImageResizer.createResizedImage(
        this.state.imageUrl2,
        Dimensions.get('window').width / 1,
        Dimensions.get('window').height / 1,
        'JPEG',
        70,
      );
      await this.setState({
        imageName2: resizedImage.name,
        imageUrl2: resizedImage.uri.replace('file:', ''),
      });
      // let userId = await AsyncStorage.getItem(GlobalConst.STORAGE_KEYS.userId);
      // let docRef = await firebase.firestore().collection('Restaurant').doc(userId);
      // await uploadImage(Platform.OS === 'ios' ? text.uri : text.path, text.type, 'images/' + text.fileName,
      // text.fileName, 'images', docRef, false, 'not given', 'Restaurant', 'ImageURL')
      this.uploadImage2();
      // console.log(this.state.imageUrl2)
      // this.loader.hide()
    } else
      text.then((text) => {
        this.setState({[identifier]: text});
      });
  }

  async uploadImage2() {
    console.log('in upload image......................');
    //blob
    await this.setState({indicator: true});
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    const mime = 'image/jpeg';
    //keep reference to original value
    const originalXMLHttpRequest = window.XMLHttpRequest;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    const uploadUri = this.state.imageUrl2;
    const imageRef = storage().ref('Users/' + this.state.imageName2);

    let readingFile = await fs.readFile(uploadUri, 'base64');
    let blob = await Blob.build(readingFile, {type: `${mime};BASE64`});

    let uploadTask = imageRef.put(uploadUri, {
      contentType: mime,
      name: this.state.imageName2,
    });

    let progress = 0;
    //Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        console.log('Bytes transferred ' + snapshot.bytesTransferred);
        console.log('Total bytes ' + snapshot.totalBytes);
        // var progress = ( (snapshot.bytesTransferred / snapshot.totalBytes) * 100 );
        if (progress < 30) progress += 10;
        else if (progress >= 30) progress += 5;
        else if (progress >= 85) progress += 1;
        else if (progress >= 95) progress += 0.1;

        // _storeData(GlobalConst.STORAGE_KEYS.imageUploadProgress, progress.toString());
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING:
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        console.log('Uploading error : ', error);
        // _storeData(GlobalConst.STORAGE_KEYS.imageUploadProgress, '-1').then(() => { return 0 });
      },
      async () => {
        console.log('Uploading complete : ', uploadTask.ref);
        window.XMLHttpRequest = originalXMLHttpRequest;
        // Upload completed successfully, now we can get the download URL
        uploadTask.ref.getDownloadURL().then(async (downloadURL) => {
          console.log('File available at', downloadURL);
          let TempList = this.state.avatarSource2;
          let userToken = await AsyncStorage.getItem('Token');
          await saveData('Users', userToken, {profileImage: downloadURL}).then(
            (obj) => {
              console.log(obj);
            },
          );
          this.setState({indicator: false});
          Toast.show("Image uploaded", Toast.LONG);
          // alert('Image uploaded');
          //  this.componentDidMount();
        });
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
        <View style={styles.header}>
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
        </View>
        {/* Custom Alert3 */}
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
            <View style={{width: responsiveWidth(60)}}>
              <Text
                style={{color: 'gray', fontSize: 12, fontFamily: 'Lato-Black'}}
                ellipsizeMode={'tail'}
                numberOfLines={1}>
                IMAGE UPLOADED
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => this.setState({showAlert3: false})}>
              <AntDesign name={'close'} color={'gray'} size={20} />
            </TouchableOpacity>
          </Animatable.View>
        ) : null}
        {/* Custom Alert2 */}
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
                PROFILE UPDATED
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.goBack();
                this.setState({showAlert2: false})}}>
              <AntDesign name={'close'} color={'gray'} size={20} />
            </TouchableOpacity>
          </Animatable.View>
        ) : null}
        {/* Custom Alert */}
        {this.state.showAlert ? (
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
            <View style={{width: responsiveWidth(60)}}>
              <Text
                style={{color: 'gray', fontSize: 12, fontFamily: 'Lato-Black'}}
                ellipsizeMode={'tail'}
                numberOfLines={1}>
                BRAND LIST UPDATED
              </Text>
            </View>
            <TouchableOpacity onPress={() => this.setState({showAlert: false})}>
              <AntDesign name={'close'} color={'gray'} size={20} />
            </TouchableOpacity>
          </Animatable.View>
        ) : null}
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
              fontSize: responsiveFontSize(2.2),
              color: '#589BE9',
            }}
            onPress={() => this.props.navigation.goBack()}>
            Cancel
          </Text>
          <Text
            style={{
              fontFamily: 'Lato-Bold',
              fontWeight: 'normal',
              fontSize: responsiveFontSize(2.1),
              color: '#121212',
            }}>
            PROFILE
          </Text>
          <Text
            onPress={() => {
              if(!this.state.isLoading){
              this.SaveFn();
              }
            }}
            style={{
              fontFamily: 'Lato-Bold',
              fontWeight: 'normal',
              fontSize: responsiveFontSize(2.1),
              color: '#D9173B',
            }}>
            Update
          </Text>
        </View>
        {
          this.state.isLoading?
<View style={{alignItems: 'center', width: '100%', marginTop: '40%'}}>
            <ActivityIndicator color={'black'} size={'large'} />
          </View>
          :
        
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollIndicatorInsets={true}
          style={{marginHorizontal: responsiveWidth(5)}}>
          <TouchableOpacity
            onPress={() => this.handleChoosePhoto()}
            style={{
              height: responsiveHeight(20),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              onPress={() => this.handleChoosePhoto()}
              style={{
                height: responsiveHeight(16),
                width: responsiveHeight(16),
                borderRadius: responsiveHeight(16),
                backgroundColor: '#E6E6E6',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {this.state.image ? (
                <Image
                  source={{uri: this.state.image}}
                  style={{
                    height: responsiveHeight(16),
                    width: responsiveHeight(16),
                    borderRadius: responsiveHeight(16),
                  }}
                />
              ) : (
                // <Text
                //   style={{
                //     fontFamily: 'Lato-Bold',
                //     fontWeight: 'normal',
                //     fontSize: responsiveFontSize(6.1),
                //     color: '#121212',
                //   }}>
                //   {this.state.UserInfo.name !== undefined
                //     ? this.state.UserInfo.name2[0] +
                //       this.state.UserInfo.name2[1]
                //     : ''}
                // </Text>
                <Image
                  source={require('../../Assets/sneakerlog_profile.png')}
                  style={{
                    height: responsiveHeight(16),
                    width: responsiveHeight(16),
                    borderRadius: responsiveHeight(16),
                   
                  }}
                />
              )}
            </TouchableOpacity>
            {this.state.indicator ? (
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <ActivityIndicator size="large" color="white" />
              </View>
            ) : null}

            <Text
              onPress={() => this.handleChoosePhoto()}
              style={{
                fontFamily: 'Lato-Bold',
                fontWeight: 'normal',
                fontSize: responsiveFontSize(1.6),
                color: '#D9173B',
              }}>
              Change Profile Photo
            </Text>
          </TouchableOpacity>

          <View style={{marginTop: responsiveHeight(3)}}>
            <Text style={styles.fieldname}>MANAGE ACCOUNT</Text>
          </View>
          <View
            style={{
              marginBottom: responsiveHeight(3),
              marginTop: responsiveHeight(1),
            }}>
            <TouchableOpacity
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
                backgroundColor: '#FFF',
                flexDirection: 'row',
              }}
              onPress={() => {
                this.props.navigation.navigate('ManageAccount', {
                  UserInfo: this.state.UserInfo,
                });
              }}>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  fontWeight: 'normal',
                  fontSize: responsiveFontSize(2.2),
                  color: '#589BE9',
                }}>
                Edit
              </Text>
              <Entypo
                name={'chevron-right'}
                size={20}
                color={'#589BE9'}
                style={{left: responsiveWidth(35), top: 1}}
              />
            </TouchableOpacity>
          </View>

          <View style={{marginVertical: responsiveHeight(3)}}>
            <Text style={styles.fieldname}>NAME</Text>
            <View style={styles.textinputcontainer}>
              <TextInput
                paddingLeft={12}
                placeholder="Rachel Donaldson"
                placeholderTextColor="#121212"
                autoCapitalize="sentences"
                value={this.state.name}
                onChangeText={(text) => this.setState({name: text})}
                style={styles.textinputfield}
              />
            </View>
          </View>
          <View style={{marginVertical: responsiveHeight(3)}}>
            <Text style={styles.fieldname}>USERNAME</Text>
            <View style={styles.textinputcontainer}>
              <TextInput
                paddingLeft={12}
                editable={false}
                placeholder={this.state.username}
                placeholderTextColor="#121212"
                autoCapitalize="sentences"
                // value={this.state.username}
                // onChangeText={(text) => this.setState({name: text})}
                style={styles.textinputfield}
              />
            </View>
          </View>
          <View style={{marginVertical: responsiveHeight(3)}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.fieldname}>EMAIL</Text>
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
            <View style={styles.textinputcontainer}>
              <TextInput
                keyboardType={'email-address'}
                paddingLeft={12}
                editable={false}
                placeholder={this.state.email}
                placeholderTextColor="#121212"
                autoCapitalize="sentences"
                // value={this.state.email}
                // onChangeText={(text) => this.setState({email: text})}
                style={styles.textinputfield}
              />
            </View>
          </View>
          <View style={{marginVertical: responsiveHeight(3)}}>
            <View style={{flexDirection: 'row', marginBottom: 4}}>
              <Text style={styles.fieldname}>PHONE</Text>
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
            <Modal
              visible={this.state.modalVisibleStart}
              transparent={true}
              overlayBackgroundColor="rgba(0,0,0,1)"
              style={{backgroundColor: 'rgba(0,0,0,0.7)'}}
              onTouchOutside={() => {
                this.setState({modalVisibleStart: false});
              }}>
              <View>
                <ModalContent style={styles.modalview}>
                  <View
                    style={{
                      height: responsiveHeight(8),
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
                      ARE YOU SURE YOU WANTS TO
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
                      marginTop: responsiveHeight(4),
                      borderottomWidth: responsiveWidth(0.2),
                      borderColor: '#B6BBC8',
                      width: responsiveWidth(100),
                      marginLeft: responsiveWidth(-5),
                    }}></View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                    }}>
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
                      <Text style={styles.buttontext}>No</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.buttonview}
                      onPress={async () => {
                        this.setState({modalVisibleStart: false});
                        await AsyncStorage.removeItem('Token');
                        this.props.navigation.navigate('Auth');
                      }}>
                      <Text style={styles.buttontext}>Yes</Text>
                    </TouchableOpacity>
                  </View>
                </ModalContent>
              </View>
            </Modal>
            <View
              style={{
                height: responsiveHeight(6),
                //   justifyContent:'center',
                alignItems: 'center',
                marginTop: responsiveHeight(0.5),
                borderBottomWidth: this.state.phone.length == 11 ? 3 : 1,
                borderLeftWidth: this.state.phone.length == 11 ? 3 : 1,
                borderRightWidth: this.state.phone.length == 11 ? 3 : 1,
                borderTopWidth: this.state.phone.length == 11 ? 3 : 1,
                borderRadius: 3,
                borderColor:
                  this.state.phone.length == 11 ? '#D9173B' : '#B6BBC8',
                backgroundColor: '#FFF',
                flexDirection: 'row',
              }}>
              <View style={{width: responsiveWidth(80)}}>
                <TextInput
                  paddingLeft={12}
                  keyboardType={'phone-pad'}
                  placeholder="404-555-2311"
                  placeholderTextColor="#121212"
                  autoCapitalize="sentences"
                  value={this.state.phone}
                  onChangeText={(text) => this.setState({phone: text})}
                  style={{
                    marginHorizontal: responsiveWidth(3),
                    fontFamily: 'Lato-Bold',
                    fontWeight: 'normal',
                    fontSize: responsiveFontSize(2.2),
                    color: '#121212',
                    margin: 0,
                    padding: 0,
                  }}
                />
              </View>
              {this.state.phone.length == 11 ? (
                <Entypo
                  name="circle-with-cross"
                  size={responsiveFontSize(3)}
                  color="#D9173B"
                />
              ) : null}
            </View>
            {this.state.phone.length == 11 ? (
              <Text
                style={{
                  color: '#D9173B',
                }}>
                Phone number isn't valid
              </Text>
            ) : null}
          </View>
          <BottomModal
            animationType={'pokeman'}
            // transparent={false}
            transparent={true}
            height={responsiveHeight(90)}
            style={{borderRadius: responsiveWidth(10)}}
            visible={this.state.modalVisible}
            onTouchOutside={() => {
              this.setState({modalVisible: false});
            }}>
            <ModalContent
              style={{
                width: responsiveWidth(100),
                // flex: 1,
                height: '100%',
                borderRadius: responsiveWidth(10),
                // backgroundColor:'red'
              }}>
              <View
                style={{
                  width: responsiveWidth(86),
                  alignSelf: 'center',
                  top: responsiveHeight(-1),
                  height: responsiveHeight(5),
                  borderRadius: responsiveWidth(20),
                  flexDirection: 'row',
                  alignItems: 'center',
                  // backgroundColor:'red'
                  // justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Bold',
                    // fontWeight: 'bold',
                    fontSize: responsiveFontSize(2),
                    // marginBottom: responsiveHeight(1),
                  }}>
                  Select Sneaker Size
                </Text>
                <View style={{width: responsiveWidth(18)}} />
                <Image
                  source={require('../../Assets/Ruler.png')}
                  style={{
                    height: responsiveHeight(3),
                    width: responsiveWidth(10),
                    resizeMode: 'contain',
                    // marginBottom: responsiveHeight(1.5),
                  }}
                />

                <Text
                  onPress={() => {
                    this.setState({modalVisible: false});
                    this.props.navigation.navigate('SizeGuide', {
                      Size: this.state.size,
                    });
                  }}
                  style={{
                    fontFamily: 'Lato-Bold',
                    fontWeight: 'bold',
                    fontSize: responsiveFontSize(2),
                    // marginBottom: responsiveHeight(1),
                    color: '#D9173B',
                  }}>
                  Size Guide
                </Text>
              </View>
              <FlatList
                showsScrollIndicator={false}
                numColumns={4}
                style={{width: responsiveWidth(90), alignSelf: 'center'}}
                data={this.state.data}
                renderItem={({item}) => {
                  console.log(this.state.size == item.value);
                  return (
                    <TouchableOpacity style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        onPress={() => {
                          let UserInfo = this.state.UserInfo;
                          UserInfo.Size = item.value;
                          this.setState({
                            size: item.value,
                            UserInfo: UserInfo,
                            modalVisible: false,
                          });
                        }}
                        style={{
                          marginTop: responsiveHeight(2),
                          marginStart: responsiveWidth(4),
                          height: responsiveHeight(8),
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: responsiveWidth(17),
                          borderBottomWidth: 1,
                          borderLeftWidth: 1,
                          borderRightWidth: 1,
                          borderTopWidth: 1,
                          borderRadius: 3,
                          borderColor: '#B6BBC8',
                          backgroundColor:
                            this.state.size == item.value ? '#D9173B' : '#FFF',
                        }}>
                        <Text
                          style={{
                            color:
                              this.state.size == item.value ? 'white' : 'black',
                          }}>
                          {item.value}
                        </Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  this.setState({modalVisible: false});
                }}
                style={{
                  width: responsiveWidth(100),
                  height: responsiveHeight(5.4),
                  left: responsiveWidth(-5),
                  borderRadius: responsiveWidth(2),
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginVertical: responsiveHeight(0),
                  top: responsiveHeight(1.4),
                  borderTopWidth: 1,
                  borderTopColor: '#B6BBC8',
                }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Bold',
                    fontWeight: 'bold',
                    fontSize: responsiveFontSize(2.6),
                    color: '#589BE9',
                    top: responsiveHeight(1),
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </ModalContent>
          </BottomModal>

          <View style={{marginVertical: responsiveHeight(3)}}>
            <Text style={styles.fieldname}>GENDER</Text>
            <View
              style={[
                styles.textinputcontainer,
                {justifyContent: 'space-between'},
              ]}>
              <TouchableOpacity
                onPress={() => this.setState({gender: 'Male'})}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  height: '100%',
                  backgroundColor:
                    this.state.gender == 'Male' ? '#D9173B' : null,
                }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Regular',
                    fontWeight: 'normal',
                    fontSize: responsiveFontSize(2.2),
                    color: this.state.gender == 'Male' ? '#FFF' : '#121212',
                  }}>
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({gender: 'Female'})}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,

                  height: '100%',
                  backgroundColor:
                    this.state.gender == 'Female' ? '#D9173B' : null,
                }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Regular',
                    fontWeight: 'normal',
                    fontSize: responsiveFontSize(2.2),
                    color: this.state.gender == 'Female' ? '#FFF' : '#121212',
                  }}>
                  Female
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({gender: 'Other'})}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  height: '100%',
                  backgroundColor:
                    this.state.gender == 'Other' ? '#D9173B' : null,
                }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Regular',
                    fontWeight: 'normal',
                    fontSize: responsiveFontSize(2.2),
                    color: this.state.gender == 'Other' ? '#FFF' : '#121212',
                  }}>
                  Other
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginVertical: responsiveHeight(3)}}>
            <Text style={styles.fieldname}>FAVORITE SNEAKER BRANDS</Text>
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
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('SneakerBrands', {
                  BrandsList: this.state.BrandsList,
                })
              }
              style={{
                height: responsiveHeight(10),
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderTopWidth: 1,
                borderRadius: 3,
                borderColor: '#B6BBC8',
                marginTop: responsiveHeight(1),
                backgroundColor: '#FFF',
                width: responsiveWidth(90),
              }}>
              <Feather
                onPress={() =>
                  this.props.navigation.navigate('SneakerBrands', {
                    BrandsList: this.state.BrandsList,
                  })
                }
                name="plus-circle"
                color="#D9173B"
                size={responsiveFontSize(3.5)}
              />
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  fontWeight: 'normal',
                  fontSize: responsiveFontSize(2.2),
                  color: '#D9173B',
                  textTransform: 'capitalize',
                }}>
                Add A FAVORITE SNEAKER BRAND
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{marginVertical: responsiveHeight(3)}}>
            <Text style={styles.fieldname}>SNEAKER SIZE</Text>
            <TouchableOpacity
              onPress={() => {
                this.setState({modalVisible: true});
              }}
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
                marginTop: responsiveHeight(1),
                backgroundColor: '#FFF',
                width: responsiveWidth(45),
              }}>
              <Text
                style={{
                  fontFamily: 'Lato-Regular',
                  fontWeight: 'normal',
                  fontSize: responsiveFontSize(2),
                  color: '#121212',
                }}>
                {this.state.size ? `${this.state.size}` : 'SELECT SIZE'}
              </Text>
            </TouchableOpacity>
          </View>
          {/* <View style={{marginVertical: responsiveHeight(3)}}>
            <TouchableOpacity
              onPress={() => {
                this.SaveFn();
              }}
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
                backgroundColor: '#FFF',
              }}>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  fontWeight: 'normal',
                  fontSize: responsiveFontSize(2.2),
                  color: '#589BE9',
                }}>
                Update
              </Text>
            </TouchableOpacity>
          </View> */}
          <View style={{marginVertical: responsiveHeight(1)}}>
            <TouchableOpacity
              onPress={() => this.setState({modalVisibleStart: true})}
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
                backgroundColor: '#FFF',
              }}>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  fontWeight: 'normal',
                  fontSize: responsiveFontSize(2.2),
                  color: '#589BE9',
                }}>
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
  }
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
  modalview: {
    width: responsiveWidth(78),
    height: responsiveHeight(23),
  },
  textinputfield: {
    marginHorizontal: responsiveWidth(3),
    fontFamily: 'Lato-Medium',
    fontWeight: 'normal',
    fontSize: responsiveFontSize(2.2),
    color: '#121212',
    width:'100%'
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
  textValue: {
    fontFamily: 'Lato-Medium',
    fontWeight: 'normal',
    fontSize: responsiveFontSize(2.2),
    color: '#121212',
  },
  fieldname: {
    fontFamily: 'Lato-Heavy',
    fontWeight: 'normal',
    fontSize: responsiveFontSize(1.5),
    color: '#6c6c6c',
  },
  textinput: {
    height: responsiveHeight(6),
    width: responsiveWidth(70),
    borderColor: '#B6BBC8',
    borderWidth: 1,
    marginTop: responsiveHeight(3),
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(2),
    color: 'black',
  },
  switch: {
    //  backgroundColor:'red',
    width: responsiveWidth(10),
  },
  buttonview: {
    width: responsiveWidth(35),
    alignItems: 'center',
    justifyContent: 'center',
    //  backgroundColor:'red',
    height: responsiveHeight(9),
    //marginTop:responsiveWidth(3)
  },
  buttontext: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Lato-Regular',
    color: '#589BE9',
  },
  bottomcontainer: {
    width: responsiveWidth(90),
    alignSelf: 'center',
  },
  favtext: {
    fontFamily: 'Lato-Bold',
    fontSize: responsiveFontSize(1.8),
  },
});
