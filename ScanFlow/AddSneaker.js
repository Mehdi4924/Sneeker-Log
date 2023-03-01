import React, { Component } from 'react';
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
  Dimensions,
  AsyncStorage,
  ActivityIndicator,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Button, Switch } from 'react-native-paper';

import validator from 'validator';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import Modal, {
  ModalContent,
  ModalTitle,
  ModalButton,
  BottomModal,
} from 'react-native-modals';
import ImagePicker from 'react-native-image-picker';
import { saveData, getData } from '../Backend/utility';
// import firebase from 'react-native-firebase';
import storage from '@react-native-firebase/storage';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'react-native-fetch-blob';
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-simple-toast';
import axios from 'axios';
// import storage from '@react-native-firebase/storage';
export default class AddSneaker extends Component {

  constructor(props) {
    super(props);
    this.state = {
      country: 'uk',
      name: '',
      email: '',
      phone: '404-555-2311',
      username: '',
      gender: 'Female',
      modalVisible: false,
      size: 0,
      data: [
        { value: 1 },
        { value: 1.5 },
        { value: 2 },
        { value: 2.5 },
        { value: 3 },
        { value: 3.5 },
        { value: 4 },
        { value: 4.5 },
        { value: 5 },
        { value: 5.5 },
        { value: 6 },
        { value: 7 },
        { value: 7.5 },
        { value: 8 },
        { value: 8.5 },
        { value: 9 },
        { value: 9.5 },
        { value: 10 },
        { value: 10.5 },
        { value: 11 },
        { value: 11.5 },
        { value: 12 },
        { value: 12.5 },
        { value: 13 },
        { value: 13.5 },
        { value: 16 },
        { value: 16.5 },
        { value: 17.5 },
        { value: 18 },
        { value: 18.5 },
        { value: 19 },
        { value: 19.5 },
        { value: 20 },
        { value: 'other' },
      ],
      sourcedata: [
        {
          image: require('../../Assets/SneakerBrands/adidas.png'),
        },
        {
          image: require('../../Assets/SneakerBrands/allbirds.png'),
        },
        {
          image: require('../../Assets/SneakerBrands/and1.png'),
        },
        {
          image: require('../../Assets/SneakerBrands/asics.png'),
        },
        {},
      ],
      modal3: false,
      ColmodalVisible: false,
      Quantity: 1,
      Selected: '',
      image: '',
      image2: '',
      showAlert: false,
      Cindex: 0,
      //Sneaker Data
      title: '',
      brand: '',
      colorway: '',
      sku: '',
      retailPrice: '',
      year: '2020',
      isDataLoad: false,
      Status: '',
      TotalCol: [],
      modalVisibleStart: false,
      UserInfo: {},
      marginBottom: 10,
      userProfilePic: ''

    };
  }
 
