import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Textarea from 'react-native-textarea';
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
  RefreshControl,
} from 'react-native';
import {
  URL,
} from './myconnect'
import Modal from 'react-native-modal';
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
function FeedbackComponent({navigation}) {
  const [isLoading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [data, setData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [tableHead] = useState(['Order', 'Title','Content', 'Status']);

  useEffect(() => {
    AsyncStorage.getItem('id', (error, value) => {
      if (value !== null) {
        setId(value);
        getFeedback(value);
      }
    });
  }, []);
  const getFeedback =(value) => {
    let url = URL+`/api/showpopup/${value}`;
    fetch(url).then((response) => response.json())
      .then((json) => {
        setData(json.data);
        let arrayDataFeedback = [];
        json.data.map((key,value)=> {
          arrayDataFeedback.push([touchable_popup(key.id,value), touchable_popup(key.id,key.title),  touchable_popup(key.id,key.content),  touchable_popup(key.id,key.mark == 0 ? "No":"Yes")])
        })
        setTableData(arrayDataFeedback);

      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }
  const Feedback = () => {
    const url = URL + '/api/reports';
    if (!title || !content) {
      Alert.alert(
        'Warning',
        'Content or Title is blank',
        [
          {
            text: "Ok",
            onPress: () => console.log("Enter title or content")
          },
        ]
      );
      return false;
    }
    fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body:JSON.stringify ({
        title: title,
        content: content,
        information_id: id
      })
      }).then((response) => response.json())
      .then((data) => {
        if(data['status']){
          getFeedback(id);
          setTitle('');
          setContent('');
          Alert.alert(
            'Notice',
            'Feedback successfully !',
            [
              {
                text: "Ok",
                onPress: () => console.log("successfully")
              },
            ]
          );
        }else{
          Alert.alert(
            'Warning',
            'It is failed. Please send again.',
            [
              {
                text: "Ok",
                onPress: () => console.log("Fail and rent again")
              },
            ]
          );
        }
      }).catch((err) => console.error(err))
  }
  const showpopup =(id) => {
    let url = URL+`/api/reports/${id}`;
    fetch(url).then((response) => response.json())
      .then((json) => {
          Alert.alert(
            json.data['title'],
            json.data['rep_content'] == null ? "The manager has not responded to your message" : json.data['rep_content'],
           [
             {
               text: "Delete",
               onPress: () => deletefeedback(json.data['id'])
             },
             {
               text: "Cancel",
               onPress: () => console.log("Cancel Pressed"),
             },
           ]
          )
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => setLoading(false));
  }

  const deletefeedback =(id) => {
    let url = URL+`/api/reports/${id}`;
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      }).then((response) => response.json())
      .then((data) => {
        if(data['status'] == 200){
          AsyncStorage.getItem('id', (error, value) => {
            if (value !== null) {
              getFeedback(value)
            }
          });
        }else{
          Alert.alert(
            'Warning',
            'Delete failed.',
            [
              {
                text: "Ok",
                onPress: () => console.log("Delete failed")
              },
            ]
          );
        }
      }).catch((err) => console.error(err))
  }
  const onRefresh = React.useCallback(() => {
    AsyncStorage.getItem('id', (error, value) => {
      if (value !== null) {
        getFeedback(value)
      }
    });
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const touchable_popup = (id, title) => {
    return(
      <>
        <TouchableOpacity onPress={()=> showpopup(id)}>
          <View style={styles.contenttitlefeedback}>
            <View style={styles.rowFeedback}>
              <Text style={styles.feedback_text}>{title}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </>
    )
  }
  return (
   <>
    <Button
      title="Feedback information"
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
      <View style={styles.titleFeedback}>
        <Text style={styles.title}>Title</Text>
        <TextInput
          style={styles.inputFeedback}
          value={title}
          onChangeText={text=>setTitle(text)}
        />
      </View>
      <View style={styles.titleFeedback}>
        <Text style={styles.title}>Content</Text>
        <Textarea
          containerStyle={styles.textareaContainer}
          style={styles.textarea}
          maxLength={200}
          value={content}
          placeholder={'Enter content 。。。'}
          placeholderTextColor={'#c7c7c7'}
          underlineColorAndroid={'transparent'}
          onChangeText={text=>setContent(text)}
        />
      </View>
    </View>

    <TouchableOpacity style={styles.ButtonFeedback} onPress={()=>Feedback()}>
      <Text style={styles.IconSend}><Ionicons style={styles.IconSend} name="ios-send"/>Send</Text>
    </TouchableOpacity>
    <View style={styles.container}>
        <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
          <Row data={['Feedback list']} style={styles.head} textStyle={styles.text}/>
          <Row data={tableHead} style={styles.head} textStyle={styles.text}/>
          <Rows data={tableData} textStyle={styles.text}/>
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
    textAlign: 'center',
    marginTop: 20
  },
  titleFeedback: {
    flex: 1,
    flexDirection: 'row',
  },
  title: {
    marginLeft: 10,
    marginTop: 16,
  },
  inputFeedback: {
    width: setWidth-85,
    backgroundColor: '#F5FCFF',
    marginLeft: 32,
    marginBottom: 10,
    padding: 10
  },
  textareaContainer: {
   height: 180,
   padding: 5,
   backgroundColor: '#F5FCFF',
   width: setWidth-85,
   marginLeft: 10,
 },
 textarea: {
   textAlignVertical: 'top',  // hack android
   height: 170,
   fontSize: 14,
   color: '#333',
 },
 IconSend: {
   fontSize: 20
 },
 container_feedback: {
   flex: 1,
   flexDirection: 'column'
 },
 contenttitlefeedback: {
   flex: 1,
   flexDirection: "row",
   justifyContent: 'center',
   textAlign: 'center',
   alignItems: 'center',
 },
 content_feed: {
   flexDirection: 'row'
 },
 rowFeedback: {
   flex: 1,
   // backgroundColor: 'blue',
 },
 feedback_text: {
   textAlign: 'center'
 },
 IconSend: {
   textAlign: 'center',
   fontSize: 23,
   margin: 10,
 },
 ButtonFeedback: {
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
export default FeedbackComponent;
