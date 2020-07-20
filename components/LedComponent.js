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
  RefreshControl
} from 'react-native';
import TimePicker from 'react-native-simple-time-picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
moment.locale("vn");
function LedComponent({ }) {
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState([]);
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('datetime');
  const [show, setShow] = useState(false);
  const [id, setId] = useState();
  const [savedate, setSavedate] = useState();
  const [time, setTime] = useState();
  const [customtime, setCustomtime] = useState(0);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [chosenDatetime, setChosenDatetime ]= useState('');
  const [name, setName] = useState('');
  const [column, setColumn] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('id', (error, value) => {
      if (value !== null) {
        setId(value)
        fetchLeds(value)
      }
    });
  }, []);
  const fetchLeds = (value) => {
    let url = `https://linhser.herokuapp.com/api/led_status/${value}`;
    console.log(url);
    fetch(url).then((response) => response.json())
      .then((json) => {
        setData(json.leds);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }
  // Send data to api
  const SendDataApi = (name, column, status) => {
    let SetStatus = '';
    if (status == "OFF") {
      SetStatus = "ON";
    } else {
      SetStatus = "OFF";
    }
    let url_send_data = `https://linhser.herokuapp.com/api/app_send/${id}`;
    fetch(url_send_data, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        column: column,
        status: SetStatus

      })
    }).then((response) => response.json())
      .then((data) => {
        // NativeModules.DevSettings.reload();
        alert("Thanh cong");
        fetchLeds(id);
      }).catch((err) => console.error(err))
  }
  const SendDataApiTimer = (name, column, status) => {
    // status the same timer
    let url_send_data = `https://linhser.herokuapp.com/api/app_send/${id}`;
    fetch(url_send_data, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        column: column,
        status: status

      })
    }).then((response) => response.json())
      .then((data) => {
        // NativeModules.DevSettings.reload();
        alert("Thanh cong");
        fetchLeds(id);
      }).catch((err) => console.error(err))
  }
  // setup time
    const showDatePicker = (name, column) => {
     setDatePickerVisibility(true);
     setName(name)
     setColumn(column)
   };

   const hideDatePicker = () => {
     setDatePickerVisibility(false);
   };

   const handleConfirm = (datetime) => {
     setDatePickerVisibility(false);
     const timer = moment(datetime).format('Y-MM-DD HH:ss')
     SendDataApiTimer(name, column, timer)
   };

   const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
      });
    }
   const onRefresh = React.useCallback(() => {
      setRefreshing(true);
      fetchLeds(id);
      wait(2000).then(() => setRefreshing(false));
    }, []);

  return (
    <>
      <ScrollView style={styles.ScrollView}
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.MainTitle}><Text>BẢNG ĐIỀU KHIỂN</Text></View>
        <View style={styles.container}>

          {isLoading ? <ActivityIndicator /> : (
            <>
              <View style={styles.first}>
                <Text style={styles.Title}>Name</Text>
                <Text style={styles.TitleName}>Den So 1</Text>
                <Text style={styles.TitleName}>Den So 2 </Text>
                <Text style={styles.TitleName}>Den So 3 </Text>
                <Text style={styles.TitleName}>Den So 4 </Text>
                <Text style={styles.TitleName}>Den So 5 </Text>
                <Text style={styles.TitleName}>Den So 6 </Text>
                <Text style={styles.TitleName}>Den So 7 </Text>
                <Text style={styles.TitleName}>Den So 8 </Text>

              </View>
              <View style={styles.second}>
                <Text style={styles.Title}>Status</Text>
                <TouchableOpacity onPress={() => SendDataApi("LED_STATUS0", "STATUS", data['LED_STATUS0']['STATUS'])}>
                  <Text style={styles.TitleStatus}>{data['LED_STATUS0']['STATUS']}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => SendDataApi("LED_STATUS1", "STATUS", data['LED_STATUS1']['STATUS'])}>
                  <Text style={styles.TitleStatus}>{data['LED_STATUS1']['STATUS']}</Text>
                </TouchableOpacity >
                <TouchableOpacity onPress={() => SendDataApi("LED_STATUS2", "STATUS", data['LED_STATUS2']['STATUS'])}>
                  <Text style={styles.TitleStatus}>{data['LED_STATUS2']['STATUS']}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => SendDataApi("LED_STATUS3", "STATUS", data['LED_STATUS3']['STATUS'])}>
                  <Text style={styles.TitleStatus}>{data['LED_STATUS3']['STATUS']}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => SendDataApi("LED_STATUS5", "STATUS", data['LED_STATUS5']['STATUS'])}>
                  <Text style={styles.TitleStatus}>{data['LED_STATUS5']['STATUS']}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => SendDataApi("LED_STATUS6", "STATUS", data['LED_STATUS6']['STATUS'])}>
                  <Text style={styles.TitleStatus}>{data['LED_STATUS6']['STATUS']}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => SendDataApi("LED_STATUS7", "STATUS", data['LED_STATUS7']['STATUS'])}>
                  <Text style={styles.TitleStatus}>{data['LED_STATUS7']['STATUS']}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => SendDataApi("LED_STATUS8", "STATUS", data['LED_STATUS8']['STATUS'])}>
                  <Text style={styles.TitleStatus}>{data['LED_STATUS8']['STATUS']}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.third}>
                <Text style={styles.Title}>Timer</Text>
                <TouchableOpacity onPress={() => showDatePicker('LED_STATUS0', 'TURNON')}>
                  <Text style={styles.TitleTurnon}>{data['LED_STATUS0']['TURNON']}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showDatePicker('LED_STATUS1', 'TURNON')}>
                  <Text style={styles.TitleTurnon}>{data['LED_STATUS1']['TURNON']}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showDatePicker('LED_STATUS2', 'TURNON')}>
                  <Text style={styles.TitleTurnon}>{data['LED_STATUS2']['TURNON']}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showDatePicker('LED_STATUS3', 'TURNON')}>
                  <Text style={styles.TitleTurnon}>{data['LED_STATUS3']['TURNON']}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showDatePicker('LED_STATUS5', 'TURNON')}>
                  <Text style={styles.TitleTurnon}>{data['LED_STATUS5']['TURNON']}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showDatePicker('LED_STATUS6', 'TURNON')}>
                  <Text style={styles.TitleTurnon}>{data['LED_STATUS6']['TURNON']}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showDatePicker('LED_STATUS7', 'TURNON')}>
                  <Text style={styles.TitleTurnon}>{data['LED_STATUS7']['TURNON']}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showDatePicker('LED_STATUS8', 'TURNON')}>
                  <Text style={styles.TitleTurnon}>{data['LED_STATUS8']['TURNON']}</Text>
                </TouchableOpacity>

              </View>
              <View style={styles.fourth}>
                <Text style={styles.Title}>Timeout</Text>
                <TouchableOpacity onPress={() => showDatePicker('LED_STATUS0', 'TURNOFF')}>
                  <Text style={styles.TitleTurnoff}>{data['LED_STATUS0']['TURNOFF']}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showDatePicker('LED_STATUS1', 'TURNOFF')}>
                  <Text style={styles.TitleTurnoff}>{data['LED_STATUS1']['TURNOFF']}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showDatePicker('LED_STATUS2', 'TURNOFF')}>
                  <Text style={styles.TitleTurnoff}>{data['LED_STATUS2']['TURNOFF']}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showDatePicker('LED_STATUS3', 'TURNOFF')}>
                  <Text style={styles.TitleTurnoff}>{data['LED_STATUS3']['TURNOFF']}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showDatePicker('LED_STATUS5', 'TURNOFF')}>
                  <Text style={styles.TitleTurnoff}>{data['LED_STATUS5']['TURNOFF']}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showDatePicker('LED_STATUS6', 'TURNOFF')}>
                  <Text style={styles.TitleTurnoff}>{data['LED_STATUS6']['TURNOFF']}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showDatePicker('LED_STATUS7', 'TURNOFF')}>
                  <Text style={styles.TitleTurnoff}>{data['LED_STATUS7']['TURNOFF']}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => showDatePicker('LED_STATUS8', 'TURNOFF')}>
                  <Text style={styles.TitleTurnoff}>{data['LED_STATUS8']['TURNOFF']}</Text>
                </TouchableOpacity>

              </View>
            </>
          )}
          <DateTimePickerModal
           isVisible={isDatePickerVisible}
           mode= {mode}
           onConfirm={handleConfirm}
           onCancel={hideDatePicker}
         />
        </View>
      </ScrollView>
    </>
  );
}
export default LedComponent;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ScrollViwe: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  first: {
    flex: .6,
    backgroundColor: '#2196F3',
    marginRight: 1,
    marginLeft: 1
  },
  second: {
    flex: .5,
    backgroundColor: '#2154F3',
    marginRight: 1,
  },
  third: {
    flex: 1,
    backgroundColor: '#2196F3',
    marginRight: 1
  },
  fourth: {
    flex: 1,
    backgroundColor: '#2154F3',
    marginRight: 1

  },
  MainTitle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'yellow',
    alignItems: 'center',
    fontSize: 23,
    padding: 10,
    fontWeight: 'bold'
  },
  Title: {
    textAlign: 'center',
    marginTop: 10,
  },
  TitleName: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  TitleStatus: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  TitleTurnon: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  TitleTurnoff: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,

  },

});
