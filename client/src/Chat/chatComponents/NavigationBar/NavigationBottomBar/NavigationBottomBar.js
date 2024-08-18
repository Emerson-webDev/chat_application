import React, { useContext, useEffect, useState } from "react";

import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import GroupsIcon from "@mui/icons-material/Groups";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NightlightIcon from "@mui/icons-material/Nightlight";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { BottomNavigation, Paper } from "../Theme/Theme";
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

export default function NavigationBottomBar({ iconClickedHandler }) {
  const { signOut, currentUser } = useContext(AuthContext);
  const { mode, dispatchMode } = useContext(ModeContext);
  const { activeComponent, dispatchActiveComponent } = useContext(
    ActiveComponentContext
  );
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
            icon={<ChatBubbleIcon />}
            onClick={() => {handleIconClick("Chat")}}
            selected={activeComponent === "Chat"}
          />
          <BottomNavigationAction
            label="Friends"
            icon={<GroupsIcon />}
            onClick={() => {handleIconClick("Friend")}}
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
            icon={<NotificationsIcon />}
            onClick={() => {handleIconClick("Notification")}}
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
              alt={currentUser.displayName}
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
