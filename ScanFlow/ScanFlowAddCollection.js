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
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Button, Switch} from 'react-native-paper';
export default class ScanFlowAddCollection extends Component {
  state = {
    isSwitchOn: false,
    modalVisible: false,
    modalVisibleStart: false,UserInfo: {},
    userProfilePic:''
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
            await this.GetColFn();
          },
        );
      }
    
      // async componentDidMount() {
      //   this.focusListener = this.props.navigation.addListener(
      //     'didFocus',
      //     async () => {
      //       this.GetColFn();
      //     },
      //   );
      // }
    
      async GetColFn() {
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
    
          
          this.forceUpdate();
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

        <View style={styles.headerbottom}>
          <Image
            style={{
              marginLeft: responsiveWidth(0.2),
              height: responsiveWidth(7),
              width: responsiveWidth(7),
              marginBottom: 2,
            }}
            source={require('../../Assets/Star.png')}
          />
          <Text style={styles.nametext}>Yeezy 700 Collection</Text>
          <TouchableOpacity>
            <Ionicons
              name={'ios-arrow-down'}
              size={25}
              color={'#949494'}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{borderBottomWidth: 1, borderColor: '#B6BBC8', width: '100%'}}
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.bodycontainer}>
            <Text style={styles.sneakertext}>SNEAKER</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.sneakertext1}>Adidas Yeezy 700 V3 Azael</Text>
              <Image
                style={{
                  height: responsiveHeight(3.5),
                  width: responsiveWidth(7),
                  resizeMode: 'contain',
                  top: 2,
                }}
                source={require('../../Assets/ScannedShoeIndicator.png')}
              />
            </View>
            <Image
              source={require('../../Assets/products/collection.png')}
              style={styles.image}></Image>

            <Text style={styles.sneakertext}>SKU</Text>
            <Text style={styles.sneakertext1}>191040-70692-9</Text>
            <Text style={styles.sneakertext}>COLORWAY</Text>
            <Text style={styles.sneakertext1}>Azael/Azael/Azael</Text>
            <Text style={styles.sneakertext}>SNEAKER SIZE</Text>
            <TouchableOpacity style={styles.sizeview}>
              <Text style={styles.sizetext}>SELECT SIZE</Text>
            </TouchableOpacity>
            <Text
              style={[styles.sneakertext, {marginLeft: responsiveWidth(7)}]}>
              CONDITION
            </Text>
            <View
              style={{
                flexDirection: 'row',
                widh: responsiveWidth(88),
                alignSelf: 'center',
              }}>
              <TouchableOpacity style={styles.usedview}>
                <Text style={styles.sizetext}>Used</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.newview}>
                <Text style={[styles.sizetext, {color: '#fff'}]}>New</Text>
              </TouchableOpacity>
            </View>
            <Text
              style={[styles.sneakertext, {marginLeft: responsiveWidth(7.5)}]}>
              QUANTITY
            </Text>
            <View
              style={{
                flexDirection: 'row',
                widh: responsiveWidth(88),
                alignSelf: 'center',
                marginBottom: responsiveWidth(10),
              }}>
              <TouchableOpacity style={styles.lessview}>
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
                  1
                </Text>
              </View>
              <TouchableOpacity style={styles.moreview}>
                <Entypo name={'plus'} size={25} color={'#fff'} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View style={styles.buttoncontainer}>
          <Button
            labelStyle={{
              color: '#589BE9',
              fontFamily: 'Lato-Bold',
              fontSize: responsiveFontSize(2),
            }}
            uppercase={false}
            mode="text"
            style={styles.button}>
            Cancel
          </Button>
          <View
            style={{
              borderLeftWidth: responsiveWidth(0.3),
              borderColor: '#B6BBC8',
            }}></View>
          <Button
            onPress={() => {
              this.setState({modalVisibleStart: true});
            }}
            color={'#D9173B'}
            labelStyle={{
              color: '#fff',
              fontFamily: 'Lato-Bold',
              fontSize: responsiveFontSize(2),
            }}
            uppercase={false}
            mode="contained"
            style={styles.button1}>
            Add to Collection
          </Button>
        </View>
        <Modal
          visible={this.state.modalVisibleStart}
          transparent={true}
          overlayBackgroundColor="black"
          onTouchOutside={() => {
            this.setState({modalVisibleStart: false});
          }}>
          <View>
            <ModalContent style={styles.modalview}>
              <Image
                style={{
                  height: responsiveWidth(12),
                  width: responsiveWidth(12),
                  alignSelf: 'center',
                }}
                source={require('../../Assets/CheckSuccessOutline.png')}
              />
              {/* <MaterialCommunityIcons name={'check-circle-outline'} size={30} color={'#7AD693'} style={{alignSelf:'center',marginTop: responsiveWidth(-4)}} /> */}
              <Text
                style={[
                  styles.favtext,
                  {alignSelf: 'center', marginTop: responsiveWidth(3)},
                ]}>
                SNEAKER SUCCESSFULLY
              </Text>
              <Text style={[styles.favtext, {alignSelf: 'center'}]}>
                ADDED TO YOUR COLLECTION
              </Text>
              <Text
                style={[
                  styles.favtext1,
                  {alignSelf: 'center', marginTop: responsiveWidth(3.5)},
                ]}>
                Would your like to add{' '}
              </Text>
              <Text
                style={[
                  styles.favtext1,
                  {alignSelf: 'center', marginBottom: responsiveWidth(3.5)},
                ]}>
                another sneaker
              </Text>

              <View
                style={{
                  borderBottomWidth: responsiveWidth(0.2),
                  borderColor: '#B6BBC8',
                  width: responsiveWidth(100),
                  marginLeft: responsiveWidth(-5),
                }}></View>
              <View style={{flexDirection: 'row'}}>
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
                    this.setState({modalVisibleStart: false});
                  }}>
                  <Text style={styles.buttontext}>Yes</Text>
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

  headerbottom: {
    width: responsiveWidth(85),
    alignSelf: 'center',
    flexDirection: 'row',
    marginVertical: responsiveWidth(5),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nametext: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: 'Lato-Regular',
  },
  icon: {
    // marginLeft: responsiveWidth(-8),
    //marginTop: responsiveWidth(.5)
  },
  bodycontainer: {
    width: responsiveWidth(100),
    backgroundColor: '#fff',
    // height: responsiveHeight(100),
  },
  favtext: {
    fontFamily: 'Lato-Bold',
    fontSize: responsiveFontSize(2),
  },
  favtext1: {
    fontFamily: 'Lato-Regular',
    fontSize: responsiveFontSize(2),
    textAlignVertical: 'center',
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
  modalview: {
    width: responsiveWidth(78),
    height: responsiveHeight(30.3),
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
    height: responsiveHeight(7.5),
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
});
