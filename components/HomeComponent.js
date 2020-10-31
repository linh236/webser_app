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
  RefreshControl,
  FlatList,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppIntroSlider from 'react-native-app-intro-slider';
import HTMLView from 'react-native-htmlview';
import {
  URL,
} from './myconnect'

const dimensions = Dimensions.get('window');
const setHeight = Math.round(dimensions.width*9);
const setWidth = dimensions.width;

function HomeComponent({ navigation }) {
   const [id, setId] = useState(null);
   const [isLoading, setLoading] = useState(true);
   const [sliders, setSliders] = useState([]);
   const [regulations, setRegulations] = useState([]);
   const [house, setHouse] = useState('');
   const [showRealApp, setshowRealApp] = useState(false);
   const [refreshing, setRefreshing] = useState(false);

   const appSlider = () => {
     let url = URL + '/api/appSlider';
     fetch(url).then((response) => response.json())
     .then((json) => {
       setSliders(json.slides);
     })
     .catch((error) => {
       console.error(error);
     })
     .finally(() => setLoading(false));
   }
   const getRegulations = (id) => {
     let url = URL + `/api/getRegulations/${id}`;
     fetch(url).then((response) => response.json())
     .then((json) => {
       setRegulations(json.regulations);
       setHouse('The regulations of ' + json.house_name);
     })
     .catch((error) => {
       console.error(error);
     })
     .finally(() => setLoading(false));
   }
   useEffect (() => {
     AsyncStorage.getItem('id', (error,value) => {
      if (value !== null) {
       setId(value);
       getRegulations(value);
     }else{
       appSlider();
     }
    });
  }, [])

  const wait = (timeout) => {
   return new Promise(resolve => {
       setTimeout(resolve, timeout);
     });
   }

  const onRefresh = React.useCallback(() => {
    appSlider()
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
   }, []);

  const _renderItem = ({ item }) => {
    return (
      <View style={[styles.slide, {backgroundColor: item.backgroundColor}]}>
        <Text style={[styles.title, {color: item.textcolor}]}>
          {item.title}
        </Text>
        <Image
          style={styles.image}
          source={{
            uri: URL+item.image.url,
          }}
        />
        <HTMLView
          value={item.text}
          stylesheet={styles}
        />
      </View>
    );
  }

  const _renderRegulation = ({item}) => {
    return (
      <View style={styles.regulations}>
        <Text>{item.title}</Text>
        <HTMLView
          value={item.description}
        />

      </View>
    );
  }

  const _onDone = () => {
    setshowRealApp(true);
    navigation.navigate('Login')
  }

  return (
   <>
   <ScrollView
     refreshControl={
       <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
     }
   >
    { id != null ?
      <>
        <Button
          title= {house}
          onPress={() =>
            navigation.navigate('Home')
          }
        />
        <FlatList
          data={regulations}
          renderItem={_renderRegulation}
          keyExtractor={item => item.id.toString()}
        />
      </>
    :
      <AppIntroSlider
        style={styles.appintroslider}
        renderItem={_renderItem}
        data={sliders}
        onDone={_onDone}
        />
    }
  </ScrollView>
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
  appintroslider: {
    color: "blue",
    flex: 1.3
  },
  image: {
    width: 380,
    height: 540,
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
  regulations: {
    margin: 5,
  }
});
export default HomeComponent;
