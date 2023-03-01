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
import {
  getData,
  getDataOnChange,
  saveData,
  getAllOfCollection,
  addToArray,
  updateData,
} from '../../Backend/utility';
import firestore from '@react-native-firebase/firestore';
import {ActivityIndicator} from 'react-native-paper';
import {Button, Switch, Searchbar} from 'react-native-paper';
import axios from 'axios';

export default class Members extends React.PureComponent {
  state = {
    flag1: true,
    flag2: false,
    flag3: false,
    flag4: false,
    flag5: false,
    data: [],
    followersdata: [],
    followingdata: [],
    sentdata: [],
    receivedata: [],
    UserInfo: {},
    isLoading: true,
    userProfilePic: '',
    alldata: [],
    refreshing: false,
  };

  async componentDidMount() {
    // getDataOnChange('Users', this.setUsers);

    let id = await AsyncStorage.getItem('Token');
    let ActiveMember = await AsyncStorage.getItem('ActiveMember');
    if (ActiveMember === '3') {
      this.setState({
        flag1: false,
        flag2: false,
        flag3: false,
        flag4: false,
        flag5: true,
      });
      await AsyncStorage.setItem('ActiveMember', '0');
    }
    let UserData = await getData('Users', id);
    // console.log('ye aya data shuru m', UserData);
    if (UserData.profileImage) {
      if (
        !UserData.profileImage.includes('firebasestorage') &&
        !UserData.profileImage.includes('twitter')
      ) {
        let asid = UserData.profileImage?.split('asid=').pop().split('&')[0];
        fetch(
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
    this.GetUserData();
    const quesry = await firestore().collection('Users').doc(id);

    // quesry.onSnapshot(async () => {
    //   this.GetUserData();
    //   console.log("running===================>>>>>>");
    // });
    //this.GetUserData();
    setTimeout(() => {
      this.setState({
        isLoading: false,
      });
    }, 3000);
  }
  uniqueID() {
    this.setState({indicator: true});
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
  async GetUserData() {
    let Id = await AsyncStorage.getItem('Token');
    let UserData = await getData('Users', Id);
    {
      console.log('userdat k liay', JSON.stringify(UserData, null, 2));
    }
    let data = await getAllOfCollection('Users');
    let receivedata = [];
    let sentdata = [];
    let followingdata = [];
    let followersdata = [];
    if (UserData) {
      if (UserData.receivedata) {
        await UserData.receivedata.forEach(async (element) => {
          let data = await getData('Users', element.Id);
          receivedata.push({
            Id: data.Id,
            name: data.name,
            username: data.username,
            profileImage: data.profileImage ? data.profileImage : '',
          });
        });
      }
      if (UserData.sentdata) {
        await UserData.sentdata.forEach(async (element) => {
          let data = await getData('Users', element.Id);
          sentdata.push({
            Id: data.Id,
            name: data.name,
            username: data.username,
            profileImage: data.profileImage ? data.profileImage : '',
          });
        });
      }
      if (UserData.followingdata) {
        await UserData.followingdata.forEach(async (element) => {
          let data = await getData('Users', element.Id);
          followingdata.push({
            Id: data.Id,
            name: data.name,
            username: data.username,
            profileImage: data.profileImage ? data.profileImage : '',
          });
        });
      }
      if (UserData.followersdata) {
        await UserData.followersdata.forEach(async (element) => {
          let data = await getData('Users', element.Id);
          const blockCheck =
            UserData.blockedBy != undefined
              ? UserData.blockedBy.map((item) => {
                  // console.log('item from blocked by', item, element);
                  if (item == element.Id) {
                    followersdata.push({
                      Id: data.Id,
                      name: data.name,
                      username: data.username,
                      profileImage: data.profileImage ? data.profileImage : '',
                      blockedBy: true,
                    });
                  } else {
                    followersdata.push({
                      Id: data.Id,
                      name: data.name,
                      username: data.username,
                      profileImage: data.profileImage ? data.profileImage : '',
                      blockedBy: false,
                    });
                  }
                })
              : followersdata.push({
                  Id: data.Id,
                  name: data.name,
                  username: data.username,
                  profileImage: data.profileImage ? data.profileImage : '',
                  blockedBy: false,
                });
        });
      }
      this.setState({
        UserData: UserData,
        receivedata: receivedata,
        sentdata: sentdata,
        followersdata: followersdata,
        followingdata: followingdata,
        UserData2: UserData,
        receivedata2: receivedata,
        sentdata2: sentdata,
        followersdata2: followersdata,
        followingdata2: followingdata,
      }); // console.log('set hiny sy phly ', JSON.stringify(data, null, 2));
      this.setUsers(data, UserData);
    }
  }

  async FilterFn(text) {
    if (text !== '') {
      // console.log(text);
      let data2 = await this.state.data.filter(function (item) {
        //applying filter for the inserted text in search bar
        let itemData = item.name ? item.name?.toUpperCase() : ''.toUpperCase();
        let textData = text?.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      let receivedata2 = await this.state.receivedata.filter(function (item) {
        //applying filter for the inserted text in search bar
        let itemData = item.name ? item.name?.toUpperCase() : ''.toUpperCase();
        let textData = text?.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      let sentdata2 = await this.state.sentdata.filter(function (item) {
        //applying filter for the inserted text in search bar
        let itemData = item.name ? item.name?.toUpperCase() : ''.toUpperCase();
        let textData = text?.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      let followersdata2 = await this.state.followersdata.filter(function (
        item,
      ) {
        //applying filter for the inserted text in search bar
        let itemData = item.name ? item.name?.toUpperCase() : ''.toUpperCase();
        let textData = text?.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      let followingdata2 = await this.state.followingdata.filter(function (
        item,
      ) {
        //applying filter for the inserted text in search bar
        let itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        let textData = text?.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });
      await this.setState({
        data: data2,
        receivedata: receivedata2,
        sentdata: sentdata2,
        followersdata: followersdata2,
        followingdata: followingdata2,
      });
    } else {
      this.setState({
        data: this.state.data2,
        receivedata: this.state.receivedata2,
        sentdata: this.state.sentdata2,
        followersdata: this.state.followersdata2,
        followingdata: this.state.followingdata2,
      });
    }
  }
  async getFcmFn(Id) {
    let DataFound = await firestore().collection('FCMTokens').doc(Id).get();
    console.log('ye how found', DataFound);
    this.NotificationFn(DataFound);
  }

  async NotificationFn(DataFound) {
    const Ndata = {
      to: DataFound?._data?.token,
      collapse_key: 'type_a',
      notification: {
        image:
          this.state.UserInfo?.profileImage != null
            ? this.state.UserInfo?.profileImage
            : 'https//images.unsplash.com/photo-1603787081207-362bcef7c144?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8c25lYWtlcnxlbnwwfHwwfHw%3D&w=1000&q=80',
        title: this.state.UserInfo?.username,
        body: 'Wants to connect with you.',
      },
      data: {
        title: 'this.state.UserInfo?.username',
        body: 'Wants to connect with you.',
      },
    };
    console.log('ttttttttttttt', DataFound);
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
  setUsers = async (data, UserData) => {
    let Id = await AsyncStorage.getItem('Token');
    let Memberdata = [];
    for (let i = 0; i < data.length; i++) {
      data[i].name2 = await data[i]?.name?.toUpperCase();
      if (
        data[i].Id !== Id &&
        (data[i]?.isDeActive === undefined || !data[i]?.isDeActive)
      ) {
        if (!(await this.FindinArray(data[i]?.Id, UserData.followingdata))) {
          data[i].CurrentS = 'FOLLOWING';
        } else if (!(await this.FindinArray(data[i]?.Id, UserData.sentdata))) {
          data[i].CurrentS = 'INVITE SENT';
        } else {
          data[i].CurrentS = 'FOLLOW';
        }
        // console.log('Users : ', data[i].Id);
        Memberdata.push(data[i]);
        this.setState({data: Memberdata, data2: Memberdata});
      }
    }
    let users = [];
    this.state.data.map((item, index) => {
      let obj = item;
      if (item.profileImage) {
        if (
          !item.profileImage.includes('firebasestorage') &&
          !item.profileImage.includes('twitter')
        ) {
          let asid = item.profileImage?.split('asid=').pop().split('&')[0];
          fetch(
            `http://graph.facebook.com/${asid}/picture?type=large&height=320&width=420`,
          )
            .then((response) => {
              obj.profileImage = response.url;
            })
            .catch((error) => console.error(error));
        }
      }
      users.push(obj);
    });
    setTimeout(() => {
      this.setState({
        data: users,
      });
    }, 500);
    this.setState({isLoading: false});
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
    return Flag;
  }
  async IndexinArray(Id, ObjList) {
    let Flag = 0;
    let counter = 0;
    ObjList.forEach((element) => {
      if (element.Id === Id) {
        Flag = counter;
      }
      counter++;
    });
    // console.log(Flag);
    return Flag;
  }

  render() {
    const {flag1, flag2, flag3, flag4, flag5} = this.state;
    let flag = false;
    let users = [];
    // { console.log('yyyyyyyyyyy', users); }
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent></StatusBar>
        {console.log('yyyyyyyyy', this.state.UserInfo.profileImage)}
        {/* <View style={styles.header}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Home')}
            style={styles.backarrowView}>
            <Image
              source={require('../../../Assets/arrowback.png')}
              style={styles.backarrowimageStyle}
            />
          </TouchableOpacity>
          <Image
            source={require('../../../Assets/Logo.png')}
            style={styles.logoImageStyle}
          />
            {!this.state.isLoading ? (
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('ProfileStack')}
            style={styles.logoViewStyle}>
            <Image
              source={
                this.state.userProfilePic && this.state.userProfilePic != ''
                  ? { uri: this.state.userProfilePic }
                  : this.state.UserInfo.profileImage !== undefined ?
                    { uri: this.state.UserInfo.profileImage } :
                    require('../../../Assets/sneakerlog_profile.png')}
              style={styles.profileImageStyle}
            />
          </TouchableOpacity>
            ):(<View></View>)}
        </View> */}
        <View>
          <ScrollView
            style={{height: responsiveHeight(8)}}
            horizontal={true}
            showsHorizontalScrollIndicator={false}>
            <View style={styles.filter}>
              <View style={{marginLeft: responsiveWidth(5)}}>
                <TouchableOpacity
                  style={styles.bar}
                  onPress={() => {
                    let {flag1, flag2, flag3, flag4, flag5} = this.state;
                    (flag1 = true),
                      (flag2 = false),
                      (flag3 = false),
                      (flag4 = false),
                      (flag5 = false),
                      this.setState({flag1, flag2, flag3, flag4, flag5});
                  }}>
                  <Text style={styles.buttontext}>All</Text>
                </TouchableOpacity>
                {flag1 ? <View style={styles.barbottom}></View> : null}
              </View>
              <View>
                <TouchableOpacity
                  style={styles.bar}
                  onPress={() => {
                    let {flag1, flag2, flag3, flag4, flag5} = this.state;
                    (flag1 = false),
                      (flag2 = true),
                      (flag3 = false),
                      (flag4 = false),
                      (flag5 = false),
                      this.setState({flag1, flag2, flag3, flag4, flag5});
                  }}>
                  <Text style={styles.buttontext}>Followers</Text>
                </TouchableOpacity>
                {flag2 ? <View style={styles.barbottom}></View> : null}
              </View>
              <View>
                <TouchableOpacity
                  style={styles.bar}
                  onPress={() => {
                    let {flag1, flag2, flag3, flag4, flag5} = this.state;
                    (flag1 = false),
                      (flag2 = false),
                      (flag3 = true),
                      (flag4 = false),
                      (flag5 = false),
                      this.setState({flag1, flag2, flag3, flag4, flag5});
                  }}>
                  <Text
                    style={[
                      styles.buttontext,
                      {marginLeft: responsiveWidth(1)},
                    ]}>
                    Following
                  </Text>
                </TouchableOpacity>
                {flag3 ? (
                  <View
                    style={[
                      styles.barbottom,
                      {marginLeft: responsiveWidth(1)},
                    ]}></View>
                ) : null}
              </View>
              <View>
                <TouchableOpacity
                  style={styles.bar}
                  onPress={() => {
                    let {flag1, flag2, flag3, flag4, flag5} = this.state;
                    (flag1 = false),
                      (flag2 = false),
                      (flag3 = false),
                      (flag4 = true),
                      (flag5 = false),
                      this.setState({flag1, flag2, flag3, flag4, flag5});
                  }}>
                  <Text style={styles.buttontext}>Sent</Text>
                </TouchableOpacity>
                {flag4 ? <View style={styles.barbottom}></View> : null}
              </View>
              <View>
                <TouchableOpacity
                  style={styles.bar}
                  onPress={() => {
                    let {flag1, flag2, flag3, flag4, flag5} = this.state;
                    (flag1 = false),
                      (flag2 = false),
                      (flag3 = false),
                      (flag4 = false),
                      (flag5 = true),
                      this.setState({flag1, flag2, flag3, flag4, flag5});
                  }}>
                  <Text style={styles.buttontext}>Received</Text>
                </TouchableOpacity>
                {flag5 ? <View style={styles.barbottom}></View> : null}
              </View>
            </View>
          </ScrollView>
        </View>
        <Searchbar
          placeholder={'Search Members'}
          onChangeText={(text) => {
            this.FilterFn(text);
          }}
          theme={{
            roundness: 2,
            colors: {
              primary: 'black',
              text: 'black',
            },
          }}
          style={styles.SearchbarView}
        />
        {this.state.isLoading ? (
          <View style={{alignItems: 'center', width: '100%', marginTop: '40%'}}>
            <ActivityIndicator color={'black'} size={'large'} />
          </View>
        ) : (
          <ScrollView
            style={styles.bottomcontainer}
            showsVerticalScrollIndicator={false}>
            {console.log(
              'ye aya flag1 k liay',
              JSON.stringify(this.state.data, null, 2),
            )}
            {/* {console.log('ye aya sss', this.state.data)} */}

            {flag1 ? (
              this.state.data.length > 0 ? (
                <FlatList
                  showsScrollIndicator="false"
                  data={this.state.data.filter(
                    (item) => item?.name != this.state.data?.name,
                  )}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          this.props.navigation.navigate('UserDetails', {
                            User: item,
                          });
                        }}
                        key={index}
                        style={[
                          styles.cardview,
                          {
                            marginBottom:
                              index + 1 == this.state.data.length
                                ? responsiveHeight(2)
                                : null,
                          },
                        ]}>
                        <View style={{flexDirection: 'row'}}>
                          {item?.profileImage !== undefined &&
                          item?.profileImage !== '' ? (
                            <Image
                              source={{uri: item?.profileImage}}
                              style={styles.profileimage1}></Image>
                          ) : (
                            <Image
                              source={require('../../../Assets/sneakerlog_profile.png')}
                              style={styles.profileimage1}></Image>
                          )}
                          <View style={styles.usernameTextView}>
                            <Text
                              onPress={() =>
                                this.props.navigation.navigate('UserDetails', {
                                  User: item,
                                })
                              }
                              style={styles.profiletext}>
                              {item?.name}
                            </Text>
                            <Text
                              onPress={() =>
                                this.props.navigation.navigate('UserDetails', {
                                  User: item,
                                })
                              }
                              style={styles.profiletext1}>
                              {item?.username}
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={async () => {
                            this.getFcmFn(item.Id);
                            if (item.CurrentS === 'FOLLOW') {
                              // this.setState({isLoading:true})
                              let FollowList = this.state.followingdata;
                              let sentdata = this.state.sentdata;
                              let alreadyExist = false;
                              sentdata.forEach((element) => {
                                if (element.id == item.Id) {
                                  alreadyExist = true;
                                }
                              });
                              if (!alreadyExist) {
                                let Id = await AsyncStorage.getItem('Token');
                                if (
                                  await this.FindinArray(item.Id, FollowList)
                                ) {
                                  if (
                                    await this.FindinArray(item.Id, sentdata)
                                  ) {
                                    let Change = this.state.data;
                                    console.log('this is change ', Change);
                                    if (index == 0) {
                                      Change[index].CurrentS = 'INVITE SENT';
                                    } else if (index == 1) {
                                      Change[index].CurrentS = 'INVITE SENT';
                                    } else {
                                      Change[index + 1].CurrentS =
                                        'INVITE SENT';
                                    }
                                    // Change[index].CurrentS = 'INVITE SENT';
                                    if (item.profileImage !== undefined) {
                                      sentdata = [
                                        {
                                          Id: item.Id,
                                          name: item.name,
                                          username: item.username,
                                          name2: '.',
                                          profileImage:
                                            item.profileImage !== undefined
                                              ? item.profileImage
                                              : '',
                                        },
                                        ...sentdata,
                                      ];
                                    } else {
                                      sentdata = [
                                        {
                                          Id: item.Id,
                                          name: item.name,
                                          name2: '.',
                                          username: item.username,
                                        },
                                        ...sentdata,
                                      ];
                                    }
                                    this.setState({
                                      sentdata: sentdata,
                                      data: Change,
                                    });

                                    if (item.receivedata) {
                                      let filtered = item.receivedata;
                                      if (
                                        this.state.UserData.profileImage !==
                                        undefined
                                      ) {
                                        filtered = [
                                          {
                                            Id: this.state.UserData.Id,
                                            name: this.state.UserData.name,
                                            username: this.state.UserData
                                              .username,
                                            name2: '.',
                                            profileImage: this.state.UserData
                                              .profileImage,
                                          },
                                          ...filtered,
                                        ];
                                      } else {
                                        filtered = [
                                          {
                                            Id: this.state.UserData.Id,
                                            name: this.state.UserData.name,
                                            name2: '.',
                                            username: this.state.UserData
                                              .username,
                                          },
                                          ...filtered,
                                        ];
                                      }
                                      item.receivedata = filtered;
                                      // this.setState({isLoading:true})
                                      // console.log(item);
                                      await saveData('Users', item.Id, {
                                        receivedata: filtered,
                                      }).then(() => {
                                        // //this.GetUserData();
                                      });
                                    } else {
                                      item.receivedata = [this.state.UserData];
                                      // this.setState({isLoading:true})
                                      if (
                                        this.state.UserData.profileImage !==
                                        undefined
                                      ) {
                                        await saveData('Users', item.Id, {
                                          Id: this.state.UserData.Id,
                                          name: this.state.UserData.name,
                                          name2: '.',
                                          username: this.state.UserData
                                            .username,
                                          profileImage: this.state.UserData
                                            .profileImage,
                                        }).then(() => {
                                          this.setState({
                                            refreshing: !refreshing,
                                          });
                                          // //this.GetUserData();
                                        });
                                      } else {
                                        await saveData('Users', item.Id, {
                                          Id: this.state.UserData.Id,
                                          name: this.state.UserData.name,
                                          name2: '.',
                                          username: this.state.UserData
                                            .username,
                                        }).then(() => {
                                          this.setState({
                                            refreshing: !refreshing,
                                          });
                                          // //this.GetUserData();
                                        });
                                      }
                                    }
                                    this.setState({refreshing: !refreshing});
                                    let filtered2 = sentdata.filter(function (
                                      el,
                                    ) {
                                      return el != null;
                                    });
                                    await saveData('Users', Id, {
                                      sentdata: filtered2,
                                    }).then(() => {
                                      // //this.GetUserData();
                                    });
                                    // this.componentDidMount();
                                    // alert('Follow Request Sent to ' + item.name);
                                  } else {
                                    this.setState({isLoading: false});
                                    // alert('already Request Sent to ' + item.name);
                                  }
                                } else {
                                  this.setState({isLoading: false});
                                  // alert('already Following ' + item.name);
                                }
                              }
                            }
                            this.setState({refreshing: !this.state.refreshing});
                          }}
                          style={styles.inviteSendView}>
                          <Text
                            style={[
                              styles.followtext,
                              {
                                color:
                                  item.CurrentS === 'INVITE SENT'
                                    ? 'black'
                                    : 'red',
                              },
                            ]}>
                            {item.CurrentS}
                          </Text>
                        </TouchableOpacity>
                      </TouchableOpacity>
                    );
                  }}
                />
              ) : (
                <View style={styles.nomemberViewStyle}>
                  <Text
                    style={[
                      styles.favtext,
                      {color: 'gray', marginTop: '50%', fontSize: 20},
                    ]}>
                    No Members
                  </Text>
                </View>
              )
            ) : null}
            {flag2 ? (
              this.state.followersdata.length > 0 ? (
                <FlatList
                  showsScrollIndicator="false"
                  data={this.state.followersdata}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity
                        disabled={item.blockedBy}
                        onPress={() =>
                          this.props.navigation.navigate('UserDetails', {
                            User: item,
                          })
                        }
                        style={styles.cardview}>
                        <View style={{flexDirection: 'row'}}>
                          {item.profileImage !== undefined &&
                          item.profileImage !== '' ? (
                            <Image
                              source={{uri: item.profileImage}}
                              style={styles.profileimage1}></Image>
                          ) : (
                            <Image
                              source={require('../../../Assets/sneakerlog_profile.png')}
                              style={styles.profileimage1}></Image>
                          )}
                          <View style={styles.usernameTextStyle}>
                            {/* {console.log('====>>', item)} */}
                            <Text style={styles.profiletext}>{item.name}</Text>
                            <Text style={styles.profiletext1}>
                              {item.username}
                            </Text>
                          </View>
                          {this.FindinArray(
                            item.Id,
                            this.state.followersdata,
                          ) ? (
                            <Text style={styles.blockedTextStyle}>
                              {item.blockedBy ? 'BLOCKED' : 'FOLLOWING'}
                            </Text>
                          ) : (
                            <TouchableOpacity
                              disabled={item.blockedBy}
                              onPress={async () => {
                                if (item.CurrentS === 'FOLLOW') {
                                  // this.setState({isLoading:true})
                                  let FollowList = this.state.followingdata;
                                  let sentdata = this.state.sentdata;
                                  let Id = await AsyncStorage.getItem('Token');
                                  if (
                                    await this.FindinArray(item.Id, FollowList)
                                  ) {
                                    if (
                                      await this.FindinArray(item.Id, sentdata)
                                    ) {
                                      let Change = this.state.data;
                                      Change[index].CurrentS = 'INVITE SENT';
                                      if (item.profileImage !== undefined) {
                                        sentdata = [
                                          {
                                            Id: item.Id,
                                            name: item.name,
                                            username: item.username,
                                            name2: '.',
                                            profileImage:
                                              item.profileImage !== undefined
                                                ? item.profileImage
                                                : '',
                                          },
                                          ...sentdata,
                                        ];
                                      } else {
                                        sentdata = [
                                          {
                                            Id: item.Id,
                                            name: item.name,
                                            name2: '.',
                                            username: item.username,
                                          },
                                          ...sentdata,
                                        ];
                                      }

                                      this.setState({
                                        sentdata: sentdata,
                                        data: Change,
                                      });

                                      if (item.receivedata) {
                                        let filtered = item.receivedata.filter(
                                          function (el) {
                                            return el != null;
                                          },
                                        );
                                        if (
                                          this.state.UserData.profileImage !==
                                          undefined
                                        ) {
                                          filtered.push({
                                            Id: this.state.UserData.Id,
                                            name: this.state.UserData.name,
                                            username: this.state.UserData
                                              .username,
                                            name2: '.',
                                            profileImage: this.state.UserData
                                              .profileImage,
                                          });
                                        } else {
                                          filtered.push({
                                            Id: this.state.UserData.Id,
                                            name: this.state.UserData.name,
                                            name2: '.',
                                            username: this.state.UserData
                                              .username,
                                          });
                                        }

                                        item.receivedata = filtered;
                                        // this.setState({isLoading:true})
                                        // console.log(item);
                                        await saveData('Users', item.Id, {
                                          receivedata: filtered,
                                        }).then(() => {
                                          // this.GetUserData();
                                        });
                                      } else {
                                        item.receivedata = [
                                          this.state.UserData,
                                        ];
                                        // this.setState({isLoading:true})
                                        if (
                                          this.state.UserData.profileImage !==
                                          undefined
                                        ) {
                                          await saveData('Users', item.Id, {
                                            Id: this.state.UserData.Id,
                                            name: this.state.UserData.name,
                                            name2: '.',
                                            username: this.state.UserData
                                              ?.username,
                                            profileImage:
                                              this.state.UserData
                                                ?.profileImage !== undefined &&
                                              this.state.UserData
                                                ?.profileImage !== ''
                                                ? this.state.UserData
                                                    ?.profileImage
                                                : '',
                                          }).then(() => {
                                            // //this.GetUserData();
                                          });
                                        } else {
                                          await saveData('Users', item.Id, {
                                            Id: this.state.UserData?.Id,
                                            name: this.state.UserData?.name,
                                            name2: '.',
                                            username: this.state.UserData
                                              ?.username,
                                          }).then(() => {
                                            // //this.GetUserData();
                                          });
                                        }
                                      }
                                      // this.setState({isLoading:true})
                                      let filtered2 = sentdata.filter(function (
                                        el,
                                      ) {
                                        return el != null;
                                      });
                                      // console.log(filtered2);
                                      await saveData('Users', Id, {
                                        sentdata: filtered2,
                                      }).then(() => {
                                        // //this.GetUserData();
                                      });
                                    } else {
                                      this.setState({isLoading: false});
                                      // alert('already Request Sent to ' + item.name);
                                    }
                                  } else {
                                    this.setState({isLoading: false});
                                    // alert('already Following ' + item.name);
                                  }
                                }
                              }}>
                              <Text style={styles.flag2followTextStyle}>
                                FOLLOW
                              </Text>
                            </TouchableOpacity>
                          )}
                        </View>
                        <TouchableOpacity
                          onPress={async () => {
                            let FollowList = this.state.followersdata;
                            let Id = await AsyncStorage.getItem('Token');
                            FollowList.splice(index, 1);
                            // console.log("on unfollow ===>>", JSON.stringify(FollowList, null, 2));
                            this.setState({
                              followersdata: this.state.followersdata.filter(
                                (it) => it != item,
                              ),
                              flag2: false,
                              flag2: true,
                            });
                            await saveData('Users', Id, {
                              followersdata: FollowList,
                            });
                            let OtherUserData = await getData('Users', item.Id);
                            let OldList = OtherUserData.followingdata;
                            let RemoveIndex = this.IndexinArray(Id, OldList);
                            OldList.splice(RemoveIndex, 1);
                            OtherUserData.followingdata = OldList;
                            await saveData('Users', item.Id, OtherUserData);
                          }}
                          style={{
                            marginLeft: responsiveWidth(3.5),
                          }}>
                          <Text
                            style={[
                              {
                                color: '#979797',
                                fontSize: responsiveFontSize(1.5),
                                fontFamily: 'Lato-Bold',
                              },
                            ]}>
                            REMOVE
                          </Text>
                        </TouchableOpacity>
                      </TouchableOpacity>
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
                    You do not have any followers.
                  </Text>
                </View>
              )
            ) : null}
            {/* {console.log('ye aya follower data', this.state.followersdata)} */}
            {flag3 ? (
              this.state.followingdata.length > 0 ? (
                <FlatList
                  showsScrollIndicator="false"
                  data={this.state.followingdata}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('UserDetails', {
                            User: item,
                          })
                        }
                        style={styles.cardview}>
                        <View style={{flexDirection: 'row'}}>
                          {item.profileImage !== undefined &&
                          item.profileImage !== '' ? (
                            <Image
                              source={{uri: item.profileImage}}
                              style={styles.profileimage1}></Image>
                          ) : (
                            <Image
                              source={require('../../../Assets/sneakerlog_profile.png')}
                              style={styles.profileimage1}></Image>
                          )}

                          <View
                            style={{
                              marginLeft: responsiveWidth(3),
                              marginTop: responsiveWidth(0.5),
                            }}>
                            <Text style={styles.profiletext}>{item.name}</Text>
                            <Text style={styles.profiletext1}>
                              {item.username}
                            </Text>
                          </View>
                        </View>

                        <TouchableOpacity
                          onPress={async () => {
                            let FollowList = this.state.followingdata;
                            let Id = await AsyncStorage.getItem('Token');
                            FollowList.splice(index, 1);
                            this.setState({
                              followingdata: this.state.followingdata.filter(
                                (a) => a != item,
                              ),
                            });
                            await saveData('Users', Id, {
                              followingdata: FollowList,
                            }).then(() => {
                              //this.GetUserData();
                            });
                            let OtherUserData = await getData('Users', item.Id);
                            let OldList = OtherUserData.followersdata;
                            let RemoveIndex = this.IndexinArray(Id, OldList);
                            OldList.splice(RemoveIndex, 1);
                            OtherUserData.followersdata = OldList;
                            await saveData(
                              'Users',
                              item.Id,
                              OtherUserData,
                            ).then(() => {});
                          }}
                          style={{
                            marginLeft: responsiveWidth(15),
                          }}>
                          <Text
                            style={[
                              {
                                color: '#979797',
                                fontSize: responsiveFontSize(1.5),
                                fontFamily: 'Lato-Bold',
                              },
                            ]}>
                            UNFOLLOW
                          </Text>
                        </TouchableOpacity>
                      </TouchableOpacity>
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
                    You are not following anyone.
                  </Text>
                </View>
              )
            ) : null}
            {/* {console.log('ye aya following data', this.state.followingdata)} */}
            {flag4 ? (
              this.state.sentdata.length > 0 ? (
                <FlatList
                  showsScrollIndicator={'false'}
                  data={this.state.sentdata}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('UserDetails', {
                            User: item,
                          })
                        }
                        style={styles.cardview}>
                        <View style={{flexDirection: 'row'}}>
                          {item.profileImage !== undefined &&
                          item.profileImage !== '' ? (
                            <Image
                              source={{uri: item.profileImage}}
                              style={styles.profileimage1}></Image>
                          ) : (
                            <Image
                              source={require('../../../Assets/sneakerlog_profile.png')}
                              style={styles.profileimage1}></Image>
                          )}
                          <View
                            style={{
                              marginLeft: responsiveWidth(3),
                              marginTop: responsiveWidth(0.5),
                            }}>
                            <Text style={styles.profiletext}>{item.name}</Text>
                            <Text style={styles.profiletext1}>
                              {item.username}
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={async () => {
                            let FollowList = this.state.sentdata;
                            let Id = await AsyncStorage.getItem('Token');
                            FollowList.splice(index, 1);
                            const a = this.state.data.map((d) => {
                              if (d.Id == item.Id) {
                                return {...d, CurrentS: 'FOLLOW'};
                              } else {
                                return d;
                              }
                            });
                            this.setState({
                              sentdata: this.state.sentdata.filter(
                                (it) => it != item,
                              ),
                              data: a,
                            });
                            await saveData('Users', Id, {
                              sentdata: FollowList,
                            });
                            OtherUserData = await getData('Users', item.Id);
                            let OldList = OtherUserData.receivedata;
                            let RemoveIndex = this.IndexinArray(Id, OldList);
                            OldList.splice(RemoveIndex, 1);
                            OtherUserData.receivedata = OldList;
                            await saveData('Users', item.Id, OtherUserData);
                          }}
                          style={{
                            marginLeft: responsiveWidth(15),
                          }}>
                          <Text
                            style={{
                              fontSize: responsiveFontSize(1.5),
                              fontFamily: 'Lato-Bold',
                              color: '#979797',
                            }}>
                            WITHDRAW
                          </Text>
                        </TouchableOpacity>
                      </TouchableOpacity>
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
                    You have not sent any invites.
                  </Text>
                </View>
              )
            ) : null}
            {flag5 ? (
              this.state.receivedata.length > 0 ? (
                <FlatList
                  showsScrollIndicator="false"
                  data={this.state.receivedata}
                  renderItem={({item, index}) => {
                    return (
                      <TouchableOpacity
                        onPress={() =>
                          this.props.navigation.navigate('UserDetails', {
                            User: item,
                          })
                        }
                        style={styles.cardview}>
                        <View style={{flexDirection: 'row'}}>
                          {item.profileImage !== undefined &&
                          item.profileImage !== '' ? (
                            <Image
                              source={{uri: item.profileImage}}
                              style={styles.profileimage1}></Image>
                          ) : (
                            <Image
                              source={require('../../../Assets/sneakerlog_profile.png')}
                              style={styles.profileimage1}></Image>
                          )}
                          {/* here */}
                          <View
                            style={{
                              width: responsiveWidth(40),
                              left: responsiveWidth(3),
                              marginTop: responsiveWidth(0.8),
                            }}>
                            <Text style={styles.profiletext}>{item.name}</Text>
                            <Text style={styles.profiletext1}>
                              {item.username}
                            </Text>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={async () => {
                            let FollowList = this.state.receivedata;
                            let Id = await AsyncStorage.getItem('Token');
                            FollowList.splice(index, 1);
                            await saveData('Users', Id, {
                              receivedata: FollowList,
                            }).then(() => {
                              //this.GetUserData();
                            });
                            let OtherUserData = await getData('Users', item.Id);
                            let OldList = OtherUserData.sentdata;

                            let RemoveIndex = this.IndexinArray(Id, OldList);
                            OldList.splice(RemoveIndex, 1);
                            OtherUserData.sentdata = OldList;
                            await saveData(
                              'Users',
                              item.Id,
                              OtherUserData,
                            ).then(() => {
                              //this.GetUserData();
                            });
                            // this.componentDidMount();
                            console.log(
                              '==>>',
                              JSON.stringify(FollowList, null, 2),
                            );
                            this.setState({
                              receivedata: this.state.receivedata.filter(
                                (it) => it != item,
                              ),
                            });

                            // alert('request decline');
                          }}
                          style={{
                            marginTop: responsiveWidth(4),
                          }}>
                          <Text
                            style={[
                              {
                                color: '#979797',
                                fontFamily: 'Lato-Bold',
                                fontSize: responsiveFontSize(1.5),
                              },
                            ]}>
                            DECLINE
                          </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={async () => {
                            if (flag == true) {
                              null;
                            } else {
                              flag = true;
                              let FollowList = this.state.receivedata;
                              let FollowerList = this.state.followersdata;
                              let alreadyExist = false;
                              let OldList = [];
                              FollowerList.forEach((element) => {
                                if (element.id == item.Id) {
                                  alreadyExist = true;
                                }
                              });
                              let Id = await AsyncStorage.getItem('Token');
                              FollowList.splice(index, 1);
                              if (!alreadyExist) {
                                if (item?.profileImage !== undefined) {
                                  FollowerList.push({
                                    Id: item.Id,
                                    name: item.name,
                                    username: item.username,
                                    name2: '.',
                                    profileImage:
                                      item?.profileImage !== undefined
                                        ? item.profileImage
                                        : '',
                                  });
                                } else {
                                  FollowerList.push({
                                    Id: item.Id,
                                    name: item.name,
                                    name2: '.',
                                    username: item.username,
                                  });
                                }

                                this.setState({
                                  receivedata: this.state.receivedata.filter(
                                    (it) => it != item,
                                  ),
                                  followersdata: FollowerList,
                                });
                                await saveData('Users', Id, {
                                  receivedata: FollowList,
                                  followersdata: FollowerList,
                                }).then(() => {
                                  //this.GetUserData();
                                });
                                let OtherUserData = await getData(
                                  'Users',
                                  item?.Id,
                                );
                                // console.log(OtherUserData);
                                OldList = OtherUserData.sentdata;

                                if (OtherUserData.followingdata) {
                                  if (
                                    this.state.UserData?.profileImage !==
                                    undefined
                                  ) {
                                    OtherUserData.followingdata.push({
                                      Id: this.state.UserData.Id,
                                      name: this.state.UserData.name,
                                      name2: '.',
                                      username: this.state.UserData.username,
                                      profileImage: this.state.UserData
                                        .profileImage,
                                    });
                                  } else {
                                    OtherUserData.followingdata.push({
                                      Id: this.state.UserData.Id,
                                      name: this.state.UserData.name,
                                      name2: '.',
                                      username: this.state.UserData.username,
                                    });
                                  }
                                } else {
                                  if (
                                    this.state.UserData?.profileImage !==
                                    undefined
                                  ) {
                                    OtherUserData.followingdata.push({
                                      Id: this.state.UserData?.Id,
                                      name: this.state.UserData?.name,
                                      name2: '.',
                                      username: this.state.UserData?.username,
                                      profileImage: this.state.UserData
                                        ?.profileImage,
                                    });
                                  } else {
                                    OtherUserData.followingdata.push({
                                      Id: this.state.UserData?.Id,
                                      name: this.state.UserData?.name,
                                      name2: '.',
                                      username: this.state.UserData?.username,
                                    });
                                  }
                                }
                                let RemoveIndex = await this.IndexinArray(
                                  Id,
                                  OldList,
                                );
                                OldList.splice(RemoveIndex, 1);
                                OtherUserData.sentdata = OldList;
                                // console.log(OtherUserData);
                                await saveData(
                                  'Users',
                                  item?.Id,
                                  OtherUserData,
                                ).then(() => {
                                  // console.log('sent remove');
                                  //this.GetUserData();
                                });
                              }
                            }
                          }}
                          style={{
                            marginTop: responsiveWidth(4),
                          }}>
                          <Text
                            style={[
                              {
                                fontFamily: 'Lato-Bold',
                                color: 'red',
                                fontSize: responsiveFontSize(1.5),
                              },
                            ]}>
                            ACCEPT
                          </Text>
                        </TouchableOpacity>
                      </TouchableOpacity>
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
                    You have not received any invites.
                  </Text>
                </View>
              )
            ) : null}
          </ScrollView>
        )}
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
    marginLeft: responsiveWidth(20),
    marginTop: responsiveWidth(7),
  },
  SearchbarView: {
    marginTop: responsiveWidth(2),
    marginBottom: responsiveWidth(2),
    elevation: 0,
    borderRadius: responsiveWidth(8),
    borderColor: '#979797',
    borderWidth: responsiveWidth(0.3),
    height: responsiveHeight(7),
    width: responsiveWidth(90),
    fontSize: 5,
    margin: 0,
    padding: 0,
    alignSelf: 'center',
  },
  backarrowView: {
    alignSelf: 'center',
    position: 'absolute',
    left: responsiveWidth(5),
    zIndex: 1,
  },
  backarrowimageStyle: {
    height: responsiveWidth(5),
    width: responsiveWidth(6),
    marginTop: responsiveWidth(7),
  },
  logoImageStyle: {
    height: responsiveHeight(4),
    width: responsiveWidth(40),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: responsiveWidth(7),
  },
  logoViewStyle: {
    alignSelf: 'center',
    position: 'absolute',
    left: responsiveWidth(88),
    zIndex: 1,
  },
  profileImageStyle: {
    height: responsiveHeight(4),
    width: responsiveHeight(4),
    borderRadius: responsiveWidth(6),
    marginTop: responsiveWidth(7),
  },
  profileimage: {
    height: responsiveHeight(4),
    width: responsiveHeight(4),
    borderRadius: responsiveWidth(6),
    marginLeft: responsiveWidth(20),
    marginTop: responsiveWidth(7),
    alignSelf: 'center',
  },
  nomemberViewStyle: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  usernameTextStyle: {
    width: responsiveWidth(40),
    left: responsiveWidth(3),
    marginTop: responsiveWidth(0.5),
  },
  usernameTextView: {
    marginLeft: responsiveWidth(3),
    marginTop: responsiveWidth(1),
  },
  bottomcontainer: {
    width: responsiveWidth(90),
    alignSelf: 'center',
  },
  favtext: {
    fontFamily: 'Lato-Bold',
    fontSize: responsiveFontSize(1.8),
  },
  blockedTextStyle: {
    top: responsiveHeight(2),
    fontSize: responsiveFontSize(1.5),
    color: 'red',
    fontFamily: 'Lato-Bold',
  },
  viewtext: {
    fontFamily: 'Lato-Regular',
    fontSize: responsiveFontSize(1.6),
    color: '#D9173B',
    marginRight: responsiveWidth(3),
  },
  inviteSendView: {
    top: 4,
    height: responsiveWidth(6),
    alignItems: 'center',
  },
  cardview: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: responsiveWidth(3),
    alignItems: 'center',
    // backgroundColor:'pink'
  },
  flag2followTextStyle: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: 'Lato-Bold',
    color: '#D9173B',
  },
  buttontext: {
    fontSize: responsiveFontSize(1.9),
    fontFamily: 'Lato-Bold',
  },
  filter: {
    marginTop: responsiveWidth(5),
    flexDirection: 'row',
  },

  profileimage1: {
    height: responsiveHeight(6),
    width: responsiveHeight(6),
    borderRadius: responsiveWidth(6),

    // marginLeft: responsiveWidth(20),
    // marginTop: responsiveWidth(7),
  },
  profiletext: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Lato-Bold',
    marginLeft: responsiveWidth(1.5),
  },
  profiletext1: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: 'Lato-Regular',
    color: '#6C6C6C',
    marginLeft: responsiveWidth(1.5),
  },
  buttontext1: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: 'Lato-Bold',
    color: '#D9173B',
  },
  buttontext5: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: 'Lato-Bold',
    color: '#D9173B',
  },
  followtext: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: 'Lato-Bold',
    color: '#D9173B',
  },
  bar: {
    // height:responsiveHeight(5),
    width: responsiveWidth(20),
    alignItems: 'center',
    // justifyContent: 'center',
    marginRight: responsiveWidth(6),
  },
  barbottom: {
    backgroundColor: 'red',
    height: responsiveHeight(0.5),
    width: responsiveWidth(20),
    borderRadius: responsiveWidth(2),
  },
});
