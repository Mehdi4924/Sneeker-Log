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
  AsyncStorage,
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
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { KeyboardAvoidingView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { getData, getDataOnChange, saveData } from '../../Backend/utility';
import firestore from '@react-native-firebase/firestore';
import { ActivityIndicator } from 'react-native-paper';
export default class UserDetails extends Component {
  state = {
    // UserData: this.props.navigation.getParam('User'),
    UserData: this.props.route.params.User,
    data: [

    ],
    receivedata: [],
    sentdata: [],
    TotalSneaker: 0,
    followingdata: [],
    followersdata: [],
    UserInfo: {},
    isLoading: true,
    Status: "follow",
    userProfilePic: '',
    myFolllowlist: ""

  };

  async componentDidMount() {
    let id = await AsyncStorage.getItem('Token');
    let UserData = await getData('Users', id);
    console.log("ye aya user data", UserData);
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
    await AsyncStorage.setItem('User', JSON.stringify(UserData));
    await this.setState({ UserInfo: UserData });

    let receivedata = (sentdata = followingdata = followersdata = []);
    let Collections = await getData('Collections', this.state.UserData.Id);
    let key = 0;
    let TotalSneaker = 0;
    let CollectionsList = [];
    if (Collections) {
      Collections.Collections.forEach((element) => {
        if (!element.isPrivate) {
          element.key = key;
          key++;
          if (element.SneakerList) {
            TotalSneaker += element.SneakerList.length;
          }
          CollectionsList.push(element);
        }
        // element.fav = true;
      });
      console.log('List : ', Collections.Collections);

      this.setState({ data: CollectionsList, isLoading: false });
    }
    this.setState({ isLoading: false });
    await firestore()
      .collection('Users')
      .doc(this.state.UserData.Id)
      .onSnapshot(async () => {
        let UserData = await getData('Users', this.state.UserData.Id);
        console.log("ye aya userdata2222222", UserData);
        if (UserData) {
          if (UserData.receivedata) {
            receivedata = UserData.receivedata;
          }
          if (UserData.sentdata) {
            sentdata = UserData.sentdata;
          }
          if (UserData.followingdata) {
            followingdata = UserData.followingdata;
          }
          if (UserData.followersdata) {
            followersdata = UserData.followersdata;
          }



          this.setState({
            receivedata: receivedata,
            sentdata: sentdata,
            TotalSneaker: TotalSneaker,
            followersdata: followersdata,
            followingdata: followingdata,
          });
        }
      });
    console.log('uuuuu==>>', JSON.stringify(UserData, null, 2))

    let Id = await AsyncStorage.getItem('Token');
    // let UserData = await getData('Users', Id);
    let receivedata2 = (sentdata2 = followingdata2 = followersdata2 = []);
    await firestore()
      .collection('Users')
      .doc(Id)
      .onSnapshot(async () => {
        let UserData = await getData('Users', Id);
        // console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n New Testinggg',UserData)

        if (UserData) {
          if (UserData.receivedata) {
            receivedata2 = UserData.receivedata;
          }
          if (UserData.sentdata) {
            sentdata2 = UserData.sentdata;
          }
          if (UserData.followingdata) {
            followingdata2 = UserData.followingdata;
          }
          if (UserData.followersdata) {
            followersdata2 = UserData.followersdata;
          }
          if (!(await this.FindinArray(this.state.UserData.Id,
            UserData.followingdata,
          ))) {
            this.setState({ Status: 'Following' })
          } else {
            if (await this.FindinArray(
              this.state.UserData.Id,
              UserData.sentdata,
            )) {
              this.setState({ Status: 'Follow' })
            } else {
              this.setState({ Status: "Invite Sent" })
            }
          }
          this.setState({
            UserData2: UserData,
            receivedata2: receivedata2,
            sentdata2: sentdata2,
            followersdata2: followersdata2,
            followingdata2: followingdata2,
          });
        }
      });


  }
  async FindinArray(Id, ObjList) {
    let Flag = true;
    ObjList.forEach((element) => {
      if (element.Id === Id) {
        Flag = false;
      }
    });
    console.log(Flag);
    return Flag;
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent></StatusBar>

        <ScrollView
          style={styles.bottomcontainer}
          showsVerticalScrollIndicator={false}>

          {this.state?.UserData?.profileImage &&
            this.state?.UserData?.profileImage !== '' ? (
            <Image
              source={{ uri: this.state?.UserData.profileImage }}
              style={styles.profileimage1}></Image>
          ) : (
            <Image
              source={require('../../../Assets/sneakerlog_profile.png')}
              style={styles.profileimage1}></Image>
          )}
          <Text style={styles.profiletext}>{this.state.UserData.name}</Text>
          <Text style={styles.text}>{this.state.UserData.username}</Text>
          <TouchableOpacity
            onPress={async () => {
              // console.log('param wala user', JSON.stringify(this.state.UserData, null, 2))
              if (this.state.Status == 'Following') {
                // const newfoloowinglist = this.state.UserInfo.followingdata.filter(item => item.id == this.state.UserData?.Id)
                // const newUserData = { ...this.state.UserInfo, followingdata: newfoloowinglist }
                // const myUserNewFollowerList = this.state.UserData.followersdata.filter(item => item.id == this.state.UserInfo?.Id)
                // const myNewData = { ...this.state.UserData, followersdata: myUserNewFollowerList }
                // console.log(JSON.stringify(this.state.UserInfo, null, 2), 'My user new data====>>>>', JSON.stringify(newUserData, null, 2));
                // //   await saveData('Users', this.state.UserData.Id, myNewData);
                // //   await saveData('Users', this.state.UserInfo.Id, newUserData);
                // //   this.setState({ UserInfo: newUserData, UserData: myNewData })
              } else if (this.state.Status == 'Follow') {
                let myRequestList = this.state.UserInfo.sentdata
                let otherRequestList = this.state.UserData.receivedata
                myRequestList = [...this.state.UserInfo.sentdata, {
                  Id: this?.state?.UserData?.Id,
                  name: this?.state?.UserData?.username,
                  profileImage: this?.state?.UserData?.profileImage || "",
                  username: this?.state?.UserData?.username,
                }]
                const newMyUserList = { ...this.state.UserInfo, sentdata: myRequestList }
                otherRequestList = [
                  ...this?.state?.UserData?.receivedata, {
                    Id: this?.state?.UserInfo?.Id,
                    name: this?.state?.UserInfo?.username,
                    profileImage: this?.state?.UserInfo?.profileImage || '',
                    username: this?.state?.UserInfo?.username,
                  }
                ]
                const newOtherUserList = { ...this.state.UserData, receivedata: otherRequestList }
                console.log('my user', JSON.stringify(this.state.UserInfo, null, 2))
                console.log('new my user Request list', JSON.stringify(newOtherUserList, null, 2))
                await saveData(
                  'Users',
                  this.state.UserInfo.Id,
                  newMyUserList,
                );
                await saveData(
                  'Users',
                  this.state.UserData.Id,
                  newOtherUserList,
                );
                // this.setState({ Status: 'Invite Sent' });
              }

              // let FollowList = this.state.followingdata2;
              // let sentdata = this.state.sentdata2;
              // let Id = await AsyncStorage.getItem('Token');
              // if (
              //   await this.FindinArray(this.state.UserData.Id, FollowList)
              // ) {
              //   if (
              //     await this.FindinArray(this.state.UserData.Id, sentdata)
              //   ) {

              //     if (this.state.UserData.profileImage !== undefined) {
              //       sentdata = [{
              //         Id: this.state.UserData.Id,
              //         name: this.state.UserData.name,
              //         username: this.state.UserData.username,
              //         name2: this.state.UserData.name2,
              //         profileImage: this.state.UserData.profileImage,
              //       }, ...sentdata];
              //     } else {
              //       sentdata = [{
              //         Id: this.state.UserData.Id,
              //         name: this.state.UserData.name,
              //         username: this.state.UserData.username,
              //         name2: this.state.UserData.name2,
              //       }, ...sentdata];
              //     }

              //     this.setState({ sentdata2: sentdata });
              //     let NextUserData = this.state.UserData;
              //     if (NextUserData.followingdata) {
              //       if (this.state.UserData2.profileImage !== undefined) {
              //         NextUserData.followingdata = [
              //           {
              //             Id: this.state.UserData2.Id,
              //             name: this.state.UserData2.name,
              //             username: this.state.UserData2.username,
              //             name2: this.state.UserData2.name2,
              //             profileImage: this.state.UserData2.profileImage,
              //           },
              //           ...NextUserData.followingdata,
              //         ];
              //       } else {
              //         NextUserData.followingdata = [
              //           {
              //             Id: this.state.UserData2.Id,
              //             name: this.state.UserData2.name,
              //             username: this.state.UserData2.username,
              //             name2: this.state.UserData2.name2,
              //           },
              //           ...NextUserData.followingdata,
              //         ];
              //       }
              //  {console.log("ye aya nextuserdata",NextUserData)}
              //       await saveData(
              //         'Users',
              //         this.state.UserData.Id,
              //         NextUserData,
              //       );
              //     } else {
              //       if (this.state.UserData2.profileImage !== undefined) {
              //         NextUserData.followingdata = [
              //           {
              //             Id: this.state.UserData2.Id,
              //             name: this.state.UserData2.name,
              //             username: this.state.UserData2.username,
              //             name2: this.state.UserData2.name2,
              //             profileImage: this.state.UserData2.profileImage,
              //           },
              //         ];
              //       } else {
              //         NextUserData.followingdata = [
              //           {
              //             Id: this.state.UserData2.Id,
              //             name: this.state.UserData2.name,
              //             username: this.state.UserData2.username,
              //             name2: this.state.UserData2.name2,
              //           },
              //         ];
              //       }

              //       await saveData(
              //         'Users',
              //         this.state.UserData.Id,
              //         NextUserData,
              //       );
              //     }
              //     await saveData('Users', Id, { sentdata: sentdata });
              //     await saveData(
              //       'Users',
              //       this.state.UserData.Id,
              //       NextUserData,
              //     );
              //   } else {
              //     alert('already Request Sent! 2');
              //   }
              // } else {
              //   alert('already Following! 3' );
              // }
            }}
            style={styles.butttoncontainer}>
            <Text style={styles.buttontext}>
              {
                this.state.Status
              }
            </Text>
          </TouchableOpacity>
          <View style={styles.bottomcontainer1}>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.bottomtext}>{this.state.TotalSneaker}</Text>
              <Text style={styles.bottomtext1}>SNEAKERS</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.bottomtext}>{this.state.data.length}</Text>
              <Text style={styles.bottomtext1}>COLLECTIONS</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.bottomtext}>
                {this.state.followersdata.length}
              </Text>
              <Text style={styles.bottomtext1}>FOLLOWERS</Text>
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.bottomtext}>
                {this.state.followingdata.length}
              </Text>
              <Text style={styles.bottomtext1}>FOLLOWING</Text>
            </View>
          </View>
          <View style={styles.detailcontainer}>

            {

              this.state.isLoading ?
                <View style={{ alignItems: 'center', width: '100%', marginTop: '30%' }}>
                  <ActivityIndicator color={'black'} size={'large'} />
                </View>
                :
                this.state.data.length > 0 ? (
                  <FlatList
                    showsScrollIndicator={false}
                    data={this.state.data}
                    renderItem={({ item }) => {
                      return (
                        <TouchableOpacity
                          style={styles.cardview1}
                          onPress={() =>
                            // console.log('ye aya item',item)
                            this.props.navigation.navigate(
                              'UserCollectionDetails',
                              { User: this.state.UserData, CurrentCol: item, data: this.state.data },
                            )
                          }>
                          {/* <AntDesign name={'star'} size={25} color={'#F5A623'} style={styles.icon} /> */}
                          <Image
                            style={styles.icon}
                            source={
                              item.fav
                                ? require('../../../Assets/Star.png')
                                : require('../../../Assets/StarUnselected.png')
                            }
                          />
                          <Text style={styles.nametext}>{item.name}</Text>
                          <TouchableOpacity>
                            <Entypo
                              name={'chevron-right'}
                              size={responsiveFontSize(3)}
                              style={{ left: responsiveWidth(1.4) }}
                              color={'#949494'}
                            />
                          </TouchableOpacity>
                        </TouchableOpacity>
                      );
                    }}
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      height: responsiveHeight(30),
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={[
                        styles.favtext,
                        { color: 'gray', fontSize: 20, top: 25 },
                      ]}>
                      No items
                    </Text>
                  </View>
                )}

            <View style={{ height: responsiveHeight(8) }}></View>
          </View>
        </ScrollView>
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
  profileimage: {
    height: responsiveHeight(4),
    width: responsiveHeight(4),
    borderRadius: responsiveWidth(6),
    marginLeft: responsiveWidth(20),
    marginTop: responsiveWidth(7),
    alignSelf: 'center',
  },
  profileimage1: {
    height: responsiveHeight(11),
    width: responsiveHeight(11),
    borderRadius: responsiveWidth(11),
    // marginLeft: responsiveWidth(20),
    marginTop: responsiveWidth(5),
    alignSelf: 'center',
  },
  bottomcontainer: {
    width: responsiveWidth(90),
    alignSelf: 'center',
  },
  favtext: {
    fontFamily: 'Lato-Bold',
    fontSize: responsiveFontSize(1.8),
  },
  viewtext: {
    fontFamily: 'Lato-Regular',
    fontSize: responsiveFontSize(1.6),
    color: '#D9173B',
    marginRight: responsiveWidth(3),
  },

  cardview2: {
    height: responsiveHeight(15),
    width: responsiveWidth(43),
    backgroundColor: '#fff',
    borderWidth: responsiveWidth(0.2),
    borderColor: '#B6BBC8',
    borderRadius: responsiveWidth(2),
    marginTop: responsiveWidth(3),
    // flexDirection: 'row',
    marginRight: responsiveWidth(1),
    marginLeft: responsiveWidth(1),
  },
  datetext: {
    // width: responsiveWidth(7),
    // backgroundColor: 'red',
    // height: responsiveHeight(6),
    marginLeft: responsiveWidth(2),
    fontSize: responsiveFontSize(1.5),
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
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Lato-Regular',
    color: '#6C6C6C',
    alignSelf: 'center',
    marginTop: responsiveWidth(0.5),
  },
  profiletext: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Lato-Bold',
    alignSelf: 'center',
    marginTop: responsiveWidth(2),
  },
  butttoncontainer: {
    alignSelf: 'center',
    marginTop: responsiveWidth(2),
    height: responsiveHeight(4),
    width: responsiveWidth(19),
    borderWidth: responsiveWidth(0.3),
    borderColor: '#D9173B',
    borderRadius: responsiveWidth(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttontext: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Lato-Bold',
    color: '#D9173B',
  },
  bottomtext: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Lato-Bold',
    // color: '#D9173B',
  },
  bottomtext1: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: 'Lato-Bold',
    color: '#6C6C6C',
  },
  bottomcontainer1: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: responsiveWidth(5),
  },
  detailcontainer: {
    width: responsiveWidth(89),
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderWidth: responsiveWidth(0.3),
    borderColor: '#B6BBC8',
    borderRadius: responsiveWidth(2),
    marginVertical: responsiveWidth(5),
  },
  cardview1: {
    width: responsiveWidth(88),
    height: responsiveHeight(8.5),
    //backgroundColor: '#fff',
    borderBottomWidth: responsiveWidth(0.3),
    borderColor: '#B6BBC8',
    borderRadius: responsiveWidth(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    // marginRight: responsiveWidth(5),
    marginLeft: responsiveWidth(1.5),
  },
  icon: {
    // marginLeft: responsiveWidth(3),
    height: responsiveWidth(7),
    width: responsiveWidth(7),
    resizeMode: 'contain',
    marginLeft: responsiveWidth(-2),
    //marginTop:responsiveWidth(2)
  },
  nametext: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Lato-Regular',
    width: responsiveWidth(57),
    //  backgroundColor: 'red',
    marginLeft: responsiveWidth(-3),
  },
});
