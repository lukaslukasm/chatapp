import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';


const firebaseConfig = {
  apiKey: "AIzaSyBCKXhHPDAQY8HZDJRlxG0qbX6vDen6gqM",
  authDomain: "whatsapp-2-f6218.firebaseapp.com",
  projectId: "whatsapp-2-f6218",
  storageBucket: "whatsapp-2-f6218.appspot.com",
  messagingSenderId: "658665546458",
  appId: "1:658665546458:web:d9be2328de930233eabbe3"
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app()

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { db, auth, provider };