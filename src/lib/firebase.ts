
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";;

const firebaseConfig = {
    apiKey: "AIzaSyArO4-HjaT_rqcJfLOcv0dD0gDtcG0VMYc",
    authDomain: "zeno-app-e3a25.firebaseapp.com",
    projectId: "zeno-app-e3a25",
    storageBucket: "zeno-app-e3a25.firebasestorage.app",
    messagingSenderId: "633163286293",
    appId: "1:633163286293:web:6beb54d6c9e16c3191cb1c",
    measurementId: "G-BM9Y0YWZLG"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);