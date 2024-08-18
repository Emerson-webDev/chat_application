import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  auth,
} from "../../firebase_config/firebase_config";

export const GoogleSignIn = async () => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
};
