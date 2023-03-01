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
  ModalButton,
} from 'react-native-modals';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {KeyboardAvoidingView} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Button, Switch, ActivityIndicator} from 'react-native-paper';
import {getData, saveData} from '../Backend/utility';
//import { Switch } from 'react-native-switch';
import * as Animatable from 'react-native-animatable';

export default class EditCollection extends Component {
  state = {
    data: [
      // {
      //     name: 'Yeezy',
      //     fav: true
      // },
      // {
      //     name: 'Air Jordon Reto Lot',
      //     fav: true
      // },
      // {
      //     name: 'Random Jordon Collection',
      //     fav: true
      // },
      // {
      //     name: 'Air Jodon 10',
      //     fav: true
      // },
      // {
      //     name: 'Air Max',
      //     fav: false
      // },
      // {
      //     name: 'Nike',
      //     fav: false
      // },
      // {
      //     name: 'Allen Iversion',
      //     fav: false
      // },
    ],
    isSwitchOn: false,
    OldObj: {
      NoOfSneakers: 0,
    },
    modalVisible: false,
    modalVisibleStart: false,
    EditName: '',
    EditIndex: 0,
    UserInfo: {},
    showAlert:false,
    showAlert2:false,
    isLoading:true,
    numOfSneakers:0,
    userProfilePic:''

  };

  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener(
      'focus',
      async () => {
        this.GetColFn();
      },
    );
  }

  async GetColFn() {
    let id = await AsyncStorage.getItem('Token');
    let UserData = await getData('Users', id);
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
    setTimeout(() => {
      this.setState({showAlert2: false});
      this.setState({ showAlert: false });
    }, 6000);
    // console.log(UserData);
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

      this.setState({data: Collections.Collections});
    }
    this.setState({isLoading:false})
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
    this.setState({modalVisibleStart: visible});
  }
  _onToggleSwitch = () =>
    this.setState((state) => ({isSwitchOn: !state.isSwitchOn}));
  render() {
    const {isSwitchOn} = this.state;
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
          {this.state.showAlert ?
          <Animatable.View animation={'fadeInDownBig'}   style={{ top: responsiveHeight(5.5), elevation: 2, zIndex: 1, position: 'absolute', flexDirection: 'row', width: '95%', borderRadius: 8, borderLeftWidth: 5, borderLeftColor: '#55dd91', height: responsiveHeight(12), backgroundColor: 'white', alignSelf: 'center', justifyContent: 'space-evenly', alignItems: 'center' }}>
            <Image
              style={{
                marginLeft: responsiveWidth(0),
                height: responsiveWidth(13),
                width: responsiveWidth(13),
                marginBottom: 2,
              }}
              source={
                require('../../Assets/CheckSuccessOutline.png')
              }
            />              
            <View style={{ width: responsiveWidth(62) }}>
              <Text style={{ color: 'gray', fontSize: 12, fontFamily: 'Lato-Black' }} ellipsizeMode={'tail'} numberOfLines={1}>
                COLLECTION DELETED SUCCESSFULLY 
                </Text>
              
            </View>
            <TouchableOpacity onPress={() => this.setState({ showAlert: false })}>
              <AntDesign name={'close'} color={'gray'} size={20} />
            </TouchableOpacity>
          </Animatable.View>
          :
          null}
            {/* Custom Alert2 */}
            {this.state.showAlert2 ?
         <Animatable.View animation={'fadeInDownBig'}  style={{ top: responsiveHeight(5.5), elevation: 2, zIndex: 1, position: 'absolute', flexDirection: 'row', width: '95%', borderRadius: 8, borderLeftWidth: 5, borderLeftColor: '#55dd91', height: responsiveHeight(12), backgroundColor: 'white', alignSelf: 'center', justifyContent: 'space-evenly', alignItems: 'center' }}>
            <Image
              style={{
                marginLeft: responsiveWidth(0),
                height: responsiveWidth(13),
                width: responsiveWidth(13),
                marginBottom: 2,
              }}
              source={
                require('../../Assets/CheckSuccessOutline.png')
              }
            />              
            <View style={{ width: responsiveWidth(63) }}>
              <Text style={{ color: 'gray', fontSize: 12, fontFamily: 'Lato-Black' }} ellipsizeMode={'tail'} numberOfLines={1}>
                COLLECTION UPDATED SUCCESSFULLY 
                </Text>
              
            </View>
            <TouchableOpacity onPress={() => this.setState({ showAlert2: false })}>
              <AntDesign name={'close'} color={'gray'} size={20} />
            </TouchableOpacity>
          </Animatable.View>
          :
          null}
          {
            this.state.isLoading?
            <View style={{marginTop:"40%", width:"100%", alignItems:"center"}}>
              <ActivityIndicator size={"large"} color={"black"} />
              </View>
              :
          
        <ScrollView
          style={styles.bottomcontainer}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: responsiveWidth(5),
              justifyContent: 'space-between',
              marginBottom: responsiveHeight(1),
            }}>
            <Text style={styles.favtext}>EDIT COLLECTIONS</Text>

            <TouchableOpacity onPress={()=>this.props.navigation.goBack()}>
            <Text
              style={{
                color: '#D9173B',
                fontSize: responsiveFontSize(1.9),
                fontFamily: 'Lato-Bold',
                marginRight: responsiveWidth(1),
              }}>
              Cancel
            </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.detailcontainer}>
            {this.state.data.length > 0 ? (
              <FlatList
                showsScrollIndicator={false}
                data={this.state.data}
                renderItem={({item, index}) => {
                  return (
                    <View style={[styles.cardview1,
                      {
                        borderBottomWidth:
                        index + 1 == this.state.data.length  ? 0: responsiveWidth(0.3)
                      }
                    ]}>
                      <Image
                        style={styles.icon}
                        source={
                          item.fav
                            ? require('../../Assets/Star.png')
                            : require('../../Assets/StarUnselected.png')
                        }
                      />
                      {/* <AntDesign name={item.fav ? 'star' : 'staro'} size={25} color={item.fav ? '#F5A623' : '#E8E8E8'} style={styles.icon} /> */}
                      <Text numberOfLines={1} style={styles.nametext}>{item.name}</Text>
                      <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
                              EditIndex: index,
                              EditName: item.name,
                              modalVisibleStart: true,
                              isSwitchOn: item.isPrivate,
                              OldObj: item,
                            });
                          }}>
                          <Text
                            style={{
                              color: '#D9173B',
                              fontSize: responsiveFontSize(1.9),
                              fontFamily: 'Lato-Bold',
                              marginRight: responsiveWidth(5),
                            }}>
                            Edit
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({
                              OldObj: item,
                              numOfSneakers:item.SneakerList!== undefined ?  item.SneakerList.length: 0,
                              modalVisible: true,
                              EditIndex: index,
                            });
                          }}>
                          <Text
                            style={{
                              color: '#D9173B',
                              fontSize: responsiveFontSize(1.9),
                              fontFamily: 'Lato-Bold',
                            }}>
                            Delete
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }}
              />
            ) : (
              <View style={{flex:1,height:"100%", alignItems:"center",justifyContent:"center" }}>
              <Text style={[styles.favtext,{color: "gray", marginTop:"25%", fontSize:20,marginBottom:'25%'}]} >No items</Text>
          </View>
            )}

          </View>
        </ScrollView>
  }
        <Modal
          visible={this.state.modalVisibleStart}
          transparent={true}
          overlayBackgroundColor="rgba(0,0,0,1)"
          style={{backgroundColor: 'rgba(0,0,0,0.7)'}}
          onTouchOutside={() => {
            this.setState({modalVisibleStart: false});
          }}>
          <View>
            <ModalContent style={styles.modalview}>
              <Text
                style={[
                  styles.favtext,
                  {
                    fontSize: responsiveFontSize(1.8),
                    alignSelf: 'center',
                    marginTop: responsiveWidth(-2),
                  },
                ]}>
                EDIT COLLECTION NAME
              </Text>
              <TextInput
              paddingLeft={12}
                style={styles.textinput}
                value={this.state.EditName}
                onChangeText={(text) => {
                  this.setState({EditName: text});
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
              <View style={{flexDirection: 'row', height: responsiveHeight(8)}}>
                <TouchableOpacity
                  style={[
                    styles.buttonview2,
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
                  disabled={this.state.EditName === ''?true:false}
                  onPress={async () => {
                    let Obj = this.state.OldObj;
                    Obj.name = this.state.EditName;
                    Obj.isPrivate = this.state.isSwitchOn;
                    let OldList = this.state.data;
                    OldList[this.state.EditIndex] = Obj;
                    let Id = await AsyncStorage.getItem('Token');
                    // let Collections = await getData('Collections', Id);
                    await saveData('Collections', Id, {Collections: OldList});
                    this.setState({showAlert2:true})
                    this.setState({modalVisibleStart: false});
                    this.GetColFn();
                  }}
                  style={styles.buttonview2}>
                  <Text style={styles.buttontext}>Update</Text>
                </TouchableOpacity>
              </View>
            </ModalContent>
          </View>
        </Modal>

        <Modal
          visible={this.state.modalVisible}
          transparent={true}
          overlayBackgroundColor="black"
          style={{backgroundColor: 'rgba(0,0,0,0.7)'}}
          onTouchOutside={() => {
            this.setState({modalVisible: false});
          }}>
          <View>
            <ModalContent style={styles.modalview1}>
              <Text
                style={{
                  alignSelf: 'center',
                  marginTop: responsiveWidth(-2),
                  fontFamily: 'Lato-Bold',
                  fontSize: responsiveFontSize(2),
                }}>
                ARE YOU SURE?
              </Text>
              <View
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: responsiveWidth(4.5),
                  marginTop: responsiveWidth(4),
                  
                }}>
                <Text style={styles.deletetext}>Do you want to delete</Text>
                <Text style={styles.deletetext}>this collection containing</Text>
                <Text style={styles.deletetext}>
                  {this.state.numOfSneakers} sneakers?
                </Text>
              </View>
              <View
                style={{
                  borderTopWidth: responsiveWidth(0.2),
                  borderTopColor: '#B6BBC8',
                  width: responsiveWidth(100),
                  marginLeft: responsiveWidth(-5),
                  top:responsiveWidth(7)

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
                    this.setState({modalVisible: false});
                  }}>
                  <Text style={styles.buttontext2}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.buttonview}
                  onPress={async () => {
                    let OldList = this.state.data;
                    OldList.splice(this.state.EditIndex, 1);
                    let Id = await AsyncStorage.getItem('Token');
                    // let Collections = await getData('Collections', Id);
                    await saveData('Collections', Id, {Collections: OldList});
                    this.setState({showAlert:true})
                    // this.setState({ modalVisibleStart: false })
                    this.GetColFn();

                    this.setState({modalVisible: false});
                  }}>
                  <Text style={styles.buttontext}>Delete</Text>
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
    borderRadius: responsiveWidth(2),
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: "space-around",
    // marginRight: responsiveWidth(5),
    marginLeft: responsiveWidth(1.5),
  },
  icon: {
    height: responsiveWidth(7),
    width: responsiveWidth(7),
    resizeMode: 'contain',
    marginLeft: responsiveWidth(1),
    //marginTop:responsiveWidth(2)
  },
  nametext: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Lato-Regular',
    width:responsiveWidth(45),
    //  backgroundColor: 'red',
    marginLeft: responsiveWidth(4),
  },

  modalview: {
    width: responsiveWidth(78),
    height: responsiveHeight(30),
  },
  modalview1: {
    width: responsiveWidth(78),
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
  buttonview2: {
    width: responsiveWidth(35),
    alignItems: 'center',
    justifyContent: 'center',
    //  backgroundColor:'red',
    height: '100%',
    // top:responsiveWidth(7)
  },
  buttonview: {
    width: responsiveWidth(35),
    alignItems: 'center',
    justifyContent: 'center',
    //  backgroundColor:'red',
    height: '100%',
    top:responsiveWidth(7)
  },
  buttontext: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Lato-Regular',
    color: '#589BE9',
    bottom:4,
    left:2
  },
  buttontext2: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Lato-Regular',
    color: '#589BE9',
    right:8,
    bottom:4
  },
  privatetext: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Lato-Bold',
    marginRight: responsiveWidth(4),
    marginTop: responsiveWidth(1),
  },
  deletetext: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Lato-Regular',
  },
});
