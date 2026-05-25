import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// إعدادات Firebase الخاصة بمشروعك الوزاري الحقيقي
const firebaseConfig = {
  apiKey: "AIzaSyDMdCszUhO2-J91FAb6Klv_1rVKEzxkMmU",
  authDomain: "wzary-df087.firebaseapp.com",
  projectId: "wzary-df087",
  storageBucket: "wzary-df087.firebasestorage.app",
  messagingSenderId: "118130006915",
  appId: "1:118130006915:web:c2cb375f34c89eee88f4b6",
  measurementId: "G-HSH40G7VG1"
};

// تهيئة التصدير السحابي بأمان لمنع تكرار الاتصال أثناء الـ Build
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };
