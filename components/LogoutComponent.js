import React from 'react';
import AsyncStorage from '@react-native-community/async-storage';
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

function LogoutComponent({ navigation }) {
   AsyncStorage.removeItem('id');
    alert('Đăng xuất thành công ');
    NativeModules.DevSettings.reload();
  return (
    <View><Text>Logout</Text></View>
  );
}
export default LogoutComponent;
