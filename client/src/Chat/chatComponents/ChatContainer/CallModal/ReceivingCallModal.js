import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import { Avatar, Box, Typography } from "@mui/material";
import {
  AnswerCallIconButton,
  BootstrapTooltip,
  CallIconButton,
  AnswerCallRipple,
} from "../Theme/Theme";

import CallEndIcon from "@mui/icons-material/CallEnd";
import CallIcon from "@mui/icons-material/Call";
import { doc, onSnapshot } from "firebase/firestore";
import {
  userCollectionRef,
  videoCallCollectionRef,
} from "../../../../firebase_config/firebase_config";
import { AuthContext } from "../../../../useContext/AuthContext";

export default function ReceivingCallModal({
  setOpen,
  open,
  answerCall,
  rejectCall,
  setReceivingCall,
}) {
  const { currentUser } = useContext(AuthContext);

  const [chatId, setChatId] = useState(null);
  const [callerID, setCallerID] = useState(null);
  const [callerData, setCallerData] = useState(null);

  useEffect(() => {
    const videoCall = async () => {
      try {
        const unsubScribe = onSnapshot(
          doc(videoCallCollectionRef, currentUser.uid),
          (docSnap) => {
            if (docSnap.exists()) {
              const docData = docSnap.data();
              // console.log(docData);
              const dataChatId = Object.keys(docData)
                .filter((key) => {
                  return docData[key].callActiveState === true;
                })
                .join("");
                //this dataChatKey is the same id in dataChatId, I'd seperate it for if the caller cancelled their call.
              const dataChatkey = Object.keys(docData)
                .filter((key) => {
                  return docData[key].callActiveState === "cancelled";
                })
                .join("");

              if (dataChatkey) {
                if (docData[dataChatkey].callActiveState === "cancelled") {
                  console.log(docData);
                  setOpen(false);
                  setReceivingCall(false);
                }  
              }
              if (dataChatId) {
                setCallerID(docData[dataChatId].caller_uid);
              }

              setChatId(dataChatId);
            }
          }
        );

        return () => {
          // Cleanup and remove the event listener when the component is unmounted
          unsubScribe();
        };
      } catch (error) {
        console.log(error);
      }
    };

    videoCall();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser.uid, setOpen, setReceivingCall]);

  useEffect(() => {
    const CallerName = async () => {
      try {
        if (callerID) {
          const unsubScribe = onSnapshot(
            doc(userCollectionRef, callerID),
            (docSnap) => {
              if (docSnap.exists()) {
                setCallerData(docSnap.data());
              }
            }
          );

          return () => {
            unsubScribe();
          };
        }
      } catch (error) {
        console.log(error);
      }
    };

    CallerName();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callerID]);

  return (
    <Box>
      {callerData && (
        <Modal
          open={open}
          // onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
          slots={{ backdrop: StyledBackdrop }}
        >
          <ModalContent sx={style}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <Avatar
                alt={callerData.displayName}
                src={callerData.photoURL}
                sx={{
                  width: 100,
                  height: 100,
                  //   fontSize: "1rem",
                }}
              />

              <Box sx={{ textAlign: "center" }}>
                <Typography fontWeight={700} style={{ fontSize: "1.25rem" }}>
                  {callerData.displayName}
                </Typography>
                <Typography fontWeight={600} style={{ fontSize: "1rem" }}>
                  is calling...
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-evenly",
                width: "100%",
              }}
            >
              <CallIconButton
                onClick={() => rejectCall(chatId, callerData.uid)}
              >
                <BootstrapTooltip title="Reject video call" placement="bottom">
                  <CallEndIcon />
                </BootstrapTooltip>
              </CallIconButton>
              <AnswerCallRipple>
                <AnswerCallIconButton onClick={() => answerCall(chatId)}>
                  <BootstrapTooltip
                    title="Answer video call"
                    placement="bottom"
                  >
                    <CallIcon />
                  </BootstrapTooltip>
                </AnswerCallIconButton>
              </AnswerCallRipple>
            </Box>
          </ModalContent>
        </Modal>
      )}
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
  width: 250,
  height: 280,
};

const ModalContent = styled("div")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    // gap: 8px;
    overflow: hidden;
    background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === "dark" ? "rgb(0 0 0 / 0.5)" : "rgb(0 0 0 / 0.2)"};
    padding: 24px;
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
