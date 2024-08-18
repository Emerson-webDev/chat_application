import { FacebookAuthProvider, signInWithPopup } from "firebase/auth";
import {
  auth,
} from "../../firebase_config/firebase_config";

export const FaceBookSignIn = async () => {
  const provider = new FacebookAuthProvider();
  return await signInWithPopup(auth, provider)
}
