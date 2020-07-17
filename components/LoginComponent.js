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
  NativeModules
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
const dimensions = Dimensions.get('window');
const setHeight = Math.round(dimensions.width * 9 / 16);
const setWidth = dimensions.width;
function LoginComponent({ navigation }) {
  const [email, setEmail] = useState([]);
  const [password, setPassword] = useState([]);
  const [data, setData] = useState([]);
  const CheckLogin = (email, password) => {
    fetch('https://linhser.herokuapp.com/api/account', {
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
          alert('Login success');
          AsyncStorage.setItem('id', JSON.stringify(data['id']));
          NativeModules.DevSettings.reload();
         // navigation.navigate('Home');
        }else{
          alert('Login failed');
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
    <View style={styles.container}>
      <View style={styles.up}>
         <Image source={require('../images/bk.jpeg')}
          style = {styles.logo}
          />
      </View>
      <View style={styles.down}>
        <TextInput
          placeholder="Nhap email"
          textContentType = 'emailAddress'
          keyboardType = 'email-address'
          onChangeText={text=>setEmail(text)}
          style={styles.TextInput}
        />
        <TextInput 
          style={styles.textInput}
          placeholder = 'Nhap password'
          secureTextEntry={true}
          onChangeText={text=>setPassword(text)}
        />
      <TouchableOpacity style={styles.loginButton} onPress={()=>CheckLogin(email, password)} >
        <Text style = {styles.loginButtonTitle}>LOGIN</Text>
      </TouchableOpacity>
      </View>
    </View>
    </ScrollView>
   </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  up: {
    flex: 4,
    backgroundColor: 'yellow'
  },
  logo: {
    width: setWidth
  },
  down: {
    flex: 6,
    backgroundColor: 'blue'
  }

})
export default LoginComponent;
                                                                                                        
                                   
