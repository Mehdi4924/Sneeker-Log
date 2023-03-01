import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  // ActivityIndicator,
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
// import Modal from "react-native-modal";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {ActivityIndicator} from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Button, Switch} from 'react-native-paper';
import {saveData, getData} from '../Backend/utility';

export default class Collection extends Component {
  state = {
    totalSneakers: 0,
    data: [],
    isSwitchOn: false,
    modalVisible: false,
    modalVisibleStart: false,
    UserInfo: {},
    CName: '',
    searchQuery: '',
    isLoading: true,
    userProfilePic: '',
  };
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
        this.GetColFn();
      },
    );
  }

  calQuantity(item) {
    var count = 0;
    item.SneakerList.map((item) => {
      count += item.Quantity;
    });
    // console.log('\n\n\n\n\n\n\n\n',count)

    return count;
  }
  async GetColFn() {
    let id = await AsyncStorage.getItem('Token');
    let UserData = await getData('Users', id);
    await AsyncStorage.setItem('User', JSON.stringify(UserData));
    await this.setState({UserInfo: UserData});
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

      this.setState({
        data: Collections.Collections,
        data2: Collections.Collections,
        isLoading: false,
      });
    } else {
      this.setState({data: [], isLoading: false});
    }
    // console.log('\n\n\n\n\n\n\n\n',this.state.data)
    let arr = this.state.data;
    var count = 0;
    arr.map((item) => {
      if (item.SneakerList) {
        item.SneakerList.map((item) => {
          count += item.Quantity;
          // console.log('\n\n\n\n\n\n\n\n',item)
        });
      }
    });
    this.setState({totalSneakers: count});
    // alert(this.state.totalSneakers)
  }
  _onChangeSearch = (query) => this.setState({searchQuery: query});
  async FilterFn(text) {
    if (text !== '') {
      let newData = this.state.data.filter(function (item) {
        //applying filter for the inserted text in search bar
        let itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        let textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      this.setState({data: newData});
    } else {
      this.setState({data: this.state.data2});
    }
    let flag = false;
  }
  render() {
    const {isSwitchOn} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent></StatusBar>
        {!this.state.isLoading ? (
          <ScrollView
            style={styles.bottomcontainer}
            showsVerticalScrollIndicator={false}>
            {this.state.data.length > 0 ? (
              <View style={styles.collectionmainView}>
                <View>
                  <Text style={styles.favtext}>COLLECTIONS</Text>
                  <Text style={styles.sneakertotalText}>
                    Sneaker Total ({this.state.totalSneakers})
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    style={{marginRight: responsiveWidth(4)}}
                    onPress={() => {
                      this.props.navigation.navigate('EditCollection');
                    }}>
                    <Image
                      style={styles.editImageStyle}
                      source={require('../../Assets/Edit.png')}
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{marginRight: responsiveWidth(1)}}
                    onPress={() => {
                      this.setState({modalVisibleStart: true});
                    }}>
                    <Image
                      style={styles.editImageStyle}
                      source={require('../../Assets/Add.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}
            {/* {console.log('ye aaya dat',this.state.data)} */}
            {this.state.data.length > 0 ? (
              <View style={styles.detailcontainer}>
                <FlatList
                  showsScrollIndicator={false}
                  data={this.state.data}
                  renderItem={({item, index}) => {
                    // {console.log('fjfjfjfjfjfjfj---->',index)}
                    return (
                      <View
                        style={[
                          styles.cardview1,
                          {
                            borderBottomWidth:
                              index + 1 == this.state.data.length
                                ? 0
                                : responsiveWidth(0.3),
                          },
                        ]}>
                        <TouchableOpacity
                          onPress={async () => {
                            let List = this.state.data;
                            List[index].fav = !List[index].fav;
                            // console.log(List[index])
                            let Id = await AsyncStorage.getItem('Token');
                            await saveData('Collections', Id, {
                              Collections: List,
                            });
                            this.GetColFn();
                          }}
                          style={{
                            width: '15%',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <Image
                            style={styles.icon}
                            source={
                              item.fav
                                ? require('../../Assets/Star.png')
                                : require('../../Assets/StarUnselected.png')
                            }
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            if (
                              item.SneakerList !== undefined &&
                              item.SneakerList.length > 0
                            ) {
                              // console.log("Send index",index)
                              this.props.navigation.navigate('DetailsHome', {
                                Collections: this.state.data,
                                CurrentCol: index,
                                collectionname: item.name,
                              });
                            } else {
                              this.props.navigation.navigate(
                                'AddNewCollection',
                                {
                                  Collections: this.state.data,
                                  CurrentCol: index,
                                },
                              );
                            }
                          }}
                          style={{width: '72.5%'}}>
                          {item.isPrivate ? (
                            <View style={{marginLeft: responsiveWidth(2)}}>
                              <View
                                style={styles.itemMainView}>
                                <Text
                                  numberOfLines={1}
                                  style={styles.itemnameTextStyles}>
                                  {item.name}
                                </Text>
                              </View>
                              <View
                                style={styles.ItemsecondView}>
                                <Text
                                  style={styles.sneakerlistText}>
                                  {item.SneakerList !== undefined
                                    ? `${this.calQuantity(item)}`
                                    : '0' + ' '}
                                  {' Sneakers in Collection'}
                                </Text>
                                <View style={styles.privatecontainer2}>
                                  <Image
                                    source={require('../../Assets/pvt.png')}
                                    style={styles.pvtImageStyle}
                                  />
                                </View>
                              </View>
                            </View>
                          ) : (
                            <View style={{marginLeft: responsiveWidth(2)}}>
                              <View
                               style={styles.itemMainView}>
                                <Text
                                  numberOfLines={1}
                                  style={styles.itemnameTextStyles}>
                                  {item.name}
                                </Text>
                              </View>
                              <View
                              style={styles.ItemsecondView}>
                                <Text
                                style={styles.sneakerlistText}>
                                  {item.SneakerList !== undefined
                                    ? `${this.calQuantity(item)}`
                                    : '0' + ' '}
                                  {' Sneakers in Collection'}
                                </Text>
                              </View>
                            </View>
                          )}
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => {
                            if (
                              item.SneakerList !== undefined &&
                              item.SneakerList.length > 0
                            ) {
                              // console.log("Send index",index)
                              this.props.navigation.navigate('DetailsHome', {
                                Collections: this.state.data,
                                CurrentCol: index,
                              });
                            } else {
                              this.props.navigation.navigate(
                                'AddNewCollection',
                                {
                                  Collections: this.state.data,
                                  CollectionIndex: index,
                                },
                              );
                            }
                          }}
                          style={{width: '12.5%'}}>
                          <Entypo
                            name={'chevron-right'}
                            size={responsiveFontSize(3)}
                            style={{left: responsiveWidth(1.4)}}
                            color={'#949494'}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  }}
                />
              </View>
            ) : (
              <View>
                <View
                  style={styles.collectiontextView}>
                  <Text style={styles.collectiontext}>
                    YOU DON'T HAVE ANY COLLECTIONS.
                  </Text>
                  <Text
                    style={[
                      styles.nametext6,
                      {textAlign: 'center', bottom: 5},
                    ]}>
                    Let's do something about that!
                  </Text>
                </View>
                <View
                  style={[
                    styles.detailcontainer,
                    {
                      paddingVertical: responsiveHeight(7),
                      marginTop: responsiveHeight(5.5),
                    },
                  ]}>
                  <TouchableOpacity
                    style={{justifyContent: 'center', alignItems: 'center'}}
                    onPress={() => {
                      this.setState({modalVisibleStart: true});
                    }}>
                    <View>
                      <AntDesign
                        name={'pluscircleo'}
                        size={25}
                        color={'#D9173B'}
                      />
                    </View>
                    <Text
                      style={{
                        fontFamily: 'Lato-Bold',
                        fontSize: responsiveFontSize(2.1),
                        color: '#D9173B',
                        marginTop: responsiveHeight(0.5),
                      }}>
                      ADD A COLLECTION
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <View style={{height: responsiveWidth(0)}}></View>
          </ScrollView>
        ) : (
          <View style={{alignItems: 'center', width: '100%', marginTop: '40%'}}>
            <ActivityIndicator color={'black'} size={'large'} />
          </View>
        )}
        <View>
          <Modal
            visible={this.state.modalVisibleStart}
            transparent={true}
            overlayBackgroundColor="black"
            style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.7)',
              height: responsiveHeight(100),
              width: responsiveWidth(100),
            }}
            onTouchOutside={() => {
              this.setState({modalVisibleStart: false});
            }}>
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
                    {alignSelf: 'center', marginTop: responsiveWidth(-2)},
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
                    width: responsiveWidth(100),
                    marginLeft: responsiveWidth(-5),
                    marginTop: responsiveHeight(1),
                  }}></View>
                <View
                  style={{flexDirection: 'row', height: responsiveHeight(8)}}>
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
                      let List = this.state.data;
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
                      // console.log(Id);
                      let Collection = await getData('Collections', Id);
                      // console.log(Collection);
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
                      this.setState({CName: '', isSwitchOn: true});
                      this.setState({modalVisibleStart: false});
                      this.GetColFn();
                    }}>
                    <Text style={styles.buttontext}>Create</Text>
                  </TouchableOpacity>
                </View>
              </ModalContent>
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
  favtext: {
    fontFamily: 'Lato-Bold',
    fontWeight: 'bold',
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
    // width: responsiveWidth(89),
    // backgroundColor: '#fff',
    // alignSelf: 'center',
    // borderWidth: responsiveWidth(0.3),
    // borderColor: '#B6BBC8',
    // borderRadius: responsiveWidth(2),
    marginVertical: responsiveWidth(3),
    width: responsiveWidth(90),
    // marginBottom: responsiveHeight(3),
    alignSelf: 'center',
    backgroundColor: '#fff',
    // height: responsiveHeight(59.5),
    // backgroundColor:'green',
    // marginBottom:responsiveHeight(5),
    borderWidth: responsiveWidth(0.3),
    borderColor: '#B6BBC8',
    borderRadius: responsiveWidth(2),
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
    // justifyContent: 'space-between',
    // marginRight: responsiveWidth(5),
    marginLeft: responsiveWidth(1.5),
  },
  icon: {
    height: responsiveWidth(7),
    width: responsiveWidth(7),
    resizeMode: 'contain',
    marginLeft: responsiveWidth(-2),
    //marginTop:responsiveWidth(2)
  },
  nametext: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Lato-Bold',
    width: responsiveWidth(57),
    //  backgroundColor: 'red',
    marginLeft: responsiveWidth(-7),
  },
  nametext54: {
    fontSize: responsiveFontSize(1.5),
    fontFamily: 'Lato-Regular',
    width: responsiveWidth(57),
    color: '#999999',
    marginLeft: responsiveWidth(-7),
  },
  nametext6: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Lato-Regular',
    marginTop: responsiveWidth(1),
  },

  modalview: {
    width: responsiveWidth(78),
    height: responsiveHeight(30.3),
    backgroundColor: '#fff',
    alignSelf: 'center',
    borderRadius: 10,
    elevation: 5,
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
  privatecontainer: {
    height: responsiveHeight(3),
    width: responsiveWidth(17),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#362636',
    borderRadius: responsiveHeight(0.6),
    // marginBottom: responsiveWidth(2),
    marginLeft: responsiveWidth(2),
    bottom: responsiveHeight(0.3),
  },
  collectiontext: {
    alignSelf: 'center',
    fontSize: responsiveFontSize(2.5),
    fontFamily: 'Lato-Black',
    marginTop: responsiveWidth(7),
    marginHorizontal: 60,
    textAlign: 'center',
  },
  // +++++++++>>>>>>>>>>>>new style
  collectionmainView: {
    flexDirection: 'row',
    marginTop: responsiveWidth(5),
    justifyContent: 'space-between',
    marginBottom: responsiveHeight(1),
    alignItems: 'center',
  },
  sneakertotalText: {
    color: 'gray',
    fontFamily: 'Lato-Regular',
    fontSize: responsiveFontSize(1.6),
    top: responsiveHeight(0.35),
  },
  editImageStyle:{
    height: responsiveWidth(6),
    resizeMode: 'contain',
    width: responsiveWidth(7),
  },
  itemMainView:{
    flexDirection: 'row',
    height: responsiveHeight(3.5),
    alignItems: 'center',
    width: responsiveWidth(45),
  },
  itemnameTextStyles:{
    fontFamily: 'Lato-Bold',
    color: 'black',
    fontSize: responsiveFontSize(1.75),
    top: responsiveHeight(0.05),
  },
  ItemsecondView:{
    flexDirection: 'row',
    height: responsiveHeight(3.2),
    alignItems: 'center',
    bottom: responsiveHeight(0.4),
  },
  pvtImageStyle:{
    height: 20,
    width: 20,
    resizeMode: 'contain',
    marginLeft: 5,
    top: 1,
  },
  sneakerlistText:{
    fontSize: responsiveFontSize(1.5),
    color: 'gray',
    fontFamily: 'Lato-Regular',
  },
  collectiontextView:{
    marginVertical: responsiveWidth(3),
    marginTop: responsiveHeight(6),
  },
});
