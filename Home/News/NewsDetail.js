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
  Linking,
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
import {Searchbar} from 'react-native-paper';
import moment from 'moment';
export default class NewsDetail extends Component {
  state = {
    // NewsDetail: this.props.navigation.getParam('NewsData'),
    // NewsList: this.props.navigation.getParam('newsdataFullList'),
    // index: this.props.navigation.getParam('index'),
    // UserData: this.props.route.params.User,
    NewsDetail: this.props.route.params.NewsData,
    NewsList: this.props.route.params.newsdataFullList,
    index: this.props.route.params.index,
  };
  render() {
    const {NewsDetail, index, NewsList} = this.state;
    let newContent = '';
    if (NewsDetail.content !== null) {
      console.log(NewsDetail.content);
      newContent = NewsDetail.content.split(' [+');
      console.log(newContent);
    }

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
              source={require('../../../Assets/arrowback.png')}
              style={{
                height: responsiveWidth(5),
                width: responsiveWidth(6),
                marginTop: responsiveWidth(7),
              }}
            />
          </TouchableOpacity>
          <Image
            source={require('../../../Assets/Logo.png')}
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
              source={require('../../../Assets/sneakerlog_profile.png')}
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
        <ScrollView
          style={styles.bottomcontainer}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              flexDirection: 'row',
              width: responsiveWidth(90),
              alignItems: 'center',
              alignSelf: 'center',
              marginTop: responsiveWidth(5),
              justifyContent: 'space-between',
            }}>
            <Text
              onPress={() => this.props.navigation.goBack()}
              style={styles.favtext}>
              NEWS
            </Text>
            <Text
              onPress={() => {
                this.setState({
                  NewsDetail: NewsList[index + 1],
                  index: index + 1,
                });
              }}
              style={[
                styles.favtext,
                {marginRight: responsiveWidth(3), color: '#D9173B'},
              ]}>
              NEXT
            </Text>
          </View>

          <View style={styles.imageContainer}>
            <Image
              source={{uri: this.state.NewsDetail.urlToImage}}
              style={styles.imageStyle}
            />
          </View>

          <View style={styles.detailview}>
            <Text style={styles.heading}>{this.state.NewsDetail.title}</Text>

            {/* <Text style={styles.datetext}>
              {moment(this.state.NewsDetail.publishedAt).fromNow()}
            </Text> */}
            <Text style={[styles.datetext, {marginTop: 0}]}>
              {`${NewsDetail.source && NewsDetail.source.name}  `}
              {moment(this.state.NewsDetail.publishedAt).fromNow()}
            </Text>
            <Text style={styles.contenttext}>{NewsDetail.description}</Text>
            <Text style={styles.contenttext}>
              {newContent.length > 0 ? newContent[0] : NewsDetail.content}
            </Text>
            {/* <Text style={styles.contenttext}>{newContent.length}</Text> */}
            {newContent.length > 0 ? (
              <Text onPress={()=>{
                Linking.openURL(NewsDetail.url)
              }} style={[styles.contenttext, {color: 'red', marginTop: 0, alignSelf: "flex-end"}]}>
                {'read more'}
              </Text>
            ) : null}
            <View style={{marginBottom: responsiveWidth(3)}} />
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
    // marginLeft:responsiveWidth(5)
  },
  eventimage: {
    height: responsiveHeight(30),
    width: responsiveWidth(90),
    borderRadius: responsiveHeight(2),
    marginTop: responsiveWidth(3),
    // alignSelf:'center',
  },
  detailview: {
    width: responsiveWidth(90),
    alignSelf: 'center',
    // flexWrap:"wrap",
    backgroundColor: '#fff',
    // height: responsiveHeight(70),
    marginTop: responsiveWidth(5),
    borderWidth: responsiveWidth(0.2),
    borderColor: '#B6BBC8',
    borderRadius: responsiveWidth(2),
    marginBottom: responsiveWidth(5),
    paddingHorizontal: responsiveWidth(1.6),
    // paddingRight:responsiveWidth(11),
  },
  heading: {
    fontFamily: 'Lato-Bold',

    fontSize: responsiveHeight(2),
    marginTop: responsiveWidth(4),
    marginLeft: responsiveWidth(5),
  },
  datetext: {
    fontFamily: 'Lato-Regular',
    color: '#878787',
    fontSize: responsiveHeight(1.6),
    marginTop: responsiveWidth(2),
    marginBottom: responsiveWidth(2),
    marginLeft: responsiveWidth(5),
  },
  contenttext: {
    fontFamily: 'Lato',
    // color:'#000',
    fontSize: responsiveHeight(1.7),
    marginTop: responsiveWidth(2),
    marginBottom: responsiveWidth(2),
    marginLeft: responsiveWidth(5),
    marginRight: responsiveWidth(3),
  },
  calendar: {
    fontFamily: 'Lato-Bold',
    fontSize: responsiveHeight(1.5),
    marginTop: responsiveWidth(1),
    marginLeft: responsiveWidth(5),
    color: '#D9173B',
  },
  newscontainer: {
    width: responsiveWidth(90),
    alignSelf: 'center',
    height: responsiveHeight(15),
    backgroundColor: '#fff',
    borderRadius: responsiveWidth(3),
    borderWidth: responsiveWidth(0.3),
    marginTop: responsiveWidth(5),
    borderColor: '#B6BBC8',
    flexDirection: 'row',
  },
  newsimage: {
    height: responsiveHeight(14.7),
    width: responsiveWidth(25),
    borderTopLeftRadius: responsiveWidth(2.5),
    borderBottomLeftRadius: responsiveWidth(2.5),
  },
  newstext: {
    fontFamily: 'Lato-Bold',
    fontSize: responsiveFontSize(1.9),
    fontWeight: 'bold',
    width: responsiveWidth(50),
    marginLeft: responsiveWidth(5),
    marginTop: responsiveWidth(3),
    marginBottom: responsiveWidth(1),
  },
  timetext: {
    fontFamily: 'Lato-Regular',
    fontSize: responsiveFontSize(1.8),
    marginHorizontal: responsiveWidth(5),
    color: '#878787',
  },
  imageContainer: {
    height: responsiveHeight(26),
    width: responsiveWidth(100),
    justifyContent: 'center',
    marginTop: responsiveHeight(2),
    marginBottom: responsiveHeight(2),
  },
  imageStyle: {height: '100%', width: '100%'},
});
