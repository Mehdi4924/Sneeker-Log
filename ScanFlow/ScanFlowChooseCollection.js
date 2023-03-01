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
  Button,
  AsyncStorage,
  Pressable,
  BackHandler,
} from 'react-native';
//import {BottomModal,ModalContent} from 'react-native-bottom-modal'
import {
  ModalContent,
  ModalTitle,
  ModalButton,
  BottomModal,
} from 'react-native-modals';
import Modal from 'react-native-modal';
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
import {Switch, ActivityIndicator} from 'react-native-paper';
import {getData, saveData} from '../Backend/utility';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useBackButton } from '@react-navigation/native';
const DefaultImageURL = [
  'https://stockx-assets.imgix.net/media/New-Product-Placeholder-Default.jpg?fit=fill&bg=FFFFFF&w=140&h=100&auto=format,compress&trim=color&q=90&dpr=2&updated_at=0',

  'https://stockx.imgix.net/Reebok-LX8500-Renarts-Dead-End-Kicks-Temp.png?fit=fill&bg=FFFFFF&w=140&h=100&auto=format,compress&trim=color&q=90&dpr=2&updated_at=1538080256',
];
export default class ScanFlowChooseCollection extends Component {
  state = {
    isSwitchOn: false,
    modalVisible: true,
    modalVisibleStart: false,
    modalVisibleStar2: false,
    data: '',
    isSearch: false,
    flag: true,
    searchQuery: 'all',
    sourcedata: [
      //   {
      //     name: 'Yeezy',
      //     fav: true,
      //   },
      //   {
      //     name: 'Air Jordon Retro Lot',
      //     fav: true,
      //   },
      //   {
      //     name: 'Random Jordon Collection',
      //     fav: true,
      //   },
      //   {
      //     name: 'Air Jordon 10',
      //     fav: false,
      //   },
      //   {
      //     name: 'Air Max',
      //     fav: false,
      //   },
      //   {
      //     name: 'Nike',
      //     fav: false,
      //   },
      //   {
      //     name: 'Allen Iversion',
      //     fav: false,
      //   },
      //   {
      //     name: 'Allen Iversion',
      //     fav: false,
      //   },
    ],
    UserInfo: {},
    CName: '',
    userProfilePic: '',

    RBSheet,
  };

