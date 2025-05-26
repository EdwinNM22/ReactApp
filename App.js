import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from "@react-navigation/native";
import Login from './screens/LoginScreen/Login';
import Home from './screens/HomeScreen/Home';
import Register from './screens/RegisterScreen/Register';
import Map from './screens/MapScreen/Map';
import User from './screens/UserManage/User';



const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Map" component={Map} options={{ headerShown: false }} />
        <Stack.Screen name="User" component={User} />

      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>                          
  );
}