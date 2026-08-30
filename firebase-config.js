// ============================================================
//  Firebase Configuration — EIC8 CHECK SHEET (CLONE)
//
//  File ini SENGAJA dikosongkan dari kredensial project lama
//  supaya hasil clone tidak menulis ke database program lain.
//  Isi dengan config project Firebase BARU milik Anda.
//
//  CARA MENGISI:
//  1. Buka https://console.firebase.google.com
//  2. Buat project BARU (pakai akun Google Anda sendiri)
//  3. Build > Firestore Database > Create database (mode production)
//  4. Project settings (⚙️) > General > "Your apps" > Web (</>)
//     -> daftarkan app, lalu copy object firebaseConfig-nya
//  5. Ganti seluruh nilai di bawah dengan milik Anda
//
//  Lihat DATABASE_SETUP.md untuk langkah lengkap (rules, index,
//  user admin pertama, dsb).
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
