// import Chatbox from "./Chatbox";
import {
  Box,
  Divider,
  Drawer,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import {
  AccountIcon,
  AppHeader,
  AppStyledMenu,
  Avatar,
  BootstrapTooltip,
  DeleteIcon,
  IconButton,
  Paper,
  TypographyActive,
  TypographyOffline,
} from "./Theme/Theme";
import React, { useContext, useEffect, useState } from "react";
import { friendRequestCollectionRef } from "../../../firebase_config/firebase_config";
import { doc, onSnapshot } from "firebase/firestore";
import { ChatUserContext } from "../../../useContext/ChatUserContext";
import RequestAction from "./Request_Action/RequestAction";
import UserFile from "../UserFile/UserFile";
import { AuthContext } from "../../../useContext/AuthContext";

export default function Appbar({
  handleClick,
  anchorEl,
  openList,
  handleClose,
  dataUser,
  friendRequestHandler,
  onCancel,
  allPeerData,
  createCall,
  onClickVideoHandler,
}) {
  const { currentUser } = useContext(AuthContext);
  const { data, dispatch } = useContext(ChatUserContext);

  const [requestBy, setRequestBy] = useState(null);
  const [requestTo, setRequestTo] = useState(null);
  const [requestStatus, setRequestStatus] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);

  const [remoteUserPeerId, setRemoteUserPeerId] = useState(null);

  const dataChatId = data.chatId;

  // check the request_status if friend request is pending.
  useEffect(() => {
    const requestState = () => {
      try {
        const unsubscribeRequest = onSnapshot(
          doc(friendRequestCollectionRef, currentUser.uid),
          (docSnap) => {
            if (docSnap.exists()) {
              const request = docSnap.data();
              if (request.hasOwnProperty(data.chatId)) {
                Object.keys(request).forEach((key) => {
                  if (data.chatId === key) {
                    setRequestTo(request[key].requestUID_to);
                    setRequestBy(request[key].requestUID_by);
                    setRequestStatus(request[key].request_state);
                  }
                });
              } else {
                setRequestTo(null);
                setRequestBy(null);
                setRequestStatus(null);
              }
            } else {
              setRequestTo(null);
              setRequestBy(null);
              setRequestStatus(null);
            }
          }
        );

        return () => unsubscribeRequest();
      } catch (error) {
        console.log(error);
      }
    };

    requestState();
  }, [requestStatus, currentUser.uid, data.chatId]);

  const profileInfoHandler = () => {
    setOpenProfile(true);
  };

  const closeProfile = () => {
    setOpenProfile(false);
  };

  const closeConversation = () => {
    dispatch({ type: "RESET_STATE" });
  };

  useEffect(() => {
    try {
      if (data.user.uid) {
        setRemoteUserPeerId(allPeerData[data.user.uid]);
      }
    } catch (error) {
      console.log(error);
    }
  }, [data.user.uid, allPeerData]);

  return (
    <Box>
      <Paper elevation={1}>
        <AppHeader>
          <Box>
            <IconButton onClick={closeConversation}>
              <ArrowBackIcon />
            </IconButton>
          </Box>
          <Avatar alt={dataUser.displayName} src={dataUser.photoURL} />
          <Stack>
            <Typography
              variant="h5"
            >
              {dataUser.displayName}
            </Typography>
            {dataUser.status &&
              (dataUser.status.state === "online" ? (
                <TypographyActive variant="body2"  sx={(theme) => ({color: theme.palette.maincolor.mainwhite})}>Active now</TypographyActive>
              ) : (
                <TypographyOffline variant="body2" sx={(theme) => ({color: theme.palette.maincolor.mainwhite})}>
                  {dataUser.status.state}
                </TypographyOffline>
              ))}
          </Stack>
        </AppHeader>

        <Box sx={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
          {dataChatId === data.chatId && requestStatus === null ? (
            <IconButton onClick={friendRequestHandler}>
              <BootstrapTooltip title="Add Friend" placement="bottom">
                <PersonAddIcon />
              </BootstrapTooltip>
            </IconButton>
          ) : (
            <RequestAction
              dataChatId={dataChatId}
              requestBy={requestBy}
              requestTo={requestTo}
              requestStatus={requestStatus}
              friendRequestHandler={friendRequestHandler}
            />
          )}

          {dataUser.status &&
            (dataUser.status.state === "online" &&
            dataUser.status.video_call_state !== "active" ? (
              <IconButton onClick={() => createCall(remoteUserPeerId)}>
                <BootstrapTooltip title="Video Call" placement="bottom">
                  <VideoCallIcon />
                </BootstrapTooltip>
              </IconButton>
            ) : (
              <IconButton disabled>
                <BootstrapTooltip
                  title="Video Call Disabled"
                  placement="bottom"
                >
                  <VideocamOffIcon />
                </BootstrapTooltip>
              </IconButton>
            ))}

          <IconButton
            id="demo-customized-button"
            aria-controls={openList ? "demo-customized-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openList ? "true" : undefined}
            variant="contained"
            onClick={handleClick}
            sx={{ width: "40px" }}
          >
            <MoreVertOutlinedIcon fontSize="small" />
          </IconButton>
          <AppStyledMenu
            id="demo-customized-menu"
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",
            }}
            anchorEl={anchorEl}
            open={openList}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                profileInfoHandler();
              }}
              disableRipple
            >
              <AccountIcon />
              <Typography>User file</Typography>
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={handleClose} disableRipple>
              <DeleteIcon />
              <Typography>Delete</Typography>
            </MenuItem>
          </AppStyledMenu>
        </Box>
      </Paper>
      {
        <React.Fragment>
          <Drawer anchor="right" open={openProfile} onClose={closeProfile}>
            {<UserFile closeProfile={closeProfile} openProfile={openProfile} />}
          </Drawer>
        </React.Fragment>
      }
      {/* {console.log(open)} */}
    </Box>
  );
}
