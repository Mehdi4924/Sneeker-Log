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
  AsyncStorage,
} from 'react-native';
import Modal, {
  ModalContent,
  ModalTitle,
  BottomModal,
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
import { Button, Switch } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { getData, saveData } from '../Backend/utility';
export default class AddNewCollection extends Component {
  state = {
    isSwitchOn: true,
    UserInfo: {},
    Collection: this.props.route.params.Collections,
    CurrentCol: this.props.route.params.CurrentCol,
    userProfilePic:''

    // Collection: this.props.navigation.getParam('Collection'),
    // CollectionIndex: this.props.navigation.getParam('CollectionIndex'),
  };
  toggleModal = () => {
    this.componentDidMount();
    this.setState({ modalVisible: !this.state.modalVisible });
  };
  calQuantity(item) {
    var count = 0;
    item.SneakerList.map((item) => {
      count += item.Quantity;
    })
    console.log('\n\n\n\n\n\n\n\n', count)

    return count;
  }
  async componentDidMount() {
    const unsubscribe = this.props.navigation.addListener('focus', async() => {
      this.setState({
        Collection: this.props.route.params?.Collections,
        CurrentCol: this.props.route.params?.CurrentCol,
      })
      await this.GetColFn();
    });
    let id = await AsyncStorage.getItem('Token');
    let UserData = await getData('Users', id);
    console.log(UserData);
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
    await this.setState({ UserInfo: UserData });
  }
  async getFcmFn(Id) {
    let DataFound = await firestore()
      .collection('FCMTokens')
      .doc(Id)
      .get();
    // console.log('ye how found',DataFound);
    this.setState({ FMCtoken: DataFound?._data?.token })
    // this.NotificationFn(DataFound);
  }

  async NotificationFn() {
    const Ndata = {
      to: this.state.FMCtoken,
      collapse_key: 'type_a',
      notification: {
        android: {
          imageUrl: this.state.image,
        },
        title: "A sneaker spreadsheet was created for",
        body: this.props.route.params.collectionname,
        subtitle: "File save in filemanager"

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
        // console.log('ye aya ressss',res);
      })
      .catch(res => {
        // console.log('ye chala');
      })
  }

  async GetColFn(index) {
    console.log("ye aya call krny py", index);
    console.log("ye aya pros", this.props.route.params.CurrentCol);
    let CurrentColCheck = this.props.route.params.CurrentCol;

    this.setState({
      CurrentCol: CurrentColCheck
    })
    console.log("Pervious index:", CurrentColCheck)
    let id = await AsyncStorage.getItem('Token');
    let UserData = await getData('Users', id);
    this.getFcmFn(UserData?.Id);
    // console.log("ye aya user data",UserData.Id);
    this.setState({ userid: UserData?.Id })
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

    let Id = await AsyncStorage.getItem('Token');
    let Collections = await getData('Collections', Id);
    let key = 0;

    if (Collections) {
      Collections.Collections.forEach((element) => {
        element.key = key;
        // element.fav = true;
        key++;
      });
      // console.log('List : ', Collections.Collections);

      this.setState({ sourcedata: Collections.Collections, });
      if (
        Collections.Collections[CurrentColCheck].SneakerList !== undefined
      ) {
        console.log(
          'ALl sneakers = ', Collections.Collections[CurrentColCheck].SneakerList
        );
        await this.setState({
          // dataLoad: true,
          // CurrentCol:CurrentColCheck,
          // Copydata: Collections.Collections[CurrentColCheck].SneakerList,
          data2: Collections.Collections[CurrentColCheck].SneakerList,
          Filterdata:
            Collections.Collections[CurrentColCheck].SneakerList,
        });

        let arr = []
        Collections.Collections[CurrentColCheck].SneakerList.map((data, i) => {
          if (data.image) {
            let media = {
              thumbUrl: data.image.thumbnail,
            }
            data.media = media
            data.title = data.name
            arr.push(data)
            this.setState({
              data2: arr,
              dataLoad: true,

            })
          }
          else {
            this.setState({
              dataLoad: true,
              CurrentCol: CurrentColCheck,
              Copydata: Collections.Collections[CurrentColCheck].SneakerList,
              data2: Collections.Collections[CurrentColCheck].SneakerList,
              Filterdata:
                Collections.Collections[CurrentColCheck].SneakerList,
            });
            // console.log('uuuuu filtr',Filterdata);
          }
        })

      } else {
        this.setState({
          dataLoad: true,
          CurrentCol: CurrentColCheck,
          data2: [],
          Copydata: [],
        });
      }
      // this.forceUpdate();
    }
  }
  async GetColFn2(index) {
    console.log("ye aya call krny py", index);

    let CurrentColCheck = index;

    this.setState({
      CurrentCol: CurrentColCheck
    })
    console.log("Pervious index:", CurrentColCheck)
    let id = await AsyncStorage.getItem('Token');
    let UserData = await getData('Users', id);
    this.getFcmFn(UserData?.Id);
    // console.log("ye aya user data",UserData.Id);
    this.setState({ userid: UserData?.Id })
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

    let Id = await AsyncStorage.getItem('Token');
    let Collections = await getData('Collections', Id);
    let key = 0;

    if (Collections) {
      Collections.Collections.forEach((element) => {
        element.key = key;
        // element.fav = true;
        key++;
      });
      // console.log('List : ', Collections.Collections);

      this.setState({ sourcedata: Collections.Collections, });
      if (
        Collections.Collections[CurrentColCheck].SneakerList !== undefined
      ) {
        console.log(
          'ALl sneakers = ', Collections.Collections[CurrentColCheck].SneakerList
        );
        await this.setState({
          // dataLoad: true,
          // CurrentCol:CurrentColCheck,
          // Copydata: Collections.Collections[CurrentColCheck].SneakerList,
          data2: Collections.Collections[CurrentColCheck].SneakerList,
          Filterdata:
            Collections.Collections[CurrentColCheck].SneakerList,
        });

        let arr = []
        Collections.Collections[CurrentColCheck].SneakerList.map((data, i) => {
          if (data.image) {
            let media = {
              thumbUrl: data.image.thumbnail,
            }
            data.media = media
            data.title = data.name
            arr.push(data)
            this.setState({
              data2: arr,
              dataLoad: true,

            })
          }
          else {
            this.setState({
              dataLoad: true,
              CurrentCol: CurrentColCheck,
              Copydata: Collections.Collections[CurrentColCheck].SneakerList,
              data2: Collections.Collections[CurrentColCheck].SneakerList,
              Filterdata:
                Collections.Collections[CurrentColCheck].SneakerList,
            });
            // console.log('uuuuu filtr',Filterdata);
          }
        })

      } else {
        this.setState({
          dataLoad: true,
          CurrentCol: CurrentColCheck,
          data2: [],
          Copydata: [],
        });
      }
      // this.forceUpdate();
    }
  }

  _onToggleSwitch = () =>
    this.setState((state) => ({ isSwitchOn: !state.isSwitchOn }));
  render() {
    const { isSwitchOn, CurrentCol, Collection } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent></StatusBar>
        {/* <View style={styles.header}>
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
                this.state.userProfilePic && this.state.userProfilePic != ''
                  ? {uri: this.state.userProfilePic} 
                  : this.state.UserInfo.profileImage !== undefined ? 
                  {uri: this.state.UserInfo.profileImage} :
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
            ):(<View></View>)}
        </View> */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.cardview}>
            <TouchableOpacity
              onPress={async () => {
                let List = Collection;
                List[CurrentCol].fav = !List[CurrentCol]
                  .fav;
                console.log(List[CurrentCol]);
                let Id = await AsyncStorage.getItem('Token');
                await saveData('Collections', Id, { Collections: List });
                this.setState({ Collection: List });
                this.forceUpdate();
              }}
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
                  Collection[CurrentCol].fav
                    ? require('../../Assets/Star.png')
                    : require('../../Assets/StarUnselected.png')
                }
              />
            </TouchableOpacity>
            <Text
              style={[
                styles.nametext,
                {
                  // textTransform: 'capitalize',
                  width: responsiveWidth(40),
                  textAlign: 'center',
                },
              ]}>
              {Collection[CurrentCol].name}
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
              }}
              >
              <Ionicons
                name={'ios-arrow-down'}
                size={25}
                color={'#949494'}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: 1,
              borderColor: '#B6BBC8',
              width: responsiveWidth(100),
            }}></View>
          {Collection[CurrentCol].SneakerList === undefined ||
            Collection[CurrentCol].SneakerList.length === 0 ? (
            <View style={{ marginVertical: responsiveWidth(3) }}>
              <Text style={styles.collectiontext}>
                YOUR COLLECTION IS EMPTY.
              </Text>
              <Text style={[styles.nametext, { textAlign: 'center', bottom: 5 }]}>
                Let's do something about that!
              </Text>
            </View>
          ) : null}

          <View style={styles.collectioncontainer}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('SearchCollection', {
                  Collections: Collection,
                  CurrentCol: CurrentCol,
                })
              }>
              <Image
                style={{
                  height: responsiveWidth(8),
                  width: responsiveWidth(11),
                  resizeMode: 'contain',
                }}
                source={require('../../Assets/SearchSneakers.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('SearchCollection', {
                  Collections: Collection,
                  CurrentCol: CurrentCol,
                })
              }>
              <Text style={styles.text}>SEARCH SNEAKERS</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.collectioncontainer1}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('AddSneaker', {
                  Collections: Collection,
                  CurrentCol: CurrentCol,
                })
              }>
              <Image
                style={{
                  height: responsiveWidth(10),
                  width: responsiveWidth(13),
                  resizeMode: 'contain',
                }}
                source={require('../../Assets/BarcodeInfrared.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('AddSneaker', {
                  Collections: Collection,
                  CurrentCol: CurrentCol,
                })
              }>
              <Text style={styles.text}>ADD SNEAKERS</Text>
            </TouchableOpacity>
          </View>
          {/* ................................... bbbbbbbbbbbb00tom*/}
          <BottomModal
          animationType={'pokeman'}
          transparent={false}
          // transparent={true}
          height={responsiveHeight(73)}
          visible={this.state.modalVisible}
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
            {/* {console.log("ye aya soucer data", JSON.stringify(this.state.sourcedata, null, 2))} */}
            <FlatList
              showsScrollIndicator={false}
              data={this.state.sourcedata}
              renderItem={({ item, index }) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      // if (item.name == 'Random Jordon Collection') {
                      
                      this.setState({
                        CurrentCol: index,
                        data2: item.SneakerList,
                      });
                      this.toggleModal();
                      this.GetColFn2(index);
                      // }
                    }}
                    style={styles.cardview1}>
                    <Image
                      style={{
                        marginLeft: responsiveWidth(0.2),
                        // marginBottom: responsiveWidth(3.5),
                        resizeMode: 'contain',
                        height: responsiveWidth(7),
                        width: responsiveWidth(7),
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
                          <View
                            style={{
                              flexDirection: 'row',
                              height: responsiveHeight(3.5),
                              alignItems: 'center',
                            }}>
                            <Text
                              style={[
                                {
                                  fontFamily: 'Lato-Bold',
                                  color: 'black',
                                  fontSize: responsiveFontSize(1.75),
                                  top: responsiveHeight(0.05)
                                },
                              ]}>
                              {item.name}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              height: responsiveHeight(3),
                              alignItems: 'center',
                              bottom: responsiveHeight(0.4)
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
                            <View style={styles.privatecontainer2}>
                              <Image
                                source={require('../../Assets/pvt.png')}
                                style={{
                                  height: 20,
                                  width: 20,
                                  resizeMode: 'contain',
                                  marginLeft: 5,
                                  top: 1,
                                }}
                              />
                            </View>
                          </View>
                        </View>
                      ) : (
                        <View style={{ marginLeft: responsiveWidth(4) }}>
                          <View
                            style={{
                              flexDirection: 'row',
                              height: responsiveHeight(3.5),
                              alignItems: 'center',
                            }}>
                            <Text
                              style={[
                                {
                                  fontFamily: 'Lato-Bold',
                                  color: 'black',
                                  fontSize: responsiveFontSize(1.75),
                                  top: responsiveHeight(0.05)
                                },
                              ]}>
                              {item.name}
                            </Text>
                          </View>
                          <View
                            style={{
                              flexDirection: 'row',
                              height: responsiveHeight(3),
                              alignItems: 'center',
                              bottom: responsiveHeight(0.4)
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
                          </View>
                        </View>
                      )}
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        // if (item.name == 'Random Jordon Collection') {
                        this.setState({
                          CurrentCol: index,
                          data2: item.SneakerList,
                        });
                        this.toggleModal();
                        // }
                      }}>
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
          </ModalContent>
        </BottomModal>
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

  bottomcontainer: {
    width: responsiveWidth(90),
    alignSelf: 'center',
  },

  icon: {
    // marginLeft: responsiveWidth(-2),
    //marginTop:responsiveWidth(2)
  },
  nametext: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Lato-Regular',
    marginTop: responsiveWidth(1),
  },
  cardview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: responsiveWidth(80),
    alignSelf: 'center',
    marginVertical: responsiveWidth(5),
  },
  collectiontext: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'Lato-Black',
    marginTop: responsiveWidth(7),
  },
  collectiontext1: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(1.9),
    fontFamily: 'Lato-Regular',
  },
  privatetext: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Lato-Bold',
    marginRight: responsiveWidth(2),
    marginTop: responsiveWidth(1),
  },
  collectioncontainer: {
    width: responsiveWidth(90),
    alignSelf: 'center',
    backgroundColor: '#fff',
    height: responsiveHeight(21),
    borderWidth: responsiveWidth(0.3),
    borderColor: '#B6BBC8',
    borderRadius: responsiveWidth(2),
    marginTop: responsiveWidth(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Lato-Bold',
    color: '#D9173B',
    marginTop: responsiveWidth(1),
  },
  collectioncontainer1: {
    width: responsiveWidth(90),
    alignSelf: 'center',
    backgroundColor: '#fff',
    height: responsiveHeight(21),
    borderWidth: responsiveWidth(0.3),
    borderColor: '#B6BBC8',
    borderRadius: responsiveWidth(2),
    marginTop: responsiveWidth(6),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardview1: {
    width: responsiveWidth(88),
    height: responsiveHeight(9),
    //backgroundColor: '#fff',
    borderBottomWidth: responsiveWidth(0.3),
    borderColor: '#B6BBC8',
    // borderRadius: responsiveWidth(2),
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: "space-around",
    // marginRight: responsiveWidth(5),
    marginLeft: responsiveWidth(1.5),
  },
});
