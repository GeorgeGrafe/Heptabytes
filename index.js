// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-analytics.js";
import { getDatabase, limitToLast, onValue, query, ref as dbref } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-database.js";
import { getBlob, getStorage, ref as stref, uploadBytes } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnB1okwizTT_zdEuvwQMpwTbAO5MRhQt4",
  authDomain: "heptabytes-tuklas.firebaseapp.com",
  projectId: "heptabytes-tuklas",
  databaseURL: "https://heptabytes-tuklas-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "heptabytes-tuklas.appspot.com",
  messagingSenderId: "93683472626",
  appId: "1:93683472626:web:89814c8024acc19552986b",
  measurementId: "G-9M441DZBE3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app)
const storage = getStorage(app, "gs://heptabytes-tuklas.appspot.com");

// console.log(database)

// const dataObtained = ref(database, "pH/5/2024/2024-03-17-76720");
// onValue(dataObtained, (snapshot) => {
//   const data = snapshot.val();
//   console.log(data);
// });

// console.log("Here: " + dataObtained);

// let data = null

// function hello() {
//   const dataObtained = ref(database, "accuracy/38/2024/2024-03-18-36290/value");
//   console.log("CALLED!");
//   onValue(dataObtained, (snapshot) => {
//     data = snapshot.val();
//     console.log(data);
//   });
//   console.log("After: " + data);
// }

// document.getElementById("demo").onclick = function() {myFunction()};

// function myFunction() {
//   hello();
// }


export { database, storage,
  dbref, limitToLast, onValue, query,
  getBlob, stref
}

// const uploadF = document.getElementById("upload-File"); // Replace with your button's ID
// const fileInput = document.getElementById("fileInput");

// uploadF.addEventListener("click", async () => {
//     const file = fileInput.files[0];

//     if (!file) {
//         alert("Please select a file to upload!");
//         return;
//     }

//     const filename = file.name;
//     const storageRef = ref(storage, filename);

//     uploadBytes(storageRef, file).then((snapshot) => {
//         console.log('Uploaded a blob or file!');
//       });
//   });