  calQuantity(item) {
    var count = 0;
    item.SneakerList.map((item) => {
      count += item.Quantity;
    });
    console.log('\n\n\n\n\n\n\n\n', count);

    return count;
  }
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
    this.setState({modalVisibleStart: visible});
  }
  _onToggleSwitch = () =>
    this.setState((state) => ({isSwitchOn: !state.isSwitchOn}));

  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener(
      'focus',
      async () => {
        // this.GetDataFromApi();
        // this.RBSheet.open();
        this.setState({modalVisible: true});
        await this.GetColFn();
        const onBackPress = async () => {
          this.setState({modalVisible: false}),
          this.props.navigation.goBack();
          return true;
        };
        BackHandler.addEventListener("hardwareBackPress", onBackPress);
  
        return () =>
          BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      }, [])
  
      
    
  }

  // async componentDidMount() {
  //   this.focusListener = this.props.navigation.addListener(
  //     'didFocus',
  //     async () => {
  //       this.GetColFn();
  //     },
  //   );
  // }
  // async GetDataFromApi() {
  //   console.log('api call hoi');
  //   let CallBack2 = await fetch(
  //     'https://the-sneaker-database.p.rapidapi.com/sneakers?limit=100&&name=' +
  //       'adidas',
  //     {
  //       method: 'get',
  //       headers: {
  //         // "x-rapidapi-key": "e71a32f8acmshf99f05e2a63d495p16ec16jsnd227b703482f",
  //         'x-rapidapi-key':
  //           '620bbcea62msh6543700f8450844p125a83jsn1996b91bedea',
  //         'x-rapidapi-host': 'the-sneaker-database.p.rapidapi.com',
  //       },
  //     },
  //   )
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then(async (response) => {
  //       console.log('api call hoi step 2');
  //       console.log('Sneaker : ', response);
  //       this.setState({data: response});
  //       let newlist = [];
        // if (response.results.length > 0) {
        //   let OldCol = this.state.Collection[this.state.CurrentCol];
        //   // if (OldCol.SneakerList) {
        //   // if (await this.FindinArray(item.id, OldCol.SneakerList)) {
        //   // OldCol.SneakerList = [item, ...OldCol.SneakerList];
        //   await response.results.forEach(async (element) => {
        //     // isAdded
        //     // const a = element.name.substring(0, 3);
        //     // const b = this.state.searchQuery.substring(0, 3);
        //     // if (a == b ) {
        //       if (OldCol.SneakerList) {
        //         if (await this.FindinArray(element.id, OldCol.SneakerList)) {
        //           newlist.push(element);
        //           this.setState({data: newlist});
        //           { console.log('yes1',data)}
        //         } else {
        //           element.isAdded = true;
        //           newlist.push(element);
        //           this.setState({data: newlist});
        //           { console.log('yes2',data)}
        //         }
        //       } else {
        //         newlist.push(element);
        //         this.setState({data: newlist});
        //         { console.log('yes3',data)}
        //       }
        //     // }
        //   });

        //   console.log("ye nai chlna tha");
        //   this.setState({isSearch: false});
        // } else {
        //   console.log("yeeeeeeee chala");
        //   this.setState({modalVisibleStart: true});
        // }
  //     });
  // }

  async GetColFn() {
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
    let Id = await AsyncStorage.getItem('Token');
    let Collections = await getData('Collections', Id);
    let key = 0;

    if (Collections) {
      Collections.Collections.forEach((element) => {
        element.key = key;
        // element.fav = true;
        key++;
      });
      console.log('List : ', Collections.Collections);
      this.setState({
        sourcedata: Collections.Collections ? Collections.Collections : [],
      });
    }
  }

  render() {
    const {isSwitchOn} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent></StatusBar>
        <View style={styles.header}>
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
                    : this.state.UserInfo.profileImage !== undefined
                    ? {uri: this.state.UserInfo.profileImage}
                    : require('../../Assets/sneakerlog_profile.png')
                }
                style={{
                  height: responsiveHeight(4),
                  width: responsiveHeight(4),
                  borderRadius: responsiveWidth(6),
                  marginTop: responsiveWidth(7),
                }}
              />
            </TouchableOpacity>
          ) : (
            <View></View>
          )}
        </View>
        {/* neww code for sneakers============>>>>>>> */}
        {/* {console.log('ye aya set hony k liay data', this.state.data)}
        {this.state.searchQuery !== '' ? (
          <View style={styles.bottomcontainer1}>
            <View
              style={{
                borderBottomWidth: responsiveWidth(0.2),
                borderColor: '#B6BBC8',
              }}></View>
            {this.state.isSearch ? (
              <View style={{marginTop: responsiveWidth(10)}}>
                <ActivityIndicator size={'large'} color={'black'} />
              </View>
            ) : (
              <FlatList
                showsScrollIndicator={false}
                data={this.state.data.results}
                renderItem={({item, index}) => {
                  return (
                    <View style={styles.cardview1}>
                      <Image
                        source={
                          item.image.thumbnail !== '' &&
                          DefaultImageURL.indexOf(item.image.thumbnail) ===
                            -1 &&
                          item.image.thumbnail !== null
                            ? {uri: item.image.thumbnail}
                            : require('../../Assets/placeholder.png')
                        }
                        style={{
                          marginLeft: responsiveWidth(3.5),
                          height: responsiveWidth(10),
                          width: responsiveWidth(14),
                          resizeMode: 'contain',
                        }}></Image>
                      <View
                        style={{
                          width: responsiveWidth(54),
                          marginLeft: responsiveWidth(3),
                        }}>
                        <Text style={styles.cardtext}>
                          {item.title ? item.title : item.name}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPresss={async () => {
                          this.setState({isLoading: true});
                          let Id = await AsyncStorage.getItem('Token');
                          let OldCol = this.state.Collection[CurrentCol];
                          if (
                            DefaultImageURL.indexOf(item.image.thumbnail) !==
                              -1 ||
                            item.image.thumbnail === '' ||
                            item.image.thumbnail === null
                          ) {
                            item.image.thumbnail =
                              'https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/SneakerImages%2Fplaceholder.png?alt=media&token=a368cb0c-5deb-4592-975e-83f61c51e1df';
                            item.media.imageUrl =
                              'https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/SneakerImages%2Fplaceholder.png?alt=media&token=a368cb0c-5deb-4592-975e-83f61c51e1df';
                            item.media.smallImageUrl =
                              'https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/SneakerImages%2Fplaceholder.png?alt=media&token=a368cb0c-5deb-4592-975e-83f61c51e1df';
                          }
                          if (OldCol.SneakerList) {
                            if (
                              await this.FindinArray(
                                item.id,
                                OldCol.SneakerList,
                              )
                            ) {
                              OldCol.SneakerList = [
                                item,
                                ...OldCol.SneakerList,
                              ];
                              this.setState({
                                LastSneaker: item.title
                                  ? item.title
                                  : item.name,
                                showAlert: true,
                              });
                            } else {
                            }
                          } else {
                            OldCol.SneakerList = [item];
                            this.setState({
                              LastSneaker: item.title ? item.title : item.name,
                              showAlert: true,
                            });
                          }
                          let CollList = await getData('Collections', Id);
                          let UserInfo = await getData('Users', Id);
                          if (!OldCol.isPrivate) {
                            let Community = await getData(
                              'Community',
                              'Community',
                            );
                            let tempObj = UserInfo;
                            item.Status = 'Added';
                            UserInfo.timeAgo = moment().format();
                            UserInfo.PostId = this.uniqueID();
                            tempObj.sneakers = [item];
                            [tempObj].concat(Community.Feed);
                            Community.Feed.push(tempObj);
                            await saveData('Community', 'Community', Community);
                          }
                          item.Quantity = 1;
                          CollList.Collections[this.state.CurrentCol] = OldCol;
                          this.setState({Collection: CollList.Collections});
                       
                          await saveData('Collections', Id, CollList);
                          let OldData = this.state.data;
                          OldData[index].isAdded = true;
                          this.forceUpdate();
                          this.setState({isLoading: false});
                        }
                        }>
                        {!item.isAdded ? (
                          <Image
                            style={{
                              marginLeft: responsiveWidth(3),
                              height: responsiveWidth(6),
                              width: responsiveWidth(6),
                            }}
                            source={require('../../Assets/Add.png')}
                          />
                        ) : (
                          <Image
                            style={{
                              marginLeft: responsiveWidth(3),
                              height: responsiveWidth(6),
                              width: responsiveWidth(6),
                            }}
                            source={require('../../Assets/CheckSuccessOutline.png')}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            )}

            <View style={{height: responsiveHeight(8)}}></View>
          </View>
        ) : (
          <View></View>
        )} */}
        {/* ============>>>>>>>>>>>>>>>end new code */}

        {/* =============>>>>>>>> new collection Model        */}
        <Modal
          visible={this.state.modalVisibleStart}
          transparent={true}
          onSwiping={() => {
            this.setState({modalVisibleStart: false, modalVisible: true});
          }}
          useNativeDriver={true}
          overlayBackgroundColor="black"
          // style={{backgroundColor: 'rgba(0,0,0,0.7)'}}
        >
          <View>
            <ModalContent
              style={[
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
                onChangeText={(text) => {
                  this.setState({
                    CName: text,
                    ShowSameNameerror: false,
                    ShowEmpityNameerror: false,
                  });
                }}
                // onChangeText={text => onChangeText(text)}
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
                  value={isSwitchOn}
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
                  width: responsiveWidth(78),
                  marginLeft: responsiveWidth(-5),
                  marginTop: responsiveHeight(1),
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
                    this.setState({
                      modalVisibleStart: false,
                      modalVisible: true,
                    });
                    // this.RBSheet.open();
                    this.GetColFn();
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
                    let List = this.state.sourcedata;
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
                    console.log(Id);
                    let Collection = await getData('Collections', Id);
                    console.log(Collection);
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
                      CurrentCol: this.state.sourcedata.length,
                      Collections: [
                        ...this.state.sourcedata,
                        {
                          name: this.state.CName,
                          isPrivate: isSwitchOn,
                          NoOfSneakers: 0,
                          fav: false,
                        },
                      ],
                    });
                    this.setState({CName: '', isSwitchOn: true});
                    this.setState({modalVisibleStart: false});
                    // this.RBSheet.open()
                  }}>
                  <Text style={styles.buttontext}>Create</Text>
                </TouchableOpacity>
              </View>
            </ModalContent>
          </View>
        </Modal>
        {/* =============>>>>>>>> new collection Model  end      */}

        {/* ======================>>>>>>>>>>>> bottom sheeet start */}
        {/* <View style={{ justifyContent: 'center', alignItems: 'center'}}>
        
          <RBSheet
            ref={(ref) => {
              this.RBSheet = ref;
            }}
            height={responsiveHeight(72)}
            openDuration={250}
            closeOnPressMask={true}
            customStyles={{
              container: {
                justifyContent: 'center',
                alignItems: 'center',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
              },
            }}>
            <View
              style={[
                styles.collectionview,
                {justifyContent: 'space-between', alignItems: 'center'},
              ]}>
              <Text style={styles.collectiontext}>My Collection</Text>
              <TouchableOpacity
                onPress={() => {
                  this.RBSheet.close();
                  this.setState({
                    modalVisibleStart: true,
                    modalVisible: false,
                  });
                }}>
                <Text
                  style={[
                    styles.collectiontext,
                    {color: '#D9173B', right: responsiveWidth(3.5)},
                  ]}>
                  New Collection
                </Text>
              </TouchableOpacity>
            </View>
          
            {this.state.sourcedata.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                showsScrollIndicator={false}
                data={this.state.sourcedata}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      style={[
                        styles.cardview1,
                        {
                          marginBottom:
                            this.state.sourcedata.length === index + 1 ? 40 : 0,
                        },
                      ]}
                      onPress={() => {
                        if (
                          item.SneakerList !== undefined &&
                          item.SneakerList.length > 0
                        ) {
                        
                          this.props.navigation.navigate('DetailsHome', {
                            Collections: this.state.sourcedata,
                            CurrentCol: index,
                          });
                        } else {
                          this.props.navigation.navigate('AddNewCollection', {
                            Collections: this.state.sourcedata,
                            CurrentCol: index,
                          });
                        }

                        this.setState({
                          Collection: item,
                          modalVisible: false,
                        });
                        this.RBSheet.close();
                      }}>
                      <Image
                        style={{
                          marginLeft: responsiveWidth(0.2),

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
                          this.props.navigation.navigate('AddNewCollection', {
                            Collections: this.state.sourcedata,
                            CurrentCol: index,
                          });

                          this.setState({
                            Collection: item,
                            modalVisible: false,
                          });
                          this.RBSheet.close();
                        }}>
                        <View style={{}}>
                          <Entypo
                            name={'chevron-right'}
                            size={responsiveFontSize(3)}
                            style={{left: responsiveWidth(1.4)}}
                            color={'#949494'}
                          />
                        </View>
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
                    {
                      color: 'gray',
                      marginTop: '50%',
                      fontSize: 20,
                    
                    },
                  ]}>
                  No items
                </Text>
              </View>
            )}

            <View
              style={{
                height: responsiveHeight(7),
              }}></View>
          </RBSheet>
        </View> */}
        {/* ======================>>>>>>>>>>>> bottom sheeet  end */}

        <View>
          <BottomModal
            animationType={'pokeman'}
            transparent={true}
            height={responsiveHeight(72)}
            modalStyle={{borderTopLeftRadius:15,borderTopRightRadius:15}}
            borderTopLeftRadius={15}
            // marginBottom={responsiveHeight(8)}
            style={{
              backgroundColor: 'rgba(0,0,0,0.85)',
              borderRadius: responsiveWidth(5),
            }}
            visible={this.state.modalVisible}
            onTouchOutside={() => {
              this.props.navigation.goBack();
              this.setState({ modalVisible: false });
              
            }}>
            <ModalContent
              style={{
                width: responsiveWidth(100),            
                // height: responsiveHeight(75),            
                // borderRadius: 5,
                // backgroundColor:'green'
                
              }}>
              <View style={[styles.collectionview, { justifyContent: 'space-between',marginTop:-10 }]}>
                <Text style={styles.collectiontext}>My Collection</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      modalVisibleStart: true,
                      modalVisible: false,
                    });
                  }}>
                  <Text
                    style={[
                      styles.collectiontext,
                      { color: '#D9173B', right: responsiveWidth(3.5) },
                    ]}>
                    New Collection
                  </Text>
                </TouchableOpacity>
              </View>

              {this.state.sourcedata.length > 0 ? (
              <FlatList
                showsVerticalScrollIndicator={false}
                showsScrollIndicator={false}
                data={this.state.sourcedata}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      style={[
                        styles.cardview1,
                        {
                          marginBottom:
                            this.state.sourcedata.length === index + 1 ? 40 : 0,
                        },
                      ]}
                      onPress={() => {
                        if (
                          item.SneakerList !== undefined &&
                          item.SneakerList.length > 0
                        ) {
                        
                          this.props.navigation.navigate('DetailsHome', {
                            Collections: this.state.sourcedata,
                            CurrentCol: index,
                          });
                        } else {
                          this.props.navigation.navigate('AddNewCollection', {
                            Collections: this.state.sourcedata,
                            CurrentCol: index,
                          });
                        }

                        this.setState({
                          Collection: item,
                          modalVisible: false,
                        });
                        // this.RBSheet.close();
                      }}>
                      <Image
                        style={{
                          marginLeft: responsiveWidth(0.2),

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
                          this.props.navigation.navigate('AddNewCollection', {
                            Collections: this.state.sourcedata,
                            CurrentCol: index,
                          });

                          this.setState({
                            Collection: item,
                            modalVisible: false,
                          });
                          // this.RBSheet.close();
                        }}>
                        <View style={{}}>
                          <Entypo
                            name={'chevron-right'}
                            size={responsiveFontSize(3)}
                            style={{left: responsiveWidth(1.4)}}
                            color={'#949494'}
                          />
                        </View>
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
                    {
                      color: 'gray',
                      marginTop: '50%',
                      fontSize: 20,
                    
                    },
                  ]}>
                  No items
                </Text>
              </View>
              )}

              <View
                style={{
                  height: responsiveHeight(7),
                }}></View>
            </ModalContent>
          </BottomModal>
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
  cardview1: {
    width: responsiveWidth(88),
    height: responsiveHeight(9),
    // backgroundColor: 'white',
    borderBottomWidth: responsiveWidth(0.2),
    borderColor: '#B6BBC8',
    // marginTop: responsiveWidth(3),
    // elevation:1,
    // marginLeft: responsiveWidth(5),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    // marginRight: responsiveWidth(5)
  },
  profileimage: {
    height: responsiveHeight(4),
    width: responsiveHeight(4),
    borderRadius: responsiveWidth(6),
    marginLeft: responsiveWidth(20),
    marginTop: responsiveWidth(7),
    alignSelf: 'center',
  },

  headerbottom: {
    width: responsiveWidth(90),
    alignSelf: 'center',
    flexDirection: 'row',
    marginVertical: responsiveWidth(5),
  },
  nametext: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Lato-Regular',
    marginLeft: responsiveWidth(26),
  },
  icon: {
    marginLeft: responsiveWidth(20),
    //marginTop: responsiveWidth(.5)
  },
  bodycontainer: {
    width: responsiveWidth(100),
    backgroundColor: '#fff',
    // height: responsiveHeight(100),
  },
  sneakertext: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: 'Lato-Bold',
    marginTop: responsiveWidth(7),
    marginLeft: responsiveWidth(5),
    color: '#6C6C6C',
  },
  sneakertext1: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Lato-Regular',
    marginTop: responsiveWidth(0.5),
    marginLeft: responsiveWidth(5),
    marginRight: responsiveWidth(2),
  },
  image: {
    //resizeMode:'contain',
    width: responsiveWidth(88),
    height: responsiveHeight(26),
    alignSelf: 'center',
  },
  sizeview: {
    borderWidth: responsiveWidth(0.3),
    width: responsiveWidth(42),
    marginTop: responsiveWidth(3),
    marginLeft: responsiveWidth(5),
    height: responsiveHeight(6),
    borderRadius: responsiveWidth(1),
    borderColor: '#B6BBC8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  usedview: {
    borderWidth: responsiveWidth(0.3),
    width: responsiveWidth(43),
    marginTop: responsiveWidth(3),
    height: responsiveHeight(6),
    borderTopLeftRadius: responsiveWidth(1),
    borderBottomLeftRadius: responsiveWidth(1),
    borderColor: '#B6BBC8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newview: {
    width: responsiveWidth(43),
    marginTop: responsiveWidth(3),
    height: responsiveHeight(6),
    borderTopRightRadius: responsiveWidth(1),
    borderBottomRightRadius: responsiveWidth(1),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9173B',
  },
  lessview: {
    borderWidth: responsiveWidth(0.3),
    width: responsiveWidth(31),
    marginTop: responsiveWidth(3),
    height: responsiveHeight(6),
    borderRadius: responsiveWidth(1),
    borderColor: '#B6BBC8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreview: {
    width: responsiveWidth(31),
    marginTop: responsiveWidth(3),
    height: responsiveHeight(6),
    borderRadius: responsiveWidth(1),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#D9173B',
  },
  sizetext: {
    fontSize: responsiveFontSize(1.9),
    fontFamily: 'Lato-Regular',
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
    // backgroundColor:'#F55364',
  },
  favtext: {
    fontFamily: 'Lato-Bold',
    fontSize: responsiveFontSize(1.8),
  },
  modalview: {
    width: responsiveWidth(78),
    height: responsiveHeight(30.3),
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderRadius: 10,
    elevation: 5,
  },
  modalview2: {
    width: responsiveWidth(100),
    height: responsiveHeight(36),
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
    height: '100%',
    //marginTop:responsiveWidth(3)
  },
  buttontext: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Lato-Regular',
    color: '#589BE9',
  },
  privatetext: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Lato-Bold',
    marginRight: responsiveWidth(5),
    marginTop: responsiveWidth(1),
  },
  collectiontext: {
    fontFamily: 'Lato-Bold',
    fontSize: responsiveFontSize(2.2),
    marginBottom: responsiveHeight(2),
    marginLeft: responsiveWidth(4),
  },
  collectionview: {
    width: responsiveWidth(96),
    height: responsiveHeight(7),
    borderBottomWidth: responsiveWidth(0.3),
    borderColor: '#B6BBC8',
    borderRadius: responsiveWidth(8),
    //marginLeft:responsiveWidth(-3),
    // backgroundColor:'red',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  nametext1: {
    //fontFamily: 'Lato-Bold',
    // marginBottom: responsiveWidth(1),
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
    // top:responsiveHeight(0.4)
    bottom: 2,
  },
  bottomcontainer1: {
    width: responsiveWidth(89),
    alignSelf: 'center',
    //  height: responsiveWidth(100),
    borderWidth: responsiveWidth(0.3),
    borderColor: '#B6BBC8',
    borderRadius: responsiveWidth(2),
    marginTop: responsiveWidth(2),
    backgroundColor: '#fff',
    marginBottom: responsiveWidth(5),
  },
});
