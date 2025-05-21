import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCxUHErqCnDd1LQOOnZnirBxbLUVJjcCWo",
  authDomain: "dbedwin-2d4a3.firebaseapp.com",
  projectId: "dbedwin-2d4a3",
  storageBucket: "dbedwin-2d4a3.appspot.com",
  messagingSenderId: "485963238718",
  appId: "1:485963238718:web:610fb4a7e5829d768bb06f"
};

const app = initializeApp(firebaseConfig);

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase