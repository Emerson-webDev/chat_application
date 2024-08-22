import React, { useContext, useEffect, useState } from "react";

import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import GroupsIcon from "@mui/icons-material/Groups";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NightlightIcon from "@mui/icons-material/Nightlight";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { BottomNavigation, NotificationBadge, Paper } from "../Theme/Theme";
import {
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { AuthContext } from "../../../../useContext/AuthContext";
import { NotificationAvatar } from "../../ChatContainer/Theme/Theme";
import { ChatUserContext } from "../../../../useContext/ChatUserContext";
import { baseURL } from "../../../../API/API";
import { io } from "socket.io-client";
import { ActiveComponentContext } from "../../../../useContext/ActiveComponentContext";
import { ModeContext } from "../../../../useContext/ModeContext";
import { doc, onSnapshot } from "firebase/firestore";

import {
  friendRequestCollectionRef,
  userChatCollectionRef,
  userNotificationsCollectionRef,
} from "../../../../firebase_config/firebase_config";

export default function NavigationBottomBar({ iconClickedHandler }) {
  const { signOut, currentUser } = useContext(AuthContext);
  const { mode, dispatchMode } = useContext(ModeContext);
  const { activeComponent, dispatchActiveComponent } = useContext(
    ActiveComponentContext
  );

  const [newMessageCount, setNewMessageCount] = useState(0);
  const [newRequestCount, setNewRequestCount] = useState(0);
  const [newNotifCount, setNewNotifCount] = useState(0);

  const [notificationData, setNotificationData] = useState(null);

  const { dispatch } = useContext(ChatUserContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const isMediumUp = useMediaQuery((theme) => theme.breakpoints.up("600"));

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const modeHandler = () => {
    const newMode = mode === "light" ? "dark" : "light";
    dispatchMode({ type: "SET_MODE", payload: newMode });
    localStorage.setItem("mode", newMode);
  };

  const handleIconClick = (activeIcon) => {
    // iconClickedHandler(activeIconId);
    dispatchActiveComponent({ type: "ACTIVE_COMPONENT", payload: activeIcon });
  };

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
      });
    }

    return;
  };

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
    if (isMediumUp) {
      handleClose();
    }
  }, [isMediumUp]);

  // Map active component to BottomNavigation index
  const componentIndex = {
    Chat: 0,
    Friend: 1,
    Notification: 3,
    Profile: 4,
  };

  return (
    <Paper elevation={3}>
      <React.Fragment>
        <BottomNavigation
          showLabels
          value={componentIndex[activeComponent] || 0}
        >
          <BottomNavigationAction
            label="Chat"
            icon={
              <NotificationBadge
                color="secondary"
                badgeContent={newMessageCount}
              >
                <ChatBubbleIcon />
              </NotificationBadge>
            }
            onClick={() => {
              handleIconClick("Chat");
            }}
            selected={activeComponent === "Chat"}
          />
          <BottomNavigationAction
            label="Friends"
            icon={
              <NotificationBadge
                color="secondary"
                badgeContent={newRequestCount}
              >
                <GroupsIcon />
              </NotificationBadge>
            }
            onClick={() => {
              handleIconClick("Friend");
            }}
            selected={activeComponent === "Friend"}
          />
          <BottomNavigationAction
            label="Mode"
            icon={
              mode === "light" ? <LightModeOutlinedIcon /> : <NightlightIcon />
            }
            onClick={modeHandler}
          />
          <BottomNavigationAction
            label="Notifications"
            icon={
              <NotificationBadge color="secondary" badgeContent={newNotifCount}>
                <NotificationsIcon />
              </NotificationBadge>
            }
            onClick={() => {
              handleIconClick("Notification");
              readNotification()
            }}
            selected={activeComponent === "Notification"}
          />
          <BottomNavigationAction
            label="Account"
            icon={<AccountCircleIcon />}
            onClick={handleClick}
            selected={activeComponent === "Profile"}
          />
        </BottomNavigation>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem
            onClick={() => {
              handleClose();
              handleIconClick("Profile");
            }}
          >
            <NotificationAvatar
              alt={currentUser.displayName || currentUser.reloadUserInfo.screenName}
              src={currentUser.photoURL}
              onClick={() => handleClick("Profile")}
            />
            <Typography ml={".5rem"}>Me</Typography>
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              handleClose();
              io(baseURL).emit("user-disconnect", currentUser.uid);
              signOut();
              dispatch({ type: "RESET_STATE" });
            }}
          >
            <ListItemIcon>
              <ExitToAppIcon fontSize="medium" />
            </ListItemIcon>
            <Typography>Sign out</Typography>
          </MenuItem>
        </Menu>
      </React.Fragment>
    </Paper>
  );
}
