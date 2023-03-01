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
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { ActivityIndicator } from 'react-native-paper';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {KeyboardAvoidingView} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {getAllOfCollection, getData} from '../Backend/utility';
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
export default class Products extends Component {
  state = {
    data1: [
     
    ],
    UserInfo: {},
    isLoading: true,
    userProfilePic:''

  };

  async componentDidMount() {
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
    console.log(UserData);
    await AsyncStorage.setItem('User', JSON.stringify(UserData));
    await this.setState({UserInfo: UserData});
    let Release = await getAllOfCollection('SneakersReleaseDates');
    let NewList= Release.sort((a, b) => new Date(a.releaseDate.toDate()) - new Date(b.releaseDate.toDate()))
    console.log("New List : ",NewList)
    this.setState({data1: NewList,isLoading:false});
  }

  render() {
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
        {!this.state.isLoading ? (
          <ScrollView
            style={styles.bottomcontainer}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: responsiveWidth(5),
                justifyContent: 'space-between',
              }}>
              <Text style={styles.favtext}>RELEASE DATES</Text>
            </View>
            {this.state.data1.length > 0 ? (
              <FlatList
                showsScrollIndicator={false}
                numColumns={2}
                data={this.state.data1}
                renderItem={({item}) => {
                  const releaseDate = new Date(item.releaseDate.toDate());
                  return (
                    <View style={styles.cardview2}>
                      <View style={{flexDirection: 'row'}}>
                        <View
                          style={{
                            alignItems: 'center',
                            marginLeft: 4,
                            marginTop: 3,
                          }}>
                          <Text
                            style={[
                              styles.datetext,
                              {
                                marginTop: responsiveHeight(0.6),
                                fontFamily: 'D-DINCondensed-Bold',
                              },
                            ]}>
                            {monthNames[releaseDate.getMonth()]}
                          </Text>
                          <Text
                            style={[
                              styles.datetext,
                              {
                                fontSize: responsiveFontSize(2),
                                color: '#D9173B',
                                fontFamily: 'D-DINCondensed-Bold',
                              },
                            ]}>
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
                        }}>
                        <Text style={styles.text}>{item.name}</Text>
                        {/* <Text style={styles.text}>"Cinder"</Text> */}
                      </View>
                    </View>
                  );
                }}
              />
            ) : (
              <View
                style={{
                  flex: 1,
                  height: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={[
                    styles.favtext,
                    {color: 'gray', marginTop: '50%', fontSize: 20},
                  ]}>
                  No items
                </Text>
              </View>
            )}

            <View style={{height: 20}}></View>
          </ScrollView>
        ) : (
          <View style={{alignItems: 'center', width: '100%', marginTop: '40%'}}>
            <ActivityIndicator color={'black'} size={'large'} />
          </View>
        )}
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
  datetext: {
    // width: responsiveWidth(7),
    // backgroundColor: 'red',
    // height: responsiveHeight(6),
    marginLeft: responsiveWidth(2),
    fontSize: responsiveFontSize(2),
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
    fontFamily: 'Lato-Bold',
    textAlignVertical: 'center',
    top: responsiveHeight(1.25),
  },
});
