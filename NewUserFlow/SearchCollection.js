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
import {KeyboardAvoidingView} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Button, Switch, Searchbar, ActivityIndicator} from 'react-native-paper';
import {saveData, getData} from '../Backend/utility';
import * as Animatable from 'react-native-animatable';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
const DefaultImageURL = [
  'https://stockx-assets.imgix.net/media/New-Product-Placeholder-Default.jpg?fit=fill&bg=FFFFFF&w=140&h=100&auto=format,compress&trim=color&q=90&dpr=2&updated_at=0',

  'https://stockx.imgix.net/Reebok-LX8500-Renarts-Dead-End-Kicks-Temp.png?fit=fill&bg=FFFFFF&w=140&h=100&auto=format,compress&trim=color&q=90&dpr=2&updated_at=1538080256',
];
export default class SearchCollection extends Component {
  
  state = {
    searchQuery: '',
    searchId: '',
    showAlert: false,
    // Collection: this.props.navigation.getParam('Collection'),
    // CollectionIndex: this.props.navigation.getParam('CollectionIndex'),
    Collection: this.props.route.params.Collections,
    CurrentCol: this.props.route.params.CurrentCol,
    modalVisibleStart: false,
    UserInfo: {},
    data: [
      //   {
      //     name: '',
      //   },
      //   {
      //     name: '',
      //   },
      //   {
      //     name: '',
      //   },
      //   {
      //     name: '',
      //   },
      //   {
      //     name: '',
      //   },
    ],
    isSearch: false,
    LastSneaker: '',
    added: false,
    userProfilePic: '',
  };
 
