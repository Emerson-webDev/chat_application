import React, { useContext, useEffect, useReducer, useState } from "react";

import {
  AccountUpdateReducer,
  INITIAL_STATE,
} from "./Reducer/AccountUpdateReducer";
import {
  updatePassword,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, getDocs, updateDoc } from "firebase/firestore";
import { auth, userChatCollectionRef } from "../../../firebase_config/firebase_config";
import {
  AccountPasswordReducer,
  PASSWORD_INITIAL_STATE,
} from "./Reducer/AccountPasswordReducer";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import {
  Alert,
  Box,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import {
  ProfileInfoBox,
  ProfileInfoSettingContainer,
  ProfileSettingBox,
  UpdateButton,
  UpdatePasswordForm,
  UpdatePersonalForm,
} from "./Theme/Theme";
import { AuthContext } from "../../../useContext/AuthContext";
import API from "../../../API/API";

export default function PersonalInfoSetting() {
  const { currentUser } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [docId, setDocId] = useState([]);

  const [state, dispatch] = useReducer(AccountUpdateReducer, INITIAL_STATE);
  const [passwordState, dispatchPassword] = useReducer(
    AccountPasswordReducer,
    PASSWORD_INITIAL_STATE
  );
  const [showCurrPassword, setShowCurrPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // show current password
  const handleClickShowCurrPassword = () => {
    setShowCurrPassword((show) => !show);
  };

  // show new password
  const handleClickShowNewPassword = () => {
    setShowNewPassword((show) => !show);
  };

  //show confirm password
  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword((show) => !show);
  };

  // closing the snackbar/alert
  const handleClosed = (event, reason) => {
    
    if (reason === "clickaway") {
      return;
    }
    // setShowError(false);
    dispatchPassword({ type: "UPDATE_RETRY" });
  };

  // check for google sign in. if user use google sign in we need to disable our update for profile
  const signInMethod =
    currentUser.providerData[0].providerId !== "password" ? true : false;

  useEffect(() => {
    dispatch({
      type: "UPDATE_ACCOUNT",
      payload: { displayName: currentUser.displayName || currentUser.reloadUserInfo.screenName},
    });

    const getChat = async () => {
      try {
        const querySnapshot = await getDocs(userChatCollectionRef);
        const userchatData = [];
        const userId = [];
        querySnapshot.forEach((doc) => {
          userchatData.push({ ...doc.data() });
          userId.push(doc.id);
        });
        setData(userchatData);
        setDocId(userId);
      } catch (error) {
        console.log("Error getting chat data:", error);
      }
    };

    getChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onProfile = async (e) => {
    e.preventDefault();
    try {
      if (state.displayName === "") {
        dispatch({ type: "UPDATE_FAILED" });
      } else {
        const res = await API.put(`/update_account/${currentUser.uid}`, state, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        updateProfile(currentUser, {
          displayName: res.data.displayName,
        });

        data.map(async (item, index) => {
          const keys = Object.keys(item);

          if (keys.length > 1) {
            keys.map(async (key) => {
              if (item[key] && item[key].user_info) {
                const uid = item[key].user_info.uid;
                const docRef = doc(userChatCollectionRef, docId[index]);
                if (currentUser.uid === uid) {
                  await updateDoc(docRef, {
                    [key + ".user_info.displayName"]: res.data.displayName,
                  });
                }
              }
            });
          } else {
            const key = keys[0];
            if (item[key] && item[key].user_info) {
              const uid = item[key].user_info.uid;
              const docRef = doc(userChatCollectionRef, docId[index]);
              if (currentUser.uid === uid) {
                await updateDoc(docRef, {
                  [key + ".user_info.displayName"]: res.data.displayName,
                });
              }
            }
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onPasswordHandler = async (e) => {
    e.preventDefault();
    try {
      if (
        passwordState.new_password !== passwordState.confirm_password ||
        !passwordState.new_password ||
        !passwordState.confirm_password ||
        !passwordState.current_password
      ) {
        dispatchPassword({ type: "UPDATE_FAILED", payload : "error" });
      } else {
        const credentials = EmailAuthProvider.credential(
          currentUser.email,
          passwordState.current_password
        );
        if (credentials) {
          reauthenticateWithCredential(auth.currentUser, credentials)
            .then(() => {
              // User re-authenticated.
              console.log("Re-authenticated");
              updatePassword(auth.currentUser, passwordState.new_password)
                .then(() => {
                  // Update successful.
                  console.log("password updated");
                  dispatchPassword({ type: "UPDATE_PASSWORD", payload : "success" });
                  setTimeout( () => {
                    dispatchPassword({ type: "RESET" });
                  },2000)
                })
                .catch((error) => {
                  // An error ocurred
                  // ...
                  console.log(error);
                });
              
            })
            .catch((error) => {
              dispatchPassword({ type: "UPDATE_FAILED", payload : "error" });
            });
        } else {
          console.log("check email and password");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onChangeProfile = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "INPUT_CHANGE", payload: { name: name, value: value } });
  };

  const onChangePassword = async (e) => {
    const { name, value } = e.target;
    dispatchPassword({
      type: "INPUT_CHANGE",
      payload: { name: name, value: value },
    });
  };

  //check for sign in method
  const userEmail = currentUser.providerData[0].providerId === "github.com" && currentUser.providerData[0].email
  ? currentUser.providerData[0].email
  : currentUser.providerData[0].providerId === "google.com" && currentUser.providerData[0].email
  ? currentUser.providerData[0].email
  : currentUser.providerData[0].providerId === "password"
  ? currentUser.email
  : "";


  return (
    <ProfileInfoSettingContainer>
      <Box>
        <Box>
          <Typography variant="h4" fontWeight={800} display="block">
            Settings
          </Typography>
          <Typography
            variant="subtitle1"
            display="block"
            gutterBottom
            color="text.secondary"
          >
            Update Personal Setting
          </Typography>
        </Box>

        <Divider />

        <ProfileInfoBox>
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>
              Personal Information
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: "default.blur" }}
            >
              Edit your info
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "column" }}>
            <UpdatePersonalForm action="" onSubmit={onProfile}>
              <FormControl>
                <TextField
                  size="small"
                  name="displayName"
                  value={state.displayName || currentUser.reloadUserInfo.screenName}
                  disabled={signInMethod}
                  onChange={onChangeProfile}
                />
              </FormControl>
              <UpdateButton type="submit" disabled={signInMethod}>
                Save Changes
              </UpdateButton>
            </UpdatePersonalForm>
            <TextField
              disabled
              size="small"
              name="Email"
              value={userEmail}
              onChange={onChangeProfile}
            />
          </Box>
        </ProfileInfoBox>

        <ProfileSettingBox>
          <Box>
            <Typography sx={{ fontWeight: "bold" }}>Password</Typography>
            <Typography
              variant="subtitle1"
              sx={{ color: "default.blur" }}
            >
              Update your password
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexGrow: 1, flexDirection: "column" }}>
            <UpdatePasswordForm action="" onSubmit={onPasswordHandler}>
              <FormControl>
                <TextField
                  required
                  size="small"
                  title="Please enter your current password"
                  type={
                    "password"
                      ? showCurrPassword
                        ? "text"
                        : "password"
                      : "text"
                  }
                  name="current_password"
                  placeholder="Please enter your current password"
                  value={passwordState.current_password}
                  disabled={signInMethod}
                  onChange={onChangePassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowCurrPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          disabled={signInMethod}
                        >
                          {showCurrPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  required
                  size="small"
                  title="Please enter your new password"
                  type={
                    "password"
                      ? showNewPassword
                        ? "text"
                        : "password"
                      : "text"
                  }
                  name="new_password"
                  placeholder="Enter new password"
                  value={passwordState.new_password}
                  disabled={signInMethod}
                  onChange={onChangePassword}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowNewPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          disabled={signInMethod}
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
              <TextField
                required
                size="small"
                type={
                  "password"
                    ? showConfirmPassword
                      ? "text"
                      : "password"
                    : "text"
                }
                name="confirm_password"
                placeholder="Confirm password"
                value={passwordState.confirm_password}
                disabled={signInMethod}
                onChange={onChangePassword}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        disabled={signInMethod}
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              {/* <Box></Box> */}
              <UpdateButton type="submit" disabled={signInMethod}>
                Save Changes
              </UpdateButton>
            </UpdatePasswordForm>
          </Box>
        </ProfileSettingBox>
        <Snackbar
          open={passwordState.error === "error" || passwordState.error === "success"}
          autoHideDuration={5000}
          onClose={handleClosed}
        >
          <Alert
            onClose={handleClosed}
            severity={ passwordState.error === false ? "warning" : passwordState.error}
            sx={{ width: "100%" }}
            elevation={6}
            variant="filled"
          >
            {
             passwordState.error === "success" ? "New password updated" : passwordState.new_password !== passwordState.confirm_password ? "New password does not match. Please check your input." : "Current Password is Incorrect. Please check your input."
            }
          </Alert>
        </Snackbar>
      </Box>
    </ProfileInfoSettingContainer>
  );
}
