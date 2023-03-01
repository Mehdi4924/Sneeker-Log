import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Linking,
  StatusBar,
  FlatList,
  AsyncStorage,
} from 'react-native';
import Modal, {
  ModalContent,
  ModalTitle,
  ModalButton,
} from 'react-native-modals';
import * as AddCalendarEvent from 'react-native-add-calendar-event';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import { ActivityIndicator } from 'react-native-paper';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { KeyboardAvoidingView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { Searchbar } from 'react-native-paper';
import moment from 'moment';
import openMap from 'react-native-open-maps';
import HTMLView from 'react-native-htmlview';
import { getAllOfCollection, getData } from '../Backend/utility';
// import * as AddCalendarEvent from 'react-native-add-calendar-event';
// import HTML from 'react-native-render-html';
export default class EventDetail extends Component {
  state = {
    UserInfo: {},
    EventDetail: {},
    isgetData: false,
    userProfilePic: '',
    isLoading: true,

  };

  async componentDidMount() {
    let id = await AsyncStorage.getItem('Token');
    let UserData = await getData('Users', id);
    console.log(UserData);
    if (UserData.profileImage) {
      if (!UserData.profileImage.includes('firebasestorage') && !UserData.profileImage.includes('twitter')) {
        let asid = UserData.profileImage?.split('asid=').pop().split('&')[0]
        fetch(`http://graph.facebook.com/${asid}/picture?type=large&height=200&width=200`)
          .then((response) => {
            this.setState({
              userProfilePic: response.url
            })

          })
          .catch((error) => console.error(error))
      }
    }
    await AsyncStorage.setItem('User', JSON.stringify(UserData));
    await this.setState({ UserInfo: UserData });
    console.log('ye aya event data', this.props);
    let NewEventData = await getData('Events', this.props.route.params.EventData._id);
    console.log('Event Details ids:', NewEventData);
    this.setState({ EventDetail: NewEventData, isgetData: true, isLoading: false });
  }

  LaunchCalendar = () => {
    const { name, time } = this.state.EventDetail;
    const { startTime, endTime } = time;
    var tomorrow = new Date();
    tomorrow.setDate(new Date().getDate() + 1);
    // *********** Calandar Event ********** //
    const eventConfig = {
      title: name,
      // startDate: startTime.toDate(),
      // endDate: endTime.toDate(),
      startDate: startTime,
      endDate: endTime,
      location: 'location',
    };

    AddCalendarEvent.presentEventCreatingDialog(eventConfig)
      .then((eventInfo) => {
        console.log('Event Info:', eventInfo);
        console.warn(JSON.stringify(eventInfo));
      })
      .catch((error) => {
        console.warn(error);
      });
    // ********* Calandar Event End ********* //
  };

  LaunchMap(location) {
    Linking.openURL(
      'https://www.google.com/maps/search/?api=1&query=' + location,
    );
    // openMap({location});
  }

  render() {
    const { EventDetail } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent></StatusBar>
        {/* <Header
          backPress={() => this.props.navigation.goBack()}
          profilePress={() => this.props.navigation.navigate('ProfileStack')}
          /> */}
        {!this.state.isLoading ? (
          <>
            {this.state.isgetData === true && (

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
                <View>
                  {console.log('===>>>', this.state.EventDetail)}
                  <Image
                    source={{ uri: this.state.EventDetail.image }}
                    style={styles.eventimage}
                  />
                </View>
                <View style={styles.detailview}>
                  <Text style={styles.heading}>DATE AND TIME</Text>
                  <Text style={styles.datetext}>
                    {/* {moment(this.state.EventDetail.date.toDate()).format('MM-DD-YYYY')} */}
                    {`${moment(EventDetail.date.toDate()).format(
                      'MM-DD-YYYY',
                    )}`}
                  </Text>
                  <Text style={styles.datetext}>
                    {/* {'Start Time ' +
                  moment(this.state.EventDetail.date.toDate()).format('MM-DD-YYYY') +
                  ' ' +
                  moment(this.state.EventDetail.time.startTime.toDate()).format(
                    'hh:mm a',
                  )} */}
                    {`Start Time ${moment(EventDetail.date.toDate()).format(
                      'MM-DD-YYYY',
                    )} ${moment(EventDetail.time.startTime.toDate()).format('hh:mm a')}`}
                  </Text>
                  <Text style={styles.datetext}>
                    {/* {'End Time   ' +
                  moment(this.state.EventDetail.date.toDate()).format('MM-DD-YYYY') +
                  ' ' +
                  moment(this.state.EventDetail.time.endTime.toDate()).format('hh:mm a')} */}
                    {`End Time ${moment(EventDetail.date.toDate()).format(
                      'MM-DD-YYYY',
                    )} ${moment(EventDetail.time.endTime.toDate()).format('hh:mm a')}`}
                  </Text>
                  <TouchableOpacity onPress={this.LaunchCalendar}>
                    <Text style={styles.calendar}>Add to Calendar</Text>
                  </TouchableOpacity>

                  <Text style={styles.heading}>LOCATION</Text>
                  <Text style={styles.datetext}>
                    {this.state.EventDetail.location}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      this.LaunchMap(this.state.EventDetail.location);
                    }}>
                    <Text style={styles.calendar}>View Map</Text>
                  </TouchableOpacity>
                  <Text style={styles.heading}>ABOUT THIS EVENT</Text>

                  {/* <HTML html={this.state.EventDetail.about}  /> */}
                  {/* <Text
              style={[styles.datetext, {fontSize: responsiveFontSize(1.8)}]}>
              {this.state.EventDetail.about}
            </Text> */}
                  <View
                    style={{
                      marginHorizontal: responsiveWidth(5),
                      marginVertical: responsiveHeight(3),
                      // backgroundColor:'red'
                    }}>
                    <HTMLView
                      value={this.state.EventDetail.about}
                      stylesheet={[
                        styles.datetext,
                        {
                          fontSize: responsiveFontSize(1),
                          marginHorizontal: responsiveWidth(10),
                        },
                      ]}
                    />
                  </View>

                  {/* <Text style={styles.datetext}>
                            Attendees are encouraged to bring as many
                            shoes as they can carry for selling and trading, and to take advantage of the Authentication
                           services offered at our LEGIT Booth.</Text>
                        <Text style={styles.datetext}>
                            Our Sneaker ConVersations stage will be fully programm with panel discussion about everything from 'reselling tips' to 'how to become and influencer’ featuring influencers, creators and business owners.</Text>
                        <Text style={styles.datetext}>
                            Be sure to get your tickets early,stay tuned for more details on our social channels and wear your best kicks!
                         </Text> */}
                  <View style={{ marginBottom: responsiveWidth(3) }}></View>
                </View>
              </ScrollView>

            )}
          </>
        ) : (
          <View style={{ alignItems: 'center', width: '100%', marginTop: '40%' }}>
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
    // width: responsiveWidth(90),
    alignSelf: 'center',
  },
  favtext: {
    fontFamily: 'Lato-Bold',
    fontWeight: 'bold',
    fontSize: responsiveFontSize(1.8),
    marginLeft: responsiveWidth(5),
  },
  eventimage: {
    height: responsiveHeight(23),
    width: responsiveWidth(100),

    // borderRadius: responsiveHeight(2),
    marginTop: responsiveWidth(3),
    // alignSelf:'center',
  },
  detailview: {
    width: responsiveWidth(90),
    alignSelf: 'center',
    backgroundColor: '#fff',
    // height: responsiveHeight(70),
    marginTop: responsiveWidth(5),
    borderWidth: responsiveWidth(0.1),
    borderColor: '#B6BBC8',
    borderRadius: responsiveWidth(2),
    marginBottom: responsiveWidth(5),
  },
  heading: {
    fontFamily: 'Lato-Bold',
    fontSize: responsiveHeight(1.6),
    marginTop: responsiveWidth(3),
    marginLeft: responsiveWidth(5),
  },
  datetext: {
    fontFamily: 'Lato-Regular',
    fontSize: responsiveHeight(1.5),
    marginTop: responsiveWidth(1),
    marginHorizontal: responsiveWidth(5),
  },
  calendar: {
    fontFamily: 'Lato-Bold',
    fontSize: responsiveHeight(1.5),
    marginTop: responsiveWidth(1),
    marginLeft: responsiveWidth(5),
    color: '#D9173B',
  },
});
