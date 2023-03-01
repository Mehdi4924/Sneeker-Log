// import firebase from "firebase";
// import firebase from 'react-native-firebase'
import auth from '@react-native-firebase/auth';
import { saveData, saveInitialData, getData, connectFirebase } from "./utility";
// import {AsyncStorage} from "react-native"
// import AsyncStorage from "@react-native-community/async-storage";
import {
  View,
  Text,
  StyleSheet,
  AsyncStorage,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView, NetInfo,
  Alert
} from "react-native";
export async function signUp(email, password, fname, lname, phone, nav) {
  let success = true;
  connectFirebase();
  await auth()
    .createUserWithEmailAndPassword(email, password)
    .then(async (user) => {
      AsyncStorage.setItem("Token", user.user.uid);
      await saveData("Users", user.user.uid, {
        Id: user.user.uid,
        name: fname,
        username: lname,
        phone: phone,
        email: email,
        isLogin: true,
        receivedata: [],
        sentdata: [],
        followersdata: [],
        followingdata: [],
      });
      // alert("Account created!");
      nav.navigate("App");
      // user.user.sendEmailVerification().then(() => {
      //   Alert.alert('Success', 'Email Verification Sent.', [{ text: 'OK', onPress: () => { nav.goBack(); } }]);
      //   // nav.goBack();
      // })


    })
    .catch(function (error) {
      success = false;
      alert(error.code + ": " + error.message,
        [{ text: "OK", onPress: () => { return false } }]);
  
    });
  return success;
}

export async function signIn(email, password, usetType) {
  let success = {};
  await auth()
    .signInWithEmailAndPassword(email, password)
    .then(async (user) => {
      // let profile = await getCurrentUserProfile();

      AsyncStorage.setItem("Token", user.user.uid);
      success.isLogin = true;
      return 1
    })
    .catch(function (error) {
      // success = false;
      success.isLogin = false;
      success.errorType = error.code;

      // alert(error.code + ": " + error.message);
    });

  return success;
}

export async function getCurrentUserId() {
  var user = auth().currentUser;

  if (user != null) {
    return user.uid;
  }
}

// async onLoginFunc() {
//   const { username, password} = this.state;
// if(username == '' || password == ''){
//   alert('Email and password fields cannot be empty')
// }
// else{
//   this.setState({loading: true});
//   let callback = await login(username, password);
//   this.setState({loading: false});

//   console.log(loginData);

//   if (callback) {
//     console.log('callback Received');
//     // let userId = await getCurrentUserId();
//     // await _storeData(GlobalConst.STORAGE_KEYS.userId, userId);
//     // const userId2 = await _retrieveData(GlobalConst.STORAGE_KEYS.userId);
//     this.props.navigation.navigate('App');
//   }
// }

// export async function login(username, password) {
//   fetch("https://examination.offee.in/admin/Controller.php", {
//     method: "POST",
//     headers: {
//       Accept: "application/x-www-form-urlencoded",
//       "Content-Type": "application/x-www-form-urlencoded"
//     },
//     body: JSON.stringify({
//       action: "AUTHENTICATE",
//       user: username,
//       password: password
//     })
//   })
//     .then(response => {
//       response.json();
//     })
//     .then(responseJson => {
//       console.log("Response", responseJson);
//     })
//     .catch(error => {
//       console.error(error);
//     });
