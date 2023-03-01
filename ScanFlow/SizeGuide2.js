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
import Modal, {
  ModalContent,
  ModalTitle,
  ModalButton,
  BottomModal,
} from 'react-native-modals';
import {Button, Switch} from 'react-native-paper';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import AntDesign from 'react-native-vector-icons/AntDesign';
export default class SizeGuide extends Component {
  state = {
    isSwitchOn: true,
    overlay: false,
    searchQuery: '',
    moveVisible: false,
    // UserSize: this.props.navigation.getParam('Size'),
    UserSize: this.props.route.params.Size,
    sourcedata: [
      {
        value1: 3.5,
        value2: 2.5,
        value3: 35.5,
        value4: 22.5,
        value5: 5,
      },
      {
        value1: 4,
        value2: 3,
        value3: 36,
        value4: 23,
        value5: 5.5,
      },
      {
        value1: 4.5,
        value2: 3.5,
        value3: 36.5,
        value4: 23.5,
        value5: 6,
      },
      {
        value1: 5,
        value2: 4,
        value3: 37.5,
        value4: 23.5,
        value5: 6.5,
      },
      {
        value1: 5.5,
        value2: 4.5,
        value3: 38,
        value4: 24,
        value5: 7,
      },
      {
        value1: 6,
        value2: 5.5,
        value3: 38.5,
        value4: 24,
        value5: 7.5,
      },
      {
        value1: 6.5,
        value2: 6,
        value3: 39,
        value4: 24.5,
        value5: 8,
      },
      {
        value1: 7,
        value2: 6,
        value3: 40,
        value4: 25,
        value5: 8.5,
      },
      {
        value1: 7.5,
        value2: 6.5,
        value3: 40.5,
        value4: 25.5,
        value5: 9,
      },
      {
        value1: 8,
        value2: 7,
        value3: 41,
        value4: 26,
        value5: 9.5,
      },
      {
        value1: 8.5,
        value2: 7.5,
        value3: 42,
        value4: 26.5,
        value5: 10,
      },
      {
        value1: 9,
        value2: 8,
        value3: 42.5,
        value4: 27,
        value5: 10.5,
      },
      {
        value1: 9.5,
        value2: 8.5,
        value3: 43,
        value4: 27.5,
        value5: 11,
      },
      {
        value1: 10,
        value2: 9,
        value3: 44,
        value4: 28,
        value5: 11.5,
      },
      {
        value1: 10.5,
        value2: 9.5,
        value3: 44.5,
        value4: 28.5,
        value5: 12,
      },
      {
        value1: 11,
        value2: 10,
        value3: 45,
        value4: 29,
        value5: 12.5,
      },
      {
        value1: 11.5,
        value2: 10.5,
        value3: 45.5,
        value4: 29.5,
        value5: 13,
      },
      {
        value1: 12,
        value2: 11,
        value3: 46,
        value4: 30,
        value5: 13.5,
      },
      {
        value1: 12.5,
        value2: 11.5,
        value3: 47,
        value4: 30.5,
        value5: 14,
      },
      {
        value1: 13,
        value2: 12,
        value3: 48,
        value4: 31,
        value5: 14.5,
      },
      {
        value1: 13.5,
        value2: 12.5,
        value3: 48,
        value4: 31.5,
        value5: 15,
      },
      {
        value1: 14,
        value2: 13,
        value3: 48.5,
        value4: 32,
        value5: 15.5,
      },
      {
        value1: 15,
        value2: 14,
        value3: 49.5,
        value4: 33,
        value5: 16,
      },
      {
        value1: 16,
        value2: 15,
        value3: 50.5,
        value4: 34,
        value5: 16.5,
      },
      {
        value1: 17,
        value2: 16,
        value3: 51.5,
        value4: 35,
        value5: 17,
      },
      {
        value1: 18,
        value2: 17,
        value3: 52.5,
        value4: 36,
        value5: 17.5,
      },
    ],
    add: false,
    modalVisibleStart: true,
    modalVisible: false,
    move: -1,
    userProfilePic:''

  };
  changeBorder(ind) {
    console.log(ind);
    var messages = this.state.sourcedata;
    messages.map((item, index) => {
      if (ind == index) {
        console.log(item, index);
        item.flag = true;
      }
    });
    this.setState({
      sourcedata: messages,
    });
  }
  toggleModal = () => {
    this.setState({modalVisible: !this.state.modalVisible});
  };
  _onChangeSearch = (query) => this.setState({searchQuery: query});
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
  
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.collectionview}>
            <Text style={[styles.nametext, {left: responsiveWidth(5)}]}>
              Size Guide
            </Text>
           
          </View>
          <Text style={styles.nametext3}>
            Use the chart and measuring guide below to determine the sneaker
            size
          </Text>
          <View
            style={{
              width: responsiveWidth(89.9),
              alignSelf: 'center',
              backgroundColor: '#fff',
              marginBottom:10,
              borderWidth: responsiveWidth(0.3),
              borderColor: '#B6BBC8',
              borderRadius: responsiveWidth(2),
              marginTop: responsiveHeight(3),
            }}>
            <View
              style={{
                width: responsiveWidth(90),
                backgroundColor: '#362636',
                height: responsiveHeight(6),
                borderTopLeftRadius: responsiveWidth(1.9),
                borderTopRightRadius: responsiveWidth(1.9),
                flexDirection: 'row',
              }}>
              <View
                style={{
                  width: responsiveWidth(18),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={[styles.nametext, {color: '#FFF'}]}>US</Text>
              </View>
              <View
                style={{
                  width: responsiveWidth(18),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={[styles.nametext, {color: '#FFF'}]}>UK</Text>
              </View>
              <View
                style={{
                  width: responsiveWidth(18),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={[styles.nametext, {color: '#FFF'}]}>EU</Text>
              </View>
              <View
                style={{
                  width: responsiveWidth(18),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={[styles.nametext, {color: '#FFF'}]}>cm</Text>
              </View>
              <View
                style={{
                  width: responsiveWidth(18),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text style={[styles.nametext, {color: '#FFF'}]}>WM</Text>
              </View>
            </View>
            <FlatList
              data={this.state.sourcedata}
              renderItem={({item, index}) => {
                console.log(item.value1===this.state.UserSize )
                return (
                  <TouchableOpacity
                    style={[
                      styles.imageContainer,
                      {
                        borderBottomLeftRadius:index=== this.state.sourcedata.length - 1 ? responsiveWidth(1.9):0,
                        borderBottomRightRadius:index=== this.state.sourcedata.length - 1 ?responsiveWidth(1.9):0,

                        backgroundColor:
                        item.value1 === this.state.UserSize ||
                        item.value2 === this.state.UserSize ||
                        item.value3 === this.state.UserSize ||
                        item.value4 === this.state.UserSize ||
                        item.value5 === this.state.UserSize 
                            ? '#D9173B'
                            : index%2 == 0 ? '#fff': 'rgba(rgba(182, 187, 200, 0.2))',
                      },
                    ]}>
                    <View
                      style={{
                        backgroundColor:
                          item.value1 === this.state.UserSize 
                            ? '#D9173B'
                            : index%2 == 0 ? '#fff': 'rgba(rgba(182, 187, 200, 0.2))',
                        width: responsiveWidth(18),
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: responsiveHeight(6),

                      }}>
                      <Text
                        style={{
                          fontSize: responsiveFontSize(1.8),
                          fontFamily: 'Lato-Bold',
                          color: '#121212',
                        }}>
                        {item.value1}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor:
                          
                          item.value2 === this.state.UserSize 
                            ? '#D9173B'
                            : index%2 == 0 ? '#fff': 'rgba(rgba(182, 187, 200, 0.2))',
                        width: responsiveWidth(18),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderLeftWidth: 1,
                        height: responsiveHeight(6),
                        borderLeftColor: 'rgba(182, 187, 200, 0.5)',
                      }}>
                      <Text
                        style={{
                          fontSize: responsiveFontSize(1.8),
                          fontFamily: 'Lato-Bold',
                          color: '#121212',
                        }}>
                        {item.value2}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor:
                          item.value3 === this.state.UserSize 
                            ? '#D9173B'
                            : index%2 == 0 ? '#fff': 'rgba(rgba(182, 187, 200, 0.2))',
                        width: responsiveWidth(18),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderLeftWidth: 1,
                        height: responsiveHeight(6),
                        borderLeftColor: 'rgba(182, 187, 200, 0.5)',
                      }}>
                      <Text
                        style={{
                          fontSize: responsiveFontSize(1.8),
                          fontFamily: 'Lato-Bold',
                          color: '#121212',
                        }}>
                        {item.value3}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor:
                          item.value4 === this.state.UserSize 
                            ? '#D9173B'
                            : index%2 == 0 ? '#fff': 'rgba(rgba(182, 187, 200, 0.2))',
                        width: responsiveWidth(18),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderLeftWidth: 1,
                        height: responsiveHeight(6),
                        borderLeftColor: 'rgba(182, 187, 200, 0.5)',
                      }}>
                      <Text
                        style={{
                          fontSize: responsiveFontSize(1.8),
                          fontFamily: 'Lato-Bold',
                          color: '#121212',
                        }}>
                        {item.value4}
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor:
                          item.value5 === this.state.UserSize
                            ? '#D9173B'
                            : index%2 == 0 ? '#fff': 'rgba(rgba(182, 187, 200, 0.2))',
                        width: responsiveWidth(18),
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderLeftWidth: 1,
                        height: responsiveHeight(6),
                        borderLeftColor: 'rgba(182, 187, 200, 0.5)',
                      }}>
                      <Text
                        style={{
                          
                          fontSize: responsiveFontSize(1.8),
                          fontFamily: 'Lato-Bold',
                          color: '#121212',
                        }}>
                        {item.value5}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
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
  image: {
    height: responsiveHeight(15),
    width: responsiveWidth(20),
    resizeMode: 'contain',
  },
  imageContainer: {
    height: responsiveHeight(6),
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 0.7,
    backgroundColor: '#FFF',
    width: responsiveWidth(90),
    flexDirection: 'row',
    borderBottomColor: 'rgba(182, 187, 200, 0.5)',
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
    fontFamily: 'Lato-Bold',
    marginTop: responsiveWidth(1),
  },
  nametext3: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Lato-Bold',
    marginTop: responsiveWidth(1),
    marginLeft: responsiveWidth(5),
    color: '#6C6C6C',
  },
  nametext1: {
    fontSize: responsiveFontSize(1.63),
    fontFamily: 'Lato-Bold',
    marginTop: responsiveWidth(1),
    marginLeft: responsiveWidth(32),
    marginRight: responsiveWidth(1),
  },
  nametext2: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: 'Lato-Bold',
    marginTop: responsiveWidth(1),
    marginLeft: responsiveWidth(1),
  },
  collectionview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: responsiveWidth(80),
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
    width: responsiveWidth(90),
    alignSelf: 'center',
    backgroundColor: '#fff',
    height: responsiveHeight(62),
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
