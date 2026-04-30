const firebaseConfig = {
    apiKey: "AIzaSyBR4o2yQpnEWglZWaIrF0RMsemwKMe2wtM",
    authDomain: "visitrak-83353.firebaseapp.com",
    databaseURL: "https://visitrak-83353-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "visitrak-83353",
    storageBucket: "visitrak-83353.firebasestorage.app",
    messagingSenderId: "610189188757",
    appId: "1:610189188757:web:665d5f60c04f3bf519c59c",
    measurementId: "G-NM90818W43"
};
if (typeof firebase !== 'undefined' && !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
var auth = typeof firebase !== 'undefined' ? firebase.auth() : null;
var db = typeof firebase !== 'undefined' ? firebase.firestore() : null;
window.auth = auth;
window.db = db;