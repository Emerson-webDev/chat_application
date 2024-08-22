import { GithubAuthProvider, signInWithPopup } from "firebase/auth";

import { auth } from "../../firebase_config/firebase_config";

export const GithubSignIn = async () => {
  const provider = new GithubAuthProvider();
  return await signInWithPopup(auth, provider);
};
