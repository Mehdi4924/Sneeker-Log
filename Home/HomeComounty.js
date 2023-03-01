import React, {Component} from 'react';
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
  blockUser,
  ReportActivity,
} from '../Backend/utility';
import moment from 'moment';
import {Button, Switch} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import RBSheet from 'react-native-raw-bottom-sheet';
import axios from 'axios';
// import Modal from "react-native-modal";
import {firebase} from '@react-native-firebase/auth';
const DefaultImageURL =
  'https://stockx-assets.imgix.net/media/New-Product-Placeholder-Default.jpg?fit=fill&bg=FFFFFF&w=140&h=100&auto=format,compress&trim=color&q=90&dpr=2&updated_at=0';
const DefaultImageURL2 =
  'https://stockx.imgix.net/Reebok-LX8500-Renarts-Dead-End-Kicks-Temp.png?fit=fill&bg=FFFFFF&w=140&h=100&auto=format,compress&trim=color&q=90&dpr=2&updated_at=1538080256';

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
export default class HomeComounty extends React.PureComponent {
  state = {
    visible: false,
    isSwitchOn: false,
    modalVisible: true,
    modalVisibleStart: false,
    modalVisibleStar2: false,
    tabactive: true,
    flag1: true,
    flag2: false,
    CName: '',
    clickedItem: undefined,
    data: [],
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
    userProfilePic: '',
    refreshing: false,
  };

  async componentDidMount() {
    // await connectFirebase();
    //this.getNews();
    this.focusListener = this.props.navigation.addListener(
      'focus',
      async () => {
        this.setState({tabactive: true});
        let id = await AsyncStorage.getItem('Token');
        // let UserData = await getData('Users', id);
        let UserDataJson = await AsyncStorage.getItem('User');
        let UserData = JSON.parse(UserDataJson);
        console.log(UserData);
        if (UserData.profileImage) {
          if (
            !UserData.profileImage.includes('firebasestorage') &&
            !UserData.profileImage.includes('twitter')
          ) {
            let asid = UserData.profileImage
              ?.split('asid=')
              .pop()
              .split('&')[0];
            await fetch(
              `http://graph.facebook.com/${asid}/picture?type=large&height=200&width=200`,
            )
              .then((response) => {
                console.log('community profile pic = res ', response);
                this.setState({
                  userProfilePic: response.url,
                });
              })
              .catch((error) => console.error(error));
          }
        }
        // await AsyncStorage.setItem('User', JSON.stringify(UserData));
        await this.setState({UserInfo: UserData});
        this.setCommunity();
        // this.getAllOfCollectionFn();
      },
    );

    // getDataOnChange('SneakersReleaseDates', this.setSneakersReleaseDates);
    // getDataOnChange('Events', this.setEvents);
    getDataOnChange('Users', this.setUsers);

    // getDataOnChange('Community', this.setCommunity);
  }
  _onToggleSwitch = () =>
    this.setState((state) => ({isSwitchOn: !state.isSwitchOn}));

