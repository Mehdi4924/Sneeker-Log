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
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {KeyboardAvoidingView} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Searchbar, ActivityIndicator} from 'react-native-paper';
import {getAllOfCollection, getData} from '../Backend/utility';
export default class Events extends Component {
  state = {
    searchQuery: '',
    Eventparam:[],
    data4: [],
    UserInfo: {},
    isLoading: true,
    userProfilePic:''

  };
  _onChangeSearch = (query) => this.setState({searchQuery: query});

  async componentDidMount() {
    let id = await AsyncStorage.getItem('Token');
    let UserData = await getData('Users', id);
    console.log('ye aya userdata',UserData);
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
    let Events = await getAllOfCollection('Events');
    
    this.setState({Eventparam:this.props.route.params.EventData})
    console.log('ye aya evnts',this.state.Eventparam);
    let NewList = Events.sort(
      (a, b) => new Date(a.date.toDate()) - new Date(b.date.toDate()),
    );
    this.setState({data4: NewList, data4Copy: NewList, isLoading: false});
  }

  async FilterFn(text) {
    if (text !== '') {
      let newData = this.state.data4.filter(function (item) {
        //applying filter for the inserted text in search bar
        let itemData = item.name ? item.name.toUpperCase() : ''.toUpperCase();
        let textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      this.setState({data4: newData});
    } else {
      this.setState({data4: this.state.data4Copy});
    }
  }

  render() {
    const {searchQuery} = this.state;
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent></StatusBar>
        {/* <View style={styles.header}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('Home')}
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
        <ScrollView
          style={styles.bottomcontainer}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: responsiveWidth(5),
              justifyContent: 'space-between',
            }}>
            <Text style={styles.favtext}>UPCOMING EVENTS</Text>
          </View>

          {this.state.isLoading ? (
            <View
              style={{alignItems: 'center', width: '100%', marginTop: '40%'}}>
              <ActivityIndicator color={'black'} size={'large'} />
            </View>
          ) : (
            <>
              {/* {this.state.data4.length > 2 ? ( */}
                <Searchbar
                  onChangeText={(text) => {
                    this.FilterFn(text);
                  }}
                  // value={searchQuery}
                  // onSubmitEditing={() => {

                  //   // this.GetDataFromApi();
                  // }}
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
                    borderRadius: responsiveWidth(8),
                    borderColor: '#979797',
                    borderWidth: responsiveWidth(0.3),
                    height: responsiveHeight(7),
                    width: responsiveWidth(90),
                  }}
                />
                 {console.log('ye ay evevnts',this.state.Eventparam)}
                 {/* <FlatList
                    showsScrollIndicator="false"
                    data={this.state.Eventparam}
                    renderItem={({item}) => {
                      return (
                        <TouchableOpacity
                          style={{width: responsiveWidth(90)}}
                          onPress={() =>{
                            console.log("Call",item)
                            // this.props.navigation.navigate('EventDetail', {
                            //   EventData: item,
                            // })
                          }}>
                          <Image
                            source={{uri: item.image}}
                            style={styles.eventimage}
                          />
                        </TouchableOpacity>
                      );
                    }}
                  /> */}
              {/* ) : null} */}



              {
                this.state.Eventparam&&this.state.Eventparam.length > 0 ? (
                  <FlatList
                    showsScrollIndicator="false"
                    data={this.state.Eventparam}
                    renderItem={({item, index}) => {
                      return (
                        <TouchableOpacity
                          style={{width: responsiveWidth(90)}}
                          onPress={() =>{
                            console.log("Call",item)
                            this.props.navigation.navigate('EventDetail', {
                              EventData: item,
                            })
                          }}>
                          <Image
                            source={{uri: item.image}}
                            style={[
                              styles.eventimage,
                              // {
                              //   marginBottom:
                              //     index + 1 === this.state.Eventparam.length
                              //       ? responsiveHeight(3)
                              //       : null,
                              // },
                            ]}
                          />
                        </TouchableOpacity>
                      );
                    }}
                  />
                ) : (
                  <View style={{alignItems:"center", width: "100%", marginTop:"40%"}} >
                  <Text style={[{color: 'gray', fontSize: 20}]}>No evnets</Text>
                  </View>
                )
               
              } 
            </>
          )}
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
    marginLeft: responsiveWidth(18),
    marginTop: responsiveWidth(7),
    alignSelf: 'center',
  },
  bottomcontainer: {
    width: responsiveWidth(90),
    alignSelf: 'center',
  },
  favtext: {
    fontFamily: 'Lato-Bold',
    fontSize: responsiveFontSize(1.8),
  },
  eventimage: {
    height: responsiveHeight(20),
    width: responsiveWidth(90),
    borderRadius: responsiveHeight(2),
    marginTop: responsiveWidth(3),
    // alignSelf:'center',
  },
});
