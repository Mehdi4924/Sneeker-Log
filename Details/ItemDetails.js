import React, {Component} from 'react';
import {
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
import Modal, {ModalContent, BottomModal} from 'react-native-modals';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
// import Carousel from 'react-native-snap-carousel';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {saveData, getData, updateField} from '../Backend/utility';
import * as Animatable from 'react-native-animatable';

import moment from 'moment';
const DefaultImageURL =
  'https://stockx-assets.imgix.net/media/New-Product-Placeholder-Default.jpg?fit=fill&bg=FFFFFF&w=140&h=100&auto=format,compress&trim=color&q=90&dpr=2&updated_at=0';
const DefaultImageURL2 =
  'https://stockx.imgix.net/Reebok-LX8500-Renarts-Dead-End-Kicks-Temp.png?fit=fill&bg=FFFFFF&w=140&h=100&auto=format,compress&trim=color&q=90&dpr=2&updated_at=1538080256';

export default class ItemDetails extends Component {
  state = {
    isSwitchOn: true,
    overlay: false,
    searchQuery: '',
    showAlert: false,
    showAlert2: false,
    marginBottom: 5,
    LastSneaker: '',
    Quantity: 1,
    // this.props.route.params.
    // sourcedata: this.props.navigation.getParam('Collections'),
    // CurrentCol: this.props.navigation.getParam('CurrentCol'),
    // CurrentSneaker: this.props.navigation.getParam('CurrentSneaker'),
    sourcedata: this.props.route.params.Collections,
    CurrentCol: this.props.route.params.CurrentCol,
    CurrentSneaker: this.props.route.params.CurrentSneaker,
    data: [
      // {
      //   image: require('../../Assets/shoes.png'),
      //   name: 'Air Jordan 1',
      //   company: 'Nike',
      //   size: 10,
      //   discount: true,
      //   instock: true,
      //   price: 230,
      //   limited: false,
      //   collection: 'New',
      //   year: 2017,
      // },
      // {
      //   image: require('../../Assets/products/product3.jpg'),
      //   name: 'Air Jordan 1',
      //   company: 'Nike',
      //   size: 10,
      //   discount: true,
      //   instock: true,
      //   price: 230,
      //   limited: true,
      //   collection: 'New',
      //   year: 2017,
      // },
      // {
      //   image: require('../../Assets/products/product4.jpg'),
      //   name: 'Air Jordan 8',
      //   company: 'Nike',
      //   size: 10,
      //   discount: true,
      //   instock: false,
      //   price: 230,
      //   limited: true,
      //   collection: 'New',
      //   year: 2019,
      // },
      // {
      //   image: require('../../Assets/products/product2.png'),
      //   name: 'Air Jordan 10',
      //   company: 'Nike',
      //   size: 10,
      //   discount: true,
      //   instock: true,
      //   price: 230,
      //   limited: false,
      //   collection: 'old',
      //   year: 2014,
      // },
      // {
      //   image: require('../../Assets/shoes.png'),
      //   name: 'Air Jordan 16',
      //   company: 'Nike',
      //   size: 10,
      //   discount: true,
      //   instock: false,
      //   price: 230,
      //   limited: true,
      //   collection: 'New',
      //   year: 2015,
      // },
      // {
      //   image: require('../../Assets/products/product1.png'),
      //   name: 'Air Jordan 30',
      //   company: 'Nike',
      //   size: 10,
      //   discount: true,
      //   instock: true,
      //   price: 230,
      //   limited: false,
      //   collection: 'Old',
      //   year: 2016,
      // },
      // {
      //   image: require('../../Assets/products/product2.png'),
      //   name: 'Air Jordan 13',
      //   company: 'Nike',
      //   size: 8,
      //   discount: true,
      //   instock: false,
      //   price: 230,
      //   limited: true,
      //   collection: 'New',
      //   year: 2019,
      // },
      // {
      //   image: require('../../Assets/products/product3.jpg'),
      //   name: 'Air Jordan 4',
      //   company: 'Nike',
      //   size: 13,
      //   discount: true,
      //   instock: true,
      //   price: 230,
      //   limited: false,
      //   collection: 'Old',
      //   year: 2013,
      // },
      // {
      //   image: require('../../Assets/products/product4.jpg'),
      //   name: 'Air Jordan 1',
      //   company: 'Nike',
      //   size: 10,
      //   discount: true,
      //   instock: true,
      //   price: 230,
      //   limited: true,
      //   collection: 'New',
      //   year: 2017,
      // },
    ],
    items2: [
      {label: 'Purchased', value: 'Purchased'},
      {label: 'Sold', value: 'Sold'},
      {label: 'Want', value: 'Want'},
      {label: 'Holy Grail', value: 'Holy Grail'},
      {label: 'Gift', value: 'Gift'},
    ],
    SneakerStatus: 'Purchased',
    datasize: [
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
    size: 0,
    add: false,
    DeleteIndex: 0,
    modalVisibleStart: false,
    modalVisibleStart2: false,
    condition: 'New',
    modalVisible: false,
    modalVisible3: false,
    UserInfo: {},
    modalVisible1: false,
    MoveData: [
      {
        name: 'Yeezy',
        fav: true,
      },
      {
        name: 'Air Jordon Retro Lot',
        fav: true,
      },
      {
        name: 'Random Jordon Collection',
        fav: true,
      },
      {
        name: 'Air Jordon 10',
        fav: false,
      },
      {
        name: 'Air Max',
        fav: false,
      },
      {
        name: 'Nike',
        fav: false,
      },
      {
        name: 'Allen Iversion',
        fav: false,
      },
      {
        name: 'Allen Iversion',
        fav: false,
      },
    ],
    EditSneaker: {},
    userProfilePic: '',
  };
  // setModalVisible(visible) {
  //   this.setState({modalVisible: visible});
  //   this.setState({modalVisibleStart: visible});
  // }
  toggleModal = () => {
    this.setState({modalVisible1: !this.state.modalVisible1});
  };
  _onChangeSearch = (query) => this.setState({searchQuery: query});
  _onToggleSwitch = () =>
    this.setState((state) => ({isSwitchOn: !state.isSwitchOn}));
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
  async componentDidMount() {
    // setTimeout(() => {
    // //   console.log('hello')
    // }, 1000);
    // console.log('Received Data = ',this.props?.route?.params?.Collections)
    // this.setState({
    // sourcedata: this.props?.route?.params?.Collections,
    // CurrentCol: this.props?.route?.params?.CurrentCol,
    // CurrentSneaker: this.props?.route?.params?.CurrentSneaker,
    // })
    let id = await AsyncStorage.getItem('Token');
    let UserData = await getData('Users', id);
    console.log(UserData);
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
    if (this.state.sourcedata[this.state.CurrentCol].SneakerList) {
      // console.log(
      //   this.state.sourcedata[this.state.CurrentCol].SneakerList[0].media
      //     .thumbUrl,
      // );
      this.setState({
        isdataLoad: true,
        data: this.state.sourcedata[this.state.CurrentCol].SneakerList,
      });
      console.log('index: ', this.state.CurrentSneaker);

      // this._carousel.initialNumToRender(this.state.CurrentSneaker);
      // this._carousel.goToSlide(this.state.CurrentSneaker, true);
      // this.flatList_Ref.scrollToIndex({index:this.state.CurrentSneaker});
    } else {
      this.setState({
        isdataLoad: true,
        data: [],
      });
    }
    this.forceUpdate();
    setTimeout(() => {
      this.setState({ showAlert: false });
    }, 5000);
  }

  SubtractQuantity() {
    this.setState({Quantity: this.state.Quantity + 1});
  }
  addQuantity() {
    if (this.state.Quantity > 1) {
      this.setState({Quantity: this.state.Quantity - 1});
    }
  }
  calQuantity(item) {
    var count = 0;
    item.SneakerList.map((item) => {
      count += item.Quantity;
    });
    console.log('\n\n\n\n\n\n\n\n', count);

    return count;
  }
  async UpdateFn() {
    console.log("call updatefun");
    setTimeout(() => {
      this.setState({showAlert2: false});
      
    }, 6000);
    this.state.EditSneaker.Quantity = this.state.Quantity;
    let Id = await AsyncStorage.getItem('Token');
    let OldList = this.state.sourcedata[this.state.CurrentCol].SneakerList;
    OldList[this.state.EditIndex] = this.state.EditSneaker;
    let OldData = this.state.sourcedata[this.state.CurrentCol];
    OldData.SneakerList = OldList;
    let OriginalList = this.state.sourcedata;
    OriginalList[this.state.CurrentCol] = OldData;
    await saveData('Collections', Id, {Collections: OriginalList});
    let UserInfo = await getData('Users', Id);
    if (!OldData.isPrivate) {
      let Community = await getData('Community', 'Community');
      let tempObj = UserInfo;
      // item.Status="Added";
      UserInfo.timeAgo = moment().format();
      UserInfo.PostId = this.uniqueID();
      tempObj.sneakers = [this.state.EditSneaker];
      Community.Feed = [tempObj].concat(Community.Feed);
      // Community.Feed.push(tempObj);
      // Community.Feed= [tempObj,...Community.Feed];
      await updateField('Community', 'Community', Community);
      // await saveData('Community', 'Community', Community);
    }
    // let Community = await getData('Community', 'Community');
    // let tempObj = UserInfo;
    // // item.Status="Added";
    // UserInfo.timeAgo = moment().format();
    // UserInfo.PostId = this.uniqueID();
    // tempObj.sneakers = [this.state.EditSneaker];
    // Community.Feed = [tempObj, ...Community.Feed];
    // await saveData('Community', 'Community', Community);
    this.setState({showAlert2: true});
  
  }

  render() {
    // this.itemsFlatListRef &&
    console.log('------->:', this.state.data);
    setTimeout(() => {
      if (this.state.data.length > this.state.CurrentSneaker) {
        console.log('heheh');
        this.itemsFlatListRef &&
          this.itemsFlatListRef.scrollToIndex({
            animated: true,
            index: this.props.route.params.CurrentSneaker,
            // index: this.props.navigation.getParam('CurrentSneaker'),
          });
        // this.itemsFlatListRef.current?.scrollToIndex({ index: this.state.CurrentSneaker, animated: true });
      }
    }, 100);

    const {isSwitchOn} = this.state;
    // const {params} = this.props.route.params;
    return (
      <View style={styles.container}>
        <Modal
          visible={this.state.modalVisibleStart}
          transparent={true}
          onTouchOutside={() => {
            this.setState({modalVisibleStart: false});
          }}>
          <View>
            <ModalContent style={styles.modalview}>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  fontWeight: 'normal',
                  fontSize: responsiveFontSize(2),
                  alignSelf: 'center',
                  // textTransform: 'uppercase',
                }}>
                Are you Sure?
              </Text>
              <Text
                style={{
                  fontFamily: 'Lato-Regular',
                  fontWeight: 'normal',
                  fontSize: responsiveFontSize(2),
                  alignSelf: 'center',
                  marginTop: responsiveHeight(3),
                }}>
                Do you want to delete
              </Text>
              <Text
                style={{
                  height: responsiveHeight(8),
                  fontFamily: 'Lato-Regular',
                  fontWeight: 'normal',
                  fontSize: responsiveFontSize(2),
                  alignSelf: 'center',
                  textAlign: 'center',
                }}>
                {this.state.LastSneaker} ?
              </Text>
              <View
                style={{
                  marginTop: responsiveHeight(0),
                  borderBottomWidth: responsiveWidth(0.2),
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
                    this.forceUpdate();
                  }}>
                  <Text style={styles.buttontext2}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonview}
                  onPress={async () => {
                    let Id = await AsyncStorage.getItem('Token');
                    let OldCol = this.state.sourcedata[this.state.CurrentCol];
                    let aaryu = [];
                    // aaryu.splice
                    OldCol.SneakerList.splice(this.state.DeleteIndex, 1);

                    let OldList = this.state.sourcedata;
                    OldList[this.state.CurrentCol] = OldCol;
                    this.setState({sourcedata: OldList});
                    // alert('deleted');
                    this.setState({modalVisibleStart: false, showAlert: true});
                    await saveData('Collections', Id, {
                      Collections: this.state.sourcedata,
                    });
                    this.componentDidMount();
                    // this.props.navigation.navigate('AddNewCollection');
                    // alert(this.state.modalVisibleStart)
                    this.forceUpdate();
                  }}>
                  <Text style={styles.buttontext}>Delete</Text>
                </TouchableOpacity>
              </View>
            </ModalContent>
          </View>
        </Modal>

        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent></StatusBar>
        <BottomModal
          animationType={'pokeman'}
          transparent={false}
          // transparent={true}
          height={responsiveHeight(73)}
          visible={this.state.modalVisible1}
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
                alignSelf: 'center',
                flexDirection: 'row',
                alignItems: 'center',
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
            <FlatList
              showsScrollIndicator={false}
              data={this.state.sourcedata}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      // if (item.name == 'Random Jordon Collection') {
                      this.setState({CurrentCol: index});
                      this.componentDidMount();
                      this.toggleModal();
                      // }
                    }}
                    style={[styles.cardview1, {}]}>
                    {/* <AntDesign
                      name={item.fav ? 'star' : 'staro'}
                      size={25}
                      color={item.fav ? '#F5A623' : '#E8E8E8'}
                      style={{marginLeft: responsiveWidth(0.2)}}
                    /> */}
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
                        <View style={{marginLeft: responsiveWidth(4)}}>
                          <View
                            style={{
                              flexDirection: 'row',
                              height: responsiveHeight(3.5),
                              alignItems: 'center',
                              width: responsiveWidth(45),
                            }}>
                            <Text
                              numberOfLines={1}
                              style={[
                                {
                                  fontFamily: 'Lato-Bold',
                                  color: 'black',
                                  fontSize: responsiveFontSize(1.75),
                                  top: responsiveHeight(0.05),
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
                              bottom: responsiveHeight(0.4),
                            }}>
                            <Text
                              style={{
                                fontSize: responsiveFontSize(1.5),
                                color: 'gray',
                                fontFamily: 'Lato-Regular',
                              }}>
                              {item.SneakerList
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
                        <View style={{marginLeft: responsiveWidth(4)}}>
                          <View
                            style={{
                              width: responsiveWidth(45),
                              flexDirection: 'row',
                              height: responsiveHeight(3.5),
                              alignItems: 'center',
                            }}>
                            <Text
                              numberOfLines={1}
                              style={[
                                {
                                  fontFamily: 'Lato-Bold',
                                  color: 'black',
                                  fontSize: responsiveFontSize(1.75),
                                  top: responsiveHeight(0.05),
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
                              bottom: responsiveHeight(0.4),
                            }}>
                            <Text
                              style={{
                                fontSize: responsiveFontSize(1.5),
                                color: 'gray',
                                fontFamily: 'Lato-Regular',
                              }}>
                              {item.SneakerList
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
                          style={{left: responsiveWidth(1)}}
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
        </View> */}
        {this.state.showAlert ? (
          <Animatable.View
            animation={'fadeInDownBig'}
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
            {/* <AntDesign name={'checkcircleo'} color={'#55dd91'} size={40} /> */}
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
                style={{
                  color: 'gray',
                  fontSize: 12,
                  fontFamily: 'Lato-Black',
                }}>
                DELETED FROM {this.state.sourcedata[this.state.CurrentCol].name}{' '}
                COLLECTION
              </Text>
              <Text
                style={{
                  color: 'black',
                  fontSize: 14,
                  fontFamily: 'Lato-Regular',
                  marginTop: responsiveHeight(0.5),
                }}
                ellipsizeMode={'tail'}
                numberOfLines={1}>
                {this.state.LastSneaker}
              </Text>
            </View>
            <TouchableOpacity onPress={() => this.setState({showAlert: false})}>
              <AntDesign name={'close'} color={'gray'} size={20} />
            </TouchableOpacity>
          </Animatable.View>
        ) : null}
        {this.state.showAlert2 ? (
          <Animatable.View
            animation={'fadeInDownBig'}
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
                {this.state.EditSneaker.title + ' '} UPDATED
              </Text>
            </View>
            <TouchableOpacity
              onPress={() =>
                this.setState({showAlert2: false, EditSneaker: {}})
              }>
              <AntDesign name={'close'} color={'gray'} size={20} />
            </TouchableOpacity>
          </Animatable.View>
        ) : null}

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.collectionview}>
            <TouchableOpacity
              style={{
                width: 40,
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <Image
                style={{
                  height: responsiveWidth(7),
                  width: responsiveWidth(7),
                  marginLeft: responsiveWidth(-2),
                  marginBottom: 2,
                }}
                source={
                  this.state.sourcedata[this.state.CurrentCol]?.fav
                    ? require('../../Assets/Star.png')
                    : require('../../Assets/StarUnselected.png')
                }
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.toggleModal()}>
              <Text
                style={[
                  styles.nametext,
                  {
                    // textTransform: 'capitalize',
                    width: responsiveWidth(40),
                    textAlign: 'center',
                  },
                ]}>
                {' '}
                {this.state.sourcedata[this.state.CurrentCol]?.name}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.toggleModal()}
              style={{
                left: 10,
                width: 40,
                justifyContent: 'center',
                alignSelf: 'center',
              }}>
              <Ionicons
                name={'ios-arrow-down'}
                size={25}
                color={'#949494'}
                style={[styles.icon, {alignSelf: 'center'}]}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              borderBottomWidth: 1,
              borderColor: '#B6BBC8',
              width: responsiveWidth(100),
            }}></View>

          <FlatList
            data={this.state.data}
            horizontal={true}
            // initialScrollIndex={this.state.CurrentSneaker}
            onScrollToIndexFailed={(info) => {
              const wait = new Promise((resolve) => setTimeout(resolve, 100));
              wait.then(() => {
                this.itemsFlatListRef.scrollToIndex({
                  animated: true,
                  index: this.props.route.params.CurrentSneaker,
                  // index: this.props.navigation.getParam('CurrentSneaker'),
                });
                // this.itemsFlatListRef.current?.scrollToIndex({ index: this.state.CurrentSneaker, animated: true });
              });
            }}
            ref={(ref) => {
              this.itemsFlatListRef = ref;
            }}
            keyExtractor={(item, index) => item.name + index}
            renderItem={(item, index) => {
              return (
                <View
                  key={index}
                  style={
                    this.state.data.length == 1
                      ? [
                          styles.collectioncontainer,
                          {
                            marginLeft: responsiveWidth(10),
                            marginEnd:
                              item.index === this.state.data.length - 1
                                ? responsiveWidth(4)
                                : 0,
                          },
                        ]
                      : [
                          styles.collectioncontainer,
                          {
                            marginEnd:
                              item.index === this.state.data.length - 1
                                ? responsiveWidth(4)
                                : 0,
                          },
                        ]
                  }>
                  <View
                    style={{
                      height: responsiveHeight(10),
                      borderBottomColor: '#B6BBC8',
                      borderBottomWidth: 1,
                      //   justifyContent:'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <View
                      style={{
                        marginLeft: responsiveWidth(5),
                        width: responsiveWidth(55),
                      }}>
                      <Text
                        style={{
                          color: '#6C6C6C',
                          // color:'red',
                          marginBottom: 2,
                          fontFamily: 'Lato-Bold',
                          fontSize: responsiveFontSize(1.6),
                          fontWeight: 'normal',
                        }}>
                        SNEAKER
                      </Text>
                      <Text
                        style={{
                          color: '#121212',
                          fontFamily: 'Lato-Bold',
                          fontSize: responsiveFontSize(1.8),
                          fontWeight: 'normal',
                        }}>
                        {item.item.title}{' '}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        if (item.item.Condition) {
                          if (item?.item?.Quantity) {
                            this.setState({
                              Quantity: item.item.Quantity,
                            });
                          } else {
                            this.setState({
                              Quantity: 0,
                            });
                          }
                          this.setState({
                            EditSneaker: item.item,
                            EditIndex: index,
                            modalVisibleStart2: true,
                          });
                        } else {
                          let tempitem = item.item;
                          tempitem.Condition = 'New';
                          this.setState({
                            EditSneaker: tempitem,
                            EditIndex: index,
                            modalVisibleStart2: true,
                          });
                        }
                      }}>
                      <Image
                        style={{
                          height: responsiveWidth(5),
                          resizeMode: 'contain',
                          width: responsiveWidth(6),
                          marginLeft: responsiveWidth(1),
                        }}
                        source={require('../../Assets/Edit.png')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        // alert(item.index)
                        this.setState({
                          DeleteIndex: item.index,
                          modalVisibleStart: true,
                          LastSneaker: item.item.title,
                        });
                      }}>
                      <Image
                        style={{
                          height: responsiveWidth(5),
                          resizeMode: 'contain',
                          width: responsiveWidth(6),
                          marginLeft: responsiveWidth(3),
                        }}
                        source={require('../../Assets/Delete.png')}
                      />
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      height: responsiveHeight(23),
                      borderBottomColor: '#B6BBC8',
                      borderBottomWidth: 1,
                    }}>
                    <View
                      style={{
                        alignItems: 'flex-end',
                        flex: 1,
                        // backgroundColor:'red',
                        marginHorizontal: responsiveWidth(4),
                        marginVertical: responsiveHeight(1.5),
                      }}></View>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Image
                        style={{
                          height: responsiveHeight(22),
                          width: responsiveWidth(70),
                          bottom: responsiveHeight(3),
                          // resizeMode: 'contain',
                        }}
                        source={
                          (item.item.media?.imageUrl ||
                            item.item.media?.thumbUrl) &&
                          item.item.media?.thumbUrl !== DefaultImageURL &&
                          item.item.media?.thumbUrl !== DefaultImageURL2
                            ? {
                                uri: item.item.media?.imageUrl
                                  ? item.item.media.imageUrl
                                  : item.item.media.thumbUrl,
                              }
                            : require('../../Assets/placeholder.png')
                        }
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      marginHorizontal: responsiveWidth(5),
                      marginVertical: responsiveHeight(1.5),
                    }}>
                    <Text
                      style={{
                        color: '#6C6C6C',
                        // color:'red',
                        marginBottom: 2,
                        fontFamily: 'Lato-Bold',
                        fontSize: responsiveFontSize(1.6),
                        fontWeight: 'normal',
                      }}>
                      COLORWAY
                    </Text>
                    <Text
                      style={{
                        color: '#121212',
                        fontFamily: 'Lato-Bold',
                        fontSize: responsiveFontSize(1.7),
                        fontWeight: 'normal',
                      }}>
                      {item.item.colorway}
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                      }}>
                      {item.item.retailPrice ? (
                        <View
                          style={{
                            marginTop: responsiveHeight(2),
                            width: responsiveWidth(25),
                          }}>
                          <Text
                            style={{
                              color: '#6C6C6C',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.6),
                              fontWeight: 'normal',
                            }}>
                            RETAIL PRICE
                          </Text>
                          <Text
                            style={{
                              color: '#121212',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.7),
                              fontWeight: 'normal',
                            }}>
                            ${item.item.retailPrice}
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={{
                            marginTop: responsiveHeight(2),
                            width: responsiveWidth(25),
                          }}>
                          <Text
                            style={{
                              color: '#6C6C6C',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.6),
                              fontWeight: 'normal',
                            }}>
                            RETAIL PRICE
                          </Text>
                          <Text
                            style={{
                              color: '#121212',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.7),
                              fontWeight: 'normal',
                            }}>
                            -
                          </Text>
                        </View>
                      )}

                      {item?.item?.year || item?.item?.releaseYear ? (
                        <View
                          style={{
                            marginTop: responsiveHeight(2),
                            width: responsiveWidth(15),
                          }}>
                          <Text
                            style={{
                              color: '#6C6C6C',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.6),
                              fontWeight: 'normal',
                            }}>
                            YEAR
                          </Text>
                          <Text
                            style={{
                              color: '#121212',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.7),
                              fontWeight: 'normal',
                            }}>
                            {item.item.year
                              ? item.item.year
                              : item?.item?.releaseYear}
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={{
                            marginTop: responsiveHeight(2),
                            width: responsiveWidth(15),
                          }}>
                          <Text
                            style={{
                              color: '#6C6C6C',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.6),
                              fontWeight: 'normal',
                            }}>
                            YEAR
                          </Text>
                          <Text
                            style={{
                              color: '#121212',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.7),
                              fontWeight: 'normal',
                            }}>
                            -
                          </Text>
                        </View>
                      )}
                      {item?.item?.Condition ? (
                        <View
                          style={{
                            marginTop: responsiveHeight(2),
                            width: responsiveWidth(23),
                            left: responsiveWidth(4),
                          }}>
                          <Text
                            style={{
                              color: '#6C6C6C',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.6),
                              fontWeight: 'normal',
                            }}>
                            CONDITION
                          </Text>
                          <Text
                            style={{
                              color: '#121212',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.7),
                              fontWeight: 'normal',
                            }}>
                            {item.item.Condition ? item.item.Condition : 'New'}
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={{
                            marginTop: responsiveHeight(2),
                            width: responsiveWidth(23),
                            left: responsiveWidth(4),
                          }}>
                          <Text
                            style={{
                              color: '#6C6C6C',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.6),
                              fontWeight: 'normal',
                            }}>
                            CONDITION
                          </Text>
                          <Text
                            style={{
                              color: '#121212',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.7),
                              fontWeight: 'normal',
                            }}>
                            -
                          </Text>
                        </View>
                      )}
                      {item?.item?.styleId || item?.item?.sku ? (
                        <View
                          style={{
                            marginTop: responsiveHeight(2),
                            width: responsiveWidth(25),
                          }}>
                          <Text
                            style={{
                              color: '#6C6C6C',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.6),
                              fontWeight: 'normal',
                            }}>
                            {'STYLE'}
                          </Text>
                          <Text
                            style={{
                              color: '#121212',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.7),
                              fontWeight: 'normal',
                            }}>
                            {item.item.styleId
                              ? item.item.styleId
                              : item.item.sku}
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={{
                            marginTop: responsiveHeight(2),
                            width: responsiveWidth(25),
                          }}>
                          <Text
                            style={{
                              color: '#6C6C6C',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.6),
                              fontWeight: 'normal',
                            }}>
                            {'STYLE'}
                          </Text>
                          <Text
                            style={{
                              color: '#121212',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.7),
                              fontWeight: 'normal',
                            }}>
                            -
                          </Text>
                        </View>
                      )}

                      {item?.item?.Size ? (
                        <View
                          style={{
                            marginTop: responsiveHeight(2),
                            width: responsiveWidth(15),
                          }}>
                          <Text
                            style={{
                              color: '#6C6C6C',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.6),
                              fontWeight: 'normal',
                            }}>
                            SIZE
                          </Text>
                          <Text
                            style={{
                              color: '#121212',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.7),
                              fontWeight: 'normal',
                            }}>
                            {item.item.Size}
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={{
                            marginTop: responsiveHeight(2),
                            width: responsiveWidth(15),
                          }}>
                          <Text
                            style={{
                              color: '#6C6C6C',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.6),
                              fontWeight: 'normal',
                            }}>
                            SIZE
                          </Text>
                          <Text
                            style={{
                              color: '#121212',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.7),
                              fontWeight: 'normal',
                            }}>
                            -
                          </Text>
                        </View>
                      )}

                      {item?.item?.Status ? (
                        <View
                          style={{
                            marginTop: responsiveHeight(2),
                            width: responsiveWidth(23),
                            left: responsiveWidth(4),
                          }}>
                          <Text
                            style={{
                              color: '#6C6C6C',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.6),
                              fontWeight: 'normal',
                            }}>
                            STATUS
                          </Text>
                          <Text
                            style={{
                              color: '#121212',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.7),
                              fontWeight: 'normal',
                            }}>
                            {item.item.Status}
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={{
                            marginTop: responsiveHeight(2),
                            width: responsiveWidth(23),
                            left: responsiveWidth(4),
                          }}>
                          <Text
                            style={{
                              color: '#6C6C6C',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.6),
                              fontWeight: 'normal',
                            }}>
                            STATUS
                          </Text>
                          <Text
                            style={{
                              color: '#121212',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.7),
                              fontWeight: 'normal',
                            }}>
                            -
                          </Text>
                        </View>
                      )}
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      {item.item.estimatedMarketValue ? (
                        <View style={{marginTop: responsiveHeight(2)}}>
                          <Text
                            style={{
                              color: '#6C6C6C',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.6),
                              fontWeight: 'normal',
                            }}>
                            ESTIMATED MARKET VALUE
                          </Text>
                          <Text
                            style={{
                              color: '#121212',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.7),
                              fontWeight: 'normal',
                            }}>
                            ${item.item.estimatedMarketValue}
                          </Text>
                        </View>
                      ) : (
                        <View style={{marginTop: responsiveHeight(2)}}>
                          <Text
                            style={{
                              color: '#6C6C6C',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.6),
                              fontWeight: 'normal',
                            }}>
                            ESTIMATED MARKET VALUE
                          </Text>
                          <Text
                            style={{
                              color: '#121212',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.7),
                              fontWeight: 'normal',
                            }}>
                            -
                          </Text>
                        </View>
                      )}

                      {item.item.Quantity ? (
                        <View
                          style={{
                            marginTop: responsiveHeight(2),
                            right: responsiveWidth(2.3),
                          }}>
                          <Text
                            style={{
                              color: '#6C6C6C',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.6),
                              fontWeight: 'normal',
                            }}>
                            QUANTITY
                          </Text>
                          <Text
                            style={{
                              color: '#121212',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.7),
                              fontWeight: 'normal',
                            }}>
                            {item.item.Quantity}
                          </Text>
                        </View>
                      ) : (
                        <View
                          style={{
                            marginTop: responsiveHeight(2),
                            right: responsiveWidth(2.3),
                          }}>
                          <Text
                            style={{
                              color: '#6C6C6C',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.6),
                              fontWeight: 'normal',
                            }}>
                            QUANTITY
                          </Text>
                          <Text
                            style={{
                              color: '#121212',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.7),
                              fontWeight: 'normal',
                            }}>
                            {item.item.Status == 'Sold' ||
                            item.item.Status == 'Want'
                              ? '-'
                              : 1}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            }}
          />
          {
            <Modal
              visible={this.state.modalVisibleStart2}
              transparent={true}
              overlayBackgroundColor="rgba(0,0,0,1)"
              onTouchOutside={() => {
                this.setState({modalVisibleStart2: false});
              }}>
              <View>
                <ModalContent style={styles.modalview1}>
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Text
                      style={{
                        height: responsiveHeight(6),
                        fontFamily: 'Lato-Bold',
                        fontWeight: 'normal',
                        fontSize: responsiveFontSize(2),
                        alignSelf: 'center',
                      }}>
                      EDIT {this.state.EditSneaker.title}
                    </Text>
                    <View style={{marginVertical: responsiveHeight(1.5)}}>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.fieldname}>SNEAKER</Text>
                      </View>
                      <View style={styles.textinputcontainer}>
                        <TextInput
                          placeholder=""
                          placeholderTextColor="#121212"
                          autoCapitalize="sentences"
                          value={this.state.EditSneaker.title}
                          onChangeText={(text) => {
                            this.state.EditSneaker.title = text;
                            this.forceUpdate();
                          }}
                          style={styles.textinputfield}
                        />
                      </View>
                    </View>
                    <View style={{marginVertical: responsiveHeight(1.5)}}>
                      <Text style={styles.fieldname}>SIZE</Text>
                      <TouchableOpacity
                        style={[
                          styles.textinputcontainer,
                          {justifyContent: 'space-between'},
                        ]}
                        onPress={() => this.setState({modalVisible: true})}>
                        <Text
                          style={{
                            left: responsiveWidth(3),
                            fontFamily: 'Lato-Medium',
                            fontWeight: 'normal',
                            fontSize: responsiveFontSize(2.2),
                            color: '#121212',
                          }}>
                          {this.state.EditSneaker.Size}
                        </Text>
                        <Entypo
                          name={'chevron-small-down'}
                          size={18}
                          color={'black'}
                          style={{right: 8}}
                        />
                      </TouchableOpacity>
                    </View>
                    <View style={{marginVertical: responsiveHeight(1.5)}}>
                      <Text style={styles.name}>CONDITION</Text>
                      <View
                        style={[
                          styles.textinputcontainer,
                          {justifyContent: 'space-between'},
                        ]}>
                        <TouchableOpacity
                          onPress={() => {
                            this.state.EditSneaker.Condition = 'New';
                            this.forceUpdate();
                          }}
                          style={{
                            justifyContent: 'center',
                            borderTopLeftRadius: 5,
                            borderBottomLeftRadius: 5,
                            alignItems: 'center',
                            flex: 1,
                            height: responsiveHeight(5.5),
                            backgroundColor:
                              this.state.EditSneaker.Condition == 'New'
                                ? '#D9173B'
                                : null,
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Lato-Bold',
                              fontWeight: 'normal',
                              fontSize: responsiveFontSize(2.2),
                              color:
                                this.state.EditSneaker.Condition == 'New'
                                  ? '#FFF'
                                  : '#121212',
                            }}>
                            New
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            this.state.EditSneaker.Condition = 'Used';
                            this.forceUpdate();
                          }}
                          style={{
                            borderTopRightRadius: 5,
                            borderBottomRightRadius: 5,
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                            height: responsiveHeight(5.5),
                            backgroundColor:
                              this.state.EditSneaker.Condition == 'Used'
                                ? '#D9173B'
                                : null,
                          }}>
                          <Text
                            style={{
                              fontFamily: 'Lato-Bold',
                              fontWeight: 'normal',
                              fontSize: responsiveFontSize(2.2),
                              color:
                                this.state.EditSneaker.Condition == 'Used'
                                  ? '#FFF'
                                  : '#121212',
                            }}>
                            Used
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {/* quantity   */}
                    <View style={{marginVertical: responsiveHeight(1.5)}}>
                      <View style={{flexDirection: 'row'}}>
                        <Text style={styles.fieldname}>QUANTITY</Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: responsiveWidth(88),
                          alignSelf: 'center',
                          justifyContent: 'center',
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
                    {/* quantity    */}
                    <View style={{marginVertical: responsiveHeight(1.5)}}>
                      <Text style={styles.fieldname}>SNEAKER STATUS</Text>
                      <TouchableOpacity
                        style={[
                          styles.textinputcontainer,
                          {justifyContent: 'space-between'},
                        ]}
                        onPress={() => {
                          this.setState({modalVisible3: true});
                        }}>
                        <Text
                          style={{
                            left: responsiveWidth(3),
                            fontFamily: 'Lato-Medium',
                            fontWeight: 'normal',
                            fontSize: responsiveFontSize(2.2),
                            color: '#121212',
                          }}>
                          {this.state.EditSneaker.Status}
                        </Text>
                        <Entypo
                          name={'chevron-small-down'}
                          size={18}
                          color={'black'}
                          style={{right: 8}}
                        />
                      </TouchableOpacity>
                    </View>
                  </ScrollView>

                  <View
                    style={{
                      flex: 1,
                      borderBottomWidth: responsiveWidth(0.2),
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
                        this.setState({modalVisibleStart2: false});
                      }}>
                      <Text style={styles.buttontext}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.buttonview}
                      onPress={() => {
                        this.setState({showAlert2: true});
                        // this.props.navigation.navigate('AddNewCollection');
                        this.setState({modalVisibleStart2: false});
                        this.UpdateFn();
                       
                      }}>
                      <Text style={styles.buttontext}>Update</Text>
                    </TouchableOpacity>
                  </View>
                </ModalContent>
              </View>
            </Modal>
          }
          <BottomModal
            animationType={'pokeman'}
            transparent={false}
            // transparent={true}
            height={responsiveHeight(90)}
            visible={this.state.modalVisible}
            onTouchOutside={() => {
              this.setState({modalVisible: false});
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
                      Size: this.state.EditSneaker.size,
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
                data={this.state.datasize}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        onPress={() => {
                          this.state.EditSneaker.Size = item.value;
                          this.setState({
                            modalVisible: false,
                          });
                          this.forceUpdate();
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
          <BottomModal
            animationType={'pokeman'}
            transparent={true}
            height={responsiveHeight(55)}
            style={{
              backgroundColor: 'rgba(0,0,0,0.7)',
              borderRadius: responsiveWidth(5),
            }}
            visible={this.state.modalVisible3}
            onTouchOutside={() => {
              this.setState({modalVisible3: false});
            }}>
            <ModalContent
              style={{
                width: responsiveWidth(100),
                // height: responsiveHeight(85),
                height: responsiveHeight(65),
                //flex: 1,
                borderRadius: responsiveWidth(5),
                // backgroundColor:'red'
              }}>
              <View
                style={{
                  width: responsiveWidth(100),

                  height: responsiveHeight(7),
                  borderBottomWidth: responsiveWidth(0.3),
                  borderColor: '#B6BBC8',
                  alignSelf: 'center',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Bold',
                    fontWeight: 'bold',
                    fontSize: responsiveFontSize(2.6),
                    marginBottom: responsiveHeight(3),
                  }}>
                  Select Sneaker Status
                </Text>
              </View>
              <FlatList
                showsVerticalScrollIndicator={false}
                showsScrollIndicator={false}
                data={this.state.items2}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.cardview5}
                      onPress={() => {
                        this.state.EditSneaker.Status = item.value;
                        this.setState({
                          modalVisible3: false,
                        });
                        this.forceUpdate();
                      }}>
                      <View
                        style={{
                          width: responsiveWidth(72),
                          alignItems: 'flex-start',
                          justifyContent: 'center',
                          marginLeft: responsiveWidth(1),
                        }}>
                        <Text style={[styles.nametext1]}>{item.label}</Text>
                      </View>
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
  cardview1: {
    width: responsiveWidth(88),
    height: responsiveHeight(9),
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
    marginLeft: responsiveWidth(-4),
  },
  nametext: {
    fontSize: responsiveFontSize(2),
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
  collectiontext: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(1.9),
    fontFamily: 'Lato-Bold',
    marginTop: responsiveWidth(0.5),
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
    width: responsiveWidth(80),
    alignSelf: 'center',
    backgroundColor: '#fff',
    height: responsiveHeight(64),
    borderWidth: responsiveWidth(0.3),
    borderColor: '#B6BBC8',
    borderRadius: responsiveWidth(2),
    marginTop: responsiveHeight(3),
    marginStart: responsiveWidth(4),
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
  modalview: {
    width: responsiveWidth(78),
    height: responsiveHeight(28),
  },
  modalview1: {
    width: responsiveWidth(78),
    height: responsiveHeight(67.5),
    marginBottom: -27,
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
    height: responsiveHeight(8),
    //marginTop:responsiveWidth(3)
  },
  buttontext: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Lato-Regular',
    color: '#589BE9',
    left: 7,
  },
  buttontext2: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Lato-Regular',
    color: '#589BE9',
    right: 7,
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
  cardview5: {
    width: responsiveWidth(90),
    height: responsiveHeight(7),
    backgroundColor: '#fff',
    borderBottomWidth: responsiveWidth(0.2),
    borderColor: '#B6BBC8',
    marginTop: responsiveWidth(3),
    // elevation:1,
    // marginLeft: responsiveWidth(5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    // marginRight: responsiveWidth(5)
  },
  detailcontainer: {
    width: responsiveWidth(89),
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderWidth: responsiveWidth(0.3),
    borderColor: '#B6BBC8',
    borderRadius: responsiveWidth(2),
    marginVertical: responsiveWidth(3),
  },
  cardview1: {
    width: responsiveWidth(88),
    height: responsiveHeight(9),
    //backgroundColor: '#fff',
    borderBottomWidth: responsiveWidth(0.3),
    borderColor: '#B6BBC8',
    //borderRadius: responsiveWidth(2),
    flexDirection: 'row',
    alignItems: 'center',
    // marginRight: responsiveWidth(5),
    marginLeft: responsiveWidth(1.5),
  },
  icon: {
    marginLeft: responsiveWidth(-2),
    //marginTop:responsiveWidth(2)
  },
  fieldname: {
    fontFamily: 'Lato-Heavy',
    fontWeight: 'normal',
    fontSize: responsiveFontSize(1.5),
    color: '#6c6c6c',
  },
  textinputcontainer: {
    marginTop: responsiveHeight(1),
    height: responsiveHeight(5.5),
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
  textinputfield: {
    marginHorizontal: responsiveWidth(3),
    fontFamily: 'Lato-Medium',
    fontWeight: 'normal',
    fontSize: responsiveFontSize(2.2),
    color: '#121212',
    width: '70%',
    margin: 0,
    padding: 0,
  },
  nametext1: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Lato-Regular',
    marginBottom: responsiveWidth(3.5),
  },
  privatecontainer: {
    height: responsiveHeight(3),
    width: responsiveWidth(17),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#362636',
    borderRadius: responsiveHeight(0.6),
    // marginBottom: responsiveWidth(2),
    // marginTop: responsiveWidth(-3),
    marginLeft: responsiveWidth(2),
  },
  lessview: {
    borderWidth: responsiveWidth(0.3),
    width: responsiveWidth(23),
    marginTop: responsiveWidth(3),
    height: responsiveHeight(6),
    borderRadius: responsiveWidth(1),
    borderColor: '#B6BBC8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreview: {
    width: responsiveWidth(23),
    marginTop: responsiveWidth(3),
    height: responsiveHeight(6),
    borderRadius: responsiveWidth(1),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9173B',
    right: 2,
  },
});
