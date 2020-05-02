import firebase from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyDvRs8lSQJQFdjGdFNOL96p4qhmJatGWhA",
    authDomain: "pandora-2-f5838.firebaseapp.com",
    databaseURL: "https://pandora-2-f5838.firebaseio.com",
    projectId: "pandora-2-f5838",
    storageBucket: "pandora-2-f5838.appspot.com",
    messagingSenderId: "985929246357",
    appId: "1:985929246357:web:29df908c90685eb9975d9c",
    measurementId: "G-V5G3KB2L00"
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
