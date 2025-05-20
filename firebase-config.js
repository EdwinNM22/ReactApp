import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCxUHErqCnDd1LQOOnZnirBxbLUVJjcCWo",
  authDomain: "dbedwin-2d4a3.firebaseapp.com",
  projectId: "dbedwin-2d4a3",
  storageBucket: "dbedwin-2d4a3.appspot.com",
  messagingSenderId: "485963238718",
  appId: "1:485963238718:web:610fb4a7e5829d768bb06f"
};

const app = initializeApp(firebaseConfig);

// Asegura que solo se inicializa una vez
let auth;
try {
  auth = getAuth(app);
} catch (e) {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { auth };
