
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Image, StatusBar } from 'react-native';
import Modal, { ModalContent, ModalTitle, ModalButton } from 'react-native-modals';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { KeyboardAvoidingView } from 'react-native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import { connectFirebase, getData } from '../Backend/utility';

export default class ForgotPassword extends Component {
    state = {
        visible: false,
        visible1: false,
        showPass: true,
        emailerror: false,
    passworderror: false,
    loader: false,
    borderColor1: '#362636',
    borderColor2: '#362636',
    PrivacyPolicy: '',
    Terms: '',
    };
    componentDidMount = async () => {
        await connectFirebase();
        let TermsandCondation = [];
        let Privacy = await getData('Policy', '123');
        let Terms = await getData('Terms', '1');
        this.setState({
          PrivacyPolicy: Privacy.privacyPolicy,
          Terms: Terms.termsOfService,
        });
        setTimeout(() => {
          this.setState({isLoading: false});
        }, 2000);
      };
    render() {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="transparent" barStyle="light-content" translucent ></StatusBar>
                <ScrollView >
                    <View style={styles.headerview}>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')} style={styles.headericon}>
                            <AntDesign name={'arrowleft'} size={25} color={'#fff'} />
                        </TouchableOpacity>
                        <View style={{ alignSelf: 'center', width: responsiveWidth(30), marginLeft: responsiveWidth(25), marginTop: responsiveWidth(8.5), }}>
                            <Text style={styles.headertext}>Yesterday</Text>
                            <Text style={styles.headertext1}>7:15 PM</Text>
                        </View>
                    </View>
                    <View style={styles.headerbottom}>
                    <View style={{flexDirection: 'row',}}>

                        <View style={styles.nameview}>
                            <Text style={{ fontSize: responsiveFontSize(2.5), fontFamily: 'Lato-Heavy', color: '#fff' }}>SL</Text>
                        </View>
                        <View style={{ marginTop: responsiveWidth(5) }}>
                            <Text style={styles.nametext}>SneakerLog</Text>
                            <Text style={styles.nametext1}>To: Rachel Donaldson </Text>
                        </View>
                        </View>
                        <Text style={styles.text}>7:15PM</Text>
                    </View>
                    <View style={styles.bottomcontainer}>
                        <Text style={{ fontSize: responsiveFontSize(2.2), fontFamily: 'Lato-Bold', color: '#fff', margin: responsiveWidth(4) }}>Reset your SneakerLog password.</Text>
                    </View>
                    <View style={styles.bottomview}>
                        <View style={styles.bottomcontainer1}>
                            <Image source={require('../../Assets/Logo.png')} style={styles.image} />
                            <FontAwesome5 name={'lock'} size={responsiveWidth(6.5)} color={'#fff'} style={{ marginLeft: responsiveWidth(37) }} />
                        </View>
                        <View style={styles.bottomcontainer2}>
                            <Text style={styles.text1}>We received a request to reset your SneakerLog password.</Text>
                        </View>
                        <Text style={styles.resettext}>To reset your password, click the button below.</Text>
                        <TouchableOpacity style={styles.buttoncontainer}>
                            <Text style={styles.buttontext}>Reset your password</Text>
                        </TouchableOpacity>
                        <Text style={styles.text2}>If you requested a password reset from the SneakerLog App, this button will take you to our website where you can set a new password.</Text>

                        <Text style={styles.text2}>Once completed, you need to return to the SneakerLog App and log in with your new password.</Text>
                        <View style={{ flexDirection: 'row' ,marginTop:responsiveWidth(5), width:responsiveWidth(70),alignSelf:'center'}}>
                            <Text style={{fontSize: responsiveFontSize(1.7),fontFamily: 'Lato-Regular'}}>If you didn't request a new password, please contact 
                            <Text style={{
                                fontSize: responsiveFontSize(1.7),fontFamily: 'Lato-Regular',color:'#D9173B' }}> Customer Support</Text>.</Text>
                        </View>
                        <Text style={[styles.text2,{color:'#90949C'}]}>SneakerLog and the SneakerLog Logo are trademarks, service marks and/or registered trademarks of SneakerLog, LLC. in the United States. All other trademarks, service marks, and product names used herein are the property of their respective owners. SneakerLog, LLC.</Text>
                    </View>


                </ScrollView>


            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F6F7FB'
    },
    headerview:
    {
        //top: responsiveHeight(7),
        flexDirection: 'row',
        width: responsiveWidth(100),
        height: responsiveHeight(12),
        backgroundColor: '#383838'
        //  marginLeft: responsiveWidth(4)
    },
    headericon:
    {
        marginTop: responsiveHeight(6.5),
        marginLeft: responsiveWidth(4)
    },
    headertext:
    {
        alignSelf: 'center',
        fontSize: responsiveFontSize(1.8),
        fontFamily: 'Lato-Bold',
        color: '#fff'
    },
    headertext1:
    {
        alignSelf: 'center',
        fontSize: responsiveFontSize(1.5),
        fontFamily: 'Lato-Regular',
        color: '#fff'
    },
    headerbottom:
    {

        flexDirection: 'row',
        width: responsiveWidth(100),
        height: responsiveHeight(12),
        backgroundColor: '#1E1E1E',
        justifyContent:'space-between'

    },
    nameview:
    {
        height: responsiveHeight(7),
        width: responsiveHeight(7),
        borderRadius: responsiveWidth(7),
        backgroundColor: '#808080',
        alignItems: 'center',
        justifyContent: 'center',
        margin: responsiveWidth(4.5)
    },
    nametext:
    {
        fontSize: responsiveFontSize(2),
        fontFamily: 'Lato-Bold',
        color: '#fff'
    },
    nametext1:
    {
        fontSize: responsiveFontSize(1.8),
        fontFamily: 'Lato-Regular',
        color: '#fff'
    },
    text:
    {
        fontSize: responsiveFontSize(1.8),
        fontFamily: 'Lato-Regular',
        color: '#fff',
        right:responsiveWidth(2),
        marginTop: responsiveWidth(5)
    },
    bottomcontainer:
    {
        width: responsiveWidth(100),
        height: responsiveHeight(8),
        backgroundColor: '#1E1E1E',
        borderTopWidth: responsiveWidth(.3),
        borderColor: '#383838'

    },
    bottomview:
    {
        backgroundColor: '#fff',
        width: responsiveWidth(85),
        alignSelf: 'center',
        marginVertical: responsiveWidth(9),
        borderRadius: responsiveWidth(3)
    },
    bottomcontainer1:
    {
        height: responsiveHeight(11),
        backgroundColor: '#362636',
        width: responsiveWidth(85),
        borderTopLeftRadius: responsiveWidth(3),
        borderTopRightRadius: responsiveWidth(3),
        flexDirection: 'row',
        // justifyContent:"space-around",
        alignItems: 'center'
    },
    image:
    {
        height: responsiveHeight(5),
        width: responsiveWidth(32),
        resizeMode: 'contain',
        marginLeft: responsiveWidth(5)
    },
    bottomcontainer2:
    {
        height: responsiveHeight(10),
        backgroundColor: '#D9173B',
        width: responsiveWidth(85),
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: responsiveWidth(-1)
    },
    text1:
    {
        fontSize: responsiveFontSize(2),
        fontFamily: 'Lato-Bold',
        color: '#fff',
        marginLeft: responsiveWidth(8),
        //marginTop:responsiveWidth(5),
    },
    resettext:
    {
        fontSize: responsiveFontSize(1.7),
        fontFamily: 'Lato-Regular',
        marginHorizontal: responsiveWidth(5),
        marginVertical: responsiveWidth(8)
        //marginTop:responsiveWidth(5),
    },
    buttoncontainer:
    {
        width: responsiveWidth(72),
        backgroundColor: '#D9173B',
        alignSelf: 'center',
        height: responsiveHeight(7),
        borderRadius: responsiveWidth(7.5),
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: responsiveWidth(1)
    },
    buttontext:
    {
        fontSize: responsiveFontSize(1.8),
        fontFamily: 'Lato-Bold',
        color: '#fff'
    },
    text2:
    {
        fontSize: responsiveFontSize(1.7),
        fontFamily: 'Lato-Regular',
        // marginHorizontal:responsiveWidth(5),
        marginTop: responsiveWidth(5),
        width: responsiveWidth(70),
        alignSelf: 'center'

    }


});
