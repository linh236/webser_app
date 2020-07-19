import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import {
  Text,
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  NativeModules,
} from 'react-native';
import TimePicker from 'react-native-simple-time-picker';
function LedComponent({ }) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [dt, setDt] = useState(new Date().toLocaleString());
//  console.log(data)
  const [id, setId] = useState();
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
  // setup time
  const SetupTime = () => {
    useEffect(() => {
      let secTimer = setInterval( () => {
        setDt(new Date().toLocaleString())
      },1000)
  
      return () => clearInterval(secTimer);
    }, []);
  }
  return (
    <>
      <ScrollView style={styles.ScrollView}>
        <View style={styles.MainTitle}><Text>BẢNG ĐIỀU KHIỂN</Text></View>
        <View style={styles.container}>
          {isLoading ? <ActivityIndicator /> : (
            <>
              <View style={styles.first}>
                <Text style={styles.Title}>Name</Text>
                <Text style={styles.TitleName}>Den So 1 </Text>
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
                <TouchableOpacity onPress={() => SetupTime()}> 
                  <Text style={styles.TitleTurnon}>{data['LED_STATUS0']['TURNON']}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.TitleTurnon}>{data['LED_STATUS1']['TURNON']}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.TitleTurnon}>{data['LED_STATUS2']['TURNON']}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.TitleTurnon}>{data['LED_STATUS3']['TURNON']}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.TitleTurnon}>{data['LED_STATUS5']['TURNON']}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.TitleTurnon}>{data['LED_STATUS6']['TURNON']}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.TitleTurnon}>{data['LED_STATUS7']['TURNON']}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.TitleTurnon}>{data['LED_STATUS8']['TURNON']}</Text>
                </TouchableOpacity>

              </View>
              <View style={styles.fourth}>
                <Text style={styles.Title}>Timeout</Text>
                <TouchableOpacity>
                  <Text style={styles.TitleTurnoff}>{data['LED_STATUS0']['TURNOFF']}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.TitleTurnoff}>{data['LED_STATUS1']['TURNOFF']}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.TitleTurnoff}>{data['LED_STATUS2']['TURNOFF']}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.TitleTurnoff}>{data['LED_STATUS3']['TURNOFF']}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.TitleTurnoff}>{data['LED_STATUS5']['TURNOFF']}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.TitleTurnoff}>{data['LED_STATUS6']['TURNOFF']}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.TitleTurnoff}>{data['LED_STATUS7']['TURNOFF']}</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styles.TitleTurnoff}>{data['LED_STATUS8']['TURNOFF']}</Text>
                </TouchableOpacity>

              </View>
            </>
          )}
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


