import React, { useContext, useReducer, useRef, useState } from "react";
import {
  INITIAL_STATE,
  registrationReducer,
} from "./Reducer/registrationReducer";
import { useNavigate } from "react-router-dom";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import {
  storage,
  auth,
  userCollectionRef,
  userChatCollectionRef,
  userFriendsCollectionRef,
  friendRequestCollectionRef,
  videoCallCollectionRef,
} from "../../firebase_config/firebase_config";
import {
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  updateProfile,
} from "firebase/auth";
import {
  setDoc,
  doc,
  serverTimestamp,
  updateDoc,
  getDoc,
} from "firebase/firestore";

import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Container,
  IconButton,
  InputAdornment,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import { inputs } from "./Input";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import {
  AppLogo,
  CustomTypographyH5,
  CustomTypographySubtitle1,
  GitHubButton,
  GoogleButton,
  InputTextField,
  LogInLink,
  RegistrationButton,
  RegistrationButtonBox,
} from "./Theme/Theme";

import chatlogo from "../../Assets/logo.webp";

import { AuthContext } from "../../useContext/AuthContext";
import { GoogleSignIn } from "../GoogleSignIn/GoogleSignIn";
import { GithubSignIn } from "../GithubSignIn/GithubSignIn";

export default function InputForm() {
  const [state, dispatch] = useReducer(registrationReducer, INITIAL_STATE);
  const { dispatchUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const navigate = useNavigate();

  const displayName = state.first_name + " " + state.last_name;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showError, setShowError] = useState(false);

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

  const toggleVisibility = (inputName) => {
    if (inputName === "password") {
      setShowPassword((show) => !show);
    } else if (inputName === "confirm_password") {
      setShowConfirmPassword((show) => !show);
    }
  };

  // using google for logging in
  const googleSignIn = async (e) => {
    e.preventDefault();

    try {
      const result = await GoogleSignIn();
      const user = result.user;

      console.log(user);

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
      console.log(error);
    }
  };

  //using github for logging in
  const gitHubSignIn = async (e) => {
    e.preventDefault();

    try {
      const result = await GithubSignIn();
      const user = result.user;

      if (user) {
        navigate("/");
        const displayName = user.displayName || user.reloadUserInfo.screenName
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
                    displayName: displayName,
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
      // const errorCode = error.code;
      // const errorMessage = error.message;
      // // The email of the user's account used.
      // const email = error.customData.email;
      // // The AuthCredential type that was used.
      // const credential = GithubAuthProvider.credentialFromError(error);

      // console.log(errorCode);
      // console.log(errorMessage);
      // console.log(email);
      // console.log(credential);
      // console.log(error.message);
    }
  };

  // registration handler
  const onSubmit = async (e) => {
    e.preventDefault();
    if (navigator.onLine) {
      try {
        // Checking email existency
        const signInMethods = await fetchSignInMethodsForEmail(
          auth,
          state.email
        );
        if (signInMethods.length > 0) {
          console.log("Email already exists");
          setShowError(true);
          return;
        }
        state.password !== state.confirm_password
          ? dispatch({
              type: "REGISTRATION_ERROR",
              payload: {
                name: "confirm_password",
                value: state.confirm_password,
                error: true,
              },
            })
          : resgisterUser(state);
      } catch (error) {}
    } else {
      console.log("Network Connection Failed");
    }
  };

  navigator.onLine
    ? console.log("online")
    : console.log("Network Connection Failed");

  const resgisterUser = async (data) => {
    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const storageRef = ref(
        storage,
        `ProfilePhoto/${userCredential.user.uid}/${state.first_name}`
      );

      const uploadTask = uploadBytesResumable(storageRef, state.profile_img);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
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
          await getDownloadURL(uploadTask.snapshot.ref).then(
            async (downloadURL) => {
              console.log("File available at", downloadURL);

              await Promise.all([
                updateProfile(userCredential.user, {
                  displayName,
                  photoURL: downloadURL,
                }),

                setDoc(
                  doc(userCollectionRef, userCredential.user.uid),
                  {
                    uid: userCredential.user.uid,
                    photoURL: downloadURL,
                    backgroundImageUrl: downloadURL,
                    displayName,
                    email: state.email,
                    status: {
                      state: "offline",
                      last_changed: serverTimestamp(),
                      video_call_state: false,
                    },
                  },
                  { merge: true }
                ),

                setDoc(
                  doc(userChatCollectionRef, userCredential.user.uid),
                  {},
                  { merge: true }
                ),

                setDoc(
                  doc(friendRequestCollectionRef, userCredential.user.uid),
                  {},
                  { merge: true }
                ),

                setDoc(
                  doc(userFriendsCollectionRef, userCredential.user.uid),
                  {},
                  { merge: true }
                ),

                setDoc(
                  doc(videoCallCollectionRef, userCredential.user.uid),
                  {},
                  { merge: true }
                ),
              ]);

              setShowError(false);
            }
          );
        }
      );
      navigate("/log_in");
      formRef.current.reset();
      dispatch({ type: "RESET" });
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setShowError(true);
      } else {
        console.error("Error:", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) => {
    e.preventDefault();

    const { name, value } = e.target;

    // get the index of the inputs
    const dataFind = inputs.findIndex((data) => data.name === name);
    const checkValidPattern = inputs[dataFind].pattern;
    if (
      value.match(checkValidPattern) === null ||
      !value.match(checkValidPattern)
    ) {
      dispatch({
        type: "REGISTRATION_ERROR",
        payload: { name: name, value: value, error: true },
      });
      // console.log(inputs[dataFind].errorMessage)
    } else {
      dispatch({
        type: "REGISTRATION_ERROR",
        payload: { name: name, value: value, error: false },
      });
    }

    dispatch({ type: "INPUT_CHANGE", payload: { name: name, value: value } });
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
        <CustomTypographySubtitle1 variant="h3">
          Create Account
        </CustomTypographySubtitle1>

        <form ref={formRef} action="" method="post" onSubmit={onSubmit}>
          <Stack spacing={2}>
            <Stack gap={2} direction="row" sx={{ width: "100%" }}>
              {/* First Name */}
              <InputTextField
                {...inputs[0]}
                value={state.first_name}
                onChange={onChange}
                sx={{ width: "50%" }}
              />

              {/* Last Name */}
              <InputTextField
                {...inputs[1]}
                value={state.last_name}
                onChange={onChange}
                sx={{ width: "50%" }}
              />
            </Stack>

            {inputs.slice(2).map((input, id) =>
              input.type === "password" ? (
                <InputTextField
                  {...input}
                  value={state[input.name]}
                  key={id}
                  onChange={onChange}
                  error={state.error[input.name]}
                  helperText={
                    state.error[input.name] ? input.errormessage : null
                  }
                  type={
                    input.type === "password"
                      ? input.name === "password"
                        ? showPassword
                          ? "text"
                          : "password"
                        : input.name === "confirm_password"
                        ? showConfirmPassword
                          ? "text"
                          : "password"
                        : input.type
                      : input.type
                  }
                  // inputProps={{ maxLength: 20 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => toggleVisibility(input.name)}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {input.name === "password" ? (
                            showPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )
                          ) : input.name === "confirm_password" ? (
                            showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )
                          ) : null}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              ) : (
                <InputTextField
                  {...input}
                  value={state[input.name]}
                  key={id}
                  onChange={onChange}
                  error={state.error[input.name]}
                  helperText={
                    state.error[input.name] ? input.errormessage : null
                  }
                />
              )
            )}
          </Stack>

          <RegistrationButtonBox>
            <RegistrationButton variant="contained" type="submit" fullWidth>
              {loading ? "Signing up..." : "Sign up"}
            </RegistrationButton>
          </RegistrationButtonBox>
        </form>

        <>
          <Typography mt={2} color="default.primary" textAlign="center">
            <span style={{ fontWeight: "bold" }}>Already have an account?</span>{" "}
            <LogInLink to="/log_in" component="button" variant="body2">
              Log in
            </LogInLink>
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
              Sign up with google
            </GoogleButton>

            <GitHubButton
              variant="contained"
              startIcon={<GitHubIcon />}
              onClick={gitHubSignIn}
            >
              Sign up with Github
            </GitHubButton>
          </Stack>
        </>
      </Stack>

      <Snackbar open={showError} autoHideDuration={6000} onClose={handleClosed}>
        <Alert
          onClose={handleClosed}
          severity="error"
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          Email already taken. Please input another email!
        </Alert>
      </Snackbar>
    </Container>
  );
}
