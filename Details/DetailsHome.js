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
  Modal,
  // ToastAndroid,
  Share,
  PermissionsAndroid,
  // Platform
} from 'react-native';
import Toast from 'react-native-simple-toast';
import {
  ModalContent,
  ModalTitle,
  ModalButton,
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
import { Button, Switch, ActivityIndicator } from 'react-native-paper';
import { Searchbar } from 'react-native-paper';
import { getData, saveData } from '../Backend/utility';
import Clipboard from '@react-native-community/clipboard';
import XLSX from 'xlsx';
import FileViewer from 'react-native-file-viewer';
import { Table, Row } from 'react-native-table-component';
import firestore from '@react-native-firebase/firestore';
import axios from 'axios';
import FastImage from 'react-native-fast-image'
import {
  writeFile,
  readFile,
  DownloadFileOptions,
  DocumentDirectoryPath,
  DownloadDirectoryPath,
} from 'react-native-fs';

const DefaultImageURL =
  'https://stockx-assets.imgix.net/media/New-Product-Placeholder-Default.jpg?fit=fill&bg=FFFFFF&w=140&h=100&auto=format,compress&trim=color&q=90&dpr=2&updated_at=0';
const DefaultImageURL2 =
  'https://stockx.imgix.net/Reebok-LX8500-Renarts-Dead-End-Kicks-Temp.png?fit=fill&bg=FFFFFF&w=140&h=100&auto=format,compress&trim=color&q=90&dpr=2&updated_at=1538080256';

//Android
const DDP =
  Platform.OS === 'ios'
    ? DocumentDirectoryPath + '/'
    : DownloadDirectoryPath + '/';

//ios
// const DDP= DocumentDirectoryPath+"/";

const input = (res) => res;
const output = (str) => str;

export default class DetailsHome extends Component {

  state = {
    isSwitchOn: true,
    overlay: false,
    searchQuery: '',
    moveVisible: false,
    sourcedata: [],
    filterOn: false,
    // CurrentCol: this.props.navigation.getParam('CurrentCol'),
    CurrentCol: this.props.route.params.CurrentCol,
    isdataLoad: false,
    dataLoad: false,
    data2: [],
    Filterdata: [],
    visible3: false,
    data: [],
    add: false,
    modalVisibleStart: false,
    modalVisible: false,
    UserInfo: {},
    isSearch: false,
    move: -1,
    userProfilePic: '',
    userid: "",
    FMCtoken: "",

  };
  toggleModal = () => {
    this.componentDidMount();
    this.setState({ modalVisible: !this.state.modalVisible });
  };
  _onChangeSearch = (query) => this.setState({ searchQuery: query });
  _onToggleSwitch = () =>
    this.setState((state) => ({ isSwitchOn: !state.isSwitchOn }));

  async componentDidMount() {
    this.setState({ CurrentCol: this.props.route.params.CurrentCol })
    // console.log('Received params = ',this.props.route.params)
    this.externalStoragePermission();
    this.focusListener = this.props.navigation.addListener(
      'focus',
      async () => {
        // console.log('Focus called')
        this.setState({ dataLoad: false })
        await this.GetColFn();
      },
    );
    // console.log('IN DETAIL HOMEE')
  }
  copyToClipboard() {
    Clipboard.setString("sneakerlog://App/Home/UserCollectionDetailslink/" + this.state.UserInfo.Id + "/" + this.state.CurrentCol);
    // ToastAndroid.show('Copied to ClipBoard', ToastAndroid.BOTTOM);
    Toast.show('Copied to ClipBoard', Toast.LONG);
  }

  // var that=this;

  externalStoragePermission = async () => {
    console.log('Call 1');
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'External Storage Write Permission',
          message: 'App need access to storage data',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Call 2');
      } else {
        Toast.show('The access permission is not granted', Toast.LONG);


        // alert("The access permission is not granted");
      }
    } catch (err) { }
  };
  // async componentDidMount() {
  //   this.focusListener = this.props.navigation.addListener(
  //     'didFocus',
  //     async () => {
  //       this.GetColFn();
  //     },
  //   );
  // }
  calQuantity(item) {
    var count = 0;
    item.SneakerList.map((item) => {
      count += item.Quantity;
    })
    console.log('\n\n\n\n\n\n\n\n', count)

    return count;
  }
  share = async () => {
    try {
      const result = await Share.share({
        title: 'SneakerLog',
        message:
          'Check out my SneakerLog, here is a link to my ' +
          this.state.sourcedata[this.state.CurrentCol].name +
          ' Collection.' + "\n" +
          "sneakerlog://App/Home/UserCollectionDetailslink/" + this.state.UserInfo.Id + "/" + this.state.CurrentCol,
        url: "sneakerlog://App/Home/UserCollectionDetailslink/" + this.state.UserInfo.Id + "/" + this.state.CurrentCol,
      });

      if (result.action === Share.sharedAction) {
        console.log(result.activityType);

        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Toast.show(error.message, Toast.LONG);
      // alert(error.message);
    }
  };
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

  async GetDataFromApi() {
    let CallBack2 = await fetch(
      'https://the-sneaker-database.p.rapidapi.com/sneakers?limit=100&&name=' +
      this.state.searchQuery,
      {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        // console.log('Sneaker details home: ', response);

        if (response.results.length > 0) {
          this.setState({ isSearch: false, data2: response.results });
        } else {
          this.setState({ data2: [] });
        }
      });
  }
  async FindinArray(Id, ObjList) {
    let Flag = true;
    ObjList.forEach((element) => {
      if (element.id === Id) {
        Flag = false;
      }
    });
    // console.log(Flag);
    return Flag;
  }

  async FilterFn(text) {
    if (text !== '') {
      let newData = this.state.Filterdata.filter(function (item) {
        //applying filter for the inserted text in search bar
        let itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
        let textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      this.setState({ data2: newData });
    } else {
      this.setState({ data2: this.state.Filterdata });
      // this.setState({data2: this.state.Copydata});
    }
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
  setModalVisible = (visible) => {
    this.setState({ visible3: visible });
  };

  async ExportFile() {
    let col = this.state.sourcedata;
    let data = col[this.state.CurrentCol].SneakerList;

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');

    const wbout = XLSX.write(wb, { type: 'binary', bookType: 'xlsx' });
    const file = DDP + col[this.state.CurrentCol].name + '.xlsx';

    writeFile(file, output(wbout), 'ascii')
      .then(async (res) => {
        // alert("File exported to "+ file);
        let id = this.uniqueID();
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        await saveData('SheetLog', id, {
          id: id,
          path: file,
          Token: fcmToken,
        });

        Toast.show(
          'Your file is being downloaded. You can find it in the downloads folder',
          Toast.LONG,
        );
        this.NotificationFn();
        // ToastAndroid.show('Your file is being downloaded. You can find it in the downloads folder', ToastAndroid.BOTTOM);
        console.log('File exported to ', file);
      })
      .catch((err) => {
        Toast.show(err.message, Toast.LONG);
        // alert("Error ", err.message)
      });
  }

  render() {
    const { isSwitchOn, CurrentCol } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent></StatusBar>
        <BottomModal
          animationType={'pokeman'}
          transparent={false}
          // transparent={true}
          height={responsiveHeight(86)}
          visible={this.state.moveVisible}
          onTouchOutside={() => {
            this.setState({ moveVisible: false });
          }}>
          <ModalContent
            style={{
              width: responsiveWidth(100),
              flex: 1,
              borderRadius: responsiveWidth(3),
            }}>
            <View
              style={{
                width: responsiveWidth(88),
                height: responsiveHeight(7),
                borderBottomWidth: responsiveWidth(0.3),
                borderColor: '#B6BBC8',
                borderRadius: responsiveWidth(2),
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
                Move Nike Air Jordan 1 to...
              </Text>
            </View>
            <FlatList
              showsScrollIndicator={false}
              data={this.state.sourcedata}
              renderItem={({ item, index }) => {
                return index === this.state.CurrentCol ? (
                  <TouchableOpacity
                    onPress={() => {
                      this.toggleModal();
                    }}
                    style={styles.cardview1}>
                    <AntDesign
                      name={item.fav ? 'star' : 'staro'}
                      size={25}
                      color={item.fav ? '#F5A623' : '#E8E8E8'}
                      style={{ marginLeft: responsiveWidth(0.2) }}
                    />
                    <View
                      style={{
                        width: responsiveWidth(72),
                        alignItems: 'flex-start',
                        justifyContent: 'center',
                        marginLeft: responsiveWidth(3),
                      }}>
                      {item.isPrivate ? (
                        <View>
                          <Text
                            style={[
                              styles.nametext,
                              { marginLeft: responsiveWidth(2) },
                            ]}>
                            {item.name}
                          </Text>
                          <View
                            style={{
                              height: responsiveHeight(3),
                              width: responsiveWidth(17),
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: '#362636',
                              borderRadius: responsiveHeight(1),
                              //marginLeft:responsiveWidth(5)
                            }}>
                            <Text
                              style={{
                                fontSize: responsiveFontSize(1.8),
                                fontFamily: 'Lato-thin',
                                fontWeight: 'normal',
                                color: '#FFF',
                              }}>
                              Private
                            </Text>
                          </View>
                        </View>
                      ) : (
                        <Text
                          style={[
                            styles.nametext,
                            { marginLeft: responsiveWidth(2) },
                          ]}>
                          {item.name}
                        </Text>
                      )}
                    </View>
                    <TouchableOpacity>
                      <View style={{}}>
                        <MaterialIcons
                          name={'keyboard-arrow-right'}
                          size={25}
                          color={'#949494'}
                          style={{}}
                        />
                      </View>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ) : null;
              }}
            />
            <View
              style={{
                width: responsiveWidth(88),
                height: responsiveHeight(5),
                borderRadius: responsiveWidth(2),
                flexDirection: 'row',
                alignItems: 'flex-end',
                justifyContent: 'center',
                bottom: responsiveHeight(-4),
              }}>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  fontWeight: 'bold',
                  fontSize: responsiveFontSize(2.6),
                  marginBottom: responsiveHeight(3),
                  color: '#589BE9',
                }}>
                Cancel
              </Text>
            </View>
          </ModalContent>
        </BottomModal>
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
                      console.log("ye aay crurrent index", index)
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


        {this.state.dataLoad ? (
          <>
            <ScrollView>
              <View style={styles.collectionview}>
                <TouchableOpacity
                  onPress={async () => {
                    let List = this.state.sourcedata;
                    List[this.state.CurrentCol].fav = !List[
                      this.state.CurrentCol
                    ].fav;
                    console.log(List[this.state.CurrentCol]);
                    let Id = await AsyncStorage.getItem('Token');
                    await saveData('Collections', Id, { Collections: List });
                    this.setState({ sourcedata: List });
                    this.forceUpdate();
                  }}
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
                      this.state.sourcedata[this.state.CurrentCol].fav
                        ? require('../../Assets/Star.png')
                        : require('../../Assets/StarUnselected.png')
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => {
                  this.toggleModal();
                }}>
                  <Text
                    style={[
                      styles.nametext,
                      { width: responsiveWidth(40), textAlign: 'center' },
                    ]}>
                    {this.state.sourcedata[this.state.CurrentCol].name}
                  </Text>
                </TouchableOpacity>
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
              <View
                style={{
                  borderBottomWidth: 1,
                  borderColor: '#B6BBC8',
                  width: responsiveWidth(100),
                  // backgroundColor:'red'
                }}></View>
              {this.state.add ? (
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: responsiveWidth(5),
                    marginLeft: responsiveWidth(5),
                  }}>
                  <Searchbar
                    onChangeText={this._onChangeSearch}
                    value={this.state.searchQuery}
                    onSubmitEditing={() => {
                      this.setState({ isSearch: true });
                      this.GetDataFromApi();
                    }}
                    onEndEditing={() => {
                      this.setState({ add: false });
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
                      margin: 0,
                      padding: 0,
                      fontSize: responsiveFontSize(1),
                      elevation: 0,
                      borderRadius: responsiveWidth(8),
                      borderColor: '#979797',
                      borderWidth: responsiveWidth(0.3),
                      height: responsiveHeight(7),
                      width: responsiveWidth(90),
                    }}
                  />

                </View>
              ) : this.state.filterOn ? (
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: responsiveWidth(1.9),
                  }}>
                  <Searchbar
                    onChangeText={(text) => {
                      this.FilterFn(text);
                    }}
                    // value={this.state.searchQuery}
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
                      fontSize: responsiveFontSize(1),
                      elevation: 0,
                      margin: 0,
                      padding: 0,
                      borderRadius: responsiveWidth(8),
                      borderColor: '#979797',
                      borderWidth: responsiveWidth(0.3),
                      height: responsiveHeight(6),
                      width: responsiveWidth(70),
                      marginBottom: 10,
                      marginLeft: responsiveWidth(5),
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => this.setState({ filterOn: false })}
                    style={{ justifyContent: 'center' }}>
                    <Text
                      style={{
                        fontFamily: 'Lato-Bold',
                        fontSize: responsiveFontSize(1.7),
                        color: '#D9173B',
                        marginLeft: responsiveWidth(7),
                        alignSelf: 'center',
                      }}>
                      Cancel
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    marginVertical: responsiveWidth(5),
                    marginLeft: responsiveWidth(4.4),
                  }}>
                  {/* <Text style={styles.privatetext}>PRIVATE</Text> */}

                  <View
                    style={
                      {
                        // height: responsiveHeight(4),
                        //width: responsiveWidth(12),
                        // justifyContent: 'center',
                        //: 'center',
                        //  backgroundColor: '#08CF6E',
                        // borderRadius: responsiveHeight(2),
                      }
                    }>
                    {this.state.sourcedata[this.state.CurrentCol].isPrivate ? (
                      <View
                        style={[
                          styles.privateContainer,
                          { flexDirection: 'row' },
                        ]}>
                        <Image
                          source={require('../../Assets/pvt.png')}
                          style={{
                            height: 30,
                            width: 30,
                            resizeMode: 'contain',
                            marginLeft: 5,
                          }}
                        />
                        <Text
                          style={{
                            alignSelf: 'center',
                            fontFamily: 'Lato-Semibold',
                            left: 6.5,
                          }}>
                          Private
                        </Text>
                      </View>
                    ) : (
                      <View style={{ width: responsiveWidth(19) }}></View>
                    )}


                  </View>

                  <View style={{ width: responsiveWidth(42) }} />
                  <TouchableOpacity onPress={() => this.setModalVisible(true)}>
                    {this.state.modalVisible ? (
                      <View
                        style={{
                          height: responsiveWidth(5),
                          width: responsiveWidth(5),
                          resizeMode: 'contain',
                        }}
                      />
                    ) : (
                      <Image
                        source={require('../../Assets/Vector.png')}
                        style={{
                          height: responsiveWidth(6),
                          width: responsiveWidth(7),
                          resizeMode: 'contain',
                          right: 4,
                          // backgroundColor:'blue'
                        }}
                      />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{}}
                    onPress={() => this.setState({ filterOn: true })}>
                    <Image
                      style={{
                        height: responsiveWidth(6),
                        resizeMode: 'contain',
                        width: responsiveWidth(8.6),
                        marginLeft: responsiveWidth(2.5),
                        // backgroundColor:"green"
                      }}
                      source={require('../../Assets/filter.png')}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{}}
                    onPress={() => {
                      // alert("call")
                      console.log(this.state.sourcedata[this.state.CurrentCol]);
                      this.props.navigation.navigate('AddNewCollection', {
                        Collections: this.state.sourcedata,
                        CurrentCol: this.state.CurrentCol,
                      });
                    }}>
                    <Image
                      style={{
                        height: responsiveWidth(6),
                        resizeMode: 'contain',
                        width: responsiveWidth(9),
                        marginLeft: responsiveWidth(2.5),
                        // backgroundColor:'red'
                      }}
                      source={require('../../Assets/Add.png')}
                    />
                  </TouchableOpacity>
                </View>
              )}
              <View
                style={[
                  styles.collectioncontainer,
                  {
                    marginBottom: responsiveHeight(3),
                    marginTop:
                      this.state.searchQuery !== '' ? responsiveHeight(2) : 0,
                  },
                ]}>
                {this.state.add ? (
                  <View
                    style={{
                      height: responsiveHeight(9.9),
                      width: responsiveWidth(90),
                      // justifyContent: 'center',
                      alignItems: 'center',
                      flexDirection: 'row',
                      borderBottomColor: '#B6BBC8',
                      borderBottomWidth: 1,
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Lato-Bold',
                        fontWeight: 'bold',
                        fontSize: responsiveFontSize(2.2),
                        marginHorizontal: responsiveWidth(3.5),
                      }}>
                      SUGGESTED
                    </Text>
                  </View>
                ) : null}
                {console.log('ye ayaaaaaaaaaaa data 2', this.state.data2)}
                {this.state.data2?.length > 0 ? (
                  <FlatList
                    data={this.state.data2}
                    // style={{marginBottom:responsiveHeight(2)}}
                    keyExtractor={(item) => item.title}
                    renderItem={(item, index) => {
                      // console.log("index: con:",item.index);
                      if (this.state.move !== item.item.retailPrice) {
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              if (this.state.searchQuery !== '') {
                                // this.props.navigation.navigate('ResultItems',{
                                // item: item,
                                //   Collections: this.state.sourcedata,
                                //   CurrentCol: this.state.CurrentCol});
                              } else {
                                // console.log("Call index:",index)
                                this.props.navigation.navigate('ItemDetails', {
                                  item: item,
                                  Collections: this.state.sourcedata,
                                  CurrentCol: this.state.CurrentCol,
                                  CurrentSneaker: item.index,
                                });
                              }
                            }}
                            style={{
                              height: responsiveHeight(8.9),
                              width: responsiveWidth(88),
                              // flexWrap:"wrap",
                              // justifyContent: 'center',
                              alignItems: 'center',
                              flexDirection: 'row',
                              marginLeft: responsiveWidth(2),
                              borderBottomColor: '#B6BBC8',
                              borderBottomWidth:
                                item.index === this.state.data2.length - 1
                                  ? 0
                                  : 1,
                            }}>
                            {/* <Image
                              style={{
                                marginLeft: responsiveWidth(1.5),
                                height: responsiveHeight(6),
                                width: responsiveWidth(10),
                                resizeMode: 'contain',
                                alignSelf: 'center',
                              }}
                              source={
                                item.item.media?.thumbUrl !== null &&
                                item.item.media?.thumbUrl !== DefaultImageURL &&
                                item.item.media?.thumbUrl !== DefaultImageURL2 &&
                                item.item.media?.thumbUrl !== ''
                                  ? {uri: item.item.media?.thumbUrl}
                                  : require('../../Assets/placeholder.png')
                              }
                            /> */}
                            <FastImage
                              source={
                                item.item.media?.thumbUrl !== null &&
                                  item.item.media?.thumbUrl !== DefaultImageURL &&
                                  item.item.media?.thumbUrl !== DefaultImageURL2 &&
                                  item.item.media?.thumbUrl !== ''
                                  ? { uri: item.item.media?.thumbUrl }
                                  : require('../../Assets/placeholder.png')
                              }
                              resizeMode={FastImage.resizeMode.contain}
                              style={{
                                marginLeft: responsiveWidth(1.5),
                                height: responsiveHeight(6),
                                width: responsiveWidth(10),
                                // resizeMode: 'contain',
                                alignSelf: 'center',
                              }} />
                            <View
                              style={{ marginHorizontal: responsiveWidth(3) }}>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  width: responsiveWidth(40),
                                }}>
                                <Text
                                  style={{
                                    fontFamily: 'Lato-thin',
                                    fontWeight: 'normal',
                                    fontSize: responsiveFontSize(1.8),
                                  }}
                                  ellipsizeMode={'tail'}
                                  numberOfLines={1}>
                                  {' '}
                                  {item.item.title}
                                </Text>
                              </View>

                            </View>
                            <View style={{ width: responsiveWidth(4) }} />

                            {this.state.add ? null : (
                              <Text
                                style={{
                                  width: responsiveWidth(13),
                                  fontFamily: 'Lato-thin',
                                  // fontWeight: 'bold',
                                  fontSize: responsiveFontSize(1.8),
                                  marginHorizontal: responsiveWidth(2.5),
                                  textAlign: "right"
                                }}>
                                ${item.item.retailPrice}
                              </Text>
                            )}
                            {this.state.add ? (
                              <TouchableOpacity
                                style={{ width: '10%' }}
                                onPress={async () => {
                                  let Id = await AsyncStorage.getItem('Token');
                                  let OldCol = this.state.sourcedata[
                                    this.state.CurrentCol
                                  ];
                                  if (OldCol.SneakerList) {
                                    if (
                                      await this.FindinArray(
                                        item.item.id,
                                        OldCol.SneakerList,
                                      )
                                    ) {
                                      OldCol.SneakerList = [
                                        item.item,
                                        ...OldCol.SneakerList,
                                      ];
                                      let OldList = this.state.sourcedata;
                                      OldList[this.state.CurrentCol] = OldCol;
                                      this.setState({ sourcedata: OldList });
                                      Toast.show(
                                        item.item.title +
                                        ' Added in Collection',
                                        Toast.LONG,
                                      );
                                      // alert(
                                      //   item.item.title +
                                      //     ' Added in Collection',
                                      // );
                                    } else {
                                      Toast.show(
                                        item.item.title +
                                        ' already in Collection',
                                        Toast.LONG,
                                      );
                                      // alert(
                                      //   item.item.title +
                                      //     ' already in this Collection',
                                      // );
                                    }
                                  } else {
                                    OldCol.SneakerList = [item.item];
                                    let OldList = this.state.sourcedata;
                                    OldList[this.state.CurrentCol] = OldCol;
                                    this.setState({ sourcedata: OldList });
                                    // alert(
                                    //   item.item.title + ' Added in Collection',
                                    // );
                                    Toast.show(
                                      item.item.title + ' Added in Collection',
                                      Toast.LONG,
                                    );
                                  }

                                  await saveData('Collections', Id, {
                                    Collections: this.state.sourcedata,
                                  });
                                  this.GetColFn();
                                }}
                              >
                                <Image
                                  style={{
                                    height: responsiveWidth(6.6),
                                    resizeMode: 'contain',
                                    width: responsiveWidth(9),
                                    marginLeft: responsiveWidth(14),
                                  }}
                                  source={require('../../Assets/Add.png')}
                                />
                              </TouchableOpacity>
                            ) : (

                              <Entypo
                                onPress={() => {
                                  this.state.add
                                    ? this.setState({ move: item.item.price })
                                    : null;
                                }}
                                name="chevron-right"
                                size={responsiveFontSize(3)}
                                color="#949494"
                              />
                            )}
                          </TouchableOpacity>
                        );
                      } else {
                        return (
                          <TouchableOpacity
                            onPress={() => {
                              if (this.state.searchQuery !== '') {
                                this.props.navigation.navigate('ResultItems');
                              } else {
                                // console.log("Call index1 :",index)
                                this.props.navigation.navigate('ItemDetails', {
                                  item: item.item,
                                  Collections: this.state.sourcedata,
                                  CurrentCol: this.state.CurrentCol,
                                  CurrentSneaker: item.index,
                                });
                              }
                            }}
                            style={{
                              height: responsiveHeight(8.9),
                              width: responsiveWidth(88),
                              // justifyContent: 'center',
                              alignItems: 'center',
                              flexDirection: 'row',
                              marginLeft: responsiveWidth(2),
                              borderBottomColor: '#B6BBC8',
                              borderBottomWidth: 1,
                            }}>
                            <View style={{ width: responsiveWidth(4.5) }} />
                            {!item.item.instock ? (
                              <AntDesign
                                style={{ marginRight: responsiveWidth(1.5) }}
                                name="minuscircle"
                                size={responsiveFontSize(3)}
                                color="#F5A623"
                              />
                            ) : item.item.limited ? (
                              <AntDesign
                                style={{ marginRight: responsiveWidth(1.5) }}
                                name="downcircle"
                                size={responsiveFontSize(3)}
                                color="#D0021B"
                              />
                            ) : (
                              <AntDesign
                                style={{ marginRight: responsiveWidth(1.5) }}
                                name="upcircle"
                                size={responsiveFontSize(3)}
                                color="#7AD693"
                              />
                            )}

                            <Text
                              style={{
                                fontFamily: 'Lato-Bold',
                                fontWeight: 'bold',
                                fontSize: responsiveFontSize(1.8),
                                marginHorizontal: responsiveWidth(3),
                                textAlign: "right"
                              }}>
                              ${item.item.price}
                            </Text>
                            <Entypo
                              onPress={() => {
                                this.state.add
                                  ? this.setState({ move: index })
                                  : null;
                              }}
                              name="chevron-right"
                              size={responsiveFontSize(3)}
                              color="#949494"
                            />
                            <View style={{ width: responsiveWidth(13) }} />
                            <TouchableOpacity
                              onPress={() =>
                                this.setState({
                                  moveVisible: true,
                                })
                              }
                              style={{
                                backgroundColor: '#8250C1',
                                height: responsiveHeight(9),
                                width: responsiveWidth(22),
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{
                                  fontFamily: 'Lato-Bold',
                                  fontWeight: 'bold',
                                  fontSize: responsiveFontSize(1.8),
                                  color: '#fff',
                                }}>
                                Move
                              </Text>
                            </TouchableOpacity>
                            <View
                              style={{
                                backgroundColor: '#FF0000',
                                height: responsiveHeight(9),
                                width: responsiveWidth(22),
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}>
                              <Text
                                style={{
                                  fontFamily: 'Lato-Bold',
                                  fontWeight: 'bold',
                                  fontSize: responsiveFontSize(1.8),
                                  color: '#fff',
                                }}>
                                Delete
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      }
                    }}
                  />
                ) : (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 10,
                    }}>
                    <Text
                      style={[
                        styles.favtext,
                        { color: 'gray', fontSize: 20, textAlign: 'center' },
                      ]}>
                      No Sneaker
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>
            {/* <View style={{height:responsiveHeight(6)}}/> */}
          </>
        ) : (
          <View style={{ marginTop: '40%' }}>
            <ActivityIndicator size={'large'} color={'black'} />
          </View>
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visible3}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.8)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: 'Lato-Bold',
                fontWeight: 'bold',
                fontSize: responsiveFontSize(2.8),
                color: '#fff',
                marginLeft: responsiveWidth(5),
                marginTop: responsiveHeight(25),
              }}>
              Share Collection to...
            </Text>
            <TouchableOpacity
              onPress={() => this.share()}
              style={{
                flexDirection: 'row',
                marginTop: responsiveHeight(2.3),
              }}>
              <Image
                style={{
                  height: responsiveHeight(5),
                  width: responsiveWidth(9),
                  resizeMode: 'contain',
                }}
                source={require('../../Assets/message.png')}
              />
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  fontWeight: 'bold',
                  fontSize: responsiveFontSize(2.4),
                  color: '#fff',
                  marginLeft: responsiveWidth(5),
                  marginTop: responsiveHeight(0.7),
                }}>
                Messages
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => this.copyToClipboard()}
              style={{
                flexDirection: 'row',
                marginTop: responsiveHeight(2.3),
              }}>
              <View
                style={{
                  height: responsiveHeight(4),
                  width: responsiveWidth(10),
                  backgroundColor: '#BEBEBE',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: responsiveHeight(1),
                }}>
                <Image
                  style={{
                    height: responsiveHeight(2.5),
                    width: responsiveWidth(4.5),
                    resizeMode: 'contain',
                  }}
                  source={require('../../Assets/copy.png')}
                />
              </View>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  fontWeight: 'bold',
                  fontSize: responsiveFontSize(2.4),
                  color: '#fff',
                  marginLeft: responsiveWidth(5),
                  marginTop: responsiveHeight(0.3),
                }}>
                Copy Link
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.ExportFile();
              }}
              style={{
                marginLeft: responsiveWidth(6),

                flexDirection: 'row',
                marginTop: responsiveHeight(2.3),
              }}>
              <View
                style={{
                  height: responsiveHeight(4),
                  width: responsiveWidth(10),
                  backgroundColor: '#BEBEBE',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: responsiveHeight(1),
                }}>
                <Image
                  style={{
                    height: responsiveHeight(2.5),
                    width: responsiveWidth(4.5),
                    resizeMode: 'contain',
                  }}
                  source={require('../../Assets/Export.png')}
                />
              </View>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  fontWeight: 'bold',
                  fontSize: responsiveFontSize(2.4),
                  color: '#fff',
                  marginLeft: responsiveWidth(5),
                  marginTop: responsiveHeight(0.3),
                }}>
                Spreadsheet
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                this.setModalVisible(false);
              }}
              style={{
                marginTop: responsiveHeight(3.5),
                height: responsiveHeight(6),
                width: responsiveHeight(6),
                borderRadius: responsiveHeight(6),
                backgroundColor: '#fff',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1,
              }}>
              <Entypo name="cross" size={responsiveFontSize(4)} />
            </TouchableOpacity>
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
    // borderRadius: responsiveWidth(2),
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
    marginTop: responsiveWidth(3),
  },
  collectiontext1: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(1.9),
    fontFamily: 'Lato-Regular',
  },
  privatetext: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Lato-Bold',
    marginRight: responsiveWidth(4),
    marginTop: responsiveWidth(1),
  },
  collectioncontainer: {
    width: responsiveWidth(90),
    alignSelf: 'center',
    backgroundColor: '#fff',
    // height: responsiveHeight(59.5),
    // backgroundColor:'green',
    // marginBottom:responsiveHeight(5),
    borderWidth: responsiveWidth(0.3),
    borderColor: '#B6BBC8',
    borderRadius: responsiveWidth(2),
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
    height: responsiveHeight(23),
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
    height: responsiveHeight(9),
    //marginTop:responsiveWidth(3)
  },
  buttontext: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Lato-Regular',
    color: '#589BE9',
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
    // borderRadius: responsiveWidth(2),
    flexDirection: 'row',
    alignItems: 'center',
    // marginRight: responsiveWidth(5),
    marginLeft: responsiveWidth(1.5),
  },
  icon: {
    marginLeft: responsiveWidth(-2),
    //marginTop:responsiveWidth(2)
  },
  private: {
    fontSize: responsiveFontSize(1.9),
    fontFamily: 'Lato-Bold',
    fontWeight: 'normal',
    color: '#FFF',
  },
  privateContainer: {
    marginLeft: responsiveWidth(2),
    height: responsiveHeight(4),
    width: responsiveWidth(19),

    borderRadius: responsiveHeight(0.5),
  },
  // privatecontainer2: {
  //   height: responsiveHeight(3),
  //   width: responsiveWidth(17),
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: '#362636',
  //   borderRadius: responsiveHeight(0.6),
  //   // marginBottom: responsiveWidth(2),
  //   // marginTop: responsiveWidth(-3),
  //   marginLeft: responsiveWidth(2),
  // },
});
