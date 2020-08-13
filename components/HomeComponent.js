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
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

function HomeComponent({ navigation }) {
   const [id, setId] = useState([]);
   useEffect (() => {
     AsyncStorage.getItem('id', (error,value) => {
      if (!error) {
       setId(value)
      }
    });
   }, [])

  return (
   <>

   { id != null ?
     <Button
       title="Nội quy nhà trọ"
       onPress={() =>
         navigation.navigate('Paytherent')
       }
     />
   :
     <Button
     title="Giới thiệu chung về nhà trọ"
     />
   }
   </>
 );
}
export default HomeComponent;