  async getAllOfCollectionFn() {
    let id = await AsyncStorage.getItem('Token');
    let UserData = await getData('Users', id);
    if (UserData.profileImage) {
      if (
        !UserData.profileImage.includes('firebasestorage') &&
        !UserData.profileImage.includes('twitter')
      ) {
        let asid = UserData.profileImage?.split('asid=').pop().split('&')[0];
        await fetch(
          `http://graph.facebook.com/${asid}/picture?type=large&height=200&width=200`,
        )
          .then((response) => {
            this.setState({
              userProfilePic: response.url,
            });
          })
          .catch((error) => console.error(error));
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
        new Date(b.releaseDate.toDate()) - new Date(a.releaseDate.toDate()),
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
  async getFcmFn(Id) {
    let DataFound = await firestore().collection('FCMTokens').doc(Id).get();
    console.log('ye how found', DataFound);
    this.NotificationFn(DataFound);
  }
  async NotificationFn(DataFound) {
    console.log('ye calll howa');
    const Ndata = {
      to: DataFound?._data?.token,
      collapse_key: 'type_a',
      notification: {
        image: this.state.UserInfo?.profileImage,
        title: this.state.UserInfo?.username,
        body: 'Liked your sneaker status.',
      },
    };
    let config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'key=AAAAmTLFeks:APA91bEG7niQAoO9Z8RNu1usJNBxyNBbd_naqZWMaGQ34qWsZP8MiK76tj6st17JXcxT29thIzrFQMyRCshpBoOMhzacSfCNH_mVgWeqpHbnPjxPR6jIcVtujYj0WgtJj4axJb57VwkI',
      },
    };
    axios
      .post('https://fcm.googleapis.com/fcm/send', Ndata, config)
      .then((res) => {
        console.log('ye aya ressss', res);
      })
      .catch((res) => {
        console.log('ye chala', res);
      });
  }

  setEvents = (data) => {
    if (data.length > 5) {
      let ShortList = [];
      for (let i = 0; i < 5; i++) {
        ShortList.push(data[i]);
      }
      this.setState({Events: ShortList});
    } else {
      this.setState({Events: data});
    }
    // this.setState({Events: data});
  };

  setUsers = async (data) => {
    let Id = await AsyncStorage.getItem('Token');
    if (data.length > 10) {
      let ShortList = [];
      for (let i = 0; i < 10; i++) {
        if (data[i].Id !== Id) {
          data[i].name = data[i].name.toUpperCase();
          ShortList.push(data[i]);
        }
      }
      this.setState({Users: ShortList});
    } else {
      let ShortList = [];
      for (let i = 0; i < 10; i++) {
        if (data[i].Id !== Id) {
          data[i].name = data[i].name.toUpperCase();
          ShortList.push(data[i]);
        }
        this.setState({Users: ShortList});
      }
    }
    // this.setState({Users: data});
  };

  setCommunity = async () => {
    let ListComplete = [];
    // await firestore()
    //   .collection('Community')
    //   .doc('Community')
    //   .get(
    let querySnapshot = await getData('Community', 'Community');

    // async () => {
    let Id = await AsyncStorage.getItem('Token');
    let UserInfo = await getData('Users', Id);
    console.log('eeeeeeeeeeeee', UserInfo);
    this.setState({UserInfo: UserInfo});
    let MyList = [];

    console.log('=====>>>', querySnapshot.Feed);
    await querySnapshot.Feed.forEach(async (element) => {
      if (!(await this.FindinArray(element.Id, UserInfo.followingdata))) {
        if (UserInfo.likeList !== undefined) {
          if (!(await this.FindinArray2(element.PostId, UserInfo.likeList))) {
            console.log('elements matrched', JSON.stringify(element, null, 2));
            if (
              element.blockedUser == undefined ||
              element?.blockedUser?.finIndex(
                (it) => it == this.state.UserInfo.Id,
              ) != -1
            ) {
              element.sneakers[0].liked = true;
              let data = await getData('Users', element.Id);
              // followingdata.push({
              element.name = data.name;
              element.username = data.username;
              element.profileImage = data.profileImage ? data.profileImage : '';
              // })
              MyList.push(element);

              this.setState({
                Community: MyList,
                // Community: querySnapshot.data().Feed,
                CompletelikeCount: querySnapshot.Feed,
              });
            }
          } else {
            if (
              element.blockedUser == undefined ||
              element?.blockedUser?.finIndex(
                (it) => it == this.state.UserInfo.Id,
              ) != -1
            ) {
              console.log(
                'elements matrched in elkse1 1',
                JSON.stringify(element, null, 2),
              );
              let data = await getData('Users', element.Id);
              // followingdata.push({
              element.name = data.name;
              element.username = data.username;
              element.profileImage = data.profileImage ? data.profileImage : '';
              // ListComplete=MyList;
              MyList.push(element);

              this.setState({
                Community: MyList,
                // Community: querySnapshot.data().Feed,
                CompletelikeCount: querySnapshot.Feed,
              });
            }
          }
        } else {
          if (
            element.blockedUser == undefined ||
            element?.blockedUser?.finIndex(
              (it) => it == this.state.UserInfo.Id,
            ) != -1
          ) {
            console.log(
              'elements matrched in elkse1 2',
              JSON.stringify(element, null, 2),
            );

            let data = await getData('Users', element.Id);
            // followingdata.push({
            element.name = data.name;
            element.username = data.username;
            element.profileImage = data.profileImage ? data.profileImage : '';
            // ListComplete=MyList;
            MyList.push(element);
            this.setState({
              Community: MyList,
              // Community: querySnapshot.data().Feed,
              CompletelikeCount: querySnapshot.Feed,
            });
          }
        }
      }
    });

    // ListComplete  = ListComplete.sort((a,b) => a. valueOf() - b.timeAgo.valueOf())
    setTimeout(() => {
      this.setState({
        // Community: ListComplete,
        isLoading: false,
      });
    }, 1000);

    // this.setState({Community: querySnapshot.data().Feed,CompletelikeCount: querySnapshot.data().Feed})
    // };

    // );
  };

  async FindinArray(Id, ObjList) {
    let Flag = true;
    if (Id !== undefined) {
      await ObjList.forEach(async (element) => {
        if (element.Id !== undefined && element.Id === Id) {
          console.log('matched for', element);
          this.setState();
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
  async blockUser() {
    console.log('==__===', this.state.clickedItem);
    const data = await getData('Users', this.state.clickedItem?.Id);
    if (data.blockedBy) {
      const index = data.blockedBy.finIndex(
        (item) => item == this.state?.UserInfo?.Id,
      );
      if (index != -1) {
        console.log('you are already blocking this user', index);
        this.RBSheet2.close();
      } else {
        const blockedByList =
          data.blockedBy != undefined
            ? [...data.blockedBy, this.state?.UserInfo?.Id]
            : [this.state?.UserInfo?.Id];
        const userNewData = {...data, blockedBy: blockedByList};
        await blockUser('Users', this.state.clickedItem.Id, userNewData);
        this.RBSheet2.close();
      }
    } else {
      const blockedByList = [this.state?.UserInfo?.Id];
      const userNewData = {...data, blockedBy: blockedByList};
      await blockUser('Users', this.state.clickedItem.Id, userNewData);
      this.RBSheet2.close();
    }
  }
  async unFollowUser() {
    // const newuserData = UserInfo
    const newdata = this.state.UserInfo.followingdata.filter(
      (item) => item.Id != this.state.clickedItem.Id,
    );
    await saveData('Users', this.state.UserInfo.Id, {
      followingdata: newdata,
    });
    this.setState({
      UserInfo: {...this.state.UserInfo, followingdata: newdata},
    });
    this.RBSheet2.close();
  }
  async report() {
    await ReportActivity('Reports', {
      reportedBy: this.state.UserInfo.Id,
      reportedUser: this.state.clickedItem.Id,
    });
    this.setState({visible: false}), this.RBSheet2.open();
  }
  async blockPost() {
    this.RBSheet2.close();
    // console.log('item', JSON.stringify(this.state.Community, null, 2));
    const a = this.state.Community.filter(
      (item) =>
        item.sneakers[0].name == this.state.clickedItem.sneakers[0].name,
    );
    const b = this.state.CompletelikeCount.map((item) => {
      if (item.PostId == a[0].PostId) {
        const matched = {
          ...item,
          blockedUser: item.blockedUser
            ? [...item.blockedUser, this.state.UserInfo.Id]
            : [this.state.UserInfo.Id],
        };
        console.log('item mmmm', matched);

        return matched;
      } else {
        return item;
      }
    });
    await saveData('Community', 'Community', {Feed: b});
    const newcomunity = this.state.Community.filter(
      (item) =>
        item.sneakers[0].name != this.state.clickedItem.sneakers[0].name,
    );
    // console.log('ye i new comunty',newcomunity);
    this.setState({
      Community: newcomunity,
    });
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

        {this.state.isLoading ? (
          <View style={{alignItems: 'center', width: '100%', marginTop: '40%'}}>
            <ActivityIndicator color={'black'} size={'large'} />
          </View>
        ) : (
          <ScrollView>
            {
              <View style={styles.topTab}>
                <TouchableOpacity
                  style={
                    this.state.tabactive ? styles.topTabbtn2 : styles.topTabbtn
                  }
                  onPress={() => {
                    // this.setState({tabactive: false})
                    this.props.navigation.navigate('Home');
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
                    this.state.tabactive ? styles.topTabbtn : styles.topTabbtn2
                  }
                  onPress={() => this.setState({tabactive: true})}>
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
            }
            {this.state.tabactive ? (
              <View style={{flex: 1}}>
                {console.log('ye i comu', this.state.Community)}
                {this.state.Community?.length > 0 ? (
                  <FlatList
                    data={this.state.Community}
                    renderItem={({item, index}) => {
                      const newItem = item;
                      const communityIndex = index;
                      return (
                        <View style={styles.flatlist1}>
                          <View style={styles.flatlistinner1}>
                            <View style={{flexDirection: 'row'}}>
                              <Image
                                source={
                                  newItem.profileImage !== undefined &&
                                  newItem.profileImage !== ''
                                    ? {uri: newItem.profileImage}
                                    : require('../../Assets/sneakerlog_profile.png')
                                }
                                style={styles.listPic1}
                              />
                              <View style={styles.listdet}>
                                <Text style={styles.listdet2}>
                                  {newItem.name}
                                </Text>
                                <Text style={styles.listdet3}>
                                  {newItem.username}
                                </Text>
                              </View>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                              <Text style={styles.listtime}>
                                {moment(newItem.timeAgo).fromNow()}
                              </Text>
                              <TouchableOpacity
                                onPress={() => {
                                  // console.log(
                                  //   'ye i pressed newItem', newItem, null, 2
                                  // );
                                  this.RBSheet.open(),
                                    this.setState({clickedItem: newItem});
                                }}
                                style={{marginLeft: 10}}>
                                <Feather
                                  name={'more-vertical'}
                                  size={20}
                                  color={'grey'}
                                  style={{marginRight: 5}}
                                />
                              </TouchableOpacity>
                            </View>
                          </View>
                          {console.log('ye ay sneakrs', newItem.sneakers)}
                          <FlatList
                            data={newItem.sneakers}
                            renderItem={({item, index}) => {
                              return (
                                <View
                                  style={[
                                    styles.list2main,
                                    {
                                      marginBottom:
                                        index + 1 ===
                                        this.state.Community?.length
                                          ? responsiveHeight(4)
                                          : 0,
                                    },
                                  ]}>
                                  <View style={styles.inner1}>
                                    <View style={{flexDirection: 'row'}}>
                                      <Image
                                        // source={{uri: require('../../Assets/placeholder.png')}}
                                        source={
                                          // item?.image?.thumbnail !== null &&
                                          //   item?.image?.thumbnail !== DefaultImageURL &&
                                          //   item?.image?.thumbnail !== DefaultImageURL2 &&
                                          item?.image?.original !== ''
                                            ? {uri: item?.image?.original}
                                            : require('../../Assets/placeholder.png')
                                        }
                                        style={styles.productpic}
                                      />
                                      <View
                                        style={[
                                          styles.productDet,
                                          {width: '60%'},
                                        ]}>
                                        <Text
                                          numberOfLines={1}
                                          maxLength={25}
                                          style={styles.pname}>
                                          {item?.name?.length > 25
                                            ? item.name.substr(0, 25) + '...'
                                            : item.name}
                                        </Text>
                                        <Text style={styles.pcolor}>
                                          {item.colorway}
                                        </Text>
                                        <Text style={styles.psize}>
                                          Size{' '}
                                          {item.Size
                                            ? item.Size
                                            : 'Not Available'}
                                        </Text>
                                        <View
                                          style={{
                                            flexDirection: 'row',
                                            marginTop: 5,
                                          }}>
                                          <TouchableOpacity
                                            //  style={{backgroundColor:'pink'}}
                                            onPress={async () => {
                                              // { console.log('ye press krny py i', newItem) }
                                              this.getFcmFn(newItem.Id);
                                              let OldFeedList = this.state
                                                .CompletelikeCount;
                                              let newData = [];
                                              let LikeObject = {};
                                              // let ge
                                              let Id = await AsyncStorage.getItem(
                                                'Token',
                                              );
                                              let UserInfo = await getData(
                                                'Users',
                                                Id,
                                              );
                                              // console.log("yyyyyye i userinfo",UserInfo);
                                              if (
                                                UserInfo.likeList !== undefined
                                              ) {
                                                if (
                                                  await this.FindinArray2(
                                                    this.state.Community[
                                                      communityIndex
                                                    ].PostId,
                                                    UserInfo.likeList,
                                                  )
                                                ) {
                                                  await OldFeedList.forEach(
                                                    async (element) => {
                                                      if (
                                                        element.PostId ===
                                                        this.state.Community[
                                                          communityIndex
                                                        ].PostId
                                                      ) {
                                                        if (
                                                          element.sneakers[0]
                                                            .likeCount !==
                                                          undefined
                                                        ) {
                                                          element.sneakers[0].likeCount =
                                                            element.sneakers[0]
                                                              .likeCount + 1;
                                                          if (
                                                            element.sneakers[0]
                                                              .likeCount > 2
                                                          ) {
                                                            element.sneakers[0].likedBypic3 =
                                                              element
                                                                .sneakers[0]
                                                                .likedBypic3 ===
                                                                undefined ||
                                                              element
                                                                .sneakers[0]
                                                                .likedBypic3 ===
                                                                null
                                                                ? UserInfo.profileImage !==
                                                                  undefined
                                                                  ? UserInfo.profileImage
                                                                  : 'https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Users%2Fsneakerlog_profile.png?alt=media&token=4e7c748e-ba97-40e2-84b0-724d98f9309b'
                                                                : null;
                                                          } else {
                                                            element.sneakers[0].likedBypic2 =
                                                              element
                                                                .sneakers[0]
                                                                .likedBypic2 ===
                                                                undefined ||
                                                              element
                                                                .sneakers[0]
                                                                .likedBypic2 ===
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
                                                            element.sneakers[0]
                                                              .likedBypic1 ===
                                                              undefined ||
                                                            element.sneakers[0]
                                                              .likedBypic1 ===
                                                              null
                                                              ? UserInfo.profileImage !==
                                                                undefined
                                                                ? UserInfo.profileImage
                                                                : 'https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Users%2Fsneakerlog_profile.png?alt=media&token=4e7c748e-ba97-40e2-84b0-724d98f9309b'
                                                              : null;
                                                          // element.sneakers[0].likedBypic2 = element.sneakers[0].likedBypic2=== undefined ||element.sneakers[0].likedBypic2=== null ? UserInfo.profileImage!== undefined? UserInfo.profileImage:"https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Users%2Fsneakerlog_profile.png?alt=media&token=4e7c748e-ba97-40e2-84b0-724d98f9309b":null;
                                                          // element.sneakers[0].likedBypic3 = element.sneakers[0].likedBypic3=== undefined ||element.sneakers[0].likedBypic3=== null ? UserInfo.profileImage!== undefined? UserInfo.profileImage:"https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Users%2Fsneakerlog_profile.png?alt=media&token=4e7c748e-ba97-40e2-84b0-724d98f9309b":null;
                                                        }
                                                        LikeObject = element;
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
                                                    this.state.Community[
                                                      communityIndex
                                                    ].PostId,
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
                                                  await saveData(
                                                    'LikeTable',
                                                    UserInfo.Id,
                                                    {
                                                      UserInfo: UserInfo,
                                                      Obj: LikeObject,
                                                    },
                                                  );
                                                } else {
                                                }
                                              } else {
                                                await OldFeedList.forEach(
                                                  async (element) => {
                                                    if (
                                                      element.PostId ===
                                                      this.state.Community[
                                                        communityIndex
                                                      ].PostId
                                                    ) {
                                                      if (
                                                        element.sneakers[0]
                                                          .likeCount !==
                                                        undefined
                                                      ) {
                                                        element.sneakers[0].likeCount =
                                                          element.sneakers[0]
                                                            .likeCount + 1;

                                                        // element.sneakers[0].likedBypic1 = element.sneakers[0].likedBypic1=== undefined ||element.sneakers[0].likedBypic1=== null ? UserInfo.profileImage!== undefined? UserInfo.profileImage:"https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Users%2Fsneakerlog_profile.png?alt=media&token=4e7c748e-ba97-40e2-84b0-724d98f9309b":null;
                                                        if (
                                                          element.sneakers[0]
                                                            .likeCount > 2
                                                        ) {
                                                          element.sneakers[0].likedBypic3 =
                                                            element.sneakers[0]
                                                              .likedBypic3 ===
                                                              undefined ||
                                                            element.sneakers[0]
                                                              .likedBypic3 ===
                                                              null
                                                              ? UserInfo.profileImage !==
                                                                undefined
                                                                ? UserInfo.profileImage
                                                                : 'https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Users%2Fsneakerlog_profile.png?alt=media&token=4e7c748e-ba97-40e2-84b0-724d98f9309b'
                                                              : null;
                                                        } else {
                                                          element.sneakers[0].likedBypic2 =
                                                            element.sneakers[0]
                                                              .likedBypic2 ===
                                                              undefined ||
                                                            element.sneakers[0]
                                                              .likedBypic2 ===
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
                                                          element.sneakers[0]
                                                            .likedBypic1 ===
                                                            undefined ||
                                                          element.sneakers[0]
                                                            .likedBypic1 ===
                                                            null
                                                            ? UserInfo.profileImage !==
                                                              undefined
                                                              ? UserInfo.profileImage
                                                              : 'https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Users%2Fsneakerlog_profile.png?alt=media&token=4e7c748e-ba97-40e2-84b0-724d98f9309b'
                                                            : null;
                                                        // element.sneakers[0].likedBypic2 = element.sneakers[0].likedBypic2=== undefined ||element.sneakers[0].likedBypic2=== null ? UserInfo.profileImage!== undefined? UserInfo.profileImage:"https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Users%2Fsneakerlog_profile.png?alt=media&token=4e7c748e-ba97-40e2-84b0-724d98f9309b":null;
                                                        // element.sneakers[0].likedBypic3 = element.sneakers[0].likedBypic3=== undefined ||element.sneakers[0].likedBypic3=== null ? UserInfo.profileImage!== undefined? UserInfo.profileImage:"https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Users%2Fsneakerlog_profile.png?alt=media&token=4e7c748e-ba97-40e2-84b0-724d98f9309b":null;
                                                      }
                                                      LikeObject = element;
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
                                                UserInfo.likeList = [];
                                                UserInfo.likeList.push(
                                                  this.state.Community[
                                                    communityIndex
                                                  ].PostId,
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
                                              }
                                              await saveData(
                                                'LikeTable',
                                                UserInfo.Id,
                                                {
                                                  UserInfo: UserInfo,
                                                  Obj: LikeObject,
                                                },
                                              );
                                              const a = this.state.Community;
                                              a[communityIndex]?.sneakers[index]
                                                ?.liked
                                                ? (a[communityIndex].sneakers[
                                                    index
                                                  ].liked = false)
                                                : (a[communityIndex].sneakers[
                                                    index
                                                  ].liked = true),
                                                this.setState({
                                                  Community: a,
                                                  refreshing: !this.state
                                                    .refreshing,
                                                });
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
                                          </TouchableOpacity>

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
                                            {item?.liked ? (
                                              <Text>You</Text>
                                            ) : null}
                                            {item.likeCount !== undefined
                                              ? ' and Liked by ' +
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
                                </View>
                              );
                            }}
                          />
                        </View>
                      );
                    }}
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
            ) : null}
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
            <ModalContent
              sstyle={[
                styles.modalview,
                {
                  height:
                    this.state.ShowEmpityNameerror ||
                    this.state.ShowSameNameerror
                      ? responsiveHeight(33)
                      : responsiveHeight(30.3),
                },
              ]}>
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
                      Collection: [
                        ...this.state.TotalCol,
                        {
                          name: this.state.CName,
                          isPrivate: isSwitchOn,
                          NoOfSneakers: 0,
                          fav: false,
                        },
                      ],
                      CollectionIndex: this.state.TotalCol?.length,
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
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <RBSheet
            ref={(ref) => {
              this.RBSheet = ref;
            }}
            height={240}
            openDuration={250}
            customStyles={{
              container: {
                justifyContent: 'center',
                alignItems: 'center',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
              },
            }}>
            <View style={{width: responsiveWidth(90), alignSelf: 'center'}}>
              <View>
                <Text style={{fontSize: responsiveFontSize(3)}}>Report</Text>
              </View>
              <View style={{marginVertical: responsiveHeight(2.5)}}>
                <Text style={{fontSize: responsiveHeight(2.2), color: 'grey'}}>
                  Your report is anonymous, except if you report an intellectual
                  property infringement. If someone is in immediate danger, call
                  the local emergency services.
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  this.setState({visible: true}), this.RBSheet.close();
                }}
                style={{
                  width: responsiveWidth(90),
                  height: responsiveHeight(7),
                  alignSelf: 'center',
                  alignItems: 'center',
                  backgroundColor: '#D9173B',
                  justifyContent: 'center',
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    fontSize: responsiveFontSize(2.2),
                    fontFamily: 'Lato-Regular',
                    color: '#fff',
                  }}>
                  Report Activity
                </Text>
              </TouchableOpacity>
            </View>
          </RBSheet>
        </View>
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <RBSheet
            ref={(ref) => {
              this.RBSheet2 = ref;
            }}
            height={responsiveHeight(60)}
            openDuration={250}
            customStyles={{
              container: {
                justifyContent: 'center',
                alignItems: 'center',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
              },
            }}>
            <View
              style={{
                width: responsiveWidth(90),
                alignSelf: 'center',
                alignItems: 'flex-start',
              }}>
              <Text
                style={{
                  fontSize: responsiveHeight(2.8),
                  marginVertical: responsiveHeight(2),
                  fontWeight: 'bold',
                }}>
                Thank you for letting us know
              </Text>
            </View>
            <View
              style={{
                width: responsiveWidth(90),
                alignSelf: 'center',
                alignItems: 'flex-start',
              }}>
              <Text
                style={{
                  fontSize: responsiveHeight(2),
                  color: 'grey',
                  marginBottom: responsiveHeight(4),
                }}>
                Your fedback is important to us.It helps us keep the sneakerlog
                community safe.
              </Text>
            </View>
            <View
              style={{
                width: responsiveWidth(90),
                alignSelf: 'center',
                alignItems: 'flex-start',
              }}>
              <Text
                style={{
                  fontSize: responsiveHeight(2.6),
                  marginVertical: responsiveHeight(2),
                  fontWeight: 'bold',
                }}>
                Action you can take
              </Text>
            </View>
            <View style={{width: responsiveWidth(90), alignSelf: 'center'}}>
              <TouchableOpacity
                onPress={() => {
                  // this.blockUser()
                  this.blockPost();
                }}
                style={{
                  width: responsiveWidth(90),
                  height: responsiveHeight(7),
                  alignSelf: 'center',
                  alignItems: 'center',
                  backgroundColor: '#D9173B',
                  justifyContent: 'center',
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    fontSize: responsiveFontSize(2.2),
                    fontFamily: 'Lato-Regular',
                    color: '#fff',
                  }}>
                  Block Post
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.unFollowUser();
                }}
                style={{
                  width: responsiveWidth(90),
                  height: responsiveHeight(7),
                  alignSelf: 'center',
                  alignItems: 'center',
                  borderWidth: 1,
                  justifyContent: 'center',
                  borderRadius: 10,
                  marginVertical: responsiveHeight(2),
                  borderColor: '#cecbd5',
                }}>
                <Text
                  style={{
                    fontSize: responsiveFontSize(2.2),
                    fontFamily: 'Lato-Regular',
                    color: '#589BE9',
                  }}>
                  Unfollow{' '}
                  {this.state.clickedItem
                    ? this.state.clickedItem?.username
                    : 'Username'}
                </Text>
                {console.log(this.state.clickedItem)}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.RBSheet2.close();
                }}
                style={{
                  width: responsiveWidth(90),
                  height: responsiveHeight(7),
                  alignSelf: 'center',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  justifyContent: 'center',
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#cecbd5',
                }}>
                <Text
                  style={{
                    fontSize: responsiveFontSize(2.2),
                    fontFamily: 'Lato-Regular',
                    color: '#589BE9',
                  }}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </RBSheet>
        </View>
        <View>
          <Modal
            style={{backgroundColor: 'rgba(0,0,0,0.7)'}}
            visible={this.state.visible}
            onTouchOutside={() => {
              this.setState({visible: true});
            }}>
            <View
              style={{
                justifyContent: 'space-between',
                width: responsiveWidth(78),
                height: responsiveHeight(30),
                backgroundColor: '#fff',
                alignSelf: 'center',
                borderRadius: 10,
                elevation: 5,
              }}>
              <View
                style={{
                  width: responsiveWidth(78),
                  alignItems: 'center',
                  marginVertical: responsiveHeight(7),
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    color: '#000',
                    fontSize: responsiveFontSize(2.2),
                    textAlign: 'center',
                  }}>
                  Are you sure you {'\n'}
                  want to report this activty?
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  height: responsiveHeight(8),
                  width: responsiveWidth(78),
                  borderTopWidth: 1,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({visible: false});
                  }}
                  style={{
                    width: responsiveWidth(39),
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRightWidth: 1,
                  }}>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(2.2),
                      fontFamily: 'Lato-Regular',
                      color: '#589BE9',
                    }}>
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    this.report();
                  }}
                  style={{
                    width: responsiveWidth(39),
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(2.2),
                      fontFamily: 'Lato-Regular',
                      color: '#589BE9',
                    }}>
                    Yes
                  </Text>
                </TouchableOpacity>
              </View>
              {/* <Button title="Hide modal" onPress={} /> */}
            </View>
          </Modal>
        </View>
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
    fontSize: responsiveFontSize(1.5),
    fontFamily: 'Lato-Regular',
    width: responsiveWidth(50),
    color: '#999999',
    left: 4,
    // backgroundColor:'red'
  },
  nametext5: {
    fontSize: responsiveFontSize(1.5),
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
