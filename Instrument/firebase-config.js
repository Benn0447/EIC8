// ============================================================
//  Firebase Configuration — EIC8 CHECK SHEET (CLONE)
//
//  Shares the same Firebase project as ../Electric/firebase-config.js
//  (project eic8-3d7f1) — this used to point at the original
//  pomi-checksheet-e7 project, which was a bug: this Instrument copy
//  must never write to the original Electric-7 department's database.
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyAPycVDgRUW1jF5IMBhRSOI2O-X50pOY7E",
  authDomain: "eic8-3d7f1.firebaseapp.com",
  projectId: "eic8-3d7f1",
  storageBucket: "eic8-3d7f1.firebasestorage.app",
  messagingSenderId: "547008302127",
  appId: "1:547008302127:web:9b398bf2c2713664960ada",
  measurementId: "G-VVSNKJ1EL9"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
