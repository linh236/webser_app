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
const dimensions = Dimensions.get('window');
const setHeight = Math.round(dimensions.width * 9 / 16);
const setWidth = dimensions.width;
function LoginComponent({ navigation }) {
  const [email, setEmail] = useState([]);
  const [password, setPassword] = useState([]);
  const [data, setData] = useState([]);
  const CheckLogin = (email, password) => {
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

return (
   <>
    <ScrollView>
    <View style={styles.up}>
      <Image source={require('../images/bk.jpeg')}
      style = {styles.logo}
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
  }
})
export default LoginComponent;
