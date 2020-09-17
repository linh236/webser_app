import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import Textarea from 'react-native-textarea';
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
        'Cảnh báo',
        'Nội dung không được để trống',
        [
          {
            text: "Ok",
            onPress: () => console.log("Ask me later pressed")
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
          Alert.alert("Phản hồi thành công.")
        }else{
          Alert.alert("Phản hồi thất bại. Xin vui lòng gửi lại.")
        }
      }).catch((err) => console.error(err))
  }
  const showpopup =(id) => {
    let url = URL+`/api/reports/${id}`;
    fetch(url).then((response) => response.json())
      .then((json) => {
          Alert.alert(
            json.data['title'],
            json.data['rep_content'],
           [
             {
               text: "Xóa",
               onPress: () => deletefeedback(json.data['id'])
             },
             {
               text: "Hủy",
               onPress: () => console.log("Cancel Pressed"),
               style: "cancel"
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
          Alert.alert("Xóa thành công.")
        }else{
          Alert.alert("Xóa thất bại.")
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

  return (
   <>
    <Button
      title="Phản hồi thông tin"
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
        <Text style={styles.title}>Tiêu đề</Text>
        <TextInput
          style={styles.inputFeedback}
          onChangeText={text=>setTitle(text)}
        />
      </View>
      <View style={styles.titleFeedback}>
        <Text style={styles.title}>Nội dung</Text>
        <Textarea
          containerStyle={styles.textareaContainer}
          style={styles.textarea}
          maxLength={200}
          placeholder={'Nhập nội dung phản hồi 。。。'}
          placeholderTextColor={'#c7c7c7'}
          underlineColorAndroid={'transparent'}
          onChangeText={text=>setContent(text)}
        />
      </View>
    </View>
    <TouchableOpacity style={styles.ButtonFeedback} onPress={()=>Feedback()}>
      <Text style={styles.IconSend}><Ionicons style={styles.IconSend} name="ios-send"/>Gửi</Text>
    </TouchableOpacity>

    <View style={styles.container_feedback}>
      <View style={styles.contenttitlefeedback}>
        <View style={styles.rowFeedback}>
          <Text style={styles.feedback_text}>Tiêu đề</Text>
        </View>
        <View style={styles.rowFeedback}>
          <Text style={styles.feedback_text}>Nội dung</Text>
        </View>
        <View style={styles.rowFeedback}>
          <Text style={styles.feedback_text}>Phản hồi</Text>
        </View>
      </View>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          keyExtractor={item => item.id.toString()}
          renderItem={({ item,i=0 }) => (
            <>
              <TouchableOpacity onPress={()=> showpopup(item.id)}>
                <View style={styles.contenttitlefeedback}>
                  <View style={styles.rowFeedback}>
                    <Text style={styles.feedback_text}>{item.title}</Text>
                  </View>
                  <View style={styles.rowFeedback}>
                    <Text style={styles.feedback_text}>{item.content}</Text>
                  </View>
                  <View style={styles.rowFeedback}>
                    <Text style={styles.feedback_text}>{item.mark == 1 ? "Rồi" : "Chưa"}</Text>
                  </View>
                </View>
              </TouchableOpacity>
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
    marginLeft: 18,
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
 }
})
export default FeedbackComponent;
