import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  NativeModules,
  TouchableHighlight,
  Alert
} from 'react-native';
import {
  URL,
} from './myconnect'

import TimePicker from 'react-native-simple-time-picker';
import AsyncStorage from '@react-native-community/async-storage';
import TimedSlideshow from 'react-native-timed-slideshow';
const dimensions = Dimensions.get('window');
const setHeight = Math.round(dimensions.width * 9 / 16);
const setWidth = dimensions.width;
function LoginComponent({ navigation }) {
  const items = [
           {
               uri: "http://www.lovethemountains.co.uk/wp-content/uploads/2017/05/New-Outdoor-Sports-and-Music-Festival-For-Wales-4.jpg",
               title: "Michael Malik",
               text: "Minnesota, USA",
               duration: 3000,
           },
           {
               uri: "http://blog.adrenaline-hunter.com/wp-content/uploads/2018/05/bungee-jumping-barcelona-1680x980.jpg",
               title: "Victor Fallon",
               text: "Val di Sole, Italy",
               duration: 3000,
               slideDirection: 'odd'
           },
           {
               uri: "https://greatist.com/sites/default/files/Running_Mountain.jpg",
               title: "Mary Gomes",
               text: "Alps",
               fullWidth: true,
               duration: 3000,
           }
       ];
  const [email, setEmail] = useState([]);
  const [password, setPassword] = useState([]);
  const [data, setData] = useState([]);
  const CheckLogin = (email, password) => {
    if (email == "" || password == "") {
      return false;
    }else{
       let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(email) == false) {
        Alert.alert(
          'Cảnh báo',
          'Email khong dung dinh dang',
          [
            {
              text: "Ok",
              onPress: () => console.log("Ask me later pressed")
            },
          ]
        );
        return false;
      }
    }
    const url = URL + '/api/account';
    fetch(URL+'/api/account', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body:JSON.stringify ({
        email: email,
        password: password
      })
      }).then((response) => response.json())
      .then((data) => {
        if(data['id'] != null){
          if(data['disable'] == 1){
            Alert.alert('Tài khoản đã bị khóa');
            return false;
          }
          Alert.alert('Đăng nhập thành công');
          AsyncStorage.setItem('id', JSON.stringify(data['id']));
          NativeModules.DevSettings.reload();
         // navigation.navigate('Home');
        }else{
          Alert.alert('Đăng nhập thất bại');
        }
      }).catch((err) => console.error(err))
  }
// exists(id) ? 'Home' : 'Login'
   function CheckNavigation () {
   AsyncStorage.getItem('id', (error,value) => {
        if (!error) {
          navigation.navigate('Home');
        }else{
          navigation.navigate('Login');
        }
    });
  }

  // <Image source={require('../images/img2.jpeg')}
  // style = {styles.logo}
  // />
return (
   <>
    <ScrollView>
    <View style={styles.up}>
      <TimedSlideshow
      style={styles.timeslider}
      items={items}
      />
    </View>
    <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
              placeholder="Email"
              keyboardType="email-address"
              underlineColorAndroid='transparent'
              onChangeText={text=>setEmail(text)}/>
        </View>
        <View style={styles.inputContainer}>
          <TextInput style={styles.inputs}
              placeholder="Password"
              secureTextEntry={true}
              underlineColorAndroid='transparent'
              onChangeText={text=>setPassword(text)}/>
        </View>
        <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={()=>CheckLogin(email, password)}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
   </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#DCDCDC',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius:30,
    borderBottomWidth: 1,
    width:250,
    height:45,
    marginBottom:20,
    flexDirection: 'row',
    alignItems:'center',
    marginTop: 10,
  },
  logo: {
    width: setWidth,
    marginBottom: 20,
  },
  inputs:{
    height:45,
    marginLeft:16,
    borderBottomColor: '#FFFFFF',
    flex:1,
  },
  buttonContainer: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    marginTop: 10
  },
  loginButton: {
    backgroundColor: "#00b5ec",
  },
  loginText: {
    color: 'white',
  },
  up: {
    flex: 1,
    flexDirection: 'column',
    height: setHeight*2.5+50,
    marginBottom: 15,
  },

})
export default LoginComponent;
