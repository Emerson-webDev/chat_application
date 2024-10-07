import { Box } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";

import CallEndIcon from "@mui/icons-material/CallEnd";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import FlipCameraAndroidOutlinedIcon from '@mui/icons-material/FlipCameraAndroidOutlined';
import CameraFrontOutlinedIcon from '@mui/icons-material/CameraFrontOutlined';

import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import {
  userCollectionRef,
  videoCallCollectionRef,
} from "../../../../../firebase_config/firebase_config";
import { AuthContext } from "../../../../../useContext/AuthContext";
import { ChatUserContext } from "../../../../../useContext/ChatUserContext";
import { ActiveCallActionBox, LocalVideoBox } from "../../Theme/Theme";

import Draggable from "react-draggable";

export default function ActiveCall({
  open,
  cancelCall,
  localVideoRef,
  remoteVideoRef,
  socket,
  firstHangUpCall,
  secondHangUpCall,
  front,
  switchCamera,
  isMicOn,
  setIsMicOn,
  videoCamActive,
  setVideoCamActive,
  remoteStream,
}) {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatUserContext);

  const [chatId, setChatId] = useState(null);
  const [dataUserId, setDataUserId] = useState(null);
  const [remoteStreamLoaded, setRemoteStreamLoaded] = useState(false);
  

  const mute = () => {
    isMicOn ? setIsMicOn(false) : setIsMicOn(true);
    isMicOn
      ? (remoteStream.getTracks()[0].enabled = false)
      : (remoteStream.getTracks()[0].enabled = true);
  };


  const camActive = () => {
    videoCamActive ? setVideoCamActive(false) : setVideoCamActive(true);
    videoCamActive
      ? (remoteStream.getTracks()[1].enabled = false)
      : (remoteStream.getTracks()[1].enabled = true);
  };

  useEffect(() => {
    const videoCall = async () => {
      const unsubScribe = onSnapshot(
        doc(videoCallCollectionRef, currentUser.uid),
        (docSnap) => {
          try {
            if (docSnap.exists()) {
              const docData = docSnap.data();
              // console.log(docData);
              const dataChatId = Object.keys(docData)
                .filter((key) => {
                  return docData[key].callActiveState === true;
                })
                .join("");

              if (dataChatId) {
                const dataUserId =
                  docData[dataChatId].caller_uid === currentUser.uid
                    ? data.user.uid
                    : docData[dataChatId].callee_uid === currentUser.uid
                    ? docData[dataChatId].caller_uid
                    : currentUser.uid;

                setChatId(dataChatId);
                setDataUserId(dataUserId);
              }
            }
          } catch (error) {
            console.log(error);
          }
        }
      );

      return () => {
        unsubScribe();
      };
    };

    videoCall();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //when the component mount, the videoCallCollectionRef will updated
  useEffect(() => {
    const unsubscribe = async () => {
      try {
        if (chatId) {
          await updateDoc(doc(videoCallCollectionRef, currentUser.uid), {
            [chatId + ".callActiveState"]: false,
            [chatId + ".caller_uid"]: null,
            [chatId + ".callee_uid"]: null,
          });
        }
      } catch (error) {
        console.log(error);
      }
    };

    unsubscribe();
  }, [chatId, currentUser.uid, socket]);

  useEffect(() => {
    const handleUnload = async () => {
      try {
        // Emit user-disconnect event
        socket.current.emit("user-disconnect", currentUser.uid);

        await updateDoc(doc(userCollectionRef, currentUser.uid), {
          "status.video_call_state": null,
        });
      } catch (error) {
        console.log(error);
      }
    };

    // Add event listener for beforeunload
    window.addEventListener("beforeunload", handleUnload);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [chatId, currentUser.uid, socket]);

  useEffect(() => {
    const unsubScribe = onSnapshot(
      doc(userCollectionRef, currentUser.uid),
      (docSnap) => {
        try {
          if (docSnap.data().status.video_call_state === false) {
            //we triggered the secondHangupCall to the user who not made the
            //first end up call / hang up call
            if (chatId !== null) {
              secondHangUpCall(chatId);
            }
          }
        } catch (error) {
          console.log(error);
        }
      }
    );

    return () => {
      unsubScribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  const handleRemoteStreamLoaded = () => {
    setRemoteStreamLoaded(true);
  };


  return (
    <Box>
      <Modal
        open={open}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
        slots={{ backdrop: StyledBackdrop }}
      >
        <ModalContent sx={style}>
          <Box
            sx={{
              backgroundColor: "white",
              width: "inherit",
              height: "inherit",
            }}
          >
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              onLoadedData={handleRemoteStreamLoaded}
            />
            <Draggable bounds="parent">
              <LocalVideoBox>
                <video
                  ref={localVideoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{
                    width: "inherit",
                    height: "inherit",
                    objectFit: "inherit",
                  }}
                />
              </LocalVideoBox>
            </Draggable>
            <Box
              sx={{
                display: "grid",
                placeItems: "center",
                bottom: 0,
                position: "absolute",
                width: "inherit",
              }}
            >
              <Box
                sx={(theme) => ({
                  display: "flex",
                  justifyContent: "center",
                  gap: "2rem",
                  backgroundColor: theme.palette.default.primary,
                  borderRadius: 50,
                })}
              >
                {videoCamActive ? (
                  <ActiveCallActionBox onClick={() => camActive()}>
                    <VideocamIcon />
                  </ActiveCallActionBox>
                ) : (
                  <ActiveCallActionBox onClick={() => camActive()}>
                    <VideocamOffIcon />
                  </ActiveCallActionBox>
                )}

                {front ? (
                  <ActiveCallActionBox onClick={() => {switchCamera()}}>
                    <FlipCameraAndroidOutlinedIcon />
                  </ActiveCallActionBox>
                ) : (
                  <ActiveCallActionBox onClick={() => {switchCamera()}}>
                    <CameraFrontOutlinedIcon />
                  </ActiveCallActionBox>
                )}

                {isMicOn ? (
                  <ActiveCallActionBox onClick={() => mute()}>
                    <MicIcon />
                  </ActiveCallActionBox>
                ) : (
                  <ActiveCallActionBox onClick={() => mute()}>
                    <MicOffIcon />
                  </ActiveCallActionBox>
                )}

                {remoteStreamLoaded ? (
                  <ActiveCallActionBox
                    onClick={() => {
                      firstHangUpCall(chatId, dataUserId);
                      // hangUpHandler();
                      console.log("hangup");
                    }}
                  >
                    <CallEndIcon />
                  </ActiveCallActionBox>
                ) : (
                  <ActiveCallActionBox
                    onClick={() => {
                      cancelCall(chatId, dataUserId);
                      console.log("cancel");
                    }}
                  >
                    <CallEndIcon />
                  </ActiveCallActionBox>
                )}
              </Box>
            </Box>
          </Box>
        </ModalContent>
      </Modal>
    </Box>
  );
}

const Backdrop = React.forwardRef((props, ref) => {
  const { open, className, ...other } = props;
  return (
    <div
      className={clsx({ "MuiBackdrop-open": open }, className)}
      ref={ref}
      {...other}
    />
  );
});

Backdrop.propTypes = {
  className: PropTypes.string.isRequired,
  open: PropTypes.bool,
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100vw",
  height: "100vh",
};

const ModalContent = styled("div")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    overflow: hidden;
    background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === "dark" ? "rgb(0 0 0 / 0.5)" : "rgb(0 0 0 / 0.2)"};
    color: ${theme.palette.mode === "dark" ? grey[50] : grey[900]};

    & .modal-title {
      margin: 0;
      line-height: 1.5rem;
      margin-bottom: 8px;
    }

    & .modal-description {
      margin: 0;
      line-height: 1.5rem;
      font-weight: 400;
      color: ${theme.palette.mode === "dark" ? grey[400] : grey[800]};
      margin-bottom: 4px;
    }
  `
);
