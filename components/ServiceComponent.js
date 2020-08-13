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
function ServiceComponent({navigation}) {
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = useState([]);
  const [amount, setAmount] = useState([]);
  const [error, setError] = useState('');
  useEffect(() => {
    AsyncStorage.getItem('id', (error, value) => {
      if (value !== null) {
        fetchUseServices(value)
      }
    });
  }, []);
  const fetchUseServices = (value) => {
    let url = `https://linhser.herokuapp.com/api/getUseServices/${value}`;
    fetch(url).then((response) => response.json())
      .then((json) => {
        if (json.status == 200) {
          setData(json.data);
          setAmount(json.service_amount);
        } else {
          setError("Bạn chưa đăng ký dịch vụ")
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }
  const onRefresh = React.useCallback(() => {
    AsyncStorage.getItem('id', (error, value) => {
      if (value !== null) {
        fetchUseServices(value)
      }
    });
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
  return (
   <>
    <Button
      title="Dịch vụ đang sử dụng"
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
        <View style={styles.rowServer}>
          <Text style={styles.service_column}>Tên dịch vụ</Text>
        </View>
        <View style={styles.rowServer}>
          <Text style={styles.service_column}>Giá (VNĐ)</Text>
        </View>
        <View style={styles.rowServer}>
          <Text style={styles.service_column}>Số lượng</Text>
        </View>
      </View>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item,i=0 }) => (
            <>
              <View style={styles.content}>
                <View style={styles.rowServer}>
                  <Text style={styles.service_column}>{item.name}</Text>
                </View>
                <View style={styles.rowServer}>
                  <Text style={styles.service_column}>{item.cost}</Text>
                </View>
                <View style={styles.rowServer}>
                  <Text style={styles.service_column}>{amount[i++]}</Text>
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
  rowServer: {
    flex: 1,
    // backgroundColor: 'blue',
  },
  service_column: {
    textAlign: 'center',
    fontSize: 18
  }

})
export default ServiceComponent;
