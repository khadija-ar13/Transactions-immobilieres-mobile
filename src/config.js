import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBZss8af-vRHOlNLYbBqQ-YzrNF7yePq2o",
  authDomain: "transctions-immobiliers.firebaseapp.com",
  projectId: "transctions-immobiliers",
  storageBucket: "transctions-immobiliers.firebasestorage.app",
  messagingSenderId: "289810596454",
  appId: "1:289810596454:web:696bf8cb18b62392aa63a7",
  measurementId: "G-KXSJ74R1E1"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export { firebase };