import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../useContext/AuthContext";
import {
  Timestamp,
  arrayUnion,
  doc,
  // getDoc,
  onSnapshot,
  // serverTimestamp,
  // setDoc,
  updateDoc,
} from "firebase/firestore";
import {
  storage,
  userCollectionRef,
  userFriendsCollectionRef,
  userNotificationsCollectionRef,
} from "../../../firebase_config/firebase_config";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { v4 as uuid } from "uuid";
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  Paper,
  Stack,
  Typography,
  styled,
  useTheme,
} from "@mui/material";

import {
  CameraIcon,
  VisuallyHiddenInput,
} from "../../chatComponents/ChatContainer/Theme/Theme";
import {
  BackgroundBox,
  PersonalInfoBox,
  ProfileAvatar,
  ProfileAvatarBox,
  ProfileHeader,
} from "./Theme/Theme";

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 25,
  height: 25,
  padding: ".5rem",
  border: `2px solid ${theme.palette.background.paper}`,
}));

export default function PersonalInfo() {
  const theme = useTheme();
  const { currentUser } = useContext(AuthContext);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [friendsUid, setFriendsUid] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const signInMethod =
    currentUser.providerData[0].providerId === "google.com"
      ? "google sign in"
      : currentUser.providerData[0].providerId === "facebook.com"
      ? "facebook sign in"
      : "Email and password";

  // console.log(currentUser)

  const flattenedFriendsUid = friendsUid
    ?.flatMap((friendsUidArray) => friendsUidArray)
    .filter(Boolean);


  // check for google sign in. if user use google sign in we need to disable our update for profile
  const isPasswordSignIn =
    currentUser.providerData[0].providerId === "google.com" ||
    currentUser.providerData[0].providerId === "facebook.com"
      ? "disable"
      : "";

  useEffect(() => {
    const getUserInfo = () => {
      const unsubscribe = onSnapshot(
        doc(userCollectionRef, currentUser.uid),
        (docSnap) => {
          try {
            if (docSnap.exists()) {
              const data = docSnap.data();
              setCurrentUserData(data);
              setIsLoading(false);
            }
          } catch (error) {
            console.log(error);
          }
        }
      );
      return () => unsubscribe();
    };
    currentUser && getUserInfo();
  }, [currentUser]);

  // console.log(currentUserData);
  useEffect(() => {
    const getFriend = () => {
      try {
        const unsubscribe = onSnapshot(
          doc(userFriendsCollectionRef, currentUser.uid),
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              const filterUid = [data]?.map((datas) =>
                Object.keys(datas)?.map(
                  (data) => datas[data].request_state === "friend"
                )
              );
              setFriendsUid(filterUid);
              // console.log([data].map( datas => Object.keys(datas).map( data => datas[data].uid)))
            }
          }
        );
        return () => unsubscribe();
      } catch (error) {
        console.log(error);
      }
    };
    getFriend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeProfileImage = (e) => {
    const newProfileImage = e.target.files[0];
    try {
      const storageRef = ref(
        storage,
        `ProfilePhoto/${currentUser.uid}/${newProfileImage.name}`
      );
      const uploadTask = uploadBytesResumable(storageRef, newProfileImage);
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

              await updateProfile(currentUser, {
                photoURL: downloadURL,
              });

              await updateDoc(doc(userCollectionRef, currentUser.uid), {
                photoURL: downloadURL,
              });
            }
          );

          flattenedFriendsUid?.map(async (friendsuid) => {
            if (friendsuid) {
              await updateDoc(doc(userNotificationsCollectionRef, friendsuid), {
                notification_list: arrayUnion({
                  notification_id: uuid(),
                  date: Timestamp.now(),
                  uid: currentUser.uid,
                  notification_content: `${currentUser.displayName} update profile picture`,
                }),
              });
            }
          });
        }
      );
    } catch (error) {}
    // setNewProfileImage(file);
  };

  //check for sign in method
  const userEmail = currentUser.providerData[0].providerId === "facebook.com" && currentUser.providerData[0].email
  ? currentUser.providerData[0].email
  : currentUser.providerData[0].providerId === "google.com" && currentUser.providerData[0].email
  ? currentUser.providerData[0].email
  : currentUser.providerData[0].providerId === "password"
  ? currentUser.email
  : "";

  return (
    <PersonalInfoBox>
      {isLoading ? (
        <></>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <BackgroundBox>
            <ProfileHeader>
              <Typography variant="h4" fontWeight={800} display="block">
                Profile
              </Typography>
            </ProfileHeader>

            <Typography
              variant="subtitle1"
              display="block"
              gutterBottom
              color="text.secondary"
            >
              Personal Information
            </Typography>
          </BackgroundBox>
          <ProfileAvatarBox>
            <Badge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              badgeContent={
                <IconButton component="label">
                  <SmallAvatar>
                    <CameraIcon />
                    <form action="">
                      <VisuallyHiddenInput
                        type="file"
                        accept="image/*"
                        onChange={onChangeProfileImage}
                        disabled={isPasswordSignIn}
                      />
                    </form>
                  </SmallAvatar>
                </IconButton>
              }
            >
              <ProfileAvatar
                src={currentUser.photoURL}
                alt={currentUser.displayName}
              />
            </Badge>
            <Typography variant="h5">{currentUserData.displayName}</Typography>
          </ProfileAvatarBox>
          <Box
            padding="2rem 1rem"
            sx={{ display: "flex", flexGrow: 1, width: "100%" }}
          >
            <Paper sx={{ width: "inherit" }} elevation={4}>
              <Stack padding={2} spacing={2}>
                <Box>
                  <Typography
                    variant="body1"
                    sx={{ color: theme.palette.default.blur }}
                  >
                    Name{" "}
                  </Typography>
                  <Typography sx={{ fontWeight: "bold" }}>
                    {currentUserData.displayName}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body1"
                    sx={{ color: theme.palette.default.blur }}
                  >
                    Email
                  </Typography>
                  <Typography sx={{ fontWeight: "bold" }}>
                    {userEmail}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="body1"
                    sx={{ color: theme.palette.default.blur }}
                  >
                    Sign-in method
                  </Typography>
                  <Typography sx={{ fontWeight: "bold" }}>
                    {signInMethod}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Box>
        </Box>
      )}
    </PersonalInfoBox>
  );
}
