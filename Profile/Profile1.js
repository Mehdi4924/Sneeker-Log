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
  StatusBar,
  FlatList,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
export default class profile1 extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLogOut: false,
      image: this.props.route.params.item
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          backgroundColor="transparent"
          barStyle="light-content"
          translucent></StatusBar>
        <View style={styles.header}>
          <Image source={require('../../Assets/Logo.png')}
           style={{ height: responsiveHeight(4),
            width: responsiveWidth(40), resizeMode: 'contain', alignSelf: 'center', marginTop: responsiveWidth(7), }} />

        </View>
        <View
          style={styles.header2}>
          <Text
            style={styles.edit}>
            {/* Change */}
          </Text>
          <Text
            style={styles.profile}>
            PROFILE
          </Text>
          <Text
            onPress={() => this.props.navigation.navigate('EditProfile')}
            style={styles.edit}>
            Edit
          </Text>
        </View>

        <ScrollView style={{ marginHorizontal: responsiveWidth(5) }} showsVerticalScrollIndicator={false}
        >
          <View
            style={styles.imageView}>
            <View
              style={styles.imageContainer}>
              {this.state.image ? (
                <Image
                  source={{ uri: this.state.image }}
                  style={styles.image}
                />
              ) : (
                <Text
                  style={styles.text}>
                  RD
                </Text>
              )}
            </View>
          </View>

          <View style={styles.margin}>
            <Text
              style={styles.field}>
              NAME
            </Text>
            <Text
              style={styles.textValue}>
              Rachel Donaldson
            </Text>
          </View>
          <View style={styles.margin}>
            <Text
              style={styles.field}>
              USERNAME
            </Text>
            <Text
              style={styles.textValue}>
              rdonaldson23
            </Text>
          </View>
          <View style={styles.margin}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={styles.field}>
                EMAIL
              </Text>
              <View
                style={styles.privateContainer}>
                <Text
                  style={styles.private}>
                  Private
                </Text>
              </View>
            </View>
            <Text
              style={styles.textValue}>
              rdonaldson23@gmail.com
            </Text>
          </View>
          <View style={styles.margin}>
            <View style={{ flexDirection: 'row' }}>
              <Text
                style={styles.field}>
                Phone
              </Text>
              <View
                style={styles.privateContainer}>
                <Text
                  style={styles.private}>
                  Private
                </Text>
              </View>
            </View>

            <Text style={styles.textValue}>404-555-2311</Text>
          </View>
          <View style={styles.margin}>
            <Text style={styles.field}>GENDER</Text>
            <Text style={styles.textValue}>Female</Text>
          </View>
          <View style={styles.margin}>
            <Text style={styles.field}>FAVORITE SNEAKER BRANDS</Text>
            <Text style={styles.textValue}>No Brands Selected</Text>
          </View>
          <View style={styles.margin}>
            <Text style={styles.field}>SNEAKER SIZE</Text>
            <Text style={styles.textValue}>No Size Selected</Text>
          </View>
          <View style={{ marginVertical: responsiveHeight(5) }}>
            <View
              style={styles.loginContainer}>
              <Text
                style={styles.login}>
                Log Out
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'Lato-Bold',
    fontWeight: 'normal',
    fontSize: responsiveFontSize(6.1),
    color: '#121212',
  },
  image: {
    height: responsiveHeight(16),
    width: responsiveHeight(16),
    borderRadius: responsiveHeight(16),
    resizeMode: 'contain',
    zIndex: 1,
  },
  imageContainer: {
    height: responsiveHeight(16),
    width: responsiveHeight(16),
    borderRadius: responsiveHeight(16),
    backgroundColor: '#E6E6E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageView: {
    height: responsiveHeight(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
  profile: {
    fontFamily: 'Lato-Bold',
    fontWeight: 'normal',
    fontSize: responsiveFontSize(2.1),
    color: '#121212',
    marginLeft: responsiveWidth(5),
  },
  edit: {
    fontFamily: 'Lato-Bold',
    fontWeight: 'normal',
    fontSize: responsiveFontSize(2.1),
    color: '#D9173B',
  },
  header2: {
    height: responsiveHeight(8),
    // marginHorizontal:responsiveWidth(5),
    justifyContent: 'space-around',
    flexDirection: 'row',
    alignItems: 'center',
  },
  private: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: 'Lato-thin',
    fontWeight: 'normal',
    color: '#FFF',
  },
  loginContainer: {
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
  },
  login: {
    fontFamily: 'Lato-Bold',
    fontWeight: 'normal',
    fontSize: responsiveFontSize(2.2),
    color: '#589BE9',
  },
  container: {
    flex: 1,
    backgroundColor: '#F6F7FB',
  },
  privateContainer: {
    marginLeft: responsiveWidth(2.5),
    height: responsiveHeight(2.5),
    width: responsiveWidth(17),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#362636',
    borderRadius: responsiveHeight(0.5),
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
  textValue: {
    fontFamily: 'Lato-Medium',
    fontWeight: 'normal',
    fontSize: responsiveFontSize(2.2),
    color: '#121212',
  },
  field: {
    fontFamily: 'Lato-Heavy',
    fontWeight: 'normal',
    fontSize: responsiveFontSize(1.5),
    color: '#6c6c6c',
  },
  margin: { marginVertical: responsiveHeight(3) },
});
