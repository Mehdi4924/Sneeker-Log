import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  StatusBar,
  FlatList,
  AsyncStorage,
} from 'react-native';
import Modal, {
  ModalContent,
  ModalTitle,
  ModalButton,
} from 'react-native-modals';
import {Button, Switch} from 'react-native-paper';
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
  getAllOfCollection,
  connectFirebase,
  getDataOnChange,
  getData,
  saveData,
} from '../Backend/utility';
import moment from 'moment';
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
export default class NewUserFlowMain extends Component {
  state = {
    flag1: true,
    flag2: false,
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
    Collections: [
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

    isSwitchOn: true,
    modalVisible: false,
    modalVisibleStart: false,UserInfo: {},
    userProfilePic:''

  };
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
    this.setState({modalVisibleStart: visible});
  }

  async componentDidMount() {
    // await connectFirebase();
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
    await this.setState({UserInfo: UserData});
    this.getNews();
    let Id = await AsyncStorage.getItem('Token');
    let Collections = await getData('Collections', Id);
    // this.setState({Collections: Collections});
    getDataOnChange('SneakersReleaseDates', this.setSneakersReleaseDates);
    getDataOnChange('Events', this.setEvents);
  }

  setSneakersReleaseDates = (data) => {
    console.log('Checking data', data);
    if (data.length > 10) {
      let ShortList = [];
      for (let i = 0; i < 10; i++) {
        ShortList.push(data[i]);
      }
      this.setState({Releasedata: ShortList});
    } else {
      this.setState({Releasedata: data});
    }
    // this.setState({Releasedata: data});
  };

  setEvents = (data) => {
    console.log('Checking data', data);
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

  async getNews() {
    let CallBack2 = await fetch(
      'https://newsapi.org/v2/top-headlines?country=us&apiKey=b7c6d9fd85cb4414a74245de95932f2c',
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
        console.log('News : ', response);

        if (response.articles.length > 10) {
          let ShortList = [];
          for (let i = 0; i < 10; i++) {
            ShortList.push(response.articles[i]);
          }
          this.setState({
            newsdata: ShortList,
            newsdataFullList: response.articles,
          });
        } else {
          this.setState({
            newsdata: response.articles,
            newsdataFullList: response.articles,
          });
        }
        // if (response.msg === "Items found.") {

        //     let TempArray = [];
        //     response.objects.forEach(async (element) => {
        //         if (element.favourite !== undefined && element.favourite) {
        //             TempArray.push(element);
        //         }

        //     });

        // }
      });
  }

