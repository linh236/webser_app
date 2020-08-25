import React, {useState, useEffect} from 'react'
import {
  View,
  Text,
  Button
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import Home from './components/HomeComponent';
import Setting from './components/SettingComponent';
import Login from './components/LoginComponent';
import Logout from './components/LogoutComponent';
import Led from './components/LedComponent';
import Service from './components/ServiceComponent';
import Feedback from './components/FeedbackComponent';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();
function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen name="Settings" component={Setting}
         options={{
           tabBarLabel: 'Setting',
           tabBarIcon: ({ color, size }) => (
           <Ionicons name="ios-settings" color={color} size={size} />
          ),
        }}
      />
       <Tab.Screen name="Led" component={Led}
         options={{
           tabBarLabel: 'Led',
           tabBarIcon: ({ color, size }) => (
           <Ionicons name="ios-contrast" color={color} size={size} />
          ),
        }}
      />
       <Tab.Screen name="Service" component={Service}
         options={{
           tabBarLabel: 'Service',
           tabBarIcon: ({ color, size }) => (
           <Ionicons name="ios-heart" color={color} size={size} />
          ),
        }}
      />
       <Tab.Screen name="Feedback" component={Feedback}
         options={{
           tabBarLabel: 'Feedback',
           tabBarIcon: ({ color, size }) => (
           <Ionicons name="ios-card" color={color} size={size} />
          ),
        }}
      />
     <Tab.Screen name="Logout" component={Logout}
         options={{
           tabBarLabel: 'Logout',
           tabBarIcon: ({ color, size }) => (
           <Ionicons name="ios-log-out" color={color} size={size} />
          ),
        }}
      />

    </Tab.Navigator>
  );
}
function IsLogin() {
   return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ios-home" color={color} size={size} />
          ),
        }}
      />
       <Tab.Screen name="Login" component={Login}
        options={{
           tabBarLabel: 'Login',
           tabBarIcon: ({ color, size }) => (
           <Ionicons name="ios-log-in" color={color} size={size} />
          ),
        }}

       />
    </Tab.Navigator>
  );
}
const App: () => React$Node = () => {
  const [id, setId] = useState([]);
  useEffect (() => {
    AsyncStorage.getItem('id', (error,value) => {
        if (!error) {
          setId(value)
        }
    });
  }, [])

  return (
    <NavigationContainer>
      { id != null ?
        < MyTabs/>
      :
        < IsLogin />
      }
    </NavigationContainer>

  );
};
export default App;
