import React, {Component} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Image,
  StatusBar,
  AsyncStorage,
  ActivityIndicator,
  Linking,
  Button,
} from 'react-native';
import {getData} from '../Backend/utility';
import DeepLinking from 'react-native-deep-linking';
export default class AuthLoading extends Component {
  async componentDidMount() {
    // this.props.navigation.navigate('Login');
    // Linking.addEventListener('url', this.handleOpenURL);
    await AsyncStorage.getItem('Token', async (error, data) => {
      if (data) {
        let User = await getData('Users', data);
        await AsyncStorage.setItem('User', JSON.stringify(User));
        this.props.navigation.navigate('App');
      } else {
        this.props.navigation.navigate('Login');
      }
    });
  }

  // componentDidMount() { // B
  //   if (Platform.OS === 'android') {
  //     Linking.getInitialURL().then(url => {
  //       this.navigate(url);
  //     });
  //   } else {
  //       Linking.addEventListener('url', this.handleOpenURL);
  //     }
  //   }
    
    componentWillUnmount() { // C
      Linking.removeEventListener('url', this.handleOpenURL);
    }
    handleOpenURL = (event) => { // D
      this.navigate(event.url);
    }
    navigate = (url) => { // E
      const { navigate } = this.props.navigation;
      const route = url.replace(/.*?:\/\//g, '');
      const id = route.match(/\/([^\/]+)\/?$/)[1];
      const routeName = route.split('/')[0];
      console.log("route",route);
      console.log("id",id);
      console.log("routeName",routeName);
      // if (routeName === 'Collection') {
      //   navigate('UserCollectionDetails', { id, name: 'chris' })
      // };
    }
  
 

  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor={'transparent'}
        />
        <View style={styles.container}>
          <Image
            source={require('../../Assets/Splash.png')}
            style={{flex: 1, resizeMode: 'contain'}}
          />
          {/* <Button
            onPress={() => Linking.openURL('peopleapp://Collection/8787878')}
            title="Open example://test"
          />
          <Button
            onPress={() => Linking.openURL('peopleapp://Collection/8787878')}
            title="Open example://test/23"
          />
          <Button
            onPress={() => Linking.openURL('peopleapp://Collection/8787878')}
            title="Open example://test/100/details"
          /> */}
          {/* <ActivityIndicator size='large' color="white" /> */}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#362636',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
