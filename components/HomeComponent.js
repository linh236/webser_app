import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  TouchableOpacity,
  NativeModules
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { observer } from "mobx-react";
import { decorate, observable, action } from "mobx";
function HomeComponent({ navigation }) {
     const [id, setId] = useState([]);

   useEffect (() => {
     AsyncStorage.getItem('id', (error,value) => {
      if (!error) {
       setId(value)
      }
    });
   }, [])

   function logout () {
    AsyncStorage.removeItem('id');
    alert('Đăng xuất thành công ');
    navigation.navigate('Home');
    NativeModules.DevSettings.reload();

  }
  return (
   <>
    <Button
      title="Go to Jane's profile"
      onPress={() =>
        navigation.navigate('Login')
      }
    />
     <TouchableOpacity onPress={()=>logout()} >
        <Text>LOGOUT</Text>
     </TouchableOpacity>
   </>
 );
}
export default HomeComponent;