  _onToggleSwitch = () =>
    this.setState((state) => ({isSwitchOn: !state.isSwitchOn}));
  render() {
    const {isSwitchOn} = this.state;
    const {flag1, flag2} = this.state;

    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent></StatusBar>
        <View style={styles.header}>
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
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.outercontainer}>
            <Text style={styles.favtext}>MY FAVORITE COLLECTIONS</Text>
          </View>
          <View></View>
          <View style={styles.collectioncontainer}>
            <TouchableOpacity
              onPress={() => {
                this.setState({modalVisibleStart: true});
              }}>
              <AntDesign name={'pluscircleo'} size={25} color={'#D9173B'} />
            </TouchableOpacity>
            <Text style={styles.collectiontext}>ADD A COLLECTION</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              marginTop: responsiveWidth(5),
              justifyContent: 'space-between',
              width: responsiveWidth(90),
              alignSelf: 'center',
            }}>
            <Text style={styles.favtext}>RELEASE DATES</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Products')}>
              <Text style={styles.viewtext}>View All</Text>
            </TouchableOpacity>
          </View>
          <View>
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={this.state.Releasedata}
              keyExtractor={(item) => item.name}
              renderItem={({item}) => {
                const releaseDate = new Date(item.releaseDate.toDate());
                // console.log('Choga Collection', releaseDate.getMonth());
                return (
                  <View style={{marginLeft: responsiveWidth(2.5)}}>
                    <View
                      style={[
                        styles.cardview2,
                        {
                          marginRight:
                            item.key === this.state.data1.length
                              ? responsiveWidth(5)
                              : 0,
                        },
                      ]}>
                      <View style={{flexDirection: 'row'}}>
                        <View style={{alignItems: 'center'}}>
                          <Text style={styles.datetext}>
                            {monthNames[releaseDate.getMonth()]}
                          </Text>
                          <Text style={[styles.datetext, {color: '#D9173B'}]}>
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
                          paddingVertical: 8,
                        }}>
                        <Text
                          style={[
                            styles.text,
                            {
                              marginTop: 2.5,
                              fontSize: responsiveFontSize(1.3),
                              fontWeight: 'bold',
                              marginHorizontal: 2.5,
                              textAlign: 'center',
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
              width: responsiveWidth(35),
              marginLeft: responsiveWidth(5),
              flexDirection: 'row',
              marginTop: responsiveWidth(5),
              justifyContent: 'space-between',
            }}>
            <View>
              <TouchableOpacity
                style={styles.bar1}
                onPress={() => {
                  let {flag1, flag2} = this.state;
                  (flag1 = true),
                    (flag2 = false),
                    this.setState({flag1, flag2});
                }}>
                <Text style={styles.favtext}>NEWS</Text>
              </TouchableOpacity>
              {flag1 ? <View style={styles.barbottom1}></View> : null}
            </View>
            <View>
              <TouchableOpacity
                style={styles.bar}
                onPress={() => {
                  let {flag1, flag2} = this.state;
                  (flag1 = false),
                    (flag2 = true),
                    this.setState({flag1, flag2});
                }}>
                <Text style={styles.favtext}>EVENTS</Text>
              </TouchableOpacity>
              {flag2 ? <View style={styles.barbottom}></View> : null}
            </View>
          </View>
          {flag2 ? (
            <View style={{marginBottom: responsiveWidth(5)}}>
              <FlatList
                showsScrollIndicator="false"
                data={this.state.Events}
                renderItem={({item}) => {
                  return (
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate('EventDetail', {
                          EventData: item,
                        })
                      }>
                      <Image
                        source={{uri: item.image}}
                        style={styles.eventimage}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('Events')}>
                <Text
                  style={[
                    styles.viewtext,
                    {alignSelf: 'center', marginTop: responsiveWidth(5)},
                  ]}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}
          {flag1 ? (
            <View style={{marginBottom: responsiveWidth(5)}}>
              <FlatList
                showsScrollIndicator="false"
                data={this.state.newsdata}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      style={styles.newscontainer}
                      onPress={() =>
                        this.props.navigation.navigate('NewsDetail', {
                          NewsData: item,
                          index: index,
                          newsdataFullList: this.state.newsdataFullList,
                        })
                      }>
                      <Image
                        source={{uri: item.urlToImage}}
                        style={styles.newsimage}
                      />
                      <View>
                        <Text numberOfLines={2} style={styles.newstext}>
                          {item.title}
                        </Text>
                        <Text style={styles.timetext}>
                          {`${item.source && item.source.name}  ${moment(
                            item.publishedAt,
                          ).fromNow()}`}
                        </Text>
                      </View>
                      <MaterialIcons
                        name={'keyboard-arrow-right'}
                        size={responsiveWidth(10)}
                        color={'#949494'}
                        style={{
                          alignSelf: 'center',
                          marginLeft: responsiveWidth(-1),
                        }}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('News')}>
                <Text
                  style={[
                    styles.viewtext,
                    {alignSelf: 'center', marginTop: responsiveWidth(5)},
                  ]}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
          ) : null}

          <View style={{height: 20}}></View>
        </ScrollView>
        <Modal
          visible={this.state.modalVisibleStart}
          transparent={true}
          style={{backgroundColor: 'rgba(0,0,0,.7)'}}
          onTouchOutside={() => {
            this.setState({modalVisibleStart: false});
          }}>
          <View>
            <ModalContent style={styles.modalview}>
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
                  this.setState({CName: text});
                }}
              />
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
                    
                    this.props.navigation.navigate('AddNewCollection',{Collection: {
                      name: this.state.CName,
                      isPrivate: isSwitchOn,
                      NoOfSneakers: 0,
                      fav: false,
                    }});
                    this.setState({CName: '',isSwitchOn:true});
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
    marginLeft: responsiveWidth(22),
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
  outercontainer: {
    marginTop: responsiveWidth(5),
    marginHorizontal: responsiveWidth(5),
  },
  collectioncontainer: {
    width: responsiveWidth(90),
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
  collectiontext: {
    fontFamily: 'Lato-Bold',
    fontSize: responsiveFontSize(1.8),
    color: '#D9173B',
    marginTop: responsiveWidth(1),
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
  cardview2: {
    height: responsiveHeight(15),
    width: responsiveWidth(40),
    backgroundColor: '#fff',
    borderWidth: responsiveWidth(0.2),
    borderColor: '#B6BBC8',
    borderRadius: responsiveWidth(2),
    marginTop: responsiveWidth(3),
    // flexDirection: 'row',
    marginHorizontal: responsiveWidth(2.5),
  },
  datetext: {
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
    fontSize: responsiveFontSize(1.2),
    fontFamily: 'Lato-Regular',
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
  privatetext: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Lato-Bold',
    marginRight: responsiveWidth(4),
    marginTop: responsiveWidth(1),
  },

  eventimage: {
    height: responsiveHeight(20),
    width: responsiveWidth(90),
    borderRadius: responsiveHeight(2),
    marginTop: responsiveWidth(3),
    alignSelf: 'center',
  },
  modalview: {
    width: responsiveWidth(78),
    height: responsiveHeight(30),
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
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Lato-Regular',
    color: '#589BE9',
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
    width: responsiveWidth(14),
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
    fontSize: responsiveFontSize(1.8),
    marginHorizontal: responsiveWidth(5),
    color: '#878787',
  },
});
