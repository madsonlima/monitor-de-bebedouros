import firebase from 'firebase/compat/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: "AIzaSyDxF-PDnxk1c6IrFL0HeS8AnTtsyDI3sqA",
  authDomain: "projeto-iot-a8adb.firebaseapp.com",
  databaseURL: "https://projeto-iot-a8adb-default-rtdb.firebaseio.com",
  projectId: "projeto-iot-a8adb",
  storageBucket: "projeto-iot-a8adb.appspot.com",
  messagingSenderId: "39785302952",
  appId: "1:39785302952:web:17ed5e6fe824d5819dab9d"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

const db = getDatabase()

export { db }