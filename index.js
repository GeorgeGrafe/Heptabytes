import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { child, endAt, equalTo, get,
  getDatabase, limitToLast, onValue, orderByChild,
  orderByKey, query, ref as dbref, startAt } from "firebase/database";
import { getBlob, getStorage, ref as stref } from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCnB1okwizTT_zdEuvwQMpwTbAO5MRhQt4",
  authDomain: "heptabytes-tuklas.firebaseapp.com",
  projectId: "heptabytes-tuklas",
  databaseURL: "https://heptabytes-tuklas-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "gs://heptabytes-tuklas.appspot.com",
  messagingSenderId: "93683472626",
  appId: "1:93683472626:web:89814c8024acc19552986b",
  measurementId: "G-9M441DZBE3"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app)
const storage = getStorage(app);

export { database, storage,
  child, dbref, endAt, equalTo, get, limitToLast, onValue, orderByChild, orderByKey, query, startAt,
  getBlob, stref
}
