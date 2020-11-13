import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Table, Row, Rows } from 'react-native-table-component';
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
import {
  URL,
} from './myconnect'

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
  const [data1, setData1] = useState([]);
  const [amount, setAmount] = useState([]);
  const [error, setError] = useState('');
  const [tableHeadService] = useState([ 'Order', 'Service','Cost(VND)', 'Amount']);
  const [tableDataService, setTableDataService] = useState([]);
  const [tableHead] = useState([ 'Order', 'Month','Money', 'Status']);
  const [tableData, setTableData] = useState([]);
  const [total, setTotal] = useState(null);
  useEffect(() => {
    AsyncStorage.getItem('id', (error, value) => {
      if (value !== null) {
        fetchUseServices(value)
        fetchPaytheRent(value)
      }
    });
  }, []);
  const fetchUseServices = (value) => {
    let url = URL+`/api/getUseServices/${value}`;
    fetch(url).then((response) => response.json())
      .then((json) => {
        if (json.status == 200) {
          setData(json.data);
          setAmount(json.service_amount);
          let arrayDateTableService = [];
          let arrayDateTableServiceafter = [];
          // json.data.map((key,value) => {
          //   arrayDateTableService.push(key.name, key.cost, json.service_amount[value]);
          //   arrayDateTableServiceafter.push(arrayDateTableService);
          // })
          json.data.map((key,value) => {
            arrayDateTableService.push([value, key.name, currencyFormat(Number(key.cost)), json.service_amount[value]])
          })
          // setTableDataService([]);
          setTableDataService(arrayDateTableService);

        } else {
          setError("You have not registered for the service")
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }
  const fetchPaytheRent = (value) => {
    let url = URL+`/api/getPaytheRent/${value}`;
    fetch(url).then((response) => response.json())
      .then((json) => {
        let arrayDataTable = [];
        json.data.map((key,value) => {
          arrayDataTable.push([value,key.senddate, currencyFormat(key.money), key.status == 1 ? "Yes" : "No"])
        })
        setTableData(arrayDataTable)
        var money = json.data.reduce((result, {money}) => result += money, 0);
        setTotal(currencyFormat(money))

       })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }
  const onRefresh = React.useCallback(() => {
    AsyncStorage.getItem('id', (error, value) => {
      if (value !== null) {
        fetchUseServices(value);
        fetchPaytheRent(value);
      }
    });
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const currencyFormat = (num) => {
     return num.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
  return (
   <>
    <Button
      title="Services and rent monthly"
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
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row data={['Services are using']} style={styles.head} textStyle={styles.text}/>
          <Row data={tableHeadService} style={styles.head} textStyle={styles.text}/>
          <Rows data={tableDataService} textStyle={styles.text}/>
        </Table>
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row data={['Rent Monthly']} style={styles.head} textStyle={styles.text}/>
          <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
          <Rows data={tableData} textStyle={styles.text}/>
          <Row data={['Total',total+' vnd',]} style={styles.head} textStyle={styles.text}/>
        </Table>
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
  },
  rowPaytherent: {
    flex: 1,
    // backgroundColor: 'blue',
  },
  head: {
    height: 40,
    backgroundColor: '#f1f8ff',
    textAlign: 'center'
  },
  text: {
    margin: 6 ,
    textAlign: 'center'
  }

})
export default ServiceComponent;