  async NotificationFn() {
    const Ndata = {
      to: "/topics/Notifications",
      collapse_key: 'type_a',
      notification: {
          image: this.state?.image!=null?this.state?.image:'https//images.unsplash.com/photo-1603787081207-362bcef7c144?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c25lYWtlcnxlbnwwfHwwfHw%3D&w=1000&q=80',
          title: this.state.UserInfo?.username,
          body: this.state.Status.concat("     ",this.state.title)
      },
    };
    let config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'key=AAAAmTLFeks:APA91bEG7niQAoO9Z8RNu1usJNBxyNBbd_naqZWMaGQ34qWsZP8MiK76tj6st17JXcxT29thIzrFQMyRCshpBoOMhzacSfCNH_mVgWeqpHbnPjxPR6jIcVtujYj0WgtJj4axJb57VwkI',
      },
    };
    axios.post('https://fcm.googleapis.com/fcm/send', Ndata, config)
    .then(res => {
      console.log('ye aya ressss',res);
    })
    .catch(res=>{
      console.log('ye chala');
    })
  }

  uniqueID() {
    this.setState({ indicator: true });
    function chr4() {
      return Math.random().toString(16).slice(-4);
    }
    return (
      chr4() +
      chr4() +
      '-' +
      chr4() +
      '-' +
      chr4() +
      '-' +
      chr4() +
      '-' +
      chr4() +
      chr4() +
      chr4()
    );
  }
  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener(
      'focus',
      async () => {
        let Id = await AsyncStorage.getItem('Token');
        let Collections = await getData('Collections', Id);
        // console.log('ye i collection',Collections);
        // CollList.Collections[this.state.Cindex] = OldCol;
        let UserData = await getData('Users', Id);
        if (UserData.profileImage) {
          if (!UserData.profileImage.includes('firebasestorage') && !UserData.profileImage.includes('twitter')) {
            let asid = UserData.profileImage?.split('asid=').pop().split('&')[0]
            fetch(`http://graph.facebook.com/${asid}/picture?type=large&height=200&width=200`)
              .then((response) => {
                this.setState({
                  userProfilePic: response.url
                })

              })
              .catch((error) => console.error(error))
          }
        }
        // let index= this.props.navigation.getParam('CollectionIndex');
        let index = this.props.route.params.CurrentCol;
        console.log(index)
        console.log(Collections.Collections);
        await AsyncStorage.setItem('User', JSON.stringify(UserData));
        await this.setState({
          UserInfo: UserData,
          TotalCol: Collections.Collections,
          isDataLoad: true,
          Cindex: index,
        });
        // this.getAllOfCollectionFn();
      },
    );
  }
  calQuantity(item) {
    var count = 0;
    item.SneakerList.map((item) => {
      count += item.Quantity;
    })
    console.log('\n\n\n\n\n\n\n\n', count)

    return count;
  }
  SubtractQuantity() {
    this.setState({ Quantity: this.state.Quantity + 1 });
  }
  addQuantity() {
    if (this.state.Quantity > 1) {
      this.setState({ Quantity: this.state.Quantity - 1 });
    }
  }

  toggleModal = () => {
    this.componentDidMount();
    this.setState({ ColmodalVisible: !this.state.ColmodalVisible });
  };
  async getAllOfCollectionFn() {
    // let id = await AsyncStorage.getItem('Token');
    // console.log("id: ",id)
    let Id = await AsyncStorage.getItem('Token');
    let Collections = await getData('Collections', Id);
    let key = 0;
    console.log('Data load Length is :', Collections.Collections.length);
    this.setState({
      TotalCol: Collections.Collections,
      isDataLoad: true,
      // Cindex: this.props.navigation.getParam('CollectionIndex'),
      Cindex: this.props.route.params.CurrentCol,
    });
    this.forceUpdate();
  }

  async ImageUpload(response) {
    console.log('FileName : ', response.fileName);

    let NewName = Math.floor(100000 + Math.random() * 900000).toString();
    // console.log(NewName)
    if (response.fileName === null) {
      response.fileName = NewName;
      console.log(NewName);
    } else {
    }
    console.log('FileName : ', response.fileName);
    let reference = storage().ref(
      '/SneakerImages/' + response?.fileName + '.png',
    );
    let pathToFile = Platform.OS === 'ios' ? response.uri : response.path;
    await reference.putFile(pathToFile).then(async () => {
      console.log('Image uploaded to the bucket!');
      let url = await reference.getDownloadURL();
      console.log('File at :', url);
      this.setState({ image2: url, isloading: false });
    });
  }

  handleChoosePhoto = () => {
    var options = {
      title: 'CHANGE PROFILE PHOTO',
      customButtons: [{ name: 'fb', title: 'Remove Current Photo' }],
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
        this.setState({
          image: response?.uri,
          ImageObj: response,
          isloading: true,
        });
        console.log('===>>', response);
        this.ImageUpload(response);
        // this.onChange2(response, 'image')
      }
    });
  };

  async SaveFn() {
    if (this.state.image !== '' && this.state.image2 !== '') {
      let item = {
        name: this.state.title,
        Quantity: this.state.Quantity,
        brand: this.state.brand,
        id: this.state.sku,
        styleId: this.state.sku,
        year: this.state.year,
        colorway: this.state.colorway,
        Condition: this.state.gender === 'Male' ? 'New' : 'Used',
        retailPrice: this.state.retailPrice,
        Size: this.state.size,
        Status: this.state.Status,
        image: {
          original: this.state.image2,
          small: this.state.image2,
          thumbnail: this.state.image2,
        },

      };

      let Id = await AsyncStorage.getItem('Token');
      let OldCol = this.state.TotalCol[this.state.Cindex];
      if (OldCol.SneakerList) {
        // if (await this.FindinArray(item.id, OldCol.SneakerList)) {
        OldCol.SneakerList = [item, ...OldCol.SneakerList];
        this.setState({ Collection: OldCol });
        // alert(item.title + ' Added in Collection');
        // } else {
        //   alert(item.title + ' already in this Collection');
        // }
      } else {
        OldCol.SneakerList = [item];
        this.setState({ Collection: OldCol });
        // alert(item.title + ' Added in Collection');
      }
      let CollList = await getData('Collections', Id);
      CollList.Collections[this.state.Cindex] = OldCol;
      console.log(CollList);
      let UserInfo = await getData('Users', Id);
      if (!OldCol.isPrivate) {
        let Community = await getData('Community', 'Community');
        let tempObj = UserInfo;
        // item.Status="Added";
        UserInfo.timeAgo = moment().format();
        UserInfo.PostId = this.uniqueID();
        tempObj.sneakers = [item];
        Community.Feed = [tempObj].concat(Community.Feed);
        // Community.Feed.push(tempObj);
        // Community.Feed= [tempObj,...Community.Feed];
        await saveData('Community', 'Community', Community);
      }

      await saveData('Collections', Id, CollList);
      this.NotificationFn();
      this.setState({
        title: '',
        brand: '',
        id: '',
        year: this.state.year,
        colorway: '',
        retailPrice: '',
        image: '',
        Status: '',
        sku: '',

        showAlert: true,
      });
    Toast.show("Sneaker successfully added")
      this.props.navigation.navigate('AddNewCollection', {
        Collections: CollList.Collections,
        CurrentCol: this.state.Cindex,
      });
     
      // this.props.navigation.navigate('Home');
      // alert("Please select image first3")
      // let Obj = this.state.ImageObj;
      // console.log(Obj)
      // this.onChange2(Obj, 'image');
    } else {
      if (this.state.image !== '') {
        if (this.state.image2 === '') {
          Toast.show('wait image is uploading', Toast.LONG);
          // alert('wait image is uploading');
        }
      } else {
        Toast.show('Please select image first', Toast.LONG);
        // alert('Please select image first');
      }
    }
  }

  //*********************** Image Picker **********************//
  //***********************************************************//
  async onChange2(text, identifier) {
    if (identifier == 'image') {
      this.setState({
        imageB64String2: text?.data,
        imageName2: text?.fileName,
        imageUrl2: Platform.OS === 'ios' ? text?.uri : text?.path,
        imageType2: text?.type,
      });
      let resizedImage = await ImageResizer.createResizedImage(
        this.state.imageUrl2,
        Dimensions.get('window').width / 1,
        Dimensions.get('window').height / 1,
        'JPEG',
        70,
      );
      await this.setState({
        imageName2: resizedImage?.name,
        imageUrl2: resizedImage?.uri?.replace('file:', ''),
      });
      this.uploadImage2();
    } else
      text.then((text) => {
        this.setState({ [identifier]: text });
      });
  }

  async uploadImage2() {
    console.log('in upload image......................');
    //blob
    await this.setState({ indicator: true });
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    const mime = 'image/jpeg';
    //keep reference to original value
    const originalXMLHttpRequest = window.XMLHttpRequest;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    const uploadUri = this.state.imageUrl2;
    const imageRef = storage()?.ref('Users/');
    let uploadTask = imageRef?.put(uploadUri, {
      contentType: mime,
      // name: this.state.imageName2,
    });

    let progress = 0;
    //Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        // console.log('Bytes transferred ' + snapshot.bytesTransferred);
        // console.log('Total bytes ' + snapshot.totalBytes);
        // var progress = ( (snapshot.bytesTransferred / snapshot.totalBytes) * 100 );
        if (progress < 30) progress += 10;
        else if (progress >= 30) progress += 5;
        else if (progress >= 85) progress += 1;
        else if (progress >= 95) progress += 0.1;

        // _storeData(GlobalConst.STORAGE_KEYS.imageUploadProgress, progress.toString());
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED:
            // console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING:
            // console.log('Upload is running');
            break;
        }
      },
      (error) => {
        // console.log('Uploading error : ', error);
        // _storeData(GlobalConst.STORAGE_KEYS.imageUploadProgress, '-1').then(() => { return 0 });
      },
      async () => {
        console.log('Uploading complete : ', uploadTask.ref);

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
          {console.log("ye i user info",JSON.stringify(this.state.UserInfo,null,2))}
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
            <View style={{ width: responsiveWidth(62) }}>
              <Text
                style={{ color: 'gray', fontSize: 12, fontFamily: 'Lato-Black' }}
                ellipsizeMode={'tail'}
                numberOfLines={1}>
                SNEAKER ADDED SUCCESSFULLY
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.setState({ showAlert: false });
                this.props.navigation.navigate('AddNewCollection', {
                  Collections: this.state.Collections,
                  CurrentCol: this.state.Cindex,
                });
              }}>
              <AntDesign name={'close'} color={'gray'} size={20} />
            </TouchableOpacity>
          </Animatable.View>
        ) : null}
        <ScrollView
          showsVerticalScrollIndicator={false}
          scrollIndicatorInsets={true}
          ref={(scrollView) => (this.scrollView = scrollView)}
          onContentSizeChange={() =>
            this.state.marginBottom == 55
              ? this.scrollView.scrollTo({
                x: 0,
                y: responsiveHeight(100),
                animated: true,
              })
              : null
          }
        //style={{marginHorizontal: responsiveWidth(5)}}
        >
          {
            this.state.isDataLoad && (<View style={styles.cardview}>
              <TouchableOpacity
                style={{
                  width: 40,
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}>
                <Image
                  style={{
                    marginLeft: responsiveWidth(0),
                    height: responsiveWidth(7),
                    width: responsiveWidth(7),
                    marginBottom: 2,
                  }}
                  source={
                    this.state.TotalCol[this.state.Cindex].fav
                      ? require('../../Assets/Star.png')
                      : require('../../Assets/StarUnselected.png')
                  }
                />
              </TouchableOpacity>
              <Text
                style={[
                  styles.nametext,
                  {
                    textTransform: 'capitalize',
                    width: responsiveWidth(40),
                    textAlign: 'center',
                  },
                ]}>
                {this.state.TotalCol[this.state.Cindex].name}
              </Text>
              <TouchableOpacity
                style={{
                  left: 20,
                  width: 40,
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}
                onPress={() => {
                  // this.setState({CurrentCol: index});
                  this.toggleModal();
                }}>
                <Ionicons
                  name={'ios-arrow-down'}
                  size={25}
                  color={'#949494'}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
            )
          }
          <View
            style={{ width: '100%', borderTopWidth: 0.5, borderColor: '#6c6c6c' }}
          />

          <View
            style={{
              marginHorizontal: responsiveWidth(2.5),
              marginBottom: 15,
              marginTop: 15,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <View style={styles.collectioncontainer}>
              <TouchableOpacity onPress={() => this.handleChoosePhoto()}>
                <Image
                  style={{
                    height: responsiveWidth(25),
                    width: responsiveWidth(25),
                    borderRadius: responsiveWidth(5),
                    marginBottom: 2,
                  }}
                  source={
                    this.state.image !== ''
                      ? { uri: this.state.image }
                      : require('../../Assets/cam.png')
                  }
                />
                {this.state.isloading ? (
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
              </TouchableOpacity>
              <Text style={styles.collectiontext}>Add Photo</Text>
            </View>
          </View>

          {/*  */}
          <View style={{ marginHorizontal: responsiveWidth(5) }}>
            <View style={{ marginVertical: responsiveHeight(1.5) }}>
              <Text style={styles.fieldname}>SNEAKER</Text>
              <View style={styles.textinputcontainer}>
                <TextInput
                  placeholder=""
                  placeholderTextColor="#121212"
                  autoCapitalize="sentences"
                  value={this.state.title}
                  onChangeText={(text) => this.setState({ title: text })}
                  style={styles.textinputfield}
                />
              </View>
            </View>
            <View style={{ marginVertical: responsiveHeight(1.5) }}>
              <Text style={styles.fieldname}>BRAND</Text>
              <View style={styles.textinputcontainer}>
                <TextInput
                  placeholder=""
                  placeholderTextColor="#121212"
                  autoCapitalize="sentences"
                  value={this.state.brand}
                  onChangeText={(text) => this.setState({ brand: text })}
                  style={styles.textinputfield}
                />
              </View>
            </View>
            <View style={{ marginVertical: responsiveHeight(1.5) }}>
              <Text style={styles.fieldname}>PRICE</Text>
              <View style={styles.textinputcontainer}>
                <TextInput
                  keyboardType={'number-pad'}
                  placeholder=""
                  placeholderTextColor="#121212"
                  autoCapitalize="sentences"
                  value={this.state.retailPrice}
                  onChangeText={(text) => this.setState({ retailPrice: text })}
                  style={styles.textinputfield}
                />
              </View>
            </View>
            <View style={{ marginVertical: responsiveHeight(1.5) }}>
              <Text style={styles.fieldname}>SNEAKER SIZE</Text>
              <TouchableOpacity
                style={[
                  styles.textinputcontainer,
                  { justifyContent: 'space-between' },
                ]}
                onPress={() => this.setState({ modalVisible: true })}>
                <Text
                  style={{
                    left: responsiveWidth(3),
                    fontFamily: 'Lato-Medium',
                    fontWeight: 'normal',
                    fontSize: responsiveFontSize(2.2),
                    color: '#121212',
                  }}>
                  {this.state.size}
                </Text>
                <Entypo
                  name={'chevron-small-down'}
                  size={18}
                  color={'black'}
                  style={{ right: 8 }}
                />
              </TouchableOpacity>
            </View>

            <View style={{ marginVertical: responsiveHeight(1.5) }}>
              <Text style={styles.name}>CONDITION</Text>
              <View
                style={[
                  styles.textinputcontainer,
                  { justifyContent: 'space-between' },
                ]}>
                <TouchableOpacity
                  onPress={() => this.setState({ gender: 'Male' })}
                  style={{
                    justifyContent: 'center',
                    borderTopLeftRadius: 5,
                    borderBottomLeftRadius: 5,
                    alignItems: 'center',
                    flex: 1,
                    height: responsiveHeight(7),
                    backgroundColor:
                      this.state.gender == 'Male' ? '#D9173B' : null,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Lato-Bold',
                      fontWeight: 'normal',
                      fontSize: responsiveFontSize(2.2),
                      color: this.state.gender == 'Male' ? '#FFF' : '#121212',
                    }}>
                    New
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.setState({ gender: 'Female' })}
                  style={{
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5,
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1,
                    height: responsiveHeight(7),
                    backgroundColor:
                      this.state.gender == 'Female' ? '#D9173B' : null,
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Lato-Bold',
                      fontWeight: 'normal',
                      fontSize: responsiveFontSize(2.2),
                      color: this.state.gender == 'Female' ? '#FFF' : '#121212',
                    }}>
                    Used
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ marginVertical: responsiveHeight(1.5) }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.fieldname}>SKU</Text>
              </View>
              <View style={styles.textinputcontainer}>
                <TextInput
                  placeholder=""
                  placeholderTextColor="#121212"
                  autoCapitalize="sentences"
                  value={this.state.styleId}
                  onChangeText={(text) => this.setState({ styleId: text })}
                  style={styles.textinputfield}
                />
              </View>
            </View>

            <View style={{ marginVertical: responsiveHeight(1.5) }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.fieldname}>COLORWAY</Text>
              </View>
              <View style={styles.textinputcontainer}>
                <TextInput
                  placeholder=""
                  placeholderTextColor="#121212"
                  autoCapitalize="sentences"
                  value={this.state.colorway}
                  onChangeText={(text) => this.setState({ colorway: text })}
                  style={styles.textinputfield}
                />
              </View>
            </View>

            <BottomModal
              animationType={'pokeman'}
              transparent={false}
              // transparent={true}
              height={responsiveHeight(90)}
              visible={this.state.modalVisible}
              onTouchOutside={() => {
                this.setState({ modalVisible: false });
              }}>
              <ModalContent
                style={{
                  width: responsiveWidth(100),
                  flex: 1,

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
                  <View style={{ width: responsiveWidth(18) }} />
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
                      this.setState({ modalVisible: false });
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
                  style={{ width: responsiveWidth(90), alignSelf: 'center' }}
                  data={this.state.data}
                  renderItem={({ item }) => {
                    return (
                      <TouchableOpacity style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
                              size: item.value,
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
                              this.state.size == item.value
                                ? '#D9173B'
                                : '#FFF',
                          }}>
                          <Text
                            style={{
                              color:
                                this.state.size == item.value
                                  ? 'white'
                                  : 'black',
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
                    this.setState({ modalVisible: false });
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
            <BottomModal
              animationType={'pokeman'}
              transparent={false}
              // transparent={true}
              height={responsiveHeight(73)}
              visible={this.state.ColmodalVisible}
              onTouchOutside={() => {
                this.toggleModal();
              }}>
              <ModalContent
                style={{
                  width: responsiveWidth(100),
                  flex: 1,
                  borderRadius: responsiveWidth(3),
                }}>
                <View
                  style={{
                    width: responsiveWidth(100),
                    height: responsiveHeight(7),
                    borderBottomWidth: responsiveWidth(0.3),
                    borderColor: '#B6BBC8',
                    // borderRadius: responsiveWidth(2),
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: 'Lato-Bold',
                      fontWeight: 'bold',
                      fontSize: responsiveFontSize(2.6),
                      marginBottom: responsiveHeight(3),
                    }}>
                    My Collections
                  </Text>
                </View>
                {this.state.isDataLoad ? (
                  <FlatList
                    showsScrollIndicator={false}
                    data={this.state.TotalCol}
                    renderItem={({ item, index }) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            // if (item.name == 'Random Jordon Collection') {
                            this.setState({ Cindex: index });
                            this.toggleModal();
                            // }
                          }}
                          style={styles.cardview1}>
                          <Image
                            style={{
                              height: responsiveWidth(6),
                              width: responsiveWidth(6),
                              marginLeft: responsiveWidth(2),
                            }}
                            source={
                              item.fav
                                ? require('../../Assets/Star.png')
                                : require('../../Assets/StarUnselected.png')
                            }
                          />
                          <View
                            style={{
                              width: responsiveWidth(72),

                            }}>
                            {item.isPrivate ? (
                              <View style={{ marginLeft: responsiveWidth(4) }}>
                                <View style={{ flexDirection: 'row', height: responsiveHeight(3.5), alignItems: 'center', width: responsiveWidth(45) }}>
                                  <Text
                                    numberOfLines={1}
                                    style={[

                                      { fontFamily: 'Lato-Bold', color: 'black', fontSize: responsiveFontSize(1.75), top: responsiveHeight(0.05) },
                                    ]}>
                                    {item.name}
                                  </Text>
                                </View>
                                <View style={{ flexDirection: 'row', height: responsiveHeight(3), alignItems: 'center', bottom: responsiveHeight(0.4) }}>
                                  <Text style={{ fontSize: responsiveFontSize(1.5), color: 'gray', fontFamily: 'Lato-Regular' }}>
                                    {item.SneakerList !== undefined
                                      ? `${this.calQuantity(item)}`
                                      : '0' + ' '}
                                    {' Sneakers in Collection'}
                                  </Text>
                                  <View style={styles.privatecontainer2}>
                                    <Image source={require('../../Assets/pvt.png')} style={{ height: 20, width: 20, resizeMode: 'contain', marginLeft: 5, top: 1 }} />
                                  </View>

                                </View>
                              </View>
                            ) : (
                              <View style={{ marginLeft: responsiveWidth(4) }}>
                                <View style={{ flexDirection: 'row', height: responsiveHeight(3.5), alignItems: 'center', width: responsiveWidth(45) }}>
                                  <Text
                                    numberOfLines={1}
                                    style={[

                                      { fontFamily: 'Lato-Bold', color: 'black', fontSize: responsiveFontSize(1.75), top: responsiveHeight(0.05) },
                                    ]}>
                                    {item.name}
                                  </Text>
                                </View>
                                <View style={{ flexDirection: 'row', height: responsiveHeight(3), alignItems: 'center', bottom: responsiveHeight(0.4) }}>
                                  <Text style={{ fontSize: responsiveFontSize(1.5), color: 'gray', fontFamily: 'Lato-Regular' }}>
                                    {item.SneakerList !== undefined
                                      ? `${this.calQuantity(item)}`
                                      : '0' + ' '}
                                    {' Sneakers in Collection'}
                                  </Text>

                                </View>


                              </View>
                            )}
                          </View>
                          <TouchableOpacity>
                            <View style={{}}>
                              <Entypo
                                name={'chevron-right'}
                                size={responsiveFontSize(3)}
                                style={{ left: responsiveWidth(1) }}
                                color={'#949494'}
                              />
                            </View>
                          </TouchableOpacity>
                        </TouchableOpacity>
                      );
                    }}
                  />
                ) : null}
              </ModalContent>
            </BottomModal>

            <View style={{ marginVertical: responsiveHeight(1.5) }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.fieldname}>QUANTITY</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: responsiveWidth(88),
                  alignSelf: 'center',
                }}>
                <TouchableOpacity
                  style={styles.lessview}
                  onPress={() => this.addQuantity()}>
                  <Entypo name={'minus'} size={25} color={'#B6BBC8'} />
                </TouchableOpacity>
                <View
                  style={{
                    height: responsiveHeight(9),
                    width: responsiveWidth(22),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(2),
                      fontFamily: 'Lato-Bold',
                    }}>
                    {this.state.Quantity}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.moreview}
                  onPress={() => this.SubtractQuantity()}>
                  <Entypo name={'plus'} size={25} color={'#fff'} />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                marginVertical: responsiveHeight(1.5),
                marginBottom: responsiveWidth(this.state.marginBottom),
              }}>
              <View style={{ flexDirection: 'row' }}>
                <Text style={styles.fieldname}>SNEAKER STATUS</Text>
              </View>
              <DropDownPicker
                items={[
                  { label: 'Purchased', value: 'Purchased' },
                  { label: 'Sold', value: 'Sold' },
                  { label: 'Want', value: 'Want' },
                  { label: 'Holy Grail', value: 'Holy Grail' },
                  { label: 'Gift', value: 'Gift' },
                ]}
                arrowColor={'gray'}
                labelStyle={{
                  fontFamily: 'Lato-Medium',
                  fontWeight: 'normal',
                  fontSize: responsiveFontSize(2.2),
                  color: '#121212',
                }}
                placeholder={' '}
                dropDownMaxHeight={170}
                itemStyle={{
                  justifyContent: 'flex-start',
                  left: 10,
                  top: 4,
                  color: 'black',
                }}
                containerStyle={{
                  height: responsiveHeight(7),
                  borderRadius: 5,
                  width: responsiveWidth(90),
                  marginTop: responsiveHeight(1),
                }}
                style={{
                  backgroundColor: 'white',
                  top: 2,
                  borderTopLeftRadius: 5,
                  borderTopRightRadius: 5,
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                  borderColor: '#B6BBC8',
                  width: responsiveWidth(90),
                }}
                onChangeItem={(value) => {
                  console.log(value);
                  this.setState({ Status: value.value });
                }}
                onOpen={() => this.setState({ marginBottom: 55 })}
                onClose={() => {
                  this.setState({ marginBottom: 10 });
                }}
                dropDownStyle={{
                  backgroundColor: '#fff',
                  borderBottomLeftRadius: 5,
                  borderBottomRightRadius: 5,
                  borderColor: '#B6BBC8',
                  width: responsiveWidth(90),
                }}
              />
            </View>
            {/* here2 */}
          </View>
        </ScrollView>
        <View style={styles.buttoncontainer}>
          <Button
            labelStyle={{
              color: '#589BE9',
              fontFamily: 'Lato-Bold',
              fontSize: responsiveFontSize(2.1),
            }}
            uppercase={false}
            mode="text"
            onPress={() => this.setState({ modal3: true })}
            style={styles.button}>
            Cancel
          </Button>
          <View
            style={{
              borderLeftWidth: responsiveWidth(0.3),
              borderColor: '#B6BBC8',
            }}></View>
          <Button
            color={'#D9173B'}
            labelStyle={{
              color: '#fff',
              fontFamily: 'Lato-Bold',
              fontSize: responsiveFontSize(2.1),
            }}
            uppercase={false}
            mode="contained"
            onPress={() => {
              
              this.SaveFn();
              // this.NotificationFn();
              // console.log('Pressed');
            }}
            style={styles.button1}>
            Add to Collection
          </Button>
        </View>

        <Modal
          visible={this.state.modal3}
          transparent={true}
          overlayBackgroundColor="rgba(0,0,0,1)"
          style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
          onTouchOutside={() => {
            this.setState({ modal3: false });
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
                  DISCARD CHANGES
                </Text>
                <Text
                  style={{
                    fontFamily: 'Lato-Bold',
                    fontWeight: 'normal',
                    fontSize: responsiveFontSize(2),
                    alignSelf: 'center',
                    textAlign: 'center',
                    marginTop: 25,
                  }}>
                  Are you sure you want to discard your changes?
                </Text>
              </View>
              <View
                style={{
                  marginTop: responsiveHeight(1),
                  borderBottomWidth: responsiveWidth(0.2),
                  borderColor: '#B6BBC8',
                  width: responsiveWidth(100),
                  marginLeft: responsiveWidth(-5),
                  marginTop: responsiveHeight(2.5),
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
                    this.setState({ modal3: false });
                  }}>
                  <Text style={styles.buttontext}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    this.setState({ modal3: false });
                    await this.setState({
                      modal3: false,
                      title: '',
                      brand: '',
                      id: '',
                      year: this.state.year,
                      colorway: '',
                      retailPrice: '',
                    });
                    // {console.log('yeee',this.state.Cindex,this.state.Collections);}
                    // this.props.navigation.navigate('AddNewCollection', {
                    //   Collection: this.state?.Collections,
                    //   CollectionIndex: this.state?.Cindex,
                    // });
                    this.props.navigation.goBack();
                  }}
                  style={[
                    styles.buttonview,
                    {
                      alignItems: 'center',
                    },
                  ]}>
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
    width: '100%',
  },
  sneakertext: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: 'Lato-Bold',
    marginTop: responsiveWidth(7),
    marginLeft: responsiveWidth(5),
    color: '#6C6C6C',
  },
  lessview: {
    borderWidth: responsiveWidth(0.3),
    width: responsiveWidth(33.8),
    marginTop: responsiveWidth(3),
    height: responsiveHeight(6),
    borderRadius: responsiveWidth(1),
    borderColor: '#B6BBC8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreview: {
    width: responsiveWidth(33.8),
    marginTop: responsiveWidth(3),
    height: responsiveHeight(6),
    borderRadius: responsiveWidth(1),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9173B',
    right: 2,
  },
  //here
  textinputcontainer: {
    marginTop: responsiveHeight(1),
    height: responsiveHeight(7),
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
  privatecontainer: {
    height: responsiveHeight(3),
    width: responsiveWidth(17),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#362636',
    borderRadius: responsiveHeight(0.6),
    // marginBottom: responsiveWidth(2),
    marginLeft: responsiveWidth(2),
    top: 3,
  },
  collectioncontainer: {
    width: responsiveWidth(90),
    alignSelf: 'center',
    backgroundColor: '#fff',
    height: responsiveHeight(20),
    borderWidth: responsiveWidth(0.3),
    borderColor: '#B6BBC8',
    borderRadius: responsiveWidth(2),
    marginTop: responsiveWidth(3),
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldname: {
    fontFamily: 'Lato-Heavy',
    fontWeight: 'normal',
    fontSize: responsiveFontSize(1.5),
    color: '#6c6c6c',
  },
  cardview1: {
    width: responsiveWidth(88),
    height: responsiveHeight(9),
    //backgroundColor: '#fff',
    borderBottomWidth: responsiveWidth(0.3),
    borderColor: '#B6BBC8',
    borderRadius: responsiveWidth(2),
    flexDirection: 'row',
    alignItems: 'center',
    // marginRight: responsiveWidth(5),
    marginLeft: responsiveWidth(1.5),
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
  buttoncontainer: {
    flexDirection: 'row',
    borderTopWidth: responsiveWidth(0.3),
    borderColor: '#B6BBC8',
  },
  button: {
    width: responsiveWidth(50),
    height: responsiveHeight(9),
    borderRadius: responsiveWidth(0),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#Fff',
  },
  button1: {
    width: responsiveWidth(50),
    height: responsiveHeight(9),
    borderRadius: responsiveWidth(0),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9173B',
  },
  switch: {
    //  backgroundColor:'red',
    width: responsiveWidth(10),
  },
  nametext: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Lato-Regular',
    marginTop: responsiveWidth(1),
  },
  buttonview: {
    width: responsiveWidth(35),
    alignItems: 'center',
    justifyContent: 'center',
    //  backgroundColor:'red',
    height: responsiveHeight(7),
    //marginTop:responsiveWidth(3)
  },
  buttontext: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Lato-Regular',
    color: '#589BE9',
  },
  cardview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: responsiveWidth(80),
    alignSelf: 'center',
    marginVertical: responsiveWidth(5),
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
