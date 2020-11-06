import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { Table, Row, Rows } from 'react-native-table-component';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  statusBar,
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
import {
  URL,
} from './myconnect'
import Voice from '@react-native-community/voice';
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
  const [tableHead] = useState(['Name', 'Status','Timer', 'Timeout']);
  const [tableData, setTableData] = useState([]);


  useEffect(() => {
    AsyncStorage.getItem('id', (error, value) => {
      if (value !== null) {
        setId(value)
        fetchLeds(value)
      }
    });
  }, []);
  const fetchLeds = (value) => {
    let url = URL+`/api/led_status/${value}`;
    fetch(url).then((response) => response.json())
      .then((json) => {
        setTableData([
          [' Light 1', touchable_turn_on_off(value,'led_status0','status',json.leds.led_status0.status), touchable_settimer('led_status0','turnon',json.leds.led_status0.turnon), touchable_settimer('led_status0','turnoff',json.leds.led_status0.turnoff) ],
          [' Light 2', touchable_turn_on_off(value,'led_status1','status',json.leds.led_status1.status), touchable_settimer('led_status1','turnon',json.leds.led_status1.turnon), touchable_settimer('led_status1','turnoff',json.leds.led_status1.turnoff) ],
          [' Light 3', touchable_turn_on_off(value,'led_status2','status',json.leds.led_status2.status), touchable_settimer('led_status2','turnon',json.leds.led_status2.turnon), touchable_settimer('led_status2','turnoff',json.leds.led_status2.turnoff) ],
          [' Light 4', touchable_turn_on_off(value,'led_status3','status',json.leds.led_status3.status), touchable_settimer('led_status3','turnon',json.leds.led_status3.turnon), touchable_settimer('led_status3','turnoff',json.leds.led_status3.turnoff) ],
          [' Fan', touchable_turn_on_off(value,'led_status5','status',json.leds.led_status5.status), touchable_settimer('led_status5','turnon',json.leds.led_status5.turnon), touchable_settimer('led_status5','turnoff',json.leds.led_status5.turnoff) ],
          [' Power socket 1', touchable_turn_on_off(value,'led_status6','status',json.leds.led_status6.status), touchable_settimer('led_status6','turnon',json.leds.led_status6.turnon), touchable_settimer('led_status6','turnoff',json.leds.led_status6.turnoff) ],
          [' Power socket 2', touchable_turn_on_off(value,'led_status7','status',json.leds.led_status7.status), touchable_settimer('led_status7','turnon',json.leds.led_status7.turnon), touchable_settimer('led_status7','turnoff',json.leds.led_status7.turnoff) ],
          [' Power socket 3', touchable_turn_on_off(value,'led_status8','status',json.leds.led_status8.status), touchable_settimer('led_status8','turnon',json.leds.led_status8.turnon), touchable_settimer('led_status8','turnoff',json.leds.led_status8.turnoff) ],
        ])
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }
  // Send data to api
  const SendDataApi = (id,name, column, status) => {
    let Setstatus = '';
    if (status == "off") {
      Setstatus = "on";
    } else {
      Setstatus = "off";
    }
    let url_send_data = URL+`/api/app_send/${id}`;
    fetch(url_send_data, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        column: column,
        status: Setstatus

      })
    }).then((response) => response.json())
      .then((data) => {
        // NativeModules.DevSettings.reload();
        if (status === 'on') {
          Alert.alert(
            'Notice',
            'Turn off is successfully',
            [
              {
                text: "Ok",
                onPress: () => console.log("turn off")
              },
            ]
          );
        } else {
          Alert.alert(
            'Notice',
            'Turn on is successfully',
            [
              {
                text: "Ok",
                onPress: () => console.log("turn on")
              },
            ]
          );
        }
        fetchLeds(id);
      }).catch((err) => console.error(err))
  }
  const SendDataApiTimer = (name, column, status) => {
    // status the same timer
    let url_send_data = URL+`/api/app_send/${id}`;
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
        Alert.alert(
          'Notice',
          'Setup timmer is successfully',
          [
            {
              text: "Ok",
              onPress: () => console.log("Setup is successfully")
            },
          ]
        );
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
     const timer = moment(datetime).format('Y-MM-DD HH:mm')
     SendDataApiTimer(name, column, timer)
   };

   const wait = (timeout) => {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
      });
    }
   const onRefresh = React.useCallback(() => {
     AsyncStorage.getItem('id', (error, value) => {
       if (value !== null) {
         setId(value)
         fetchLeds(value)
       }
     });
     // fetchLeds(id);
     setRefreshing(true);
     wait(2000).then(() => setRefreshing(false));
    }, []);

  const touchable_turn_on_off = (id,name,column,status)=> {
    return(
      <TouchableOpacity onPress={() => SendDataApi(id,name,column,status)}>
        <Text style={styles.Titlestatus}>{status}</Text>
      </TouchableOpacity>
    )
  }

  const touchable_settimer = (name, column,status) => {
    // name: led_status0
    // column: 'turnon'
    // status: value turnon or turnoff
    return(
      <TouchableOpacity onPress={() => showDatePicker(name, column)}>
        <Text style={styles.TitleTurnoff}>{status}</Text>
      </TouchableOpacity>
    )
  }
  return (
    <>
      <ScrollView style={styles.ScrollView}
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.MainTitle}><Text>DASHBOARD</Text></View>
        <View style={styles.container}>

          {isLoading ? <ActivityIndicator /> : (
            <>
              <View style={styles.container}>
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                  <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
                  <Rows data={tableData} textStyle={styles.text}/>
                </Table>
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
  Titlestatus: {
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
  container: {
    flex: 1,
    padding: 2,
    backgroundColor: '#fff'
  },
 head: {
   height: 40,
   backgroundColor: '#f1f8ff'
 },
 text: {
   margin: 6 ,
   textAlign: 'center'
 }

});