  toggleModal = () => {
    this.componentDidMount();
    this.setState({modalVisible: !this.state.modalVisible});
   
  
  };
  calQuantity(item) {
    var count = 0;
    item.SneakerList.map((item) => {
      count += item.Quantity;
    });
    // console.log('\n\n\n\n\n\n\n\n', count);

    return count;
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
  _onChangeSearch = (query) => this.setState({searchQuery: query});
  // async FilterFn(text) {
  //   if (text !== '') {
  //     let newData = this.state.Filterdata.filter(function (item) {
  //       //applying filter for the inserted text in search bar
  //       let itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
  //       let textData = text.toUpperCase();
  //       return itemData.indexOf(textData) > -1;
  //     });

  //     this.setState({ searchQuery: newData });
  //   } else {
  //     this.setState({ searchQuery: this.state.Filterdata });
  //     // this.setState({data2: this.state.Copydata});
  //   }
  // }

  async GetDataFromApi() {
    console.log("serach api called");
    let CallBack2 = await fetch(
      'https://the-sneaker-database.p.rapidapi.com/sneakers?limit=100&&name=' +
        this.state.searchQuery,
      {
        method: 'get',
        headers: {
          // "x-rapidapi-key": "e71a32f8acmshf99f05e2a63d495p16ec16jsnd227b703482f",
          'x-rapidapi-key':
            '620bbcea62msh6543700f8450844p125a83jsn1996b91bedea',
          'x-rapidapi-host': 'the-sneaker-database.p.rapidapi.com',
        },
      },
    )
      .then((res) => {
        return res.json();
      })
      .then(async (response) => {
        console.log('Sneaker : ', response);
        let newlist = [];
        if (response.results.length > 0) {
          let OldCol = this.state.Collection[this.state.CurrentCol];
          // if (OldCol.SneakerList) {
          // if (await this.FindinArray(item.id, OldCol.SneakerList)) {
          // OldCol.SneakerList = [item, ...OldCol.SneakerList];
          await response.results.forEach(async (element) => {
            // isAdded
            const a = element.name.substring(0, 3);
            const b = this.state.searchQuery.substring(0, 3);
            if (a == b ) {
              if (OldCol.SneakerList) {
                if (await this.FindinArray(element.id, OldCol.SneakerList)) {
                  newlist.push(element);
                  this.setState({data: newlist});
                } else {
                  element.isAdded = true;
                  newlist.push(element);
                  this.setState({data: newlist});
                }
              } else {
                newlist.push(element);
                this.setState({data: newlist});
              }
            }
          });
         
          console.log("ye nai chlna tha");
          this.setState({isSearch: false});
        } else {
          console.log("yeeeeeeee chala");
          this.setState({modalVisibleStart: true});
        }
      });
  }

  async FindinArray(Id, ObjList) {
    let Flag = true;
    await ObjList.forEach((element) => {
      if (element.id === Id) {
        Flag = false;
      }
    });
    // console.log(Flag);
    return Flag;
  }

  async componentDidMount() {
   
    const unsubscribe = this.props.navigation.addListener('focus', async () => {
      this.setState({
        Collection: this.props.route.params?.Collections,
        CurrentCol: this.props.route.params?.CurrentCol,
      });
      await this.GetColFn();
    });
    let id = await AsyncStorage.getItem('Token');
    let UserData = await getData('Users', id);
    // console.log(UserData);
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
  async GetColFn() {
    // console.log('ye aya pros', this.props.route.params.CurrentCol);
    let CurrentColCheck = this.props.route.params.CurrentCol;

    this.setState({
      CurrentCol: CurrentColCheck,
    });
    // console.log('Pervious index:', CurrentColCheck);
    let id = await AsyncStorage.getItem('Token');
    let UserData = await getData('Users', id);
    // console.log("ye aya user data",UserData.Id);
    this.setState({userid: UserData?.Id});
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
      // console.log('List : ', Collections.Collections);

      this.setState({sourcedata: Collections.Collections});
      if (Collections.Collections[CurrentColCheck].SneakerList !== undefined) {
        // console.log(
        //   'ALl sneakers = ',
        //   Collections.Collections[CurrentColCheck].SneakerList,
        // );
        await this.setState({
          // dataLoad: true,
          // CurrentCol:CurrentColCheck,
          // Copydata: Collections.Collections[CurrentColCheck].SneakerList,
          data2: Collections.Collections[CurrentColCheck].SneakerList,
          Filterdata: Collections.Collections[CurrentColCheck].SneakerList,
        });

        let arr = [];
        Collections.Collections[CurrentColCheck].SneakerList.map((data, i) => {
          if (data.image) {
            let media = {
              thumbUrl: data.image.thumbnail,
            };
            data.media = media;
            data.title = data.name;
            arr.push(data);
            this.setState({
              data2: arr,
              dataLoad: true,
            });
          } else {
            this.setState({
              dataLoad: true,
              CurrentCol: CurrentColCheck,
              Copydata: Collections.Collections[CurrentColCheck].SneakerList,
              data2: Collections.Collections[CurrentColCheck].SneakerList,
              Filterdata: Collections.Collections[CurrentColCheck].SneakerList,
            });
            // console.log('uuuuu filtr',Filterdata);
          }
        });
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
    console.log('ye aya call krny py', index);

    let CurrentColCheck = index;

    this.setState({
      CurrentCol: CurrentColCheck,
    });
    console.log('Pervious index:', CurrentColCheck);
    let id = await AsyncStorage.getItem('Token');
    let UserData = await getData('Users', id);
    this.getFcmFn(UserData?.Id);
    // console.log("ye aya user data",UserData.Id);
    this.setState({userid: UserData?.Id});
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
      // console.log('List : ', Collections.Collections);

      this.setState({sourcedata: Collections.Collections});
      if (Collections.Collections[CurrentColCheck].SneakerList !== undefined) {
        // console.log(
        //   'ALl sneakers = ',
        //   Collections.Collections[CurrentColCheck].SneakerList,
        // );
        await this.setState({
          // dataLoad: true,
          // CurrentCol:CurrentColCheck,
          // Copydata: Collections.Collections[CurrentColCheck].SneakerList,
          data2: Collections.Collections[CurrentColCheck].SneakerList,
          Filterdata: Collections.Collections[CurrentColCheck].SneakerList,
        });

        let arr = [];
        Collections.Collections[CurrentColCheck].SneakerList.map((data, i) => {
          if (data.image) {
            let media = {
              thumbUrl: data.image.thumbnail,
            };
            data.media = media;
            data.title = data.name;
            arr.push(data);
            this.setState({
              data2: arr,
              dataLoad: true,
            });
          } else {
            this.setState({
              dataLoad: true,
              CurrentCol: CurrentColCheck,
              Copydata: Collections.Collections[CurrentColCheck].SneakerList,
              data2: Collections.Collections[CurrentColCheck].SneakerList,
              Filterdata: Collections.Collections[CurrentColCheck].SneakerList,
            });
            // console.log('uuuuu filtr',Filterdata);
          }
        });
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
  render() {
    const {searchQuery, CurrentCol} = this.state;
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
        {/* Custom Alert */}
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
                ADDED TO {this.state.Collection[CurrentCol].name} COLLECTION
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
        {this.state.isLoading ? (
          <View style={{alignItems: 'center', width: '100%', marginTop: '40%'}}>
            <ActivityIndicator size={'large'} color={'black'} />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.cardview}>
              <Image
                style={{
                  marginLeft: responsiveWidth(0),
                  height: responsiveWidth(7),
                  width: responsiveWidth(7),
                  marginBottom: 2,
                }}
                source={
                  this.state.Collection[CurrentCol].fav
                    ? require('../../Assets/Star.png')
                    : require('../../Assets/StarUnselected.png')
                }
              />
              <Text style={[styles.nametext]}>
                {this.state.Collection[CurrentCol].name}
              </Text>
              <TouchableOpacity
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
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: '#B6BBC8',
                width: responsiveWidth(100),
              }}></View>
            <View style={styles.searchview}>
              {/* <Searchbar
              onChangeText={this._onChangeSearch}
              value={searchQuery}
              
              
              theme={{
                // ...DefaultTheme,
                roundness: 2,
                colors: {
                  // ...DefaultTheme.colors,
                  primary: 'black',
                  text: 'black',
                },
              }}
              style={{
                fontSize: 12,
                elevation: 0,
                borderRadius: responsiveWidth(8),
                borderColor: '#979797',
                borderWidth: responsiveWidth(0.3),
                width: responsiveWidth(70),
                height: responsiveHeight(5),
              }}
            /> */}
              <Searchbar
                placeholder={'Search Sneakers'}
                onChangeText={this._onChangeSearch}
                // onChangeText={(text) => {
                //   this.FilterFn(text);
                // }}
                value={searchQuery}
                onSubmitEditing={() => {
                  this.setState({isSearch: true});
                  this.GetDataFromApi();
                }}
                theme={{
                  // ...DefaultTheme,
                  roundness: 2,
                  colors: {
                    // ...DefaultTheme.colors,
                    primary: 'black',
                    text: 'black',
                  },
                }}
                style={{
                  marginTop: responsiveWidth(2),
                  elevation: 0,
                  borderRadius: responsiveWidth(8),
                  borderColor: '#979797',
                  borderWidth: responsiveWidth(0.3),
                  height: responsiveHeight(7),
                  width: responsiveWidth(90),
                  fontSize: 5,
                  margin: 0,
                  padding: 0,
                }}
              />
              {/* <Text 
            onPress={()=>{
                this.GetDataFromApi();
            }}
            style={styles.text}>Search</Text> */}
            </View>
            {this.state.searchQuery !== '' ? (
              <View style={styles.bottomcontainer1}>
                <Text style={styles.text1}>RESULTS</Text>
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
                    data={this.state.data}
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
                            onPress={async () => {
                              this.setState({isLoading: true});
                              let Id = await AsyncStorage.getItem('Token');
                              let OldCol = this.state.Collection[CurrentCol];
                              if (
                                DefaultImageURL.indexOf(
                                  item.image.thumbnail,
                                ) !== -1 ||
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
                                  // this.setState({Collection: OldCol})
                                  // alert(item.title +" Added in Collection");
                                  this.setState({
                                    LastSneaker: item.title
                                      ? item.title
                                      : item.name,
                                    showAlert: true,
                                  });
                                  setTimeout(() => {
                                    this.setState({showAlert: false});
                                  }, 6000);
                                } else {
                                  // alert(item.title +" already in this Collection")
                                }
                              } else {
                                OldCol.SneakerList = [item];
                                this.setState({
                                  LastSneaker: item.title
                                    ? item.title
                                    : item.name,
                                  showAlert: true,
                                });
                                setTimeout(() => {
                                  this.setState({showAlert: false});
                                }, 6000);
                                // this.setState({Collection: OldCol})
                                // alert(item.title +" Added in Collection");
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
                                // Community.Feed= [tempObj,...Community.Feed];
                                // console.log('\n\n\n\n\n\n\njfjfjfjfjfjfjfjfj',Community)

                                await saveData(
                                  'Community',
                                  'Community',
                                  Community,
                                );
                              }

                              // let Community = await getData(
                              //   'Community',
                              //   'Community',
                              // );
                              // let tempObj = UserInfo;
                              // item.Status = 'Added';
                              // UserInfo.timeAgo = moment().format();
                              // tempObj.sneakers = [item];
                              // UserInfo.PostId = this.uniqueID();
                              // Community.Feed = [tempObj, ...Community.Feed];
                              // await saveData(
                              //   'Community',
                              //   'Community',
                              //   Community,
                              // );
                              item.Quantity = 1;

                              CollList.Collections[
                                this.state.CurrentCol
                              ] = OldCol;
                              this.setState({Collection: CollList.Collections});
                              // console.log('>>>>>>',CollList);
                              await saveData('Collections', Id, CollList);
                              let OldData = this.state.data;
                              OldData[index].isAdded = true;
                              this.forceUpdate();
                              this.setState({isLoading: false});
                            }}>
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
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginHorizontal: 13,
                }}>
                <Text
                  style={{
                    top: 3,
                    textAlign: 'center',
                    marginTop: responsiveHeight(12),
                    fontFamily: 'Lato-Bold',
                    fontSize: responsiveFontSize(2.7),
                  }}>
                  QUICKLY ADD SNEAKERS
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: 'Lato-Bold',
                    fontSize: responsiveFontSize(2.7),
                  }}>
                  TO YOUR COLLECTION BY SEARCHING OUR INVENTORY
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    marginTop: responsiveHeight(3),
                    fontFamily: 'Lato-Regular',
                    fontSize: responsiveFontSize(2.5),
                    marginHorizontal: 30,
                  }}>
                  If you cannot find the sneaker, you can add it manually.
                </Text>
              </View>
            )}
          </ScrollView>
        )}

        <Modal
          visible={this.state.modalVisibleStart}
          transparent={true}
          overlayBackgroundColor="rgba(0,0,0,1)"
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
                }}>
                WE COULDN'T FIND THE
              </Text>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  fontWeight: 'normal',
                  fontSize: responsiveFontSize(2),
                  alignSelf: 'center',
                }}>
                SNEAKER YOU SEARCHED FOR
              </Text>
              <Text
                style={{
                  fontFamily: 'Lato-Regular',
                  fontWeight: 'normal',
                  fontSize: responsiveFontSize(2.1),
                  // alignSelf: 'center',
                  marginTop: responsiveHeight(3),
                  textAlign: 'center',
                }}>
                Would you like to add it manually?
              </Text>
              <View
                style={{
                  marginTop: responsiveHeight(2),
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
                    this.setState({
                      modalVisibleStart: false,
                      isLoading: false,
                      searchQuery: '',
                    });
                    this.forceUpdate();
                  }}>
                  <Text style={[styles.buttontext, {right: 3, bottom: 3}]}>
                    No
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonview}
                  onPress={() => {
                    this.props.navigation.navigate('AddSneaker', {
                      Collections: this.state.Collection,
                      CurrentCol: this.state.CurrentCol,
                    });
                    this.setState({modalVisibleStart: false});
                  }}>
                  <Text style={[styles.buttontext, {left: 3, bottom: 3}]}>
                    Yes
                  </Text>
                </TouchableOpacity>
              </View>
            </ModalContent>
          </View>
        </Modal>
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
              renderItem={({item, index}) => {
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
                        <View style={{marginLeft: responsiveWidth(4)}}>
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
                            }}>
                            <Text
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
  modalview: {
    width: responsiveWidth(80),
    height: responsiveHeight(26),
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
  cardview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: responsiveWidth(80),
    alignSelf: 'center',
    marginVertical: responsiveWidth(6),
  },
  searchview: {
    width: responsiveWidth(90),
    alignSelf: 'center',
    marginVertical: responsiveWidth(4),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Lato-Bold',
    color: '#D9173B',
  },
  text1: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Lato-Bold',
    margin: responsiveWidth(4),
    marginLeft: responsiveWidth(5),
  },
  cardtext: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Lato-Regular',
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
  cardview1: {
    width: responsiveWidth(88),
    height: responsiveHeight(8.5),
    borderBottomWidth: responsiveWidth(0.3),
    borderColor: '#B6BBC8',
    borderRadius: responsiveWidth(2),
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: "space-around",
    // marginRight: responsiveWidth(5),
    marginLeft: responsiveWidth(1.5),
  },
});
