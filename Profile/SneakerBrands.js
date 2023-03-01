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
import AntDesign from 'react-native-vector-icons/AntDesign';
import {saveData} from '../Backend/utility';
export default class SneakerBrands extends Component {
  state = {
    isSwitchOn: true,
    overlay: false,
    searchQuery: '',
    moveVisible: false,
    sourcedata: [
      {
        id: 0,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2Fadidas.png?alt=media&token=9df467cb-0ec7-41ec-a0e5-66d794334d5d",
        flag: false,
      },
      {
        id: 1,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2Fallbirds.png?alt=media&token=9dada8ba-e0ef-4a8e-a3fb-aaed2853ec25",
        flag: false,
      },
      {
        id: 2,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2Fand1.png?alt=media&token=13e3a607-1f75-4714-877a-f91abadd8572",
        flag: false,
      },
      {
        id: 3,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2Fasics.png?alt=media&token=b4ad3d34-ef15-4e14-9dc8-b611acede948",
        flag: false,
      },
      {
        id: 4,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2Fbalenciaga.png?alt=media&token=5c8e21df-c77e-470e-9b3f-db9621730a35",
        flag: false,
      },
      {
        id: 5,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2Fbape.png?alt=media&token=b9fe4f97-4cbc-4aed-8696-985092e0a126",
        flag: false,
      },
      {
        id: 6,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2Fbritish-knights.png?alt=media&token=52c3697e-88d1-4558-be8f-029fac453cc7",
        flag: false,
      },
      {
        id: 7,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2Fcolehaan.png?alt=media&token=628b670a-4cca-4c02-b3d8-51dd4ad96776",
        flag: false,
      },
      {
        id: 8,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2Fconverse.png?alt=media&token=033e94ad-e12e-42ba-a10b-302fc38aae0c",
        flag: false,
      },
      {
        id: 9,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2Fcrocs.png?alt=media&token=c0e6f7e9-6762-49ed-b134-78f40f10c071",
        flag: false,
      },
      {
        id: 10,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2Fdiadora.png?alt=media&token=033128de-c3af-41e5-86e9-46b509bfe8cc",
        flag: false,
      },
      {
        id: 11,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2Fewing.png?alt=media&token=073036d4-e3e8-4580-898c-064efb395b43",
        flag: false,
      },
      {
        id: 12,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2Ffila.png?alt=media&token=78b40573-783e-4509-abe8-6cbc2980ba64",
        flag: false,
      },
      {
        id: 13,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2FGucci.png?alt=media&token=e1bd8586-9007-4f80-b399-40760b5338af",
        flag: false,
      },
      {
        id: 14,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2Fjordan.png?alt=media&token=167adaeb-8e7a-43bf-a380-9a34abbaed86",
        flag: false,
      },
      {
        id: 15,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2Fla-gear.png?alt=media&token=a2fad6d6-2692-4766-983e-bb40befa7fb2",
        flag: false,
      },
      {
        id: 16,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2Flouis.png?alt=media&token=949d83c7-d7bf-4be0-8cbc-d92dbbf454f3",
        flag: false,
      },
      {
        id: 17,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2Fmadden.png?alt=media&token=0f37bb11-dec4-4fc3-b6a0-e4a8e2a23b5f",
        flag: false,
      },
      {
        id: 18,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2Fnewbalance.png?alt=media&token=221107d2-974f-47fb-a681-be7fe35ac4f9",
        flag: false,
      },
      {
        id: 19,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2Fnike.png?alt=media&token=dced8cc6-be01-4a1c-909e-66099e354652",
        flag: false,
      },
      {
        id: 20,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2Fpuma.png?alt=media&token=95f569e7-0c12-4bb7-a4d1-8b21bfecc71c",
        flag: false,
      },
      {
        id: 21,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2Freebok.png?alt=media&token=776e5336-2f5b-4961-abdb-a000ffc5c5c8",
        flag:false,
      },
      {
        id: 22,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2Fsaucony.png?alt=media&token=f82316e9-001f-4e6b-b0ab-33e448aa988f",
        flag: false,
      },
      {
        id: 23,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2FSkechers.png?alt=media&token=13178c5f-583b-4fa6-ac00-8c8a6fc5785e",
        flag: false,
      },
      {
        id: 24,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2Ftimberland.png?alt=media&token=865a2542-70b4-4437-91da-5f7d6d9b3df8",
        flag: false,
      },
      {
        id: 25,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2Fugg.png?alt=media&token=7fa14a14-0952-463e-93db-c19a1c974581",
        flag: false,
      },
      {
        id: 26,
        image: "https://firebasestorage.googleapis.com/v0/b/sneakerlog-c7664.appspot.com/o/Brands%2Funder-armour.png?alt=media&token=926a3d61-278e-4305-87b6-5944d044f271",
        flag: false,
      },
    ],
    add: false,
    modalVisibleStart: true,
    modalVisible: false,
    move: -1,
    // BrandsList: this.props.navigation.getParam('BrandsList', []),
    BrandsList: this.props.route.params.BrandsList,
    userProfilePic:''

  };
  async changeBorder(ind) {
    var messages = this.state.sourcedata;
    messages.map((item, index) => {
      if (ind == index) {
        if (item.flag) {
          item.flag = false;
        } else {
          item.flag = true;
        }
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

  async componentDidMount() {
    let BList = this.state.sourcedata;

    let BrandsList = this.state.BrandsList;
    console.log('Brand List', BrandsList);
    BList.forEach(async (element, index) => {
      if (await this.CheckFn(BrandsList, element.id)) {
        // element.flag = true;
        this.changeBorder(element.id);
      }
    });
    this.setState({sourcedata: BList});
    this.forceUpdate();
  }

  async CheckFn(BrandsList, id) {
    let result = false;

    BrandsList.forEach((element) => {
      if (element.id === id) {
        result = true;
      }
    });

    return result;
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
          {/* <TouchableOpacity onPress={() => this.props.navigation.navigate('ProfileStack')} style={{alignSelf: 'center',position:'absolute',left:responsiveWidth(88),zIndex:1,}}>
        <Image source={
                this.state.UserInfo.profileImage !== undefined
                  ? {uri: this.state.UserInfo.profileImage}
                  : require('../../Assets/sneakerlog_profile.png')
              } style={{ height: responsiveHeight(4),width: responsiveHeight(4),borderRadius: responsiveWidth(6), marginTop: responsiveWidth(7),}}/>
    </TouchableOpacity> */}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.collectionview}>
            <Text style={styles.nametext}>SNEAKER BRANDS</Text>
            <TouchableOpacity
              style={{left: responsiveWidth(15)}}
              onPress={async () => {
                let id = await AsyncStorage.getItem('Token');
                let BList = this.state.sourcedata;
                let List = [];
                BList.forEach((element) => {
                  if (element.flag) {
                    List.push(element);
                  }
                });
                await saveData('Users', id, {
                  BrandsList: List,
                }).then(async () => {
                  // alert('Brand List Updated!');
                  await AsyncStorage.setItem('updateBarand', 'updateBarand');
                  this.props.navigation.navigate('Editprofile1');
                });
              }}>
              <Text style={styles.nametext2}>Continue</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={this.state.sourcedata}
            numColumns={2}
            style={{marginL: responsiveWidth(5)}}
            keyExtractor={(Item) => Item.image}
            renderItem={(item, index) => {
              return (
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={async () => {
                      let BrandsList = this.state.BrandsList;
                      if (await this.CheckFn(this.state.BrandsList, item.id)) {
                      } else {
                        BrandsList.push(item.item);
                      }
                      await this.changeBorder(item.index);
                    }}
                    style={[
                      styles.imageContainer,
                      {
                        borderColor: item.item.flag ? '#D9173B' : '#B6BBC8',
                      },
                    ]}>
                    <Image style={styles.image} source={{uri : item.item.image}} />
                  </TouchableOpacity>
                </View>
              );
            }}
          />
          <View style={{height: 20}}></View>
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
    height: responsiveHeight(15),
    justifyContent: 'center',
    alignItems: 'center',
    // borderBottomWidth: 1,
    // borderLeftWidth: 1,
    // borderRightWidth: 1,
    // borderTopWidth: 1,
    borderWidth: responsiveWidth(0.5),
    borderRadius: responsiveWidth(1.7),
    marginLeft: responsiveWidth(5),
    marginTop: responsiveHeight(3),
    backgroundColor: '#FFF',
    width: responsiveWidth(43),
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
    marginLeft: responsiveWidth(5),
  },
  nametext2: {
    fontSize: responsiveFontSize(2),
    fontFamily: 'Lato-Bold',
    marginTop: responsiveWidth(1),
    color: '#D9173B',
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
