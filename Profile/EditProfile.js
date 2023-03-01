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
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import validator from 'validator';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal, {
  ModalContent,
  ModalTitle, 
  ModalButton,
  BottomModal,
} from 'react-native-modals';
import ImagePicker from 'react-native-image-picker';
import { saveData } from '../Backend/utility';
// import firebase from 'react-native-firebase';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'react-native-fetch-blob';
export default class Editprofile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      phone: '404-555-2311',
      username: '',
      gender: 'Female',
      modalVisible: false,
      size:0,
      data: [
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
      sourcedata: [
        {
          image: require('../../Assets/SneakerBrands/adidas.png'),
        },
        {
          image: require('../../Assets/SneakerBrands/allbirds.png'),
        },
        {
          image: require('../../Assets/SneakerBrands/and1.png'),
        },
        {
          image: require('../../Assets/SneakerBrands/asics.png'),
        },
        {},
      ],
      Selected: '',
      image: '',
      modalVisibleStart: false,
    };
  }
  handleChoosePhoto = () => {
    var options = {
      title: 'CHANGE PROFILE PHOTO',
      customButtons: [{name: 'fb', title: 'Remove Current Photo'}],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
      } else if (response.error) {
      } else if (response.customButton) {
      } else {
        this.setState({image: response.uri});
        // this.onChange2(response, 'image')
      }
    });
  };

 
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent></StatusBar>
        <View style={styles.header}>
        <Image source={require('../../Assets/Logo.png')} style={{height: responsiveHeight(4),width: responsiveWidth(40),resizeMode: 'contain',alignSelf: 'center',marginTop: responsiveWidth(7),}} />

        </View>
        <View
          style={{
            height: responsiveHeight(8),
            // marginHorizontal:responsiveWidth(5),
            justifyContent: 'space-around',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <Text
            onPress={() => this.props.navigation.navigate('SneakerBrands')}
            style={{
              // fontFamily: 'Lato-Bold',
              fontWeight: 'normal',
              fontSize: responsiveFontSize(2),
              color: '#121212',
            }}>
            Cancel
          </Text>
          <Text
            style={{
              fontFamily: 'Lato-Bold',
              fontWeight: 'normal',
              fontSize: responsiveFontSize(2.1),
              color: '#121212',
            }}>
            PROFILEe
          </Text>
          <Text
          onPress={()=>{
            this.state.image ? this.props.navigation.navigate('Profile',{item:this.state.image}):null
          }}
            style={{
              fontFamily: 'Lato-Bold',
              fontWeight: 'normal',
              fontSize: responsiveFontSize(2.1),
              color: '#D9173B',
            }}>
            {this.state.image ? 'Update' : 'Edit'}
          </Text>
        </View>
        <ScrollView
                showsVerticalScrollIndicator={false}

          scrollIndicatorInsets={true}
          style={{marginHorizontal: responsiveWidth(5)}}>
          <View
            style={{
              height: responsiveHeight(20),
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                height: responsiveHeight(16),
                width: responsiveHeight(16),
                borderRadius: responsiveHeight(16),
                backgroundColor: '#E6E6E6',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {this.state.image ? (
                <Image
                  source={{uri: this.state.image}}
                  style={{
                    height: responsiveHeight(16),
                    width: responsiveHeight(16),
                    borderRadius: responsiveHeight(16),
                    resizeMode: 'contain',
                    zIndex: 1,
                  }}
                />
              ) : (
                <Text
                  style={{
                    fontFamily: 'Lato-Bold',
                    fontWeight: 'normal',
                    fontSize: responsiveFontSize(6.1),
                    color: '#121212',
                  }}>
                  RD
                </Text>
              )}
            </View>
            <Text
              onPress={() => this.handleChoosePhoto()}
              style={{
                fontFamily: 'Lato-Bold',
                fontWeight: 'normal',
                fontSize: responsiveFontSize(1.6),
                color: '#D9173B',
              }}>
              Change Profile Photo
            </Text>
          </View>

          <View style={{marginVertical: responsiveHeight(3)}}>
            <Text style={styles.fieldname}>NAME</Text>
            <View style={styles.textinputcontainer}>
              <TextInput
                placeholder="Rachel Donaldson"
                placeholderTextColor="#121212"
                autoCapitalize="sentences"
                value={this.state.name}
                onChangeText={(text) => this.setState({name: text})}
                style={styles.textinputfield}
              />
            </View>
          </View>
          <View style={{marginVertical: responsiveHeight(3)}}>
            <Text style={styles.fieldname}>USERNAME</Text>
            <View style={styles.textinputcontainer}>
              <TextInput
                placeholder="rdonaldson23"
                placeholderTextColor="#121212"
                autoCapitalize="sentences"
                value={this.state.name}
                onChangeText={(text) => this.setState({name: text})}
                style={styles.textinputfield}
              />
            </View>
          </View>
          <View style={{marginVertical: responsiveHeight(3)}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.fieldname}>EMAIL</Text>
              <View
                style={{
                  marginLeft: responsiveWidth(2.5),
                  height: responsiveHeight(2.5),
                  width: responsiveWidth(17),
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#362636',
                  borderRadius: responsiveHeight(0.5),
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
            <View style={styles.textinputcontainer}>
              <TextInput
                placeholder="rdonaldson23@gmail.com"
                placeholderTextColor="#121212"
                autoCapitalize="sentences"
                value={this.state.email}
                onChangeText={(text) => this.setState({email: text})}
                style={styles.textinputfield}
              />
            </View>
          </View>
          <View style={{marginVertical: responsiveHeight(3)}}>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.fieldname}>Phone</Text>
              <View
                style={{
                  marginLeft: responsiveWidth(2.5),
                  height: responsiveHeight(2.5),
                  width: responsiveWidth(17),
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#362636',
                  borderRadius: responsiveHeight(0.5),
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
            <Modal
              visible={this.state.modalVisibleStart}
              transparent={true}
              overlayBackgroundColor="rgba(0,0,0,1)"
              onTouchOutside={() => {
                this.setState({modalVisibleStart: false});
              }}>
              <View>
                <ModalContent style={styles.modalview}>
                  <View
                    style={{
                      height: responsiveHeight(8),
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Text
                      style={{
                        fontFamily: 'Lato-Bold',
                        fontWeight: 'normal',
                        fontSize: responsiveFontSize(2),
                        alignSelf: 'center',
                      }}>
                      ARE YOU SURE YOU WANTS TO
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'Lato-Bold',
                        fontWeight: 'normal',
                        fontSize: responsiveFontSize(2),
                        alignSelf: 'center',
                      }}>
                      TO LOG OUT?
                    </Text>
                  </View>
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
                      <Text style={styles.buttontext}>No</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.buttonview}
                      onPress={() => {
                        // this.props.navigation.navigate('AddNewCollection');
                        this.setState({modalVisibleStart: false});
                      }}>
                      <Text style={styles.buttontext}>Yes</Text>
                    </TouchableOpacity>
                  </View>
                </ModalContent>
              </View>
            </Modal>
            <View
              style={{
                height: responsiveHeight(6),
                //   justifyContent:'center',
                alignItems: 'center',
                marginTop: responsiveHeight(0.5),
                borderBottomWidth: this.state.phone.length == 11 ? 3 : 1,
                borderLeftWidth: this.state.phone.length == 11 ? 3 : 1,
                borderRightWidth: this.state.phone.length == 11 ? 3 : 1,
                borderTopWidth: this.state.phone.length == 11 ? 3 : 1,
                borderRadius: 3,
                borderColor:
                  this.state.phone.length == 11 ? '#D9173B' : '#B6BBC8',
                backgroundColor: '#FFF',
                flexDirection: 'row',
              }}>
              <View style={{width: responsiveWidth(80)}}>
                <TextInput
                  placeholder="404-555-2311"
                  placeholderTextColor="#121212"
                  autoCapitalize="sentences"
                  value={this.state.phone}
                  onChangeText={(text) => this.setState({phone: text})}
                  style={{
                    marginHorizontal: responsiveWidth(3),
                    fontFamily: 'Lato-Bold',
                    fontWeight: 'normal',
                    fontSize: responsiveFontSize(2.2),
                    color: '#121212',
                  }}
                />
              </View>
              {this.state.phone.length == 11 ? (
                <Entypo
                  name="circle-with-cross"
                  size={responsiveFontSize(3)}
                  color="#D9173B"
                />
              ) : null}
            </View>
            {this.state.phone.length == 11 ? (
              <Text
                style={{
                  color: '#D9173B',
                }}>
                Phone number isn't valid
              </Text>
            ) : null}
          </View>
          <BottomModal
            animationType={'pokeman'}
            transparent={false}
           
            height={responsiveHeight(55)}
            visible={this.state.modalVisible}
            onTouchOutside={() => {
              this.setState({modalVisible: false});
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
                  borderRadius: responsiveWidth(2),
                  flexDirection: 'row',
                  alignItems: 'center',
                  // justifyContent: 'center',
                }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Bold',
                    fontWeight: 'bold',
                    fontSize: responsiveFontSize(2.2),
                    marginBottom: responsiveHeight(1),
                  }}>
                  Select Sneaker Size
                </Text>
                <View style={{width: responsiveWidth(10)}} />
                <Image
                  source={require('../../Assets/Vector.png')}
                  style={{
                    height: responsiveHeight(3),
                    width: responsiveWidth(14),
                    resizeMode: 'contain',
                    marginBottom: responsiveHeight(1.5),
                  }}
                />
                <Text
                onPress={()=>{
                  this.setState({modalVisible:false})
                  this.props.navigation.navigate('SizeGuide')}}
                  style={{
                    fontFamily: 'Lato-Bold',
                    fontWeight: 'bold',
                    fontSize: responsiveFontSize(2),
                    marginBottom: responsiveHeight(1),
                    color: '#D9173B',
                  }}>
                  Size Guide
                </Text>
              </View>
              <FlatList
                showsScrollIndicator={false}
                numColumns={7}
                data={this.state.data}
                renderItem={({item}) => {
                  console.log(this.state.size==item.value)
                  return (
                    <TouchableOpacity
                      onPress={() => this.setState({size:item.value})}
                      style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        style={{
                          marginTop: responsiveHeight(2),
                          marginLeft: responsiveWidth(2),
                          height: responsiveHeight(4),
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: responsiveWidth(10),
                          borderBottomWidth:1,
                          borderLeftWidth:1,
                          borderRightWidth: 1,
                          borderTopWidth: 1,
                          borderRadius: 3,
                          borderColor:'#B6BBC8',
                          backgroundColor:this.state.size==item.value?'#D9173B': '#FFF',
                        }}>
                        <Text>{item.value}</Text>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                }}
              />

              <TouchableOpacity onPress={() => {
              this.setState({modalVisible: false});
            }}
                style={{
                  width: responsiveWidth(95),
                  height: responsiveHeight(5),
                  borderRadius: responsiveWidth(2),
                  flexDirection: 'row',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  marginVertical: responsiveHeight(0),
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

          <View style={{marginVertical: responsiveHeight(3)}}>
            <Text style={styles.name}>GENDER</Text>
            <View
              style={[
                styles.textinputcontainer,
                {justifyContent: 'space-between'},
              ]}>
              <TouchableOpacity
                onPress={() => this.setState({gender: 'Male'})}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  height: responsiveHeight(6),
                  backgroundColor:
                    this.state.gender == 'Male' ? '#D9173B' : null,
                }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Bold',
                    fontWeight: 'normal',
                    fontSize: responsiveFontSize(2.2),
                    color: this.state.gender == 'Male' ? '#FFF' : '#121212',
                  }}>
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({gender: 'Female'})}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  height: responsiveHeight(6),
                  backgroundColor:
                    this.state.gender == 'Female' ? '#D9173B' : null,
                }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Bold',
                    fontWeight: 'normal',
                    fontSize: responsiveFontSize(2.2),
                    color: this.state.gender == 'Female' ? '#FFF' : '#121212',
                  }}>
                  Female
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.setState({gender: 'Other'})}
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  height: responsiveHeight(6),
                  backgroundColor:
                    this.state.gender == 'Other' ? '#D9173B' : null,
                }}>
                <Text
                  style={{
                    fontFamily: 'Lato-Bold',
                    fontWeight: 'normal',
                    fontSize: responsiveFontSize(2.2),
                    color: this.state.gender == 'Other' ? '#FFF' : '#121212',
                  }}>
                  Other
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginVertical: responsiveHeight(3)}}>
            <Text style={styles.fieldname}>FAVORITE SNEAKER BRANDS</Text>
            <View style={{flexDirection: 'row'}}>
              <FlatList
                data={this.state.sourcedata}
                horizontal={true}
                keyExtractor={(Item) => Item.image}
                renderItem={(item, index) => {
                  console.log(item.index);
                  return (
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          height: responsiveHeight(6),
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderBottomWidth: 1,
                          borderLeftWidth: 1,
                          borderRightWidth: 1,
                          borderTopWidth: 1,
                          borderRadius: 3,
                          borderColor: '#B6BBC8',
                          marginLeft: item.index == 0 ? 0 : responsiveWidth(5),
                          marginTop: responsiveHeight(1),
                          backgroundColor: '#FFF',
                          width: responsiveWidth(12),
                        }}>
                        {!item.item.image ? (
                          <AntDesign
                          onPress={()=>this.props.navigation.navigate('SneakerBrands')}
                            name={'pluscircleo'}
                            size={20}
                            color={'#D9173B'}
                          />
                        ) : (
                          <Image
                            style={{
                              height: responsiveHeight(5),
                              width: responsiveWidth(7),
                              resizeMode: 'contain',
                            }}
                            source={item.item.image}
                          />
                        )}
                      </View>
                    </View>
                  );
                }}
              />
            </View>
          </View>
          <View style={{marginVertical: responsiveHeight(3)}}>
            <Text
              style={{
                fontFamily: 'Lato-Bold',
                fontWeight: 'normal',
                fontSize: responsiveFontSize(1.8),
                color: '#6c6c6c',
              }}>
              SNEAKER SIZE
            </Text>
            <TouchableOpacity
            onPress={()=>{this.setState({modalVisible:true})}}
              style={{
                height: responsiveHeight(6),
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderTopWidth: 1,
                borderRadius: 3,
                borderColor: '#B6BBC8',
                marginTop: responsiveHeight(1),
                backgroundColor: '#FFF',
                width: responsiveWidth(40),
              }}>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  fontWeight: 'normal',
                  fontSize: responsiveFontSize(2.2),
                  color: '#121212',
                }}>
                {
                  this.state.size?this.state.size:'9'
                }
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{marginVertical: responsiveHeight(5)}}>
            <TouchableOpacity
              onPress={() => this.setState({modalVisibleStart: true})}
              style={{
                height: responsiveHeight(6),
                justifyContent: 'center',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderTopWidth: 1,
                borderRadius: 3,
                borderColor: '#B6BBC8',
                backgroundColor: '#FFF',
              }}>
              <Text
                style={{
                  fontFamily: 'Lato-Bold',
                  fontWeight: 'normal',
                  fontSize: responsiveFontSize(2.2),
                  color: '#589BE9',
                }}>
                Log Out
              </Text>
            </TouchableOpacity>
          </View>
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
    marginTop: responsiveWidth(7),
  },
  modalview: {
    width: responsiveWidth(78),
    height: responsiveHeight(23),
  },
  textinputfield: {
    marginHorizontal: responsiveWidth(3),
    fontFamily: 'Lato-Medium',
    fontWeight: 'normal',
    fontSize: responsiveFontSize(2.2),
    color: '#121212',
  },
  textinputcontainer: {
    marginTop: responsiveHeight(1),
    height: responsiveHeight(7),
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
  textValue: {
    fontFamily: 'Lato-Medium',
    fontWeight: 'normal',
    fontSize: responsiveFontSize(2.2),
    color: '#121212',
  },
  fieldname: {
    fontFamily: 'Lato-Heavy',
    fontWeight: 'normal',
    fontSize: responsiveFontSize(1.5),
    color: '#6c6c6c',
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
});
