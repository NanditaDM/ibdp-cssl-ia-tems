// Firebase config - FREE database setup
// To use this:
// 1. Go to https://firebase.google.com/
// 2. Create a free account
// 3. Create a new project
// 4. Enable Firestore Database
// 5. Replace the config below with your project's config

// TEMPORARY CONFIG - Replace with your own from Firebase Console
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Check if Firebase is loaded
if (typeof firebase !== 'undefined') {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    console.log("Firebase initialized successfully!");
} else {
    console.warn("Firebase not loaded. Running in offline mode.");
}
