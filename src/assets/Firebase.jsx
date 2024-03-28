import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { FacebookAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyASPDjiRQplO4gA5yt3VKsbc-C_uRNpicI",
  authDomain: "archblogs-cg.firebaseapp.com",
  projectId: "archblogs-cg",
  storageBucket: "archblogs-cg.appspot.com",
  messagingSenderId: "714619049505",
  appId: "1:714619049505:web:4bb8b1110232e36fc6f560",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth();

//google authentication
export const authWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  let user = null;
  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((err) => {
      console.log(err);
    });

  return user;
};

//facebook authentication
export const authWithFacebook = async () => {
  const provider = new FacebookAuthProvider();
  let user = null;
  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((err) => {
      console.log(err);
    });

  return user;
};
