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
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import {KeyboardAvoidingView} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Button, Switch} from 'react-native-paper';
import {Searchbar} from 'react-native-paper';
import { getData } from '../Backend/utility';
export default class ResultItems extends Component {
  state = {
    isSwitchOn: true,
    overlay: false,
    searchQuery: '',
    // this.props.route.params.
    // sourcedata: this.props.navigation.getParam('Collections'),
    // CurrentCol: this.props.navigation.getParam('CurrentCol'),
    // data:[this.props.navigation.getParam('item')],
    sourcedata: this.props.route.params.Collections,
    CurrentCol: this.props.route.params.CurrentCol,
    data:[this.props.route.params.item],
    add: false,
    modalVisibleStart: true,UserInfo: {},
    modalVisible: false,
    userProfilePic:''

  };
  toggleModal = () => {
    this.setState({modalVisible: !this.state.modalVisible});
  };
  _onChangeSearch = (query) => this.setState({searchQuery: query});
  _onToggleSwitch = () =>
    this.setState((state) => ({isSwitchOn: !state.isSwitchOn}));

  async componentDidMount() {
    console.log(this.state.data[0])
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
    // if (
    //   this.state.sourcedata[this.state.CurrentCol].SneakerList !== undefined
    // ) {
    //   console.log(
    //     this.state.sourcedata[this.state.CurrentCol].SneakerList[0].media
    //       .thumbUrl,
    //   );
    //   this.setState({
    //     isdataLoad: true,
    //     data: this.state.sourcedata[this.state.CurrentCol].SneakerList,
    //   });
    // }
  }
  calQuantity (item){
    var count = 0;
    item.SneakerList.map((item) => {
      count += item.Quantity; 
      })
      console.log('\n\n\n\n\n\n\n\n',count)

      return count;
  }
  render() {
    const {isSwitchOn} = this.state;
    const {params} = this.props.navigation.state;
    return (
      <View style={styles.container}>
        {this.state.overlay && this.state.modalVisibleStart ? (
          <View style={{flex: 1, zIndex: 1}}>
            <StatusBar
              backgroundColor="transparent"
              barStyle="light-content"
              translucent></StatusBar>
            <View
              style={{
                height: responsiveHeight(100),
                backgroundColor: 'rgba(0,0,0,0.8)',
                zIndex: 0,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {this.state.modalVisibleStart && this.state.overlay ? (
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
                        Are you Sure?
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Lato-Bold',
                          fontWeight: 'normal',
                          fontSize: responsiveFontSize(2),
                          alignSelf: 'center',
                          marginTop: responsiveHeight(4),
                        }}>
                        Do you want to delete
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Lato-Bold',
                          fontWeight: 'normal',
                          fontSize: responsiveFontSize(2),
                          alignSelf: 'center',
                        }}>
                        the Air Jordan 1?
                      </Text>
                      <View
                        style={{
                          marginTop: responsiveHeight(4),
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
                          }}>
                          <Text style={styles.buttontext}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.buttonview}
                          onPress={() => {
                            // this.props.navigation.navigate('AddNewCollection');
                            this.setState({modalVisibleStart: false});
                          }}>
                          <Text style={styles.buttontext}>Delete</Text>
                        </TouchableOpacity>
                      </View>
                    </ModalContent>
                  </View>
                </Modal>
              ) : (
                <Modal
                  visible={this.state.modalVisibleStart}
                  transparent={true}
                  overlayBackgroundColor="rgba(0,0,0,1)"
                  onTouchOutside={() => {
                    this.setState({modalVisibleStart: false});
                  }}>
                  <View>
                    <ModalContent style={styles.modalview1}>
                      <Text
                        style={{
                          fontFamily: 'Lato-Bold',
                          fontWeight: 'normal',
                          fontSize: responsiveFontSize(2),
                          alignSelf: 'center',
                        }}>
                        EDIT NIKE AIR JORDAN 1
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Lato-Bold',
                          fontWeight: 'normal',
                          fontSize: responsiveFontSize(2),
                          //   alignSelf: 'center',
                          marginTop: responsiveHeight(2),
                        }}>
                        SNEAKER
                      </Text>
                      <Text
                        style={{
                          fontFamily: 'Lato-Medium',
                          fontWeight: 'normal',
                          fontSize: responsiveFontSize(2),
                          alignSelf: 'center',
                        }}>
                        the Air Jordan 1?
                      </Text>
                      <View
                        style={{
                          marginTop: responsiveHeight(4),
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
                          }}>
                          <Text style={styles.buttontext}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.buttonview}
                          onPress={() => {
                            // this.props.navigation.navigate('AddNewCollection');
                            this.setState({modalVisibleStart: false});
                          }}>
                          <Text style={styles.buttontext}>Update</Text>
                        </TouchableOpacity>
                      </View>
                    </ModalContent>
                  </View>
                </Modal>
              )}
            </View>
          </View>
        ) : null}
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent></StatusBar>
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
                My Collection
              </Text>
            </View>
            <FlatList
              showsScrollIndicator={false}
              data={this.state.sourcedata}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      // if (item.name == 'Random Jordon Collection') {
                        this.toggleModal();
                      // }
                    }}
                    style={styles.cardview1}>
                    <AntDesign
                      name={item.fav ? 'star' : 'staro'}
                      size={25}
                      color={item.fav ? '#F5A623' : '#E8E8E8'}
                      style={{marginLeft: responsiveWidth(0.2)}}
                    />
                    <View
                      style={{
                        width: responsiveWidth(72),
                        // alignItems: 'flex-start',
                        // justifyContent: 'center',
                        // marginLeft: responsiveWidth(3),
                      }}>
                      {item.isPrivate ? (
                          <View style={{marginLeft:responsiveWidth(4)}}> 
                          <View style={{flexDirection: 'row',height:responsiveHeight(3.5),alignItems: 'center',width:responsiveWidth(45) }}>
                          <Text
                          numberOfLines={1}
                            style={[
                             
                              {fontFamily: 'Lato-Bold', color: 'black',fontSize:responsiveFontSize(1.75),top:responsiveHeight(0.05) },
                            ]}>
                            {item.name}
                          </Text>


                       
                          </View>
                          <View style={{flexDirection: 'row',height:responsiveHeight(3),alignItems: 'center',bottom:responsiveHeight(0.4)  }}>
                          <Text style={{fontSize: responsiveFontSize(1.5),color:'gray',fontFamily: 'Lato-Regular'}}>
                                  {item.SneakerList !== undefined
                                    ? `${this.calQuantity(item)}`
                                    : '0' + ' '}
                                  {' Sneakers in Collection'}
                          </Text>
                          <View style={styles.privatecontainer2}>
                                   <Image source={require('../../Assets/pvt.png')} style={{ height: 20, width: 20, resizeMode: 'contain', marginLeft: 5,top:1 }} />
                          </View>

                          </View>
                        

                        </View>
                       ) : (
                         <View style={{marginLeft:responsiveWidth(4)}}> 
                         <View style={{flexDirection: 'row',height:responsiveHeight(3.5),alignItems: 'center',width:responsiveWidth(45) }}>
                         <Text
                         numberOfLines={1}
                           style={[
                            
                             {fontFamily: 'Lato-Bold', color: 'black',fontSize:responsiveFontSize(1.75),top:responsiveHeight(0.05) },
                           ]}>
                           {item.name}
                         </Text>


                      
                         </View>
                         <View style={{flexDirection: 'row',height:responsiveHeight(3),alignItems: 'center',bottom:responsiveHeight(0.4)  }}>
                         <Text style={{fontSize: responsiveFontSize(1.5),color:'gray',fontFamily: 'Lato-Regular'}}>
                                 {item.SneakerList !== undefined
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
                     style={{left:responsiveWidth(1)}}
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
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.collectionview}>
            <AntDesign name={'star'} size={25} color={'#F5A623'} />
  <Text style={styles.nametext}>{this.state.sourcedata[this.state.CurrentCol].name}</Text>
            <TouchableOpacity>
              {/* <Ionicons
                onPress={() => this.toggleModal()}
                name={'ios-arrow-down'}
                size={25}
                color={'#949494'}
                style={styles.icon}
              /> */}
            </TouchableOpacity>
          </View>
          <View
            style={{
              borderBottomWidth: responsiveWidth(0.11),
              borderBottomColor: '#B6BBC8',
              width: responsiveWidth(100),
            }}></View>
          {/* {this.state.add ? (
            <View
              style={{
                flexDirection: 'row',
                marginVertical: responsiveWidth(5),
                marginLeft: responsiveWidth(5),
              }}>
              <Searchbar
                onChangeText={this._onChangeSearch}
                value={this.state.searchQuery}
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
                  height: responsiveHeight(4),
                  width: responsiveWidth(70),
                }}
              />
              <Text
                style={{
                  alignSelf: 'center',
                  marginLeft: responsiveWidth(7.5),
                  fontFamily: 'Lato-Bold',
                  fontWeight: 'bold',
                  fontSize: responsiveFontSize(2),
                  color: '#D9173B',
                }}
                onPress={() => this.setState({add: false})}>
                Cancel
              </Text>
            </View>
          ) : (
            <View
              style={{
                flexDirection: 'row',
                marginVertical: responsiveWidth(5),
                marginLeft: responsiveWidth(5),
              }}>
              <Text style={styles.privatetext}>PRIVATE</Text>
              <View
                style={{
                  height: responsiveHeight(4),
                  width: responsiveWidth(16),
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#08CF6E',
                  borderRadius: responsiveHeight(2),
                }}>
                <Switch
                  style={styles.switch}
                  value={isSwitchOn}
                  onValueChange={this._onToggleSwitch}
                  color={'#FFF'}
                  trackColor={{true: '#08CF6E'}}
                  theme={{
                    colors: {},
                  }}
                />
              </View>
              <View style={{width: responsiveWidth(40)}} />
              <TouchableOpacity onPress={() => this.setState({overlay: true})}>
                {this.state.modalVisible ? (
                  <View
                    style={{
                      height: responsiveHeight(3),
                      width: responsiveWidth(5),
                      marginTop: responsiveHeight(0.2),
                    }}
                  />
                ) : (
                  <Image
                    source={require('../../Assets/Upload.png')}
                    style={{
                      height: responsiveHeight(3),
                      width: responsiveWidth(5),
                      resizeMode: 'contain',
                      marginTop: responsiveHeight(0.2),
                    }}
                  />
                )}
              </TouchableOpacity>
              <Feather
                onPress={() => this.setState({add: true})}
                style={{
                  marginLeft: responsiveWidth(6.3),
                  marginTop: responsiveHeight(0.3),
                }}
                name="plus-circle"
                color="#D9173B"
                size={responsiveFontSize(3.5)}
              />
            </View>
          )} */}
          <FlatList
            data={this.state.data}
            horizontal={true}
            keyExtractor={(item) => item.item.title}
            renderItem={(item) => {
              console.log("Item",item)
              //this.forceUpdate()
              return (
                <View style={styles.collectioncontainer}>
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
                        marginHorizontal: responsiveWidth(5),
                        width: this.state.add
                          ? responsiveWidth(42)
                          : responsiveWidth(52),
                      }}>
                      <Text
                        style={{
                          color: '#6C6C6C',
                          fontFamily: 'Lato-Bold',
                          fontSize: responsiveFontSize(1.7),
                          fontWeight: 'normal',
                        }}>
                        SNEAKER
                      </Text>
                      <Text
                        style={{
                          color: '#121212',
                          fontFamily: 'Lato-Bold',
                          fontSize: responsiveFontSize(1.6),
                          fontWeight: 'normal',
                        }}>
                        {item.item.brand} {item.item.title}{' '}
                      </Text>
                    </View>
                    {this.state.add ? (
                      <Text
                        style={{
                          color: '#D9173B',
                          fontFamily: 'Lato-Bold',
                          fontSize: responsiveFontSize(2.4),
                          fontWeight: 'normal',
                        }}>
                        REMOVE
                      </Text>
                    ) : (
                      <Feather
                        onPress={() => this.setState({add: true})}
                        style={{
                          marginLeft: responsiveWidth(6.3),
                          marginTop: responsiveHeight(0.3),
                        }}
                        name="plus-circle"
                        color="#D9173B"
                        size={responsiveFontSize(3.5)}
                      />
                    )}
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
                        marginHorizontal: responsiveWidth(4),
                        marginVertical: responsiveHeight(1.5),
                      }}>
                      {/* <Image
                        style={{
                          height: responsiveHeight(4),
                          width: responsiveWidth(8),
                          resizeMode: 'contain',
                        }}
                        source={require('../../Assets/barcode.png')}
                      /> */}
                    </View>
                    <View
                      style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      {/* <Image
                        style={{
                          height: responsiveHeight(25),
                          width: responsiveWidth(38),
                          resizeMode: 'contain',
                        }}
                        source={item.item.media.imageUrl!== ""? {uri: item.item.media.imageUrl}:require('../../Assets/products/product2.png') }
                      /> */}
                    </View>
                  </View>
                  <View
                    style={{
                      marginHorizontal: responsiveWidth(5),
                      marginVertical: responsiveHeight(3),
                    }}>
                    <Text
                      style={{
                        color: '#6C6C6C',
                        fontFamily: 'Lato-Bold',
                        fontSize: responsiveFontSize(1.7),
                        fontWeight: 'normal',
                      }}>
                      COLORWAY
                    </Text>
                    <Text
                      style={{
                        color: '#121212',
                        fontFamily: 'Lato-Bold',
                        fontSize: responsiveFontSize(2.3),
                        fontWeight: 'normal',
                      }}>
                      {item.item.colorway}
                    </Text>
                    <View style={{marginVertical: responsiveHeight(2)}}>
                      <View
                        style={{
                          flexDirection: 'row',
                        }}>
                        <View>
                          <Text
                            style={{
                              color: '#6C6C6C',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.3),
                              fontWeight: 'normal',
                            }}>
                            MARKET
                          </Text>
                          <View style={{flexDirection: 'row'}}>
                            {!item.item.instock ? (
                              <AntDesign
                                style={{marginRight: responsiveWidth(1.5)}}
                                name="minuscircle"
                                size={responsiveFontSize(2)}
                                color="#F5A623"
                              />
                            ) : item.item.limited ? (
                              <AntDesign
                                style={{marginRight: responsiveWidth(1.5)}}
                                name="downcircle"
                                size={responsiveFontSize(2)}
                                color="#D0021B"
                              />
                            ) : (
                              <AntDesign
                                style={{marginRight: responsiveWidth(1.5)}}
                                name="upcircle"
                                size={responsiveFontSize(2)}
                                color="#7AD693"
                              />
                            )}
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
                        </View>
                        <View style={{marginLeft: responsiveWidth(6)}}>
                          <Text
                            style={{
                              color: '#6C6C6C',
                              fontFamily: 'Lato-Bold',
                              fontSize: responsiveFontSize(1.3),
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
                            {item.item.year}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Text
                      style={{
                        color: '#6C6C6C',
                        fontFamily: 'Lato-Bold',
                        fontSize: responsiveFontSize(2),
                        fontWeight: 'normal',
                      }}>
                      SKU
                    </Text>
                    <Text
                      style={{
                        color: '#121212',
                        fontFamily: 'Lato-Bold',
                        fontSize: responsiveFontSize(2),
                        fontWeight: 'normal',
                      }}>
                      {item.item.styleId}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
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
    marginRight: responsiveWidth(2),
    marginTop: responsiveWidth(1),
  },
  collectioncontainer: {
    width: responsiveWidth(80),
    alignSelf: 'center',
    backgroundColor: '#fff',
    height: responsiveHeight(62),
    borderWidth: responsiveWidth(0.3),
    borderColor: '#B6BBC8',
    borderRadius: responsiveWidth(2),
    marginTop: responsiveHeight(3),
    marginLeft: responsiveWidth(4),
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
    height: responsiveHeight(62),
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
    borderRadius: responsiveWidth(2),
    flexDirection: 'row',
    alignItems: 'center',
    // marginRight: responsiveWidth(5),
    marginLeft: responsiveWidth(1.5),
  },
  icon: {
    marginLeft: responsiveWidth(-2),
    //marginTop:responsiveWidth(2)
  },
});
