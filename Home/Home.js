import React, {Component, useEffect} from 'react';
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
  Alert,
  BackHandler
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
import Toast from 'react-native-simple-toast';
import {ActivityIndicator} from 'react-native-paper';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {KeyboardAvoidingView} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {
  getAllOfCollection,
  connectFirebase,
  getDataOnChange,
  getData,
  saveData,
} from '../Backend/utility';
import moment from 'moment';
import {Button, Switch} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';
// import FileViewer from 'react-native-file-viewer';
// import FileOpener from 'react-native-file-opener';
import RNFetchBlob from 'react-native-fetch-blob';
import FileViewer from 'react-native-file-viewer';

const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'July',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export default class Home extends React.PureComponent {
  state = {
    tabactive: false,
    flag1: true,
    flag2: false,
    CName: '',
    data: [ ],
    data1: [
      {key: 1, date: '', image: '', brandname: ''},
      {key: 2, date: '', image: '', brandname: ''},
      {
        key: 3,
        date: '',
        image: '',
        brandname: '',
      },
      {
        key: 4,
        date: '',
        image: '',
        brandname: '',
      },
    ],
    data3: [
      {
        key: 1,
        image: '',
      },
      {
        key: 2,
        image: '',
      },
      {
        key: 3,
        image: '',
      },
      {
        key: 4,
        image: '',
      },
      {key: 5, image: ''},
      {key: 6, image: ''},
    ],
    data4: [
      {
        image: '',
      },
      {
        image: '',
      },
      {
        image: '',
      },
    ],
    newsdata: [
      {
        news: "Nike Quitly Relaeses Kobe Bryant's Newest Sneaker",
        image: '',
        time: '',
      },
      {
        news: 'Rockets Forward P.J. Tucker To Open Sneakers Store In Houston ',
        image: '',
        time: '',
      },
      {
        news: "Nike Quitly Relaeses Kobe Bryant's Newest Sneaker",
        image: '',
        time: '',
      },
    ],
    Community: [],
    favData: [],
    Events: [],
    TotalCol: [],
    Users: [],
    isSwitchOn: true,
    Releasedata: [],
    collectionIndex: 0,
    favcol: 0,
    isLoading: true,
    UserInfo: {},
    userProfilePic:''
  };
  

  async componentDidMount() {
    
    // await connectFirebase();
    //this.getNews();
    this.setState({tabactive: false});
    this.getAllOfCollectionFn();
    this.focusListener = this.props.navigation.addListener(
      'focus',
      async () => {
        this.setState({tabactive: false});
        this.getAllOfCollectionFn();
      },
    );

    getDataOnChange('SneakersReleaseDates', this.setSneakersReleaseDates);
    getDataOnChange('Events', this.setEvents);
    getDataOnChange('Users', this.setUsers);
    getDataOnChange('Community', this.setCommunity);
    this.checkPermission();
    this.createNotificationListeners();
    
  }

  async createNotificationListeners() {
    messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage.data.next === 'SheetCreated') {
        // let FetchData = JSON.parse(remoteMessage.data.data);
        let FetchData = remoteMessage.data.data;
        // console.log('FetchData : ', FetchData);
        Alert.alert(
          'File Downloaded',
          'File is Download successfully. Did you want to open file?',
          [
            {
              text: 'No',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Yes',
              onPress: () => {
                FileViewer.open(FetchData)
                  .then(() => {
                    console.log('Sucess');
                    // success
                  })
                  .catch((error) => {
                    console.log('error', error);
                    // error
                  });
              
                console.log('OK Pressed');
              },
            },
          ],
          {cancelable: false},
        );
    
      }
    });
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      if (remoteMessage.data.next !== undefined) {
        if (remoteMessage.data.next === 'EventDetail') {
          let FetchData = JSON.parse(remoteMessage.data.data);
          // console.log('FetchData : ', FetchData);
          this.props.navigation.navigate('EventDetail', {
            EventData: FetchData,
          });
        } else if (remoteMessage.data.next === 'Products') {
          this.props.navigation.navigate('Products');
        } else if (remoteMessage.data.next === 'HomeComounty') {
          this.props.navigation.navigate('HomeComounty');
        } else if (remoteMessage.data.next === 'Members') {
          await AsyncStorage.setItem('ActiveMember', '3');
          this.props.navigation.navigate('Members');
        }
      }
    });
  }

  showAlert(title, body) {
    Alert.alert(
      title,
      body,
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
      {cancelable: false},
    );
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('before fcmToken: ', fcmToken);
    // alert(fcmToken);
    if (!fcmToken) {
      fcmToken = await messaging().getToken();

      if (fcmToken) {
        console.log('after fcmToken: ', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
        const userId = await AsyncStorage.getItem('Token');
        await saveData('Users', userId, {Token: fcmToken});
        console.log('before Id: ', userId);
      }
    } else {
      const userId = await AsyncStorage.getItem('Token');
      console.log('before Id: ', userId);
      await saveData('Users', userId, {Token: fcmToken});
      // await saveData('Users', userId, { Token: fcmToken });
    }
  }

  async requestPermission() {
    messaging()
      .requestPermission()
      .then(() => {
        this.getToken();
      })
      .catch((error) => {
        console.log('permission rejected');
      });
  }
  async checkPermission() {
    messaging()
      .hasPermission()
      .then((enabled) => {
        if (enabled) {
          console.log('Permission granted');
          this.getToken();
        } else {
          console.log('Request Permission');
          this.requestPermission();
        }
      });
  }

  _onToggleSwitch = () =>
    this.setState((state) => ({isSwitchOn: !state.isSwitchOn}));

  async getAllOfCollectionFn() {
    let id = await AsyncStorage.getItem('Token');
    let UserData = await getData('Users', id);

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
    await AsyncStorage.setItem('User', JSON.stringify(UserData));
    await this.setState({UserInfo: UserData});
    let Id = await AsyncStorage.getItem('Token');
    let Collections = await getData('Collections', Id);
    let key = 0;

    if (Collections) {
      let FavList = [];
      Collections.Collections.forEach((element) => {
        // if (element.fav) {
        element.key = key;
        key++;
        if (element.fav == true) FavList.push(element);
        // }
      });
      if (FavList.length > 10) {
        let ShortList = [];
        for (let i = 0; i < 5; i++) {
          ShortList.push(FavList[i]);
        }
        this.setState({data: ShortList, TotalCol: Collections.Collections});
      } else {
        this.setState({data: FavList, TotalCol: Collections.Collections});
      }
      const newData = this.state.TotalCol.filter((item) => {
        return item.fav == true;
      });
      this.setState({
        favData: newData,
      });
      // this.setState({data: Collections.Collections});
    }
    console.log('fjfjfjfjfjfj', this.state.favData.length);
    this.forceUpdate();
  }

  setSneakersReleaseDates = (data) => {
    let NewList = data.sort(
      (a, b) =>
        new Date(a.releaseDate.toDate()) - new Date(b.releaseDate.toDate()),
    );
    if (NewList.length > 10) {
      let ShortList = [];
      for (let i = 0; i < 10; i++) {
        ShortList.push(NewList[i]);
      }
      this.setState({Releasedata: ShortList});
    } else {
      this.setState({Releasedata: NewList});
    }
    // this.setState({Releasedata: data});
  };
  calQuantity (item){
    var count = 0;
    item.SneakerList.map((item) => {
      count += item.Quantity; 
      })
      console.log('\n\n\n\n\n\n\n\n',count)

      return count;
  }
  setEvents = (data) => {
    let NewList = data.sort(
      (a, b) => new Date(a.date.toDate()) - new Date(b.date.toDate()),
    );
    if (NewList.length > 5) {
      let ShortList = [];
      for (let i = 0; i < 5; i++) {
        ShortList.push(NewList[i]);
      }
      this.setState({Events: ShortList});
    } else {
      this.setState({Events: NewList});
    }
    // this.setState({Events: data});
  };

  setUsers = async (data) => {
    let Id = await AsyncStorage.getItem('Token');
    // console.log(data);
    if(Id){

    }
    if (data.length > 10) {
      let ShortList = [];
      for (let i = 0; i < 10; i++) {
        if (
          data[i].Id !== Id &&
          (data[i].isDeActive === undefined || !data[i].isDeActive)
        ) {
          console.log('==>>aa',data[i]);
          data[i].name = data[i].name?.toUpperCase();
          ShortList.push(data[i]);
        }
      }
      this.setState({Users: ShortList, isLoading: false});
    } else {
      let ShortList = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].Id !== Id) {
          console.log('==>>aavv',data[i]);
          data[i].name = data[i].name.toUpperCase();
          ShortList.push(data[i]);
        }
        this.setState({Users: ShortList, isLoading: false});
      }
    }
    let users = []
    this.state.Users.map((item,index)=>{
      let obj =item
      if(item.profileImage){
        if(!item.profileImage.includes('firebasestorage') && !item.profileImage.includes('twitter'))
        {
          let asid = item.profileImage?.split('asid=').pop().split('&')[0]
          fetch(`http://graph.facebook.com/${asid}/picture?type=large&height=320&width=420`)
          .then((response) =>{
            obj.profileImage= response.url
          })
          .catch((error) => console.error(error))
        }
        
      }
      users.push(obj)
    })
    setTimeout(() => {
      this.setState({
        Users:users
      })
    }, 1000);
    // this.setState({Users: data});
  };

  setCommunity = async (date) => {
    await firestore()
      .collection('Community')
      .doc('Community')
      .onSnapshot(async (querySnapshot) => {
        let Id = await AsyncStorage.getItem('Token');
        let UserInfo = await getData('Users', Id);
        let MyList = [];
        await querySnapshot.data().Feed.forEach(async (element) => {
          if (!(await this.FindinArray(element.Id, UserInfo.followingdata))) {
            if (UserInfo.likeList !== undefined) {
              if (
                !(await this.FindinArray2(element.PostId, UserInfo.likeList))
              ) {
                element.sneakers[0].liked = true;
                let data = await getData('Users', element.Id);
                // followingdata.push({
                element.name = data.name;
                element.username = data.username;
                element.profileImage = data.profileImage
                  ? data.profileImage
                  : '';
                // })
                MyList.push(element);
                this.setState({
                  Community: MyList,
                  // Community: querySnapshot.data().Feed,
                  CompletelikeCount: querySnapshot.data().Feed,
                });
              } else {
                let data = await getData('Users', element.Id);
                // followingdata.push({
                element.name = data.name;
                element.username = data.username;
                element.profileImage = data.profileImage
                  ? data.profileImage
                  : '';
                MyList.push(element);
                this.setState({
                  Community: MyList,
                  // Community: querySnapshot.data().Feed,
                  CompletelikeCount: querySnapshot.data().Feed,
                });
              }
            } else {
              let data = await getData('Users', element.Id);
              // followingdata.push({
              element.name = data.name;
              element.username = data.username;
              element.profileImage = data.profileImage ? data.profileImage : '';
              MyList.push(element);
              this.setState({
                Community: MyList,
                // Community: querySnapshot.data().Feed,
                CompletelikeCount: querySnapshot.data().Feed,
              });
            }
          }
        });
      
      });
  };
  

  async FindinArray(Id, ObjList) {
    let Flag = true;
    if (Id !== undefined) {
      await ObjList.forEach(async (element) => {
        if (element.Id !== undefined && element.Id === Id) {
          Flag = false;
        }
      });
    }

    // console.log(Flag);
    return Flag;
  }
  
  async FindinArray2(Id, ObjList) {
    let Flag = true;
    if (Id !== undefined) {
      await ObjList.forEach(async (element) => {
        if (element === Id) {
          Flag = false;
        }
      });
    }

    // console.log(Flag);
    return Flag;
  }
  

  render() {
    const {isSwitchOn} = this.state;
    const {flag1, flag2} = this.state;
    const {navigation} = this.props;

    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent></StatusBar>
          {/* <Header /> */}
        {/* <View style={styles.header}>
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
            onPress={() => this.props.navigation.navigate('ProfileStack')}
            style={{
              alignSelf: 'center',
              position: 'absolute',
              left: responsiveWidth(88),
              zIndex: 1,
            }}>
            <Image
              source={
                this.state?.userProfilePic && this.state?.userProfilePic != ''
                  ? {uri: this.state?.userProfilePic} 
                  : this.state?.UserInfo?.profileImage !== undefined ? 
                  {uri: this.state?.UserInfo?.profileImage} :
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
  
        </View> */}
        {this.state.isLoading ? (
          <View style={{alignItems: 'center', width: '100%', marginTop: '40%'}}>
            <ActivityIndicator color={'black'} size={'large'} />
          </View>
        ) : (
          <ScrollView>
            {this.state.UserInfo.followingdata !== undefined &&
              this.state.UserInfo.followingdata.length > 0 && (
                <View style={styles.topTab}>
                  <TouchableOpacity
                    style={
                      this.state.tabactive
                        ? styles.topTabbtn2
                        : styles.topTabbtn
                    }
                    onPress={() => {
                      // this.setState({tabactive: false})
                      // this.props.navigation.navigate("HomeComounty");
                    }}>
                    <Text
                      style={
                        this.state.tabactive
                          ? styles.inActiveText
                          : styles.tabactiveText
                      }>
                      MY CLOSET
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={
                      this.state.tabactive
                        ? styles.topTabbtn
                        : styles.topTabbtn2
                    }
                    onPress={() => {
                      // this.setState({tabactive: true})
                      this.props.navigation.navigate('HomeComounty');
                    }}>
                    <Text
                      style={
                        this.state.tabactive
                          ? styles.tabactiveText
                          : styles.inActiveText
                      }>
                      COMMUNITY
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            {this.state.tabactive ? (
              <View style={{flex: 1}}>
                {this.state.Community.length > 0 ? (
                  <FlatList
                    data={this.state.Community}
                    renderItem={({item, index}) => (
                      <View style={[styles.flatlist1]}>
                        <View style={styles.flatlistinner1}>
                          <View style={{flexDirection: 'row'}}>
                            <Image
                              source={
                                item.profileImage !== undefined &&
                                item.profileImage !== ''
                                  ? {uri: item.profileImage}
                                  : require('../../Assets/sneakerlog_profile.png')
                              }
                              style={styles.listPic1}
                            />
                            <View style={styles.listdet}>
                              <Text style={styles.listdet2}>{item.name}</Text>
                              <Text style={styles.listdet3}>
                                {item.username}
                              </Text>
                            </View>
                          </View>
                          <Text style={styles.listtime}>
                            {moment(item.timeAgo).fromNow()}
                          </Text>
                        </View>

                        <FlatList
                          data={item.sneakers}
                          renderItem={({item, index}) => (
                            <TouchableOpacity
                              onPress={async () => {
                                let OldFeedList = this.state.CompletelikeCount;
                                let newData = [];

                                // let ge
                                let Id = await AsyncStorage.getItem('Token');
                                let UserInfo = await getData('Users', Id);
                                if (UserInfo.likeList !== undefined) {
                                  if (
                                    await this.FindinArray2(
                                      this.state.Community[index].PostId,
                                      UserInfo.likeList,
                                    )
                                  ) {
                                    await OldFeedList.forEach(
                                      async (element) => {
                                        if (
                                          element.PostId ===
                                          this.state.Community[index].PostId
                                        ) {
                                          if (
                                            element.sneakers[0].likeCount !==
                                            undefined
                                          ) {
                                            element.sneakers[0].likeCount =
                                              element.sneakers[0].likeCount + 1;
                                            if (
                                              element.sneakers[0].likeCount > 2
                                            ) {
                                              element.sneakers[0].likedBypic3 =
                                                element.sneakers[0]
                                                  .likedBypic3 === undefined ||
                                                element.sneakers[0]
                                                  .likedBypic3 === null
                                                  ? UserInfo.profileImage !==
                                                    undefined
                                                    ? UserInfo.profileImage
                                                    : 'https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Users%2Fsneakerlog_profile.png?alt=media&token=4e7c748e-ba97-40e2-84b0-724d98f9309b'
                                                  : null;
                                            } else {
                                              element.sneakers[0].likedBypic2 =
                                                element.sneakers[0]
                                                  .likedBypic2 === undefined ||
                                                element.sneakers[0]
                                                  .likedBypic2 === null
                                                  ? UserInfo.profileImage !==
                                                    undefined
                                                    ? UserInfo.profileImage
                                                    : 'https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Users%2Fsneakerlog_profile.png?alt=media&token=4e7c748e-ba97-40e2-84b0-724d98f9309b'
                                                  : null;
                                            }
                                          } else {
                                            element.sneakers[0].likeCount = 1;
                                            element.sneakers[0].likedBypic1 =
                                              element.sneakers[0]
                                                .likedBypic1 === undefined ||
                                              element.sneakers[0]
                                                .likedBypic1 === null
                                                ? UserInfo.profileImage !==
                                                  undefined
                                                  ? UserInfo.profileImage
                                                  : 'https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Users%2Fsneakerlog_profile.png?alt=media&token=4e7c748e-ba97-40e2-84b0-724d98f9309b'
                                                : null;
                                            // element.sneakers[0].likedBypic2 = element.sneakers[0].likedBypic2=== undefined ||element.sneakers[0].likedBypic2=== null ? UserInfo.profileImage!== undefined? UserInfo.profileImage:"https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Users%2Fsneakerlog_profile.png?alt=media&token=4e7c748e-ba97-40e2-84b0-724d98f9309b":null;
                                            // element.sneakers[0].likedBypic3 = element.sneakers[0].likedBypic3=== undefined ||element.sneakers[0].likedBypic3=== null ? UserInfo.profileImage!== undefined? UserInfo.profileImage:"https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Users%2Fsneakerlog_profile.png?alt=media&token=4e7c748e-ba97-40e2-84b0-724d98f9309b":null;
                                          }
                                          // newData.push(element);
                                          // counter2=counter;
                                        }
                                        // counter += 1;
                                      },
                                    );

                                    // newData = OldFeedList.filter((item)=>{
                                    //   return item.PostId === this.state.Community[index].PostId;
                                    // })
                                    let Obj = {Feed: OldFeedList};
                                    UserInfo.likeList.push(
                                      this.state.Community[index].PostId,
                                    );
                                    await saveData(
                                      'Users',
                                      UserInfo.Id,
                                      UserInfo,
                                    );
                                    await saveData(
                                      'Community',
                                      'Community',
                                      Obj,
                                    );
                                  } else {
                                  }
                                } else {
                                  await OldFeedList.forEach(async (element) => {
                                    if (
                                      element.PostId ===
                                      this.state.Community[index].PostId
                                    ) {
                                      if (
                                        element.sneakers[0].likeCount !==
                                        undefined
                                      ) {
                                        element.sneakers[0].likeCount =
                                          element.sneakers[0].likeCount + 1;

                                        // element.sneakers[0].likedBypic1 = element.sneakers[0].likedBypic1=== undefined ||element.sneakers[0].likedBypic1=== null ? UserInfo.profileImage!== undefined? UserInfo.profileImage:"https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Users%2Fsneakerlog_profile.png?alt=media&token=4e7c748e-ba97-40e2-84b0-724d98f9309b":null;
                                        if (element.sneakers[0].likeCount > 2) {
                                          element.sneakers[0].likedBypic3 =
                                            element.sneakers[0].likedBypic3 ===
                                              undefined ||
                                            element.sneakers[0].likedBypic3 ===
                                              null
                                              ? UserInfo.profileImage !==
                                                undefined
                                                ? UserInfo.profileImage
                                                : 'https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Users%2Fsneakerlog_profile.png?alt=media&token=4e7c748e-ba97-40e2-84b0-724d98f9309b'
                                              : null;
                                        } else {
                                          element.sneakers[0].likedBypic2 =
                                            element.sneakers[0].likedBypic2 ===
                                              undefined ||
                                            element.sneakers[0].likedBypic2 ===
                                              null
                                              ? UserInfo.profileImage !==
                                                undefined
                                                ? UserInfo.profileImage
                                                : 'https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Users%2Fsneakerlog_profile.png?alt=media&token=4e7c748e-ba97-40e2-84b0-724d98f9309b'
                                              : null;
                                        }
                                      } else {
                                        element.sneakers[0].likeCount = 1;
                                        element.sneakers[0].likedBypic1 =
                                          element.sneakers[0].likedBypic1 ===
                                            undefined ||
                                          element.sneakers[0].likedBypic1 ===
                                            null
                                            ? UserInfo.profileImage !==
                                              undefined
                                              ? UserInfo.profileImage
                                              : 'https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Users%2Fsneakerlog_profile.png?alt=media&token=4e7c748e-ba97-40e2-84b0-724d98f9309b'
                                            : null;
                                      
                                      }
                                     
                                    }
                                  });
                                  let Obj = {Feed: OldFeedList};
                                  UserInfo.likeList = [];
                                  UserInfo.likeList.push(
                                    this.state.Community[index].PostId,
                                  );
                                  await saveData(
                                    'Users',
                                    UserInfo.Id,
                                    UserInfo,
                                  );
                                  await saveData('Community', 'Community', Obj);
                                }
                              }}
                              style={[styles.list2main]}>
                              <View style={styles.inner1}>
                                <View style={{flexDirection: 'row'}}>
                                  <Image
                                    source={{uri: item.media.thumbUrl}}
                                    style={styles.productpic}
                                  />
                                  <View style={styles.productDet}>
                                    <Text
                                      numberOfLines={1}
                                      maxLength={25}
                                      style={styles.pname}>
                                      {item.title.length > 25
                                        ? item.title.substr(0, 25) + '...'
                                        : item.title}
                                    </Text>
                                    <Text style={styles.pcolor}>
                                      {item.colorway}
                                    </Text>
                                    <Text style={styles.psize}>
                                      Size {item.Size}
                                    </Text>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        marginTop: 5,
                                      }}>
                                      {item.liked ? (
                                        <AntDesign
                                          name={'heart'}
                                          size={20}
                                          color={'red'}
                                          style={{marginRight: 5}}
                                        />
                                      ) : (
                                        <AntDesign
                                          name={'hearto'}
                                          size={20}
                                          color={'#cecbd5'}
                                          style={{marginRight: 5}}
                                        />
                                      )}
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          alignSelf: 'center',
                                        }}>
                                        <Image
                                          source={{uri: item.likedBypic1}}
                                          style={styles.like1}
                                        />
                                        <Image
                                          source={{uri: item.likedBypic2}}
                                          style={styles.like2}
                                        />
                                        <Image
                                          source={{uri: item.likedBypic3}}
                                          style={styles.like3}
                                        />
                                      </View>
                                      <Text style={styles.likecount}>
                                        {item.likeCount !== undefined
                                          ? 'Liked by ' +
                                            item.likeCount +
                                            ' others'
                                          : ''}
                                      </Text>
                                    </View>
                                  </View>
                                </View>
                                <View style={styles.action}>
                                  <Text style={styles.pAction}>
                                    {item.Status}
                                  </Text>
                                </View>
                              </View>
                            </TouchableOpacity>
                          )}
                        />
                      </View>
                    )}
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={[
                        styles.favtext,
                        {color: 'gray', marginTop: '50%', fontSize: 20},
                      ]}>
                      No Feed
                    </Text>
                  </View>
                )}
              </View>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <View
                  style={{
                    marginLeft: responsiveWidth(2.05),
                    flexDirection: 'row',
                    marginTop: responsiveWidth(5),
                    justifyContent: 'space-between',
                    width: responsiveWidth(90),
                    alignSelf: 'center',
                  }}>
                  <Text style={styles.favtext}>MY FAVORITE COLLECTIONS</Text>
                  {this.state.data.length > 0 ? (
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('Collection')
                      }>
                      <Text style={[styles.viewtext, {right: 10}]}>
                        View All
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
                <View>
                  {this.state.data.length > 0 ? (
                    <FlatList
                      showsHorizontalScrollIndicator={false}
                      horizontal={true}
                      data={this.state.favData}
                      keyExtractor={(item) => item.name}
                      renderItem={({item, index}) => {
                        return (
                          <>
                            {item.fav ? (
                              <TouchableOpacity
                              
                                onPress={async () => {
                                  let sendIndex='';
                                  this.state.TotalCol.map((d,i)=>{
                                    if(d.name == item.name){
                                      sendIndex = i
                                    }
                                  })
                                  if (
                                    item.SneakerList !== undefined &&
                                    item.SneakerList.length > 0
                                  ) {

                                    this.props.navigation.navigate(
                                      'DetailsHome',
                                      {
                                        Collections: this.state.TotalCol,
                                        CurrentCol: sendIndex,
                                      },
                                    );
                                  } else {
                                    this.props.navigation.navigate(
                                      'AddNewCollection',
                                      {
                                        Collection: this.state.TotalCol,
                                        CollectionIndex: index,
                                      },
                                    );
                                  }
                                  // this.props.navigation.navigate('DetailsHome', {
                                  //   Collections: this.state.TotalCol,
                                  //   CurrentCol: index,
                                  // });
                                }}
                                style={{
                                  marginLeft: responsiveWidth(5),
                                  marginBottom: 1,
                                  marginRight:
                                    index + 1 === this.state.favData.length
                                      ? responsiveWidth(5)
                                      : 0,
                                }}>
                                {/* {console.log(
                                  'ujujujujujujujujuj->>>>>>>>',
                                  this.state.favData.length,
                                  index + 1,
                                )} */}

                                <View
                                  style={[
                                    styles.cardview1,
                                    {
                                      width:
                                        this.state.favData.length == 1
                                          ? responsiveWidth(90)
                                          : null,
                                    },
                                  ]}>
                                  {/* <AntDesign name={'star'} size={22} color={'#F5A623'} style={styles.icon} /> */}
                                  <Image
                                    style={[
                                      styles.icon,
                                      {
                                        marginHorizontal:
                                          this.state.favData.length == 1
                                            ? responsiveWidth(2)
                                            : responsiveWidth(4),
                                      },
                                    ]}
                                    source={require('../../Assets/Star.png')}
                                  />
                                  <View
                                    style={{
                                      right:
                                        this.state.favData.length == 1
                                          ? responsiveWidth(4)
                                          : 0,
                                    }}>
                                   
                                    {item.isPrivate ? (
                                    
                                      <View
                                        style={{
                                          marginLeft: responsiveWidth(2),

                                        }}>
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                            height: responsiveHeight(3.2),
                                            alignItems: 'center',
                                            width:responsiveWidth(45)
                                          }}>
                                          <Text
                                            style={[
                                              {
                                                fontFamily: 'Lato-Bold',
                                                color: 'black',
                                                fontSize: responsiveFontSize(
                                                  1.75,
                                                ),
                                                top:responsiveHeight(0.05)

                                              },
                                            ]}
                                            numberOfLines={1}
                                            >
                                            {item.name}
                                          </Text>
                                        </View>
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                            height: responsiveHeight(3.2),
                                            alignItems: 'center',
                                            bottom:responsiveHeight(0.4)
                                          }}>
                                          <Text
                                            style={{
                                              fontSize: responsiveFontSize(1.5),
                                              color: 'gray',
                                              fontFamily: 'Lato-Regular',

                                            }}>
                                            {item.SneakerList !== undefined
                                              ? `${this.calQuantity(item)}`
                                              : '0' + ' '}
                                            {' Sneakers in Collection'}
                                          </Text>
                                          <View
                                            style={[styles.privatecontainer2,{
                                            }]}>
                                            <Image
                                              source={require('../../Assets/pvt.png')}
                                              style={{
                                                height: 20,
                                                width: 20,
                                                resizeMode: 'contain',
                                                marginLeft: 5,
                                                top: 2,
                                              }}
                                            />
                                          </View>
                                        </View>
                                      </View>
                                    ) : (
                                      <View
                                        style={{
                                          marginLeft: responsiveWidth(2),
                                        }}>
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                            height: responsiveHeight(3.5),
                                            alignItems: 'center',
                                            width:responsiveWidth(45)

                                          }}>
                                          <Text
                                            style={[
                                              {
                                                fontFamily: 'Lato-Bold',
                                                color: 'black',
                                                fontSize: responsiveFontSize(
                                                  1.75,
                                                ),
                                                top:responsiveHeight(0.05)
                                              },
                                            ]}
                                            numberOfLines={1}
                                            >
                                            {item.name}
                                          </Text>
                                        </View>
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                            height: responsiveHeight(3.2),
                                            alignItems: 'center',
                                            bottom:responsiveHeight(0.4)

                                          }}>
                                          <Text
                                            style={{
                                              fontSize: responsiveFontSize(1.5),
                                              color: 'gray',
                                              fontFamily: 'Lato-Regular',

                                            }}>
                                            {item.SneakerList !== undefined
                                              ? `${this.calQuantity(item)}`
                                              : '0' + ' '}
                                            {' Sneakers in Collection'}
                                          </Text>
                                          <View
                                            style={[
                                              styles.privatecontainer2,{  
                                              }]
                                            }></View>
                                        </View>
                                      </View>
                                    )}
                                  </View>
                                  <Entypo
                                  
                                    style={{
                                      right:
                                        this.state.favData.length == 1
                                          ? -responsiveWidth(0.5)
                                          : responsiveWidth(2.2),
                                    }}
                                    name="chevron-right"
                                    size={responsiveFontSize(3)}
                                    color="#949494"
                                  />
                                </View>
                              </TouchableOpacity>
                            ) : null}
                          </>
                        );
                      }}
                    />
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({modalVisibleStart: true});
                      }}
                      style={{
                        // marginLeft: responsiveWidth(2.5),
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <View style={styles.collectioncontainer}>
                        <View>
                          <AntDesign
                            name={'pluscircleo'}
                            size={25}
                            color={'#D9173B'}
                          />
                        </View>
                        <Text
                          style={{
                            fontFamily: 'Lato-Bold',
                            fontWeight: 'normal',
                            fontSize: responsiveFontSize(2),
                            color: '#D9173B',
                            marginTop: responsiveHeight(0.5),
                          }}>
                          ADD A COLLECTION
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>

                <View
                  style={{
                    width: responsiveWidth(90),
                    marginLeft: responsiveWidth(2.05),
                    alignSelf: 'center',
                    flexDirection: 'row',
                    marginTop: responsiveHeight(5),
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.favtext}>RELEASE DATES</Text>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Products')}>
                    <Text style={[styles.viewtext, {right: 10}]}>View All</Text>
                  </TouchableOpacity>
                </View>
                <View>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    data={this.state.Releasedata}
                    keyExtractor={(item) => item.name}
                    renderItem={({item, index}) => {
                      const releaseDate = item.releaseDate.toDate();
                      return (
                        <View
                          style={{
                            marginLeft: responsiveWidth(5),
                            marginBottom: 2,
                            marginRight:
                              index + 1 == this.state.Releasedata.length
                                ? responsiveWidth(5)
                                : 0,
                          }}>
                          <View style={[styles.cardview2]}>
                            <View style={{flexDirection: 'row'}}>
                              <View
                                style={{
                                  alignItems: 'center',
                                  marginLeft: 4,
                                  marginTop: 3,
                                }}>
                                <Text
                                  style={[
                                    styles.datetext,
                                    {fontFamily: 'D-DINCondensed-Bold'},
                                  ]}>
                                  {monthNames[releaseDate.getMonth()]}
                                </Text>
                                <Text
                                  style={[
                                    styles.datetext,
                                    {
                                      color: '#D9173B',
                                      bottom: 3,
                                      fontFamily: 'D-DINCondensed-Bold',
                                    },
                                  ]}>
                                  {releaseDate.getDate()}
                                </Text>
                              </View>
                              <Image
                                resizeMode="contain"
                                source={{uri: item.image}}
                                style={styles.productimage}
                              />
                            </View>
                            <View
                              style={{
                                borderTopWidth: responsiveWidth(0.2),
                                borderColor: '#B6BBC8',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={[
                                  styles.text,
                                  {
                                    alignSelf: 'center',
                                    top: responsiveHeight(1.25),
                                  },
                                ]}>
                                {item.name}
                              </Text>
                              {/* <Text style={styles.text}>"Cinder"</Text> */}
                            </View>
                          </View>
                        </View>
                      );
                    }}
                  />
                </View>
                <View
                  style={{
                    width: responsiveWidth(90),
                    marginLeft: responsiveWidth(2.05),
                    alignSelf: 'center',
                    flexDirection: 'row',
                    marginTop: responsiveHeight(5),
                    justifyContent: 'space-between',
                  }}>
                  <Text style={styles.favtext}>MEMBERS</Text>
                  <TouchableOpacity
                    onPress={async () => {
                      await AsyncStorage.setItem('ActiveMember', '0');
                      this.props.navigation.navigate('Members');
                    }}>
                    <Text style={[styles.viewtext, {right: 10}]}>View All</Text>
                  </TouchableOpacity>
                </View>
                {console.log('ye ay user',this.state.Users)}
                <View>
                  <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    keyExtractor={(item, index) => item.Id}
                    // data={this.state.Users}
                    data={this.state.Users.filter(item=>item?.name!=this.state.Users?.name )}
                    renderItem={({item, index}) => {                      
                      return (
                        <View
                          style={{
                            marginLeft:
                              index === 0
                                ? responsiveWidth(5)
                                : responsiveWidth(3),
                            marginRight:
                              index + 1 === this.state.Users.length
                                ? responsiveWidth(5)
                                : 0,
                          }}>
                          <TouchableOpacity
                            style={{
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                            onPress={() =>
                              navigation.navigate('UserDetails', {User: item})
                            }>
                            {item.profileImage !== undefined &&
                            item.profileImage !== '' ? (
                              <Image
                                source={
                                  item.profileImage !== undefined &&
                                  item.profileImage !== ''
                                    ? {uri: item.profileImage}
                                    : require('../../Assets/sneakerlog_profile.png')
                                }
                                style={styles.memberimage}
                              />
                            ) : (
                              <Image
                                source={
                                  item.profileImage !== undefined &&
                                  item.profileImage !== ''
                                    ? {uri: item.profileImage}
                                    : require('../../Assets/sneakerlog_profile.png')
                                }
                                style={styles.memberimage}
                              />
                            )}
                            <Text
                              numberOfLines={1}
                              style={[
                                styles.text,
                                {
                                  marginTop: 12,
                                  width: responsiveWidth(25),
                                  fontSize: responsiveFontSize(1.5),
                                  fontWeight: 'bold',
                                  fontFamily: 'Lato-Regular',
                                  marginHorizontal: 2.5,
                                  textAlign: 'center',
                                },
                              ]}>
                              {item.username}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      );
                    }}
                  />
                </View>
                <View
                  style={{
                    marginLeft: responsiveWidth(5),
                    flexDirection: 'row',
                    marginTop: responsiveHeight(5),
                    justifyContent: 'space-between',
                  }}>
                  <View style={{marginLeft: 5}}>
                    <TouchableOpacity style={styles.bar1}>
                      <Text style={styles.favtext}>UPCOMING EVENTS</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {/* {console.log('ye ay evevnts',this.state.Events)} */}
                <View
                  style={{
                    marginLeft: responsiveWidth(5),
                    marginBottom: responsiveWidth(5),
                  }}>
                  <FlatList
                    showsScrollIndicator="false"
                    data={this.state.Events}
                    renderItem={({item}) => {
                      return (
                        <TouchableOpacity
                          style={{width: responsiveWidth(90)}}
                          onPress={() =>{
                            // console.log("Call",item)
                            this.props.navigation.navigate('EventDetail', {
                              EventData: item,
                            })
                          }}>
                          <Image
                            source={{uri: item.image}}
                            style={styles.eventimage}
                          />
                        </TouchableOpacity>
                      );
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Events',{EventData:this.state.Events})}>
                    <Text
                      style={[
                        styles.viewtext,
                        {alignSelf: 'center', marginTop: responsiveWidth(5)},
                      ]}>
                      View All
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </ScrollView>
        )}
        <Modal
          visible={this.state.modalVisibleStart}
          transparent={true}
          style={{backgroundColor: 'rgba(0,0,0,.7)'}}
          onTouchOutside={() => {
            this.setState({modalVisibleStart: false});
          }}>
          <View>
            <ModalContent style={[styles.modalview,{
              height: this.state.ShowEmpityNameerror || this.state.ShowSameNameerror ? responsiveHeight(33):  responsiveHeight(30.3),
            }]}>
              <Text
                style={[
                  styles.favtext,
                  {
                    fontWeight: '900',
                    fontSize: responsiveFontSize(2.2),
                    alignSelf: 'center',
                    marginTop: responsiveWidth(-2),
                  },
                ]}>
                NEW COLLECTION NAME
              </Text>
              <TextInput
                paddingLeft={12}
                style={styles.textinput}
                value={this.state.CName}
                onChangeText={(text) => {
                  this.setState({
                    CName: text,
                    ShowSameNameerror: false,
                    ShowEmpityNameerror: false,
                  });
                }}
              />
              {this.state.ShowEmpityNameerror ? (
                <Text
                  style={{
                    marginVertical: 3,
                    color: 'red',
                    marginLeft: 12,
                    fontSize: 10,
                  }}>
                  COLLECTION NAME SHOULD NOT BE EMPTY
                </Text>
              ) : this.state.ShowSameNameerror ? (
                <Text
                  style={{
                    marginVertical: 3,
                    color: 'red',
                    marginLeft: 12,
                    fontSize: 10,
                  }}>
                  This name is already being used
                </Text>
              ) : null}

              <View
                style={{
                  flexDirection: 'row',
                  marginVertical: responsiveWidth(3),
                  marginTop: responsiveHeight(2),
                }}>
                <Text style={styles.privatetext}>PRIVATE</Text>
                <Switch
                  style={styles.switch}
                  value={this.state.isSwitchOn}
                  onValueChange={this._onToggleSwitch}
                  color={'#08CF6E'}
                  theme={{
                    colors: {},
                  }}
                />
              </View>
              <View
                style={{
                  borderBottomWidth: responsiveWidth(0.2),
                  borderColor: '#B6BBC8',
                  width: responsiveWidth(100),
                  marginLeft: responsiveWidth(-5),
                  marginTop: responsiveHeight(0.5),
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
                    this.setState({modalVisibleStart: false});
                  }}>
                  <Text style={styles.buttontext}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonview}
                  onPress={async () => {
                    if (this.state.CName === '') {
                      this.setState({ShowEmpityNameerror: true});
                      return 0;
                    }
                    let isPeresent = false;
                    let List = this.state.TotalCol;
                    await List.forEach((element) => {
                      if (element.name === this.state.CName) {
                        isPeresent = true;
                      }
                    });
                    if (isPeresent) {
                      this.setState({ShowSameNameerror: true});
                      return 0;
                    }
                    let Id = await AsyncStorage.getItem('Token');
                    let Collection = await getData('Collections', Id);
                    if (Collection) {
                      if (Collection.Collections !== undefined) {
                        Collection.Collections = [
                          ...Collection.Collections,
                          {
                            name: this.state.CName,
                            NoOfSneakers: 0,
                            isPrivate: isSwitchOn,
                            fav: false,
                          },
                        ];
                        await saveData('Collections', Id, Collection);
                      } else {
                        Collection.Collections = [
                          {
                            name: this.state.CName,
                            isPrivate: isSwitchOn,
                            NoOfSneakers: 0,
                            fav: false,
                          },
                        ];
                        await saveData('Collections', Id, Collection);
                      }
                    } else {
                      let Collection = {
                        Collections: [
                          {
                            NoOfSneakers: 0,
                            name: this.state.CName,
                            isPrivate: isSwitchOn,
                            fav: false,
                          },
                        ],
                      };
                      await saveData('Collections', Id, Collection);
                    }

                    this.props.navigation.navigate('AddNewCollection', {
                      Collections: [
                        ...this.state.TotalCol,
                        {
                          name: this.state.CName,
                          isPrivate: isSwitchOn,
                          NoOfSneakers: 0,
                          fav: false,
                        },
                      ],
                      CurrentCol: this.state.TotalCol.length,
                    });
                    this.setState({CName: '', isSwitchOn: true});
                    this.setState({modalVisibleStart: false});
                  }}>
                  <Text style={styles.buttontext}>Create</Text>
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
  buttontext: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Lato-Regular',
    color: '#589BE9',
  },
  collectioncontainer: {
    width: responsiveWidth(88),
    alignSelf: 'center',
    backgroundColor: '#fff',
    height: responsiveHeight(11),
    borderWidth: responsiveWidth(0.3),
    borderColor: '#B6BBC8',
    borderRadius: responsiveWidth(2),
    marginTop: responsiveWidth(3),
    alignItems: 'center',
    justifyContent: 'center',
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
    alignSelf: 'center',
    marginTop: responsiveWidth(7),
  },
  privatecontainer: {
    height: responsiveHeight(3),
    width: responsiveWidth(17),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#362636',
    borderRadius: responsiveHeight(0.6),
    marginBottom: responsiveWidth(1),
    marginLeft: responsiveWidth(2),
    bottom: 1,
  },
  privatecontainer2: {
    height: responsiveHeight(3),
    width: responsiveWidth(17),
    justifyContent: 'center',

    // backgroundColor: 'transparent',
    // borderRadius: responsiveHeight(0.6),
    // marginBottom: responsiveWidth(1),
    // marginLeft: responsiveWidth(2),
  },

  profileimage: {
    height: responsiveHeight(4),
    width: responsiveHeight(4),
    borderRadius: responsiveWidth(6),
    //marginLeft: responsiveWidth(20),
    marginTop: responsiveWidth(7),
  },
  bottomcontainer: {
    // width: responsiveWidth(90),
    alignSelf: 'center',
    marginLeft: responsiveWidth(5),
  },
  imageContainer: {
    height: responsiveHeight(12),
    width: responsiveHeight(12),
    borderRadius: responsiveHeight(16),
    marginTop: responsiveWidth(2),
    backgroundColor: '#E6E6E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favtext: {
    fontFamily: 'Lato-Bold',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
  },
  viewtext: {
    fontFamily: 'Lato-Bold',
    fontSize: responsiveFontSize(1.8),
    color: '#D9173B',
    // marginRight: responsiveWidth(5)
  },
  cardview1: {
    width: responsiveWidth(75),
    height: responsiveHeight(9.5),
    backgroundColor: '#fff',
    borderWidth: responsiveWidth(0.2),
    borderColor: '#B6BBC8',
    borderRadius: responsiveWidth(2),
    marginTop: responsiveWidth(3),
    // elevation:1,
    // marginHorizontal: responsiveWidth(1),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    // marginRight: responsiveWidth(5)
  },
  buttonview: {
    width: responsiveWidth(35),
    alignItems: 'center',
    justifyContent: 'center',
    //  backgroundColor:'red',
    height: '100%',
    //marginTop:responsiveWidth(3)
  },
  switch: {
    //  backgroundColor:'red',
    width: responsiveWidth(10),
  },
  privatetext: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Lato-Bold',
    marginRight: responsiveWidth(4),
    marginTop: responsiveWidth(1),
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
  modalview: {
    width: responsiveWidth(78),
    height: responsiveHeight(30.3),
  },
  favtext: {
    fontFamily: 'Lato-Bold',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
  },
  icon: {
    // marginLeft: responsiveWidth(3),
    height: responsiveWidth(7),
    width: responsiveWidth(7),
    resizeMode: 'contain',
    // marginHorizontal:responsiveWidth(4)
    // marginLeft: responsiveWidth(-2),
    //marginTop:responsiveWidth(2)
  },
  nametext: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Lato-Bold',
    width: responsiveWidth(50),
    // backgroundColor:'red'
  },
  nametext122: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: 'Lato-Regular',
    width: responsiveWidth(50),
    color: '#999999',
    left: 4,
    marginBottom: responsiveHeight(3),
    // backgroundColor:'red'
  },
  nametext1: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Lato-Regular',
    color: '#999999',
    left: 4,
    // backgroundColor:'red'
  },
  nametext5: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Lato-Regular',
    // width: responsiveWidth(33),
    color: '#999999',
    left: 4,
    // backgroundColor:'red'
  },
  cardview2: {
    height: responsiveHeight(15),
    width: responsiveWidth(40),
    backgroundColor: '#fff',
    borderWidth: responsiveWidth(0.2),
    borderColor: '#B6BBC8',
    borderRadius: responsiveWidth(2),
    marginTop: responsiveWidth(3),
    // marginHorizontal: responsiveWidth(2),
    // flexDirection: 'row',
    // marginRight: responsiveWidth(5)
  },
  datetext: {
    // width: responsiveWidth(7),
    // backgroundColor: 'red',
    // height: responsiveHeight(6),
    marginLeft: responsiveWidth(2),
    fontSize: responsiveFontSize(2),
    fontFamily: 'Lato-Bold',
  },
  productimage: {
    height: responsiveHeight(10),
    width: responsiveWidth(25),
    alignSelf: 'center',

    // marginTop:responsiveWidth(2),
    // marginLeft:responsiveWidth(-2)
  },
  text: {
    fontSize: responsiveFontSize(1.2),
    fontFamily: 'Lato-Bold',
    textAlignVertical: 'center',
  },
  memberimage: {
    height: responsiveHeight(12),
    width: responsiveHeight(12),
    borderRadius: responsiveHeight(10),
    marginTop: responsiveWidth(3),
    // marginRight: responsiveWidth(3),
    //marginHorizontal: responsiveWidth(1),
  },
  eventimage: {
    height: responsiveHeight(20),
    width: responsiveWidth(90),
    borderRadius: responsiveHeight(2),
    marginTop: responsiveWidth(3),
    alignSelf: 'center',
  },
  barbottom: {
    backgroundColor: 'red',
    height: responsiveHeight(0.5),
    width: responsiveWidth(15),
    borderRadius: responsiveWidth(2),
    marginLeft: responsiveWidth(-0.5),
  },
  barbottom1: {
    backgroundColor: 'red',
    height: responsiveHeight(0.5),
    width: responsiveWidth(12),
    borderRadius: responsiveWidth(2),
    marginLeft: responsiveWidth(1),
  },
  bar: {
    // height:responsiveHeight(5),

    alignItems: 'center',
    // justifyContent: 'center',
    marginRight: responsiveWidth(6),
  },
  bar1: {
    // height:responsiveHeight(5),
    alignItems: 'center',
    // justifyContent: 'center',
    marginRight: responsiveWidth(6),
  },
  newscontainer: {
    width: responsiveWidth(90),
    alignSelf: 'center',
    height: responsiveHeight(15),
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(3),
    borderWidth: responsiveWidth(0.3),
    marginTop: responsiveWidth(5),
    borderColor: '#B6BBC8',
    flexDirection: 'row',
  },
  newsimage: {
    height: responsiveHeight(14.7),
    width: responsiveWidth(25),
    borderTopLeftRadius: responsiveWidth(2.5),
    borderBottomLeftRadius: responsiveWidth(2.5),
  },
  newstext: {
    fontFamily: 'Lato-Bold',
    fontSize: responsiveFontSize(1.7),
    fontWeight: 'bold',
    width: responsiveWidth(50),
    marginLeft: responsiveWidth(5),
    marginTop: responsiveWidth(3),
    marginBottom: responsiveWidth(1),
  },
  timetext: {
    fontFamily: 'Lato-Regular',
    fontSize: responsiveFontSize(1.4),
    marginHorizontal: responsiveWidth(5),
    color: '#878787',
  },
  topTab: {
    flexDirection: 'row',
    marginTop: responsiveHeight(2),
    height: responsiveHeight(6.5),
    width: responsiveWidth(90),
    backgroundColor: '#ebebeb',
    alignSelf: 'center',
    borderRadius: 50,
    justifyContent: 'space-evenly',
    borderColor: '#cecbd5',
    borderWidth: 0.5,
  },
  topTabbtn: {
    width: '50%',
    height: '100%',
    backgroundColor: '#D9173B',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topTabbtn2: {
    width: '50%',
    height: '100%',
    backgroundColor: '#ebebeb',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabactiveText: {
    fontFamily: 'Lato-Bold',
    fontWeight: 'bold',
    color: 'white',
    fontSize: responsiveFontSize(2),
  },
  inActiveText: {
    fontFamily: 'Lato-Bold',
    fontWeight: 'bold',
    color: '#cecbd5',
    fontSize: responsiveFontSize(2),
  },
  flatlist1: {width: responsiveWidth(90), alignSelf: 'center'},
  flatlistinner1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(2),
  },
  listPic1: {height: 37, width: 37, borderRadius: 37},
  listdet: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    marginLeft: 8,
  },
  listdet2: {
    color: 'black',
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Lato-Black',
  },
  listdet3: {
    color: 'gray',
    fontSize: responsiveFontSize(1.4),
    fontFamily: 'Lato-Regular',
  },
  listtime: {
    alignSelf: 'center',
    color: 'gray',
    fontSize: responsiveFontSize(1.4),
    fontFamily: 'Lato-Regular',
    bottom: 8,
  },
  list2main: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderColor: '#cecbd5',
    borderWidth: 1,
    marginBottom: 5,
    marginTop: responsiveHeight(1.5),
  },
  inner1: {flexDirection: 'row', justifyContent: 'space-between'},
  productpic: {height: 60, width: 60, resizeMode: 'contain'},
  productDet: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    marginLeft: 15,
  },
  pname: {
    color: 'black',
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Lato-Black',
  },
  pcolor: {
    color: 'gray',
    fontSize: responsiveFontSize(1.4),
    fontFamily: 'Lato-Regular',
  },
  psize: {
    color: 'gray',
    fontSize: responsiveFontSize(1.4),
    fontFamily: 'Lato-Regular',
  },
  pAction: {
    color: '#cecbd5',
    fontSize: responsiveFontSize(1.4),
    fontFamily: 'Lato-Bold',
  },
  like1: {height: 18, width: 18, borderRadius: 30},
  like2: {
    height: 18,
    width: 18,
    borderRadius: 30,
    right: 8,
  },
  like3: {
    height: 18,
    width: 18,
    borderRadius: 30,
    right: 16,
  },
  likecount: {
    right: 4,
    alignSelf: 'center',
    color: 'black',
    fontSize: responsiveFontSize(1.4),
    fontFamily: 'Lato-Regular',
  },
  action: {right: 5},
});
