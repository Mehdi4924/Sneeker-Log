import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
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
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {KeyboardAvoidingView} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {getData, getDataOnChange, saveData} from '../../Backend/utility';
import firestore from '@react-native-firebase/firestore';
const DefaultImageURL =
  'https://stockx-assets.imgix.net/media/New-Product-Placeholder-Default.jpg?fit=fill&bg=FFFFFF&w=140&h=100&auto=format,compress&trim=color&q=90&dpr=2&updated_at=0';
const DefaultImageURL2 =
  'https://stockx.imgix.net/Reebok-LX8500-Renarts-Dead-End-Kicks-Temp.png?fit=fill&bg=FFFFFF&w=140&h=100&auto=format,compress&trim=color&q=90&dpr=2&updated_at=1538080256';

export default class UserCollectionDetails extends Component {
  state = {
    // UserData: this.props.navigation.getParam('User'),
    UserData: {},
    data: [],
    UserInfo: {},
    isShow:false,
    Status: '',
    Col: 0,
    userProfilePic:''

    // Col: this.props.navigation.getParam('CurrentCol'),
  };

  async componentDidMount() {
    const userId = '9Mi69aGJlSXsfGfx2ZgVvK9lBfG3';
    const Col = 0;
    let UserData2 = await getData('Users', userId);
    let Collections = await getData('Collections', userId);
    let CurrentCol = Collections.Collections[0];
    this.setState({
      UserData: UserData2,
      Col: CurrentCol,
      isShow: true,
    });
    let id = await AsyncStorage.getItem('Token');
    let UserData = await getData('Users', id);
    console.log(UserData);
    await AsyncStorage.setItem('User', JSON.stringify(UserData));
    await this.setState({UserInfo: UserData});
    if (CurrentCol.SneakerList) {
      this.setState({data: CurrentCol.SneakerList});
    }
    await firestore()
      .collection('Users')
      .doc(UserData2.Id)
      .onSnapshot(async () => {
        let UserData = await getData('Users', UserData2.Id);
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
            followersdata: followersdata,
            followingdata: followingdata,
          });
        }
      });

    let Id = await AsyncStorage.getItem('Token');
    // let UserData = await getData('Users', Id);
    let receivedata2 = (sentdata2 = followingdata2 = followersdata2 = []);
    await firestore()
      .collection('Users')
      .doc(Id)
      .onSnapshot(async () => {
        let UserData = await getData('Users', Id);
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
          if (!(await this.FindinArray(UserData2.Id, UserData.followingdata))) {
            this.setState({Status: 'Following'});
          } else {
            if (await this.FindinArray(UserData2.Id, UserData.sentdata)) {
              this.setState({Status: 'Follow'});
            } else {
              this.setState({Status: 'Invite Sent'});
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
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Home')}
            style={{
              alignSelf: 'center',
              position: 'absolute',
              left: responsiveWidth(5),
              zIndex: 1,
            }}>
            <Image
              source={require('../../../Assets/arrowback.png')}
              style={{
                height: responsiveWidth(5),
                width: responsiveWidth(6),
                marginTop: responsiveWidth(7),
              }}
            />
          </TouchableOpacity>
          <Image
            source={require('../../../Assets/Logo.png')}
            style={{
              height: responsiveHeight(4),
              width: responsiveWidth(40),
              resizeMode: 'contain',
              alignSelf: 'center',
              marginTop: responsiveWidth(7),
            }}
          />
            {!this.state.isLoading ? (
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
                this.state.UserInfo.profileImage !== undefined
                  ? {uri: this.state.UserInfo.profileImage}
                  : require('../../../Assets/sneakerlog_profile.png')
              }
              style={{
                height: responsiveHeight(4),
                width: responsiveHeight(4),
                borderRadius: responsiveWidth(6),
                marginTop: responsiveWidth(7),
              }}
            />
          </TouchableOpacity>
            ):(<View></View>)}
        </View>
        {this.state.isShow === true && (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.profileview}>
              {this.state.UserData.profileImage !== undefined &&
              this.state.UserData.profileImage !== '' ? (
                <Image
                  source={
                    this.state.UserData.profileImage !== undefined
                      ? {uri: this.state.UserData.profileImage}
                      : require('../../../Assets/sneakerlog_profile.png')
                  }
                  style={styles.profileimage1}></Image>
              ) : (
                <Image
                  source={
                    this.state.UserData.profileImage !== undefined
                      ? {uri: this.state.UserData.profileImage}
                      : require('../../../Assets/sneakerlog_profile.png')
                  }
                  style={styles.profileimage1}></Image>
              )}
              <View
                style={{
                  width: responsiveWidth(48),
                  marginLeft: responsiveWidth(5),
                  marginTop: responsiveWidth(3),
                }}>
                <Text style={styles.profiletext}>
                  {this.state.UserData.name}
                </Text>
                <Text style={styles.text}>{this.state.UserData.username}</Text>
              </View>
              <TouchableOpacity
                onPress={async () => {
                  let FollowList = this.state.followingdata2;
                  let sentdata = this.state.sentdata2;
                  let Id = await AsyncStorage.getItem('Token');
                  if (
                    await this.FindinArray(this.state.UserData.Id, FollowList)
                  ) {
                    if (
                      await this.FindinArray(this.state.UserData.Id, sentdata)
                    ) {
                      if (this.state.UserData.profileImage !== undefined) {
                        sentdata = [
                          {
                            Id: this.state.UserData.Id,
                            name: this.state.UserData.name,
                            username: this.state.UserData.username,
                            name2: this.state.UserData.name2,
                            profileImage: this.state.UserData.profileImage,
                          },
                          ...sentdata,
                        ];
                      } else {
                        sentdata = [
                          {
                            Id: this.state.UserData.Id,
                            name: this.state.UserData.name,
                            username: this.state.UserData.username,
                            name2: this.state.UserData.name2,
                          },
                          ...sentdata,
                        ];
                      }

                      this.setState({sentdata2: sentdata});
                      let NextUserData = this.state.UserData;
                      if (NextUserData.receivedata) {
                        if (this.state.UserData2.profileImage !== undefined) {
                          NextUserData.receivedata = [
                            {
                              Id: this.state.UserData2.Id,
                              name: this.state.UserData2.name,
                              username: this.state.UserData2.username,
                              name2: this.state.UserData2.name2,
                              profileImage: this.state.UserData2.profileImage,
                            },
                            ...NextUserData.receivedata,
                          ];
                        } else {
                          NextUserData.receivedata = [
                            {
                              Id: this.state.UserData2.Id,
                              name: this.state.UserData2.name,
                              username: this.state.UserData2.username,
                              name2: this.state.UserData2.name2,
                            },
                            ...NextUserData.receivedata,
                          ];
                        }

                        await saveData(
                          'Users',
                          this.state.UserData.Id,
                          NextUserData,
                        );
                      } else {
                        if (this.state.UserData2.profileImage !== undefined) {
                          NextUserData.receivedata = [
                            {
                              Id: this.state.UserData2.Id,
                              name: this.state.UserData2.name,
                              username: this.state.UserData2.username,
                              name2: this.state.UserData2.name2,
                              profileImage: this.state.UserData2.profileImage,
                            },
                          ];
                        } else {
                          NextUserData.receivedata = [
                            {
                              Id: this.state.UserData2.Id,
                              name: this.state.UserData2.name,
                              username: this.state.UserData2.username,
                              name2: this.state.UserData2.name2,
                            },
                          ];
                        }

                        await saveData(
                          'Users',
                          this.state.UserData.Id,
                          NextUserData,
                        );
                      }
                      await saveData('Users', Id, {sentdata: sentdata});
                      // alert('Follow Request Sent!');
                    } else {
                      // alert('already Request Sent!');
                    }
                  } else {
                    // alert('already Following!');
                  }
                }}
                style={styles.butttoncontainer}>
                <Text style={styles.buttontext}>{this.state.Status}</Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                borderWidth: responsiveWidth(0.11),
                borderColor: '#B6BBC8',
                width: responsiveWidth(100),
              }}></View>
            <View style={styles.collectionview}>
              {/* <AntDesign name={'star'} size={25} color={'#F5A623'} /> */}
              {/* <Image
              style={{
                height: responsiveWidth(7),
                width: responsiveWidth(7),
                resizeMode: 'contain',
              }}
              source={require('../../../Assets/Star.png')}
            /> */}
              <Image
                style={{
                  height: responsiveWidth(7),
                  width: responsiveWidth(7),
                  resizeMode: 'contain',
                }}
                source={
                  this.state.Col.fav
                    ? require('../../../Assets/Star.png')
                    : require('../../../Assets/StarUnselected.png')
                }
              />
              <Text style={styles.nametext}>{this.state.Col.name}</Text>
              <TouchableOpacity>
                <Ionicons
                  name={'ios-arrow-down'}
                  size={0}
                  color={'#949494'}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                borderBottomWidth: responsiveWidth(0.11),
                borderBottomColor: '#B6BBC8',
                width: responsiveWidth(100),
              }}></View>
                {console.log("ye aya data ",this.state.data)}
            <View style={styles.detailcontainer}>
              {this.state.data.length > 0 ? (
              
                <FlatList
                  showsScrollIndicator={false}
                  data={this.state.data}
                  renderItem={({item}) => {
                    return (
                      <View style={styles.cardview1}>
                        <Image
                          source={
                            // item.item.media.thumbUrl !== null &&
                            //         item.item.media.thumbUrl !== DefaultImageURL &&
                            //         item.item.media.thumbUrl !== DefaultImageURL2 &&
                            //         item.item.media.thumbUrl !== ''
                            //           ? {uri: item.item.media.thumbUrl}
                            //           : require('../../Assets/placeholder.png')
                            item.media.thumbUrl !== '' &&
                            item.media.thumbUrl !== DefaultImageURL &&
                            item.media.thumbUrl !== DefaultImageURL2 &&
                            item.media.thumbUrl !== undefined
                              ? {uri: item.media.thumbUrl}
                              : require('../../../Assets/placeholder.png')
                          }
                          style={{
                            marginHorizontal: responsiveWidth(1),
                            resizeMode: 'contain',
                            height: responsiveHeight(5),
                            width: responsiveWidth(10),
                          }}></Image>
                        <View
                          style={{
                            width: responsiveWidth(50),
                            marginLeft: responsiveWidth(3),
                          }}>
                          <View style={{flexDirection: 'row'}}>
                            <Text style={styles.text1}>
                              {' '}
                              {/* <Text style={{fontFamily: 'Lato-Bold'}}>{item.brand}</Text> */}
                              {item.title}
                            </Text>
                            {/* <Image
                          style={{
                            height: responsiveWidth(5),
                            width: responsiveWidth(5),
                            resizeMode: 'contain',
                            marginLeft: responsiveWidth(3),
                            marginTop: responsiveWidth(1),
                          }}
                          source={require('../../../Assets/ScannedShoeIndicator.png')}
                        /> */}
                          </View>
                          {/* <Text style={styles.bottomtext}> Size {item.size}</Text> */}
                        </View>
                        {/* <Ionicons name={'ios-arrow-dropdown-circle'} color={'#D0021B'} size={20} style={{ marginRight: responsiveWidth(2) }} /> */}
                        <View
                          style={{
                            height: responsiveWidth(4.5),
                            width: responsiveWidth(4.5),
                            marginRight: responsiveWidth(1),
                          }}
                        />
                        {/* <Image
                      style={{
                        height: responsiveWidth(4.5),
                        width: responsiveWidth(4.5),
                        resizeMode: 'contain',
                        marginRight: responsiveWidth(1),
                      }}
                      source={require('../../../Assets/MarketPriceEven.png')}></Image> */}
                        <Text>${item.retailPrice}</Text>
                      </View>
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
                      {color: 'gray', fontSize: 20, top: 25},
                    ]}>
                    No Sneakers
                  </Text>
                </View>
              )}
              <View style={{height: responsiveHeight(8)}}></View>
            </View>
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
  profileimage: {
    height: responsiveHeight(4),
    width: responsiveHeight(4),
    borderRadius: responsiveWidth(6),
    marginLeft: responsiveWidth(20),
    marginTop: responsiveWidth(7),
    alignSelf: 'center',
  },
  profileimage1: {
    height: responsiveHeight(9),
    width: responsiveHeight(9),
    borderRadius: responsiveWidth(11),
    // marginLeft: responsiveWidth(),
  },
  bottomcontainer: {
    width: responsiveWidth(90),
    alignSelf: 'center',
  },
  profileview: {
    flexDirection: 'row',
    marginVertical: responsiveWidth(5),
    width: responsiveWidth(90),
    alignSelf: 'center',
  },

  text1: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Lato-Regular',
    marginTop: responsiveWidth(1),
  },

  text: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Lato-Regular',
    color: '#6C6C6C',
    marginTop: responsiveWidth(1),
  },
  bottomtext: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Lato-Regular',
    color: '#6C6C6C',
    //marginTop: responsiveWidth(1)
  },
  profiletext: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Lato-Bold',
  },
  butttoncontainer: {
    height: responsiveHeight(4),
    width: responsiveWidth(19),
    borderWidth: responsiveWidth(0.3),
    borderColor: '#D9173B',
    borderRadius: responsiveWidth(1),
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: responsiveWidth(1),
    marginTop: responsiveWidth(3),
  },
  buttontext: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Lato-Bold',
    color: '#D9173B',
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
    // justifyContent: "space-around",
    // marginRight: responsiveWidth(5),
    marginLeft: responsiveWidth(1.5),
  },
  icon: {
    // marginLeft: responsiveWidth(-2),
    //marginTop:responsiveWidth(2)
  },
  nametext: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Lato-Regular',
    marginTop: responsiveWidth(1),
  },
  collectionview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: responsiveWidth(80),
    alignSelf: 'center',
    marginVertical: responsiveWidth(5),
  },
});
