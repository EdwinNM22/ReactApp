import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';

import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from "@react-navigation/native";
import Login from './screens/LoginScreen/Login';
import Home from './screens/HomeScreen/Home';
import Register from './screens/RegisterScreen/Register';
import Map from './screens/MapScreen/Map';



const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Map" component={Map} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>                          
  );
}