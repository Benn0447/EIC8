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
  apiKey: "ISI_API_KEY_ANDA",
  authDomain: "PROJECT_ID_ANDA.firebaseapp.com",
  projectId: "PROJECT_ID_ANDA",
  storageBucket: "PROJECT_ID_ANDA.firebasestorage.app",
  messagingSenderId: "ISI_SENDER_ID_ANDA",
  appId: "ISI_APP_ID_ANDA"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
