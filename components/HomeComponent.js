import React, {useState, useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Button,
  TouchableOpacity,
  NativeModules,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppIntroSlider from 'react-native-app-intro-slider';

const slides = [
   {
     key: 1,
     title: 'DO DOC LOC',
     text: 'Description.\nSay something cool',
     image: require('../images/img1.jpeg'),
     backgroundColor: '#59b2ab',
   },
   {
     key: 2,
     title: 'TAN KY TAN QUY',
     text: 'Other cool stuff',
     image: require('../images/img2.jpeg'),
     backgroundColor: '#febe29',
   },
   {
     key: 3,
     title: 'QUAN 12',
     text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
     image: require('../images/img3.jpeg'),
     backgroundColor: '#22bcb5',
   }
  ];

function HomeComponent({ navigation }) {
   const [id, setId] = useState([]);
   const [showRealApp, setshowRealApp] = useState(false);
   useEffect (() => {
     AsyncStorage.getItem('id', (error,value) => {
      if (!error) {
       setId(value)
      }
    });
   }, [])

   const _renderItem = ({ item }) => {
    return (
      <View style={[styles.slide, {backgroundColor: item.backgroundColor}]}>
        <Text style={styles.title}>
          {item.title}
        </Text>
        <Image source={item.image}/>
        <Text style={styles.text}>
          {item.text}
        </Text>
      </View>
    );
  }
  const _onDone = () => {
    setshowRealApp(true);
    navigation.navigate('Login')
  }

  return (
   <>
    { id != null ?
      <Button
        title="Nội quy nhà trọ"
        onPress={() =>
          navigation.navigate('Home')
        }
      />
    :
      <AppIntroSlider
        renderItem={_renderItem}
        data={slides}
        onDone={_onDone}
      />
    }
   </>
 );
}
const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  image: {
    width: 320,
    height: 320,
    marginVertical: 32,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    color: 'white',
    textAlign: 'center',
  },
});
export default HomeComponent;
