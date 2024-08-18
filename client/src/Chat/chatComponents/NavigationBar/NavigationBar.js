import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../useContext/AuthContext";

import { ChatUserContext } from "../../../useContext/ChatUserContext";
import {
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Fade,
  IconButton,
  List,
  ListItem,
} from "@mui/material";

import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import GroupsIcon from "@mui/icons-material/Groups";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NightlightIcon from "@mui/icons-material/Nightlight";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import {
  CustomWidthTooltip,
  Drawer,
  ListIcon,
  ListitemButton,
  LogoutButton,
  NavBox,
} from "./Theme/Theme";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import {
  friendRequestCollectionRef,
  userChatCollectionRef,
  userCollectionRef,
  userNotificationsCollectionRef,
} from "../../../firebase_config/firebase_config";

import chatlogo from "../../../Assets/logo.webp";
import { NotificationBadge } from "../ChatContainer/Theme/Theme";
import { baseURL } from "../../../API/API";
import { io } from "socket.io-client";
import { ModeContext } from "../../../useContext/ModeContext";
import { ActiveComponentContext } from "../../../useContext/ActiveComponentContext";

export default function NavigationBar({ iconClickedHandler, activeComponent }) {
  const { signOut, currentUser } = useContext(AuthContext);
  const { mode, dispatchMode } = useContext(ModeContext)
  const { dispatchActiveComponent } = useContext(ActiveComponentContext)
  const { dispatch } = useContext(ChatUserContext);

  const [currentPhoto, setCurrentPhoto] = useState(currentUser.photoURL);

  const [newMessageCount, setNewMessageCount] = useState(0);
  const [newRequestCount, setNewRequestCount] = useState(0);
  const [newNotifCount, setNewNotifCount] = useState(0);

  const [notificationData, setNotificationData] = useState(null);

  const handleIconClick = (activeIconId) => {
    // iconClickedHandler(activeIconId);
    dispatchActiveComponent({type : "ACTIVE_COMPONENT", payload : activeIconId})
  };

  // userChatCollectionRef
  // count new message that not already open
  useEffect(() => {
    const countUnreadMessage = () => {
      const unsubscribe = onSnapshot(
        doc(userChatCollectionRef, currentUser.uid),
        (docSnap) => {
          try {
            if (docSnap.exists()) {
              const fetchData = docSnap.data();
              const messages = Object.values(fetchData) || [];

              // Count unread messages
              const unreadMessageCount = messages.filter(
                (message) => !message.is_Read
              ).length;
              setNewMessageCount(unreadMessageCount);
            }
          } catch (error) {
            console.log(error);
          }
        }
      );
      return () => unsubscribe();
    };
    countUnreadMessage();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //count notification in list that not already open
  useEffect(() => {
    const countNotification = () => {
      const unsubscribe = onSnapshot(
        doc(userNotificationsCollectionRef, currentUser.uid),
        (docSnap) => {
          try {
            if (docSnap.exists()) {
              const fetchData = docSnap.data();
              const newNotif = Object.values(fetchData).filter(
                (notif) => !notif.is_Read
              ).length;
              setNewNotifCount(newNotif);
              setNotificationData(fetchData);
            }
          } catch (error) {}
        }
      );
      return () => unsubscribe();
    };
    countNotification();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //friendRequestCollectionRef
  useEffect(() => {
    const fetchFriendRequest = () => {
      const unsubscribe = onSnapshot(
        doc(friendRequestCollectionRef, currentUser.uid),
        (docSnap) => {
          try {
            if (docSnap.exists()) {
              const requestCount = Object.values(docSnap.data())?.filter(
                (request) =>
                  request.request_state === "pending" &&
                  request.requestUID_by !== currentUser.uid
              ).length;
              setNewRequestCount(requestCount);
            }
          } catch (error) {
            console.log(error);
          }
        }
      );

      return () => unsubscribe();
    };
    fetchFriendRequest();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const profilePhoto = () => {
      const unsubscribe = onSnapshot(
        doc(userCollectionRef, currentUser.uid),
        (docSnap) => {
          try {
            setCurrentPhoto(currentUser.photoURL);
          } catch (error) {
            console.log(error);
          }
        }
      );
      return () => unsubscribe();
    };
    profilePhoto();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log(me);
  const modeHandler = () => {
    const newMode = mode === "light" ? "dark" : "light";
    dispatchMode({ type: "SET_MODE", payload: newMode });
    localStorage.setItem("mode", newMode);
  };

  const readNotification = () => {
    if (notificationData !== null) {
      Object.keys(notificationData).forEach(async (key) => {
        if (!notificationData[key].is_Read) {
          await updateDoc(
            doc(userNotificationsCollectionRef, currentUser.uid),
            {
              [key]: {
                ...notificationData[key],
                is_Read: true,
              },
            }
          );
        }
        console.log(notificationData);
      });
    }

    return;
  };

  const buttonList = [
    {
      icon: (
        <NotificationBadge color="secondary" badgeContent={newMessageCount}>
          <ChatBubbleIcon onClick={() => iconClickedHandler("Chat")} />
        </NotificationBadge>
      ),
      id: "Chat",
    },
    {
      icon: (
        <NotificationBadge color="secondary" badgeContent={newRequestCount}>
          <GroupsIcon onClick={() => iconClickedHandler("Friend")} />
        </NotificationBadge>
      ),
      id: "Friend",
    },
    {
      icon: (
        <NotificationBadge color="secondary" badgeContent={newNotifCount}>
          <NotificationsIcon
            onClick={() => {
              iconClickedHandler("Notification");
              readNotification();
            }}
          />
        </NotificationBadge>
      ),
      id: "Notification",
    },
  ];

  return (
    <NavBox>
      <CssBaseline />
      <Drawer variant="permanent" anchor="left">
        <Avatar
          src={chatlogo}
          alt="chat-logo"
          sx={{ width: 89, height: 89, padding: 2 }}
        />
        {/* <Toolbar> */}
        <Divider sx={{ borderColor: "outlined.blurredoutlined" }} />

        <Box
          py={2}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            flexGrow: 1,
          }}
        >
          <List
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            {buttonList.map(({ icon, id }) => (
              <ListItem
                disablePadding
                key={id}
                sx={{ borderRadius: "50%", width: "40px" }}
              >
                <ListitemButton
                  active={activeComponent === id ? 1 : 0}
                  onClick={() => handleIconClick(id)}
                >
                  <ListIcon
                    sx={{ justifyContent: "center" }}
                    active={activeComponent === id ? 1 : 0}
                  >
                    <CustomWidthTooltip
                      title={id}
                      placement={"right"}
                      TransitionComponent={Fade}
                      TransitionProps={{ timeout: 600 }}
                    >
                      {icon}
                    </CustomWidthTooltip>
                  </ListIcon>
                </ListitemButton>
              </ListItem>
            ))}
          </List>

          <Box
            mb={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <CustomWidthTooltip
              title={mode === "light" ? `${mode} mode` : `${mode} mode`}
              placement={"right"}
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
            >
              <IconButton onClick={modeHandler}>
                {mode === "light" ? (
                  <LightModeOutlinedIcon sx={{color : "default.blur"}}/>
                ) : (
                  <NightlightIcon />
                )}
              </IconButton>
            </CustomWidthTooltip>

            <CustomWidthTooltip
              title="Profile"
              placement={"right"}
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
            >
              <Avatar
                alt={currentUser.displayName}
                src={currentPhoto}
                onClick={() => handleIconClick("Profile")}
              />
            </CustomWidthTooltip>

            <CustomWidthTooltip
              title="Sign Out"
              placement={"right"}
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 600 }}
            >
              <LogoutButton
                fontSize="medium"
                onClick={() => {
                  io(baseURL).emit("user-disconnect", currentUser.uid);
                  signOut();
                  dispatch({ type: "RESET_STATE" });
                }}
              />
            </CustomWidthTooltip>
          </Box>
        </Box>
      </Drawer>
    </NavBox>
  );
}
