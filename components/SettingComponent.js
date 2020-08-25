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
function SettingComponent() {
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [data, setData] = useState([]);
  const [id, setId] = useState();
  const [birth, setBirth] = useState();
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [name, setName] = useState();
  const [indentify, setIndentify] = useState();
  const [daterange, setDaterange] = useState();
  const [placerange, setPlacerange] = useState();
  const [phone1, setPhone1] = useState();
  const [phone2, setPhone2] = useState();
  const [permanent, setPermanent] = useState();
  const [deposit, setDeposit] = useState();
  const [note, setNote] = useState();
  const [start, setStart] = useState();
  useEffect(() => {
    AsyncStorage.getItem('id', (error, value) => {
      if (value !== null) {
        setId(value)
        getInfo(value)
      }
    });
  }, []);
  const getInfo = (value) => {
    let url = URL+`/api/getinfo/${value}`;
    fetch(url).then((response) => response.json())
      .then((json) => {
        setData(json.data);
        setBirth(json.data['birth']);
        setName(json.data['name']);
        setIndentify(json.data['indentifycard']);
        setDaterange(json.data['daterange']);
        setPlacerange(json.data['placerange']);
        setPhone1(json.data['phone1']);
        setPhone2(json.data['phone2']);
        setPermanent(json.data['permanent']);
        setDeposit(json.data['deposit']);
        setNote(json.data['note']);
        setStart(json.data['start']);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }

  const onChange = (event, selectedDate) => {
   const currentDate = selectedDate || date;
   setShow(Platform.OS === 'ios');
   setDate(currentDate);
   let format = moment(currentDate).format("YYYY-MM-DD");
   setBirth(format);
 };

  const showMode = currentMode => {
    setShow(true);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showTimepicker = () => {
    showMode('time');
  };

  const CheckUpdate = () => {
    let url = URL+`/api/updateInfo/${id}`;
    console.log();
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body:JSON.stringify ({
        name: name,
        birth: birth,
        indentifycard: indentify,
        daterange: daterange,
        placerange: placerange,
        phone1: phone1,
        phone2: phone2,
        permanent: permanent,
        note: note,
      })
      }).then((response) => response.json())
      .then((data) => {
        if (data['status']== '200') {
          Alert.alert('Cập nhật thành công');
        } else {
          Alert.alert('Cập nhật thất bại');

        }
      }).catch((err) => console.error(err))
  }
  const onRefresh = React.useCallback(() => {
    AsyncStorage.getItem('id', (error, value) => {
      if (value !== null) {
        getInfo(value)
      }
    });
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);
    return (
    <>
    {isLoading ? <ActivityIndicator /> : (
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
       }
      >
      <Button
      title="Cập nhận thông tin cá nhân"
      />
      <View style={styles.container}>
          <Text>Email <Text style={styles.warning}>(*)</Text></Text>
          <View style={styles.inputContainer} pointerEvents="none">
            <TextInput style={styles.inputs}
                placeholder="Email"
                keyboardType="email-address"
                underlineColorAndroid='transparent'
                value={data['email']}
                onChangeText={text=>setEmail(text)}/>
            <Ionicons style={styles.iconInfo}
            name="ios-mail"
            >
            </Ionicons>
          </View>
          <Text>Họ và tên</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
                placeholder="Name"
                underlineColorAndroid='transparent'
                value={name}
                onChangeText={text=>setName(text)}/>
            <FontAwesome style={styles.iconInfo}
            name="user"
            >
            </FontAwesome>
          </View>
          <Text>CMND</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
                placeholder="indentify"
                keyboardType="numeric"
                underlineColorAndroid='transparent'
                value={indentify}
                onChangeText={text=>setIndentify(text)}/>
            <Ionicons style={styles.iconInfo}
            name="ios-card"
            >
            </Ionicons>
          </View>
          <Text>Ngày cấp <Text style={styles.warning}>(*)</Text></Text>
          <View style={styles.inputContainer} pointerEvents="none">
          <TextInput style={styles.inputs}
              placeholder="Ngày cấp CMND"
              underlineColorAndroid='transparent'
              value={daterange}
              onPress={showDatepicker}
              onChangeText={text=>setDaterange(text)}
          />
          <Ionicons style={styles.iconInfo}
          name="ios-calendar"
          pointerEvents="button"
          onPress={showDatepicker}
          >
          </Ionicons>
          </View>
          <Text>Nơi cấp <Text style={styles.warning}>(*)</Text></Text>
          <View style={styles.inputContainer} pointerEvents="none">
            <TextInput style={styles.inputs}
                placeholder="Nơi cấp CMND"
                underlineColorAndroid='transparent'
                value={placerange}
                onChangeText={text=>setPlacerange(text)}/>
            <Ionicons style={styles.iconInfo}
            name="ios-people"
            >
            </Ionicons>
          </View>
          <Text>Ngày sinh</Text>
          <TouchableOpacity onPress={showDatepicker} style={styles.datetime}>
            <View style={styles.inputContainer} pointerEvents="none">
            <TextInput style={styles.inputs}
                placeholder="Birth"
                underlineColorAndroid='transparent'
                value={birth}
                onChangeText={text=>setBirth(text)}
            />
            <Ionicons style={styles.iconInfo}
            name="ios-calendar"
            pointerEvents="button"
            onPress={showDatepicker}
            >
            </Ionicons>
            </View>
          </TouchableOpacity>
          <Text>Số điện thoại 1</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
                placeholder="Số điện thoại 1"
                underlineColorAndroid='transparent'
                keyboardType="numeric"
                value={phone1}
                onChangeText={text=>setPhone1(text)}/>
            <FontAwesome style={styles.iconInfo}
            name="phone"
            >
            </FontAwesome>
          </View>
          <Text>Số điện thoại 2</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
                placeholder="Số điện thoại 2"
                keyboardType="numeric"
                underlineColorAndroid='transparent'
                value={phone2}
                onChangeText={text=>setPhone2(text)}/>
            <FontAwesome style={styles.iconInfo}
            name="phone"
            >
            </FontAwesome>
          </View>
          <Text>Quê quán <Text style={styles.warning}>(*)</Text></Text>
          <View style={styles.inputContainer} pointerEvents="none">
            <TextInput style={styles.inputs}
                placeholder="Quê quán"
                underlineColorAndroid='transparent'
                value={permanent}
                onChangeText={text=>setPermanent(text)}/>
            <FontAwesome style={styles.iconInfo}
            name="home"
            >
            </FontAwesome>
          </View>
          <Text>Ghi chú</Text>
          <View style={styles.inputContainer}>
            <TextInput style={styles.inputs}
                placeholder="Ghi chú"
                underlineColorAndroid='transparent'
                value={note}
                onChangeText={text=>setNote(text)}/>
            <Ionicons style={styles.iconInfo}
            name="ios-cash"
            >
            </Ionicons>
          </View>
          <Text>Ngày bắt đầu <Text style={styles.warning}>(*)</Text></Text>
          <View style={styles.inputContainer} pointerEvents="none">
            <TextInput style={styles.inputs}
                placeholder="Bắt đầu thuê"
                keyboardType="numeric"
                underlineColorAndroid='transparent'
                value={start}
            />
            <Ionicons style={styles.iconInfo}
            name="ios-home"
            >
            </Ionicons>
          </View>
          <Text style={styles.note_warning}>Chú ý: Trường hợp (*) nếu sai liên hệ với quản lý để cập nhật lại thông tin.</Text>
          <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]} onPress={()=>CheckUpdate()}>
            <Text style={styles.loginText}>Lưu</Text>
          </TouchableOpacity>
        </View>
        <View>
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </View>
      </ScrollView>
    )}
    </>
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: '#DCDCDC',
    },
    inputContainer: {
      borderBottomColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
      borderRadius:30,
      borderBottomWidth: 1,
      marginLeft:10,
      marginRight:10,
      marginBottom:10,
      flexDirection: 'row',
      alignItems:'center',
      marginTop: 10,
    },
    inputs:{
      height:45,
      marginLeft:16,
      borderBottomColor: '#FFFFFF',
      flex:1,
    },
    buttonContainer: {
      height:45,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom:20,
      width:340,
      marginLeft:10,
      marginRight:10,
      borderRadius:30,
      marginTop: 10
    },
    loginButton: {
      backgroundColor: "#00b5ec",
    },
    loginText: {
      color: 'white',
    },
    iconInfo: {
     marginRight: 10
   },
   titleInfo: {
     width: setWidth,
   },
   titleEmail: {
     justifyContent: 'flex-start',
     alignItems: 'flex-start',
   },
   datetime:{
     width: setWidth
   },
   warning: {
     color: 'red',
   },
   note_warning: {
     color: 'red',
     fontSize: 12,
     marginLeft: 10,
     marginRight: 10,
   }
  })
export default SettingComponent;
