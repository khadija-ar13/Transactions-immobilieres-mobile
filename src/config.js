import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCEVQk79Pv2AWtDH4Qoma4TIYbUEZFchxk",
  authDomain: "fir-stockagetransactions2.firebaseapp.com",
  projectId: "fir-stockagetransactions2",
  storageBucket: "fir-stockagetransactions2.appspot.com",
  messagingSenderId: "70709582941",
  appId: "1:70709582941:web:667929d683ed21b14a81b4",
  measurementId: "G-ZWYQSZ81R5"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };