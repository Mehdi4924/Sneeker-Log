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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Searchbar} from 'react-native-paper';
import moment from 'moment';
export default class Events extends Component {
  state = {
    searchQuery: '',

    newsdata: [
      {
        news: "Nike Quitly Relaeses Kobe Bryant's Newest Sneaker",
        image: '',
        time: '',
      },
      {
        news: 'Rockets Forward P.J. Tucker To Open Sneakers Store In Houston ',
        image: '',
        time: '',
      },
      {
        news: "Nike Quitly Relaeses Kobe Bryant's Newest Sneaker",
        image: '',
        time: '',
      },
    ],
  };
  _onChangeSearch = (query) => this.setState({searchQuery: query});

  async componentDidMount() {
    let CallBack2 = await fetch(
      'https://newsapi.org/v2/top-headlines?country=us&apiKey=b7c6d9fd85cb4414a74245de95932f2c',
      {
        method: 'get',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then((res) => {
        return res.json();
      })
      .then((response) => {
        console.log('News : ', response);

        this.setState({newsdata: response.articles});

      
      });
  }

  render() {
    const {searchQuery} = this.state;
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
          />  {!this.state.isLoading ? (
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
              marginTop: responsiveWidth(5),
              justifyContent: 'space-between',
            }}>
            <Text style={styles.favtext}>NEWS</Text>
          </View>
          <Searchbar
            onChangeText={this._onChangeSearch}
            value={searchQuery}
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
            }}
          />
          <View style={{marginBottom: responsiveWidth(5)}}>
            <FlatList
              showsScrollIndicator="false"
              data={this.state.newsdata}
              renderItem={({item,index}) => {
                console.log(item.source && item.source.name);
                return (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('NewsDetail', {
                        NewsData: item,index: index,newsdataFullList: this.state.newsdata
                      })
                    }
                    style={styles.newscontainer}>
                    <Image
                      source={{uri: item.urlToImage}}
                      style={styles.newsimage}
                    />
                    <View>
                      <Text numberOfLines={2} style={styles.newstext}>
                        {item.title}
                      </Text>
                      <Text style={styles.timetext}>
                        {`${item.source && item.source.name}  ${moment(
                          item.publishedAt,
                        ).fromNow()}`}
                      </Text>
                    </View>
                    <MaterialIcons
                      name={'keyboard-arrow-right'}
                      size={responsiveWidth(10)}
                      color={'#949494'}
                      style={{
                        alignSelf: 'center',
                        marginLeft: responsiveWidth(-1),
                      }}
                    />
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
  eventimage: {
    height: responsiveHeight(20),
    width: responsiveWidth(90),
    borderRadius: responsiveHeight(2),
    marginTop: responsiveWidth(3),
    // alignSelf:'center',
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
});
