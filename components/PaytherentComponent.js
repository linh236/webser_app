import React, { useState, useEffect } from 'react';
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
  NativeModules,
  TouchableHighlight,
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
const dimensions = Dimensions.get('window');
const setHeight = Math.round(dimensions.width * 9 / 16);
const setWidth = dimensions.width;
const wait = (timeout) => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
function PaytherentComponent({navigation}) {
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = useState([]);
  const [amount, setAmount] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    AsyncStorage.getItem('id', (error, value) => {
      if (value !== null) {
        fetchPaytheRent(value)
      }
    });
  }, []);
  const fetchPaytheRent = (value) => {
    let url = `https://linhser.herokuapp.com/api/getPaytheRent/${value}`;
    fetch(url).then((response) => response.json())
      .then((json) => {
        setData(json.data);
       })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }
  const onRefresh = React.useCallback(() => {
    AsyncStorage.getItem('id', (error, value) => {
      if (value !== null) {
        fetchPaytheRent(value)
      }
    });
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  return (
   <>
    <Button
      title="Tiền trọ hàng tháng"
      onPress={() =>
        navigation.navigate('Service')
      }
    />
    <ScrollView
      contentContainerStyle={styles.scrollView}
      refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
     }
    >
    <View style={styles.container}>
      <View style={styles.contenttitle}>
        <View style={styles.rowPaytherent}>
          <Text style={styles.service_column}>Tháng</Text>
        </View>
        <View style={styles.rowPaytherent}>
          <Text style={styles.service_column}>Thời gian đóng</Text>
        </View>
        <View style={styles.rowPaytherent}>
          <Text style={styles.service_column}>Tình trạng</Text>
        </View>
      </View>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item }) => (
            <>
              <View style={styles.content}>
                <View style={styles.rowPaytherent}>
                  <Text style={styles.service_column}>{item.senddate}</Text>
                </View>
                <View style={styles.rowPaytherent}>
                  <Text style={styles.service_column}>{item.receivedate}</Text>
                </View>
                <View style={styles.rowPaytherent}>
                  <Text style={styles.service_column}>{item.status == 1 ? 'đã' : 'chưa'}</Text>
                </View>
              </View>
            </>
          )}
        />
      )}
    </View>
    </ScrollView>
   </>
 );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  contenttitle: {
    flexDirection: 'row',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  rowPaytherent: {
    flex: 1,
    // backgroundColor: 'blue',
  },
  service_column: {
    textAlign: 'center',
    fontSize: 18
  }

})
export default PaytherentComponent;
