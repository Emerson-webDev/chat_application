import React, { useContext, useReducer, useState } from "react";
import { INITIAL_STATE, logInReducer } from "./Reducer/logInReducer";
import { useNavigate } from "react-router-dom";

// Firebase
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  auth,
  friendRequestCollectionRef,
  storage,
  userChatCollectionRef,
  userCollectionRef,
  userFriendsCollectionRef,
  videoCallCollectionRef,
 
} from "../../firebase_config/firebase_config";
import {
  signInWithEmailAndPassword,
  FacebookAuthProvider,
} from "firebase/auth";
import { ref, uploadBytesResumable } from "firebase/storage";
import { AuthContext } from "../../useContext/AuthContext";

import { inputs } from "./Input";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import {
  Alert,
  Avatar,
  Container,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";

import {
  AppLogo,
  CustomForgotBox,
  CustomTypographyH5,
  CustomTypographySubtitle1,
  FacebookButton,
  GoogleButton,
  InputTextField,
  LogInButton,
  LoggingProgress,
  RegistrationLink,
  RememberCheckBox,
} from "./Theme/Theme";

import chatlogo from "../../Assets/logo.webp";
import { FaceBookSignIn } from "../FaceBookSignIn/FaceBookSignIn";
import { GoogleSignIn } from "../GoogleSignIn/GoogleSignIn";

export default function InputForm() {
  const [state, dispatch] = useReducer(logInReducer, INITIAL_STATE);
  const { dispatchUser } = useContext(AuthContext);
  const [isloading, setIsLoading] = useState(false);
  const [isdisabled, setIsDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showError, setShowError] = useState({ state: false, error: null });

  const navigate = useNavigate();

  // const disabled = isdisabled ?

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // closing the snackbar/alert
  const handleClosed = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowError(false);
  };

  // using google for logging in
  const googleSignIn = async (e) => {
    e.preventDefault();

    try {
      const result = await GoogleSignIn();
      const user = result.user;

      // console.log(user)
      if (user) {
        navigate("/");
        const storageRef = ref(
          storage,
          `ProfilePhoto/${user.uid}/${user.photoURL}`
        );

        const uploadTask = uploadBytesResumable(storageRef, user.photoURL);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            console.log(error);
          },
          async () => {
            const resExist = await getDoc(doc(userCollectionRef, user.uid));

            if (!resExist.exists) {
              console.log("exist");
            } else {
              await setDoc(
                doc(userCollectionRef, user.uid),
                {
                  uid: user.uid,
                  photoURL: user.photoURL,
                  displayName: user.displayName,
                  email: user.email,
                  status: {
                    state: "offline",
                    last_changed: serverTimestamp(),
                    video_call_state: false,
                  },
                },
                { merge: true }
              );

              // Use promise all here because it a lot asynchronus function here
              await Promise.all([
                setDoc(
                  doc(userChatCollectionRef, user.uid),
                  {},
                  { merge: true }
                ),
                setDoc(
                  doc(friendRequestCollectionRef, user.uid),
                  {},
                  { merge: true }
                ),
                setDoc(
                  doc(userFriendsCollectionRef, user.uid),
                  {},
                  { merge: true }
                ),
                setDoc(
                  doc(videoCallCollectionRef, user.uid),
                  {},
                  { merge: true }
                ),
                updateDoc(doc(userCollectionRef, user.uid), {
                  status: {
                    state: "online",
                    last_changed: serverTimestamp(),
                  },
                }),
              ]);

              if (user.email !== null) {
              dispatchUser({
                type: "SET_CURRENT_USER",
                payload: user,
              });
            }

            }

            setShowError(false);
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  //using facebook for logging in
  const faceBookSignIn = async (e) => {
    e.preventDefault();

    try {
      const result = await FaceBookSignIn();
      const user = result.user;

      if (user) {
        navigate("/");
        const storageRef = ref(
          storage,
          `ProfilePhoto/${user.uid}/${user.photoURL}`
        );

        const uploadTask = uploadBytesResumable(storageRef, user.photoURL);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
              default:
                break;
            }
          },
          (error) => {
            console.log(error);
          },
          async () => {
            const resExist = await getDoc(doc(userCollectionRef, user.uid));

            if (!resExist.exists) {
              console.log("exist");
            } else {
              // Use promise all here because it a lot asynchronus function here
              await Promise.all([
                setDoc(
                  doc(userCollectionRef, user.uid),
                  {
                    uid: user.uid,
                    photoURL: user.photoURL,
                    displayName: user.displayName,
                    email: user.providerData[0].email,
                    status: {
                      state: "offline",
                      last_changed: serverTimestamp(),
                      video_call_state: false,
                    },
                  },
                  { merge: true }
                ),
                setDoc(
                  doc(userChatCollectionRef, user.uid),
                  {},
                  { merge: true }
                ),
                setDoc(
                  doc(friendRequestCollectionRef, user.uid),
                  {},
                  { merge: true }
                ),
                setDoc(
                  doc(userFriendsCollectionRef, user.uid),
                  {},
                  { merge: true }
                ),
                setDoc(
                  doc(videoCallCollectionRef, user.uid),
                  {},
                  { merge: true }
                ),
              ]);

              dispatchUser({
                type: "SET_CURRENT_USER",
                payload: user,
              });

              await updateDoc(doc(userCollectionRef, user.uid), {
                status: {
                  state: "online",
                  last_changed: serverTimestamp(),
                },
              });
            }

            setShowError(false);
          }
        );
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = FacebookAuthProvider.credentialFromError(error);

      console.log(errorCode);
      console.log(errorMessage);
      console.log(email);
      console.log(credential);
      console.log(error);
    }
  };

  // signing using signInWithEmailAndPassword
  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (navigator.onLine) {
        setIsLoading(true);
        setIsDisabled(true);

        const userCredential = await signInWithEmailAndPassword(
          auth,
          state.email,
          state.password
        );

        const resExist = await getDoc(
          doc(userChatCollectionRef, userCredential.user.uid)
        );

        dispatchUser({
          type: "SET_CURRENT_USER",
          payload: userCredential.user,
        });

        await updateDoc(doc(userCollectionRef, userCredential.user.uid), {
          status: {
            state: "online",
            last_changed: serverTimestamp(),
            video_call_state: false,
          },
        });

        if (!resExist.exists()) {
          await setDoc(doc(userChatCollectionRef, userCredential.user.uid), {});
        }

        navigate("/");
      }
    } catch (error) {
      console.log(error.message);
      // console.log(showError.state)
      setShowError({ state: true, error: error.message });
    } finally {
      setIsLoading(false);
      setIsDisabled(false);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "INPUT_CHANGE", payload: { name, value } });
  };

  return (
    <Container>
      <Stack>
        <AppLogo>
          <Avatar src={chatlogo} alt="chat-logo" />
        </AppLogo>
        <CustomTypographyH5 variant="h5">
          Hello everyone, welcome to ChatApp.
        </CustomTypographyH5>
        <CustomTypographySubtitle1 variant="subtitle1">
          Please sign in to your Account
        </CustomTypographySubtitle1>
        <form action="" onSubmit={onSubmit}>
          <Stack spacing={3}>
            {inputs.map((input, id) => (
              <FormControl spacing={2} key={id}>
                {input.type === "password" ? (
                  <InputTextField
                    {...input}
                    type={
                      input.type === "password"
                        ? showPassword
                          ? "text"
                          : "password"
                        : input.type
                    }
                    onChange={onChange}
                    // autoComplete=""
                    disabled={isdisabled}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                ) : (
                  <InputTextField
                    {...input}
                    onChange={onChange}
                    autoComplete="off"
                    disabled={isdisabled}
                  />
                )}
              </FormControl>
            ))}
          </Stack>
          <CustomForgotBox>
            <FormControlLabel
              control={<RememberCheckBox defaultChecked />}
              label="Remember me"
              id="rememberMeCheckbox"
              name="rememberMe"
            />

            <Typography>Forgot password?</Typography>
          </CustomForgotBox>

          <FormControl fullWidth>
            {isloading ? (
              <LogInButton variant="contained" fullWidth disabled>
                <LoggingProgress size={27} />
              </LogInButton>
            ) : (
              <LogInButton variant="contained" type="submit" fullWidth>
                Sign in
              </LogInButton>
            )}
          </FormControl>
        </form>
        <>
          <Typography mt={2} color="default.primary" textAlign="center">
            <span style={{ fontWeight: "bold" }}>Don't have an account?</span>{" "}
            <RegistrationLink
              to="/registration"
              component="button"
              variant="body2"
            >
              Register
            </RegistrationLink>
          </Typography>

          <Typography mb={2} mt={1} textAlign="center">
            <span style={{ fontWeight: "bold" }}>or</span>{" "}
          </Typography>

          <Stack spacing={2}>
            <GoogleButton
              variant="contained"
              startIcon={<GoogleIcon />}
              onClick={googleSignIn}
            >
              Sign with google
            </GoogleButton>

            <FacebookButton
              variant="contained"
              startIcon={<FacebookIcon />}
              onClick={faceBookSignIn}
            >
              Sign with facebook
            </FacebookButton>
          </Stack>
        </>
      </Stack>
      <Snackbar
        open={showError.state}
        autoHideDuration={5000}
        onClose={handleClosed}
      >
        {/* {console.log(showError.state)} */}
        <Alert
          onClose={handleClosed}
          severity="error"
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {/* Email and password does not match. Please check your input! */}
          {showError.error}
        </Alert>
      </Snackbar>
    </Container>
  );
}
